"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { api, FALLBACK_PRODUCTS } from "../../services/api";

// Product Dataset reference to resolve wishlisted IDs (fallback for 1..8)
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Cute Teddy Bear",
    category: "Soft Toys",
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviews: 320,
    img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
    pastelBg: "from-pink-100 to-rose-50"
  },
  {
    id: 2,
    name: "Remote Control Car",
    category: "Cars & Vehicles",
    price: 1299,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 210,
    img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80",
    pastelBg: "from-sky-100 to-blue-50"
  },
  {
    id: 3,
    name: "Building Blocks Set",
    category: "Building Blocks",
    price: 799,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 180,
    img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80",
    pastelBg: "from-emerald-100 to-teal-50"
  },
  {
    id: 4,
    name: "Princess Doll House",
    category: "Dolls & Playsets",
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 156,
    img: "https://images.unsplash.com/photo-1558066126-25816c278fb1?w=500&q=80",
    pastelBg: "from-purple-100 to-pink-50"
  },
  {
    id: 5,
    name: "Art & Craft Kit",
    category: "Arts & Crafts",
    price: 499,
    originalPrice: 799,
    rating: 4.5,
    reviews: 98,
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    pastelBg: "from-purple-100 to-indigo-50"
  },
  {
    id: 6,
    name: "Kids Scooter",
    category: "Outdoor Toys",
    price: 1599,
    originalPrice: 2499,
    rating: 4.8,
    reviews: 143,
    img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80",
    pastelBg: "from-amber-100 to-orange-50"
  },
  {
    id: 7,
    name: "Educational Puzzle",
    category: "Educational Toys",
    price: 699,
    originalPrice: 999,
    rating: 4.7,
    reviews: 201,
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    pastelBg: "from-sky-100 to-teal-50"
  },
  {
    id: 8,
    name: "Doctor Play Set",
    category: "Baby Toys",
    price: 899,
    originalPrice: 1299,
    rating: 4.6,
    reviews: 112,
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80",
    pastelBg: "from-pink-100 to-sky-50"
  }
];

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isMounted } = useCart();
  const [mounted, setMounted] = useState(false);
  const [catalog, setCatalog] = useState<any[]>(PRODUCTS_DATA);
  const [loading, setLoading] = useState(true);

  // Client hydration check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch live products catalog from backend & fallback
  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        const liveProducts = await api.getProducts();
        if (!active) return;

        const map = new Map<string, any>();

        // 1. Static mock dataset (for numerical IDs 1..8)
        PRODUCTS_DATA.forEach((p) => {
          map.set(String(p.id), {
            id: String(p.id),
            name: p.name,
            category: p.category,
            price: p.price,
            originalPrice: p.originalPrice,
            rating: p.rating,
            reviews: p.reviews,
            img: p.img,
            pastelBg: p.pastelBg || "from-pink-50 to-rose-50",
          });
        });

        // 2. Fallback products dataset
        FALLBACK_PRODUCTS.forEach((p) => {
          map.set(String(p.id), {
            id: String(p.id),
            name: p.name,
            category: typeof p.category === "string" ? p.category : (p.category as any)?.name || "Toys",
            price: p.salePrice || p.price,
            originalPrice: p.basePrice || p.price,
            rating: p.rating || 4.8,
            reviews: p.salesCount || 120,
            img: p.image || p.images?.[0]?.url || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
            pastelBg: "from-sky-50 to-pink-50",
          });
        });

        // 3. Live API products (includes vendor products and approved toys)
        if (Array.isArray(liveProducts) && liveProducts.length > 0) {
          liveProducts.forEach((p: any) => {
            map.set(String(p.id), {
              id: String(p.id),
              name: p.name,
              category: typeof p.category === "string" ? p.category : p.category?.name || "Toys",
              price: p.salePrice || p.price || p.basePrice,
              originalPrice: p.basePrice || p.originalPrice || p.price,
              rating: p.rating || 4.8,
              reviews: p.salesCount || p.reviews || 120,
              img: p.image || p.img || p.images?.[0]?.url || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
              pastelBg: "from-amber-50 to-rose-50",
            });
          });
        }

        setCatalog(Array.from(map.values()));
      } catch (err) {
        console.error("Failed to load catalog for wishlist:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  // Filter wishlisted items by matching ID (supports string IDs, number IDs, and objects)
  const wishlistedProducts = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return [];

    const result: any[] = [];
    const seen = new Set<string>();

    wishlist.forEach((rawItem) => {
      const idStr =
        rawItem !== null && typeof rawItem === "object"
          ? String((rawItem as any).id ?? (rawItem as any)._id ?? "")
          : String(rawItem);

      if (!idStr || idStr === "[object Object]" || idStr === "undefined" || seen.has(idStr)) {
        return;
      }

      // Check if product exists in unified catalog
      const found = catalog.find((p) => String(p.id) === idStr);
      if (found) {
        seen.add(idStr);
        result.push(found);
      } else if (rawItem !== null && typeof rawItem === "object" && (rawItem as any).name) {
        // Direct product object in storage
        seen.add(idStr);
        result.push({
          id: idStr,
          name: (rawItem as any).name,
          category:
            typeof (rawItem as any).category === "string"
              ? (rawItem as any).category
              : (rawItem as any).category?.name || "Toys",
          price: (rawItem as any).salePrice || (rawItem as any).price || 999,
          originalPrice: (rawItem as any).basePrice || (rawItem as any).originalPrice || 1299,
          rating: (rawItem as any).rating || 4.8,
          reviews: (rawItem as any).reviews || (rawItem as any).salesCount || 100,
          img: (rawItem as any).img || (rawItem as any).image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
          pastelBg: "from-pink-50 to-purple-50",
        });
      }
    });

    return result;
  }, [wishlist, catalog]);

  // Prevent SSR Hydration Mismatch
  if (!mounted || !isMounted) {
    return (
      <div className="w-full bg-[#FAF9F6] min-h-[70vh] py-12 px-4 flex items-center justify-center font-sans">
        <div className="text-center font-bold text-slate-500">Loading Wishlist...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-3">
              My Wishlist <Heart size={30} className="text-pink-500 fill-pink-500" />
            </h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">
              You have <span className="text-pink-500 font-extrabold">{wishlistedProducts.length}</span> saved toys in your wishlist.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {wishlistedProducts.length > 0 && (
              <button
                onClick={() => {
                  wishlistedProducts.forEach((prod) => addToCart(prod as any));
                }}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag size={14} /> Add All to Cart
              </button>
            )}
            <Link href="/products" className="text-sm font-bold text-pink-500 hover:underline flex items-center gap-1">
              Explore More Toys &rarr;
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {!loading && wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200/80">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Your Wishlist is Empty</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Save your favorite toys by tapping the heart icon on any product card!
            </p>
            <Link
              href="/products"
              className="bg-pink-500 text-white px-8 py-3 rounded-full font-black text-sm shadow-md hover:bg-pink-600 transition-colors inline-block"
            >
              Discover Toys Now &rarr;
            </Link>
          </div>
        ) : (
          /* Wishlisted Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistedProducts.map((prod) => {
                const orig = prod.originalPrice || prod.price;
                const discountPct = orig > prod.price ? Math.round(((orig - prod.price) / orig) * 100) : 0;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={prod.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                  >
                    {/* Image Box */}
                    <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${prod.pastelBg || "from-pink-50 to-rose-50"} p-3 flex items-center justify-center`}>
                      <Link href={`/products/${prod.id}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={prod.img}
                          alt={prod.name}
                          className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => toggleWishlist(prod.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-md cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>

                      {discountPct > 0 && (
                        <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-pink-500 uppercase">{prod.category}</span>
                        <Link href={`/products/${prod.id}`}>
                          <h3 className="font-black text-slate-800 text-base mb-1.5 line-clamp-1 hover:text-pink-600 transition-colors">
                            {prod.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 text-amber-400 font-black text-xs mb-3">
                          <Star size={12} fill="currentColor" />
                          <span>{prod.rating}</span>
                          <span className="text-slate-400 font-normal">({prod.reviews})</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between mb-4">
                          <div>
                            <span className="text-lg font-black text-slate-900">₹{prod.price}</span>
                            {orig > prod.price && (
                              <span className="text-xs text-slate-400 line-through ml-1.5">₹{orig}</span>
                            )}
                          </div>
                          {discountPct > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              Save ₹{orig - prod.price}
                            </span>
                          )}
                        </div>

                        <button 
                          onClick={() => addToCart(prod as any)}
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <ShoppingBag size={14} /> Move to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
