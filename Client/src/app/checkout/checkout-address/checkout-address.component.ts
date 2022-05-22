import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    console.log(this.checkoutForm);
  }

  isNotValid(control: string, validation: string) {
    const errors = this.checkoutForm?.get('addressForm')?.get(control)?.errors;

    return (
      this.checkoutForm?.get('addressForm')?.get(control)?.invalid &&
      this.checkoutForm?.get('addressForm')?.get(control)?.touched &&
      errors?.[validation]
    );
  }

  isValidControl(control: string) {
    return (
      this.checkoutForm?.get('addressForm')?.get(control)?.valid &&
      this.checkoutForm?.get('addressForm')?.get(control)?.touched
    );
  }

  isInValidControl(control: string) {
    return (
      this.checkoutForm?.get('addressForm')?.get(control)?.invalid &&
      this.checkoutForm?.get('addressForm')?.get(control)?.touched
    );
  }
}
