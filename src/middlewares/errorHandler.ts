import { createErrorResponse } from '../modules'
import type middy from '@middy/core'

export const errorHandler: middy.Middleware<never, any, any> = () => {
  return {
    onError: (handler, next) => {
      const resp = createErrorResponse(handler.error)
      handler.response = resp
      next()
    }
  }
}
