import { DynamoDB } from 'aws-sdk'
import {
  none,
  some
} from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { HTTPMethod } from 'http-method-enum'
import { UserRepository } from '../../interfaces/dynamodb'
import { UserGetter } from '../../usecases'
import { GetEventProcessor } from './GetEventProcessor'

export function createEventProcessor (httpMethod: string): Option<GetEventProcessor> {
  httpMethod = httpMethod.toUpperCase()

  if (httpMethod === HTTPMethod.GET) {
    const dynamodb = new DynamoDB.DocumentClient()
    const userRepo = new UserRepository(dynamodb)
    const userGetter = new UserGetter({ userRepo })
    const processor = new GetEventProcessor({ userGetter })
    return some(processor)
  }

  return none
}
