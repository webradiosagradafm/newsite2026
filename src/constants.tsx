import { Program } from './types'

export const COLORS = {
  ACCENT: '#ff6600',
  DARK: '#1a1a1a',
  GRAY: '#f3f4f6'
}

const IMAGES = {
  DANIEL_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/daniel-brooks_qbfdgc.webp',
  RACHAEL_HARRIS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/rachael-harris_pwfg0z.webp',
  MICHAEL_RAY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/michael-ray_n6ylzs.webp',
  STANCY_CAMPBELL: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782157748/stancy-campbell_zwsout.webp',
  MATT_RILEY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/matt-riley_bun9ef.webp',
  SUNDAY_SERVICE: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1781538248/sunday-service_xmj94r.webp',
  JAKE_HUNTER: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782153980/jack-hunter_qagiwm.webp',
  AVA_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158973/ava-brooks_oyzibl.webp',
  SCOTT_TURNER: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/scott-turner_cwy1bc.webp',
  DJ_ZION: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/dj-zion_m2frte.webp',
  SARAH_JORDAN: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/sarah-jordan_tfnxpp.webp',
  WORSHIP: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1783132371/worship_jxoxce.webp',
  GOLDEN_HYMNS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1784947340/GOLDEN_HYMNS_2016_j7n2io.webp',
  SCOTT_TURNER_TRIBUTE: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1784947340/scott-turner-tribute_uuqi3m.webp',
  CHILL_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1785297426/chill-mix_btpsnv.webp',
  CLUB_MIX: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1785297861/club-mix_ritmbx.webp',
  BLACK_SOUL: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1786538567/praisefmblacksoul_hvo3ah.webp'
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
  if (program.id === 'praise-fm-flow') {
    return {
      id: 'maia-millers-club-mix',
      title: "Maia Miller's Club Mix",
      host: 'Maia Miller',
      startTime: '16:00',
      endTime: '17:00',
      description: 'An upbeat mix to kick off your Saturday afternoon.',
      image: IMAGES.CLUB_MIX
    }
  }
  if (program.id === 'future-artists') {
    return {
      id: 'praise-fm-black-soul',
      title: 'Praise FM Black Soul',
      host: 'Praise FM',
      startTime: '17:00',
      endTime: '18:00',
      description: 'Celebrating Black gospel and soul music.',
      image: IMAGES.BLACK_SOUL
    }
  }
  if (program.id === 'praise-fm-chill') {
    return {
      id: 'praise-fm-chill-mix',
      title: 'Praise FM Chill Mix',
      host: 'Praise FM',
      startTime: '22:00',
      endTime: '00:00',
      description: 'A relaxed mix to wind down your Saturday.',
      image: IMAGES.CHILL_MIX
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
  6: saturday   // Sábado (Club Mix 16h, Black Soul 17h, Classics Tributes 21h, Chill Mix 22h)
}
