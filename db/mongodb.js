'use strict'

const debug = require('debug')('app:db')
const config = require('config')
const mongodb = require('mongodb')

const ObjectId = mongodb.ObjectId

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

  const uri = config.get('mongodb.uri')
  const options = config.get('mongodb.options')
  const database = config.get('mongodb.database')

  const connection = await mongodb.MongoClient.connect(uri, options)
  debug(`connected to mongodb on ${uri}`)
  state.db = connection.db(database)
  state.client = connection
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
  return state
}


module.exports = {
  stop,
  get,
  ObjectId,
}
