import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Heart, Send } from 'lucide-react'

interface PrayerRequest {
  id: number
  name: string | null
  message: string
  created_at: string
}

export default function PrayerWallPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fetching, setFetching] = useState(true)

  const fetchRequests = async () => {
    setFetching(true)
    const { data } = await supabase
      .from('prayer_requests')
      .select('id, name, message, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    setRequests(data || [])
    setFetching(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setLoading(true)

    const { error } = await supabase.from('prayer_requests').insert({
      name: name.trim() || null,
      message: message.trim(),
      approved: false
    })

    setLoading(false)

    if (!error) {
      setSubmitted(true)
      setName('')
      setMessage('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-10">
        <Heart className="w-10 h-10 text-orange-500 mx-auto mb-3" />
        <h1 className="text-3xl md:text-4xl font-black">Prayer Wall</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share a prayer request with our community. You can stay anonymous if you'd like.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-[#1A1A1A] rounded-2xl p-6 mb-12 space-y-4"
      >
        <div>
          <label className="block text-sm font-bold mb-1">
            Name <span className="text-gray-400 font-normal">(optional — leave blank to stay anonymous)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            maxLength={50}
            className="w-full rounded-xl px-4 py-2 bg-white dark:bg-[#0b0b0b] border border-gray-300 dark:border-white/10 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Prayer Request</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            maxLength={500}
            placeholder="Share what's on your heart..."
            className="w-full rounded-xl px-4 py-2 bg-white dark:bg-[#0b0b0b] border border-gray-300 dark:border-white/10 outline-none focus:border-orange-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-3 rounded-xl transition inline-flex items-center justify-center gap-2"
        >
          <Send size={18} />
          {loading ? 'Sending...' : 'Submit Prayer Request'}
        </button>

        {submitted && (
          <p className="text-sm text-center text-green-600 dark:text-green-400">
            Thank you — your request has been submitted and will appear after review.
          </p>
        )}
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">Community Prayer Requests</h2>

        {fetching ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No prayer requests yet. Be the first to share.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-gray-100 dark:bg-[#1A1A1A] rounded-xl p-4"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200">{r.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  — {r.name || 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}