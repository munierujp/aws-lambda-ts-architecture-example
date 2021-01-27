import { DynamoDB } from 'aws-sdk'
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
  const user = await userGetter.get(userId)
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify(user)
  }
}
