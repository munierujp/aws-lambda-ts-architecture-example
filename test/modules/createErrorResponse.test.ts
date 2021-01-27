import { StatusCodes } from 'http-status-codes'
import {
  InvalidMethodError,
  UserNotFoundError
} from '../../src/errors'
import { createErrorResponse } from '../../src/modules/createErrorResponse'

describe('createErrorResponse()', () => {
  describe('if error is InvalidMethodError', () => {
    const error = new InvalidMethodError('test error')

    it(`returns ${StatusCodes.NOT_IMPLEMENTED}`, () => {
      expect(createErrorResponse(error)).toEqual({
        statusCode: StatusCodes.NOT_IMPLEMENTED,
        body: error.message
      })
    })
  })

  describe('if error is UserNotFoundError', () => {
    const error = new UserNotFoundError('test error')

    it(`returns ${StatusCodes.NOT_FOUND}`, () => {
      expect(createErrorResponse(error)).toEqual({
        statusCode: StatusCodes.NOT_FOUND,
        body: error.message
      })
    })
  })

  describe("if error's name is BadRequestError", () => {
    const error = new Error('test error')
    error.name = 'BadRequestError'

    it(`returns ${StatusCodes.BAD_REQUEST}`, () => {
      expect(createErrorResponse(error)).toEqual({
        statusCode: StatusCodes.BAD_REQUEST,
        body: error.message
      })
    })
  })

  describe('if error is other', () => {
    const error = new Error('test error')

    it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR}`, () => {
      expect(createErrorResponse(error)).toEqual({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: error.message
      })
    })
  })
})
