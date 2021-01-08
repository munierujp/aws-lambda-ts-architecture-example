import { HTTPMethod } from 'http-method-enum'
import { StatusCodes } from 'http-status-codes'
import { InvalidMethodError } from '../errors'
import { UserRepository } from '../interfaces/dynamodb'
import { userGetter } from '../usecases'
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import type AWS from 'aws-sdk'

export interface Event extends APIGatewayProxyEvent {
  pathParameters: {
    userId: string
  }
}
export type Result = APIGatewayProxyResult

export class Controller {
  private readonly aws: typeof AWS

  constructor ({
    aws
  }: {
    aws: typeof AWS
  }) {
    this.aws = aws
  }

  async execute (event: Event): Promise<Result> {
    const httpMethod = event.httpMethod.toUpperCase()

    switch (httpMethod) {
      case HTTPMethod.GET:
        return await this.executeUserGetter(event)
      default:
        throw new InvalidMethodError(`invalid method. httpMethod=${httpMethod}`)
    }
  }

  private async executeUserGetter (event: Event): Promise<Result> {
    const { userId } = event.pathParameters
    const db = new this.aws.DynamoDB.DocumentClient()
    const userRepo = new UserRepository({
      db,
      tableName: 'users'
    })
    const executor = new userGetter.Executor({
      userId,
      userRepo
    })
    const result = await executor.execute()
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(result)
    }
  }
}
