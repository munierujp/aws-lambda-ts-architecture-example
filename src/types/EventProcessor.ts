import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'

export interface EventProcessor<
  Event extends APIGatewayProxyEvent = APIGatewayProxyEvent,
  Result extends APIGatewayProxyResult = APIGatewayProxyResult
> {
  process: (event: Event) => Promise<Result>
}
