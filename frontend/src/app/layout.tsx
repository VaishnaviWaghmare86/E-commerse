"use client";

import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Search, User, Truck, ShieldCheck, RefreshCcw, HelpCircle, Menu, X, Sparkles } from "lucide-react";
import { CartProvider, useCart } from "../context/CartContext";

function HeaderNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlistCount, toastMessage } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted ? cartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/shop" },
    { name: "Brands", href: "/shop" },
    { name: "Age Group", href: "/shop" },
    { name: "Best Sellers", href: "/shop" },
    { name: "New Arrivals", href: "/shop" },
    { name: "Offers", href: "/shop" },
  ];

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 text-sm animate-bounce">
          <Sparkles className="text-yellow-400" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP STICKY HEADER WRAPPER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        
        {/* 1. TOP DARK INFO BAR */}
        <div className="bg-[#1e293b] text-slate-300 text-xs py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-pink-400" />
              <span className="font-medium">Free Shipping on Orders Above ₹999</span>
            </div>
            <div className="hidden md:flex items-center gap-6 font-medium text-slate-300">
              <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-sky-400"/> Safe &amp; Secure Payments</div>
              <div className="flex items-center gap-1.5"><RefreshCcw size={14} className="text-sky-400"/> Easy Returns</div>
              <div className="flex items-center gap-1.5"><HelpCircle size={14} className="text-amber-400"/> Help &amp; Support</div>
            </div>
          </div>
        </div>

        {/* 2. MAIN NAVBAR */}
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center gap-4 md:gap-8">
            
            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-pink-500 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center leading-none flex-shrink-0">
              <span className="text-3xl md:text-4xl font-black tracking-tighter">
                <span className="text-sky-500">T</span>
                <span className="text-pink-500">o</span>
                <span className="text-yellow-500">y</span>
                <span className="text-orange-500">J</span>
                <span className="text-sky-500">o</span>
                <span className="text-pink-500">y</span>
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-widest mt-0.5">Play • Learn • Grow</span>
            </Link>

            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for toys, games, brands..." 
                  className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-12 outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-sm font-medium text-slate-700"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 bg-pink-500 hover:bg-pink-600 transition-colors text-white px-5 rounded-full font-semibold flex items-center justify-center"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <Link href="/wishlist" className="flex items-center gap-1.5 text-slate-700 hover:text-pink-500 transition-colors font-semibold text-sm relative cursor-pointer">
                <div className="relative">
                  <Heart size={22} />
                  {displayWishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                      {displayWishlistCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">Wishlist</span>
              </Link>
              
              <Link href="/shop" className="flex items-center gap-1.5 text-slate-700 hover:text-pink-500 transition-colors font-semibold text-sm">
                <User size={22} />
                <span className="hidden lg:inline">Account</span>
              </Link>

              <Link href="/cart" className="flex items-center gap-1.5 text-slate-700 hover:text-pink-500 transition-colors font-semibold text-sm relative">
                <div className="relative">
                  <ShoppingCart size={22} />
                  {displayCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                      {displayCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">Cart</span>
              </Link>
            </div>

          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="mt-3 flex md:hidden">
            <div className="relative w-full flex items-center">
              <Search size={16} className="absolute left-3 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search toys..." 
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2 pl-9 pr-10 outline-none focus:ring-2 focus:ring-pink-500 text-xs font-medium"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 bg-pink-500 text-white px-3 rounded-full">
                <Search size={14} />
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex justify-center items-center space-x-6 lg:space-x-8 mt-4 pt-3 border-t border-slate-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm font-bold transition-all px-4 py-1 rounded-full ${
                    isActive 
                      ? 'bg-pink-500 text-white shadow-sm' 
                      : 'text-slate-700 hover:text-pink-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 shadow-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-xl text-sm font-bold ${
                    isActive ? 'bg-pink-500 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white font-sans text-slate-800 selection:bg-pink-500 selection:text-white">
        <CartProvider>
          <HeaderNav />
          <main className="min-h-screen">
            {children}
          </main>

          {/* 🌙 DARK THEME FOOTER 🌙 */}
          <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              
              {/* Brand Column */}
              <div>
                <Link href="/" className="text-3xl font-black tracking-tighter mb-4 inline-block">
                  <span className="text-sky-400">T</span><span className="text-pink-500">o</span><span className="text-yellow-400">y</span><span className="text-orange-400">J</span><span className="text-sky-400">o</span><span className="text-pink-500">y</span>
                </Link>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">Discover a world of toys that spark imagination, creativity, and endless fun for kids of all ages!</p>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-500 hover:text-white cursor-pointer transition-all font-bold">f</div>
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-400 hover:text-white cursor-pointer transition-all font-bold">t</div>
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-500 hover:text-white cursor-pointer transition-all font-bold">in</div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg border-b border-slate-800 pb-2">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/about" className="hover:text-pink-400 transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-pink-400 transition-colors">Contact Us</Link></li>
                  <li><Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-pink-400 transition-colors">Terms &amp; Conditions</Link></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg border-b border-slate-800 pb-2">Top Categories</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/shop" className="hover:text-pink-400 transition-colors">Action Figures</Link></li>
                  <li><Link href="/shop" className="hover:text-pink-400 transition-colors">Educational Toys</Link></li>
                  <li><Link href="/shop" className="hover:text-pink-400 transition-colors">Outdoor Play</Link></li>
                  <li><Link href="/shop" className="hover:text-pink-400 transition-colors">Board Games</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-bold text-white mb-4 text-lg border-b border-slate-800 pb-2">Contact Us</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-lg">📍</span>
                    <span>123 Toy Street, Magic World, Mumbai 400001</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-lg">📞</span>
                    <span>+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-lg">✉️</span>
                    <span>hello@toyjoy.com</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Copyright & Credit */}
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
              <p>© 2026 ToyJoy. All rights reserved.</p>
              <p className="text-slate-400 font-semibold flex items-center gap-1">
                Designed by <span className="text-pink-500 font-bold hover:underline cursor-pointer">TechnoBuzzSystems</span>
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
