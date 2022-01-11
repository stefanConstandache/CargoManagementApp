import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-clientdashboard',
  templateUrl: './clientdashboard.component.html',
  styleUrls: ['./clientdashboard.component.css']
})
export class ClientdashboardComponent implements OnInit {

  user = this.auth.currentUser;
  userData: any;

  constructor(private auth: Auth, private crud: CrudService) {
  }

  ngOnInit(): void {
    this.crud.userData.subscribe((data) => {
      this.userData = data;
    })
  }

}
