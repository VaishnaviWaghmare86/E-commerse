import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, ShieldCheck, AlertCircle, Sparkles, Store } from 'lucide-react';

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
        showToast('Login successful! Welcome to the Admin Panel.', 'success');
        const origin = (location.state as any)?.from?.pathname || '/admin/dashboard';
        navigate(origin, { replace: true });
      } else {
        setError(result.message || 'Invalid username/email or password.');
      }
    }, 400);
  };

  const setAdminCredentials = () => {
    setIdentifier('admin');
    setPassword('admin123');
    setError(null);
  };

  const setShopkeeperCredentials = () => {
    setIdentifier('shopkeeper');
    setPassword('shopkeeper123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f8f4ff] to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7e14ff] to-[#47bfff] flex items-center justify-center text-white font-extrabold text-2xl shadow-md mb-3">
            K
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">KidsPlay Admin</h2>
          <span className="text-xs font-semibold text-[#7e14ff] tracking-widest uppercase mt-0.5">
            Secure Portal Access
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Sign in with an authorized Admin or Shopkeeper account
          </p>
        </div>

        {/* Quick-Fill Credentials Switcher */}
        <div className="mb-6 p-3 bg-violet-50/70 border border-violet-100 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#7e14ff]" />
            <span>Select Authorized Role to Test:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={setAdminCredentials}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                identifier === 'admin'
                  ? 'bg-[#7e14ff] text-white border-[#7e14ff] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-violet-50 hover:border-[#7e14ff]/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={setShopkeeperCredentials}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                identifier === 'shopkeeper'
                  ? 'bg-[#7e14ff] text-white border-[#7e14ff] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-violet-50 hover:border-[#7e14ff]/40'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shopkeeper</span>
            </button>
          </div>
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
            placeholder="admin or admin@kidsplaystore.com"
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
              Sign In to Admin Portal
            </Button>
          </div>
        </form>

        {/* Authority & Credentials Info */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
          <div className="flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">Admin Authority:</span>
            </div>
            <code className="text-[#7e14ff] font-mono bg-violet-50 px-1.5 py-0.5 rounded">
              admin / admin123
            </code>
          </div>
          <div className="flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold text-slate-700">Shopkeeper Authority:</span>
            </div>
            <code className="text-[#7e14ff] font-mono bg-violet-50 px-1.5 py-0.5 rounded">
              shopkeeper / shopkeeper123
            </code>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        © 2026 KidsPlay E-Commerce Store • Secured Multi-Role Administration
      </p>
    </div>
  );
};
