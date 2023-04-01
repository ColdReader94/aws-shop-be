import { readFile } from 'fs/promises';
import AWS from 'aws-sdk';

try {
  const credentials = new AWS.SharedIniFileCredentials();
  const dbClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
    credentials,
  });

  const productList = JSON.parse(
    await readFile('./scripts/productsPopulator.json')
  );

  const inputProducts = {
    RequestItems: {
      Products: productList.map((product) => {
        return {
          PutRequest: {
            Item: {
              id: AWS.util.uuid.v4(),
              title: product.title,
              description: product.description,
              price: product.price,
            },
          },
        };
      }),
    },
  };

  inputProducts.RequestItems.Stocks = productList.map((product, index) => {
    return {
      PutRequest: {
        Item: {
          product_id: inputProducts.RequestItems.Products[index].PutRequest.Item.id,
          count:  product.count,
        },
      },
    };
  });

  await dbClient.batchWrite(inputProducts).promise();
  // eslint-disable-next-line no-undef
  console.log('Items upload was completed successfuly');
} catch (err) {
  // eslint-disable-next-line no-undef
  console.error('Items upload was failed', err);
}
