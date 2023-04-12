import { S3Event } from 'aws-lambda';
import { CustomLogger } from '../services/customLogger';
import csv from 'csv-parser';
import AWS from 'aws-sdk';

export const importFileParserLambda = async (
  event: S3Event, ...args: unknown[]
): Promise<void> => {
  CustomLogger.log('importFileParserLambda called with next arguments:', { ...event, ...args });
  const s3 = new AWS.S3({ region: 'us-east-1' });
  for (const record of event.Records) {
    return new Promise((resolve, reject) => {
      const bucketName = record.s3.bucket.name;
      const { key } = record.s3.object;
      const s3Stream = s3.getObject({
        Bucket: bucketName,
        Key: key,
      }).createReadStream();

      s3Stream.pipe(csv())
        .on('data', (data) => {
          CustomLogger.log('Object parsed: ', data);
        })
        .on('end', async () => {
          try {
          CustomLogger.log('File successfully parsed, starting copying to parsed folder...');
          const parsedObjectKey = key.replace('uploaded', 'parsed');
            await s3.copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${key}`,
              Key: parsedObjectKey
            }).promise();

            await s3.deleteObject({
              Bucket: bucketName,
              Key: key,
            }).promise();

            CustomLogger.log(`File moved to ${bucketName}/${parsedObjectKey}`);
            resolve(null);
          } catch (error) {
            CustomLogger.logError(error);
            reject(error);
          }
        });
    });
  }
};
