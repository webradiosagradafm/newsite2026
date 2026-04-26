import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TUNEIN_DEFAULT = 2 // pode manter ou remover depois

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

  return (
    <div className="flex items-center space-x-2">
      {/* LIVE DOT */}
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

      <span className="text-[10px] uppercase tracking-widest text-[#ff6600]">
        Live Now
      </span>
    </div>
  )
}
