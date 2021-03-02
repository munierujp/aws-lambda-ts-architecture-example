import {
  left,
  right
} from 'fp-ts/lib/Either'
import { StatusCodes } from 'http-status-codes'
import type { User } from '../../../src/domain/models'
import { UserNotFoundError } from '../../../src/errors'
import type { Event } from '../../../src/handlers/users_userId/Event'
import { GetEventProcessor } from '../../../src/handlers/users_userId/GetEventProcessor'
import type { UserGetter } from '../../../src/usecases'

describe('GetEventProcessor', () => {
  const getMock = jest.fn()

  const userGetter = {
    get: getMock
  } as unknown as UserGetter
  const processor = new GetEventProcessor({ userGetter })

  afterEach(() => {
    getMock.mockReset()
  })

  describe('process()', () => {
    const event = {
      pathParameters: {
        userId: 'test userId'
      }
    } as unknown as Event

    describe('if UserGetter#get returns Left<UserNotFoundError>', () => {
      const error = new UserNotFoundError('test error')

      beforeEach(() => {
        getMock.mockResolvedValue(left(error))
      })

      it(`returns ${StatusCodes.NOT_FOUND} response`, async () => {
        const result = await processor.process(event)
        expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
        expect(result.body).toBe(error.message)
        expect(getMock).toBeCalledTimes(1)
        expect(getMock).toBeCalledWith(event.pathParameters.userId)
      })
    })

    describe('if UserGetter#get returns Right<User>', () => {
      const user: User = {
        id: 'test id',
        name: 'test name'
      }

      beforeEach(() => {
        getMock.mockResolvedValue(right(user))
      })

      it(`returns ${StatusCodes.OK} response`, async () => {
        const result = await processor.process(event)
        expect(result.statusCode).toBe(StatusCodes.OK)
        expect(JSON.parse(result.body)).toEqual(user)
        expect(getMock).toBeCalledTimes(1)
        expect(getMock).toBeCalledWith(event.pathParameters.userId)
      })
    })
  })
})
