'use strict'

const R = require('ramda')
const config = require('config')
const bcrypt = require('bcrypt')
const usersDb = require('../../db/users')
const users = require('../../models/users')

const bcryptConfig = config.get('bcrypt')

jest.mock('../../db/users')

describe('users models', () => {
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
        .toThrow(/Invalid/u)
    })
    it('should throw "name" length must be at least 3 characters long', async () => {
      const user = {
        name: 'nm',
        email: 'user@email.com',
        password: 'password',
      }
      await expect(users.saveUser(user))
        .rejects
        .toThrow(/Invalid/u)
    })
    it('should throw "email" must be a valid email', async () => {
      const user = {
        name: 'User Name',
        email: 'email.com',
        password: 'password',
      }
      await expect(users.saveUser(user))
        .rejects
        .toThrow(/Invalid/u)
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
          .toThrow(/Invalid/u)
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
          .toThrow(/Invalid/u)
      })
    })
    it('should throw if password is falsy', () => {
      const passwords = ['', null, NaN, 0, false]
      passwords.forEach(async invalidPassword => {
        const user = {
          name: 'User Name',
          email: 'user@email.com',
          password: invalidPassword,
        }
        await expect(users.saveUser(user))
          .rejects
          .toThrow(/Invalid/u)
      })
    })
  })
  describe('replaceUser', () => {
    it('should save with hashPassword and return sanitazed user', async () => {
      const replaceUser = {
        name: 'User Name2',
        email: 'user2@email.com',
        password: 'theuserpassword2',
      }
      usersDb.exists.mockImplementation(() => true)
      usersDb.update.mockImplementation((id, toReplace) => R.merge({ id }, toReplace))
      const returnedUser = await users.replaceUser('userId', replaceUser)
      expect(usersDb.exists).toHaveBeenCalled()
      expect(usersDb.update).toHaveBeenCalled()
      expect(returnedUser.hashPassword).not.toBeDefined()
      expect(returnedUser.password).not.toBeDefined()
      expect(returnedUser).toEqual({
        id: 'userId',
        name: replaceUser.name,
        email: replaceUser.email,
      })
      const savedUser = usersDb.update.mock.calls[0][1]
      expect(savedUser).toMatchObject({
        name: replaceUser.name,
        email: replaceUser.email,
        hashPassword: expect.any(String),
      })
      expect(savedUser.hashPassword).toContain('$2b$')
    })
    it('should throw if user was not found', async () => {
      const user = {
        name: 'User Name',
        email: 'user@email.com',
        password: 'pw',
      }
      usersDb.exists.mockImplementation(() => false)
      await expect(users.replaceUser('userId', user))
        .rejects
        .toThrow(/not found/u)
    })
    it('should throw "password" length must be at least 3 characters long', async () => {
      const user = {
        name: 'User Name',
        email: 'user@email.com',
        password: 'pw',
      }
      usersDb.exists.mockImplementation(() => true)
      await expect(users.replaceUser('userId', user))
        .rejects
        .toThrow(/Invalid/u)
    })
    it('should throw "name" length must be at least 3 characters long', async () => {
      const user = {
        name: 'nm',
        email: 'user@email.com',
        password: 'password',
      }
      usersDb.exists.mockImplementation(() => true)
      await expect(users.replaceUser('userId', user))
        .rejects
        .toThrow(/Invalid/u)
    })
    it('should throw "email" must be a valid email', async () => {
      const user = {
        name: 'User Name',
        email: 'email.com',
        password: 'password',
      }
      usersDb.exists.mockImplementation(() => true)
      await expect(users.replaceUser('userId', user))
        .rejects
        .toThrow(/Invalid/u)
    })
    it('should throw if name is falsy', () => {
      const names = ['', null, NaN, 0, false]
      usersDb.exists.mockImplementation(() => true)
      names.forEach(async invalidName => {
        const user = {
          name: invalidName,
          email: 'user@email.com',
          password: 'password',
        }
        await expect(users.replaceUser('userId', user))
          .rejects
          .toThrow(/Invalid/u)
      })
    })
    it('should throw if email is falsy', () => {
      const emails = ['', null, NaN, 0, false]
      usersDb.exists.mockImplementation(() => true)
      emails.forEach(async invalidEmail => {
        const user = {
          name: 'User Name',
          email: invalidEmail,
          password: 'password',
        }
        await expect(users.replaceUser('userId', user))
          .rejects
          .toThrow(/Invalid/u)
      })
    })
    it('should throw if password is falsy', () => {
      const passwords = ['', null, NaN, 0, false]
      usersDb.exists.mockImplementation(() => true)
      passwords.forEach(async invalidPassword => {
        const user = {
          name: 'User Name',
          email: 'user@email.com',
          password: invalidPassword,
        }
        await expect(users.replaceUser('userId', user))
          .rejects
          .toThrow(/Invalid/u)
      })
    })
  })
  describe('findUser', () => {
    it('should sanitaze returned user', async () => {
      const hash = await bcrypt.hash('password', bcryptConfig.get('saltRounds'))

      usersDb.find.mockImplementation(id => ({
        id,
        name: 'User Name',
        hashPassword: hash,
        email: 'user@email.com',
      }))

      const user = await users.findUser('userId')
      expect(user).toMatchObject({
        id: 'userId',
        name: 'User Name',
        email: 'user@email.com',
      })
      expect(user.hashPassword).not.toBeDefined()
    })
    it('should throw if user was not found', async () => {
      usersDb.find.mockImplementation(() => null)
      await expect(users.findUser('userId'))
        .rejects
        .toThrow(/not found/u)
    })
  })
  describe('deleteUser', () => {
    it('should sanitaze returned deleted user', async () => {
      const hash = await bcrypt.hash('password', bcryptConfig.get('saltRounds'))

      usersDb.delete.mockImplementation(id => ({
        id,
        name: 'User Name',
        hashPassword: hash,
        email: 'user@email.com',
      }))

      const user = await users.deleteUser('userId')
      expect(user).toMatchObject({
        id: 'userId',
        name: 'User Name',
        email: 'user@email.com',
      })
      expect(user.hashPassword).not.toBeDefined()
    })
    it('should throw if user was not found', async () => {
      usersDb.delete.mockImplementation(() => null)
      await expect(users.deleteUser('userId'))
        .rejects
        .toThrow(/not found/u)
    })
  })
  describe('findUserByEmailAndPassword', () => {
    it('should sanitaze returned user', async () => {
      const hash = await bcrypt.hash('password', bcryptConfig.get('saltRounds'))

      usersDb.findByEmail.mockImplementation(email => ({
        id: 'userId',
        name: 'User Name',
        hashPassword: hash,
        email,
      }))

      const user = await users.findUserByEmailAndPassword('user@email.com', 'password')
      expect(user).toMatchObject({
        id: 'userId',
        name: 'User Name',
        email: 'user@email.com',
      })
      expect(user.hashPassword).not.toBeDefined()
    })
    it('should throw if user was not found', async () => {
      usersDb.findByEmail.mockImplementation(() => null)
      await expect(users.findUserByEmailAndPassword('user@email.com', 'password'))
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
      await expect(users.findUserByEmailAndPassword('user@email.com', 'wrongpassword'))
        .rejects
        .toThrow(/password/u)
    })
  })
})
