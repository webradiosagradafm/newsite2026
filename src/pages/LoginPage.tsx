import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Radio, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, HelpCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        // Mensagens de erro personalizadas
        if (loginError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique seus dados e tente novamente.');
        } else if (loginError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
        } else if (loginError.message.includes('User not found')) {
          setError('Usuário não encontrado. Você já criou uma conta?');
        } else {
          setError(loginError.message);
        }
        throw loginError;
      }

      console.log('Login successful:', data);
      // Redirecionar para a página inicial ou dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setResetSent(true);
      setTimeout(() => {
        setShowResetForm(false);
        setResetSent(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  // Validação de email básica
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center space-x-3 text-[#ff6600] mb-4 font-medium uppercase tracking-widest text-[10px]">
            <Radio className="w-4 h-4" />
            <span>Member Access</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium uppercase tracking-tighter leading-none">
            {showResetForm ? 'Reset Password' : 'Sign In'}
          </h1>
          <p className="text-gray-400 mt-4 text-sm font-normal uppercase tracking-wider">
            {showResetForm ? 'Enter your email to receive reset instructions' : 'Welcome back to Praise FM USA'}
          </p>
        </div>
      </div>

      {/* Login/Reset Form */}
      <div className="max-w-md mx-auto px-4 py-16">
        {!showResetForm ? (
          // LOGIN FORM
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="p-5 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-regular uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">
                    {error}
                  </p>
                  {error.includes('incorretos') && (
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                      <p className="text-[9px] font-medium uppercase tracking-wider text-red-500 mb-2">Dicas:</p>
                      <ul className="text-[9px] text-red-500 space-y-1 list-disc list-inside">
                        <li>Verifique se digitou o email corretamente</li>
                        <li>Certifique-se de que a senha está correta</li>
                        <li>Tente usar "Esqueci minha senha"</li>
                      </ul>
                    </div>
                  )}
                  {error.includes('não encontrado') && (
                    <Link 
                      to="/signup"
                      className="inline-block mt-3 text-[9px] font-black uppercase tracking-wider text-red-600 hover:underline"
                    >
                      → Criar conta agora
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
                <Mail className="w-3 h-3 mr-2" /> Email Address
              </label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  autoComplete="email"
                  className={`w-full bg-gray-50 dark:bg-white/5 border-2 ${
                    email && !isValidEmail(email) 
                      ? 'border-red-300 dark:border-red-800' 
                      : 'border-transparent focus:border-[#ff6600]'
                  } p-5 outline-none transition-all dark:text-white text-lg font-medium`}
                  placeholder="seu@email.com"
                  disabled={loading}
                />
                {email && !isValidEmail(email) && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </div>
              {email && !isValidEmail(email) && (
                <p className="text-[9px] text-red-500 uppercase tracking-wider">Email inválido</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center justify-between">
                <span className="flex items-center">
                  <Lock className="w-3 h-3 mr-2" /> Password
                </span>
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-[#ff6600] hover:underline text-[9px] font-medium normal-case tracking-normal"
                >
                  Esqueci minha senha
                </button>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#ff6600] p-5 pr-12 outline-none transition-all dark:text-white text-lg font-medium"
                  placeholder="••••••••"
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading || !isValidEmail(email)}
                className="w-full bg-[#ff6600] text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                Don't have an account?
              </p>
              <Link 
                to="/signup"
                className="text-[#ff6600] text-[10px] font-black uppercase tracking-[0.3em] hover:underline transition-all"
              >
                Create Account
              </Link>
            </div>
          </form>
        ) : (
          // PASSWORD RESET FORM
          <form onSubmit={handlePasswordReset} className="space-y-8">
            {/* Success Message */}
            {resetSent && (
              <div className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-regular uppercase tracking-widest text-green-600 dark:text-green-400">
                    Email enviado! Verifique sua caixa de entrada.
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
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button 
                type="submit"
                disabled={loading || !isValidEmail(email)}
                className="w-full bg-[#ff6600] text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center space-x-4 disabled:opacity-50 shadow-2xl active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetForm(false);
                  setError(null);
                  setResetSent(false);
                }}
                className="w-full bg-transparent text-gray-500 px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:text-black dark:hover:text-white transition-all"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Additional Info */}
        <div className="mt-16 p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <div className="flex items-start space-x-5">
            <HelpCircle className="w-6 h-6 text-[#ff6600] flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest dark:text-white mb-3">
                Problemas para entrar?
              </h4>
              <ul className="text-xs text-gray-500 space-y-2 uppercase leading-relaxed font-normal">
                <li>• Verifique se o email está correto</li>
                <li>• A senha tem no mínimo 6 caracteres</li>
                <li>• Confirme seu email após criar a conta</li>
                <li>• Use "Esqueci minha senha" se necessário</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <div className="flex items-start space-x-5">
            <Radio className="w-6 h-6 text-[#ff6600]" />
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest dark:text-white">
                Secure Login
              </h4>
              <p className="text-xs text-gray-500 mt-2 uppercase leading-relaxed font-normal">
                Your data is protected with Supabase authentication. We never store your password in plain text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;