import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CrudService } from 'src/app/services/crud.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDontMatch: true
      };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  user = this.authService.currentUser;

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{,10}")]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    userType: new FormControl('', Validators.required),
  }, { validators: passwordMatchValidator })

  constructor(private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private crud: CrudService,
  ) { }

  ngOnInit(): void {
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get phoneNumber() {
    return this.signUpForm.get('phoneNumber');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get userType() {
    return this.signUpForm.get('userType');
  }

  submit() {
    if (!this.signUpForm.valid) {
      return;
    }

    const { name, userType, email, phoneNumber, password } = this.signUpForm.value;
    this.authService.signUp(email, password).pipe(
      this.toast.observe({
        success: 'Congrats! You are all signed up',
        loading: 'Signing up...',
        error: ({ message }) => `${message}`
      })
    ).subscribe(() => {
      this.crud.createUser(name, email, phoneNumber, userType);
      this.router.navigate(['/home']);
    });
  }
}
