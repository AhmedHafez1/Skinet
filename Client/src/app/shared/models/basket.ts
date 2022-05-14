import { v4 as uuidv4 } from 'uuid';

export interface IBasket {
  id: string;
  items: IBasketItem[];
}

export interface IBasketItem {
  id: number;
  productName: string;
  brand: string;
  type: string;
  price: number;
  pictureUrl: string;
  quantity: number;
}

export class Basket implements IBasket {
  id = uuidv4();
  items: IBasketItem[] = [];
}

export interface IBasketTotal {
  shipping: number;
  subtotal: number;
  total: number;
}
