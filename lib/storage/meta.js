const level = require('level')

const metaDB = level('./.data/leveldb/meta', { valueEncoding: 'json' })

async function getPaging (twitterName) {
  return metaDB.get(twitterName + ':paging')
}

async function savePaging (twitterName, data) {
  return metaDB.put(twitterName + ':paging', data)
}

module.exports = {
  getPaging,
  savePaging
}
