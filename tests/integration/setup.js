'use strict'

const debug = require('debug')('app:test:setup')
const mongo = require('../../db/mongodb')

module.exports = async () => {
  debug('Initializing mongodb connection - global setup')
  const db = await mongo.get()
  debug('Cleaning database - global setup')
  await db.dropDatabase()
}
