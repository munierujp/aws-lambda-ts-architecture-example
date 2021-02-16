import type { DynamoDB } from 'aws-sdk'
import {
  isNone,
  isSome
} from 'fp-ts/lib/Option'
import type { Some } from 'fp-ts/lib/Option'
import type { User } from '../../../src/domain/models'
import * as UserModule from '../../../src/domain/models/User'
import { UserRepository } from '../../../src/interfaces/dynamodb/UserRepository'

describe('UserRepository', () => {
  describe('findById()', () => {
    const isUserSpy = jest.spyOn(UserModule, 'isUser')
    const getPromiseMock = jest.fn()
    const getMock = jest.fn()

    const dynamodb = {
      get: getMock
    } as unknown as DynamoDB.DocumentClient
    const repo = new UserRepository(dynamodb)
    const id = 'test id'
    const item: User = {
      id,
      name: 'test name'
    }

    beforeEach(() => {
      getPromiseMock.mockResolvedValue({
        Item: item
      })
      getMock.mockReturnValue({
        promise: getPromiseMock
      })
    })

    afterEach(() => {
      isUserSpy.mockReset()
      getPromiseMock.mockReset()
      getMock.mockReset()
    })

    describe('if record is valid as User', () => {
      beforeEach(() => {
        isUserSpy.mockReturnValue(true)
      })

      it('returns Some<User>', async () => {
        const optionalUser = await repo.findById(id)
        expect(isSome(optionalUser)).toBeTruthy()
        expect((optionalUser as Some<User>).value).toBe(item)
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
        expect(isUserSpy).toBeCalledTimes(1)
        expect(isUserSpy).toBeCalledWith(item)
      })
    })

    describe('if record is invalid as User', () => {
      beforeEach(() => {
        isUserSpy.mockReturnValue(false)
      })

      it('returns None', async () => {
        const optionalUser = await repo.findById(id)
        expect(isNone(optionalUser)).toBeTruthy()
        expect(getMock).toBeCalledTimes(1)
        expect(getPromiseMock).toBeCalledTimes(1)
        expect(isUserSpy).toBeCalledTimes(1)
        expect(isUserSpy).toBeCalledWith(item)
      })
    })
  })
})
