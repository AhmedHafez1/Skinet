import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketTotal } from '../../models/basket';
import { IOrder } from '../../models/order';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss'],
})
export class OrderTotalsComponent implements OnInit {
  @Input() isBasket = true;
  @Input() order!: IOrder;
  @Input() showCheckoutBtn = true;

  basketTotal$!: Observable<IBasketTotal | null>;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    if (this.isBasket) {
      this.basketTotal$ = this.basketService.basketTotal$;
    }
  }
}
