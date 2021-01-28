import { isEmpty } from 'lodash'
import type { DynamoDB } from 'aws-sdk'
import type { User } from '../../domain/models'
import type * as repositories from '../../domain/repositories'

const TABLE_NAME = 'users'

export class UserRepository implements repositories.UserRepository {
  private readonly dynamodb: DynamoDB.DocumentClient

  constructor (dynamodb: DynamoDB.DocumentClient) {
    this.dynamodb = dynamodb
  }

  async findById (id: string): Promise<User | undefined> {
    const result = await this.dynamodb.get({
      TableName: TABLE_NAME,
      Key: { id }
    }).promise()
    const item = result.Item

    if (item === undefined || isEmpty(item)) {
      return undefined
    }

    return item as User
  }
}
