import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Idelivery } from 'src/app/shared/models/delivery';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss'],
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  deliveryOptions: Idelivery[] = [];

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.getDeliveryOptions();
  }

  getDeliveryOptions() {
    this.checkoutService
      .getDeliveryOptions()
      .subscribe((dat) => (this.deliveryOptions = dat));
  }
}
