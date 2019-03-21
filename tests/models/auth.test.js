'use strict'

const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../../models/auth')
const users = require('../../models/users')

const secret = config.get('jwt.secretOrPrivateKey')
const options = config.get('jwt.options')

jest.mock('../../models/users')

describe('auth models', () => {
  it('should generate a token and verify it', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }
    users.findUserByEmailAndPassword.mockImplementation(() => mockUser)
    const token = await auth.sign('user@email.com', 'password')
    expect(token).toBeDefined()

    const user = await auth.verify(token)
    expect(user).toBeDefined()
    expect(user).toMatchObject(mockUser)
  })
  it('should give error when user was not found', async () => {
    users.findUserByEmailAndPassword.mockImplementation(() => null)
    await expect(auth.sign('user@email.com', 'password'))
      .rejects
      .toThrow(/not found/u)
  })
  it('should give error when token is invalid', async () => {
    await expect(auth.verify('f3ce6b8b-c8c8-4e1e-84fc-b77b05ab3233'))
      .rejects
      .toThrow(/malformed/u)
  })
  it('should give error when token is expired', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }

    const token = await jwt.sign({ user: mockUser }, secret, { ...options.sign, expiresIn: '-1h' })
    await expect(auth.verify(token))
      .rejects
      .toThrow(/expired/u)
  })
  it('should give error when token issuer does not match', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }
    const token = await jwt.sign({ user: mockUser }, secret, { ...options.sign, issuer: 'random' })
    await expect(auth.verify(token))
      .rejects
      .toThrow(/issuer invalid/u)
  })
  it('should give error when token secret does not match', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'User Name',
      email: 'user@email.com',
    }
    const token = await jwt.sign({ user: mockUser }, 'random-secret', { ...options.sign })
    await expect(auth.verify(token))
      .rejects
      .toThrow(/invalid signature/u)
  })
})
