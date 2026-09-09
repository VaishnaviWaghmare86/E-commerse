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

  const bgGradients = [
    "from-pink-500 to-rose-400",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-purple-500 to-indigo-500",
  ];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 px-3 sm:px-4 md:px-5 lg:px-6 font-sans">
      <div className="w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            Developmentally Tailored 🎈
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3 mb-2">
            Shop Toys by Age Group
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            Find the perfect toys tailored to cognitive milestones, motor skills, and creative imagination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
          {ageGroups.map((ag, idx) => (
            <motion.div
              key={ag.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgGradients[idx % bgGradients.length]} text-white flex items-center justify-center text-2xl shadow-md mb-4`}>
                  {ag.icon || "🧸"}
                </div>
                <span className="bg-slate-100 text-slate-700 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  {ag.subtitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 mb-2">{ag.label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                  {ag.description}
                </p>
              </div>

              <Link
                href={`/products?ageGroup=${encodeURIComponent(ag.label)}`}
                className="w-full bg-slate-900 hover:bg-pink-500 text-white py-3 rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 text-center"
              >
                Browse {ag.label} Toys <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
