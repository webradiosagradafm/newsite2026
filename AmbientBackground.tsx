import React, { useEffect, useState } from 'react'

type RGB = [number, number, number]
const fallback: Record<string, RGB> = {
  rock: [176, 65, 84], chill: [187, 112, 147], flow: [218, 155, 60],
  worship: [64, 132, 195], morning: [225, 132, 73], insomnia: [109, 82, 182],
  country: [179, 124, 69], soul: [160, 76, 149], grace: [65, 106, 191],
  classics: [222, 118, 65], breakfast: [229, 149, 86]
}
function defaultColor(title: string): RGB {
  const key = Object.keys(fallback).find(k => title.toLowerCase().includes(k))
  return key ? fallback[key] : [100, 115, 186]
}
function sampleCover(img: HTMLImageElement): RGB | null {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, 64, 64)
  const data = ctx.getImageData(0, 0, 64, 64).data
  let red = 0, green = 0, blue = 0, weight = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const high = Math.max(r, g, b), low = Math.min(r, g, b)
    const saturation = high - low
    if (data[i + 3] < 220 || high < 65 || high > 245 || saturation < 36) continue
    const w = saturation / 40
    red += r * w; green += g * w; blue += b * w; weight += w
  }
  return weight ? [Math.round(red / weight), Math.round(green / weight), Math.round(blue / weight)] : null
}
export default function AmbientBackground({ title, artwork }: { title: string; artwork?: string }) {
  const [rgb, setRgb] = useState<RGB>(() => defaultColor(title))
  useEffect(() => {
    let active = true
    setRgb(defaultColor(title))
    if (!artwork) return () => { active = false }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try { const value = sampleCover(img); if (active && value) setRgb(value) }
      catch { /* Cloudinary CORS unavailable: use program-specific palette */ }
    }
    img.src = artwork
    return () => { active = false }
  }, [title, artwork])
  const [r, g, b] = rgb
  const primary = `rgba(${r},${g},${b},0.56)`
  const secondary = `rgba(${Math.round((r + b) / 2)},${Math.round((g + b) / 2)},${Math.round((b + 150) / 2)},0.48)`
  return (
    <div aria-hidden="true" className="praise-glow-root">
      <div className="praise-glow-orb praise-glow-orb-a" style={{ background: `radial-gradient(ellipse, ${primary} 0%, transparent 70%)` }} />
      <div className="praise-glow-orb praise-glow-orb-b" style={{ background: `radial-gradient(ellipse, ${secondary} 0%, transparent 70%)` }} />
      <div className="praise-glow-orb praise-glow-orb-c" style={{ background: `radial-gradient(ellipse, rgba(${r},${g},${b},.27) 0%, transparent 72%)` }} />
    </div>
  )
}
