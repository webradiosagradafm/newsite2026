import { Program } from './types'

export const COLORS = {
  ACCENT: '#ff6600',
  DARK: '#1a1a1a',
  GRAY: '#f3f4f6'
}

const IMAGES = {
  DANIEL_BROOKS: '/shows/daniel-brooks.jpg',
  RACHAEL_HARRIS: '/shows/rachael-harris.jpg',
  MICHAEL_RAY: '/shows/michael-ray.jpg',
  STANCY_CAMPBELL: '/shows/stancy-campbell.jpg',
  MATT_RILEY: '/shows/matt-riley.jpg',
  LIVING_THE_MESSAGE: '/shows/living-the-message.jpg',
  JAKE_HUNTER: '/shows/jake-hunter.jpg',
  AVA_BROOKS: '/shows/ava-brooks.jpg',
  SCOTT_TURNER: '/shows/scott-turner.jpg',
  DJ_ZION: '/shows/dj-zion.jpg',
  SARAH_JORDAN: '/shows/sarah-jordan.jpg',
  WORSHIP: '/shows/worship.jpg'
}

const weekday: Program[] = [
  {
    id: 'midnight-grace',
    title: 'Midnight Grace',
    host: 'Daniel Brooks',
    startTime: '00:00',
    endTime: '06:00',
    description: 'Peaceful worship and reflective Christian music for the overnight hours.',
    image: IMAGES.DANIEL_BROOKS
  },
  {
    id: 'worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'Morning worship to start your day with faith and peace.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'morning-show',
    title: 'Morning Show',
    host: 'Stancy Campbell',
    startTime: '07:00',
    endTime: '12:00',
    description: 'Uplifting music, encouragement and a bright start to your day.',
    image: IMAGES.STANCY_CAMPBELL
  },
  {
    id: 'worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of worship and reflection.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '13:00',
    endTime: '16:00',
    description: 'A smooth afternoon blend of worship, hope and Christian favorites.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'praise-fm-flow',
    title: 'Praise FM Flow',
    host: 'DJ Zion',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Modern Christian pop, rhythm, flow and fresh energy.',
    image: IMAGES.DJ_ZION
  },
  {
    id: 'future-artists',
    title: 'Praise FM Future Artists',
    host: 'Sarah Jordan',
    startTime: '17:00',
    endTime: '18:00',
    description: 'Discover new voices and the future sound of Christian music.',
    image: IMAGES.SARAH_JORDAN
  },
  {
    id: 'carpool',
    title: 'Carpool',
    host: 'Rachael Harris',
    startTime: '18:00',
    endTime: '20:00',
    description: 'Your drive-time companion with uplifting Christian music.',
    image: IMAGES.RACHAEL_HARRIS
  },
  {
    id: 'praise-fm-rock',
    title: 'Praise FM Rock',
    host: 'Jake Hunter',
    startTime: '20:00',
    endTime: '21:00',
    description: 'Faith, guitars and powerful Christian rock energy.',
    image: IMAGES.JAKE_HUNTER
  },
  {
    id: 'praise-fm-classics',
    title: 'Praise FM Classics',
    host: 'Scott Turner',
    startTime: '21:00',
    endTime: '22:00',
    description: 'Timeless Christian songs and modern classics.',
    image: IMAGES.SCOTT_TURNER
  },
  {
    id: 'praise-fm-chill',
    title: 'Praise FM Chill',
    host: 'Ava Brooks',
    startTime: '22:00',
    endTime: '00:00',
    description: 'Relax, unwind and end the day with peaceful Christian music.',
    image: IMAGES.AVA_BROOKS
  }
]

const sunday: Program[] = [
  {
    id: 'sunday-midnight-grace',
    title: 'Midnight Grace',
    host: 'Daniel Brooks',
    startTime: '00:00',
    endTime: '06:00',
    description: 'Peaceful worship and reflective Christian music for the overnight hours.',
    image: IMAGES.DANIEL_BROOKS
  },
  {
    id: 'sunday-worship-morning',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '06:00',
    endTime: '07:00',
    description: 'Morning worship to start Sunday with faith and peace.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-morning',
    title: 'Sunday Morning With Christ',
    host: 'Matt Riley',
    startTime: '07:00',
    endTime: '12:00',
    description: 'A peaceful Sunday morning experience with worship and encouragement.',
    image: IMAGES.MATT_RILEY
  },
  {
    id: 'sunday-worship-midday',
    title: 'Worship',
    host: 'Praise FM',
    startTime: '12:00',
    endTime: '13:00',
    description: 'A midday hour of worship and reflection.',
    image: IMAGES.WORSHIP
  },
  {
    id: 'sunday-midday-grace',
    title: 'Midday Grace',
    host: 'Michael Ray',
    startTime: '13:00',
    endTime: '16:00',
    description: 'A smooth afternoon blend of worship, hope and Christian favorites.',
    image: IMAGES.MICHAEL_RAY
  },
  {
    id: 'sunday-praise-fm-flow',
    title: 'Praise FM Flow',
    host: 'DJ Zion',
    startTime: '16:00',
    endTime: '17:00',
    description: 'Modern Christian pop, rhythm, flow and fresh energy.',
    image: IMAGES.DJ_ZION
  },
  {
    id: 'sunday-future-artists',
    title: 'Praise FM Future Artists',
    host: 'Sarah Jordan',
    startTime: '17:00',
    endTime: '18:00',
    description: 'Discover new voices and the future sound of Christian music.',
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
    id: 'living-the-message',
    title: 'Living The Message',
    host: 'Praise FM',
    startTime: '20:00',
    endTime: '21:00',
    description: 'A focused message of faith, hope and encouragement.',
    image: IMAGES.LIVING_THE_MESSAGE
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
    description: 'Relax, unwind and end Sunday with peaceful Christian music.',
    image: IMAGES.AVA_BROOKS
  }
]

export const SCHEDULES: Record<number, Program[]> = {
  0: sunday,
  1: weekday,
  2: weekday,
  3: weekday,
  4: weekday,
  5: weekday,
  6: weekday
}
