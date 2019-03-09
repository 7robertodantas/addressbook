'use strict'

const debug = require('debug')('app:middleware')

const resourceOwner = (req, res, next) => {
  debug(`Validating if authenticated user matches userId ${req.params.userId} resource`)

  if (!req.user) {
    const error = { message: 'User is not authenticated.' }
    return res.status(401).send(error)
  }

  if (req.params.userId && req.user.id !== req.params.userId) {
    const error = { message: 'User does not have permission to access the given resource.' }
    return res.status(403).send(error)
  }

  return next()
}

module.exports = resourceOwner
