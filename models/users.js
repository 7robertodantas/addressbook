'use strict'

const R = require('ramda')
const Boom = require('boom')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const config = require('config')
const log = require('../logger')
const users = require('../db/users')

const bcryptConfig = config.get('bcrypt')

/**
 * Represents the expected user's object.
 */
const userSchema = Joi.object().keys({
  name: Joi.string().trim().min(3),
  email: Joi.string().email()
    .required(),
  password: Joi.string().alphanum().min(3),
}).options({ stripUnknown: true })

/**
 * Sanitazes user object, removing password or unknown attributes.
 * @param {Object} user - the user instance.
 * @param {string} user.name - user's name.
 * @param {string} user.email - user's email.
 * @param {string} user.password - user's password.
 * @returns {Object} a partial copy of the user containing only the keys
 * ['id', 'name', 'email']. If the key does not exist, the property is ignored.
 */
const sanitazeUser = user => R.pick(['id', 'name', 'email'], user)

/**
 * Hashes the given string and returns the hash.
 * @param {String} password the plain text string to be hashed.
 * @returns {Promise} bcrypt hash string.
 */
const hashPassword = password => bcrypt.hash(password, bcryptConfig.get('saltRounds'))

/**
 * Parses the user object in the schema and validates it.
 * @param {Object} user - the user instance.
 * @param {string} user.name - user's name.
 * @param {string} user.email - user's email.
 * @param {string} user.password - user's password.
 * @param {Array} additionalRequired - additional attributes to validate as required
 * @throws {Error} if the user object does not match schema.
 * @returns {Object} user instance.
 */
const parseSchema = (user, additionalRequired = []) => {
  const { error, value } = Joi.validate(user, userSchema)
  if (error) {
    const details = R.pluck('message', error.details)
    throw Boom.badRequest(`Invalid request. ${R.join(',', details)}`)
  }
  const missingRequireds = R.map(key => `"${key}"`, R.difference(additionalRequired, R.keys(value)))
  if (!R.isEmpty(missingRequireds)) {
    throw Boom.badRequest(`Invalid request. ${R.join(',', missingRequireds)} is required.`)
  }
  return value
}

/**
 * Validates the user by its schema and saves it in some database.
 * @param {Object} user - the user to be saved.
 * @param {string} user.name - user's name.
 * @param {string} user.email - user's email.
 * @param {string} user.password - user's password.
 * @throws {Error} - Bad Request if the user object doesn't match the schema.
 * @returns {Promise} sanitazed saved user with the generated id and without password attribute.
 * @see sanitazeUser
 */
const saveUser = async user => {
  log.debug('validating user to save', user)
  const validatedUser = parseSchema(user, ['password'])
  const hash = await hashPassword(validatedUser.password)
  const sanitazedUser = sanitazeUser(validatedUser)
  const toSave = R.merge({ hashPassword: hash }, sanitazedUser)
  const savedUser = await users.save(toSave)
  return sanitazeUser(savedUser)
}

/**
 * Fetches the user in database and 
 * validate its password with the given password.
 * @param {string} email - user's email
 * @param {string} password - password to match with the user's password.
 * @throws {Error} - If user was not found or password doesn't match.
 * @returns {Promise} founded user sanitazed.
 * @see sanitazeUser
 */
const findUserByEmailAndPassword = async (email, password) => {
  log.debug(`verifying email ${email} and password`)
  const user = await users.findByEmail(email)
  if (!user) {
    throw Boom.notFound('User not found', { email })
  }

  const match = await bcrypt.compare(password, user.hashPassword)
  if (!match) {
    throw Boom.forbidden('Wrong password', { email })
  }

  return sanitazeUser(user)
}

/**
 * Fetches the user in database by id.
 * @param {string} id - user's id
 * @throws {Error} - If user was not found.
 * @returns {Promise} founded user sanitazed.
 * @see sanitazeUser
 */
const findUser = async id => {
  log.debug(`finding user by id ${id}`)
  const user = await users.find(id)
  if (!user) {
    throw Boom.notFound('User was not found', { id })
  }

  return sanitazeUser(user)
}

/**
 * Replace user content in database.
 * @param {string} id - the user's id that will have its data replaced.
 * @param {Object} user - the user to be replaced.
 * @param {string} user.name - user's name.
 * @param {string} user.email - user's email.
 * @param {string} user.password - user's password.
 * @throws {Error} - Bad Request if the user object doesn't match the schema.
 * @returns {Promise} saved user with the generated id and without password attribute.
 * @see sanitazeUser function.
 */
const replaceUser = async (id, user) => {
  log.debug(`replacing userId ${id} content`, user)
  const exists = await users.exists(id)
  if (!exists) {
    throw Boom.notFound('User was not found', { id })
  }

  const validatedUser = parseSchema(user, ['password'])
  const hash = await hashPassword(validatedUser.password)
  const sanitazedUser = sanitazeUser(validatedUser)
  const toReplace = R.merge({ hashPassword: hash }, sanitazedUser)
  const savedUser = await users.update(id, toReplace)
  return sanitazeUser(savedUser)
}

/**
 * Auxiliary method to just validate the schema.
 * The caller is not interested in getting the
 * returned user.
 * @param {Object} user - the user instance to be validated.
 * @returns {void}
 */
const validateSchema = user => {
  parseSchema(user)
}

/**
 * Patch the user content by changing only the keys
 * that has some difference to the current content.
 * @param {string} id - the user's id that will have its data replaced.
 * @param {Object} patch - the partial user object to be patched.
 * @param {Object} patch.name - optional value that will change user name.
 * @param {Object} patch.email - optional value that will change user email.
 * @param {Object} patch.password - optional value that will change user password.
 * @throws {Error} - Bad Request if the user object doesn't match the schema.
 * @returns {Promise} sanitazed saved user with the generated id and without password attribute.
 * @see sanitazeUser function.
 */
const patchUser = async (id, patch) => {
  log.debug(`patching current userId ${id}`, patch)
  const user = await users.find(id)
  if (!user) {
    throw Boom.notFound('User was not found', { id })
  }

  let sanitzedPatch = R.omit(['id'], sanitazeUser(patch))
  if (patch.password) {
    const hash = await hashPassword(patch.password)
    sanitzedPatch = R.merge({ hashPassword: hash }, sanitzedPatch)
  }

  const patchedUser = R.mergeDeepLeft(sanitzedPatch, user)
  validateSchema(patchedUser)
  const savedUser = await users.update(id, patchedUser)
  return sanitazeUser(savedUser)
}

/**
 * Deletes an user from database by id.
 * @param {string} id - user's id
 * @throws {Error} - If user was not found.
 * @returns {Promise} deleted user sanitazed.
 * @see sanitazeUser function.
 */
const deleteUser = async id => {
  log.debug(`deleting userId ${id}`)
  const deletedUser = await users.delete(id)
  if (!deletedUser) {
    throw Boom.notFound('User was not found', { id })
  }

  return sanitazeUser(deletedUser)
}

module.exports = {
  saveUser,
  findUser,
  findUserByEmailAndPassword,
  replaceUser,
  patchUser,
  deleteUser,
  hashPassword,
}
