import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getProductsByIdLambda } from "./functions/getProductsByIdLambda";
import { getProductsListLambda } from "./functions/getProductsListLambda";

export const getProductsList = (): Promise<APIGatewayProxyResult> => getProductsListLambda();
export const getProductsById = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => getProductsByIdLambda(event);

