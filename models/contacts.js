'use strict'

const Joi = require('joi')
const contacts = require('../db/contacts')

const contactSchema = Joi.object().keys({
  name: Joi.string().trim().min(3),
  email: Joi.string().email(),
})

const saveContact = contact => {
  const { error, value } = Joi.validate(contact, contactSchema)

  if (error) {
    throw new Error(error)
  }

  return contacts.save(value)
}

module.exports = {
  saveContact,
}
