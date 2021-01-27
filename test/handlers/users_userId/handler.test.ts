import { StatusCodes } from 'http-status-codes'
import { handler } from '../../../src/handlers/users_userId/handler'
import * as processGetEventModule from '../../../src/handlers/users_userId/processGetEvent'
import type { Result } from '../../../src/handlers/users_userId/Result'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const LambdaTester = require('lambda-tester')

describe('handler()', () => {
  describe(`returns ${StatusCodes.BAD_REQUEST} response if validation error occurred`, () => {
    const expectBadRequest = async (event: Record<string, any>): Promise<void> => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((result: Result) => {
          expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
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
      .expectResult((result: Result) => {
        expect(result.statusCode).toBe(StatusCodes.NOT_IMPLEMENTED)
      })
  })

  describe('if httpMethod is GET', () => {
    const processGetEventSpy = jest.spyOn(processGetEventModule, 'processGetEvent')
    const event = {
      httpMethod: 'GET',
      pathParameters: {
        userId: '12345678901234567890123456789012'
      }
    }

    afterEach(() => {
      processGetEventSpy.mockReset()
    })

    it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR} response if error occurred when executing processGetEvent`, async () => {
      const error = new Error('test error')
      processGetEventSpy.mockRejectedValue(error)

      await LambdaTester(handler)
        .event(event)
        .expectResult((result: Result) => {
          expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
          expect(result.body).toBe(error.message)
          expect(processGetEventSpy).toBeCalledTimes(1)
          expect(processGetEventSpy).toBeCalledWith(event)
        })
    })

    it('returns response as is if error did not occur when executing processGetEvent', async () => {
      const eventResult: Result = {
        statusCode: StatusCodes.OK,
        body: 'test body'
      }
      processGetEventSpy.mockResolvedValue(eventResult)

      await LambdaTester(handler)
        .event(event)
        .expectResult((result: Result) => {
          expect(result).toEqual(eventResult)
          expect(processGetEventSpy).toBeCalledTimes(1)
          expect(processGetEventSpy).toBeCalledWith(event)
        })
    })
  })
})
