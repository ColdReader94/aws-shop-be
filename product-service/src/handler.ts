import middy from '@middy/core';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createProductLambda } from './functions/createProductLambda';
import { getProductsByIdLambda } from './functions/getProductsByIdLambda';
import { getProductsListLambda } from './functions/getProductsListLambda';
import { productBodyRequestSchema } from './models/httpStatusCodes.model';
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'

export const getProductsList = (): Promise<APIGatewayProxyResult> => getProductsListLambda();
export const getProductsById = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => getProductsByIdLambda(event);
export const createProduct = middy(createProductLambda)
    .use(httpJsonBodyParser())
    .use(
        validator({
            eventSchema: transpileSchema(productBodyRequestSchema),
        }),
    )
    .use(httpErrorHandler());
