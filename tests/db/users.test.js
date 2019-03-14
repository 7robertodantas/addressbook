'use strict'

const mongo = require('../../db/mongodb')
const users = require('../../db/users')

jest.mock('../../db/mongodb')

describe('users db', () => {
  const generateId = id => ({ toHexString: () => id })

  const collection = {
    countDocuments: jest.fn(),
    insertOne: jest.fn(),
    findOne: jest.fn(),
    findOneAndReplace: jest.fn(),
    findOneAndDelete: jest.fn(),
  }

  const db = {
    collection: () => collection,
  }

  beforeAll(() => {
    mongo.ObjectId.mockImplementation(id => generateId(id))
    mongo.get.mockImplementation(() => db)
  })

  describe('save', () => {
    it('should save and return sanitazed _id in the returned user', async () => {
      collection.insertOne.mockImplementationOnce(() => ({ insertedId: generateId(10) }))
      const user = {
        name: 'User Name',
        email: 'user@email.com',
      }
      expect(await users.save(user)).toEqual({
        id: 10,
        name: user.name,
        email: user.email,
      })
      expect(collection.insertOne).toHaveBeenCalled()
    })
  })
  describe('find', () => {
    it('should sanitaze _id property in the returned user if found', async () => {
      collection.findOne.mockImplementationOnce(() => ({
        _id: generateId(11),
        name: 'User Name',
        email: 'user@email.com',
      }))
      expect(await users.find(11)).toEqual({
        id: 11,
        name: 'User Name',
        email: 'user@email.com',
      })
    })
    it('should return null if not found', async () => {
      collection.findOne.mockImplementationOnce(() => null)
      expect(await users.find(11)).toBeFalsy()
      expect(collection.findOne).toHaveBeenCalled()
    })
  })
  describe('findByEmail', () => {
    it('should sanitaze _id property in the returned user if found', async () => {
      collection.findOne.mockImplementationOnce(() => ({
        _id: generateId(12),
        name: 'User Name',
        email: 'user@email.com',
      }))
      expect(await users.findByEmail('user@email.com')).toEqual({
        id: 12,
        name: 'User Name',
        email: 'user@email.com',
      })
    })
    it('should return null if not found', async () => {
      collection.findOne.mockImplementationOnce(() => null)
      expect(await users.findByEmail('user@email.com')).toBeFalsy()
      expect(collection.findOne).toHaveBeenCalled()
    })
  })
  describe('update', () => {
    it('should include id in the returned user', async () => {
      collection.findOneAndReplace.mockImplementationOnce(() => null)
      const user = {
        name: 'User Name',
        email: 'user@email.com',
      }
      expect(await users.update('13', user)).toEqual({
        id: '13',
        name: 'User Name',
        email: 'user@email.com',
      })
      expect(collection.findOneAndReplace).toHaveBeenCalled()
    })
  })
  describe('delete', () => {
    it('should find and return the removed user', async () => {
      const user = {
        id: '14',
        name: 'User Name',
        email: 'user@email.com',
      }
      collection.findOne.mockImplementationOnce(() => user)
      expect(await users.delete('14')).toEqual(user)
      expect(collection.findOneAndDelete).toHaveBeenCalled()
    })
  })
  describe('exists', () => {
    it('should return true if count > 0', async () => {
      collection.countDocuments.mockImplementationOnce(() => 1)
      expect(await users.exists('12')).toBe(true)
      expect(collection.countDocuments).toHaveBeenCalled()
    })
    it('should return false if count <= 0', async () => {
      collection.countDocuments.mockImplementationOnce(() => 0)
      expect(await users.exists('12')).toBe(false)
      expect(collection.countDocuments).toHaveBeenCalled()
    })
  })
})
