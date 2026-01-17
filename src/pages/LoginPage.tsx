import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/my-sounds');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 transition-colors">
        <div className="text-center mb-8">
          <img 
            src="https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp" 
            alt="Praise FM USA" 
            className="h-10 mx-auto mb-6 dark:invert"
          />
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tighter uppercase">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400 font-normal text-sm mt-2 uppercase tracking-wide">Welcome back to Praise FM USA</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-[#ff6600] outline-none transition-all dark:text-white font-normal"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-[#ff6600] outline-none transition-all dark:text-white font-normal"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6600] hover:bg-black text-white font-medium py-5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span className="text-lg uppercase tracking-tight">Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-normal text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#ff6600] hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;