"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Settings, Heart, Package, LogOut, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-[85vh] bg-[#0F1026] text-white flex flex-col pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C3CFF] to-[#9147FF] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#7C3CFF]/30 border border-[#9147FF]">
            U
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">My Profile</h1>
            <p className="text-[#D9DBF0] font-medium">Manage your ToyJoy account settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-[#20224A] p-4 rounded-3xl shadow-xl border border-[#3A3D70] flex flex-col gap-2 h-max">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] text-white rounded-xl font-bold text-sm shadow-md">
              <User size={18} /> Account Info
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-[#D9DBF0] hover:bg-[#171936] hover:text-[#FFD447] rounded-xl font-bold text-sm transition-colors">
              <Package size={18} /> My Orders
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-[#D9DBF0] hover:bg-[#171936] hover:text-[#FFD447] rounded-xl font-bold text-sm transition-colors">
              <Heart size={18} /> Wishlist
            </Link>
            <Link href="/rewards" className="flex items-center gap-3 px-4 py-3 text-[#D9DBF0] hover:bg-[#171936] hover:text-[#FFD447] rounded-xl font-bold text-sm transition-colors">
              <SparkleIcon /> Play Points
            </Link>
            <button className="flex items-center gap-3 px-4 py-3 text-[#FF4FA3] hover:bg-[#171936] hover:text-white rounded-xl font-bold text-sm transition-colors text-left mt-4 cursor-pointer">
              <LogOut size={18} /> Log Out
            </button>
          </div>

          {/* Main Content Area Placeholder */}
          <div className="md:col-span-2 bg-[#20224A] p-8 rounded-3xl shadow-xl border border-[#3A3D70] flex flex-col items-center justify-center text-center min-h-[400px]">
             <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-6xl mb-4">
               🛠️
             </motion.div>
             <h2 className="text-xl font-black text-white mb-2">Profile Dashboard Coming Soon</h2>
             <p className="text-[#D9DBF0] font-medium max-w-sm mb-6">
               We are currently wiring up the backend to display your real account information here!
             </p>
             <Link href="/shop" className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-[#7C3CFF]/30 transition-all active:scale-95">
               Continue Shopping
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  );
}
