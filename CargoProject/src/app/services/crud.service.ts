import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
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
  mapCoordinates: Observable<any>;

  constructor(private firestore: AngularFirestore, private router: Router, private auth: Auth, private toast: HotToastService, public db: AngularFireDatabase) {
    this.userData = new Observable;
    this.myOffers = new Observable;
    this.clientsOffers = new Observable;
    this.sellersOffers = new Observable;
    this.mapCoordinates = new Observable;

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
        this.mapCoordinates = new Observable;
      }
    })
  }

  createUser(name: string, email: string, phoneNumber: string, userType: string) {
    let User = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      userType: userType,
      offers: [],
      acceptedOffers: [],
    };

    this.firestore.collection("Users").doc(this.auth.currentUser?.uid).set(User);
  }

  getUserData() {
    this.userData = this.firestore.collection("Users").doc(this.auth.currentUser?.uid).valueChanges();
  }

  async createSellerOffer(
    name: string,
    phoneNumber: string,
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
      id: "",
      name: name,
      phoneNumber: phoneNumber,
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

    await this.firestore.collection("SellersOffers").add(Offer).then(async (result) => {
      await this.firestore.collection("SellersOffers").doc(result.id).update({ "id": result.id });
      await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then((doc) => {
        const data = doc.data() as any
        data.offers.push(result.id);
        this.db.list(name).set(result.id,this.mapCoordinates);
        this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "offers": data.offers });
        this.toast.success("Offer Created Successfully");
      });
    });
  }

  async createClientOffer(
    name: string,
    phoneNumber: string,
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
      id: "",
      name: name,
      phoneNumber: phoneNumber,
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

    await this.firestore.collection("ClientsOffers").add(Offer).then(async (result) => {
      await this.firestore.collection("ClientsOffers").doc(result.id).update({ "id": result.id });
      await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then((doc) => {
        const data = doc.data() as any
        this.db.list(name).set(result.id,this.mapCoordinates);
        data.offers.push(result.id);
        this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "offers": data.offers });
        this.toast.success("Offer Created Successfully");
      });
    });
  }

  getSellersOffers() {
    this.sellersOffers = this.firestore.collection("SellersOffers", ref => ref.where("status", "==", "Pending")).valueChanges();
  }

  getClientsOffers() {
    this.clientsOffers = this.firestore.collection("ClientsOffers", ref => ref.where("status", "==", "Pending")).valueChanges();
  }

  async getMyOffers() {
    let uid = this.auth.currentUser?.uid;
    this.myOffers = this.firestore.collection("SellersOffers", ref => ref.where("owner", "==", uid)).valueChanges();
    if (!this.myOffers) {
      this.myOffers = this.firestore.collection("ClientsOffers", ref => ref.where("owner", "==", uid)).valueChanges();
    }
  }

  async deleteClientOffer(id: string) {
    await this.firestore.collection("ClientsOffers").doc(id).delete().then(async () => {
      await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then(async (doc) => {
        const data = doc.data() as any;
        const filtered = data.offers.filter(function (value: string, index: number, arr: []) {
          return value != id;
        });

        await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "offers": filtered })
      }).then(() => { this.toast.success("Entry deleted succesfully"); });
    });
  }

  async deleteSellerOffer(id: string) {
    await this.firestore.collection("SellersOffers").doc(id).delete().then(async () => {
      await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then(async (doc) => {
        const data = doc.data() as any;
        const filtered = data.offers.filter(function (value: string, index: number, arr: []) {
          return value != id;
        });

        await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "offers": filtered })
      }).then(() => { this.toast.success("Entry deleted succesfully"); });
    });
  }

  async acceptSellerOffer(idOffer: string, idOwner: string) {
    await this.firestore.collection("SellersOffers").doc(idOffer).update({ "status": "Ongoing" }).then(async () => {
      await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then(async (doc) => {
        const data = doc.data() as any;
        data.acceptedOffers.push(idOffer);

        await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "acceptedOffers": data.acceptedOffers })

      });

      await this.firestore.collection("Users").doc(idOwner).ref.get().then(async (doc) => {
        const data = doc.data() as any;
        data.acceptedOffers.push(idOffer);

        await this.firestore.collection("Users").doc(idOwner).update({ "acceptedOffers": data.acceptedOffers })

      });
    }).then(() => { this.toast.success("Delivery accepted"); });
  }

  async acceptClientOffer(idOffer: string, idOwner: string) {
    await this.firestore.collection("ClientsOffers").doc(idOffer).update({ "status": "Ongoing" }).then(async () => {
      await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then(async (doc) => {
        const data = doc.data() as any;
        data.acceptedOffers.push(idOffer);

        await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({ "acceptedOffers": data.acceptedOffers })

      });

      await this.firestore.collection("Users").doc(idOwner).ref.get().then(async (doc) => {
        const data = doc.data() as any;
        data.acceptedOffers.push(idOffer);

        await this.firestore.collection("Users").doc(idOwner).update({ "acceptedOffers": data.acceptedOffers })

      });
    }).then(() => { this.toast.success("Delivery accepted"); });
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
