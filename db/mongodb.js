'use strict'

const debug = require('debug')('app:db')
const config = require('config')
const mongodb = require('mongodb')

const ObjectId = mongodb.ObjectId
const mongoUri = config.get('mongodb.uri')
const mongoDatabase = config.get('mongodb.database')
const mongoOptions = config.get('mongodb.options')

/**
 * Variable to hold current
 * mongo connection.
 */
const state = {
  db: null,
  client: null,
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
  const connection = await mongodb.MongoClient.connect(mongoUri, {
    useNewUrlParser: mongoOptions.get('useNewUrlParser'),
    poolSize: mongoOptions.get('poolSize'),
  })
  state.db = connection.db(mongoDatabase)
  state.client = connection
  debug(`connected to mongodb on ${mongoUri}`)
  return state.db
}

/**
 * Close any database connection.
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
  debug('client does not exist.')
  return null
}


module.exports = {
  stop,
  get,
  ObjectId,
}
