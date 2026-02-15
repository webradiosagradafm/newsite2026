import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Radio, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      console.log('Usuário criado:', data);
      setSuccess(true);
      
      // Aguardar 2 segundos e redirecionar
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-4 font-medium uppercase tracking-widest text-[10px]">
            <Radio className="w-4 h-4" />
            <span>Join Our Community</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium uppercase tracking-tighter leading-none">
            Create Account
          </h1>
          <p className="text-gray-400 mt-4 text-sm font-normal uppercase tracking-wider">
            Start your journey with Praise FM USA
          </p>
        </div>
      </div>

      {/* Signup Form */}
      <div className="max-w-md mx-auto px-4 py-16">
        <form onSubmit={handleSignUp} className="space-y-8">
          {/* Success Message */}
          {success && (
            <div className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-regular uppercase tracking-widest text-green-600 dark:text-green-400">
                  Conta criada com sucesso! Redirecionando...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-regular uppercase tracking-widest text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
              <Mail className="w-3 h-3 mr-2" /> Email Address
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#ff6600] p-5 outline-none transition-all dark:text-white text-lg font-medium"
              placeholder="seu@email.com"
              disabled={loading || success}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
              <Lock className="w-3 h-3 mr-2" /> Password
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#ff6600] p-5 outline-none transition-all dark:text-white text-lg font-medium"
              placeholder="Mínimo 6 caracteres"
              disabled={loading || success}
              minLength={6}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
              <Lock className="w-3 h-3 mr-2" /> Confirm Password
            </label>
            <input 
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#ff6600] p-5 outline-none transition-all dark:text-white text-lg font-medium"
              placeholder="Digite a senha novamente"
              disabled={loading || success}
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#ff6600] text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center space-x-4 disabled:opacity-50 shadow-2xl active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Account Created</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-gray-200 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
              Already have an account?
            </p>
            <Link 
              to="/login"
              className="text-[#ff6600] text-[10px] font-black uppercase tracking-[0.3em] hover:underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-16 p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <div className="flex items-start space-x-5">
            <User className="w-6 h-6 text-[#ff6600]" />
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest dark:text-white">
                Secure Registration
              </h4>
              <p className="text-xs text-gray-500 mt-2 uppercase leading-relaxed font-normal">
                By creating an account, you'll be able to save your favorite songs, access exclusive content, and personalize your listening experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;