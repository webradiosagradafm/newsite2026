
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = (
    searchParams.get('title') || 'Praise FM USA'
  ).slice(0, 100)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          padding: '64px',
          boxSizing: 'border-box',
          color: '#ffffff',
          background:
            'linear-gradient(135deg, #10152f 0%, #24205b 55%, #642b86 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: '#d7c5ff',
            marginBottom: 24,
            letterSpacing: '3px',
          }}
        >
          PRAISE FM USA
        </div>

        <div
          style={{
            display: 'flex',
            maxWidth: '1000px',
            fontSize: title.length > 55 ? 48 : 64,
            fontWeight: 800,
            lineHeight: 1.15,
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 24,
            color: '#e5e7eb',
          }}
        >
          Faith • Music • Community
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 36,
            right: 64,
            fontSize: 20,
            color: '#d7c5ff',
          }}
        >
          praisefmradio.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
