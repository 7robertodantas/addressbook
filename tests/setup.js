'use strict'

const debug = require('debug')('app:test:setup')
const mongo = require('../db/mongodb')

beforeAll(async () => {
  debug('Initializing mongodb connection - beforeAll')
  const db = await mongo.get()
  debug('Cleaning database - beforeAll')
  await db.dropDatabase()
})

afterAll(async () => {
  const db = await mongo.get()
  debug('Cleaning database - afterAll')
  await db.dropDatabase()
  debug('Stopping mongodb connection - afterAll')
  await mongo.stop()
})
