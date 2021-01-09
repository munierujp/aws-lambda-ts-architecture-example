import { StatusCodes } from 'http-status-codes'
import { handler } from '../../src/handlers/users_userId'
import { userGetter } from '../../src/usecases'
import type { Result } from '../../src/handlers/users_userId'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const LambdaTester = require('lambda-tester')

describe('handler()', () => {
  describe('if httpMethod is GET', () => {
    const executeSpy = jest.spyOn(userGetter.Executor.prototype, 'execute')

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        userId: '12345678901234567890123456789012'
      }
    }

    afterEach(() => {
      executeSpy.mockReset()
    })

    it(`returns ${StatusCodes.OK} response if error did not occur when executing userGetter`, async () => {
      const result: userGetter.Result = {
        id: 'test id',
        name: 'test name'
      }
      executeSpy.mockResolvedValue(result)

      await LambdaTester(handler)
        .event(event)
        .expectResult(({
          statusCode,
          body
        }: Result) => {
          expect(statusCode).toBe(StatusCodes.OK)
          expect(JSON.parse(body)).toEqual(result)
          expect(executeSpy).toBeCalledTimes(1)
        })
    })

    it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR} response if error occurred when executing userGetter`, async () => {
      const error = new Error('test error')
      executeSpy.mockRejectedValue(error)

      await LambdaTester(handler)
        .event(event)
        .expectResult(({
          statusCode,
          body
        }: Result) => {
          expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
          expect(body).toBe(error.message)
          expect(executeSpy).toBeCalledTimes(1)
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
})
