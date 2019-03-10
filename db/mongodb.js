'use strict'

const debug = require('debug')('app:db')
const config = require('config')
const mongodb = require('mongodb')

const ObjectId = mongodb.ObjectId
const mongoUri = config.get('mongodb.uri')
const mongoDatabase = config.get('mongodb.database')
const mongoOptions = config.get('mongodb.options')

const state = {
  db: null,
  client: null,
}

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

const stop = async () => {
  if (state.db) {
    debug('db instance exists')
  }
  if (state.client) {
    debug('closing client')
    await state.client.close(true)
    debug('client connection closed')
  }
  debug('client does not exist.')
  return null
}


module.exports = {
  stop,
  get,
  ObjectId,
}
