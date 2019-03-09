'use strict'

const Joi = require('joi')
const users = require('../db/users')

const userSchema = Joi.object().keys({
  name: Joi.string().trim().min(3),
  email: Joi.string().email(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/u),
})

const saveUser = user => {
  const { error, value } = Joi.validate(user, userSchema)

  if (error) {
    throw new Error(error)
  }

  return users.save(value)
}

const findUser = id => {
  return users.find(id)
}

const updateUser = (id, user) => {
  return users.update(id, user)
}

const patchUser = (id, patch) => {
  return users.patch(id, patch)
}

const deleteUser = id => {
  return users.delete(id)
}

module.exports = {
  saveUser,
  findUser,
  updateUser,
  patchUser,
  deleteUser,
}
