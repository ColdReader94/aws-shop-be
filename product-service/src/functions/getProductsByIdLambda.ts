import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpError } from "../errors/errors";
import { HttpStatusCodes } from "../models/httpStatusCodes.model";
import { GetProductListService } from "../services/getProductList.service";

export const getProductsByIdLambda = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult = {} as APIGatewayProxyResult;
    try {
      response.body = JSON.stringify(await GetProductListService.findProduct(event.pathParameters.id));
      response.statusCode = HttpStatusCodes.OK;
    } catch (error) {
      if (error instanceof HttpError) {
        response.statusCode = error.statusCode;
        response.body = error.message;
      }
    }
  
    return response;
  };