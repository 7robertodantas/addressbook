'use strict'

const resourceOwner = require('../../middleware/resourceOwnerHandler')

describe('resourceOwner middleware', () => {
  it('should require authenticated user', () => {
    const req = {
      user: null,
      params: {},
    }
    const res = {}
    const next = jest.fn()
    expect(() => resourceOwner(req, res, next)).toThrow(/not authenticated/u)
    expect(next).not.toHaveBeenCalled()
  })
  it('should forbid if request has userId and is different to the authenticated user', () => {
    const req = {
      user: {
        _id: 'ABC321',
        name: 'User Name',
        email: 'email@user.com',
      },
      params: {
        userId: 'ABC111',
      },
    }
    const res = {}
    const next = jest.fn()
    expect(() => resourceOwner(req, res, next)).toThrow(/permission/u)
    expect(next).not.toHaveBeenCalled()
  })
  it('should allow if authenticated user is the same as the resource userId', () => {
    const req = {
      user: {
        id: 'userId',
        name: 'User Name',
        email: 'email@user.com',
      },
      params: {
        userId: 'userId',
      },
    }
    const res = {}
    const next = jest.fn()
    resourceOwner(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
