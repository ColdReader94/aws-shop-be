import { APIGatewayProxyEvent, APIGatewayProxyResult, S3Event, SQSEvent } from 'aws-lambda';
import { catalogBatchProcessLambda } from './functions/catalogBatchProcess';
import { importFileParserLambda } from './functions/importFileParser';
import { importProductsFileLambda } from './functions/importProductsFile';

export const importProductsFile = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => importProductsFileLambda(event);
export const importFileParser = (event: S3Event): Promise<void> => importFileParserLambda(event);
export const catalogBatchProcess = (event: SQSEvent): Promise<void> => catalogBatchProcessLambda(event);
