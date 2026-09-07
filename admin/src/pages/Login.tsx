import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, Key, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      setLoading(false);

      if (result.success) {
        showToast('Login successful! Welcome to KidsPlay.', 'success');
        // If a shopkeeper logs in here, direct to vendor portal
        const isVendorUser = result.role === 'VENDOR';
        const defaultDest = isVendorUser ? '/vendor-portal' : '/admin/dashboard';
        const origin = (location.state as any)?.from?.pathname || defaultDest;
        navigate(origin, { replace: true });
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setIdentifier('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f8f4ff] to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
        <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <span>🏬</span>
            <span>Are you a Toy Shopkeeper?</span>
          </div>
          <Link
            to="/vendor/login"
            className="font-black text-rose-600 hover:text-rose-700 underline text-xs"
          >
            Shopkeeper Portal &rarr;
          </Link>
        </div>
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7e14ff] to-[#47bfff] flex items-center justify-center text-white font-extrabold text-2xl shadow-md mb-3">
            K
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">KidsPlay Admin</h2>
          <span className="text-xs font-semibold text-[#7e14ff] tracking-widest uppercase mt-0.5">
            Admin Panel Login
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Enter your credentials to access store management
          </p>
        </div>

        {/* Credentials Callout & Quick Fill */}
        <div className="mb-6 p-3 bg-violet-50/70 border border-violet-100 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#7e14ff] shrink-0" />
            <div className="text-slate-700">
              <span className="font-semibold">Admin Credentials:</span>
              <p className="font-mono text-[11px] text-[#7e14ff]">admin / admin123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1 text-[11px] font-semibold text-[#7e14ff] bg-white border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            Auto Fill
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Username or Email"
            type="text"
            placeholder="admin"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError(null);
            }}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full text-xs font-semibold py-2.5"
              isLoading={loading}
            >
              Sign In to Admin Panel
            </Button>
          </div>
        </form>
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        © 2026 KidsPlay E-Commerce Store • Admin Panel
      </p>
    </div>
  );
};
