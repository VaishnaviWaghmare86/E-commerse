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

  // Dynamically merge categories from API and all categories present on products
  const allCategoriesList = useMemo(() => {
    const map = new Map<string, Category>();
    const usedIds = new Set<string>();

    categories.forEach((c) => {
      if (c && c.name) {
        const key = c.name.trim().toLowerCase();
        const slug = c.slug || key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let id = c.id;
        if (!id || usedIds.has(id)) {
          id = `cat-${slug}`;
        }
        usedIds.add(id);
        map.set(key, { ...c, id, slug });
      }
    });

    products.forEach((p) => {
      if ((p.status !== "APPROVED" && p.status !== "Active") || p.isActive === false) return;
      const catName = typeof p.category === "string" ? p.category : p.category?.name;
      if (catName && catName.trim()) {
        const key = catName.trim().toLowerCase();
        if (!map.has(key)) {
          const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          let id = p.categoryId || `cat-${slug}`;
          if (usedIds.has(id)) {
            id = `cat-${slug}`;
          }
          usedIds.add(id);
          map.set(key, {
            id,
            name: catName.trim(),
            slug,
            description: `${catName.trim()} toys`,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [categories, products]);

  // Dynamically merge brands from API and all brands present on products
  const allBrandsList = useMemo(() => {
    const map = new Map<string, Brand>();
    const usedIds = new Set<string>();

    brands.forEach((b) => {
      if (b && b.name) {
        const key = b.name.trim().toLowerCase();
        const slug = b.slug || key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let id = b.id;
        if (!id || usedIds.has(id)) {
          id = `brand-${slug}`;
        }
        usedIds.add(id);
        map.set(key, { ...b, id, slug });
      }
    });

    products.forEach((p) => {
      if ((p.status !== "APPROVED" && p.status !== "Active") || p.isActive === false) return;
      if (p.brand && p.brand.trim()) {
        const key = p.brand.trim().toLowerCase();
        if (!map.has(key)) {
          const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const id = `brand-${slug}`;
          usedIds.add(id);
          map.set(key, {
            id,
            name: p.brand.trim(),
            slug,
            description: `${p.brand.trim()} toys`,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [brands, products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Customer storefront rule: only show approved and active toys (never unapproved / pending)
        if (p.status !== "APPROVED" && p.status !== "Active") return false;
        if (p.isActive === false) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchVendor = p.vendorName?.toLowerCase().includes(q);
          const matchCat = (typeof p.category === "string" ? p.category : p.category?.name)?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchBrand && !matchVendor && !matchCat) return false;
        }

        // Category filter: exact match, id match, or flexible substring match
        if (selectedCategory !== "all") {
          const catName = (typeof p.category === "string" ? p.category : p.category?.name || "").trim().toLowerCase();
          const target = selectedCategory.trim().toLowerCase();
          
          const isMatch =
            catName === target ||
            p.categoryId === selectedCategory ||
            (target.length > 3 && catName.includes(target)) ||
            (catName.length > 3 && target.includes(catName));

          if (!isMatch) return false;
        }

        // Brand filter
        if (selectedBrand !== "all") {
          const brandName = (p.brand || "").trim().toLowerCase();
          const target = selectedBrand.trim().toLowerCase();
          if (brandName !== target && !brandName.includes(target) && !target.includes(brandName)) {
            return false;
          }
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
    <div className="w-full bg-[#FAF9F6] min-h-screen py-6 px-3 sm:px-4 md:px-5 lg:px-6 font-sans">
      <div className="w-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          
          {/* SIDEBAR FILTERS (Desktop & Mobile Modal) */}
          <aside className={`lg:block h-full ${mobileFilterOpen ? 'fixed inset-0 z-50 bg-black/40 flex justify-end' : 'hidden'}`}>
            <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-200 lg:w-full w-80 h-full flex flex-col justify-between ${mobileFilterOpen ? 'p-6 rounded-l-3xl rounded-r-none overflow-y-auto' : ''}`}>
              
              <div className="space-y-6">
                {mobileFilterOpen && (
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 lg:hidden">
                    <h3 className="font-black text-slate-800 text-lg">Filter Products</h3>
                    <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={20} />
                    </button>
                  </div>
                )}

                {/* Sidebar Header with Filter count and Reset */}
                <div className="hidden lg:flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-violet-600" />
                    <h3 className="font-black text-slate-900 text-sm tracking-wide">Filters &amp; Sort</h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-bold text-violet-600 hover:text-violet-700 hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Sort By Filter in Sidebar */}
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between text-slate-400">
                    <span>Sort Order</span>
                  </h4>
                  <div className="space-y-1">
                    {[
                      { id: "popular", label: "🌟 Most Popular" },
                      { id: "newest", label: "✨ Newest Arrivals" },
                      { id: "price_asc", label: "💵 Price: Low to High" },
                      { id: "price_desc", label: "💎 Price: High to Low" },
                      { id: "rating", label: "⭐ Highest Rated" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSortBy(s.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          sortBy === s.id
                            ? "bg-violet-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter (Clean & Fully Visible, Dynamic Product Categories) */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between text-slate-400">
                    <span>Categories</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">({allCategoriesList.length + 1})</span>
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === "all" ? "bg-violet-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {products.filter(p => p.status === "APPROVED" && p.isActive !== false).length}
                      </span>
                    </button>
                    {allCategoriesList.map((cat, idx) => {
                      const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                      const count = products.filter((p) => {
                        if (p.status !== "APPROVED" || p.isActive === false) return false;
                        const c = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase();
                        const t = cat.name.toLowerCase();
                        return c === t || (t.length > 3 && c.includes(t)) || (c.length > 3 && t.includes(c));
                      }).length;

                      return (
                        <button
                          key={`cat-btn-${cat.id}-${idx}`}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                            isSelected ? "bg-violet-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate mr-2">{cat.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brand Filter (Clean & Fully Visible, Dynamic Brands) */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between text-slate-400">
                    <span>Brands</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">({allBrandsList.length + 1})</span>
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedBrand === "all" ? "bg-sky-500 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>All Brands</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedBrand === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {products.filter(p => p.status === "APPROVED" && p.isActive !== false).length}
                      </span>
                    </button>
                    {allBrandsList.map((b, idx) => {
                      const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase();
                      const count = products.filter((p) => {
                        if (p.status !== "APPROVED" || p.isActive === false) return false;
                        const br = (p.brand || "").toLowerCase();
                        const t = b.name.toLowerCase();
                        return br === t || br.includes(t) || t.includes(br);
                      }).length;

                      return (
                        <button
                          key={`brand-btn-${b.id}-${idx}`}
                          onClick={() => setSelectedBrand(b.name)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                            isSelected ? "bg-sky-500 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate mr-2">{b.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age Group Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between text-slate-400">
                    <span>Age Groups</span>
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedAge("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        selectedAge === "all" ? "bg-amber-500 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>All Ages</span>
                      {selectedAge === "all" && <span className="text-[10px]">✓</span>}
                    </button>
                    {ageGroups.map((ag) => (
                      <button
                        key={ag.id}
                        onClick={() => setSelectedAge(ag.label)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          selectedAge.toLowerCase().includes(ag.label.toLowerCase().replace("years", "").trim())
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{ag.icon || "🧸"}</span>
                          <span>{ag.label}</span>
                        </div>
                        {selectedAge.toLowerCase().includes(ag.label.toLowerCase().replace("years", "").trim()) && (
                          <span className="text-[10px]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider text-slate-400">Max Price</h4>
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
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 cursor-pointer"
                    />
                    <span>On Discount / Sale Only 🔥</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
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

              {/* Bottom Trust Card (Fills down to touch where footer starts) */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 rounded-2xl p-4 border border-pink-100/60 text-center space-y-2">
                  <div className="text-2xl">🧸</div>
                  <h5 className="font-extrabold text-slate-900 text-xs">100% Certified Safe Toys</h5>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                    Lab-tested, BPA-free, non-toxic toys certified safe for children.
                  </p>
                  <div className="pt-1 flex flex-wrap justify-center gap-1.5 text-[10px] font-bold text-slate-600">
                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">🚀 Fast Delivery</span>
                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">🔄 Easy Returns</span>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs transition-colors text-center cursor-pointer"
                  >
                    Reset All Filters ({activeFiltersCount})
                  </button>
                )}
              </div>

            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-3 xl:col-span-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
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
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                            {p.discount ? `${p.discount}% OFF` : 'SALE'}
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                            BEST SELLER
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
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
                          <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2 hover:text-violet-600 transition-colors mb-1.5">
                            {p.name}
                          </h3>
                        </Link>

                        {/* Meta: Category Badge, Brand & Age */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-2">
                          <span className="bg-violet-50 text-violet-700 border border-violet-200/70 px-2 py-0.5 rounded-md font-extrabold">
                            {typeof p.category === "string" ? p.category : p.category?.name || "Toys"}
                          </span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-semibold">{p.brand}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-500">{p.ageGroup}</span>
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
                          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-2xl font-black text-xs shadow-md hover:shadow-violet-200/50 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
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
