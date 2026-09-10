"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, Offer } from "../../services/api";
import { Tag, Copy, Check, ArrowRight, Sparkles, Flame } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    api.getOffers().then(setOffers);
  }, []);

  const handleCopy = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="w-full bg-[#0F1026] min-h-screen py-8 px-3 sm:px-4 md:px-5 lg:px-6 font-sans text-white">
      <div className="w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-[#20224A] text-[#FF4FA3] border border-[#3A3D70] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit mx-auto shadow-md">
            <Flame size={14} className="text-[#FF4FA3] animate-pulse" /> Limited Period Discounts
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2">
            Special Deals &amp; <span className="text-[#FFD447]">Promo Offers</span>
          </h1>
          <p className="text-[#D9DBF0] text-sm font-medium">
            Unlock exclusive coupons for toys, building sets, and STEM robotics kits across top sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-[0_8px_30px_rgba(124,60,255,0.25)] border border-[#3A3D70] hover:border-[#7C3CFF] flex flex-col justify-between relative overflow-hidden transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3CFF]/10 rounded-bl-full pointer-events-none" />

              <div className="relative z-10">
                <span className="bg-gradient-to-r from-[#FF8A3D] to-[#FF4FA3] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {offer.tag || "Hot Offer"}
                </span>

                <div className="text-4xl font-black text-[#FFD447] mt-4 mb-1">
                  {offer.discountPercent}% OFF
                </div>
                <h3 className="text-lg font-black text-white mb-2">{offer.title}</h3>
                <p className="text-[#D9DBF0] text-xs font-medium leading-relaxed mb-6">
                  {offer.description}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-[#3A3D70] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-[#171936] px-4 py-2.5 rounded-xl border border-dashed border-[#3A3D70] w-full sm:w-auto justify-between">
                  <span className="font-mono font-black text-[#FFD447] text-xs tracking-wider">{offer.code}</span>
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="text-[#28B8FF] hover:text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check size={14} className="text-[#48D597]" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>

                <Link
                  href="/products?onSale=true"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-5 py-2.5 rounded-full font-black text-xs transition-all shadow-md shadow-[#7C3CFF]/30 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  Shop Deal <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
