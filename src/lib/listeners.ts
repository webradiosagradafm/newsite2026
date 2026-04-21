import { supabase } from './supabase'

let heartbeatInterval: number | null = null
let unloadBound = false

const getListenerId = (): string => {
  let listenerId = localStorage.getItem('listener_id')
  if (!listenerId) {
    listenerId = crypto.randomUUID()
    localStorage.setItem('listener_id', listenerId)
  }
  return listenerId
}

const getListenerInfo = async () => {
  const userAgent = navigator.userAgent

  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)

  let device = 'Desktop'
  if (isMobile) device = 'Mobile'
  if (isTablet) device = 'Tablet'

  let browser = 'Unknown'
  if (userAgent.includes('Edg')) browser = 'Edge'
  else if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'

  const referrer = document.referrer || 'Direct'

  let country = 'Unknown'
  let city = 'Unknown'

  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    country = data?.country_name || 'Unknown'
    city = data?.city || 'Unknown'
  } catch {}

  return {
    country,
    city,
    device,
    browser,
    referrer,
  }
}

export const connectListener = async () => {
  const listenerId = getListenerId()
  const listenerInfo = await getListenerInfo()

  const upsertListener = async () => {
    const now = new Date().toISOString()

    const { error } = await supabase.from('listeners_now').upsert({
      id: listenerId,
      country: listenerInfo.country,
      city: listenerInfo.city,
      device: listenerInfo.device,
      browser: listenerInfo.browser,
      referrer: listenerInfo.referrer,
      connected_at: now,
      last_seen: now,
    })

    if (error) {
      console.error('Listener upsert error:', error)
    }
  }

  await upsertListener()

  if (heartbeatInterval) {
    window.clearInterval(heartbeatInterval)
  }

  heartbeatInterval = window.setInterval(async () => {
    const { error } = await supabase
      .from('listeners_now')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', listenerId)

    if (error) {
      console.error('Listener heartbeat error:', error)
    }
  }, 15000)

  const cleanupOnUnload = async () => {
    try {
      await supabase.from('listeners_now').delete().eq('id', listenerId)
    } catch {}
  }

  if (!unloadBound) {
    window.addEventListener('beforeunload', cleanupOnUnload)
    unloadBound = true
  }
}