
import { Program, Podcast } from './types';

export const COLORS = {
  ACCENT: '#ff6600',
  DARK: '#1a1a1a',
  GRAY: '#f3f4f6'
};

const IMAGES = {
  DANIEL_BROOKS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882820/Daniel_Brooks_bcammc.png',
  JORDAN_REYS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Jordan_Reyes_drufeg.png',
  LIVING_THE_MESSAGE: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882820/Living_the_Message_x7hmwc.png',
  MAT_RILEY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882820/Matt_Riley_b2n8fi.png',
  MICHAEL_RAY: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Michael_Ray_u4bkfd.png',
  LIVE_SHOW: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882820/Praise_FM_Live_Show_lgb7jm.png',
  NON_STOP: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Non_Stop_ipfman.png',
  WORSHIP: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Praise_FM_Worship_ypenw8.png',
  RACHEL_HARRIS: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882822/Rachel_Harris_kxjpa1.png',
  SARAH_JORDAN: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882821/Sarah_Jordan_uecxmi.png',
  SCOTT_TURNER: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882823/Scott_Turner_hxkuxd.png',
  STANCY_CAMPBELL: 'https://res.cloudinary.com/dtecypmsh/image/upload/v1766882823/Stancy_Campbell_oair1x.png'
};

const commonDaily: Program[] = [
  { id: '1', title: 'Midnight Grace', host: 'Daniel Brooks', startTime: '00:00', endTime: '06:00', description: 'Peaceful music for the night hours.', image: IMAGES.DANIEL_BROOKS },
  { id: '2', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '06:00', endTime: '07:00', description: 'Morning adoration and praise.', image: IMAGES.WORSHIP },
  { id: '3', title: 'Morning Show', host: 'Stancy Campbell', startTime: '07:00', endTime: '12:00', description: 'Life, music, and the Morning Show crew.', image: IMAGES.STANCY_CAMPBELL },
  { id: '4', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '12:00', endTime: '13:00', description: 'Midday reflection and worship.', image: IMAGES.WORSHIP },
  { id: '5', title: 'Midday Grace', host: 'Michael Ray', startTime: '13:00', endTime: '16:00', description: 'Soulful sounds for your afternoon.', image: IMAGES.MICHAEL_RAY },
  { id: '6', title: 'Non Stop', host: 'Praise FM', startTime: '16:00', endTime: '17:00', description: 'One hour of pure music.', image: IMAGES.NON_STOP },
  { id: '7', title: 'Future Artists', host: 'Sarah Jordan', startTime: '17:00', endTime: '18:00', description: 'Discover the next generation of faith-filled talent.', image: IMAGES.SARAH_JORDAN },
  { id: '8', title: 'Carpool', host: 'Rachel Harris', startTime: '18:00', endTime: '20:00', description: 'The drive home companion you need.', image: IMAGES.RACHEL_HARRIS },
  { id: '9-pop', title: 'Praise FM Pop', host: 'Jordan Reyes', startTime: '20:00', endTime: '21:00', description: 'The biggest hits in contemporary music.', image: IMAGES.JORDAN_REYS },
  { id: '10', title: 'Classics', host: 'Scott Turner', startTime: '21:00', endTime: '22:00', description: 'Timeless hymns and heritage hits.', image: IMAGES.SCOTT_TURNER },
  { id: '11', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '22:00', endTime: '00:00', description: 'Ending the day in His presence.', image: IMAGES.WORSHIP },
];

export const SCHEDULES: Record<number, Program[]> = {
  1: commonDaily,
  2: commonDaily,
  3: commonDaily.map(p => p.startTime === '20:00' ? { ...p, id: '9-live', title: 'Praise FM Live Show', host: 'Praise FM Team', description: 'Exclusive live recordings.', image: IMAGES.LIVE_SHOW } : p),
  4: commonDaily,
  5: commonDaily,
  6: commonDaily,
  0: [
    { id: 's1', title: 'Midnight Grace', host: 'Daniel Brooks', startTime: '00:00', endTime: '06:00', description: 'Peaceful music for the night hours.', image: IMAGES.DANIEL_BROOKS },
    { id: 's2', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '06:00', endTime: '07:00', description: 'Early morning worship.', image: IMAGES.WORSHIP },
    { id: 's3', title: 'Sunday Morning with Christ', host: 'Matt Riley', startTime: '07:00', endTime: '12:00', description: 'A holy morning experience.', image: IMAGES.MAT_RILEY },
    { id: 's4', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '12:00', endTime: '13:00', description: 'Sunday midday reflection.', image: IMAGES.WORSHIP },
    { id: 's5', title: 'Midday Grace', host: 'Michael Ray', startTime: '13:00', endTime: '16:00', description: 'Soulful sounds for your afternoon.', image: IMAGES.MICHAEL_RAY },
    { id: 's6', title: 'Non Stop', host: 'Praise FM', startTime: '16:00', endTime: '17:00', description: 'One hour of pure music.', image: IMAGES.NON_STOP },
    { id: 's7', title: 'Future Artists', host: 'Sarah Jordan', startTime: '17:00', endTime: '18:00', description: 'Discover the next generation of gospel talent.', image: IMAGES.SARAH_JORDAN },
    { id: 's8', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '18:00', endTime: '20:00', description: 'Evening adoration.', image: IMAGES.WORSHIP },
    { id: 's9', title: 'Praise FM Pop', host: 'Jordan Reyes', startTime: '20:00', endTime: '21:00', description: 'The biggest hits in contemporary worship.', image: IMAGES.JORDAN_REYS },
    { id: 's10', title: 'Classics', host: 'Scott Turner', startTime: '21:00', endTime: '22:00', description: 'Timeless hymns and heritage hits.', image: IMAGES.SCOTT_TURNER },
    { id: 's11', title: 'Living the Message', host: 'Pastors United', startTime: '22:00', endTime: '22:30', description: 'A short word for your week ahead.', image: IMAGES.LIVING_THE_MESSAGE },
    { id: 's12', title: 'Praise FM Worship', host: 'Praise FM Team', startTime: '22:30', endTime: '00:00', description: 'Ending the day in His presence.', image: IMAGES.WORSHIP },
  ]
};

export const DEVOTIONAL_PODCASTS: Podcast[] = [
  { id: 'p1', title: 'Deep Roots', category: 'Bible Study', duration: '42 min', author: 'Dr. Jane Smith', image: 'https://picsum.photos/seed/pod1/400/400' },
  { id: 'p2', title: 'Daily Bread', category: 'Inspiration', duration: '15 min', author: 'Markus Doe', image: 'https://picsum.photos/seed/pod2/400/400' },
  { id: 'p3', title: 'The Quiet Hour', category: 'Meditation', duration: '20 min', author: 'Sarah Jordan', image: IMAGES.SARAH_JORDAN },
  { id: 'p4', title: 'Grace Notes', category: 'Music History', duration: '55 min', author: 'Scott Turner', image: IMAGES.SCOTT_TURNER },
  { id: 'p5', title: 'Soul Care', category: 'Mental Health', duration: '30 min', author: 'Daniel Brooks', image: IMAGES.DANIEL_BROOKS },
  { id: 'p6', title: 'Morning Dew', category: 'Prayer', duration: '10 min', author: 'Michael Ray', image: IMAGES.MICHAEL_RAY },
];
