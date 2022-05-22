import { IOrderToCreate } from './../../shared/models/order';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  submitOrder() {
    const order: IOrderToCreate = this.getOrderToCreate();
    this.checkoutService.createOrder(order).subscribe({
      next: (order) => {
        if (order) {
          this.toastrService.success('Order Submitted Successfully');
          this.basketService.deleteBasketLocally();
        }
      },
      error: () => this.toastrService.error('Failed to Submit the order'),
    });
  }

  getOrderToCreate(): IOrderToCreate {
    const basket = this.basketService.getCurrentBasket();

    return {
      basketId: basket?.id,
      deliveryMethodId: this.checkoutForm.get('deliveryForm')?.get('deliveryId')
        ?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value,
    };
  }
}
