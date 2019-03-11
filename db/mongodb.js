'use strict'

const debug = require('debug')('app:db')
const config = require('config')
const mongodb = require('mongodb')
const { MongoMemoryServer } = require('mongodb-memory-server')

const ObjectId = mongodb.ObjectId
const mongoEmbedded = config.get('mongodb.embedded')
const mongoUri = config.get('mongodb.uri')
const mongoDatabase = config.get('mongodb.database')
const mongoOptions = config.get('mongodb.options')

/**
 * Variable to hold current
 * mongo connection.
 */
const state = {
  uri: mongoUri,
  db: null,
  client: null,
  server: null,
}

/**
 * Returns the current database connection or creates
 * a new one if it doesn't exist.
 * or creates a new one if not exists yet.
 * @returns {Promise<Db>} mongo database.
 */
const get = async () => {
  if (state.client) {
    debug('returning current db connection')
    return state.db
  }

  if (mongoEmbedded) {
    state.server = new MongoMemoryServer()
    state.uri = await state.server.getConnectionString()
  }

  const connection = await mongodb.MongoClient.connect(state.uri, {
    useNewUrlParser: mongoOptions.get('useNewUrlParser'),
    poolSize: mongoOptions.get('poolSize'),
  })

  state.db = connection.db(mongoDatabase)
  state.client = connection
  debug(`connected to mongodb on ${state.uri}`)
  return state.db
}

/**
 * Close all database connections.
 * @returns {null} nothing.
 */
const stop = async () => {
  if (state.db) {
    debug('db instance exists')
    state.db = null
  }
  if (state.client) {
    debug('closing client')
    await state.client.close(true)
    debug('client connection closed')
    state.client = null
  }
  if (state.server) {
    debug('closing embedded server')
    await state.server.stop()
    debug('server closed')
    state.server = null
  }
  return state
}


module.exports = {
  stop,
  get,
  ObjectId,
}
