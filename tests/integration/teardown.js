'use strict'

const debug = require('debug')('app:test:teardown')
const config = require('config')
const mongo = require('../../db/mongodb')

module.exports = async () => {
  debug('Cleaning database')
  const db = await mongo.get()
  await db.dropDatabase()

  debug('Stopping mongodb connection')
  await mongo.stop()

  if (config.get('test.mongodb.embedded')) {
    debug('Closing embedded mongodb')
    global.EMBEDDEDMONGODB.stop()
  }

  if (config.get('test.firebase.embedded')) {
    debug('Closing embedded firebase')
    global.EMBEDDEDFIREBASE.close()
  }
}
