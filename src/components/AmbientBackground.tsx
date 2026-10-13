import React, { useEffect, useState } from 'react'

type RGB = [number, number, number]
const fallback: Record<string, RGB> = {
  rock: [215, 65, 105], chill: [222, 126, 92], flow: [232, 143, 54],
  worship: [49, 155, 219], morning: [241, 105, 51], insomnia: [142, 79, 224],
  country: [210, 137, 65], soul: [190, 68, 178], grace: [96, 83, 214],
  classics: [234, 111, 52], breakfast: [234, 140, 66]
}
function defaultColor(title: string): RGB {
  const key = Object.keys(fallback).find(k => title.toLowerCase().includes(k))
  return key ? fallback[key] : [97, 115, 214]
}
function coverColor(img: HTMLImageElement): RGB | null {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 72
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, 72, 72)
  const pixels = ctx.getImageData(0, 0, 72, 72).data
  const buckets = Array.from({ length: 24 }, () => ({ r: 0, g: 0, b: 0, w: 0 }))
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
    if (pixels[i + 3] < 220 || max < 75 || d < 48 || max > 249) continue
    let h = 0
    if (d) {
      if (max === r) h = ((g - b) / d) % 6
      else if (max === g) h = (b - r) / d + 2
      else h = (r - g) / d + 4
      h = (h * 60 + 360) % 360
    }
    const bucket = buckets[Math.floor(h / 15) % 24]
    const w = Math.pow(d / 255, 1.5) * (max / 255)
    bucket.r += r * w; bucket.g += g * w; bucket.b += b * w; bucket.w += w
  }
  const best = buckets.sort((a, b) => b.w - a.w)[0]
  return best?.w > 0 ? [Math.round(best.r / best.w), Math.round(best.g / best.w), Math.round(best.b / best.w)] : null
}
function complementary([r,g,b]: RGB): RGB {
  return [Math.min(255, Math.round(b * .85 + 36)), Math.min(255, Math.round(r * .35 + g * .45 + 28)), Math.min(255, Math.round(g * .48 + b * .45 + 44))]
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
      try { const sampled = coverColor(img); if (active && sampled) setRgb(sampled) }
      catch { /* If image pixels cannot be read, retain the show palette. */ }
    }
    img.src = artwork
    return () => { active = false }
  }, [title, artwork])
  const [r,g,b] = rgb
  const [r2,g2,b2] = complementary(rgb)
  return (
    <div className="praise-glow-root" aria-hidden="true">
      <div className="praise-glow-orb praise-glow-orb-a" style={{ background: `radial-gradient(circle, rgba(${r},${g},${b},.88) 0%, rgba(${r},${g},${b},.30) 37%, transparent 70%)` }} />
      <div className="praise-glow-orb praise-glow-orb-b" style={{ background: `radial-gradient(circle, rgba(${r2},${g2},${b2},.75) 0%, rgba(${r2},${g2},${b2},.24) 42%, transparent 73%)` }} />
      <div className="praise-glow-orb praise-glow-orb-c" style={{ background: `radial-gradient(circle, rgba(${r},${g},${b},.62) 0%, transparent 68%)` }} />
    </div>
  )
}
