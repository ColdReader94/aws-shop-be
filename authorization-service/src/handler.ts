import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { basicAuthorizerLambda } from './functions/basicAuthorizer';

export const basicAuthorizer = (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => basicAuthorizerLambda(event);
