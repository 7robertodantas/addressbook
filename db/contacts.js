'use strict'

const R = require('ramda')
const debug = require('debug')('app:db')
const config = require('config')
const firebase = require('firebase')

firebase.initializeApp(config.get('firebase'))

const save = async (userId, contact) => {
  debug(`saving userId ${userId} contact ${contact} in firebase`)
  const reference = await firebase.database().ref('/users')
    .child(userId)
    .child('contacts')
    .push(contact)
  return R.merge({ id: reference.key }, contact)
}

module.exports = {
  save,
}
