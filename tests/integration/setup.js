/* eslint-disable no-process-env */
'use strict'

const debug = require('debug')('app:test:setup')
const config = require('config')
const FirebaseServer = require('firebase-server')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongo = require('../../db/mongodb')

module.exports = async () => {
  // We can not know in advance which port these embeds
  // instances will run, so we'll need to modify this test
  // config in runtime. To do so, we must have this env property
  // enabled - which changes the config package to mutable instead
  // of immutable. I'm working on to find a better way to handle this,
  // perhaps changing the config library to another.
  process.env.ALLOW_CONFIG_MUTATIONS = true
  if (config.get('test.firebase.embedded')) {
    debug('Initializing embedded firebase')
    const firebaseServer = new FirebaseServer(0)
    const databaseURL = `ws://localhost:${firebaseServer.getPort()}`

    // It seems that config does some sort of cache, it won't work
    // if we simply change the config value. We'll need to use this
    // environment variable too.
    process.env.FIREBASE_URI = databaseURL
    config.get('firebase').databaseURL = databaseURL

    // Storing in global so we can close in teardown.
    global.EMBEDDEDFIREBASE = firebaseServer
  }
  if (config.get('test.mongodb.embedded')) {
    debug('Initializing embedded mongodb')
    const mongoServer = new MongoMemoryServer()
    const uri = await mongoServer.getConnectionString()

    // It seems that config does some sort of cache, it won't work
    // if we simply change the config value. We'll need to use this
    // environment variable too.
    process.env.MONGODB_URI = uri
    config.get('mongodb').uri = uri

    // Storing in global so we can close in teardown.
    global.EMBEDDEDMONGODB = mongoServer
  }

  debug('Initializing mongodb connection')
  const db = await mongo.get()
  debug('Cleaning database')
  await db.dropDatabase()
}
