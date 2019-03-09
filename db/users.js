'use strict'

const debug = require('debug')('app:db')

const save = user => {
  debug(`saving user ${user.email} in database`)
}

const find = id => {
  debug(`fetching userId ${id} in database`)
}

const update = id => {
  debug(`updating userId ${id} in database`)
}

const patch = id => {
  debug(`patching userId ${id} in database`)  
}

const del = id => {
  debug(`deleting userId ${id} in database`)
}

module.exports = {
  save,
  find,
  update,
  patch,
  delete: del,
}
