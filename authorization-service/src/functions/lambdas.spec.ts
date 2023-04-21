
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { HttpStatusCodes } from '../models/httpStatusCodes.model';

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
