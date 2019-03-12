'use strict'

const config = require('config')
const mongo = require('../../db/mongodb')
const log = require('../../logger')

module.exports = async () => {
  log.info('Cleaning database')
  const db = await mongo.get()
  await db.dropDatabase()

  log.info('Stopping mongodb connection')
  await mongo.stop()

  if (config.get('test.mongodb.embedded')) {
    log.info('Closing embedded mongodb')
    global.EMBEDDEDMONGODB.stop()
  }

  if (config.get('test.firebase.embedded')) {
    log.info('Closing embedded firebase')
    global.EMBEDDEDFIREBASE.close()
  }
}
