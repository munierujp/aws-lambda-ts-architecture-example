import { StatusCodes } from 'http-status-codes'
import {
  InvalidMethodError,
  UserNotFoundError
} from '../errors'
import type { APIGatewayProxyResult } from 'aws-lambda'

export function createErrorResponse (error: Error): APIGatewayProxyResult {
  if (error instanceof InvalidMethodError) {
    return {
      statusCode: StatusCodes.NOT_IMPLEMENTED,
      body: error.message
    }
  }

  if (error instanceof UserNotFoundError) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      body: error.message
    }
  }

  // see https://github.com/middyjs/middy/tree/master/packages/validator
  if (error.name === 'BadRequestError') {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: error.message
    }
  }

  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    body: error.message
  }
}
