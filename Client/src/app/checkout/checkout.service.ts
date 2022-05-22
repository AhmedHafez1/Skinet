import { IOrder, IOrderToCreate } from './../shared/models/order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Idelivery } from '../shared/models/delivery';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDeliveryOptions() {
    return this.http
      .get<Idelivery[]>(this.baseUrl + 'order/deliveryOptions')
      .pipe(
        map((data) => {
          return data.sort((a, b) => b.price - a.price);
        })
      );
  }

  createOrder(order: IOrderToCreate) {
    return this.http.post<IOrder>(this.baseUrl + 'order', order);
  }
}
