const level = require('level')

const mediaDB = level('./.data/leveldb/media', { valueEncoding: 'json' })

const CACHE_LIMIT = 60 * 60 * 1000 // one hour in milliseconds

let cachedMedia,
  lastCacheRefresh

function refreshCache (media) {
  cachedMedia = media
  lastCacheRefresh = Date.now()
  return media
}

async function getAll () {
  return new Promise((resolve, reject) => {
    let media = []

    mediaDB.createReadStream()
      .on('data', function (data) {
        media.push(data.value)
      })
      .on('error', function (err) {
        reject(err)
      })
      .on('end', function () {
        refreshCache(media)
        resolve(media)
      })
  })
}

async function getAllCached () {
  if (typeof cachedMedia === 'undefined' || typeof lastCacheRefresh === 'undefined' || Date.now() > lastCacheRefresh + CACHE_LIMIT) {
    return getAll()
  }
  return cachedMedia
}

async function saveSome (updatedMedia) {
  return mediaDB.batch(
    updatedMedia.map((media) => {
      return {
        type: 'put',
        key: media.tweetMediaId,
        value: media
      }
    })
  )
}

async function saveOne (key, updatedMedia) {
  let update = await mediaDB.put(key, updatedMedia)
  console.log(update, key, updatedMedia);
}

async function getOne (key) {
  return mediaDB.get(key);
}

module.exports = {
  getOne,
  getAll,
  getAllCached,
  saveSome,
  saveOne
}
