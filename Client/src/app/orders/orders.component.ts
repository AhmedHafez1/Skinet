import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.getOrdersForUser();
  }

  getOrdersForUser() {
    this.orderService.getOrders().subscribe((orders) => (this.orders = orders));
  }
}
