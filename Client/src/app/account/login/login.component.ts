import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl!: string;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submitForm() {
    this.accountService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

  isNotValid(control: string, validation: string) {
    const errors = this.loginForm.get(control)?.errors;

    return (
      this.loginForm.get(control)?.invalid &&
      this.loginForm.get(control)?.touched &&
      errors?.[validation]
    );
  }

  isValidControl(control: string) {
    return (
      this.loginForm.get(control)?.valid && this.loginForm.get(control)?.touched
    );
  }

  isInValidControl(control: string) {
    return (
      this.loginForm.get(control)?.invalid &&
      this.loginForm.get(control)?.touched
    );
  }
}
