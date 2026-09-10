"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, Brand } from "../../services/api";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const BRAND_FALLBACK_LOGOS: Record<string, string> = {
  lego: "/brands/lego.svg",
  "hot-wheels": "/brands/hot-wheels.svg",
  "hot wheels": "/brands/hot-wheels.svg",
  barbie: "/brands/barbie.svg",
  "fisher-price": "/brands/fisher-price.svg",
  "fisher price": "/brands/fisher-price.svg",
  nerf: "/brands/nerf.svg",
  "melissa & doug": "/brands/melissa-doug.svg",
  "melissa-and-doug": "/brands/melissa-doug.svg",
  "melissa and doug": "/brands/melissa-doug.svg",
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api.getBrands().then(setBrands);
  }, []);

  const getLogoSrc = (brand: Brand) => {
    const key = (brand.slug || brand.name || "").toLowerCase();
    const fallback = BRAND_FALLBACK_LOGOS[key] || "/brands/lego.svg";
    if (!brand.logo || brand.logo.includes("placeholder") || brand.logo.includes("broken")) {
      return fallback;
    }
    return brand.logo;
  };

  return (
    <div className="w-full bg-[#0F1026] min-h-screen py-8 px-3 sm:px-4 md:px-5 lg:px-6 font-sans text-white">
      <div className="w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-[#20224A] text-[#FF4FA3] border border-[#3A3D70] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block shadow-md">
            Official Brand Partners 🌟
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2">
            World-Famous <span className="text-[#FFD447]">Toy Brands</span>
          </h1>
          <p className="text-[#D9DBF0] text-sm font-medium">
            Explore authentic, certified collections from LEGO, Hot Wheels, Barbie, Melissa &amp; Doug, and Fisher-Price.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
          {brands.map((brand, idx) => {
            const key = (brand.slug || brand.name || "").toLowerCase();
            const fallback = BRAND_FALLBACK_LOGOS[key] || "/brands/lego.svg";

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-6 shadow-lg hover:shadow-[0_8px_30px_rgba(124,60,255,0.25)] border border-[#3A3D70] hover:border-[#7C3CFF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-[#3A3D70] mb-4 flex items-center justify-center p-2 shadow-sm">
                    <img 
                      src={getLogoSrc(brand)} 
                      alt={brand.name} 
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#28B8FF] mb-1">
                    <ShieldCheck size={14} className="text-[#28B8FF]" />
                    <span>Verified Official Brand</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{brand.name}</h3>
                  <p className="text-[#D9DBF0] text-xs leading-relaxed mb-6 font-medium">
                    {brand.description}
                  </p>
                </div>

                <Link
                  href={`/products?brand=${encodeURIComponent(brand.name)}`}
                  className="w-full bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 text-center shadow-md shadow-[#7C3CFF]/30 active:scale-95"
                >
                  Shop {brand.name} Toys <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
