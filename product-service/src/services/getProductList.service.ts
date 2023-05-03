/* eslint-disable no-magic-numbers */
import { HttpError, NotFoundError, ServerError } from '../errors/errors';
import { IProduct, IProductItem, IStock, TProductList, IProductRequestBody } from '../interfaces/product.interface';
import AWS from 'aws-sdk';
import { CustomLogger } from './customLogger';

export class GetProductListService {
  private static readonly dbClient = new AWS.DynamoDB.DocumentClient();

  private static readonly productParams = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
  }

  private static readonly stockParams = {
    TableName: process.env.STOCKS_TABLE_NAME
  }

  public static async getProducts(): Promise<TProductList> {
    try {
      const productsResult = await this.dbClient.scan(this.productParams).promise();
      const stocksResult = await this.dbClient.scan(this.stockParams).promise();
      const stocksItems = new Map();
      stocksResult.Items.forEach(stockItem => {
        stocksItems.set(stockItem.product_id, stockItem.count);
      });

      return productsResult.Items.map((product: IProduct) => {
        return {
          ...product,
          count: stocksItems.get(product.id),
        }
      });
    } catch (error) {
      CustomLogger.logError(error.message);
      throw new ServerError(error.message);
    }
  }

  public static async findProduct(searchItemId: string): Promise<IProduct> {
    try {
      const productResult = await this.dbClient.get({ ...this.productParams, Key: { id: searchItemId } }).promise();
      const stockResult = await this.dbClient.get({ ...this.stockParams, Key: { product_id: searchItemId } }).promise();

      if (!productResult.Item || !stockResult.Item) {
        throw new NotFoundError('Product');
      }

      return { ...productResult.Item as IProduct, count: stockResult.Item.count }
    } catch (error) {
      CustomLogger.logError(error.message);
      if (error instanceof HttpError) {
        throw error;
      }
      throw new ServerError(error.message);
    }
  }

  public static async createProduct(newProductData: IProductRequestBody): Promise<IProduct> {
    try {
      const newProduct: IProductItem = {
        id: (AWS as any).util.uuid.v4(),
        description: newProductData.description,
        price: newProductData.price,
        title: newProductData.title,
      };
      const newStock: IStock = {
        product_id: newProduct.id,
        count: newProductData.count,
      }

      await this.dbClient.transactWrite(
        {
          TransactItems: [{
            Put: { ...this.productParams, Item: newProduct },
          },
          {
            Put: { ...this.stockParams, Item: newStock },
          }],
        },
      ).promise();

      return { ...newProduct, count: newStock.count };
    } catch (error) {
      CustomLogger.logError(error.message);
      if (error instanceof HttpError) {
        throw error;
      }
      throw new ServerError(error.message);
    }
  }
}
