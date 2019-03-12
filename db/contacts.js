'use strict'

const R = require('ramda')
const config = require('config')
const firebase = require('firebase')
const log = require('../logger')

const firebaseOptions = config.get('firebase')

/**
 * Initialize firebase.
 */
log.info(`Initializing firebase at ${firebaseOptions.databaseURL}`)
firebase.initializeApp(firebaseOptions)

/**
 * Save the user contact in database.
 * @param {string} userId owner of the contact
 * @param {Object} contact contact object to be saved in user's collection.
 * @returns {Promise} with the saved contact.
 */
const save = async (userId, contact) => {
  log.debug(`saving contact for userId ${userId} in firebase`, contact)
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
