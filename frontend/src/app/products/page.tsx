"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, ShoppingBag, Star, Filter, SlidersHorizontal,
  ChevronDown, X, Sparkles, Truck, ShieldCheck, Check, ArrowRight
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { api, Product, Category, Brand, AgeGroup } from "../../services/api";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "all");
  const [selectedAge, setSelectedAge] = useState(searchParams.get("ageGroup") || "all");
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get("onSale") === "true");
  const [sortBy, setSortBy] = useState("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prods, cats, brs, ages] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands(),
          api.getAgeGroups()
        ]);
        setProducts(prods);
        setCategories(cats);
        setBrands(brs);
        setAgeGroups(ages);
      } catch (err) {
        console.error("Failed to load products data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update query states if searchParams change
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get("category");
    if (cat !== null) setSelectedCategory(cat);
    const br = searchParams.get("brand");
    if (br !== null) setSelectedBrand(br);
    const age = searchParams.get("ageGroup");
    if (age !== null) setSelectedAge(age);
    const sale = searchParams.get("onSale");
    if (sale === "true") setOnSaleOnly(true);
  }, [searchParams]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Customer storefront rule: only approved & active
        if (p.status !== "APPROVED") return false;
        if (p.isActive === false) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchVendor = p.vendorName?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchBrand && !matchVendor) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          const catName = typeof p.category === "string" ? p.category : p.category?.name;
          if (catName?.toLowerCase() !== selectedCategory.toLowerCase() && p.categoryId !== selectedCategory) {
            return false;
          }
        }

        // Brand
        if (selectedBrand !== "all") {
          if (p.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
        }

        // Age Group
        if (selectedAge !== "all") {
          const ageClean = selectedAge.toLowerCase().replace("years", "").trim();
          if (!p.ageGroup?.toLowerCase().includes(ageClean)) return false;
        }

        // Price
        const price = p.salePrice || p.price || p.basePrice;
        if (price > maxPrice) return false;

        // Stock
        if (inStockOnly && (p.stock || 0) <= 0) return false;

        // On Sale
        if (onSaleOnly && !((p.salePrice && p.salePrice < p.basePrice) || (p.discount && p.discount > 0))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const pA = a.salePrice || a.price || a.basePrice;
        const pB = b.salePrice || b.price || b.basePrice;
        if (sortBy === "price_asc") return pA - pB;
        if (sortBy === "price_desc") return pB - pA;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        return (b.salesCount || 0) - (a.salesCount || 0);
      });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedAge, maxPrice, inStockOnly, onSaleOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedAge("all");
    setMaxPrice(6000);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy("popular");
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (selectedAge !== "all" ? 1 : 0) +
    (maxPrice < 6000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Title & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
            <Link href="/" className="hover:text-pink-500">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Discover Toys</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Kids Toy Wonderland <Sparkles className="text-yellow-500 animate-spin" size={28} />
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Explore certified safe toys from verified sellers across India.
              </p>
            </div>
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search toys, brands, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Top Control Bar: Active Filters Chips & Sorting */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
            >
              <SlidersHorizontal size={14} /> Filters ({activeFiltersCount})
            </button>

            <span className="text-xs font-bold text-slate-500 mr-2">
              Showing <span className="text-pink-500 font-extrabold">{filteredProducts.length}</span> Toys
            </span>

            {/* Active Pills */}
            {selectedCategory !== "all" && (
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")}><X size={12} /></button>
              </span>
            )}
            {selectedBrand !== "all" && (
              <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand("all")}><X size={12} /></button>
              </span>
            )}
            {selectedAge !== "all" && (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                Age: {selectedAge}
                <button onClick={() => setSelectedAge("all")}><X size={12} /></button>
              </span>
            )}
            {onSaleOnly && (
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                On Sale
                <button onClick={() => setOnSaleOnly(false)}><X size={12} /></button>
              </span>
            )}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 underline ml-2"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* SIDEBAR FILTERS (Desktop & Mobile Modal) */}
          <aside className={`lg:block ${mobileFilterOpen ? 'fixed inset-0 z-50 bg-black/40 flex justify-end' : 'hidden'}`}>
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-200 lg:w-full w-80 h-full lg:h-auto overflow-y-auto space-y-6 ${mobileFilterOpen ? 'p-6 rounded-l-3xl rounded-r-none' : ''}`}>
              
              {mobileFilterOpen && (
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 lg:hidden">
                  <h3 className="font-black text-slate-800 text-lg">Filter Products</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Category Filter */}
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Categories</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === "all" ? "bg-pink-500 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? "bg-pink-500 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Brands</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedBrand === "all" ? "bg-sky-500 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBrand(b.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedBrand.toLowerCase() === b.name.toLowerCase()
                          ? "bg-sky-500 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800 text-sm mb-3">Age Groups</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedAge("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedAge === "all" ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Ages
                  </button>
                  {ageGroups.map((ag) => (
                    <button
                      key={ag.id}
                      onClick={() => setSelectedAge(ag.label)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        selectedAge.toLowerCase().includes(ag.label.toLowerCase().replace("years", "").trim())
                          ? "bg-amber-500 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{ag.icon || "🧸"}</span>
                      <span>{ag.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-extrabold text-slate-800 text-sm">Max Price</h4>
                  <span className="text-xs font-black text-pink-600">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={6000}
                  step={200}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>₹500</span>
                  <span>₹6000+</span>
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 cursor-pointer"
                  />
                  <span>On Discount / Sale Only 🔥</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 cursor-pointer"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 animate-pulse space-y-4">
                    <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-8 bg-slate-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
                <div className="text-6xl mb-4">🧸</div>
                <h3 className="text-xl font-black text-slate-800 mb-2">No Matching Toys Found</h3>
                <p className="text-slate-500 text-xs font-semibold mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or search keywords to find toys.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-black text-xs shadow-md hover:bg-pink-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const hasDiscount = (p.salePrice && p.salePrice < p.basePrice) || (p.discount && p.discount > 0);
                  const currentPrice = p.salePrice || p.price || p.basePrice;
                  const originalPrice = p.basePrice || (p.salePrice ? p.price : undefined);
                  const wishlisted = isInWishlist(p.id);

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col justify-between group relative"
                    >
                      {/* Top Badges */}
                      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5">
                        {hasDiscount && (
                          <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                            {p.discount ? `${p.discount}% OFF` : 'SALE'}
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                            BEST SELLER
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Heart size={18} className={wishlisted ? "fill-rose-500 text-rose-500" : ""} />
                      </button>

                      {/* Image Click through to Details */}
                      <Link href={`/products/${p.id}`} className="block overflow-hidden rounded-2xl bg-slate-50 mb-3 relative aspect-square">
                        <img
                          src={p.image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80"}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Info */}
                      <div>
                        {/* Vendor Attribution Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-600 mb-1">
                          <ShieldCheck size={13} className="text-sky-500" />
                          <span className="truncate">Sold by: {p.vendorName || "Verified Vendor"}</span>
                        </div>

                        {/* Title */}
                        <Link href={`/products/${p.id}`}>
                          <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2 hover:text-pink-500 transition-colors mb-1.5">
                            {p.name}
                          </h3>
                        </Link>

                        {/* Meta: Brand & Age */}
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{p.brand}</span>
                          <span>•</span>
                          <span>{p.ageGroup}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="flex text-amber-400">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                          </div>
                          <span className="text-xs font-black text-slate-700">{p.rating || 4.8}</span>
                          <span className="text-[10px] font-bold text-slate-400">({p.salesCount || 100}+ sold)</span>
                        </div>
                      </div>

                      {/* Price & Add to Cart */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-base font-black text-slate-900">₹{currentPrice}</div>
                          {originalPrice && originalPrice > currentPrice && (
                            <div className="text-[11px] font-bold text-slate-400 line-through">₹{originalPrice}</div>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart({
                            id: p.id,
                            name: p.name,
                            price: currentPrice,
                            originalPrice: originalPrice,
                            img: p.image,
                            category: typeof p.category === "string" ? p.category : p.category?.name,
                            brand: p.brand,
                            ageGroup: p.ageGroup,
                            vendorId: p.vendorId,
                            vendorName: p.vendorName,
                            sku: p.sku
                          })}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <ShoppingBag size={14} /> Add
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading Toy Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
