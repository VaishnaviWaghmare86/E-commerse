"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AnimatedPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-sky-100 to-yellow-100 overflow-hidden relative">
      
      {/* Floating Background Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-20 left-20 text-6xl opacity-50"
      >
        🎈
      </motion.div>
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, 20, 0], rotate: [0, 180, 360] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute bottom-20 right-20 text-6xl opacity-50"
      >
        ⭐
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-40 right-40 text-4xl opacity-50"
      >
        ☁️
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
        className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white text-center z-10 max-w-lg"
      >
        <motion.div
          animate={{ rotateZ: [0, -5, 5, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500 mb-4">
            Magic in Progress! ✨
          </h1>
        </motion.div>
        <p className="text-slate-600 text-lg mb-8 font-medium">
          We are adding 3D animations and building this page right now! Check back soon for an amazing experience.
        </p>
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.1, boxShadow: "0px 10px 30px rgba(236, 72, 153, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold text-lg"
          >
            &larr; Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
