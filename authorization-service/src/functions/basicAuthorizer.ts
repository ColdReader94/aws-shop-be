import { CustomLogger } from '../services/customLogger';
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { ForbiddenError, UnauthorizedError } from '../errors/errors';

export const basicAuthorizerLambda = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult>  => {
  const createPolicy = (principalId: string, arn: string, effect: 'Allow' | 'Deny'): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['execute-api:Invoke'],
          Effect: effect,
          Resource: ['*'],
        }
      ]
    },
  });

  const encodedCredentials = (event.headers?.Authorization || event.headers?.authorization)?.split(' ')[1];
  try {
    if ((!event.headers?.Authorization && !event.headers?.authorization) || !encodedCredentials) {
      throw new UnauthorizedError();
    }
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [login, password] = decodedCredentials?.split('=');

    if (!login || !password) {
      throw new UnauthorizedError();
    }
  
    if (!process.env.PASSWORD ||
        !process.env.LOGIN ||
        process.env.LOGIN !== login ||
        process.env.PASSWORD !== password
    ) {
      throw new ForbiddenError();
    }
    return createPolicy(encodedCredentials, event.methodArn, 'Allow');
  } catch (error) {
    CustomLogger.logError(error.message);
    return createPolicy(encodedCredentials, event.methodArn, 'Deny');
  }
}