import {
  none,
  some
} from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { HTTPMethod } from 'http-method-enum'
import type { EventProcessor } from '../../types'
import type { Event } from './Event'
import { processGetEvent } from './processGetEvent'

export function createEventProcessor (httpMethod: string): Option<EventProcessor<Event>> {
  httpMethod = httpMethod.toUpperCase()

  if (httpMethod === HTTPMethod.GET) {
    const processor: EventProcessor<Event> = {
      process: processGetEvent
    }
    return some(processor)
  }

  return none
}
