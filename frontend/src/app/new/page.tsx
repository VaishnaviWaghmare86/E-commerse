"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Heart, Eye, Sparkles, Filter, SlidersHorizontal, ArrowRight, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

const NEW_ARRIVALS_DATA = [
  {
    id: 101,
    name: "Speedster Remote Control Car",
    category: "Cars & Vehicles",
    brand: "Hot Wheels",
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 42,
    img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80",
    badge: "NEW",
    pastelBg: "from-sky-100 to-blue-50"
  },
  {
    id: 102,
    name: "Baby Musical Xylophone & Drum Toy",
    category: "Baby Toys",
    brand: "Fisher-Price",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 29,
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80",
    badge: "NEW",
    pastelBg: "from-pink-100 to-sky-50"
  },
  {
    id: 103,
    name: "Creative Art & Craft Painting Kit",
    category: "Arts & Crafts",
    brand: "Funskool",
    price: 499,
    originalPrice: 799,
    rating: 4.7,
    reviews: 35,
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    badge: "NEW",
    pastelBg: "from-purple-100 to-indigo-50"
  }
];

function NewArrivalsInner() {
  const { addToCart, toggleWishlist, isInWishlist, isMounted } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Attempt fetching live data from Express Backend API
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const approved = data.filter((item: any) => (item.status === "APPROVED" || item.status === "Active") && item.isActive !== false);
          // Strictly show only products marked isNewArrival === true
          const tagged = approved.filter((item: any) => Boolean(item.isNewArrival));

          const pastelBgs = [
            "from-sky-100 to-blue-50",
            "from-pink-100 to-rose-50",
            "from-purple-100 to-pink-50",
            "from-amber-100 to-yellow-50",
            "from-emerald-100 to-teal-50",
            "from-orange-100 to-amber-50"
          ];

          const formatted = tagged.map((item: any, idx: number) => ({
            id: item.id,
            name: item.name,
            category: typeof item.category === "string" ? item.category : (item.category?.name || "Toys"),
            brand: item.brand || "ToyJoy",
            price: Number(item.salePrice || item.price || item.basePrice),
            originalPrice: Number(item.basePrice || item.price || 1499),
            rating: Number(item.rating || 4.8),
            reviews: Number(item.reviewsCount || item.reviewCount || 24),
            img: item.images?.[0]?.url || item.image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
            badge: "NEW",
            pastelBg: pastelBgs[idx % pastelBgs.length]
          }));
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load new arrivals:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
  }, [products, selectedCategory]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 font-sans">
      
      {/* 🚀 NEW ARRIVALS HERO BANNER 🚀 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-10">
        <div className="bg-gradient-to-r from-yellow-200 via-amber-100 to-sky-200 rounded-3xl p-8 md:p-12 text-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-sm border border-amber-200 min-h-[220px]">
          
          <div className="z-10 max-w-xl text-center md:text-left mb-6 md:mb-0">
            <span className="bg-amber-500 text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 inline-block shadow-sm">
              ✨ Fresh Arrivals 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-2">
              Discover <span className="text-amber-600">New Arrivals!</span> 🦒
            </h1>
            <p className="text-slate-600 text-sm font-semibold mb-4">
              Explore the latest released toys, games, and play sets added by our admin team!
            </p>
          </div>

          <div className="relative w-full md:w-1/2 h-48 flex items-center justify-center md:justify-end">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-9xl">
              🦒
            </motion.div>
          </div>

        </div>
      </section>

      {/* 🎨 CATEGORY FILTER TABS 🎨 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 🛍️ PRODUCT GRID 🛍️ */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6">
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-500">Loading New Arrivals...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No New Toys in this Category</h3>
            <button onClick={() => setSelectedCategory("All")} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-bold text-xs mt-4 cursor-pointer transition-all">
              Show All New Arrivals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(prod => {
              const isWishlisted = isInWishlist(prod.id);
              const discountPct = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);

              return (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={prod.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative"
                >
                  <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${prod.pastelBg} p-3 flex items-center justify-center`}>
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-sm" />
                    
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                      {prod.badge}
                    </span>

                    <button 
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full shadow-sm transition-all z-10 ${
                        isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-400 hover:text-pink-500'
                      }`}
                    >
                      <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase">{prod.category}</span>
                      <h3 className="font-black text-slate-800 text-sm mb-1 line-clamp-1">{prod.name}</h3>

                      <div className="flex items-center gap-1 text-amber-400 font-black text-[11px] mb-3">
                        <Star size={12} fill="currentColor" />
                        <span>{prod.rating}</span>
                        <span className="text-slate-400 font-normal">({prod.reviews})</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-lg font-black text-slate-900">₹{prod.price}</span>
                          <span className="text-xs text-slate-400 line-through ml-1">₹{prod.originalPrice}</span>
                        </div>
                        {discountPct > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => addToCart(prod as any)}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-violet-200/50 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-bold">Loading...</div>}>
      <NewArrivalsInner />
    </Suspense>
  );
}
