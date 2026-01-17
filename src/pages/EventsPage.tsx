import React, { useState } from 'react'
import {
  Calendar,
  MapPin,
  Ticket,
  Bell,
  Search,
} from 'lucide-react'

type EventItem = {
  date: string
  venue: string
  city: string
  link: string
}

type Artist = {
  name: string
  genre: string
  image: string
}

const ARTISTS: Artist[] = [
  {
    name: 'Brandon Lake',
    genre: 'Worship',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767583738/BRANDON_LAKE_nf7pyj.jpg',
  },
  {
    name: 'Elevation Worship',
    genre: 'Modern Worship',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/ELEVATION_WORSHIP_olxxoe.webp',
  },
  {
    name: 'Forrest Frank',
    genre: 'Indie Pop',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767583738/FORREST_FRANK_yyn2kz.jpg',
  },
  {
    name: 'Lauren Daigle',
    genre: 'Pop',
    image: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1767998578/LAUREN_DAIGLE_xe9ops.webp',
  },
]

const EventsPage: React.FC = () => {
  const [loadingArtist, setLoadingArtist] = useState<string | null>(null)
  const [events, setEvents] = useState<Record<string, EventItem[]>>({})

  const findEvents = (artistName: string) => {
    setLoadingArtist(artistName)

    // 🔧 MOCK (substitui Gemini / API externa)
    setTimeout(() => {
      setEvents((prev) => ({
        ...prev,
        [artistName]: [
          {
            date: 'Nov 15, 2025',
            venue: 'Madison Square Garden',
            city: 'New York, NY',
            link: 'https://www.ticketmaster.com',
          },
          {
            date: 'Dec 03, 2025',
            venue: 'Crypto.com Arena',
            city: 'Los Angeles, CA',
            link: 'https://www.ticketmaster.com',
          },
        ],
      }))
      setLoadingArtist(null)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* HERO */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[#ff6600] mb-4">
            <Ticket size={18} />
            <span className="text-xs tracking-widest uppercase">
              Live & Upcoming
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-medium uppercase tracking-tight">
            Music Events
          </h1>

          <p className="mt-6 max-w-2xl text-gray-400 uppercase text-sm tracking-wide">
            Discover upcoming worship concerts and Christian music events across the USA.
          </p>
        </div>
      </section>

      {/* LIST */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        {ARTISTS.map((artist) => (
          <div
            key={artist.name}
            className="flex flex-col md:flex-row bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/10"
          >
            {/* IMAGE */}
            <div className="md:w-1/3 aspect-square">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition"
              />
            </div>

            {/* CONTENT */}
            <div className="p-8 flex-1">
              <span className="text-[#ff6600] text-xs uppercase tracking-widest">
                {artist.genre}
              </span>

              <h2 className="text-3xl uppercase tracking-tight mt-2">
                {artist.name}
              </h2>

              <button
                onClick={() => findEvents(artist.name)}
                className="mt-6 inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#ff6600] hover:text-white transition"
              >
                <Search size={14} />
                {loadingArtist === artist.name ? 'Searching…' : 'Find Tickets'}
              </button>

              {/* EVENTS */}
              {events[artist.name] && (
                <div className="mt-8 space-y-4">
                  {events[artist.name].map((event, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row justify-between gap-4 border border-gray-100 dark:border-white/10 p-4 bg-white dark:bg-black"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="text-[#ff6600]" size={18} />
                        <div>
                          <p className="font-medium">{event.venue}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {event.date} · {event.city}
                          </p>
                        </div>
                      </div>

                      <a
                        href={event.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ff6600] text-xs uppercase tracking-widest flex items-center gap-1"
                      >
                        Buy Tickets
                        <MapPin size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default EventsPage
