/* eslint-disable no-magic-numbers */
import { NotFoundError } from "../errors/errors";
import { IProduct } from "../interfaces/product.interface";

export class GetProductListService {
    private static readonly products: IProduct[] = [
        {
          count: 4,
          description: "Short Product Description1",
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
          price: 2.4,
          title: "Phone"
        },
        {
          count: 6,
          description: "Short Product Description3",
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
          price: 10,
          title: "Laptop"
        },
        {
          count: 7,
          description: "Short Product Description2",
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
          price: 23,
          title: "Fridge"
        },
        {
          count: 12,
          description: "Short Product Description7",
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
          price: 15,
          title: "Vacuum cleaner"
        },
        {
          count: 7,
          description: "Short Product Description2",
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
          price: 23,
          title: "TV"
        },
        {
          count: 8,
          description: "Short Product Description4",
          id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
          price: 15,
          title: "Monitor"
        },
        {
          count: 2,
          description: "Short Product Descriptio1",
          id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
          price: 23,
          title: "Printer"
        },
        {
          count: 3,
          description: "Short Product Description7",
          id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
          price: 15,
          title: "Washing machine"
        }
      ];    

    public static async getProducts(): Promise<IProduct[]> {
      return new Promise(async (res) => {
        setTimeout(() => res(this.products), 1);
      })
    }

    public static async findProduct(searchItemId: string): Promise<IProduct> {
      return new Promise(async (res, rej) => {
        const product = (await this.getProducts()).find(({ id }) => id === searchItemId);
        setTimeout(() => product ? res(product) : rej(new NotFoundError('Product')), 1);
      });
    } 
}