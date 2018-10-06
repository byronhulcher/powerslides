const path = require('path')

const express = require('express')

const mediaStorage = require('./lib/storage/media')

let app = express()

let listener

app.use(express.static('public')) // serve static files like index.html http://expressjs.com/en/starter/static-files.html
app.use(express.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/pages/index.html'))
})

app.get('/admin/', function (req, res) {
  if (!req.query.key === process.env.ADMIN_ACCESS_KEY) {
    res.status(401).send('401 UNAUTHORIZED')
    return
  }
  res.sendFile(path.join(__dirname, '/pages/admin.html'))
})

app.get('/media/', async function (req, res) {
  let media = await mediaStorage.getAllCached()
  
  media.filter(item => item.s3Url);

  if (req.query.rating === 'unrated') {
    media = media.filter(item => (typeof item.rating === 'undefined'))
  } else if (req.query.rating === 'nsfw') {
    media = media.filter(item => (item.rating === 'nsfw'))
  } else if (req.query.rating === 'sfw' || req.query.rating !== 'all') {
    media = media.filter(item => (item.rating === 'sfw'))
  }

  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(JSON.stringify(media))
})

app.put('/media/', async function (req, res) {
  console.log(1);
  if (req.query.media && req.query.rating){
    let mediaItem
    mediaItem = await mediaStorage.getOne(req.query.media);
    mediaItem.rating =  req.query.rating
    await mediaStorage.saveOne(req.query.media, mediaItem);
    console.log(mediaItem);
    console.log('Updated.');
    res.status(200).send(JSON.stringify(mediaItem))
    return
  }
  res.status(400).send('400 NO ID OR RATING')
  return
})

// listen for requests :)
listener = app.listen(process.env.PORT, async function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
