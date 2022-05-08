import { v4 as uuidv4 } from 'uuid';

export interface IBasket {
  id: string;
  items: BasketItem[];
}

export interface BasketItem {
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
  items: BasketItem[] = [];
}
