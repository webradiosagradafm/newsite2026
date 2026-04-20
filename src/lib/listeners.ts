import { supabase } from './supabase'

let listenerId: string | null = null

export const connectListener = async () => {
  try {
    listenerId = crypto.randomUUID()

    await supabase.from('listeners_now').insert({
      id: listenerId,
    })

    // keep alive (a cada 20s)
    setInterval(() => {
      if (!listenerId) return

      supabase
        .from('listeners_now')
        .update({ connected_at: new Date().toISOString() })
        .eq('id', listenerId)
    }, 20000)

    // remove quando sair
    window.addEventListener('beforeunload', () => {
      if (!listenerId) return

      supabase
        .from('listeners_now')
        .delete()
        .eq('id', listenerId)
    })
  } catch (err) {
    console.error('Listener error:', err)
  }
}