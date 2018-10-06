const mediaStorage = require('../storage/media')

const request = require('request-promise-native')

const AWS = require('aws-sdk')

const s3 = new AWS.S3()

function getKey (mediaUrl, bucketName) {
  return `${bucketName}/${mediaUrl.split('/').slice(-1)[0]}`
}

async function getExistingMediaLocation (media, bucketName) {
  let key = getKey(media.tweetMediaUrl, bucketName)

  let s3Options = {
    Bucket: bucketName,
    Key: key
  }

  try {
    await s3.headObject(s3Options).promise()
  } catch (error) {
    return
  }

  return `https://${bucketName}.s3.amazonaws.com/${key}`
}

async function uploadMedia (media, bucketName) {
  let key = getKey(media.tweetMediaUrl, bucketName)

  let requestOptions = {
    uri: media.tweetMediaUrl,
    encoding: null,
    resolveWithFullResponse: true
  }

  let response = await request(requestOptions)

  let s3Options = {
    Bucket: bucketName,
    Key: key,
    Body: response.body,
    ContentType: response.headers['content-type']
  }

  let result = await s3.upload(s3Options).promise()

  return result
}

async function run () {
  let twitterName = process.env.TWITTER_ACCOUNT_TO_DOWNLOAD_FROM

  let bucketName = process.env.S3_BUCKET_NAME

  let storedMedia

  let mediaToUpload

  let result

  let existingMediaLocation

  if (!twitterName) {
    throw Error('Unable to upload media, please set ACCOUNT_TO_DOWNLOAD in your environment')
  }

  if (!bucketName) {
    throw Error('Unable to upload media, please set S3_BUCKET_NAME in your environment')
  }

  storedMedia = await mediaStorage.getAll()
  console.log(`Tracking ${storedMedia.length} media items`)

  mediaToUpload = storedMedia.filter(media => !media.s3Url)
  console.log(`Have ${mediaToUpload.length} media items to upload`)

  for (let mediaIndex = 0; mediaIndex < mediaToUpload.length; mediaIndex++) {
    if (mediaToUpload[mediaIndex].s3Url) {
      continue
    }

    existingMediaLocation = await getExistingMediaLocation(mediaToUpload[mediaIndex], bucketName)

    if (existingMediaLocation) {
      mediaToUpload[mediaIndex].s3Url = existingMediaLocation
      await mediaStorage.saveOne(mediaToUpload[mediaIndex])
      console.log(`Media item ${mediaToUpload[mediaIndex].tweetMediaUrl} was already uploaded at ${existingMediaLocation}`)
    } else {
      try {
        result = await uploadMedia(mediaToUpload[mediaIndex], bucketName)
        mediaToUpload[mediaIndex].s3Url = result.Location
        await mediaStorage.saveOne(mediaToUpload[mediaIndex])
        console.log(`Uploaded media item ${mediaToUpload[mediaIndex].tweetMediaUrl} to ${result.Location}`)
      } catch (error) {
        console.error(`Unable to upload media item ${mediaToUpload[mediaIndex].tweetMediaUrl} to S3`)
        console.error(error)
      }
    }
  }
}

module.exports = {
  run
}

if (require.main === module) {
  run()
}
