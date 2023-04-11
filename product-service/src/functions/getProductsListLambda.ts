import { APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCodes } from '../models/httpStatusCodes.model';
import { CustomLogger } from '../services/customLogger';
import { GetProductListService } from '../services/getProductList.service';

export const getProductsListLambda = async (...args: unknown[]): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {} as APIGatewayProxyResult;
  try {
    CustomLogger.log('getProductsListLambda called with next arguments:', { ...args });
    response.body = JSON.stringify(await GetProductListService.getProducts());
    response.statusCode = HttpStatusCodes.OK;
  } catch (error) {
    CustomLogger.logError(error.message);
    response.statusCode = error.statusCode;
    response.body = error.message;
  }

  return response;
};