import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { basicAuthorizerLambda } from './functions/basicAuthorizer';

export const basicAuthorizer = 
    (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => basicAuthorizerLambda(event);
