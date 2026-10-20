import { ImageResponse } from '@vercel/og'

const el = (style: Record<string, unknown>, children: unknown) => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
})

export default function handler(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'Praise FM USA').slice(0, 100)

  const tree = el(
    {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      padding: '64px',
      boxSizing: 'border-box',
      color: '#ffffff',
      background:
        'linear-gradient(135deg, #10152f 0%, #24205b 55%, #642b86 100%)',
      fontFamily: 'Arial, sans-serif',
    },
    [
      el(
        {
          fontSize: 24,
          fontWeight: 700,
          color: '#d7c5ff',
          marginBottom: 24,
          letterSpacing: '3px',
        },
        'PRAISE FM USA',
      ),
      el(
        {
          maxWidth: '1000px',
          fontSize: title.length > 55 ? 48 : 64,
          fontWeight: 800,
          lineHeight: 1.15,
        },
        title,
      ),
      el(
        { marginTop: 28, fontSize: 24, color: '#e5e7eb' },
        'Faith • Music • Community',
      ),
      el(
        {
          position: 'absolute',
          bottom: 36,
          right: 64,
          fontSize: 20,
          color: '#d7c5ff',
        },
        'praisefmradio.vercel.app',
      ),
    ],
  )

  return new ImageResponse(tree as any, { width: 1200, height: 630 })
}