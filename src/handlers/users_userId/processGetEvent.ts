import { DynamoDB } from 'aws-sdk'
import { isLeft } from 'fp-ts/lib/Either'
import { StatusCodes } from 'http-status-codes'
import { UserRepository } from '../../interfaces/dynamodb'
import { UserGetter } from '../../usecases'
import type { Event } from './Event'
import type { Result } from './Result'

export async function processGetEvent (event: Event): Promise<Result> {
  const dynamodb = new DynamoDB.DocumentClient()
  const userRepo = new UserRepository(dynamodb)
  const userGetter = new UserGetter({ userRepo })
  const { userId } = event.pathParameters
  const errorOrUser = await userGetter.get(userId)

  if (isLeft(errorOrUser)) {
    const error = errorOrUser.left
    return {
      statusCode: StatusCodes.NOT_FOUND,
      body: error.message
    }
  }

  const user = errorOrUser.right
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify(user)
  }
}
