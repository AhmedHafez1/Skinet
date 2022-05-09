import { IProduct } from 'src/app/shared/models/product';
import { HttpClient } from '@angular/common/http';
import { Basket, IBasket, IBasketItem } from './../shared/models/basket';
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

  constructor(private http: HttpClient) {}

  getBasket(id: string) {
    this.http
      .get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(tap((basket) => this.basketSource.next(basket)));
  }

  setBasket(basket: IBasket) {
    this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe({
      next: (basket) => {
        console.log(basket);
        this.basketSource.next(basket);
      },
      error: (e) => console.log(e),
    });
  }

  getCurrentBasket() {
    return this.basketSource.value;
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
}
