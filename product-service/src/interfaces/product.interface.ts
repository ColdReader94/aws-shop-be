export interface IProduct {
    description: string,
    id: string,
    price: number,
    title: string,
    count: number,
}

export interface IProductItem {
    description: string,
    id: string,
    price: number,
    title: string,
}

export interface IStock {
    product_id: string,
    count: number,
}

export interface IProductRequestBody {
    count: number,
    description: string,
    price: number,
    title: string,
}

export type TProductList = IProduct[];