"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Sparkles, ChevronRight } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="min-h-[85vh] bg-amber-50 flex flex-col pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto w-full text-center">
        {/* Header */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full text-white shadow-xl mb-6">
          <Gift size={40} />
        </motion.div>
        
        <h1 className="text-4xl font-black text-slate-800 mb-4">ToyJoy Play Points</h1>
        <p className="text-slate-600 font-medium max-w-lg mx-auto mb-10 text-lg">
          Earn magical points on every purchase and unlock exclusive toys, early access, and huge discounts!
        </p>

        {/* Placeholder Content */}
        <div className="bg-white p-10 rounded-3xl shadow-md border border-amber-100 max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center">
             <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-5xl mb-6">
               👑
             </motion.div>
             <h2 className="text-2xl font-black text-amber-500 mb-2">Rewards Program Coming Soon!</h2>
             <p className="text-slate-500 font-medium max-w-sm mb-8">
               We are crafting the ultimate loyalty experience. Soon you'll be able to view and redeem your Play Points right here.
             </p>
             <Link href="/shop" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-md transition-all flex items-center justify-center gap-2 group">
               <span>Start Shopping</span>
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
