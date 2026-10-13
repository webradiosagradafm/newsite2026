import React, { useEffect, useState } from 'react'

const palettes: Record<string, [number, number, number]> = {
  rock: [151, 66, 86], chill: [168, 116, 155], flow: [183, 141, 72],
  worship: [78, 125, 164], morning: [183, 125, 100], insomnia: [88, 80, 153],
  country: [152, 113, 79], soul: [122, 76, 139], grace: [72, 105, 157],
  classics: [137, 116, 89], breakfast: [182, 131, 101]
}
function fallbackColor(title: string): [number, number, number] {
  const match = Object.keys(palettes).find(k => title.toLowerCase().includes(k))
  return match ? palettes[match] : [98, 112, 159]
}
function chicagoHour() {
  return Number(new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago', hour:'numeric', hourCycle:'h23'}).format(new Date()))
}
export default function AmbientBackground({ title, artwork }: {title: string; artwork?: string}) {
  const [color, setColor] = useState<[number,number,number]>(() => fallbackColor(title))
  const [hour, setHour] = useState(chicagoHour)
  useEffect(() => {
    let cancelled = false
    setColor(fallbackColor(title))
    if (!artwork) return
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 24
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(image, 0, 0, 24, 24)
        const pixels = ctx.getImageData(0, 0, 24, 24).data
        let r=0,g=0,b=0,n=0
        for(let i=0;i<pixels.length;i+=4){
          const [rr,gg,bb,a]=[pixels[i],pixels[i+1],pixels[i+2],pixels[i+3]]
          const lum=(rr+gg+bb)/3
          if(a<200 || lum<28 || lum>228) continue
          r+=rr;g+=gg;b+=bb;n++
        }
        if(n && !cancelled) setColor([Math.round(r/n),Math.round(g/n),Math.round(b/n)])
      } catch { /* CORS restrictions: keep program palette */ }
    }
    image.src = artwork
    return () => { cancelled=true }
  }, [title, artwork])
  useEffect(() => {const id=window.setInterval(()=>setHour(chicagoHour()),60000);return ()=>clearInterval(id)},[])
  const day = hour>=6 && hour<18
  const [r,g,b]=color
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[5000ms]" style={{
    background: `radial-gradient(ellipse at 18% 12%, rgba(${r},${g},${b},${day?0.17:0.20}) 0%, transparent 57%), radial-gradient(ellipse at 88% 90%, rgba(${b},${r},${g},${day?0.10:0.13}) 0%, transparent 55%)`,
  }}/>
}
