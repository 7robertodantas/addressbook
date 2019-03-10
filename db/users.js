'use strict'

const debug = require('debug')('app:db')

const save = user => {
  debug(`saving user ${user.email} in database`)
  return Promise.resolve(user)
}

const find = id => {
  debug(`fetching userId ${id} in database`)
  return Promise.resolve()
}

const findByEmail = email => {
  debug(`fetching email ${email} in database`)
  return Promise.resolve()
}

const update = id => {
  debug(`updating userId ${id} in database`)
  return Promise.resolve()
}

const patch = id => {
  debug(`patching userId ${id} in database`)
  return Promise.resolve()
}

const del = id => {
  debug(`deleting userId ${id} in database`)
  return Promise.resolve()
}

const exists = id => {
  debug(`verifying if userId ${id} exists in database`)
  return Promise.resolve()
}

module.exports = {
  save,
  find,
  findByEmail,
  update,
  patch,
  exists,
  delete: del,
}
