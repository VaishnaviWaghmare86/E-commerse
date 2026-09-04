"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  img: string;
  category: string;
  brand: string;
}

interface CartItem extends ProductItem {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  toggleWishlist: (id: number) => void;
  cartCount: number;
  wishlistCount: number;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  isMounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Always initialize to [] on both Server & Client initial render to prevent Hydration Mismatch
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage ONCE after client component mounts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("toyjoy_cart");
      const savedWishlist = localStorage.getItem("toyjoy_wishlist");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    } finally {
      setIsMounted(true);
    }
  }, []);

  // Sync state changes to LocalStorage only AFTER mount
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("toyjoy_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("toyjoy_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const addToCart = (product: ProductItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    showToast(`Added "${product.name}" to your cart! 🛍️`);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast("Removed item from Wishlist");
        return prev.filter((item) => item !== id);
      } else {
        showToast("Added item to Wishlist ❤️");
        return [...prev, id];
      }
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        cartCount,
        wishlistCount,
        toastMessage,
        setToastMessage,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
