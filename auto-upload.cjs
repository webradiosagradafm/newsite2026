require('dotenv').config()

const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const admin = require('firebase-admin')
const mm = require('music-metadata')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const WATCH_FOLDER = 'E:/PRAISE FM RECORDS'

const PROGRAMS = [
  {
    slug: 'classic',
    title: 'Praise FM Classics',
    presenter: 'Scott Turner',
    folder: 'CLASSICS',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1778429831/scott-turner_wumkut.webp',
  },
  {
    slug: 'future-artists',
    title: 'Future Artists',
    presenter: 'Sarah Jordan',
    folder: 'FUTURE ARTISTS',
    image:
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1782158974/sarah-jordan_tfnxpp.webp',
  },
  {
    slug: 'praise-fm-rock',
    title: 'Praise FM Rock',
    presenter: 'Jake Hunter',
    folder: 'ROCK',
    image: 
      'https://res.cloudinary.com/dtecypmsh/image/upload/v1782153980/jack-hunter_qagiwm.webp',
  },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForFile(filePath) {
  let lastSize = -1

  while (true) {
    const stats = fs.statSync(filePath)

    if (stats.size === lastSize) {
      return
    }

    lastSize = stats.size
    await sleep(3000)
  }
}

function findProgram(filePath) {
  const normalized = filePath.toLowerCase()

  if (normalized.includes('classics')) {
    return PROGRAMS.find((p) => p.slug === 'classic')
  }

  if (normalized.includes('future artists')) {
    return PROGRAMS.find((p) => p.slug === 'future-artists')
  }

  if (normalized.includes('rock')) {
    return PROGRAMS.find((p) => p.slug === 'praise-fm-rock')
  }

  return null
}

async function processFile(filePath) {
  try {
    const fileName = path.basename(filePath)

    console.log(`\nNovo episódio detectado: ${fileName}`)

    const program = findProgram(filePath)

    if (!program) {
      console.log(`Programa não identificado: ${fileName}`)
      return
    }

    console.log(`Programa identificado: ${program.title}`)
    console.log('Aguardando arquivo terminar de gravar...')

    await waitForFile(filePath)

    console.log('Arquivo pronto. Lendo duração...')

    const metadata = await mm.parseFile(filePath)
    const durationMinutes = Math.round((metadata.format.duration || 3600) / 60)

    const dateString = new Date().toISOString().split('T')[0]

    console.log('Enviando para o Cloudinary...')

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: `praise-fm-episodes/${program.slug}`,
      public_id: `${dateString}_${Date.now()}`,
      overwrite: true,
    })

    const episode = {
      title: program.title,
      presenter: program.presenter,
      description: `Replay episode of ${program.title}.`,
      audioUrl: uploadResult.secure_url,
      image: program.image,
      duration: `${durationMinutes} mins`,
      publishedAt: admin.firestore.Timestamp.now(),
      date: dateString,
    }

    await db
      .collection('programs')
      .doc(program.slug)
      .collection('episodes')
      .doc(dateString)
      .set(episode, { merge: true })

    console.log(`Episódio publicado no Firebase: ${program.slug}/${dateString}`)
  } catch (error) {
    console.error('Erro ao processar arquivo:', error)
  }
}

console.log('Monitorando pasta:')
console.log(WATCH_FOLDER)

const watcher = chokidar.watch(WATCH_FOLDER, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: true,
  depth: 3,
})

watcher.on('add', async (filePath) => {
  if (!filePath.toLowerCase().endsWith('.mp3')) return
  await processFile(filePath)
})