'use strict'

const R = require('ramda')
const config = require('config')
const bcrypt = require('bcrypt')
const usersDb = require('../../db/users')
const users = require('../../models/users')

const bcryptConfig = config.get('bcrypt')

jest.mock('../../db/users')

describe('users models', () => {
  describe('findByEmailAndPassword', () => {
    it('should sanitaze returned user', async () => {
      const hash = await bcrypt.hash('password', bcryptConfig.get('saltRounds'))

      usersDb.findByEmail.mockImplementation(email => ({
        id: 'userId',
        name: 'User Name',
        hashPassword: hash,
        email,
      }))

      const user = await users.findByEmailAndPassword('user@email.com', 'password')
      expect(user).toMatchObject({
        id: 'userId',
        name: 'User Name',
        email: 'user@email.com',
      })
      expect(user.hashPassword).not.toBeDefined()
    })
    it('should throw if user was not found', async () => {
      usersDb.findByEmail.mockImplementation(() => null)
      await expect(users.findByEmailAndPassword('user@email.com', 'password'))
        .rejects
        .toThrow(/not found/u)
    })
    it('should throw if the password is wrong', async () => {
      const hash = await bcrypt.hash('password', bcryptConfig.get('saltRounds'))
      usersDb.findByEmail.mockImplementation(email => ({
        id: 'userId',
        name: 'User Name',
        hashPassword: hash,
        email,
      }))
      await expect(users.findByEmailAndPassword('user@email.com', 'wrongpassword'))
        .rejects
        .toThrow(/password/u)
    })
  })
  describe('saveUser', () => {
    it('should save with hashPassword and return sanitazed user', async () => {
      const user = {
        unknown: 'test',
        name: 'User Name',
        email: 'user@email.com',
        password: 'theuserpassword',
      }
      usersDb.save.mockImplementation(toSave => R.merge({ id: 'generatedId' }, toSave))
      const returnedUser = await users.saveUser(user)
      expect(usersDb.save).toHaveBeenCalled()
      expect(returnedUser.hashPassword).not.toBeDefined()
      expect(returnedUser.password).not.toBeDefined()
      expect(returnedUser).toEqual({
        id: 'generatedId',
        name: user.name,
        email: user.email,
      })
      const savedUser = usersDb.save.mock.calls[0][0]
      expect(savedUser).toMatchObject({
        name: user.name,
        email: user.email,
        hashPassword: expect.any(String),
      })
      expect(savedUser.hashPassword).toContain('$2b$')
    })
    it('should throw "password" length must be at least 3 characters long', async () => {
      const user = {
        name: 'User Name',
        email: 'user@email.com',
        password: 'pw',
      }
      await expect(users.saveUser(user))
        .rejects
        .toThrow()
    })
    it('should throw "name" length must be at least 3 characters long', async () => {
      const user = {
        name: 'nm',
        email: 'user@email.com',
        password: 'password',
      }
      await expect(users.saveUser(user))
        .rejects
        .toThrow()
    })
    it('should throw "email" must be a valid email', async () => {
      const user = {
        name: 'User Name',
        email: 'email.com',
        password: 'password',
      }
      await expect(users.saveUser(user))
        .rejects
        .toThrow()
    })
    it('should throw if name is falsy', () => {
      const names = ['', null, NaN, 0, false]
      names.forEach(async invalidName => {
        const user = {
          name: invalidName,
          email: 'user@email.com',
          password: 'password',
        }
        await expect(users.saveUser(user))
          .rejects
          .toThrow()
      })
    })
    it('should throw if email is falsy', () => {
      const emails = ['', null, NaN, 0, false]
      emails.forEach(async invalidEmail => {
        const user = {
          name: 'User Name',
          email: invalidEmail,
          password: 'password',
        }
        await expect(users.saveUser(user))
          .rejects
          .toThrow()
      })
    })
  })
})
