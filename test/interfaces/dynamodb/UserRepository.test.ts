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

    describe('if error occurred when getting record', () => {
      const error = new Error('test error')

      beforeEach(() => {
        getPromiseMock.mockRejectedValue(error)
      })

      it('throws it', async () => {
        await expect(repo.findById('test id')).rejects.toThrow(error)
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
      })
    })

    describe('if record is empty', () => {
      beforeEach(() => {
        getPromiseMock.mockResolvedValue({
          Item: {}
        })
      })

      it('throws UserNotFoundError', async () => {
        await expect(repo.findById('test id')).rejects.toThrow(UserNotFoundError)
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
      })
    })

    describe('if record is not empty', () => {
      const id = 'test id'
      const user = {
        id,
        name: 'test name'
      }

      beforeEach(() => {
        getPromiseMock.mockResolvedValue({
          Item: user
        })
      })

      it('returns it', async () => {
        await expect(repo.findById(id)).resolves.toBe(user)
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
      })
    })
  })
})
