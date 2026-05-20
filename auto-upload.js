const chokidar = require('chokidar')
const cloudinary = require('cloudinary').v2
const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

/* =========================
   CLOUDINARY
========================= */

cloudinary.config({
  cloud_name: 'SEU_CLOUD_NAME',
  api_key: 'SUA_API_KEY',
  api_secret: 'SEU_API_SECRET'
})

/* =========================
   FIREBASE
========================= */

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

/* =========================
   CONFIG
========================= */

const WATCH_FOLDER = 'E:/PRAISE FM RECORDS'

const PROGRAMS = {
  PraiseFMClassics: {
    slug: 'classic',
    title: 'Praise FM Classics',
    presenter: 'Scott Turner',
    description: 'Christian classics from 2015 to 2022.',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1778429831/scott-turner_wumkut.webp'
  },

  FutureArtists: {
    slug: 'future-artists',
    title: 'Future Artists',
    presenter: 'Sarah Jordan',
    description:
      'Fresh Christian artists and the future of worship music.',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1778429831/sarah-jordan_jnuzrb.webp'
  },

  PraiseFMRock: {
    slug: 'praise-fm-rock',
    title: 'Praise FM Rock',
    presenter: 'Jake Hunter',
    description: 'Faith louder than ever.',
    image: '/logo.png'
  }
}

/* =========================
   WATCHER
========================= */

console.log('Watching folder:', WATCH_FOLDER)

chokidar
  .watch(WATCH_FOLDER, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  })
  .on('add', async (filePath) => {
    try {
      if (!filePath.endsWith('.mp3')) return

      console.log('\nNew MP3 detected:')
      console.log(filePath)

      const fileName = path.basename(filePath)

      let matchedProgram = null

      for (const key in PROGRAMS) {
        if (fileName.includes(key)) {
          matchedProgram = PROGRAMS[key]
          break
        }
      }

      if (!matchedProgram) {
        console.log('Program not recognized.')
        return
      }

      console.log('Uploading to Cloudinary...')

      const uploadResult = await cloudinary.uploader.upload(
        filePath,
        {
          resource_type: 'video',
          folder: 'praise-fm-episodes'
        }
      )

      console.log('Upload complete.')

      const today = new Date()

      const date = today.toISOString().split('T')[0]

      const episodeData = {
        title: matchedProgram.title,
        presenter: matchedProgram.presenter,
        description: matchedProgram.description,
        duration: '60 mins',
        date,
        audioUrl: uploadResult.secure_url,
        image: matchedProgram.image
      }

      await db
        .collection('programs')
        .doc(matchedProgram.slug)
        .collection('episodes')
        .doc(date)
        .set(episodeData)

      console.log('Episode saved to Firebase.')
    } catch (error) {
      console.error(error)
    }
  })
