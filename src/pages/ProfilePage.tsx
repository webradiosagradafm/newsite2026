import React from 'react'
import { ArrowLeft, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">
      <div className="bg-black text-white py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-8 text-[10px] font-medium uppercase tracking-[0.4em] group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <h1 className="text-5xl md:text-7xl font-medium uppercase tracking-tighter leading-none">
            Praise FM
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-10 text-center">
          <User className="w-14 h-14 mx-auto mb-6 text-[#ff6600]" />

          <h2 className="text-3xl font-medium uppercase tracking-tighter dark:text-white">
            Account Removed
          </h2>

          <p className="text-gray-500 mt-4 text-sm uppercase tracking-wide leading-relaxed">
            Praise FM no longer uses login, Supabase profiles, or avatar uploads.
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-8 bg-[#ff6600] text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage