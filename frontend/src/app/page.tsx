"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCcw, Headphones, Sun, Sparkles, Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Home() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      video: "/videos/video1.mp4",
      image: "/videos/frame1.jpg",
      badge: "🎈 Play & Learn Together",
      heading: "Learn Through",
      highlight: "Play & Fun!",
      subtitle: "Outdoor adventures, joyful cartoon friends, and educational toys for bright growing minds.",
      cta: "Discover More",
      color: "from-pink-400 via-yellow-300 to-emerald-400",
      btnBg: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
    },
    {
      id: 2,
      video: "/videos/video2.mp4",
      image: "/videos/frame2.jpg",
      badge: "🏎️ Speed & Action Fun",
      heading: "The Great",
      highlight: "Toy Car Race!",
      subtitle: "Zoom into fun with high-speed RC racing cars, superhero tracks, and stunt vehicles.",
      cta: "Start Adventure",
      color: "from-sky-300 via-amber-300 to-emerald-300",
      btnBg: "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700",
    },
    {
      id: 3,
      video: "/videos/video3.mp4",
      image: "/videos/frame3.jpg",
      badge: "🦖 Magical Surprise Kingdom",
      heading: "Discover The",
      highlight: "Magical Dinosaur!",
      subtitle: "Unwrap pure joy with magical eggs, robot friends, and cuddly buddies with up to 50% OFF.",
      cta: "Grab Offers",
      color: "from-amber-300 via-pink-400 to-yellow-300",
      btnBg: "bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600",
    },
  ];

  // Auto-play Slider (9s rotation matching 10s video length)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  // CIRCULAR CATEGORIES (Reference Image 1:1)
  const categoryCircles = [
    { name: "Soft Toys", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&h=200&fit=crop", bg: "bg-orange-100" },
    { name: "Cars & Vehicles", img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop", bg: "bg-sky-100" },
    { name: "Building Blocks", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop", bg: "bg-amber-100" },
    { name: "Dolls & Playsets", img: "https://images.unsplash.com/photo-1558066126-25816c278fb1?w=200&h=200&fit=crop", bg: "bg-pink-100" },
    { name: "Baby Toys", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop", bg: "bg-purple-100" },
    { name: "Board Games", img: "https://images.unsplash.com/photo-1610890716171-6b1e0ce2d1dd?w=200&h=200&fit=crop", bg: "bg-emerald-100" },
    { name: "Arts & Crafts", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop", bg: "bg-rose-100" },
    { name: "Outdoor Toys", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop", bg: "bg-cyan-100" },
    { name: "Educational", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop", bg: "bg-blue-100" },
    { name: "Gift Sets", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop", bg: "bg-yellow-100" },
  ];

  const [categoriesList, setCategoriesList] = useState(categoryCircles);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const bgColors = [
            "bg-orange-100", "bg-sky-100", "bg-amber-100", "bg-pink-100",
            "bg-purple-100", "bg-emerald-100", "bg-rose-100", "bg-cyan-100",
            "bg-blue-100", "bg-yellow-100"
          ];
          const formatted = data.map((c: any, i: number) => ({
            name: c.name,
            img: c.image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&h=200&fit=crop",
            bg: bgColors[i % bgColors.length],
          }));
          setCategoriesList(formatted);
        }
      })
      .catch(() => console.log("Using static categories fallback"));
  }, []);

  return (
    <div className="w-full font-sans bg-[#fbf9f5] pb-16 overflow-hidden">
      
      {/* 🌟 FLOATING BACKGROUND PARTICLES (Crisp & Clean, No Blur) 🌟 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <motion.div style={{ y: y1 }} className="absolute top-[12%] left-[4%] text-5xl opacity-35 drop-shadow-sm">🎈</motion.div>
        <motion.div style={{ y: y2 }} className="absolute top-[32%] right-[6%] text-6xl opacity-35 drop-shadow-sm">🧸</motion.div>
        <motion.div style={{ y: y1 }} className="absolute bottom-[25%] left-[10%] text-6xl opacity-30 drop-shadow-sm">⭐</motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-[15%] right-[12%] text-5xl opacity-30 drop-shadow-sm">🎨</motion.div>
      </div>

      {/* 🚀 FULL SCREEN ULTRA-CRISP HERO SLIDER (Zero Blur & Kid Lovable) 🚀 */}
      <section className="w-full relative h-[60vh] sm:h-[68vh] md:h-[76vh] max-h-[760px] min-h-[460px] group cursor-pointer overflow-hidden select-none bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full overflow-hidden"
            onClick={() => router.push('/shop')}
          >
            {/* 🎬 Beautiful Animated Cartoon Playground Background Video 🎬 */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <video
                key={slides[currentSlide].video}
                className="hero-background-video absolute inset-0 w-full h-full object-cover object-center motion-reduce:hidden"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={slides[currentSlide].image}
                ref={(el) => {
                  if (el) {
                    el.defaultMuted = true;
                    el.muted = true;
                    el.play().catch(() => {});
                  }
                }}
              >
                <source src={slides[currentSlide].video} type="video/mp4" />
                {/* Fallback image if video cannot be played */}
                <img
                  src={slides[currentSlide].image}
                  alt="Hero Background"
                  className="w-full h-full object-cover object-center"
                />
              </video>

              {/* Reduced motion fallback image (for users who prefer reduced motion) */}
              <img
                src={slides[currentSlide].image}
                alt="Hero Background"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Soft Ambient Text Vignette (Keeps Characters 100% Bright & Text Crystal Clear!) */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10 pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-xl backdrop-blur-xs bg-slate-950/25 p-6 sm:p-8 rounded-3xl border border-white/25 shadow-2xl"
                >
                  {/* Lovable Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-black shadow-lg mb-3.5 tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>{slides[currentSlide].badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                    {slides[currentSlide].heading} <br/>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[currentSlide].color} drop-shadow-md`}>
                      {slides[currentSlide].highlight}
                    </span>
                  </h1>

                  <p className="text-white text-sm sm:text-base md:text-lg font-semibold mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] leading-relaxed">
                    {slides[currentSlide].subtitle}
                  </p>

                  <Link href="/shop" onClick={(e) => e.stopPropagation()}>
                    <motion.button 
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className={`${slides[currentSlide].btnBg} text-white px-8 py-3.5 rounded-full font-black text-sm sm:text-base shadow-2xl flex items-center gap-3 border-2 border-white/30 transition-all cursor-pointer`}
                    >
                      {slides[currentSlide].cta} <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Left/Right Buttons */}
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white text-slate-800 hover:text-pink-500 p-3.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl z-20 cursor-pointer hover:scale-110"
          title="Previous Slide"
        >
          <ChevronLeft size={26} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white text-slate-800 hover:text-pink-500 p-3.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl z-20 cursor-pointer hover:scale-110"
          title="Next Slide"
        >
          <ChevronRight size={26} />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer shadow-md ${
                currentSlide === idx ? 'w-10 bg-pink-500 ring-2 ring-white/60' : 'w-3 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 🌈 ADORABLE TICKER BAR (Attractive & Loved by Kids & Parents) 🌈 */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white py-3 shadow-inner overflow-hidden">
        <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-extrabold tracking-wide">
          <div className="flex items-center gap-2">
            <span>🧸</span>
            <span>100% Non-Toxic &amp; Child Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span>Loved by 50,000+ Happy Kids</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚀</span>
            <span>Super Fast Express Delivery</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>🎁</span>
            <span>Surprise Gift with Every Order!</span>
          </div>
        </div>
      </div>

      {/* 🎪 SECTION 1: TOP CATEGORY CIRCLES BAR (Matching Reference Image 100%) 🎪 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-6 md:py-8 relative z-10">
        <div className="flex items-center gap-2">
          
          <button className="hidden md:flex p-2.5 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-pink-500 hover:scale-105 transition-all">
            <ChevronLeft size={20} />
          </button>

          <div className="flex-1 flex justify-between items-center overflow-x-auto py-2 no-scrollbar gap-4 md:gap-2 px-2">
            {categoriesList.map((cat, idx) => (
              <Link href={`/products?category=${encodeURIComponent(cat.name)}`} key={idx} className="flex flex-col items-center min-w-[85px] group">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.08 }}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-1 shadow-md border-2 border-white group-hover:border-pink-400 transition-all ${cat.bg} flex items-center justify-center relative overflow-hidden`}
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <span className="mt-2.5 text-xs font-extrabold text-slate-800 text-center group-hover:text-pink-500 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>

          <button className="hidden md:flex p-2.5 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-pink-500 hover:scale-105 transition-all">
            <ChevronRight size={20} />
          </button>

        </div>
      </section>

      {/* 🎢 SECTION 2: 3 MIDDLE FEATURED BANNER CARDS (Matching Reference 1:1) 🎢 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Blue Sky Pilot Theme */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 rounded-3xl h-[260px] relative overflow-hidden p-7 flex flex-col justify-between shadow-md border border-sky-200 group cursor-pointer"
            >
              <div className="z-10 max-w-[65%]">
                <h2 className="text-2xl md:text-3xl font-black text-sky-900 leading-tight mb-2 tracking-tight">
                  Let <br />
                  <span className="text-pink-500">Imagination</span> <br />
                  Take Flight!
                </h2>
                <p className="text-slate-500 text-xs font-bold mb-4">Toys for every little dreamer</p>
                <span className="bg-pink-500 text-white px-5 py-2 rounded-full font-black text-xs shadow-md inline-flex items-center gap-1 group-hover:bg-pink-600 transition-colors">
                  Shop Now &rarr;
                </span>
              </div>
              <img 
                src="/jetpack.png" 
                alt="Pilot kid flying airplane"
                className="absolute -right-4 bottom-0 h-[105%] w-[65%] object-contain" 
              />
            </motion.div>
          </Link>

          {/* Card 2: Pink Special Offer Teddy Theme */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 rounded-3xl h-[260px] relative overflow-hidden p-7 flex flex-col justify-between shadow-md border border-pink-200 group cursor-pointer"
            >
              <div className="z-10 max-w-[65%]">
                <span className="bg-pink-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm mb-2 inline-block">
                  BIG FUN BIG SAVINGS
                </span>
                <h2 className="text-xl md:text-2xl font-black text-purple-900 leading-tight mb-1">
                  SPECIAL OFFER
                </h2>
                <h3 className="text-3xl font-black text-pink-600 mb-1">
                  Up to 50% OFF
                </h3>
                <p className="text-slate-500 text-xs font-bold mb-4">On Selected Toys</p>
                <span className="bg-yellow-400 text-slate-900 px-5 py-2 rounded-full font-black text-xs shadow-md inline-flex items-center gap-1 group-hover:bg-yellow-300 transition-colors">
                  Grab Deal &rarr;
                </span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&q=80" 
                alt="Fluffy Teddy Bear"
                className="absolute -right-4 bottom-0 h-[95%] w-[55%] object-cover rounded-l-full shadow-lg" 
              />
            </motion.div>
          </Link>

          {/* Card 3: Mint Educational Books & Girl Theme */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 rounded-3xl h-[260px] relative overflow-hidden p-7 flex flex-col justify-between shadow-md border border-emerald-200 group cursor-pointer"
            >
              <div className="z-10 max-w-[65%]">
                <h2 className="text-2xl md:text-3xl font-black text-teal-900 leading-tight mb-2 tracking-tight">
                  Educational <br />
                  <span className="text-emerald-600">Toys for a</span> <br />
                  Smarter Tomorrow!
                </h2>
                <p className="text-slate-500 text-xs font-bold mb-4">Fun Learning Bright Future</p>
                <span className="bg-emerald-600 text-white px-5 py-2 rounded-full font-black text-xs shadow-md inline-flex items-center gap-1 group-hover:bg-emerald-700 transition-colors">
                  Explore Now &rarr;
                </span>
              </div>
              <img 
                src="/drawing.png" 
                alt="Educational Play"
                className="absolute -right-6 bottom-0 h-[105%] w-[60%] object-cover rounded-l-3xl shadow-lg" 
              />
            </motion.div>
          </Link>

        </div>
      </section>

      {/* 🛡️ SECTION 3: TRUST BADGES BAR (5 Cards in 1 Row - Matching Reference) 🛡️ */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 relative z-10">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          
          <div className="flex items-center gap-3 p-2 border-r border-slate-100 last:border-none">
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-xs">Free Shipping</h4>
              <p className="text-[10px] text-slate-400 font-semibold">on orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-r border-slate-100 last:border-none">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-xs">Safe &amp; Secure Payments</h4>
              <p className="text-[10px] text-slate-400 font-semibold">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-r border-slate-100 last:border-none">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
              <RefreshCcw size={20} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-xs">Easy Returns</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Hassle free returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-r border-slate-100 last:border-none">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-xs">24/7 Support</h4>
              <p className="text-[10px] text-slate-400 font-semibold">We are here to help</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 col-span-2 md:col-span-1 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center flex-shrink-0">
              <Sun size={20} />
            </div>
            <div>
              <h4 className="font-black text-purple-600 text-xs">Happy Playtime!</h4>
              <p className="text-[10px] text-slate-400 font-semibold">Smiles guaranteed</p>
            </div>
          </div>

        </div>
      </section>

      {/* 🎪 SECTION 4: 5 BOTTOM CATEGORY CALLOUT CARDS (Matching Reference 1:1) 🎪 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Card 1: Trending Toys (Red Car) */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-pink-100 to-rose-50 rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-sm border border-pink-100 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <h4 className="font-black text-pink-600 text-sm">Trending Toys</h4>
                <div className="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=300&q=80" 
                alt="Sports Car" 
                className="absolute -right-2 -bottom-2 h-[80%] w-[65%] object-cover rounded-tl-2xl shadow-sm" 
              />
            </motion.div>
          </Link>

          {/* Card 2: New Arrivals (Dinosaur) */}
          <Link href="/new">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-sky-100 to-blue-50 rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-sm border border-sky-100 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <h4 className="font-black text-sky-600 text-sm">New Arrivals</h4>
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=300&q=80" 
                alt="Dinosaur" 
                className="absolute -right-2 -bottom-2 h-[80%] w-[65%] object-cover rounded-tl-2xl shadow-sm" 
              />
            </motion.div>
          </Link>

          {/* Card 3: Best Sellers (Teddy) */}
          <Link href="/best-sellers">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-amber-100 to-yellow-50 rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-sm border border-amber-100 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <h4 className="font-black text-amber-600 text-sm">Best Sellers</h4>
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80" 
                alt="Teddy Bear" 
                className="absolute -right-2 -bottom-2 h-[80%] w-[65%] object-cover rounded-tl-2xl shadow-sm" 
              />
            </motion.div>
          </Link>

          {/* Card 4: Outdoor Fun (Scooter) */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-100 to-indigo-50 rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-sm border border-purple-100 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <h4 className="font-black text-purple-600 text-sm">Outdoor Fun</h4>
                <div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300&q=80" 
                alt="Scooter" 
                className="absolute -right-2 -bottom-2 h-[80%] w-[65%] object-cover rounded-tl-2xl shadow-sm" 
              />
            </motion.div>
          </Link>

          {/* Card 5: Creative Play (Paint Palette) */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-emerald-100 to-teal-50 rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-sm border border-emerald-100 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <h4 className="font-black text-emerald-600 text-sm">Creative Play</h4>
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=80" 
                alt="Paint palette" 
                className="absolute -right-2 -bottom-2 h-[80%] w-[65%] object-cover rounded-tl-2xl shadow-sm" 
              />
            </motion.div>
          </Link>

        </div>
      </section>

      {/* 📜 FOOTER TAGLINE (Matching Reference Image) 📜 */}
      <div className="mt-8 text-center text-xs font-bold text-slate-400 tracking-wider flex items-center justify-center gap-3">
        <span className="w-12 h-[1px] bg-slate-200 inline-block"></span>
        <span>Toys Today Brighter Tomorrows ❤️</span>
        <span className="w-12 h-[1px] bg-slate-200 inline-block"></span>
      </div>

    </div>
  );
}
