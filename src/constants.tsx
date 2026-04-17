import { Program, Podcast } from './types';

export const COLORS = {
  ACCENT: '#ff6600',
  DARK: '#1a1a1a',
  GRAY: '#f3f4f6'
};

const IMAGES = {
  DANIEL_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/MICHAEL_BROOKS_mdg7aa.webp',
  RACHEL_HARRIS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/RACHEL_HARRIS_rd59sb.webp',
  MICHAEL_RAY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/MICHAEL_RAY_yv1ehj.webp',
  STANCY_CAMPBELL: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/STANCY_CAMPBELL_xjkigb.webp',
  MAT_RILEY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/MATT_RILEY_hvzcam.webp',

  JAKE_HUNTER: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/JAKE_HUNTER_pyb2ji.webp',
  AVA_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232683/AVA_BROOKS_yysmgc.webp',
  SCOTT_TURNER: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/SCOTT_TURNER_wy3hrd.webp',
  DJ_ZION: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/DJ_ZION_hyjxbd.webp',
  SARAH_JORDAN: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1776232682/SARAH_JORDAN_oehx8m.webp',

  WORSHIP: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1769820658/Praise_FM_Worship_gz29id.webp',
};

const weekday: Program[] = [
  { id: '1', title: 'Midnight Grace', host: 'Daniel Brooks', startTime: '00:00', endTime: '06:00', description: 'Peaceful music for the night hours.', image: IMAGES.DANIEL_BROOKS },

  { id: '2', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '06:00', endTime: '07:00', description: 'Morning adoration and praise.', image: IMAGES.WORSHIP },

  { id: '3', title: 'Morning Show', host: 'Stancy Campbell', startTime: '07:00', endTime: '12:00', description: 'Life, music, and the Morning Show crew.', image: IMAGES.STANCY_CAMPBELL },

  { id: '4', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '12:00', endTime: '13:00', description: 'Midday reflection and worship.', image: IMAGES.WORSHIP },

  { id: '5', title: 'Midday Grace', host: 'Michael Ray', startTime: '13:00', endTime: '16:00', description: 'Soulful sounds for your afternoon.', image: IMAGES.MICHAEL_RAY },

  { id: '6', title: 'Praise FM Flow', host: 'DJ Zion', startTime: '16:00', endTime: '17:00', description: 'Urban gospel, rap and rhythm.', image: IMAGES.DJ_ZION },

  { id: '7', title: 'Future Artists', host: 'Sarah Jordan', startTime: '17:00', endTime: '18:00', description: 'Discover the next generation.', image: IMAGES.SARAH_JORDAN },

  { id: '8', title: 'Carpool', host: 'Rachel Harris', startTime: '18:00', endTime: '20:00', description: 'Drive home companion.', image: IMAGES.RACHEL_HARRIS },

  { id: '9', title: 'Praise FM Rock', host: 'Jake Hunter', startTime: '20:00', endTime: '21:00', description: 'Energy, guitars and faith.', image: IMAGES.JAKE_HUNTER },

  { id: '10', title: 'Praise FM Classics', host: 'Scott Turner', startTime: '21:00', endTime: '22:00', description: 'Timeless hits.', image: IMAGES.SCOTT_TURNER },

  { id: '11', title: 'Praise FM Chill', host: 'Ava Brooks', startTime: '22:00', endTime: '00:00', description: 'Relax and unwind.', image: IMAGES.AVA_BROOKS },
];

const sunday: Program[] = [
  { id: 's1', title: 'Midnight Grace', host: 'Daniel Brooks', startTime: '00:00', endTime: '06:00', description: 'Peaceful music for the night hours.', image: IMAGES.DANIEL_BROOKS },

  { id: 's2', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '06:00', endTime: '07:00', description: 'Morning adoration and praise.', image: IMAGES.WORSHIP },

  { id: 's3', title: 'Sunday With Christ', host: 'Matt Riley', startTime: '07:00', endTime: '12:00', description: 'A holy morning experience.', image: IMAGES.MAT_RILEY },

  { id: 's4', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '12:00', endTime: '13:00', description: 'Midday worship.', image: IMAGES.WORSHIP },

  { id: 's5', title: 'Midday Grace', host: 'Michael Ray', startTime: '13:00', endTime: '16:00', description: 'Soulful sounds.', image: IMAGES.MICHAEL_RAY },

  { id: 's6', title: 'Praise FM Flow', host: 'DJ Zion', startTime: '16:00', endTime: '17:00', description: 'Urban gospel.', image: IMAGES.DJ_ZION },

  { id: 's7', title: 'Future Artists', host: 'Sarah Jordan', startTime: '17:00', endTime: '18:00', description: 'New talents.', image: IMAGES.SARAH_JORDAN },

  { id: 's8', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '18:00', endTime: '20:00', description: 'Evening worship.', image: IMAGES.WORSHIP },

  { id: 's9', title: 'The Word', host: 'Guest Pastors', startTime: '20:00', endTime: '21:00', description: 'A powerful message.', image: IMAGES.WORSHIP },

  { id: 's10', title: 'Praise FM Classics', host: 'Scott Turner', startTime: '21:00', endTime: '22:00', description: 'Timeless hits.', image: IMAGES.SCOTT_TURNER },

  { id: 's11', title: 'Praise FM Chill', host: 'Ava Brooks', startTime: '22:00', endTime: '00:00', description: 'Relax and unwind.', image: IMAGES.AVA_BROOKS },
];

export const SCHEDULES: Record<number, Program[]> = {
  1: weekday,
  2: weekday,
  3: weekday,
  4: weekday,
  5: weekday,
  6: weekday,
  0: sunday
};

export const DEVOTIONAL_PODCASTS: Podcast[] = [
  { id: 'p1', title: 'Deep Roots', category: 'Bible Study', duration: '42 min', author: 'Dr. Jane Smith', image: 'https://picsum.photos/seed/pod1/400/400' },
  { id: 'p2', title: 'Daily Bread', category: 'Inspiration', duration: '15 min', author: 'Markus Doe', image: 'https://picsum.photos/seed/pod2/400/400' },
];