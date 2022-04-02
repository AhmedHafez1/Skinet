import { IProduct } from "./product"

export interface IPagination {
    page: number
    count: number
    pageSize: number
    data: IProduct[]
  }
