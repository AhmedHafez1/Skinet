import { IAddress } from './user';

export interface IOrderToCreate {
  deliveryMethodId: number;
  basketId: string | undefined;
  shipToAddress: IAddress;
}

export interface IOrder {
  id: number;
  orderItems: IOrderItem[];
  buyerEmail: string;
  orderDate: string;
  shipToAddress: IAddress;
  delivery: string;
  shippingPrice: number;
  subTotal: number;
  total: number;
  orderStatus: string;
}

export interface IOrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}
