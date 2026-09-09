"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:5000/api\'}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }
      
      login(data.customer);
      router.push("/");
    } catch (err) {
      alert("Error connecting to server. Is the backend running?");
    }
  };

  return (
    <div className="min-h-[85vh] bg-sky-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Magical Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-10 text-4xl opacity-50">☁️</motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 right-20 text-4xl opacity-50">🎈</motion.div>
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 right-1/4 text-3xl opacity-40">🧸</motion.div>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 border border-white/50">
        
        {/* Left Side: Visual / Brand */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-400 to-blue-500 p-10 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-8">
              <span className="text-4xl font-black tracking-tighter bg-white text-transparent bg-clip-text drop-shadow-md">
                ToyJoy
              </span>
            </Link>
            <h2 className="text-3xl font-black mb-4 leading-tight">Welcome Back to the Magic! ✨</h2>
            <p className="text-blue-100 font-medium text-sm leading-relaxed mb-8">
              Log in to track your orders, view your wishlist, and earn Play Points on every magical purchase.
            </p>
            
            <div className="hidden md:flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm text-2xl">🚀</div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm text-2xl">🎨</div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm text-2xl">🧩</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 bg-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Login to Your Account</h3>
            <p className="text-sm text-slate-500 font-medium">New to ToyJoy? <Link href="/signup" className="text-pink-500 hover:text-pink-600 font-bold hover:underline">Create an account</Link></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-sky-300 focus:bg-white transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-bold text-sky-500 hover:text-sky-600">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-sky-300 focus:bg-white transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-4">
              <span>Login to ToyJoy</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-semibold text-slate-400">
            By logging in, you agree to ToyJoy's <Link href="/terms" className="text-slate-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-slate-500 hover:underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
