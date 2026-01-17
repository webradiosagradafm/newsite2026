
import React, { useState, useEffect } from 'react';
import { MessageSquare, Music, Settings, Send, CheckCircle2, ArrowLeft, Headphones, Mic2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type FeedbackType = 'general' | 'music' | 'technical' | 'shoutout';

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [type, setType] = useState<FeedbackType>('general');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['general', 'music', 'technical', 'shoutout'].includes(typeParam)) {
      setType(typeParam as FeedbackType);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.message.trim()) {
        throw new Error("Please enter a message or track link before transmitting.");
      }

      const feedbackData = {
        user_id: user?.id || null,
        type: type,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        created_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('feedbacks')
        .insert([feedbackData]);

      if (dbError) throw dbError;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'general', label: 'Program Feedback', icon: Mic2, desc: 'Comment on our shows and presenters' },
    { id: 'music', label: 'Artist Submission', icon: Music, desc: 'Send your track for airplay consideration' },
    { id: 'technical', label: 'Technical Issue', icon: Settings, desc: 'Report bugs or streaming problems' },
    { id: 'shoutout', label: 'Send a Shoutout', icon: MessageSquare, desc: 'Message for someone special on air' },
  ];

  return (
    <div className="bg-white dark:bg-[#000] min-h-screen transition-colors duration-300">
      <div className="bg-black text-white py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/20 to-transparent opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white mb-10 text-[10px] font-medium uppercase tracking-[0.4em] group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Exit to Home
          </button>
          <h1 className="text-6xl md:text-8xl font-medium uppercase tracking-tighter leading-none mb-6">
            {type === 'music' ? 'Artist Submission' : 'Your Voice'}
          </h1>
          <p className="text-xl text-gray-400 font-normal uppercase tracking-tight max-w-xl">
            {type === 'music' 
              ? 'Join the next generation of worship. Our A&R team reviews every track sent through our system.'
              : 'Help us shape the future of Praise FM USA. Your voice directly influences our sound.'
            }
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Select Subject</h3>
            {categories.map((cat) => (
              <button
                key={cat.id}
                disabled={loading || submitted}
                onClick={() => setType(cat.id as FeedbackType)}
                className={`w-full text-left p-6 border-2 transition-all flex items-start space-x-5 ${
                  type === cat.id 
                    ? 'border-[#ff6600] bg-[#ff6600]/5 dark:bg-[#ff6600]/10' 
                    : 'border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white'
                } disabled:opacity-50`}
              >
                <cat.icon className={`w-6 h-6 mt-1 ${type === cat.id ? 'text-[#ff6600]' : 'text-gray-400'}`} />
                <div>
                  <h4 className="font-medium uppercase tracking-tighter text-xl dark:text-white">{cat.label}</h4>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-tight">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            {submitted ? (
              <div className="bg-[#ff6600] p-16 text-black flex flex-col items-center text-center animate-in zoom-in-95 duration-500 shadow-2xl">
                <CheckCircle2 className="w-20 h-20 mb-8" />
                <h2 className="text-5xl font-medium uppercase tracking-tighter leading-none mb-4">Transmission Successful</h2>
                <p className="text-black/60 text-lg font-normal uppercase tracking-tight max-w-sm">
                  {type === 'music' 
                    ? 'Your submission is now with our A&R team. If your sound fits our current rotation, we will be in touch.'
                    : 'Your input has been securely stored in our system. Thank you for contributing to Praise FM USA.'
                  }
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                  className="mt-10 border-2 border-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-[#ff6600] transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 bg-gray-50 dark:bg-[#111] p-10 md:p-16 border border-gray-100 dark:border-white/5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-6 flex items-start space-x-4 border-l-4 border-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Transmission Error</span>
                      <p className="text-xs font-medium mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name / Artist Name</label>
                    <input 
                      type="text" 
                      required
                      disabled={loading}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white dark:bg-black border-2 border-gray-100 dark:border-white/10 p-5 outline-none focus:border-[#ff6600] transition-colors dark:text-white font-medium disabled:opacity-50" 
                      placeholder="e.g. Maverick City Music"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Email</label>
                    <input 
                      type="email" 
                      required
                      disabled={loading}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white dark:bg-black border-2 border-gray-100 dark:border-white/10 p-5 outline-none focus:border-[#ff6600] transition-colors dark:text-white font-medium disabled:opacity-50" 
                      placeholder="management@artist.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {type === 'music' ? 'Track Information / SoundCloud or Drive Link' : 'Your Message'}
                  </label>
                  <textarea 
                    rows={6} 
                    required
                    disabled={loading}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white dark:bg-black border-2 border-gray-100 dark:border-white/10 p-5 outline-none focus:border-[#ff6600] transition-colors dark:text-white font-medium resize-none disabled:opacity-50" 
                    placeholder={type === 'music' ? "Please provide a private link to your track (SoundCloud, Dropbox, etc.) and a short bio..." : "Tell us what's on your mind..."}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#ff6600] text-white px-16 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl flex items-center justify-center space-x-4 disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span>Transmitting...</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>{type === 'music' ? 'Submit Track' : 'Transmit Feedback'}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
