import { ProgramRing } from './ProgramRing'

type Program = {
  id: string
  title: string
  image: string
  start: string // "18:00"
  end: string   // "20:00"
}

function getProgress(start: string, end: string) {
  const now = new Date()
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)

  const startDate = new Date()
  startDate.setHours(sh, sm, 0)

  const endDate = new Date()
  endDate.setHours(eh, em, 0)

  const total = endDate.getTime() - startDate.getTime()
  const current = now.getTime() - startDate.getTime()

  return Math.min(Math.max((current / total) * 100, 0), 100)
}

export function ProgramCarousel({ programs }: { programs: Program[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-6">
      {programs.map(program => {
        const progress = getProgress(program.start, program.end)
        const isLive = progress > 0 && progress < 100

        return (
          <ProgramRing
            key={program.id}
            title={program.title}
            image={program.image}
            progress={progress}
            isLive={isLive}
          />
        )
      })}
    </div>
  )
}
