'use strict'

const R = require('ramda')
const Boom = require('boom')
const debug = require('debug')('app:db')
const mongo = require('./mongodb')

const ObjectId = mongo.ObjectId

const sanitaze = document =>
  document ? R.omit(['_id'], R.merge({ id: document._id.toHexString() }, document)) : null

const existsEmail = async email => {
  debug(`verifying if email ${email} exists in database`)
  const db = await mongo.get()
  const count = await db.collection('users')
    .countDocuments({ email })
  return count > 0
}

const save = async user => {
  debug(`saving user ${user.email} in database`)

  const exists = await existsEmail(user.email)
  if (exists) {
    throw Boom.conflict('User with the given email already exists', { email: user.email })
  }

  const db = await mongo.get()
  const result = await db.collection('users').insertOne(user)
  return R.merge({ id: result.insertedId.toHexString() }, user)
}

const find = async id => {
  debug(`fetching userId ${id} in database`)
  const db = await mongo.get()
  const found = await db.collection('users').findOne({ _id: new ObjectId(id) })
  return sanitaze(found)
}

const findByEmail = async email => {
  debug(`fetching email ${email} in database`)
  const db = await mongo.get()
  const found = await db.collection('users').findOne({ email })
  return sanitaze(found)
}

const update = async (id, user) => {
  debug(`updating userId ${id} in database`)
  const db = await mongo.get()
  const replaced = await db.collection('users')
    .findOneAndReplace({ _id: new ObjectId(id) }, user)
  return sanitaze(replaced)
}

const remove = async id => {
  debug(`deleting userId ${id} in database`)
  const db = await mongo.get()
  const replaced = await db.collection('users')
    .findOneAndDelete({ _id: new ObjectId(id) })
  return sanitaze(replaced)
}

const exists = async id => {
  debug(`verifying if userId ${id} exists in database`)
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
