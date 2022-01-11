import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  userData: Observable<any>;

  constructor(private firestore: AngularFirestore, private router: Router, private auth: Auth) {
    this.userData = new Observable;
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserData();
      } else {
        this.userData = new Observable;
      }
    })
  }

  create(name: string, email: string, userType: string) {
    let User = {
      name: name,
      email: email,
      userType: userType,
    };

    this.firestore.collection("Users").doc(this.auth.currentUser?.uid).set(User);
  }

  getUserData() {
    this.userData = this.firestore.collection("Users").doc(this.auth.currentUser?.uid).valueChanges();
  }

  redirect() {
    this.userData.subscribe((data) => {
      if (data.userType == "Client") {
        this.router.navigate(['/client']);
      } else if (data.userType == "Seller") {
        this.router.navigate(['/cargo']);
      } else if (data.userType == "Admin") {
        this.router.navigate(['/admin']);
      }
    })
  }
}
