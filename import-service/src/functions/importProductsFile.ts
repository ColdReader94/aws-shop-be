import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCodes } from '../models/httpStatusCodes.model';
import { CustomLogger } from '../services/customLogger';
import AWS from 'aws-sdk';
import { BadRequestError } from '../errors/errors';

export const importProductsFileLambda = async (
  event: APIGatewayProxyEvent, ...args: unknown[]
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {} as APIGatewayProxyResult;
  response.headers = {
    'Access-Control-Allow-Origin': '*',
  };
  try {
    if (!event.queryStringParameters?.name) {
      throw new BadRequestError('Bad request: no query parameter `name` was provided')
    }
    const params = {
      Bucket: 'imported-csv-sandx',
      Key: `uploaded/${event.queryStringParameters.name}`,
      ContentType: 'text/csv',
      Expires: 600,
    }
    const s3 = new AWS.S3({ region: 'us-east-1' });
    const s3Response = await s3.getSignedUrlPromise('putObject', params);
    CustomLogger.log('importProductsFile called with next arguments:', { ...event, ...args });
    response.statusCode = HttpStatusCodes.OK;
    response.body = JSON.stringify(s3Response);
  } catch (error) {
    CustomLogger.logError(error.message);
    response.statusCode = error.statusCode;
    response.body = error.message;
  }

  return response;
};
