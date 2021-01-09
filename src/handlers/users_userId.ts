import { DynamoDB } from 'aws-sdk'
import { HTTPMethod } from 'http-method-enum'
import { StatusCodes } from 'http-status-codes'
import middy from '@middy/core'
import { InvalidMethodError } from '../errors'
import { UserRepository } from '../interfaces/dynamodb'
import {
  errorHandler,
  validator
} from '../middlewares'
import { UserGetter } from '../usecases'
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from 'aws-lambda'

export interface Event extends APIGatewayProxyEvent {
  pathParameters: {
    userId: string
  }
}
export type Result = APIGatewayProxyResult

export const handler = middyfy(async (event) => {
  const httpMethod = event.httpMethod.toUpperCase()

  switch (httpMethod) {
    case HTTPMethod.GET:
      return await executeUserGetter(event)
    default:
      throw new InvalidMethodError(`invalid method. httpMethod=${httpMethod}`)
  }
})

function middyfy (handler: Handler<Event, Result>): middy.Middy<Event, Result> {
  return middy(handler)
    .use(validator({
      inputSchema: {
        type: 'object',
        properties: {
          pathParameters: {
            type: 'object',
            required: [
              'userId'
            ],
            properties: {
              userId: {
                type: 'string',
                pattern: '^[0-9a-f]{32}$'
              }
            }
          }
        }
      }
    }))
    .use(errorHandler())
}

async function executeUserGetter (event: Event): Promise<Result> {
  const dynamodb = new DynamoDB.DocumentClient()
  const userRepo = new UserRepository(dynamodb)
  const userGetter = new UserGetter({ userRepo })
  const result = await userGetter.get(event.pathParameters.userId)
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify(result)
  }
}
