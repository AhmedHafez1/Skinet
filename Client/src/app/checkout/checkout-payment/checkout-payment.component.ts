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
import { firstValueFrom } from 'rxjs';

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

  cardNumberValid: boolean;
  cardExpiryValid: boolean;
  cardCvcValid: boolean;

  loading = false;
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

    const changeEventHandler = this.onChangeEvents.bind(this);
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', changeEventHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', changeEventHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', changeEventHandler);
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  onChangeEvents(event) {
    this.cardErrors = event?.error?.message;

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasket();

    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        this.router.navigate(['checkout', 'success'], { state: createdOrder });
      } else {
        this.toastrService.error(paymentResult.error.message);
      }
      this.loading = false;
    } catch (error) {
      this.toastrService.error('Failed to create the order');
      console.log(error);
      this.loading = false;
    }
  }

  async createOrder(basket: IBasket) {
    const order = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(order));
  }

  async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm?.get('paymentForm').get('nameOnCard').value,
        },
      },
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
