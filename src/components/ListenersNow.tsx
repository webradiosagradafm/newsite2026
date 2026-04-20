import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TUNEIN_DEFAULT = 2 // 🔥 ALTERA MANUAL AQUI

export default function ListenersNow() {
  const [siteListeners, setSiteListeners] = useState(0)
  const [tuneInListeners, setTuneInListeners] = useState(TUNEIN_DEFAULT)

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const { data, error } = await supabase
          .from('listeners_now')
          .select('*')

        if (error) throw error

        setSiteListeners(data?.length || 0)
      } catch (err) {
        console.error('Fetch listeners error:', err)
      }
    }

    fetchListeners()

    const interval = setInterval(fetchListeners, 10000)

    return () => clearInterval(interval)
  }, [])

  const total = siteListeners + tuneInListeners

  return (
    <div className="flex items-center space-x-2">
      {/* LIVE DOT */}
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

      <div className="flex flex-col leading-tight text-right">
        <span className="text-[9px] uppercase tracking-widest text-gray-400">
          {siteListeners} site + {tuneInListeners} TuneIn
        </span>

        <span className="text-xs font-semibold text-white">
          {total} listening now
        </span>
      </div>
    </div>
  )
}