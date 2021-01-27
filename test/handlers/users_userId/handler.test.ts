import { StatusCodes } from 'http-status-codes'
import { handler } from '../../../src/handlers/users_userId/handler'
import { UserGetter } from '../../../src/usecases'
import type { Result } from '../../../src/handlers/users_userId/Result'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const LambdaTester = require('lambda-tester')

describe('handler()', () => {
  describe(`returns ${StatusCodes.BAD_REQUEST} response if validation error occurred`, () => {
    const expectBadRequest = async (event: Record<string, any>): Promise<void> => {
      await LambdaTester(handler)
        .event(event)
        .expectResult(({ statusCode }: Result) => {
          expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
        })
    }

    // eslint-disable-next-line jest/expect-expect
    it(`returns ${StatusCodes.BAD_REQUEST} response if pathParameters.userId does not exist`, async () => {
      await expectBadRequest({
        pathParameters: {}
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it(`returns ${StatusCodes.BAD_REQUEST} response if pathParameters.userId is invalid`, async () => {
      await expectBadRequest({
        pathParameters: {
          userId: '1234567890123456789012345678901'
        }
      })
    })
  })

  it(`returns ${StatusCodes.NOT_IMPLEMENTED} response if httpMethod is invalid`, async () => {
    await LambdaTester(handler)
      .event({
        httpMethod: 'invalid httpMethod'
      })
      .expectResult(({ statusCode }: Result) => {
        expect(statusCode).toBe(StatusCodes.NOT_IMPLEMENTED)
      })
  })

  describe('if httpMethod is GET', () => {
    const getSpy = jest.spyOn(UserGetter.prototype, 'get')
    const event = {
      httpMethod: 'GET',
      pathParameters: {
        userId: '12345678901234567890123456789012'
      }
    }

    afterEach(() => {
      getSpy.mockReset()
    })

    it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR} response if error occurred when executing UserGetter`, async () => {
      const error = new Error('test error')
      getSpy.mockRejectedValue(error)

      await LambdaTester(handler)
        .event(event)
        .expectResult(({
          statusCode,
          body
        }: Result) => {
          expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
          expect(body).toBe(error.message)
          expect(getSpy).toBeCalledTimes(1)
          expect(getSpy).toBeCalledWith(event.pathParameters.userId)
        })
    })

    it(`returns ${StatusCodes.OK} response if error did not occur when executing UserGetter`, async () => {
      const user = {
        id: 'test id',
        name: 'test name'
      }
      getSpy.mockResolvedValue(user)

      await LambdaTester(handler)
        .event(event)
        .expectResult(({
          statusCode,
          body
        }: Result) => {
          expect(statusCode).toBe(StatusCodes.OK)
          expect(JSON.parse(body)).toEqual(user)
          expect(getSpy).toBeCalledTimes(1)
          expect(getSpy).toBeCalledWith(event.pathParameters.userId)
        })
    })
  })
})
