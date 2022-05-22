import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

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

  updateAddress() {
    this.accountService
      .updateUserAddress(this.checkoutForm.get('addressForm')?.value)
      .subscribe({
        next: (address) => {
          if (address) {
            this.toastrService.success('Address Saved Successfully');
          }
        },
        error: () => this.toastrService.error('Failed to save the Address'),
      });
  }
}
