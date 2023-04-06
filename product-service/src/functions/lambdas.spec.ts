import { NotFoundError } from "../errors/errors";
import { HttpStatusCodes } from "../models/httpStatusCodes.model";
import { GetProductListService } from "../services/getProductList.service";
import { getProductsByIdLambda } from "./getProductsByIdLambda";
import { getProductsListLambda } from "./getProductsListLambda";

const productListMock = [
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
];

describe('getProductsListLambda', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('should return product list', async () => {
        jest.spyOn(GetProductListService, 'getProducts').mockResolvedValueOnce(productListMock);
        const actualValue = await getProductsListLambda();
        expect(actualValue.body).toEqual(JSON.stringify(productListMock));
        expect(actualValue.statusCode).toEqual(HttpStatusCodes.OK);
    });
});


describe('getProductsById', () => {
    const event = {
        pathParameters: {
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        }
    };

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('should return product list', async () => {
        jest.spyOn(GetProductListService, 'findProduct').mockResolvedValueOnce(productListMock[0]);
        const actualValue = await getProductsByIdLambda(event as any);
        expect(actualValue.body).toEqual(JSON.stringify(productListMock[0]));
        expect(actualValue.statusCode).toEqual(HttpStatusCodes.OK);
    });


    test('should return error message', async () => {
        jest.spyOn(GetProductListService, 'findProduct').mockRejectedValueOnce(new NotFoundError('Product'));
        const actualValue = await getProductsByIdLambda(event as any);
        expect(actualValue).toEqual({ statusCode: HttpStatusCodes.NOT_FOUND, body: 'Product not found' });
    });
});
