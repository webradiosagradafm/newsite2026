import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore'
import { ArrowLeft, Clock, Play } from 'lucide-react'

import { db } from '../firebase'

interface Episode {
  id: string
  title: string
  presenter: string
  description: string
  duration: string
  date: string
  audioUrl: string
  image: string
}

interface ProgramData {
  title: string
  presenter: string
  description: string
  image: string
  start: string
  end: string
}

const DEFAULT_COVER = '/logo.png'

export default function ProgramEpisodesPage() {
  const { slug } = useParams()

  const [program, setProgram] = useState<ProgramData | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgramAndEpisodes = async () => {
      if (!slug) return

      try {
        setLoading(true)

        const programRef = doc(db, 'programs', slug)
        const programSnap = await getDoc(programRef)

        if (programSnap.exists()) {
          setProgram(programSnap.data() as ProgramData)
        }

        const episodesRef = collection(
          db,
          'programs',
          slug,
          'episodes'
        )

        const q = query(episodesRef, orderBy('date', 'desc'))
        const snapshot = await getDocs(q)

        const episodeData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        })) as Episode[]

        setEpisodes(episodeData)
      } catch (error) {
        console.error('Error loading program episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgramAndEpisodes()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        Loading program...
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        Program not found.
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-500 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Programs
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-center">
          <div className="rounded-[2rem] overflow-hidden bg-[#151515] shadow-2xl">
            <img
              src={program.image || DEFAULT_COVER}
              alt={program.title}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_COVER
              }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                Program
              </span>

              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                <Clock size={15} />
                {program.start} - {program.end}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-4">
              {program.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              with <strong>{program.presenter}</strong>
            </p>

            <p className="text-gray-400 max-w-3xl leading-relaxed text-lg">
              {program.description}
            </p>
          </div>
        </section>

        <section className="mt-14 md:mt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black">
                Episodes
              </h2>

              <p className="text-gray-400 mt-2">
                Listen again to the latest episodes.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {episodes.length} episode{episodes.length === 1 ? '' : 's'}
            </span>
          </div>

          {episodes.length === 0 ? (
            <div className="rounded-3xl bg-[#151515] p-8 text-gray-400">
              No episodes available yet.
            </div>
          ) : (
            <div className="space-y-5">
              {episodes.map((episode) => (
                <article
                  key={episode.id}
                  className="rounded-3xl bg-[#151515] p-4 md:p-5 transition hover:bg-[#1f1f1f]"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="relative w-full md:w-40 h-40 flex-shrink-0 overflow-hidden rounded-2xl bg-black">
                      <img
                        src={episode.image || program.image || DEFAULT_COVER}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_COVER
                        }}
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
                          <Play size={22} fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-500 mb-2">
                        <span>{episode.date}</span>
                        <span>•</span>
                        <span>{episode.duration}</span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black mb-2">
                        {episode.title}
                      </h3>

                      <p className="text-gray-400 mb-4">
                        {episode.description}
                      </p>

                      <audio controls className="w-full">
                        <source src={episode.audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}