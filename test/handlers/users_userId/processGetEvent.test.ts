import {
  left,
  right
} from 'fp-ts/lib/Either'
import { StatusCodes } from 'http-status-codes'
import { UserNotFoundError } from '../../../src/errors'
import type { User } from '../../../src/domain/models'
import type { Event } from '../../../src/handlers/users_userId/Event'
import { processGetEvent } from '../../../src/handlers/users_userId/processGetEvent'
import { UserGetter } from '../../../src/usecases'

describe('processGetEvent()', () => {
  const getSpy = jest.spyOn(UserGetter.prototype, 'get')
  const event = {
    pathParameters: {
      userId: 'test userId'
    }
  } as unknown as Event

  afterEach(() => {
    getSpy.mockReset()
  })

  describe('if UserGetter#get returns Left<UserNotFoundError>', () => {
    const error = new UserNotFoundError('test error')

    beforeEach(() => {
      getSpy.mockResolvedValue(left(error))
    })

    it(`returns ${StatusCodes.NOT_FOUND} response`, async () => {
      const result = await processGetEvent(event)
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
      expect(result.body).toBe(error.message)
      expect(getSpy).toBeCalledTimes(1)
      expect(getSpy).toBeCalledWith(event.pathParameters.userId)
    })
  })

  describe('if UserGetter#get returns Right<User>', () => {
    const user: User = {
      id: 'test id',
      name: 'test name'
    }

    beforeEach(() => {
      getSpy.mockResolvedValue(right(user))
    })

    it(`returns ${StatusCodes.OK} response`, async () => {
      const result = await processGetEvent(event)
      expect(result.statusCode).toBe(StatusCodes.OK)
      expect(JSON.parse(result.body)).toEqual(user)
      expect(getSpy).toBeCalledTimes(1)
      expect(getSpy).toBeCalledWith(event.pathParameters.userId)
    })
  })
})
