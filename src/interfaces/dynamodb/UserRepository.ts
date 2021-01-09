import { isEmpty } from 'lodash'
import { UserNotFoundError } from '../../errors'
import type { DynamoDB } from 'aws-sdk'
import type { User } from '../../domain/models'
import type * as repositories from '../../domain/repositories'

const TABLE_NAME = 'users'

export class UserRepository implements repositories.UserRepository {
  private readonly dynamodb: DynamoDB.DocumentClient

  constructor (dynamodb: DynamoDB.DocumentClient) {
    this.dynamodb = dynamodb
  }

  async findById (id: string): Promise<User> {
    return await this.get({ id })
  }

  private async get (key: DynamoDB.DocumentClient.Key): Promise<User> {
    const result = await this.dynamodb.get({
      TableName: TABLE_NAME,
      Key: key
    }).promise()
    const item = result.Item

    if (item === undefined || isEmpty(item)) {
      throw new UserNotFoundError('user not found')
    }

    return item as User
  }
}
