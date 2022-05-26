import { IOrderToCreate } from './../../shared/models/order';
import { FormGroup } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IBasket } from 'src/app/shared/models/basket';

declare var Stripe: any;
@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm!: FormGroup;
  @ViewChild('cardNumber', { static: false }) cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry', { static: false }) cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc', { static: false }) cardCvcElement!: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.stripe = Stripe(
      'pk_test_51L2wqXC7D99tXkwe34esD4VGsobN3hMO0WHhVzjdROAVLdATPJ9fOE03bpf2jTazceDyRMCTqCipx6q0Jwqzngxu00qhReSjSE'
    );

    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', ({ error }) => {
      this.cardErrors = error?.message;
    });

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', ({ error }) => {
      this.cardErrors = error?.message;
    });

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', ({ error }) => {
      this.cardErrors = error?.message;
    });
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasket();
    const order: IOrderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(order).subscribe({
      next: (order) => {
        this.stripe
          .confirmCardPayment(basket.clientSecret, {
            payment_method: {
              card: this.cardNumber,
              billing_details: {
                name: this.checkoutForm?.get('paymentForm').get('nameOnCard')
                  .value,
              },
            },
          })
          .then((result) => {
            if (result.paymentIntent) {
              this.toastrService.success('Order Submitted Successfully');
              this.basketService.deleteBasketLocally();
              this.router.navigate(['checkout', 'success'], { state: order });
            } else {
              this.toastrService.error('Payment Failed');
            }
          });
      },
      error: () => this.toastrService.error('Failed to Submit the order'),
    });
  }

  getOrderToCreate(basket: IBasket): IOrderToCreate {
    return {
      basketId: basket?.id,
      deliveryMethodId: this.checkoutForm.get('deliveryForm')?.get('deliveryId')
        ?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value,
    };
  }

  isNotValid(control: string, validation: string) {
    const errors = this.checkoutForm?.get('paymentForm')?.get(control)?.errors;

    return (
      this.checkoutForm?.get('paymentForm')?.get(control)?.invalid &&
      this.checkoutForm?.get('paymentForm')?.get(control)?.touched &&
      errors?.[validation]
    );
  }

  isValidControl(control: string) {
    return (
      this.checkoutForm?.get('paymentForm')?.get(control)?.valid &&
      this.checkoutForm?.get('paymentForm')?.get(control)?.touched
    );
  }

  isInValidControl(control: string) {
    return (
      this.checkoutForm?.get('paymentForm')?.get(control)?.invalid &&
      this.checkoutForm?.get('paymentForm')?.get(control)?.touched
    );
  }
}
