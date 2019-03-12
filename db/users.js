'use strict'

const R = require('ramda')
const Boom = require('boom')
const log = require('../logger')
const mongo = require('./mongodb')

const ObjectId = mongo.ObjectId

/**
 * Converts document '_id': ObjectId property in 'id': String property.
 * @param {Object} document to be sanitazed.
 * @returns {Object} partial copy of document
 * with 'id' property or null if the document is null.
 */
const sanitaze = document => {
  if (document && document._id) {
    return R.omit(['_id'], R.merge({ id: document._id.toHexString() }, document))
  }
  return document
}


/**
 * Validates if a given email exists in database.
 * @param {string} email to be verified if exists in database.
 * @returns {boolean} true if it exists, false otherwise.
 */
const existsEmail = async email => {
  log.debug(`verifying if email ${email} exists in database`)
  const db = await mongo.get()
  const count = await db.collection('users')
    .countDocuments({ email })
  return count > 0
}

/**
 * Save the user in database.
 * @param {Object} user to be saved in database.
 * @returns {Object} saved user instance.
 * @throws {Error} if user.email already exist in database.
 */
const save = async user => {
  log.debug('saving user in database', user)

  const exists = await existsEmail(user.email)
  if (exists) {
    throw Boom.conflict('User with the given email already exists', { email: user.email })
  }

  const db = await mongo.get()
  const result = await db.collection('users').insertOne(user)
  return R.merge({ id: result.insertedId.toHexString() }, user)
}

/**
 * Find the user by id.
 * @param {string} id user id.
 * @returns {Object} user object or null if doesn't exist.
 * @see sanitaze
 */
const find = async id => {
  log.debug(`fetching userId ${id} in database`)
  const db = await mongo.get()
  const found = await db.collection('users').findOne({ _id: new ObjectId(id) })
  return sanitaze(found)
}

/**
 * Find the user by email.
 * @param {string} email user email.
 * @returns {Object} user object or null if doesn't exist.
 * @see sanitaze
 */
const findByEmail = async email => {
  log.debug(`fetching email ${email} in database`)
  const db = await mongo.get()
  const found = await db.collection('users').findOne({ email })
  return sanitaze(found)
}

/**
 * Replaces the user content in database.
 * @param {string} id user id.
 * @param {Object} user user content
 * @returns {Object} user object or null if doesn't exist.
 * @see sanitaze
 */
const update = async (id, user) => {
  log.debug(`updating userId ${id} in database`, user)
  const db = await mongo.get()
  const mongoId = { _id: new ObjectId(id) }
  await db.collection('users')
    .findOneAndReplace({ _id: new ObjectId(id) }, user)
  return sanitaze(R.merge(mongoId, user))
}

/**
 * Delete user from database.
 * @param {string} id user id
 * @returns {Object} deleted user or null if doesn't exist.
 */
const remove = async id => {
  log.debug(`deleting userId ${id} in database`)
  const db = await mongo.get()
  const removed = await find(id)
  await db.collection('users')
    .findOneAndDelete({ _id: new ObjectId(id) })
  return removed
}

/**
 * Validate if a given id exists in database.
 * @param {string} id to be verified if exists in database.
 * @returns {boolean} true if it exists, false otherwise.
 */
const exists = async id => {
  log.debug(`verifying if userId ${id} exists in database`)
  const db = await mongo.get()
  const count = await db.collection('users')
    .countDocuments({ _id: new ObjectId(id) })
  return count > 0
}

module.exports = {
  save,
  find,
  findByEmail,
  update,
  exists,
  delete: remove,
}
