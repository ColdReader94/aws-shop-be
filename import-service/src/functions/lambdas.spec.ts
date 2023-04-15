
import { SQSEvent, SQSRecord } from 'aws-lambda';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HttpStatusCodes } from '../models/httpStatusCodes.model';
import { CustomLogger } from '../services/customLogger';
import { catalogBatchProcessLambda } from './catalogBatchProcess';
import { importProductsFileLambda } from './importProductsFile';

describe('importProductsFileLambda', () => {
    const mockedURL = 'https://testurl';
    let event;

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', mockedURL);
        event = {
            queryStringParameters: {
                name: 'test.csv',
            },
        }
    });

    test('should return correct response', async () => {
        const actualValue = await importProductsFileLambda(event);
        expect(actualValue.body).toEqual(JSON.stringify(mockedURL));
        expect(actualValue.statusCode).toEqual(HttpStatusCodes.OK);
    });

    test('should return error response', async () => {
        delete event.queryStringParameters.name
        const actualValue = await importProductsFileLambda(event);
        expect(actualValue.statusCode).toEqual(HttpStatusCodes.BAD_REQUEST);
    });
});

describe('catalogBatchProcessLambda', () => {
    const event: SQSEvent = {
        Records: [
            {
                body: JSON.stringify({ title: 'test', price: 50, count: 5 }),
            },
            {
                body: JSON.stringify({ title: 'test2', price: 100, count: 2 }),
            },
        ] as SQSRecord[],
    };
    let databaseMock;
    let SQSQueue;

    beforeEach(() => {
        databaseMock = [];
        SQSQueue = [];
        const putTodatabaseMock = async (obj) => await databaseMock.push(obj);
        const sendSQSMessage = async () => await SQSQueue.push('test message');
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB.DocumentClient' as any, 'batchWrite', putTodatabaseMock);
        AWSMock.mock('SNS', 'publish', sendSQSMessage);
        process.env.PRODUCTS_TABLE_NAME = 'table1';
        process.env.STOCKS_TABLE_NAME = 'table2';
    });

    test('should put items into DynamoDB', async () => {
        await catalogBatchProcessLambda(event);
        expect(databaseMock[0].RequestItems.table1.length).toEqual(2);
        expect(databaseMock[0].RequestItems.table2.length).toEqual(2);
    });

    test('should send SNS messages', async () => {
        await catalogBatchProcessLambda(event);
        expect(SQSQueue).toEqual(['test message', 'test message']);
    });

    test('should log error', async () => {
        const errorLog = jest.spyOn(CustomLogger, 'logError');
        delete event.Records;
        await catalogBatchProcessLambda(event);
        expect(errorLog).toHaveBeenCalled();
    });
});
