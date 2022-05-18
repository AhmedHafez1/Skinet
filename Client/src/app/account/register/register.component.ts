import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { map, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errors = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
        [this.validateEmailNotTaken.bind(this)],
      ],
      password: [null, [Validators.required]],
    });
  }

  submitForm() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/shop');
      },
      error: (error) => {
        this.errors = error.errors;
      },
    });
  }

  isNotValid(control: string, validation: string) {
    const errors = this.registerForm.get(control)?.errors;

    return (
      this.registerForm.get(control)?.invalid &&
      this.registerForm.get(control)?.touched &&
      errors?.[validation]
    );
  }

  isNotValidAsync(control: string, validation: string) {
    const errors = this.registerForm.get(control)?.errors;

    return (
      this.registerForm.get(control)?.invalid &&
      errors?.[validation]
    );
  }

  isValidControl(control: string) {
    return (
      this.registerForm.get(control)?.valid &&
      this.registerForm.get(control)?.touched
    );
  }

  isInValidControl(control: string) {
    return (
      this.registerForm.get(control)?.invalid &&
      this.registerForm.get(control)?.touched
    );
  }

  validateEmailNotTaken(control: FormControl) {
    return this.accountService.checkEmailExists(control.value).pipe(
      map((res) => {
        return res ? { emailExist: true } : null;
      })
    );
  }

  validateEmailNotTakenArrowFn(): AsyncValidatorFn {
    return (control: AbstractControl) =>
      this.accountService.checkEmailExists(control.value).pipe(
        map((res) => {
          return res ? { emailExist: true } : null;
        })
      );
  }
}
