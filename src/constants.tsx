import { Program } from './types'

export const COLORS = {
  ACCENT: '#ff6600',
  DARK: '#1a1a1a',
  GRAY: '#f3f4f6'
}

const IMAGES = {
  DANIEL_BROOKS: '/shows/daniel-brooks.webp',
  RACHAEL_HARRIS: '/shows/rachael-harris.webp',
  MICHAEL_RAY: '/shows/michael-ray.webp',
  STANCY_CAMPBELL: '/shows/stancy-campbell.webp',
  MATT_RILEY: '/shows/matt-riley.webp',
  SUNDAY_SERVICE: '/shows/sunday-service.webp',
  JAKE_HUNTER: '/shows/jake-hunter.webp',
  AVA_BROOKS: '/shows/ava-brooks.webp',
  SCOTT_TURNER: '/shows/scott-turner.webp',
  DJ_ZION: '/shows/dj-zion.webp',
  SARAH_JORDAN: '/shows/sarah-jordan.webp',
  WORSHIP: '/shows/worship.webp',
  GOLDEN_HYMNS: '/shows/golden_hymns.webp', // <-- Adicionado aqui
  SCOTT_TURNER_TRIBUTE: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1784947340/scott-turner-tribute_uuqi3m.webp' // <-- Adicionado aqui
}

const weekday: Program[] = [
  {
    id: 'midnight-grace',
    title: 'Midnight Grace',
    host: 'Daniel Brooks',
    startTime: '00:00',
    endTime: '06:00',
    description: 'Overnight worship.',
    image: IMAGES.DANIEL_BROOKS
  },
  {
    id: 'worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'start your day with worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'Morning Show',
    title: 'Morning Show',
    host: 'Stancy Campbell',
    startTime: '07:00',
    endTime: '12:00',
    description: 'Music, encouragement and inspiration.',
    image: IMAGES.STANCY_CAMPBELL
  },
  {
    id: 'worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '13:00',
    endTime: '16:00',
    description: 'Faith and encouragement through music.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'praise-fm-flow',
    title: 'Praise FM Flow',
    host: 'DJ Zion',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Hip Hop and energy.',
    image: IMAGES.DJ_ZION
  },
  {
    id: 'future-artists',
    title: 'Future Artists',
    host: 'Sarah Jordan',
    startTime: '17:00',
    endTime: '18:00',
    description: 'Discover the future sound of Christian music.',
    image: IMAGES.SARAH_JORDAN
  },
  {
    id: 'carpool',
    title: 'Praise FM Carpool',
    host: 'Rachael Harris',
    startTime: '18:00',
    endTime: '20:00',
    description: 'Your company on the way home.',
    image: IMAGES.RACHAEL_HARRIS
  },
  {
    id: 'praise-fm-rock',
    title: 'Praise FM Rock',
    host: 'Jake Hunter',
    startTime: '20:00',
    endTime: '21:00',
    description: 'Christian rock and Faith.',
    image: IMAGES.JAKE_HUNTER
  },
  {
    id: 'praise-fm-classics',
    title: 'Classics',
    host: 'Scott Turner',
    startTime: '21:00',
    endTime: '22:00',
    description: 'Timeless Christian favorites.',
    image: IMAGES.SCOTT_TURNER
  },
  {
    id: 'praise-fm-chill',
    title: 'Praise FM Chill',
    host: 'Ava Brooks',
    startTime: '22:00',
    endTime: '00:00',
    description: 'Ava Brooks brings the best of the Chill',
    image: IMAGES.AVA_BROOKS
  }
]

// Grade específica de Quarta-feira (Wednesday)
const wednesday: Program[] = weekday.map((program) => {
  if (program.id === 'praise-fm-classics') {
    return {
      id: 'praise-fm-golden-hymns',
      title: 'Golden Hymns',
      host: 'Praise FM',
      startTime: '21:00',
      endTime: '22:00',
      description: 'Traditional hymns and classic faith songs.',
      image: IMAGES.GOLDEN_HYMNS
    }
  }
  return program
})

// Grade específica de Sábado (Saturday)
const saturday: Program[] = weekday.map((program) => {
  if (program.id === 'praise-fm-classics') {
    return {
      id: 'praise-fm-classics-tributes',
      title: 'Praise FM Classics Tributes',
      host: 'Scott Turner',
      startTime: '21:00',
      endTime: '22:00',
      description: 'Timeless Christian favorites.',
      image: IMAGES.SCOTT_TURNER_TRIBUTE
    }
  }
  return program
})

const sunday: Program[] = [
  {
    id: 'sunday-midnight-grace',
    title: 'Midnight Grace',
    host: 'Daniel Brooks',
    startTime: '00:00',
    endTime: '06:00',
    description: 'Overnight worship.',
    image: IMAGES.DANIEL_BROOKS
  },
  {
    id: 'sunday-worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'Start your Sunday with worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-morning',
    title: 'Sunday Morning',
    host: 'Matt Riley',
    startTime: '07:00',
    endTime: '12:00',
    description: 'Sunday with faith and worship.',
    image: IMAGES.MATT_RILEY
  },
  {
    id: 'sunday-worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of Worship.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '13:00',
    endTime: '16:00',
    description: 'A smooth afternoon blend of Worship.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'sunday-praise-fm-flow',
    title: 'Praise FM Flow',
    host: 'DJ Zion',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Hip Hop and energy.',
    image: IMAGES.DJ_ZION
  },
  {
    id: 'sunday-future-artists',
    title: 'Future Artists',
    host: 'Sarah Jordan',
    startTime: '17:00',
    endTime: '18:00',
    description: 'Discover the future sound of Christian music.',
    image: IMAGES.SARAH_JORDAN
  },
  {
    id: 'sunday-worship-evening',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '18:00',
    endTime: '20:00',
    description: 'Evening worship and peaceful Christian music.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-service',
    title: 'Sunday Service',
    host: 'Praise FM',
    startTime: '20:00',
    endTime: '21:00',
    description: 'A focused message of faith, hope and encouragement.',
    image: IMAGES.SUNDAY_SERVICE
  },
  {
    id: 'sunday-praise-fm-classics',
    title: 'Praise FM Classics',
    host: 'Scott Turner',
    startTime: '21:00',
    endTime: '22:00',
    description: 'Timeless Christian songs and modern classics.',
    image: IMAGES.SCOTT_TURNER
  },
  {
    id: 'sunday-praise-fm-chill',
    title: 'Praise FM Chill',
    host: 'Ava Brooks',
    startTime: '22:00',
    endTime: '00:00',
    description: 'Ava Brooks brings the best of the Chill.',
    image: IMAGES.AVA_BROOKS
  }
]

export const SCHEDULES: Record<number, Program[]> = {
  0: sunday,    // Domingo
  1: weekday,   // Segunda
  2: weekday,   // Terça
  3: wednesday, // Quarta (Golden Hymns)
  4: weekday,   // Quinta
  5: weekday,   // Sexta
  6: saturday   // Sábado (Classics Tributes)
}