import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';
import { CustomLogger } from '../services/customLogger';

export const importFileParserLambda = async (
  event: S3Event, ...args: unknown[]
): Promise<void> => {
  CustomLogger.log('importFileParserLambda called with next arguments:', { ...event, ...args });
  const s3 = new AWS.S3({ region: process.env.region });
  const sqs = new AWS.SQS({ region: process.env.region });
  for (const record of event.Records) {
    return new Promise((resolve, reject) => {
      const bucketName = record.s3.bucket.name;
      const { key } = record.s3.object;
      const s3Stream = s3.getObject({
        Bucket: bucketName,
        Key: key,
      }).createReadStream();

      s3Stream.pipe(csv())
        .on('data', async (data) => {
          await sqs.sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(data),
          }).promise();
        })
        .on('end', async () => {
          try {
          const parsedObjectKey = key.replace(process.env.UPLOADED_FOLDER, process.env.PARSED_FOLDER);
            await s3.copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${key}`,
              Key: parsedObjectKey
            }).promise();

            await s3.deleteObject({
              Bucket: bucketName,
              Key: key,
            }).promise();

            resolve(null);
          } catch (error) {
            CustomLogger.logError(error);
            reject(error);
          }
        });
    });
  }
};
