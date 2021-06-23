import type middy from '@middy/core'
import type { APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import { errorHandler } from '../../src/middlewares/errorHandler'
import * as createErrorResponseModule from '../../src/modules/createErrorResponse'

describe('errorHandler()', () => {
  describe('onError()', () => {
    const createErrorResponseSpy = jest.spyOn(createErrorResponseModule, 'createErrorResponse')

    const errorResp: APIGatewayProxyResult = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: 'test error'
    }
    const { onError } = errorHandler()

    beforeEach(() => {
      createErrorResponseSpy.mockReturnValue(errorResp)
    })

    afterEach(() => {
      createErrorResponseSpy.mockReset()
    })

    describe('if error is null', () => {
      const req = {
        error: null
      }

      it('returns error response', () => {
        const resp = onError(req as middy.Request)
        expect(resp).toBe(errorResp)
      })
    })

    describe('if error is not null', () => {
      const req = {
        error: new Error('test error')
      }

      it('returns error response', () => {
        const resp = onError(req as middy.Request)
        expect(resp).toBe(errorResp)
      })
    })
  })
})
