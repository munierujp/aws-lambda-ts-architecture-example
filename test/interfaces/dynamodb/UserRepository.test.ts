import type { DynamoDB } from 'aws-sdk'
import {
  isNone,
  isSome
} from 'fp-ts/lib/Option'
import type { Some } from 'fp-ts/lib/Option'
import type { User } from '../../../src/domain/models'
import { UserRepository } from '../../../src/interfaces/dynamodb/UserRepository'

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

    describe('if record is invalid as User', () => {
      const id = 'test id'

      beforeEach(() => {
        getPromiseMock.mockResolvedValue({
          Item: {}
        })
      })

      it('returns None', async () => {
        const optionalUser = await repo.findById(id)
        expect(isNone(optionalUser)).toBeTruthy()
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
      })
    })

    describe('if record is valid as User', () => {
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

      it('returns Some<User>', async () => {
        const optionalUser = await repo.findById(id)
        expect(isSome(optionalUser)).toBeTruthy()
        expect((optionalUser as Some<User>).value).toBe(user)
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
      })
    })
  })
})
