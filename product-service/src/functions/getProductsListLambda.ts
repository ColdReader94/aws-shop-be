import { APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCodes } from "../models/httpStatusCodes.model";
import { GetProductListService } from "../services/getProductList.service";

export const getProductsListLambda = async (): Promise<APIGatewayProxyResult> => {
    return {
      statusCode: HttpStatusCodes.OK,
      body: JSON.stringify(
        await GetProductListService.getProducts(),
      ),
    };
  };