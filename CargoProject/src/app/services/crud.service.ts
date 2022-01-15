import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  userData: Observable<any>;
  myOffers: Observable<any>;
  clientsOffers: Observable<any>;
  sellersOffers: Observable<any>;

  constructor(private firestore: AngularFirestore, private router: Router, private auth: Auth, private toast: HotToastService,) {
    this.userData = new Observable;
    this.myOffers = new Observable;
    this.clientsOffers = new Observable;
    this.sellersOffers = new Observable;

    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getUserData();
        this.getMyOffers();
        this.getSellersOffers();
        this.getClientsOffers();
      } else {
        this.userData = new Observable;
        this.myOffers = new Observable;
        this.clientsOffers = new Observable;
        this.sellersOffers = new Observable;
      }
    })
  }

  createUser(name: string, email: string, userType: string) {
    let User = {
      name: name,
      email: email,
      userType: userType,
      offers: [],
    };

    this.firestore.collection("Users").doc(this.auth.currentUser?.uid).set(User);
  }

  getUserData() {
    this.userData = this.firestore.collection("Users").doc(this.auth.currentUser?.uid).valueChanges();
  }

  async createSellerOffer(
    departureDate: Date,
    arrivalDate: Date,
    departureLocation: string,
    arrivalLocation: string,
    brand: string,
    maxVolume: string,
    maxWeight: string,
    gauge: string,
    priceEmpty: string,
    priceFull: string,
  ) {
    let Offer = {
      departureDate: departureDate,
      arrivalDate: arrivalDate,
      departureLocation: departureLocation,
      arrivalLocation: arrivalLocation,
      brand: brand,
      maxVolume: maxVolume,
      maxWeight: maxWeight,
      gauge: gauge,
      priceEmpty: priceEmpty,
      priceFull: priceFull,
      status: "Pending",
      owner: this.auth.currentUser?.uid,
    };

    await this.firestore.collection("SellersOffers").add(Offer).then((result) => {
      this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then((doc) => {
        const data = doc.data() as any
        data.offers.push(result.id);
        this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "offers": data.offers });
        this.toast.success("Offer Created Successfully");
      });
    });
  }

  async createClientOffer(
    departureDate: Date,
    arrivalDate: Date,
    departureLocation: string,
    arrivalLocation: string,
    cargoType: string,
    volume: string,
    weight: string,
    budget: string,
  ) {
    let Offer = {
      departureDate: departureDate,
      arrivalDate: arrivalDate,
      departureLocation: departureLocation,
      arrivalLocation: arrivalLocation,
      cargoType: cargoType,
      volume: volume,
      weight: weight,
      budget: budget,
      status: "Pending",
      owner: this.auth.currentUser?.uid,
    };

    await this.firestore.collection("ClientsOffers").add(Offer).then((result) => {
      this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then((doc) => {
        const data = doc.data() as any
        data.offers.push(result.id);
        this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "offers": data.offers });
        this.toast.success("Offer Created Successfully");
      });
    });
  }

  getSellersOffers() {
    this.sellersOffers = this.firestore.collection("SellersOffers").valueChanges();
  }

  getClientsOffers() {
    this.clientsOffers = this.firestore.collection("ClientsOffers").valueChanges();
  }

  async getMyOffers() {
    let uid = this.auth.currentUser?.uid;
    this.myOffers = this.firestore.collection("SellersOffers", ref => ref.where("owner", "==", uid)).valueChanges();
    if (!this.myOffers) {
      this.myOffers = this.firestore.collection("ClientsOffers", ref => ref.where("owner", "==", uid)).valueChanges();
    }
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
