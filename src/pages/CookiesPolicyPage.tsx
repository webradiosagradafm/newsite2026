
import React from 'react';
import { FileText, ArrowLeft, ChevronRight, Cookie, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiesPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      <div className="bg-black text-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-8 text-[10px] font-medium uppercase tracking-[0.4em] group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center space-x-4 mb-6">
            <Cookie className="w-8 h-8 text-[#ff6600]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#ff6600]">Data Storage</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-medium uppercase tracking-tighter leading-none mb-6">Cookies<br />Policy</h1>
          <p className="text-gray-400 uppercase tracking-widest text-xs">Last Updated: January 20, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-normal leading-relaxed uppercase tracking-tight">
          <section className="mb-20">
            <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">What are Cookies?</h2>
            <p>Cookies are small text files stored on your device that help us provide a seamless experience. At Praise FM USA, we use them to remember your session and player preferences.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-20">
             <div className="bg-white dark:bg-[#111] p-10">
               <Shield className="w-6 h-6 text-[#ff6600] mb-6" />
               <h3 className="text-xl font-medium uppercase tracking-tight mb-4 dark:text-white">Essential Cookies</h3>
               <p className="text-sm text-gray-500 uppercase tracking-tight leading-relaxed">Required for account login (Supabase) and keeping you authenticated as you browse different programs.</p>
             </div>
             <div className="bg-white dark:bg-[#111] p-10">
               <Settings className="w-6 h-6 text-[#ff6600] mb-6" />
               <h3 className="text-xl font-medium uppercase tracking-tight mb-4 dark:text-white">Player Preferences</h3>
               <p className="text-sm text-gray-500 uppercase tracking-tight leading-relaxed">We store your volume level, dark/light theme choice, and recently played tracks locally on your browser.</p>
             </div>
          </div>

          <section className="mb-20">
            <h2 className="text-3xl font-medium uppercase tracking-tighter mb-8 dark:text-white border-b-2 border-black dark:border-white pb-4 inline-block">Managing Cookies</h2>
            <p>You can control or delete cookies through your browser settings. However, please note that disabling essential cookies will prevent you from signing in or saving your "My Sounds" library.</p>
          </section>
          
          <div className="p-8 bg-[#ff6600]/10 border-2 border-[#ff6600] text-center">
             <p className="text-black dark:text-white text-sm font-bold uppercase tracking-widest">We do not use third-party advertising cookies to track your behavior across other websites.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
