import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCodes } from '../models/httpStatusCodes.model';
import { GetProductListService } from '../services/getProductList.service';
import { CustomLogger } from '../services/customLogger';

export const getProductsByIdLambda = async (
  event: APIGatewayProxyEvent,
  ...args: unknown[]
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {} as APIGatewayProxyResult;
  try {
    CustomLogger.log('getProductsByIdLambda called with next arguments:', { ...event, ...args });
    response.body = JSON.stringify(await GetProductListService.findProduct(event.pathParameters.id));
    response.statusCode = HttpStatusCodes.OK;
  } catch (error) {
    CustomLogger.logError(error.message);
    response.statusCode = error.statusCode;
    response.body = error.message;
  }

  return response;
};