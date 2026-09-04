"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount, isMounted } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  // Prevent SSR Hydration Mismatch
  if (!mounted || !isMounted) {
    return (
      <div className="w-full bg-[#FAF9F6] min-h-[70vh] py-12 px-4 flex items-center justify-center font-sans">
        <div className="text-center font-bold text-slate-500">Loading Shopping Cart...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Shopping Cart 🛍️</h1>
        <p className="text-slate-500 text-sm font-semibold mb-8">
          You have <span className="text-pink-500 font-extrabold">{cartCount}</span> items in your cart.
        </p>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Your Cart is Empty</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Looks like you haven&apos;t added any toys yet! Explore our catalog and find something magical.
            </p>
            <Link href="/shop" className="bg-pink-500 text-white px-8 py-3 rounded-full font-black text-sm shadow-md hover:bg-pink-600 transition-colors inline-block">
              Start Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-4">
                  <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-slate-50 flex-shrink-0" />
                  
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mb-2">₹{item.price}</p>
                    
                    <div className="flex items-center gap-2 bg-slate-100 w-fit rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-600 hover:text-pink-500 p-0.5">
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-black px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-600 hover:text-pink-500 p-0.5">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-slate-900 text-base block mb-2">
                      ₹{item.price * item.quantity}
                    </span>
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-fit">
              <h2 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-slate-100">Order Summary</h2>
              
              <div className="space-y-3 text-sm font-semibold text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-black text-emerald-600">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-pink-500 font-bold">Add ₹{999 - subtotal} more for FREE shipping!</p>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-pink-500">₹{grandTotal}</span>
                </div>
              </div>

              <button 
                onClick={() => alert("Proceeding to checkout! 🎉")}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3.5 rounded-full font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
