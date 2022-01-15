import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-clientdashboard',
  templateUrl: './clientdashboard.component.html',
  styleUrls: ['./clientdashboard.component.css']
})
export class ClientdashboardComponent implements OnInit {

  user = this.auth.currentUser

  constructor(
    private auth: Auth,
    private router: Router,
    private toast: HotToastService,
    private authService: AuthenticationService,
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
  }

}
