"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, Brand } from "../../services/api";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api.getBrands().then(setBrands);
  }, []);

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-pink-100 text-pink-700 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            Official Brand Partners 🌟
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3 mb-3">
            World-Famous Toy Brands
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            Explore authentic, certified collections from LEGO, Hot Wheels, Barbie, Melissa &amp; Doug, and Fisher-Price.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center">
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-extrabold text-sky-600 mb-1">
                  <ShieldCheck size={14} className="text-sky-500" />
                  <span>Verified Official Brand</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{brand.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                  {brand.description}
                </p>
              </div>

              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="w-full bg-slate-900 hover:bg-pink-500 text-white py-3 rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 text-center"
              >
                Shop {brand.name} Toys <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
