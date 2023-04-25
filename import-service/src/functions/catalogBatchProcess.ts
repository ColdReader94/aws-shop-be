import AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { CustomLogger } from '../services/customLogger';
import { IProduct, IProductItem, IStock } from '../interfaces/product.interface';

export const catalogBatchProcessLambda = async (
  event: SQSEvent, ...args: unknown[]
): Promise<void> => {
  CustomLogger.log('catalogBatchProcessLambda called with next arguments:', { ...event, ...args });
  try {
    const dbClient = new AWS.DynamoDB.DocumentClient({ region: process.env.region });
    const products = [];
    const stocks = [];
    for (const record of event.Records) {
      const product: IProduct = JSON.parse(record.body);
      const newProduct: IProductItem = {
        id: (AWS as any).util.uuid.v4(),
        description: product.description,
        price: product.price,
        title: product.title,
      };
      const newStock: IStock = {
        product_id: newProduct.id,
        count: product.count,
      }
      products.push({ PutRequest: { Item: newProduct } });
      stocks.push({ PutRequest: { Item: newStock } });
    }
    await dbClient.batchWrite(
      {
        RequestItems: {
          [process.env.PRODUCTS_TABLE_NAME]: products,
          [process.env.STOCKS_TABLE_NAME]: stocks,
        }
      }
    ).promise();
    const sns = new AWS.SNS({ region: process.env.region });

    products.forEach(async (product) => {
      await sns.publish({
        Subject: 'Product was successfully imported',
        Message: JSON.stringify(product),
        TopicArn: process.env.SNS_URL,
      }).promise();
    })
  } catch (error) {
    CustomLogger.logError(error.message);
  }
}