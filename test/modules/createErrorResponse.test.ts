import { StatusCodes } from 'http-status-codes'
import {
  InvalidMethodError,
  UserNotFoundError
} from '../../src/errors'
import { createErrorResponse } from '../../src/modules/createErrorResponse'

describe('createErrorResponse()', () => {
  it(`returns ${StatusCodes.NOT_IMPLEMENTED} if error is instance of InvalidMethodError`, () => {
    const error = new InvalidMethodError('test error')

    expect(createErrorResponse(error)).toEqual({
      statusCode: StatusCodes.NOT_IMPLEMENTED,
      body: error.message
    })
  })

  it(`returns ${StatusCodes.NOT_FOUND} if error is instance of UserNotFoundError`, () => {
    const error = new UserNotFoundError('test error')

    expect(createErrorResponse(error)).toEqual({
      statusCode: StatusCodes.NOT_FOUND,
      body: error.message
    })
  })

  it(`returns ${StatusCodes.BAD_REQUEST} if error's name is BadRequestError`, () => {
    const error = new Error('test error')
    error.name = 'BadRequestError'

    expect(createErrorResponse(error)).toEqual({
      statusCode: StatusCodes.BAD_REQUEST,
      body: error.message
    })
  })

  it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR} if error is other`, () => {
    const error = new Error('test error')

    expect(createErrorResponse(error)).toEqual({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message
    })
  })
})
