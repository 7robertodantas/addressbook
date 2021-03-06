'use strict'

const R = require('ramda')
const Boom = require('boom')
const Joi = require('joi')
const log = require('../logger')
const contacts = require('../db/contacts')
const users = require('../db/users')

/**
 * Represents the expected contact's object.
 */
const contactSchema = Joi.object().keys({
  name: Joi.string().trim().min(3)
    .required(),
  email: Joi.string().email(),
  address: Joi.object().keys({
    street: Joi.string().required(),
    zipCode: Joi.string().required(),
  }),
}).options({ stripUnknown: true })

/**
 * Parses the user object in the schema and validates it.
 * @param {Object} contact - the contact instance.
 * @param {string} contact.name - contact's name.
 * @param {string} contact.email - contact's email.
 * @throws {Error} if the contact object does not match schema.
 * @returns {Object} contact instance.
 */
const parseSchema = contact => {
  const { error, value } = Joi.validate(contact, contactSchema)
  if (error) {
    const details = R.pluck('message', error.details)
    throw Boom.badRequest(`Invalid request. ${R.join(',', details)}`)
  }
  return value
}

/**
 * Parses a contact, validates it and save it in some database.
 * @param {string} userId - the contact's list owner id.
 * @param {Object} contact - the contact instance.
 * @param {string} contact.name - contact's name.
 * @param {string} contact.email - contact's email.
 * @throws {Error} if the contact object does not match schema.
 * @returns {Object} saved contact with the generated id.
 */
const saveContact = async (userId, contact) => {
  log.debug(`saving contact for userId ${userId} in database`, contact)
  const exists = await users.exists(userId)
  if (!exists) {
    throw Boom.notFound('User was not found', { id: userId })
  }

  const validatedContact = parseSchema(contact)
  return contacts.save(userId, validatedContact)
}

module.exports = {
  saveContact,
}
