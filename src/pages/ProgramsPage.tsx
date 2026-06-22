import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const programs = [
  {
    slug: 'classic',
    title: 'Praise FM Classics',
    presenter: 'Scott Turner',
    time: '9:00 PM - 10:00 PM',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1778429831/scott-turner_wumkut.webp',
    description: 'Christian classics from 2015 to 2022.'
  },
  {
    slug: 'future-artists',
    title: 'Future Artists',
    presenter: 'Sarah Jordan',
    time: '5:00 PM - 6:00 PM',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1778429831/sarah-jordan_jnuzrb.webp',
    description: 'Discover the future sound of Christian music.'
  },
  {
    slug: 'praise-fm-rock',
    title: 'Praise FM Rock',
    presenter: 'Jake Hunter',
    time: '8:00 PM - 9:00 PM',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1782153980/jack-hunter_qagiwm.webp',
    description: 'Rock and Faith.'
  }
]


export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white">
      <SEO
        title="Praise FM Programs | Global Christian Radio Shows"
        description="Explore all programs on Praise FM. Christian radio shows, worship music, and gospel programming streaming worldwide."
      />

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-10">
          <p className="text-orange-500 font-black uppercase tracking-wide text-sm mb-2">
            Praise FM USA
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Programs
          </h1>

          <p className="max-w-3xl text-gray-600 dark:text-gray-400 text-lg">
            Discover shows, hosts, music blocks and listen-again episodes from Praise FM.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link
              key={program.slug}
              to={`/program/${program.slug}`}
              className="group rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#242424] transition shadow-sm hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-black">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png'
                  }}
                />
              </div>

              <div className="p-5">
                <p className="text-xs font-black text-orange-500 uppercase tracking-wide mb-2">
                  {program.time}
                </p>

                <h2 className="text-2xl font-black mb-1 group-hover:text-orange-500 transition">
                  {program.title}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  with {program.presenter}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {program.description}
                </p>

                <div className="mt-5 inline-flex items-center text-sm font-black text-orange-500">
                  View episodes →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}