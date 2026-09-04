"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Heart, ShoppingBag, Star, Filter, SlidersHorizontal, 
  ChevronDown, ChevronUp, Grid, List, Eye, Check, X, ArrowRight,
  Sparkles, Flame, GraduationCap, Trophy, RefreshCw, Truck, ShieldCheck, RefreshCcw, Headphones
} from "lucide-react";
import { useCart } from "../../context/CartContext";

// --- EXPANDED REALISTIC TOY PRODUCTS DATASET ---
interface Product {
  id: number;
  name: string;
  category: string;
  age: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  img: string;
  badge?: "NEW" | "BEST SELLER" | "SALE" | "HOT";
  inStock: boolean;
  onSale: boolean;
  section?: "trending" | "educational" | "outdoor";
  pastelBg: string;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Cute Teddy Bear",
    category: "Soft Toys",
    age: "0 - 2 Years",
    brand: "Fisher-Price",
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviews: 320,
    img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
    badge: "BEST SELLER",
    inStock: true,
    onSale: true,
    section: "trending",
    pastelBg: "from-pink-100 to-rose-50"
  },
  {
    id: 2,
    name: "Remote Control Car",
    category: "Cars & Vehicles",
    age: "6 - 8 Years",
    brand: "Hot Wheels",
    price: 1299,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 210,
    img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80",
    badge: "NEW",
    inStock: true,
    onSale: true,
    section: "trending",
    pastelBg: "from-sky-100 to-blue-50"
  },
  {
    id: 3,
    name: "Building Blocks Set",
    category: "Building Blocks",
    age: "3 - 5 Years",
    brand: "LEGO",
    price: 799,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 180,
    img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80",
    badge: "HOT",
    inStock: true,
    onSale: true,
    section: "educational",
    pastelBg: "from-emerald-100 to-teal-50"
  },
  {
    id: 4,
    name: "Princess Doll House",
    category: "Dolls & Playsets",
    age: "3 - 5 Years",
    brand: "Barbie",
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 156,
    img: "https://images.unsplash.com/photo-1558066126-25816c278fb1?w=500&q=80",
    badge: "SALE",
    inStock: true,
    onSale: true,
    pastelBg: "from-purple-100 to-pink-50"
  },
  {
    id: 5,
    name: "Art & Craft Kit",
    category: "Arts & Crafts",
    age: "6 - 8 Years",
    brand: "Funskool",
    price: 499,
    originalPrice: 799,
    rating: 4.5,
    reviews: 98,
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    badge: "NEW",
    inStock: true,
    onSale: true,
    section: "educational",
    pastelBg: "from-purple-100 to-indigo-50"
  },
  {
    id: 6,
    name: "Kids Scooter",
    category: "Outdoor Toys",
    age: "6 - 8 Years",
    brand: "Nerf",
    price: 1599,
    originalPrice: 2499,
    rating: 4.8,
    reviews: 143,
    img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80",
    badge: "BEST SELLER",
    inStock: true,
    onSale: true,
    section: "outdoor",
    pastelBg: "from-amber-100 to-orange-50"
  },
  {
    id: 7,
    name: "Educational Puzzle",
    category: "Educational Toys",
    age: "3 - 5 Years",
    brand: "Fisher-Price",
    price: 699,
    originalPrice: 999,
    rating: 4.7,
    reviews: 201,
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
    badge: "HOT",
    inStock: true,
    onSale: true,
    section: "educational",
    pastelBg: "from-sky-100 to-teal-50"
  },
  {
    id: 8,
    name: "Doctor Play Set",
    category: "Baby Toys",
    age: "3 - 5 Years",
    brand: "Fisher-Price",
    price: 899,
    originalPrice: 1299,
    rating: 4.6,
    reviews: 112,
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80",
    badge: "NEW",
    inStock: true,
    onSale: true,
    pastelBg: "from-pink-100 to-sky-50"
  },
  {
    id: 9,
    name: "Strategy Board Game",
    category: "Board Games",
    age: "9 - 12 Years",
    brand: "Funskool",
    price: 1199,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 160,
    img: "https://images.unsplash.com/photo-1610890716171-6b1e0ce2d1dd?w=500&q=80",
    badge: "BEST SELLER",
    inStock: true,
    onSale: true,
    pastelBg: "from-indigo-100 to-purple-50"
  },
  {
    id: 10,
    name: "Kitchen Playset",
    category: "Dolls & Playsets",
    age: "3 - 5 Years",
    brand: "Barbie",
    price: 1999,
    originalPrice: 2499,
    rating: 4.8,
    reviews: 95,
    img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80",
    badge: "SALE",
    inStock: true,
    onSale: true,
    section: "trending",
    pastelBg: "from-rose-100 to-pink-50"
  },
  {
    id: 11,
    name: "Dino World Set",
    category: "Educational Toys",
    age: "3 - 5 Years",
    brand: "LEGO",
    price: 1299,
    originalPrice: 1699,
    rating: 4.7,
    reviews: 78,
    img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80",
    badge: "NEW",
    inStock: true,
    onSale: true,
    pastelBg: "from-teal-100 to-emerald-50"
  },
  {
    id: 12,
    name: "Gift Medical Set",
    category: "Gift Sets",
    age: "3 - 5 Years",
    brand: "Fisher-Price",
    price: 999,
    originalPrice: 1399,
    rating: 4.7,
    reviews: 64,
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
    badge: "BEST SELLER",
    inStock: true,
    onSale: true,
    section: "outdoor",
    pastelBg: "from-violet-100 to-purple-50"
  }
];

