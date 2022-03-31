import { IProduct } from "./product"

export interface IProductPagination {
    page: number
    count: number
    pageSize: number
    data: IProduct[]
  }