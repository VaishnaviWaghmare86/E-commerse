"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }
      
      login(data.customer);
      router.push("/");
    } catch (err) {
      alert("Error connecting to server. Is the backend running?");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#0F1026] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Magical Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-24 left-16 text-4xl opacity-30">⭐</motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-24 right-1/4 text-4xl opacity-30">🚀</motion.div>
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-32 right-12 text-3xl opacity-30">🪄</motion.div>
      </div>

      <div className="max-w-4xl w-full bg-[#20224A] rounded-3xl shadow-2xl flex flex-col md:flex-row-reverse overflow-hidden relative z-10 border border-[#3A3D70]">
        
        {/* Right Side: Visual / Brand */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#171936] to-[#20224A] border-b md:border-b-0 md:border-l border-[#3A3D70] p-10 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF4FA3]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-8">
              <span className="text-4xl font-black tracking-tighter">
                <span className="text-[#FF4FA3]">Toy</span>
                <span className="text-[#FFD447]">J</span>
                <span className="text-[#28B8FF]">o</span>
                <span className="text-[#48D597]">y</span>
              </span>
            </Link>
            <h2 className="text-3xl font-black mb-4 leading-tight text-white">Join the ToyJoy Club! 🎈</h2>
            <p className="text-[#D9DBF0] font-medium text-sm leading-relaxed mb-8">
              Create an account to start earning Play Points, get early access to new toys, and enjoy faster checkouts.
            </p>
            
            <div className="hidden md:flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-[#171936] border border-[#3A3D70] flex items-center justify-center text-2xl shadow-sm">🎁</div>
              <div className="w-12 h-12 rounded-full bg-[#171936] border border-[#3A3D70] flex items-center justify-center text-2xl shadow-sm">🏎️</div>
              <div className="w-12 h-12 rounded-full bg-[#171936] border border-[#3A3D70] flex items-center justify-center text-2xl shadow-sm">🧸</div>
            </div>
          </div>
        </div>

        {/* Left Side: Signup Form */}
        <div className="w-full md:w-1/2 p-10 md:p-12 bg-[#20224A]">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white mb-2">Create Your Account</h3>
            <p className="text-sm text-[#D9DBF0] font-medium">Already have an account? <Link href="/login" className="text-[#28B8FF] hover:text-[#FFD447] font-bold hover:underline">Log in</Link></p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D9DBF0] uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ACCA]" size={18} />
                <input 
                  type="text" 
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#171936] border border-[#3A3D70] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#7C3CFF] focus:ring-2 focus:ring-[#7C3CFF]/50 transition-all font-medium text-white placeholder-[#A8ACCA]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D9DBF0] uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ACCA]" size={18} />
                <input 
                  type="email" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full bg-[#171936] border border-[#3A3D70] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#7C3CFF] focus:ring-2 focus:ring-[#7C3CFF]/50 transition-all font-medium text-white placeholder-[#A8ACCA]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#D9DBF0] uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ACCA]" size={18} />
                <input 
                  type="password" 
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#171936] border border-[#3A3D70] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#7C3CFF] focus:ring-2 focus:ring-[#7C3CFF]/50 transition-all font-medium text-white placeholder-[#A8ACCA]"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#7C3CFF]/30 transition-all flex items-center justify-center gap-2 group mt-4 cursor-pointer active:scale-95">
              <span>Create Account</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-semibold text-[#A8ACCA]">
            By creating an account, you agree to ToyJoy&apos;s <Link href="#" className="text-[#D9DBF0] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#D9DBF0] hover:underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