const CIRCULAR_CATEGORIES = [
  { name: "All Toys", icon: "🧸", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&h=200&fit=crop" },
  { name: "Soft Toys", icon: "🧸", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&h=200&fit=crop" },
  { name: "Cars & Vehicles", icon: "🏎️", img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop" },
  { name: "Building Blocks", icon: "🧱", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop" },
  { name: "Dolls & Playsets", icon: "🏰", img: "https://images.unsplash.com/photo-1558066126-25816c278fb1?w=200&h=200&fit=crop" },
  { name: "Educational Toys", icon: "🎓", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop" },
  { name: "Baby Toys", icon: "🍼", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop" },
  { name: "Board Games", icon: "🎲", img: "https://images.unsplash.com/photo-1610890716171-6b1e0ce2d1dd?w=200&h=200&fit=crop" },
  { name: "Arts & Crafts", icon: "🎨", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop" },
  { name: "Outdoor Toys", icon: "⚽", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop" }
];

const BRANDS_LIST = ["LEGO", "Barbie", "Hot Wheels", "Fisher-Price", "Funskool"];
const AGE_GROUPS_LIST = ["0 - 2 Years", "3 - 5 Years", "6 - 8 Years", "9 - 12 Years", "13+ Years"];

const ITEMS_PER_PAGE = 8;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const { addToCart, wishlist, toggleWishlist } = useCart();

  // --- FILTER STATES ---
  const [selectedCategory, setSelectedCategory] = useState<string>("All Toys");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("popular");

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState<number>(1);

  // --- UI STATES ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedAge, selectedBrands, maxPrice, minRating, onlyInStock, onlyOnSale, searchQuery, sortBy]);

  // Accordion Expand States
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    age: true,
    price: true,
    brand: true,
    rating: true,
    availability: true,
    offers: true,
  });

  const toggleAccordion = (key: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory("All Toys");
    setSelectedAge("all");
    setSelectedBrands([]);
    setMaxPrice(5000);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    setSearchQuery("");
    setSortBy("popular");
    setCurrentPage(1);
  };

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS_DATA.filter(product => {
      if (selectedCategory !== "All Toys" && product.category !== selectedCategory) return false;
      if (selectedAge !== "all" && product.age !== selectedAge) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (product.price > maxPrice) return false;
      if (product.rating < minRating) return false;
      if (onlyInStock && !product.inStock) return false;
      if (onlyOnSale && !product.onSale) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [selectedCategory, selectedAge, selectedBrands, maxPrice, minRating, onlyInStock, onlyOnSale, searchQuery, sortBy]);

  // PAGINATED PRODUCTS
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const trendingProducts = PRODUCTS_DATA.filter(p => p.section === "trending" || p.rating >= 4.8);
  const educationalProducts = PRODUCTS_DATA.filter(p => p.category === "Educational Toys" || p.section === "educational");
  const outdoorProducts = PRODUCTS_DATA.filter(p => p.category === "Outdoor Toys" || p.section === "outdoor");

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-6 md:py-8 font-sans">

      {/* 🚀 1. HERO BANNER 🚀 */}
      <section className="max-w-[1400px] mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-sky-100 via-pink-100 to-purple-100 rounded-3xl p-6 md:p-10 text-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-sm border border-slate-200 min-h-[220px]">
          
          {/* Left Text */}
          <div className="z-10 max-w-xl text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-2">
              All Toys, One <br className="hidden md:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Magical Place!</span>
            </h1>
            <p className="text-slate-600 text-xs md:text-sm font-semibold mb-6">
              Discover toys that make every moment more fun for kids of all ages.
            </p>
            <button 
              onClick={() => { setSelectedCategory("All Toys"); resetAllFilters(); }}
              className="bg-pink-500 hover:bg-pink-600 transition-colors text-white font-black text-xs md:text-sm px-6 py-3 rounded-full shadow-md inline-flex items-center gap-2"
            >
              Explore Toys &rarr;
            </button>
          </div>

          {/* Right 3D Toy Illustration */}
          <div className="relative w-full md:w-1/2 h-44 md:h-56 flex items-center justify-center md:justify-end">
            <img 
              src="/blocks.png" 
              alt="Toy Collection" 
              className="h-full object-contain drop-shadow-xl"
            />
            <span className="absolute top-2 left-10 text-3xl animate-bounce">🎈</span>
            <span className="absolute bottom-2 right-12 text-3xl">🧸</span>
            <span className="absolute top-6 right-1/3 text-2xl text-yellow-400">⭐</span>
          </div>

        </div>
      </section>

      {/* 🎨 2. CIRCULAR CATEGORY CARDS 🎨 */}
      <section className="max-w-[1400px] mx-auto px-4 mb-10">
        <div className="flex items-center justify-start md:justify-between gap-4 md:gap-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CIRCULAR_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center cursor-pointer min-w-[75px] md:min-w-[90px] group flex-shrink-0"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-1 shadow-sm border-2 transition-all flex items-center justify-center relative ${
                  isActive ? "border-pink-500 scale-110 shadow-pink-200 ring-4 ring-pink-100" : "border-white bg-white group-hover:border-pink-300"
                }`}>
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className={`mt-2 text-xs font-bold text-center transition-colors ${isActive ? 'text-pink-600' : 'text-slate-700 group-hover:text-pink-500'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🛍️ 3. MAIN TWO-COLUMN SHOP LAYOUT 🛍️ */}
      <section className="max-w-[1400px] mx-auto px-4">
        
        {/* Mobile Sticky Filter Bar */}
        <div className="lg:hidden mb-6 flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-200 sticky top-28 z-30">
          <button 
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md"
          >
            <SlidersHorizontal size={14} /> Filter Toys
          </button>
          <span className="text-xs font-black text-slate-700">
            {filteredProducts.length} Toys Found
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ==================== LEFT FILTER SIDEBAR ==================== */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-36">
              
              {/* Sidebar Title */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Filter size={16} className="text-pink-500" /> Filters
                </h3>
                <button 
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1"
                >
                  <RefreshCw size={12}/> Reset
                </button>
              </div>

              {/* 1. CATEGORIES */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <button 
                  onClick={() => toggleAccordion('categories')}
                  className="w-full flex justify-between items-center text-xs font-black text-slate-800 mb-3"
                >
                  <span>Categories</span>
                  {expandedSections.categories ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {expandedSections.categories && (
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    {CIRCULAR_CATEGORIES.map(cat => (
                      <label key={cat.name} className="flex items-center gap-2.5 cursor-pointer hover:text-pink-500">
                        <input 
                          type="radio" 
                          name="category"
                          checked={selectedCategory === cat.name}
                          onChange={() => setSelectedCategory(cat.name)}
                          className="accent-pink-500 w-3.5 h-3.5"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. AGE GROUP */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <button 
                  onClick={() => toggleAccordion('age')}
                  className="w-full flex justify-between items-center text-xs font-black text-slate-800 mb-3"
                >
                  <span>Age Group</span>
                  {expandedSections.age ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {expandedSections.age && (
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    {AGE_GROUPS_LIST.map(age => (
                      <label key={age} className="flex items-center gap-2.5 cursor-pointer hover:text-pink-500">
                        <input 
                          type="checkbox" 
                          checked={selectedAge === age}
                          onChange={() => setSelectedAge(selectedAge === age ? "all" : age)}
                          className="accent-pink-500 rounded w-3.5 h-3.5"
                        />
                        <span>{age}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. PRICE RANGE */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <button 
                  onClick={() => toggleAccordion('price')}
                  className="w-full flex justify-between items-center text-xs font-black text-slate-800 mb-3"
                >
                  <span>Price Range</span>
                  {expandedSections.price ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {expandedSections.price && (
                  <div>
                    <span className="text-xs font-bold text-pink-500 block mb-2">₹0 - ₹{maxPrice}</span>
                    <input 
                      type="range" 
                      min="500" 
                      max="5000" 
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* 4. BRAND */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <button 
                  onClick={() => toggleAccordion('brand')}
                  className="w-full flex justify-between items-center text-xs font-black text-slate-800 mb-3"
                >
                  <span>Brand</span>
                  {expandedSections.brand ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {expandedSections.brand && (
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    {BRANDS_LIST.map(b => (
                      <label key={b} className="flex items-center gap-2.5 cursor-pointer hover:text-pink-500">
                        <input 
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => toggleBrand(b)}
                          className="accent-pink-500 rounded w-3.5 h-3.5"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. RATING */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <button 
                  onClick={() => toggleAccordion('rating')}
                  className="w-full flex justify-between items-center text-xs font-black text-slate-800 mb-3"
                >
                  <span>Rating</span>
                  {expandedSections.rating ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {expandedSections.rating && (
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    {[4, 3, 2].map(r => (
                      <button
                        key={r}
                        onClick={() => setMinRating(prev => prev === r ? 0 : r)}
                        className={`w-full text-left py-1 flex items-center gap-1 ${minRating === r ? 'text-pink-500 font-bold' : 'hover:text-slate-900'}`}
                      >
                        <Star size={12} className="text-amber-400" fill="currentColor"/> {r} &amp; above
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. AVAILABILITY & OFFERS */}
              <div>
                <button 
                  onClick={() => toggleAccordion('offers')}
                  className="w-full flex justify-between items-center text-xs font-black text-slate-800 mb-3"
                >
                  <span>Offers &amp; Availability</span>
                  {expandedSections.offers ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                {expandedSections.offers && (
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="accent-pink-500 rounded w-3.5 h-3.5"
                      />
                      <span>In Stock</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={onlyOnSale}
                        onChange={(e) => setOnlyOnSale(e.target.checked)}
                        className="accent-pink-500 rounded w-3.5 h-3.5"
                      />
                      <span>On Sale</span>
                    </label>
                  </div>
                )}
              </div>

            </div>
          </aside>

          {/* ==================== RIGHT CONTENT AREA ==================== */}
          <main className="lg:col-span-3">
            
            {/* TOP TOOLBAR */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
              <span className="text-sm font-black text-slate-800">
                {filteredProducts.length} <span className="font-medium text-slate-500">Toys Found</span>
              </span>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-pink-500 font-bold cursor-pointer"
                  >
                    <option value="popular">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="text-6xl mb-4">🧸</div>
                <h3 className="text-xl font-black text-slate-800 mb-2">No Toys Found</h3>
                <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or resetting them to discover amazing toys.
                </p>
                <button 
                  onClick={resetAllFilters}
                  className="bg-pink-500 text-white px-6 py-2 rounded-full font-bold text-xs shadow-md hover:bg-pink-600 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" : "flex flex-col gap-4"}>
                {paginatedProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  const discountPct = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);

                  return (
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      key={prod.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative"
                    >
                      {/* Pastel Scene Image Area */}
                      <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${prod.pastelBg} p-3 flex items-center justify-center`}>
                        <img 
                          src={prod.img} 
                          alt={prod.name} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-sm" 
                        />
                        
                        {/* Badge */}
                        {prod.badge && (
                          <span className="absolute top-3 left-3 bg-pink-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                            {prod.badge}
                          </span>
                        )}

                        {/* Wishlist Heart */}
                        <button 
                          onClick={() => toggleWishlist(prod.id)}
                          className={`absolute top-3 right-3 p-1.5 rounded-full shadow-sm transition-all z-10 ${
                            isWishlisted ? 'bg-pink-500 text-white' : 'bg-white/80 text-slate-400 hover:text-pink-500'
                          }`}
                        >
                          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Info & Price */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-black text-slate-800 text-xs md:text-sm mb-1 line-clamp-1 group-hover:text-pink-500 transition-colors">
                            {prod.name}
                          </h3>

                          <div className="flex items-center gap-1 text-amber-400 font-black text-[11px] mb-2">
                            <Star size={12} fill="currentColor" />
                            <span>{prod.rating}</span>
                            <span className="text-slate-400 font-semibold">({prod.reviews})</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <span className="text-base font-black text-slate-900">₹{prod.price}</span>
                            <span className="text-[11px] text-slate-400 line-through">₹{prod.originalPrice}</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                              {discountPct}% OFF
                            </span>
                          </div>

                          <button 
                            onClick={() => addToCart(prod)}
                            className="w-full bg-pink-500 hover:bg-pink-600 active:scale-95 text-white py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
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

            {/* 4 TRUST BADGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              <div className="bg-pink-50/50 border border-pink-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Free Shipping</h4>
                  <p className="text-[10px] text-slate-500">on orders above ₹999</p>
                </div>
              </div>

              <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Secure Payments</h4>
                  <p className="text-[10px] text-slate-500">100% safe &amp; secure</p>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <RefreshCcw size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Easy Returns</h4>
                  <p className="text-[10px] text-slate-500">Hassle free returns</p>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <Headphones size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">24/7 Support</h4>
                  <p className="text-[10px] text-slate-500">We are here to help</p>
                </div>
              </div>
            </div>

            {/* WORKING PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                    currentPage === 1 
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                      : 'border-slate-300 text-slate-700 hover:bg-pink-500 hover:text-white'
                  }`}
                >
                  &larr; Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                      currentPage === page 
                        ? 'bg-pink-500 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                    currentPage === totalPages 
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                      : 'border-slate-300 text-slate-700 hover:bg-pink-500 hover:text-white'
                  }`}
                >
                  Next &rarr;
                </button>
              </div>
            )}

          </main>
        </div>
      </section>

      {/* MOBILE FILTER MODAL */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                <h3 className="font-black text-base text-slate-800">Filter Toys</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-400 hover:text-slate-800">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 text-xs font-semibold">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Categories</h4>
                  <div className="space-y-1.5">
                    {CIRCULAR_CATEGORIES.map(c => (
                      <button key={c.name} onClick={() => { setSelectedCategory(c.name); setMobileFilterOpen(false); }} className={`block w-full text-left py-1.5 px-3 rounded-lg font-bold ${selectedCategory === c.name ? 'bg-pink-500 text-white' : 'text-slate-600'}`}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Max Price: ₹{maxPrice}</h4>
                  <input type="range" min="500" max="5000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-pink-500" />
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <button onClick={() => { resetAllFilters(); setMobileFilterOpen(false); }} className="flex-1 border border-slate-200 py-2.5 rounded-xl font-bold text-xs text-slate-600">Reset</button>
                <button onClick={() => setMobileFilterOpen(false)} className="flex-1 bg-pink-500 text-white py-2.5 rounded-xl font-bold text-xs">Apply</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-bold text-slate-600">Loading Shop Page...</div>}>
      <ShopContent />
    </Suspense>
  );
}
