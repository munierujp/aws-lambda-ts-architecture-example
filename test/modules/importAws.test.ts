import AWS from 'aws-sdk'
import AWSXray from 'aws-xray-sdk-core'
import { importAws } from '../../src/modules/importAws'

jest.mock('aws-sdk')
jest.mock('aws-xray-sdk-core')

describe('importAws()', () => {
  const mockedAWS = AWS as unknown as jest.Mocked<typeof AWS>
  const mockedAWSXray = AWSXray as unknown as jest.Mocked<typeof AWSXray>

  it('returns AWS SDK as is if options is undefined', () => {
    const capturedAWS = {}
    mockedAWSXray.captureAWS.mockReturnValue(capturedAWS)

    const AWS = importAws()

    expect(AWS).toBe(mockedAWS)
    expect(AWS).not.toBe(capturedAWS)
    expect(mockedAWSXray.captureAWS).not.toBeCalled()
  })

  it('returns AWS SDK as is if options.xray is undefined', () => {
    const capturedAWS = {}
    mockedAWSXray.captureAWS.mockReturnValue(capturedAWS)

    const AWS = importAws({})

    expect(AWS).toBe(mockedAWS)
    expect(AWS).not.toBe(capturedAWS)
    expect(mockedAWSXray.captureAWS).not.toBeCalled()
  })

  it('returns AWS SDK as is if options.xray is false', () => {
    const capturedAWS = {}
    mockedAWSXray.captureAWS.mockReturnValue(capturedAWS)

    const AWS = importAws({
      xray: false
    })

    expect(AWS).toBe(mockedAWS)
    expect(AWS).not.toBe(capturedAWS)
    expect(mockedAWSXray.captureAWS).not.toBeCalled()
  })

  it('returns AWS SDK which is captured by AWS X-Ray if options.xray is true', () => {
    const capturedAWS = {}
    mockedAWSXray.captureAWS.mockReturnValue(capturedAWS)

    const AWS = importAws({
      xray: true
    })

    expect(AWS).toBe(capturedAWS)
    expect(AWS).not.toBe(mockedAWS)
    expect(mockedAWSXray.captureAWS).toBeCalledTimes(1)
    expect(mockedAWSXray.captureAWS).toBeCalledWith(mockedAWS)
  })
})
