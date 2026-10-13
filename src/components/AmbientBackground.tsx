import React, { useEffect, useState } from 'react'

type RGB = [number, number, number]
const fallback: Record<string, RGB> = {
  rock: [161, 68, 90], chill: [181, 110, 151], flow: [199, 145, 62],
  worship: [68, 119, 176], morning: [210, 132, 92], insomnia: [103, 79, 174],
  country: [165, 119, 75], soul: [146, 80, 142], grace: [71, 104, 169],
  classics: [147, 113, 79], breakfast: [202, 140, 92]
}
const fallbackFor = (title: string): RGB => fallback[Object.keys(fallback).find(key => title.toLowerCase().includes(key)) || ''] || [105, 108, 173]
function hourInChicago() {
  return Number(new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago',hour:'2-digit',hourCycle:'h23'}).format(new Date()))
}
function extract(image: HTMLImageElement): RGB | null {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 48
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null
  context.drawImage(image, 0, 0, 48, 48)
  const pixels = context.getImageData(0, 0, 48, 48).data
  let r=0,g=0,b=0,weight=0
  for (let i=0;i<pixels.length;i+=4) {
    const rr=pixels[i], gg=pixels[i+1], bb=pixels[i+2], a=pixels[i+3]
    const hi=Math.max(rr,gg,bb), lo=Math.min(rr,gg,bb), chroma=hi-lo
    const light=(hi+lo)/2
    if (a<220 || light<32 || light>220 || chroma<16) continue
    const w=1+chroma/80
    r+=rr*w;g+=gg*w;b+=bb*w;weight+=w
  }
  return weight ? [Math.round(r/weight),Math.round(g/weight),Math.round(b/weight)] : null
}
export default function AmbientBackground({ title, artwork }: { title: string; artwork?: string }) {
  const [rgb, setRgb] = useState<RGB>(() => fallbackFor(title))
  const [hour, setHour] = useState(hourInChicago)
  useEffect(() => {
    let active = true
    setRgb(fallbackFor(title))
    if (!artwork) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try { const color=extract(img); if (active && color) setRgb(color) } catch { /* cross-origin canvas blocked: fallback */ }
    }
    img.src = artwork
    return () => { active = false }
  }, [title, artwork])
  useEffect(() => { const timer=window.setInterval(()=>setHour(hourInChicago()),60000);return ()=>window.clearInterval(timer) },[])
  const day = hour>=6 && hour<18
  const [r,g,b] = rgb
  // Colored gradients cover the whole page, but remain soft and low contrast.
  const main = `rgba(${r},${g},${b},${day ? .36 : .44})`
  const secondary = `rgba(${Math.round(b*.8)},${Math.round(r*.8)},${Math.round(g*.8)},${day ? .23 : .28})`
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0" style={{ background: day ? '#f0eef3' : '#181b29' }}/>
    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 95% 80% at 14% 14%, ${main}, transparent 83%), radial-gradient(ellipse 100% 100% at 90% 88%, ${secondary}, transparent 85%), linear-gradient(150deg, ${day?'#f5f0ef':'#201c30'} 0%, ${day?'#e8e8f1':'#101f31'} 100%)` }}/>
  </div>
}
