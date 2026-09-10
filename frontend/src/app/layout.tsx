"use client";

import "./globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Search, User, Truck, ShieldCheck, RefreshCcw, HelpCircle, Menu, X, Sparkles, Package, Gift, LogOut } from "lucide-react";
import { CartProvider, useCart } from "../context/CartContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

function HeaderNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlistCount, toastMessage } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted ? cartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Toys", href: "/products" },
    { name: "Brands", href: "/brands" },
    { name: "Age Group", href: "/age" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "New Arrivals", href: "/new" },
    { name: "Offers", href: "/offers" },
  ];

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#20224A] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 text-sm animate-bounce border border-[#3A3D70]">
          <Sparkles className="text-[#FFD447]" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP STICKY HEADER WRAPPER */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${pathname === '/' ? 'bg-[#0F1026]/95 backdrop-blur-md border-b border-[#3A3D70]' : 'bg-[#0F1026] border-b border-[#3A3D70] shadow-lg'}`}>
        
        {/* 1. TOP DELIVERY BAR WITH RICH DARK-PURPLE GRADIENT */}
        <div className="bg-gradient-to-r from-[#24104F] to-[#3A176E] text-purple-100 text-xs py-2 shadow-xs border-b border-[#3A3D70]/40">
          <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 flex justify-between items-center">
            <div className="flex items-center gap-2 font-semibold">
              <Truck size={14} className="text-[#FFD447] shrink-0" />
              <span className="tracking-wide">⚡ 2 DAYS EXPRESS DELIVERY IN METROS • Free Shipping Above ₹999</span>
            </div>
            <div className="hidden md:flex items-center gap-4 lg:gap-6 font-semibold text-purple-200 text-xs">
              <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#48D597]"/> Safe &amp; Secure Checkout</div>
              <div className="flex items-center gap-1.5"><RefreshCcw size={14} className="text-[#28B8FF]"/> Easy Returns</div>
            </div>
          </div>
        </div>

        {/* 2. MAIN NAVBAR */}
        <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 md:py-3.5 bg-[#0F1026]">
          {/* Desktop Symmetrical Navbar (>= md) */}
          <div className="hidden md:flex relative items-center justify-between w-full">
            {/* Column 1 (Left Corner): ToyJoy Logo */}
            <div className="flex items-center justify-start shrink-0 z-10">
              <Link href="/" className="flex flex-col items-start leading-none shrink-0">
                <span className="text-3xl md:text-4xl font-black tracking-tighter">
                  <span className="text-sky-400">T</span>
                  <span className="text-pink-500">o</span>
                  <span className="text-yellow-400">y</span>
                  <span className="text-orange-400">J</span>
                  <span className="text-sky-400">o</span>
                  <span className="text-pink-500">y</span>
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-[#A8ACCA] tracking-widest mt-0.5">Play • Learn • Grow</span>
              </Link>
            </div>

            {/* Column 2 (DEAD CENTER - 50% Midpoint, Safe from Wishlist): Search Bar */}
            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center pointer-events-none z-10 w-full px-2">
              <div className="w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] xl:max-w-[420px] 2xl:max-w-[540px] pointer-events-auto">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative w-full flex items-center">
                    <Search size={18} className="absolute left-4 text-[#A8ACCA] pointer-events-none" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for toys, games, brands..." 
                      className="w-full bg-[#20224A] border border-[#3A3D70] rounded-full py-2.5 pl-11 pr-12 outline-none focus:ring-2 focus:ring-[#7C3CFF] focus:border-[#7C3CFF] transition-all text-sm font-medium text-white placeholder-[#A8ACCA]"
                    />
                    <button 
                      type="submit" 
                      className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] transition-all text-white px-5 rounded-full font-semibold flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(124,60,255,0.4)]"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Column 3 (Right Corner): Wishlist, Orders, Cart */}
            <div className="flex items-center justify-end z-10 shrink-0 space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6">
              <Link href="/wishlist" className="flex items-center gap-1.5 text-white hover:text-[#FF4FA3] transition-colors font-semibold text-sm relative cursor-pointer shrink-0">
                <div className="relative">
                  <Heart size={22} />
                  {displayWishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF4FA3] text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                      {displayWishlistCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline">Wishlist</span>
              </Link>
              
              {/* Login / Profile Dropdown */}
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-1.5 text-white hover:text-[#FF4FA3] transition-colors font-semibold text-sm py-2">
                  <User size={22} className="transform transition-transform group-hover:scale-110" />
                  <span className="hidden lg:inline">{user ? user.name.split(' ')[0] : 'Login'}</span>
                </div>

                {/* Hover Dropdown Menu */}
                <div className="absolute top-full right-[-50px] md:right-0 mt-2 w-64 bg-[#20224A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-[#3A3D70] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-3 group-hover:translate-y-0 overflow-hidden z-50">
                  {/* Header (Sign up & Login button) */}
                  {!user ? (
                    <div className="p-5 bg-[#171936] border-b border-[#3A3D70] flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#A8ACCA]">New customer?</span>
                        <Link href="/signup" className="text-[#FF4FA3] hover:text-pink-400 font-bold text-xs hover:underline transition-all">Sign Up</Link>
                      </div>
                      <Link href="/login" className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white text-center text-sm font-bold px-4 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg">
                        Login
                      </Link>
                    </div>
                  ) : (
                    <div className="p-5 bg-[#171936] border-b border-[#3A3D70] flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#A8ACCA] uppercase tracking-wider">Welcome back</span>
                      <span className="text-lg font-black text-white">{user.name}</span>
                      <span className="text-xs font-bold text-[#FFD447] flex items-center gap-1 mt-1">
                        <Gift size={12} /> {user.playPoints || 0} Play Points
                      </span>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="p-2 flex flex-col gap-1 bg-[#20224A]">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#282B59] rounded-xl text-sm font-bold text-[#D9DBF0] hover:text-[#FFD447] transition-colors">
                      <User size={16} className="text-[#A8ACCA]" /> My Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#282B59] rounded-xl text-sm font-bold text-[#D9DBF0] hover:text-[#FFD447] transition-colors">
                      <Package size={16} className="text-[#A8ACCA]" /> Orders
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#282B59] rounded-xl text-sm font-bold text-[#D9DBF0] hover:text-[#FFD447] transition-colors">
                      <Heart size={16} className="text-[#A8ACCA]" /> Wishlist
                    </Link>
                    <Link href="/rewards" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#282B59] rounded-xl text-sm font-bold text-[#D9DBF0] hover:text-[#FFD447] transition-colors">
                      <Gift size={16} className="text-[#A8ACCA]" /> Play Points
                    </Link>
                    {user && (
                      <>
                        <div className="h-px bg-[#3A3D70] my-1 mx-2"></div>
                        <button onClick={logout} className="flex items-center w-full gap-3 px-4 py-2.5 hover:bg-rose-900/30 rounded-xl text-sm font-bold text-rose-400 transition-colors text-left">
                          <LogOut size={16} /> Log Out
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Link href="/cart" className="flex items-center gap-1.5 text-white hover:text-[#FFD447] transition-colors font-semibold text-sm relative group">
                <div className="relative transform transition-transform group-hover:scale-110">
                  <ShoppingCart size={22} />
                  {displayCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF4FA3] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                      {displayCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Flex Layout (< md) */}
          <div className="flex md:hidden items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:text-[#FF4FA3] focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/" className="flex flex-col items-start leading-none shrink-0">
                <span className="text-2xl font-black tracking-tighter">
                  <span className="text-sky-400">T</span>
                  <span className="text-pink-500">o</span>
                  <span className="text-yellow-400">y</span>
                  <span className="text-orange-400">J</span>
                  <span className="text-sky-400">o</span>
                  <span className="text-pink-500">y</span>
                </span>
                <span className="text-[8px] font-bold text-[#A8ACCA] tracking-wider">Play • Learn • Grow</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/wishlist" className="text-white hover:text-[#FF4FA3] relative">
                <Heart size={22} />
                {displayWishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF4FA3] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    {displayWishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="text-white hover:text-[#FFD447] relative">
                <ShoppingCart size={22} />
                {displayCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF4FA3] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    {displayCartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="mt-2.5 flex md:hidden">
            <div className="relative w-full flex items-center">
              <Search size={16} className="absolute left-3 text-[#A8ACCA]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search toys..." 
                className="w-full bg-[#20224A] border border-[#3A3D70] rounded-full py-2 pl-9 pr-10 outline-none focus:ring-2 focus:ring-[#7C3CFF] text-xs font-medium text-white placeholder-[#A8ACCA]"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] text-white px-3 rounded-full flex items-center justify-center">
                <Search size={14} />
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex justify-center items-center space-x-4 lg:space-x-6 mt-3 pt-2.5 border-t border-[#3A3D70]/50 bg-[#171936] py-1.5 px-4 rounded-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm font-extrabold transition-all px-4 py-1.5 rounded-full ${
                    isActive 
                      ? 'bg-[#7C3CFF] text-white shadow-[0_0_15px_rgba(124,60,255,0.45)] ring-1 ring-[#9147FF]' 
                      : 'text-white hover:text-[#FFD447] hover:bg-[#20224A]'
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
          <div className="md:hidden bg-[#171936] border-t border-[#3A3D70] px-4 py-4 space-y-2 shadow-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-extrabold transition-colors ${
                    isActive ? 'bg-[#7C3CFF] text-white shadow-[0_0_12px_rgba(124,60,255,0.4)]' : 'text-white hover:bg-[#20224A] hover:text-[#FFD447]'
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
      <body className="antialiased bg-[#0F1026] font-sans text-white selection:bg-[#7C3CFF] selection:text-white">
        <AuthProvider>
          <CartProvider>
            <HeaderNav />
            <main className="min-h-screen bg-[#0F1026]">
              {children}
            </main>

          {/* 🌟 PLAYFUL DEEP DARK-PURPLE FOOTER (#090A18) 🌟 */}
          <footer className="bg-[#090A18] text-[#BFC2DC] border-t border-[#171936] pt-16 pb-8">
            <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              
              {/* Brand Column */}
              <div>
                <Link href="/" className="text-3xl font-black tracking-tighter mb-4 inline-block">
                  <span className="text-sky-400">T</span>
                  <span className="text-pink-500">o</span>
                  <span className="text-yellow-400">y</span>
                  <span className="text-orange-400">J</span>
                  <span className="text-sky-400">o</span>
                  <span className="text-pink-500">y</span>
                </Link>
                <p className="text-[#A8ACCA] text-sm mb-5 leading-relaxed max-w-xs">Discover a world of toys that spark imagination, creativity, and endless fun for kids of all ages!</p>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#171936] border border-[#3A3D70] flex items-center justify-center text-[#D9DBF0] hover:bg-[#FF4FA3] hover:text-white cursor-pointer transition-all font-bold">f</div>
                  <div className="w-9 h-9 rounded-full bg-[#171936] border border-[#3A3D70] flex items-center justify-center text-[#D9DBF0] hover:bg-[#28B8FF] hover:text-white cursor-pointer transition-all font-bold">t</div>
                  <div className="w-9 h-9 rounded-full bg-[#171936] border border-[#3A3D70] flex items-center justify-center text-[#D9DBF0] hover:bg-[#FF4FA3] hover:text-white cursor-pointer transition-all font-bold">in</div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-white mb-4 text-base border-b border-[#3A3D70] pb-2">Quick Links</h4>
                <ul className="space-y-2.5 text-sm text-[#D9DBF0]">
                  <li><Link href="/about" className="hover:text-[#FF4FA3] transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-[#FF4FA3] transition-colors">Contact Us</Link></li>
                  <li><Link href="/privacy" className="hover:text-[#FF4FA3] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#FF4FA3] transition-colors">Terms &amp; Conditions</Link></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-white mb-4 text-base border-b border-[#3A3D70] pb-2">Top Categories</h4>
                <ul className="space-y-2.5 text-sm text-[#D9DBF0]">
                  <li><Link href="/shop?category=Soft%20Toys" className="hover:text-[#FF4FA3] transition-colors">Soft Toys & Teddy Bears</Link></li>
                  <li><Link href="/shop?category=Educational" className="hover:text-[#FF4FA3] transition-colors">Educational Toys</Link></li>
                  <li><Link href="/shop?category=Outdoor%20Toys" className="hover:text-[#FF4FA3] transition-colors">Outdoor Play</Link></li>
                  <li><Link href="/shop?category=Board%20Games" className="hover:text-[#FF4FA3] transition-colors">Board Games</Link></li>
                  <li><Link href="/shop?category=Building%20Blocks" className="hover:text-[#FF4FA3] transition-colors">Building Blocks</Link></li>
                  <li><Link href="/shop?category=Cars%20%26%20Vehicles" className="hover:text-[#FF4FA3] transition-colors">Cars & Vehicles</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-bold text-white mb-4 text-base border-b border-[#3A3D70] pb-2">Contact Us</h4>
                <ul className="space-y-4 text-sm text-[#D9DBF0]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#FF4FA3] text-base mt-0.5">📍</span>
                    <span>123 Toy Street, Magic World, Mumbai 400001</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#FF4FA3] text-base">📞</span>
                    <span>+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#FF4FA3] text-base">✉️</span>
                    <span>hello@toyjoy.com</span>
                  </li>
                </ul>

                {/* Payment Methods */}
                <div className="mt-6 pt-4 border-t border-[#3A3D70]">
                  <p className="text-xs font-bold text-[#A8ACCA] mb-2">We Accept</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D9DBF0]">
                    <span className="bg-[#171936] border border-[#3A3D70] px-2.5 py-1 rounded">💳 Visa</span>
                    <span className="bg-[#171936] border border-[#3A3D70] px-2.5 py-1 rounded">💳 UPI</span>
                    <span className="bg-[#171936] border border-[#3A3D70] px-2.5 py-1 rounded">💳 COD</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Copyright & Credit */}
            <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 pt-8 border-t border-[#171936] flex flex-col md:flex-row justify-between items-center text-sm text-[#A8ACCA] gap-4">
              <p>© 2026 ToyJoy. All rights reserved.</p>
              <p className="text-[#A8ACCA] font-semibold flex items-center gap-1">
                Designed by <span className="text-[#FF4FA3] font-bold hover:underline cursor-pointer">TechnoBuzzSystems</span>
              </p>
            </div>
          </footer>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
