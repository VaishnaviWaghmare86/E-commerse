"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, AgeGroup } from "../../services/api";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AgePage() {
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);

  useEffect(() => {
    api.getAgeGroups().then(setAgeGroups);
  }, []);

  const getShumeeAgeTheme = (label: string, idx: number) => {
    const l = (label || "").toLowerCase();
    if (l.includes("0-1") || l.includes("0 - 1") || l.includes("0-2") || l.includes("0 - 2") || idx === 0) {
      return {
        badgeBg: "bg-amber-400 text-amber-950",
        iconGradient: "from-amber-400 to-amber-500",
        btnHover: "hover:bg-amber-500 hover:text-white",
      };
    }
    if (l.includes("1-3") || l.includes("1 - 3") || l.includes("2-4") || idx === 1) {
      return {
        badgeBg: "bg-sky-500 text-white",
        iconGradient: "from-sky-400 to-blue-500",
        btnHover: "hover:bg-sky-500 hover:text-white",
      };
    }
    if (l.includes("3-6") || l.includes("3 - 6") || l.includes("4-6") || idx === 2) {
      return {
        badgeBg: "bg-purple-700 text-white",
        iconGradient: "from-purple-600 to-indigo-700",
        btnHover: "hover:bg-purple-700 hover:text-white",
      };
    }
    return {
      badgeBg: "bg-lime-500 text-slate-950",
      iconGradient: "from-lime-500 to-emerald-600",
      btnHover: "hover:bg-emerald-600 hover:text-white",
    };
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 px-3 sm:px-4 md:px-5 lg:px-6 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-violet-100 text-violet-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-2xs">
            Developmentally Tailored 🎈
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-3 mb-2">
            Shop Toys by <span className="text-violet-700">Age Group</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            Find the perfect toys tailored to cognitive milestones, motor skills, and creative imagination.
          </p>
        </div>

        {/* 🌟 SHUMEE-INSPIRED MILESTONE BANNER 🌟 */}
        <div className="bg-gradient-to-r from-purple-100 via-violet-50 to-indigo-100 rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-purple-700">
              Child Development Philosophy
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#3B145E]">
              We Believe that Play is <span className="text-violet-700">90% Child</span> &amp; <span className="text-amber-600">10% Toy!</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              Every milestone matters. Our toys are scientifically chosen by educators to build curiosity, motor skills, problem solving, and confidence.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="bg-amber-400 text-amber-950 font-black text-xs px-4 py-2 rounded-full shadow-xs">0-1 Years</span>
            <span className="bg-sky-500 text-white font-black text-xs px-4 py-2 rounded-full shadow-xs">1-3 Years</span>
            <span className="bg-purple-700 text-white font-black text-xs px-4 py-2 rounded-full shadow-xs">3-6 Years</span>
            <span className="bg-lime-500 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-xs">6+ Years</span>
          </div>
        </div>

        {/* Age Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
          {ageGroups.map((ag, idx) => {
            const theme = getShumeeAgeTheme(ag.label, idx);
            return (
              <motion.div
                key={ag.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.iconGradient} text-white flex items-center justify-center text-2xl shadow-md mb-4`}>
                    {ag.icon || "🧸"}
                  </div>
                  <span className={`${theme.badgeBg} text-[11px] font-black px-3 py-1 rounded-full inline-block shadow-2xs`}>
                    {ag.label}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-3 mb-2">{ag.subtitle || ag.label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                    {ag.description}
                  </p>
                </div>

                <Link
                  href={`/products?ageGroup=${encodeURIComponent(ag.label)}`}
                  className={`w-full bg-slate-900 ${theme.btnHover} text-white py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 text-center shadow-sm`}
                >
                  Browse {ag.label} Toys <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
