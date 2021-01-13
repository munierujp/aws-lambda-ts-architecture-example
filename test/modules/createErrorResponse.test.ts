import { StatusCodes } from 'http-status-codes'
import {
  InvalidMethodError,
  UserNotFoundError
} from '../../src/errors'
import { createErrorResponse } from '../../src/modules/createErrorResponse'

describe('createErrorResponse()', () => {
  it(`returns ${StatusCodes.NOT_IMPLEMENTED} if error is InvalidMethodError`, () => {
    const error = new InvalidMethodError('test error')

    const resp = createErrorResponse(error)

    expect(resp).toEqual({
      statusCode: StatusCodes.NOT_IMPLEMENTED,
      body: error.message
    })
  })

  it(`returns ${StatusCodes.NOT_FOUND} if error is UserNotFoundError`, () => {
    const error = new UserNotFoundError('test error')

    const resp = createErrorResponse(error)

    expect(resp).toEqual({
      statusCode: StatusCodes.NOT_FOUND,
      body: error.message
    })
  })

  it(`returns ${StatusCodes.BAD_REQUEST} if error's name is BadRequestError`, () => {
    const error = new Error('test error')
    error.name = 'BadRequestError'

    const resp = createErrorResponse(error)

    expect(resp).toEqual({
      statusCode: StatusCodes.BAD_REQUEST,
      body: error.message
    })
  })

  it(`returns ${StatusCodes.INTERNAL_SERVER_ERROR} if error is other`, () => {
    const error = new Error('test error')

    const resp = createErrorResponse(error)

    expect(resp).toEqual({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message
    })
  })
})
