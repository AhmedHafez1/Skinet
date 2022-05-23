import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order!: IOrder;
  constructor(
    private brCrumbService: BreadcrumbService,
    private orderService: OrdersService,
    private activeRoute: ActivatedRoute
  ) {
    this.brCrumbService.set('@orderDetails', '');
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails() {
    const id = +this.activeRoute.snapshot.params['id'];
    this.orderService.getOrder(id).subscribe((order) => {
      this.order = order;
      this.brCrumbService.set(
        '@orderDetails',
        `Order# ${order.id} - ${order.orderStatus}`
      );
    });
  }
}
