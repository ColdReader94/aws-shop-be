import { APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCodes } from '../models/httpStatusCodes.model';
import { CustomLogger } from '../services/customLogger';
import { IProduct, IProductRequestBody } from '../interfaces/product.interface';
import { GetProductListService } from '../services/getProductList.service';

export const createProductLambda = async (
  event: { body: IProductRequestBody }, ...args: unknown[]
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {} as APIGatewayProxyResult;
  try {
    CustomLogger.log('createProductLambda called with next arguments:', { ...event, ...args });
    // const createdItem: IProduct = await GetProductListService.createProduct(event.body);
    // response.body = JSON.stringify(createdItem);
    response.statusCode = HttpStatusCodes.CREATED;
  } catch (error) {
    CustomLogger.logError(error.message);
    response.statusCode = error.statusCode;
    response.body = error.message;
  }

  return response;
};