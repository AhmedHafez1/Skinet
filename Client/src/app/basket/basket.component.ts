import { IBasket, IBasketItem } from './../shared/models/basket';
import { Observable } from 'rxjs';
import { BasketService } from './basket.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  basket$!: Observable<IBasket | null>;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementBasketItem(item);
  }

  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementBasketItem(item);
  }

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeBasketItem(item);
  }
}
