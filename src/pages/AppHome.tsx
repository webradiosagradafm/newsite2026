import { ProgramCarousel } from '../components/ProgramCarousel'

export default function AppHome() {
  const programs = [
    {
      id: '1',
      title: 'Praise FM Worship',
      image: '/covers/worship.jpg',
      start: '18:00',
      end: '20:00'
    },
    {
      id: '2',
      title: 'Night Praise',
      image: '/covers/night.jpg',
      start: '20:00',
      end: '22:00'
    },
    {
      id: '3',
      title: 'Midnight with God',
      image: '/covers/midnight.jpg',
      start: '00:00',
      end: '06:00'
    }
  ]

  return (
    <main className="bg-black min-h-screen text-white">
      <header className="text-center py-6">
        <h1 className="text-3xl font-bold">
          PRAISE FM <span className="text-orange-500">USA</span>
        </h1>
      </header>

      <ProgramCarousel programs={programs} />

      <section className="px-4">
        <h2 className="text-xl font-semibold mb-3">
          Continue Listening
        </h2>

        {/* Aqui você pode repetir cards estilo BBC */}
      </section>
    </main>
  )
}
