import type { MiddlewareObj } from '@middy/core'
import { createErrorResponse } from '../modules'

type Middleware = Required<Pick<MiddlewareObj, 'onError'>>

export const errorHandler = (): Middleware => {
  return {
    onError (req) {
      const error = req.error ?? new Error('missing error')
      return createErrorResponse(error)
    }
  }
}
