import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-cargodashboard',
  templateUrl: './cargodashboard.component.html',
  styleUrls: ['./cargodashboard.component.css']
})
export class CargodashboardComponent implements OnInit {

  user = this.auth.currentUser

  constructor(
    private auth: Auth,
    public router: Router,
    private toast: HotToastService,
    private authService: AuthenticationService,
    public db: AngularFireDatabase
  ) {
  }

  logout() {
    this.authService.logout().pipe(
      this.toast.observe({
        success: 'Logged out successfully',
        loading: 'Logging out...',
        error: ({ message }) => `There was an error: ${message} `
      })
    ).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  ngOnInit(): void {
    this.db.list("user").set("currentUser",this.user?.email);

  }
}
