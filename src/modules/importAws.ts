import AWS from 'aws-sdk'
import { captureAWS } from 'aws-xray-sdk-core'

interface Options {
  xray?: boolean
}

export function importAws (options?: Options): typeof AWS {
  if (options?.xray === true) {
    return captureAWS(AWS)
  } else {
    return AWS
  }
}
