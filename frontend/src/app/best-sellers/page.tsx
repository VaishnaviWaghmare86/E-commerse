"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Heart, Eye, Sparkles, Filter, SlidersHorizontal, ArrowRight, X, Flame } from "lucide-react";
import { useCart } from "../../context/CartContext";

const BEST_SELLERS_DATA = [
  {
    id: "prod-1",
    name: "Mega Creative Building Blocks Set (150 Pcs)",
    category: "Building & Construction Sets",
    brand: "LEGO",
    price: 1599,
    originalPrice: 1999,
    rating: 5.0,
    reviews: 142,
    salesCount: 840,
    img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80",
    badge: "🔥 BEST SELLER",
    pastelBg: "from-amber-100 to-orange-50"
  },
  {
    id: "prod-2",
    name: "Cuddly Soft Plush Teddy Bear (18 inch)",
    category: "Plush & Soft Toys",
    brand: "Fisher-Price",
    price: 899,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 118,
    salesCount: 650,
    img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
    badge: "🔥 BEST SELLER",
    pastelBg: "from-pink-100 to-rose-50"
  },
  {
    id: "prod-3",
    name: "High-Speed Turbo Drift RC Racing Car",
    category: "Vehicles, Trains & RC",
    brand: "Hot Wheels",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 95,
    salesCount: 520,
    img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80",
    badge: "🔥 BEST SELLER",
    pastelBg: "from-sky-100 to-blue-50"
  },
  {
    id: "prod-4",
    name: "Princess Fashion Doll Playset with Wardrobe",
    category: "Action Figures & Playsets",
    brand: "Barbie",
    price: 1299,
    originalPrice: 1799,
    rating: 4.8,
    reviews: 87,
    salesCount: 430,
    img: "https://images.unsplash.com/photo-1558066126-25816c278fb1?w=500&q=80",
    badge: "🔥 BEST SELLER",
    pastelBg: "from-purple-100 to-pink-50"
  },
  {
    id: "prod-5",
    name: "Junior STEM Robotic Explorer Kit",
    category: "STEM & Robotics",
    brand: "LEGO",
    price: 2499,
    originalPrice: 3199,
    rating: 4.9,
    reviews: 73,
    salesCount: 390,
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    badge: "🔥 BEST SELLER",
    pastelBg: "from-emerald-100 to-teal-50"
  },
  {
    id: "prod-6",
    name: "Classic Family Board Game & Puzzle Box",
    category: "Board Games & Puzzles",
    brand: "Melissa & Doug",
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviews: 64,
    salesCount: 310,
    img: "https://images.unsplash.com/photo-1610890716171-6b1e0ce2d1dd?w=500&q=80",
    badge: "🔥 BEST SELLER",
    pastelBg: "from-yellow-100 to-amber-50"
  }
];

function BestSellersInner() {
  const { addToCart, wishlist, toggleWishlist, isMounted } = useCart();
  const [products, setProducts] = useState(BEST_SELLERS_DATA);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const approved = data.filter((item: any) => item.status === "APPROVED" && item.isActive !== false);
          if (approved.length > 0) {
            const formatted = approved.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: typeof item.category === "string" ? item.category : (item.category?.name || "Toys"),
              brand: item.brand || "ToyJoy",
              price: Number(item.salePrice || item.price || item.basePrice),
              originalPrice: Number(item.basePrice || item.price || 1499),
              rating: Number(item.rating || 4.9),
              reviews: Number(item.reviewsCount || item.reviewCount || 48),
              salesCount: Number(item.salesCount || 120),
              img: item.images?.[0]?.url || item.image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
              badge: "🔥 BEST SELLER",
              pastelBg: "from-amber-100 to-orange-50"
            }));
            formatted.sort((a: any, b: any) => (b.rating * b.salesCount) - (a.rating * a.salesCount));
            setProducts(formatted);
          }
        }
      })
      .catch(() => console.log("Using fallback static Best Sellers dataset"))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 font-sans">
      
      {/* 🔥 BEST SELLERS HERO BANNER 🔥 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-10">
        <div className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-300 rounded-3xl p-8 md:p-12 text-slate-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-md border border-amber-300 min-h-[220px]">
          
          <div className="z-10 max-w-xl text-center md:text-left mb-6 md:mb-0">
            <span className="bg-slate-900 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 inline-flex items-center gap-1.5 shadow-sm">
              <Flame size={14} className="text-amber-400 fill-amber-400" />
              <span>Most Loved &amp; Top Rated</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-2">
              Best Sellers <span className="text-rose-700">Collection</span>
            </h1>
            <p className="text-slate-800 text-sm md:text-base font-semibold max-w-md">
              Discover the most popular toys, games, and gifts rated 5-stars by parents and adored by kids!
            </p>
          </div>

          <div className="z-10 flex gap-4 text-center">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm min-w-[110px]">
              <div className="text-2xl font-black text-rose-600">50K+</div>
              <div className="text-[11px] font-bold text-slate-600">Happy Kids</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm min-w-[110px]">
              <div className="text-2xl font-black text-amber-600">4.9 ★</div>
              <div className="text-[11px] font-bold text-slate-600">Avg. Rating</div>
            </div>
          </div>

          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 🏷️ CATEGORY FILTER TABS 🏷️ */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "bg-white text-slate-600 hover:bg-amber-100 hover:text-amber-900 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredProducts.length} Best Sellers
          </span>
        </div>
      </section>

      {/* 📦 PRODUCTS GRID 📦 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p: any) => {
            const isWishlisted = wishlist?.some((item: any) => item.id === p.id);

            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className={`relative h-64 w-full bg-gradient-to-br ${p.pastelBg || "from-amber-50 to-orange-50"} p-6 flex items-center justify-center overflow-hidden`}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
                  />

                  <span className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {p.badge}
                  </span>

                  <button
                    onClick={() => toggleWishlist(p)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-400 hover:text-pink-500 shadow-md transition-all cursor-pointer"
                  >
                    <Heart size={16} className={isWishlisted ? "fill-pink-500 text-pink-500" : ""} />
                  </button>

                  <button
                    onClick={() => setQuickViewProduct(p)}
                    className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                    title="Quick Preview"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {p.brand} • {p.category}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-2 leading-snug mb-2 group-hover:text-amber-600 transition-colors">
                      {p.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center text-amber-400">
                        <Star size={14} className="fill-amber-400" />
                      </div>
                      <span className="text-xs font-black text-slate-800">{p.rating}</span>
                      <span className="text-[11px] text-slate-400 font-medium">({p.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-900">₹{p.price}</div>
                      {p.originalPrice > p.price && (
                        <div className="text-xs text-slate-400 line-through">₹{p.originalPrice}</div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <ShoppingBag size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="bg-amber-50 p-6 flex items-center justify-center">
                  <img src={quickViewProduct.img} alt={quickViewProduct.name} className="max-h-56 object-contain" />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      {quickViewProduct.badge}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2 mb-1">{quickViewProduct.name}</h2>
                    <div className="text-amber-500 font-bold text-xs mb-3">★ {quickViewProduct.rating} / 5.0</div>
                    <div className="text-2xl font-black text-slate-900 mb-4">₹{quickViewProduct.price}</div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function BestSellersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-slate-500">Loading Best Sellers...</div>}>
      <BestSellersInner />
    </Suspense>
  );
}
