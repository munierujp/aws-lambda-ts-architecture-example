import { UserNotFoundError } from '../../../src/errors'
import { UserRepository } from '../../../src/interfaces/dynamodb/UserRepository'
import type { DynamoDB } from 'aws-sdk'

describe('UserRepository', () => {
  describe('findById()', () => {
    const getPromiseMock = jest.fn()
    const getMock = jest.fn()
    const dynamodb = {
      get: getMock
    } as unknown as DynamoDB.DocumentClient
    const repo = new UserRepository(dynamodb)

    beforeEach(() => {
      getMock.mockReturnValue({
        promise: getPromiseMock
      })
    })

    afterEach(() => {
      getPromiseMock.mockReset()
      getMock.mockReset()
    })

    it('throws error if it occurred when getting record', async () => {
      const error = new Error('test error')
      getPromiseMock.mockRejectedValue(error)

      await expect(repo.findById('test id')).rejects.toThrow(error)
      expect(getMock).toBeCalledTimes(1)
      expect(getPromiseMock).toBeCalledTimes(1)
    })

    it('throws UserNotFoundError if record is empty', async () => {
      getPromiseMock.mockResolvedValue({
        Item: {}
      })

      await expect(repo.findById('test id')).rejects.toThrow(UserNotFoundError)
      expect(getMock).toBeCalledTimes(1)
      expect(getPromiseMock).toBeCalledTimes(1)
    })

    it('returns record if it is not empty', async () => {
      const id = 'test id'
      const user = {
        id,
        name: 'test name'
      }
      getPromiseMock.mockResolvedValue({
        Item: user
      })

      await expect(repo.findById(id)).resolves.toBe(user)
      expect(getMock).toBeCalledTimes(1)
      expect(getPromiseMock).toBeCalledTimes(1)
    })
  })
})
