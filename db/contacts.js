'use strict'

const R = require('ramda')
const debug = require('debug')('app:db')
const config = require('config')
const firebase = require('firebase')

const firebaseOptions = config.get('firebase')

/**
 * Initialize firebase.
 */
debug(`Initializing firebase on ${firebaseOptions.databaseURL}`)
firebase.initializeApp(firebaseOptions)

/**
 * Save the user contact in database.
 * @param {string} userId owner of the contact
 * @param {Object} contact contact object to be saved in user's collection.
 * @returns {Promise} with the saved contact.
 */
const save = async (userId, contact) => {
  debug(`saving userId ${userId} contact ${contact.email} in firebase`)
  const reference = await firebase.database()
    .ref('/users')
    .child(userId)
    .child('contacts')
    .push(contact)
  return R.merge({ id: reference.key }, contact)
}

module.exports = {
  save,
}
