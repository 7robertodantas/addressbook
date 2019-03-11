'use strict'

const debug = require('debug')('app:test:setup')
const mongo = require('../../db/mongodb')

module.exports = async () => {
  const db = await mongo.get()
  debug('Cleaning database - global teardown')
  await db.dropDatabase()
  debug('Stopping mongodb connection - global teardown')
  await mongo.stop()
}
