'use strict'

const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../../models/auth')
const users = require('../../models/users')

const secret = config.get('jwt.secretOrPrivateKey')
const options = config.get('jwt.options')

jest.mock('../../models/users')

describe('auth models', () => {
  it('should generate a token and verify it', () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }
    users.findUserByEmailAndPassword.mockImplementation(() => mockUser)
    const token = auth.sign('user@email.com', 'password')
    expect(token).toBeDefined()

    const user = auth.verify(token)
    expect(user).toBeDefined()
    expect(user).toMatchObject(mockUser)
  })
  it('should give error when user was not found', () => {
    users.findUserByEmailAndPassword.mockImplementation(() => null)
    expect(() => auth.sign('user@email.com', 'password')).toThrow(/not found/u)
  })
  it('should give error when token is invalid', () => {
    expect(() => auth.verify('f3ce6b8b-c8c8-4e1e-84fc-b77b05ab3233')).toThrow(/malformed/u)
  })
  it('should give error when token is expired', () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }

    const token = jwt.sign({ user: mockUser }, secret, { ...options.sign, expiresIn: '-1h' })
    expect(() => auth.verify(token)).toThrow(/expired/u)
  })
  it('should give error when token issuer does not match', () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }
    const token = jwt.sign({ user: mockUser }, secret, { ...options.sign, issuer: 'random' })
    expect(() => auth.verify(token)).toThrow(/issuer invalid/u)
  })
  it('should give error when token secret does not match', () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }
    const token = jwt.sign({ user: mockUser }, 'random-secret', { ...options.sign })
    expect(() => auth.verify(token)).toThrow(/invalid signature/u)
  })
})
