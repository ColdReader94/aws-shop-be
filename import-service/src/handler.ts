import { APIGatewayProxyEvent, APIGatewayProxyResult, S3Event } from 'aws-lambda';
import { importFileParserLambda } from './functions/importFileParser';
import { importProductsFileLambda } from './functions/importProductsFile';

export const importProductsFile = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => importProductsFileLambda(event);
export const importFileParser = (event: S3Event): Promise<void> => importFileParserLambda(event);
