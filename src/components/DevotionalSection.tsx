import React from 'react';
import { Mic2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DevotionalSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#f8f8f8] dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center space-x-3 mb-6">
          <div className="p-2 bg-[#ff6600] rounded-lg">
            <Mic2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-medium uppercase tracking-tighter dark:text-white">
            Daily Devotional
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
          Start your day with spiritual encouragement. Listen to short, powerful devotionals 
          that strengthen your faith and draw you closer to God.
        </p>
        <button
          onClick={() => navigate('/devotional')}
          className="inline-flex items-center px-6 py-3 bg-[#ff6600] text-white font-bold uppercase text-sm tracking-wider rounded-full hover:bg-orange-600 transition-colors"
        >
          Listen Now <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </section>
  );
};

export default DevotionalSection;