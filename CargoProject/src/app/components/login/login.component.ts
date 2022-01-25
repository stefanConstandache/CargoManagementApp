import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CrudService } from 'src/app/services/crud.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })
  userData: any;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private crud: CrudService,
    public db: AngularFireDatabase,
    public auth: Auth
  ) { }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).pipe(
      this.toast.observe({
        success: 'Logged in successfully',
        loading: 'Logging in...',
        error: ({ message }) => `There was an error: ${message} `
      })
    ).subscribe(() => {
      this.crud.userData.subscribe((data) => {
        this.userData = data;
        this.db.list("user").set("currentUser",this.auth.currentUser?.uid);
      });

      this.router.navigate(['/home']);
    });
  }
}
