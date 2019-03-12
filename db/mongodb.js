'use strict'

const config = require('config')
const mongodb = require('mongodb')
const log = require('../logger')

const ObjectId = mongodb.ObjectId

/**
 * Variable that holds the
 * current mongo connection.
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
    log.debug('returning current db connection')
    return state.db
  }

  const uri = config.get('mongodb.uri')
  const options = config.get('mongodb.options')
  const database = config.get('mongodb.database')

  const connection = await mongodb.MongoClient.connect(uri, options)
  log.info(`Connected to mongodb at ${uri}`)
  state.db = connection.db(database)
  state.client = connection
  return state.db
}

/**
 * Close all database connections.
 * @returns {null} nothing.
 */
const stop = async () => {
  if (state.client) {
    log.debug('Closing client')
    await state.client.close(true)
    log.debug('Client connection closed')
    state.client = null
  }
  return state
}


module.exports = {
  stop,
  get,
  ObjectId,
}
