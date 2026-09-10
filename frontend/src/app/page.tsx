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
      color: "from-amber-300 via-pink-300 to-sky-300",
      btnBg: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
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
      color: "from-amber-300 via-rose-300 to-yellow-300",
      btnBg: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
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
    <div className="w-full font-sans bg-[#0F1026] text-white pb-16 overflow-hidden">
      
      {/* 🌟 FLOATING BACKGROUND PARTICLES (Crisp & Playful) 🌟 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <motion.div style={{ y: y1 }} className="absolute top-[12%] left-[4%] text-5xl opacity-25 drop-shadow-sm">🎈</motion.div>
        <motion.div style={{ y: y2 }} className="absolute top-[32%] right-[6%] text-6xl opacity-25 drop-shadow-sm">🧸</motion.div>
        <motion.div style={{ y: y1 }} className="absolute bottom-[25%] left-[10%] text-6xl opacity-20 drop-shadow-sm">⭐</motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-[15%] right-[12%] text-5xl opacity-20 drop-shadow-sm">🎨</motion.div>
      </div>

      {/* 🚀 FULL SCREEN HERO SLIDER (Dark Playful Toy World at Night) 🚀 */}
      <section className="w-full relative h-[60vh] sm:h-[68vh] md:h-[76vh] max-h-[760px] min-h-[460px] group cursor-pointer overflow-hidden select-none bg-[#0F1026]">
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
            {/* 🎬 Beautiful Animated Cartoon Playground Background Video / Image 🎬 */}
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

              {/* Reduced motion fallback image */}
              <img
                src={slides[currentSlide].image}
                alt="Hero Background"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Dark Transparent Overlay over Hero (rgba(8, 9, 25, 0.55)) for Crystal Clear Text */}
            <div className="absolute inset-0 bg-[#080919]/55 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1026]/80 via-[#0F1026]/40 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 relative z-10">
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-xl backdrop-blur-md bg-[#171936]/60 p-6 sm:p-8 rounded-3xl border border-[#3A3D70] shadow-2xl"
                >
                  {/* Lovable Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20224A]/90 text-white text-xs font-black shadow-lg mb-3.5 tracking-wide border border-[#3A3D70]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD447] animate-spin" style={{ animationDuration: '3s' }} />
                    <span>{slides[currentSlide].badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {slides[currentSlide].heading} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD447] via-[#FF4FA3] to-[#7C3CFF] drop-shadow-md">
                      {slides[currentSlide].highlight}
                    </span>
                  </h1>

                  <p className="text-[#D9DBF0] text-sm sm:text-base md:text-lg font-semibold mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] leading-relaxed">
                    {slides[currentSlide].subtitle}
                  </p>

                  <Link href="/shop" onClick={(e) => e.stopPropagation()}>
                    <motion.button 
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-8 py-3.5 rounded-full font-black text-sm sm:text-base shadow-[0_0_25px_rgba(124,60,255,0.45)] flex items-center gap-3 border border-white/20 transition-all cursor-pointer"
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#171936]/80 hover:bg-[#20224A] text-white hover:text-[#FF4FA3] p-3.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl z-20 cursor-pointer hover:scale-110 border border-[#3A3D70]"
          title="Previous Slide"
        >
          <ChevronLeft size={26} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#171936]/80 hover:bg-[#20224A] text-white hover:text-[#FF4FA3] p-3.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-xl z-20 cursor-pointer hover:scale-110 border border-[#3A3D70]"
          title="Next Slide"
        >
          <ChevronRight size={26} />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-[#171936]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#3A3D70]">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer shadow-md ${
                currentSlide === idx ? 'w-10 bg-[#FF4FA3] ring-2 ring-[#7C3CFF]' : 'w-3 bg-white/40 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 🌈 PLAYFUL TICKER BAR 🌈 */}
      <div className="bg-gradient-to-r from-[#171936] via-[#20224A] to-[#171936] border-y border-[#3A3D70] text-white py-3 shadow-inner overflow-hidden">
        <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-black tracking-wide">
          <div className="flex items-center gap-2">
            <span>🧸</span>
            <span className="text-[#D9DBF0]">100% Non-Toxic &amp; Child Safe Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD447]">⭐</span>
            <span className="text-white">Loved by 50,000+ Happy Kids</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFD447]">⚡</span>
            <span className="text-[#28B8FF]">2-Day Express Delivery in Metros</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>🎁</span>
            <span className="text-[#FF4FA3]">Surprise Gift with Every Order!</span>
          </div>
        </div>
      </div>

      {/* 🎪 SECTION 1: TOP CATEGORY CIRCLES BAR 🎪 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-6 md:py-8 relative z-10">
        <div className="flex items-center gap-2">
          
          <button className="hidden md:flex p-2.5 rounded-full bg-[#20224A] shadow-md border border-[#3A3D70] text-white hover:text-[#FFD447] hover:scale-105 transition-all cursor-pointer">
            <ChevronLeft size={20} />
          </button>

          <div className="flex-1 flex justify-between items-center overflow-x-auto py-2 no-scrollbar gap-4 md:gap-2 px-2">
            {categoriesList.map((cat, idx) => (
              <Link href={`/products?category=${encodeURIComponent(cat.name)}`} key={idx} className="flex flex-col items-center min-w-[85px] group">
                <motion.div 
                  whileHover={{ y: -6, scale: 1.08 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full p-1 shadow-md border-2 border-[#3A3D70] group-hover:border-[#7C3CFF] group-hover:shadow-[0_0_15px_rgba(124,60,255,0.5)] transition-all bg-[#20224A] flex items-center justify-center relative overflow-hidden"
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <span className="mt-2.5 text-xs font-extrabold text-white text-center group-hover:text-[#FFD447] transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>

          <button className="hidden md:flex p-2.5 rounded-full bg-[#20224A] shadow-md border border-[#3A3D70] text-white hover:text-[#FFD447] hover:scale-105 transition-all cursor-pointer">
            <ChevronRight size={20} />
          </button>

        </div>
      </section>

      {/* 🎯 SECTION: SHOP BY PRICE / BUDGET 🎯 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 md:py-6 relative z-10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD447] bg-[#20224A] border border-[#3A3D70] px-3.5 py-1 rounded-full inline-block mb-1.5 shadow-2xs">
            Pocket Friendly Play 🎈
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            There&apos;s a toy for every child
          </h2>
          <p className="text-[#D9DBF0] text-xs sm:text-sm font-medium mt-0.5">
            Discover developmentally tailored toys matching every budget
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "UNDER", amount: "700", maxPrice: 700, border: "hover:border-[#28B8FF]" },
            { label: "UNDER", amount: "900", maxPrice: 900, border: "hover:border-[#7C3CFF]" },
            { label: "UNDER", amount: "1200", maxPrice: 1200, border: "hover:border-[#FF4FA3]" },
            { label: "ABOVE", amount: "1200", minPrice: 1200, border: "hover:border-[#FFD447]" },
          ].map((tier, idx) => (
            <Link
              key={idx}
              href={tier.maxPrice ? `/products?maxPrice=${tier.maxPrice}` : `/products?minPrice=${tier.minPrice}`}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className={`bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-6 sm:p-7 text-center border border-[#3A3D70] ${tier.border} shadow-lg hover:shadow-[0_12px_30px_rgba(124,60,255,0.3)] transition-all flex flex-col items-center justify-between min-h-[190px] sm:min-h-[220px] cursor-pointer group`}
              >
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-black tracking-widest text-[#FF4FA3] block">
                    {tier.label}
                  </span>
                  <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    <span className="text-2xl sm:text-3xl align-top text-[#FFD447]">₹</span>{tier.amount}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] group-hover:from-[#9147FF] group-hover:to-[#FF4FA3] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_12px_rgba(124,60,255,0.4)] inline-flex items-center gap-1 transition-all">
                    SHOP NOW
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🎢 SECTION 2: 3 MIDDLE FEATURED BANNER CARDS 🎢 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Blue Sky Pilot Theme */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl h-[260px] relative overflow-hidden p-7 flex flex-col justify-between shadow-lg border border-[#3A3D70] hover:border-[#28B8FF] group cursor-pointer transition-all"
            >
              <div className="z-10 max-w-[65%]">
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                  Let <br />
                  <span className="text-[#28B8FF]">Imagination</span> <br />
                  Take Flight!
                </h2>
                <p className="text-[#D9DBF0] text-xs font-bold mb-4">Toys for every little dreamer</p>
                <span className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-5 py-2 rounded-full font-black text-xs shadow-md inline-flex items-center gap-1 transition-colors">
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
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl h-[260px] relative overflow-hidden p-7 flex flex-col justify-between shadow-lg border border-[#3A3D70] hover:border-[#FF4FA3] group cursor-pointer transition-all"
            >
              <div className="z-10 max-w-[65%]">
                <span className="bg-[#FF4FA3] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm mb-2 inline-block">
                  UPTO 50% OFF
                </span>
                <h2 className="text-xl md:text-2xl font-black text-[#FFD447] leading-tight mb-1">
                  SPECIAL OFFER
                </h2>
                <h3 className="text-3xl font-black text-white mb-1">
                  Top Trending Toys
                </h3>
                <p className="text-[#D9DBF0] text-xs font-bold mb-4">On Selected Handpicked Toys</p>
                <span className="bg-gradient-to-r from-[#FFD447] to-[#FF8A3D] text-slate-950 px-5 py-2 rounded-full font-black text-xs shadow-md inline-flex items-center gap-1 hover:brightness-110 transition-all">
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
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl h-[260px] relative overflow-hidden p-7 flex flex-col justify-between shadow-lg border border-[#3A3D70] hover:border-[#48D597] group cursor-pointer transition-all"
            >
              <div className="z-10 max-w-[65%]">
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                  Educational <br />
                  <span className="text-[#48D597]">Toys for a</span> <br />
                  Smarter Tomorrow!
                </h2>
                <p className="text-[#D9DBF0] text-xs font-bold mb-4">Fun Learning Bright Future</p>
                <span className="bg-gradient-to-r from-[#48D597] to-[#28B8FF] text-slate-950 px-5 py-2 rounded-full font-black text-xs shadow-md inline-flex items-center gap-1 hover:brightness-110 transition-all">
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

      {/* 🛡️ SECTION 3: TRUST BADGES BAR 🛡️ */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 relative z-10">
        <div className="bg-[#20224A] rounded-3xl p-4 shadow-lg border border-[#3A3D70] grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          
          <div className="flex items-center gap-3 p-2 border-r border-[#3A3D70] last:border-none">
            <div className="w-10 h-10 rounded-full bg-[#171936] border border-[#3A3D70] text-[#7C3CFF] flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-black text-white text-xs">Free Shipping</h4>
              <p className="text-[10px] text-[#A8ACCA] font-semibold">on orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-r border-[#3A3D70] last:border-none">
            <div className="w-10 h-10 rounded-full bg-[#171936] border border-[#3A3D70] text-[#28B8FF] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-black text-white text-xs">Safe &amp; Secure Payments</h4>
              <p className="text-[10px] text-[#A8ACCA] font-semibold">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-r border-[#3A3D70] last:border-none">
            <div className="w-10 h-10 rounded-full bg-[#171936] border border-[#3A3D70] text-[#FFD447] flex items-center justify-center flex-shrink-0">
              <RefreshCcw size={20} />
            </div>
            <div>
              <h4 className="font-black text-white text-xs">Easy Returns</h4>
              <p className="text-[10px] text-[#A8ACCA] font-semibold">Hassle free returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-r border-[#3A3D70] last:border-none">
            <div className="w-10 h-10 rounded-full bg-[#171936] border border-[#3A3D70] text-[#48D597] flex items-center justify-center flex-shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="font-black text-white text-xs">24/7 Support</h4>
              <p className="text-[10px] text-[#A8ACCA] font-semibold">We are here to help</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 col-span-2 md:col-span-1 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#171936] border border-[#3A3D70] text-[#FF4FA3] flex items-center justify-center flex-shrink-0">
              <Sun size={20} />
            </div>
            <div>
              <h4 className="font-black text-[#FF4FA3] text-xs">Happy Playtime!</h4>
              <p className="text-[10px] text-[#A8ACCA] font-semibold">Smiles guaranteed</p>
            </div>
          </div>

        </div>
      </section>

      {/* 🎪 SECTION 4: 5 BOTTOM CATEGORY CALLOUT CARDS 🎪 */}
      <section className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Card 1: Trending Toys */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-md border border-[#3A3D70] hover:border-[#FF4FA3] flex flex-col justify-between group cursor-pointer transition-all"
            >
              <div>
                <h4 className="font-black text-white text-sm">Trending Toys</h4>
                <div className="w-7 h-7 rounded-full bg-[#FF4FA3] text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform shadow-xs">
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

          {/* Card 2: New Arrivals */}
          <Link href="/new">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-md border border-[#3A3D70] hover:border-[#28B8FF] flex flex-col justify-between group cursor-pointer transition-all"
            >
              <div>
                <h4 className="font-black text-white text-sm">New Arrivals</h4>
                <div className="w-7 h-7 rounded-full bg-[#28B8FF] text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform shadow-xs">
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

          {/* Card 3: Best Sellers */}
          <Link href="/best-sellers">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-md border border-[#3A3D70] hover:border-[#FFD447] flex flex-col justify-between group cursor-pointer transition-all"
            >
              <div>
                <h4 className="font-black text-white text-sm">Best Sellers</h4>
                <div className="w-7 h-7 rounded-full bg-[#FFD447] text-slate-950 flex items-center justify-center mt-2 group-hover:scale-110 transition-transform shadow-xs">
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

          {/* Card 4: Outdoor Fun */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-md border border-[#3A3D70] hover:border-[#7C3CFF] flex flex-col justify-between group cursor-pointer transition-all"
            >
              <div>
                <h4 className="font-black text-white text-sm">Outdoor Fun</h4>
                <div className="w-7 h-7 rounded-full bg-[#7C3CFF] text-white flex items-center justify-center mt-2 group-hover:scale-110 transition-transform shadow-xs">
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

          {/* Card 5: Creative Play */}
          <Link href="/shop">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-4 h-[160px] relative overflow-hidden shadow-md border border-[#3A3D70] hover:border-[#48D597] flex flex-col justify-between group cursor-pointer transition-all"
            >
              <div>
                <h4 className="font-black text-white text-sm">Creative Play</h4>
                <div className="w-7 h-7 rounded-full bg-[#48D597] text-slate-950 flex items-center justify-center mt-2 group-hover:scale-110 transition-transform shadow-xs">
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

      {/* 📜 FOOTER TAGLINE 📜 */}
      <div className="mt-8 text-center text-xs font-bold text-[#A8ACCA] tracking-wider flex items-center justify-center gap-3">
        <span className="w-12 h-[1px] bg-[#3A3D70] inline-block"></span>
        <span>Toys Today Brighter Tomorrows ❤️</span>
        <span className="w-12 h-[1px] bg-[#3A3D70] inline-block"></span>
      </div>

    </div>
  );
}
