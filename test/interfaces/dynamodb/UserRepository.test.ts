import { UserNotFoundError } from '../../../src/errors'
import { UserRepository } from '../../../src/interfaces/dynamodb/UserRepository'
import type { DynamoDB } from 'aws-sdk'
import type { User } from '../../../src/domain/models'

describe('UserRepository', () => {
  describe('findById()', () => {
    const getMock = jest.fn()
    const getPromiseMock = jest.fn()

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
      getMock.mockReset()
      getPromiseMock.mockReset()
    })

    it('returns record if it is not empty', async () => {
      const id = 'test id'
      const user: User = {
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

    it('throws UserNotFoundError if record is empty', async () => {
      const id = 'test id'
      const user = {}
      getPromiseMock.mockResolvedValue({
        Item: user
      })

      await expect(repo.findById(id)).rejects.toThrow(UserNotFoundError)
      expect(getMock).toBeCalledTimes(1)
      expect(getPromiseMock).toBeCalledTimes(1)
    })

    it('throws error if it occurred when getting record', async () => {
      const id = 'test id'
      const error = new Error('test error')
      getPromiseMock.mockRejectedValue(error)

      await expect(repo.findById(id)).rejects.toThrow(error)
      expect(getMock).toBeCalledTimes(1)
      expect(getPromiseMock).toBeCalledTimes(1)
    })
  })
})
