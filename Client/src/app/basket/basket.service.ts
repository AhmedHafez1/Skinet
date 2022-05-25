import { Idelivery } from './../shared/models/delivery';
import { IProduct } from 'src/app/shared/models/product';
import { HttpClient } from '@angular/common/http';
import {
  Basket,
  IBasket,
  IBasketItem,
  IBasketTotal,
} from './../shared/models/basket';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotal | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  shippingPrice = 0;

  constructor(private http: HttpClient) {}

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id).pipe(
      tap((basket) => {
        this.basketSource.next(basket);
        this.shippingPrice = basket.shippingPrice ?? 0;
        this.calcBasketTotal();
      })
    );
  }

  setBasket(basket: IBasket) {
    this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.calcBasketTotal();
      },
      error: (e) => console.log(e),
    });
  }

  getCurrentBasket() {
    return this.basketSource.value;
  }

  setShippingPrice(delivery: Idelivery) {
    this.shippingPrice = delivery.price;
    const basket = this.getCurrentBasket();
    if (basket) {
      basket.deliveryMethodId = delivery.id;
      basket.shippingPrice = delivery.price;
      this.setBasket(basket);
    }

    this.calcBasketTotal();
  }

  setPaymentIntent() {
    return this.http
      .post<IBasket>(
        this.baseUrl + 'payment/' + this.getCurrentBasket()?.id,
        {}
      )
      .pipe(tap((basket) => this.basketSource.next(basket)));
  }

  private calcBasketTotal() {
    const basket = this.getCurrentBasket();
    const subtotal =
      basket?.items.reduce((a, b) => {
        return b.quantity * b.price + a;
      }, 0) ?? 0;

    const total = this.shippingPrice + subtotal;

    this.basketTotalSource.next({
      subtotal,
      shipping: this.shippingPrice,
      total,
    });
  }

  addBasketItem(productItem: IProduct, quantity: number = 1) {
    const basketItem = this.mapProductItemToBasketItem(productItem, quantity);
    const basket = this.getCurrentBasket() ?? this.createBasket();

    basket.items = this.addOrUpdateItems(basket.items, basketItem);

    this.setBasket(basket);
  }

  private createBasket(): IBasket {
    const basket = new Basket();

    localStorage.setItem('basket_id', basket.id);

    return basket;
  }

  private mapProductItemToBasketItem(
    product: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: product.id,
      productName: product.name,
      price: product.price,
      pictureUrl: product.pictureUrl,
      quantity,
      brand: product.productBrand,
      type: product.productType,
    };
  }

  addOrUpdateItems(
    items: IBasketItem[],
    basketItem: IBasketItem
  ): IBasketItem[] {
    const index = items.findIndex((item) => item.id === basketItem.id);

    if (index === -1) {
      items.push(basketItem);
    } else {
      items[index].quantity += basketItem.quantity;
    }

    return items;
  }

  incrementBasketItem(item: IBasketItem) {
    let basket = this.getCurrentBasket();

    if (basket) {
      let index = basket.items.findIndex((x) => x.id === item.id) ?? -1;
      index !== -1 && basket.items[index].quantity++;
      this.setBasket(basket);
    }
  }

  decrementBasketItem(item: IBasketItem) {
    let basket = this.getCurrentBasket();

    if (basket) {
      let index = basket.items.findIndex((x) => x.id === item.id) ?? -1;

      if (basket.items[index].quantity > 1 && index !== -1) {
        basket.items[index].quantity--;
        this.setBasket(basket);
      } else {
        this.removeBasketItem(item);
      }
    }
  }

  removeBasketItem(item: IBasketItem) {
    let basket = this.getCurrentBasket();
    if (basket) {
      if (basket.items.some((x) => x.id === item.id)) {
        basket.items = basket.items.filter((x) => x.id !== item.id);
        if (basket.items.length === 0) {
          this.deleteBasket(basket);
        } else {
          this.setBasket(basket);
        }
      }
    }
  }

  deleteBasket(basket: IBasket) {
    this.http.delete(this.baseUrl + 'basket/' + basket.id).subscribe({
      next: () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      },
      error: (error) => console.log(error),
    });
  }

  deleteBasketLocally() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }
}
