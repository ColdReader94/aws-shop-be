// /* eslint-disable no-magic-numbers */
// import { HttpError, NotFoundError, ServerError } from '../errors/errors';
// import { IProduct, IProductItem, IStock, TProductList, IProductRequestBody } from '../interfaces/product.interface';
// import AWS from 'aws-sdk';
// import { CustomLogger } from './customLogger';

// export class GetProductListService {
//   private static readonly dbClient = new AWS.DynamoDB.DocumentClient();

//   private static readonly productParams = {
//     TableName: process.env.PRODUCTS_TABLE_NAME,
//   }

//   private static readonly stockParams = {
//     TableName: process.env.STOCKS_TABLE_NAME
//   }

//   public static async getProducts(): Promise<TProductList> {
//     try {
//       const productsResult = await this.dbClient.scan(this.productParams).promise();
//       const stocksResult = await this.dbClient.scan(this.stockParams).promise();
//       const stocksItems = new Map();
//       stocksResult.Items.forEach(stockItem => {
//         stocksItems.set(stockItem.product_id, stockItem.count);
//       });

//       return productsResult.Items.map((product: IProduct) => {
//         return {
//           ...product,
//           count: stocksItems.get(product.id),
//         }
//       });
//     } catch (error) {
//       CustomLogger.logError(error.message);
//       throw new ServerError(error.message);
//     }
//   }

//   public static async findProduct(searchItemId: string): Promise<IProduct> {
//     try {
//       const productResult = await this.dbClient.get({ ...this.productParams, Key: { id: searchItemId } }).promise();
//       const stockResult = await this.dbClient.get({ ...this.stockParams, Key: { product_id: searchItemId } }).promise();

//       if (!productResult.Item || !stockResult.Item) {
//         throw new NotFoundError('Product');
//       }

//       return { ...productResult.Item as IProduct, count: stockResult.Item.count }
//     } catch (error) {
//       CustomLogger.logError(error.message);
//       if (error instanceof HttpError) {
//         throw error;
//       }
//       throw new ServerError(error.message);
//     }
//   }

//   public static async createProduct(newProductData: IProductRequestBody): Promise<IProduct> {
//     try {
//       const newProduct: IProductItem = {
//         id: (AWS as any).util.uuid.v4(),
//         description: newProductData.description,
//         price: newProductData.price,
//         title: newProductData.title,
//       };
//       const newStock: IStock = {
//         product_id: newProduct.id,
//         count: newProductData.count,
//       }

//       await this.dbClient.transactWrite(
//         {
//           TransactItems: [{
//             Put: { ...this.productParams, Item: newProduct },
//           },
//           {
//             Put: { ...this.stockParams, Item: newStock },
//           }],
//         },
//       ).promise();

//       return { ...newProduct, count: newStock.count };
//     } catch (error) {
//       CustomLogger.logError(error.message);
//       if (error instanceof HttpError) {
//         throw error;
//       }
//       throw new ServerError(error.message);
//     }
//   }
// }

/* eslint-disable no-magic-numbers */
import { NotFoundError } from '../errors/errors';
import { IProduct } from '../interfaces/product.interface';

export class GetProductListService {
    private static readonly products: IProduct[] = [
        {
          count: 4,
          description: 'Short Product Description1',
          id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
          price: 2.4,
          title: 'Phone'
        },
        {
          count: 6,
          description: 'Short Product Description3',
          id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
          price: 10,
          title: 'Laptop'
        },
        {
          count: 7,
          description: 'Short Product Description2',
          id: '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
          price: 23,
          title: 'Fridge'
        },
        {
          count: 12,
          description: 'Short Product Description7',
          id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
          price: 15,
          title: 'Vacuum cleaner'
        },
        {
          count: 7,
          description: 'Short Product Description2',
          id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
          price: 23,
          title: 'TV'
        },
        {
          count: 8,
          description: 'Short Product Description4',
          id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
          price: 15,
          title: 'Monitor'
        },
        {
          count: 2,
          description: 'Short Product Descriptio1',
          id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
          price: 23,
          title: 'Printer'
        },
        {
          count: 3,
          description: 'Short Product Description7',
          id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
          price: 15,
          title: 'Washing machine'
        }
      ];    

    public static getProducts(): IProduct[] {
      return this.products;
    }

    public static findProduct(searchItemId: string): IProduct {
      return this.getProducts().find(({ id }) => id === searchItemId);
    } 
}