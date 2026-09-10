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
  }
];

function BestSellersInner() {
  const { addToCart, toggleWishlist, isInWishlist, isMounted } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const approved = data.filter((item: any) => (item.status === "APPROVED" || item.status === "Active") && item.isActive !== false);
          // Strictly show only products marked isBestSeller === true
          const tagged = approved.filter((item: any) => Boolean(item.isBestSeller));

          const pastelBgs = [
            "from-amber-100 to-orange-50",
            "from-pink-100 to-rose-50",
            "from-sky-100 to-blue-50",
            "from-purple-100 to-pink-50",
            "from-emerald-100 to-teal-50",
            "from-yellow-100 to-amber-50"
          ];

          const formatted = tagged.map((item: any, idx: number) => ({
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
            pastelBg: pastelBgs[idx % pastelBgs.length]
          }));
          formatted.sort((a: any, b: any) => (b.rating * b.salesCount) - (a.rating * a.salesCount));
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load best sellers:", err);
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
    <div className="w-full bg-[#0F1026] text-white min-h-screen py-8 font-sans">
      
      {/* 🔥 BEST SELLERS HERO BANNER 🔥 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-10">
        <div className="bg-[#171936] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xl border border-[#3A3D70] min-h-[220px]">
          
          <div className="z-10 max-w-xl text-center md:text-left mb-6 md:mb-0">
            <span className="bg-[#20224A] text-[#FFD447] border border-[#3A3D70] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 inline-flex items-center gap-1.5 shadow-sm">
              <Flame size={14} className="text-[#FF8A3D] fill-[#FF8A3D]" />
              <span>Most Loved &amp; Top Rated</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight mb-2">
              Best Sellers <span className="text-[#FF4FA3]">Collection</span>
            </h1>
            <p className="text-[#D9DBF0] text-sm md:text-base font-semibold max-w-md">
              Discover the most popular toys, games, and gifts rated 5-stars by parents and adored by kids!
            </p>
          </div>

          <div className="z-10 flex gap-4 text-center">
            <div className="bg-[#20224A] p-4 rounded-2xl border border-[#3A3D70] shadow-md min-w-[110px]">
              <div className="text-2xl font-black text-[#FF4FA3]">50K+</div>
              <div className="text-[11px] font-bold text-[#A8ACCA]">Happy Kids</div>
            </div>
            <div className="bg-[#20224A] p-4 rounded-2xl border border-[#3A3D70] shadow-md min-w-[110px]">
              <div className="text-2xl font-black text-[#FFD447]">4.9 ★</div>
              <div className="text-[11px] font-bold text-[#A8ACCA]">Avg. Rating</div>
            </div>
          </div>

          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#7C3CFF]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-64 h-64 bg-[#FF4FA3]/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 🏷️ CATEGORY FILTER TABS 🏷️ */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#3A3D70]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] text-white shadow-[0_0_12px_rgba(124,60,255,0.4)] scale-105"
                    : "bg-[#171936] text-[#D9DBF0] hover:bg-[#20224A] hover:text-[#FFD447] border border-[#3A3D70]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-[#A8ACCA]">
            Showing {filteredProducts.length} Best Sellers
          </span>
        </div>
      </section>

      {/* 📦 PRODUCTS GRID 📦 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 mb-16">
        {loading ? (
          <div className="text-center py-20 font-bold text-[#A8ACCA]">Loading Best Sellers...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#20224A] rounded-3xl p-12 text-center border border-[#3A3D70] shadow-md max-w-lg mx-auto">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-black text-white mb-2">No Best Seller Products</h3>
            <p className="text-[#A8ACCA] text-sm font-medium">
              There are currently no products highlighted as Best Sellers in the catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p: any) => {
              const isWishlisted = isInWishlist(p.id);

              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -6 }}
                  className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl overflow-hidden border border-[#3A3D70] hover:border-[#7C3CFF] shadow-md hover:shadow-[0_12px_30px_rgba(124,60,255,0.3)] transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-64 w-full bg-[#171936] p-6 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="h-full w-full object-contain group-hover:scale-108 transition-transform duration-500"
                    />

                    <span className="absolute top-4 left-4 bg-gradient-to-r from-[#FFD447] to-[#FF8A3D] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                      {p.badge}
                    </span>

                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#171936]/90 hover:bg-[#20224A] flex items-center justify-center text-white hover:text-[#FF4FA3] border border-[#3A3D70] shadow-md transition-all cursor-pointer"
                    >
                      <Heart size={16} className={isWishlisted ? "fill-[#FF4FA3] text-[#FF4FA3]" : ""} />
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(p)}
                      className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#171936]/90 hover:bg-[#20224A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer border border-[#3A3D70]"
                      title="Quick Preview"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-[#A8ACCA] uppercase tracking-wider mb-1">
                        {p.brand} • {p.category}
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base line-clamp-2 leading-snug mb-2 group-hover:text-[#FFD447] transition-colors">
                        {p.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex items-center text-[#FFD447]">
                          <Star size={14} className="fill-[#FFD447]" />
                        </div>
                        <span className="text-xs font-black text-white">{p.rating}</span>
                        <span className="text-[11px] text-[#A8ACCA] font-medium">({p.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#3A3D70] flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black text-[#FFD447]">₹{p.price}</div>
                        {p.originalPrice > p.price && (
                          <div className="text-xs text-[#A8ACCA] line-through">₹{p.originalPrice}</div>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(p)}
                        className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_12px_rgba(124,60,255,0.4)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
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
        )}
      </section>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#20224A] border border-[#3A3D70] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative text-white"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#171936] hover:bg-[#282B59] border border-[#3A3D70] flex items-center justify-center text-white hover:text-[#FF4FA3] cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="bg-[#171936] p-6 flex items-center justify-center">
                  <img
                    src={quickViewProduct.img}
                    alt={quickViewProduct.name}
                    className="max-h-56 object-contain"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#28B8FF] uppercase tracking-wider">{quickViewProduct.category}</span>
                    <h3 className="text-xl font-black text-white mt-1 mb-2">{quickViewProduct.name}</h3>
                    <div className="text-2xl font-black text-[#FFD447] mb-4">₹{quickViewProduct.price}</div>
                    <p className="text-[#D9DBF0] text-xs leading-relaxed mb-6">
                      Top-tier verified toy loved by kids across India. Tested for safety and boundless playful learning.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(124,60,255,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
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
