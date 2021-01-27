import { StatusCodes } from 'http-status-codes'
import { handler } from '../../../src/handlers/users_userId/handler'
import * as processGetEventModule from '../../../src/handlers/users_userId/processGetEvent'
import type { Result } from '../../../src/handlers/users_userId/Result'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const LambdaTester = require('lambda-tester')

describe('handler()', () => {
  describe('if event.pathParameters.userId does not exist', () => {
    const event = {
      pathParameters: {}
    }

    it(`returns ${StatusCodes.BAD_REQUEST} response`, async () => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((result: Result) => {
          expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
        })
    })
  })

  describe('if event.pathParameters.userId is invalid', () => {
    const event = {
      pathParameters: {
        userId: '1234567890123456789012345678901'
      }
    }

    it(`returns ${StatusCodes.BAD_REQUEST} response`, async () => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((result: Result) => {
          expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
        })
    })
  })

  describe('if event.httpMethod is invalid', () => {
    const event = {
      httpMethod: 'invalid httpMethod'
    }

    it(`returns ${StatusCodes.NOT_IMPLEMENTED} response`, async () => {
      await LambdaTester(handler)
        .event(event)
        .expectResult((result: Result) => {
          expect(result.statusCode).toBe(StatusCodes.NOT_IMPLEMENTED)
        })
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

    describe('if error occurred when executing processGetEvent', () => {
      const error = new Error('test error')

      beforeEach(() => {
        processGetEventSpy.mockRejectedValue(error)
      })

      it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR} response`, async () => {
        await LambdaTester(handler)
          .event(event)
          .expectResult((result: Result) => {
            expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(result.body).toBe(error.message)
            expect(processGetEventSpy).toBeCalledTimes(1)
            expect(processGetEventSpy).toBeCalledWith(event)
          })
      })
    })

    describe('if error did not occur when executing processGetEvent', () => {
      const eventResult: Result = {
        statusCode: StatusCodes.OK,
        body: 'test body'
      }

      beforeEach(() => {
        processGetEventSpy.mockResolvedValue(eventResult)
      })

      it('returns response as is', async () => {
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
})
