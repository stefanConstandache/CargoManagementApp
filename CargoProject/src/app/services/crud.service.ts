import {Injectable} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import {HotToastService} from '@ngneat/hot-toast';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class CrudService {

    userData: Observable<any>;
    myOffers: Observable<any>;
    clientsOffers: Observable<any>;
    sellersOffers: Observable<any>;
    mapCoordinates: Observable<any>;

    constructor(private firestore: AngularFirestore, private router: Router, private auth: Auth, private toast: HotToastService, public db: AngularFireDatabase, private http: HttpClient) {
        this.userData = new Observable;
        this.myOffers = new Observable;
        this.clientsOffers = new Observable;
        this.sellersOffers = new Observable;
        this.mapCoordinates = new Observable;

        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.getUserData();
                this.getMyOffers();
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
        };

        this.firestore.collection("Users").doc(this.auth.currentUser?.uid).set(User);
    }

    getUserData() {
        this.userData = this.firestore.collection("Users").doc(this.auth.currentUser?.uid).valueChanges();
    }


    async createClientOffer(
        name: string,
        phoneNumber: string,
        truckNumber: string,
        departureDate: Date,
        departureLocation: string,
        arrivalLocation: string,
        weight: string,
        cargoType: string,
        cargoDescription: string,
    ) {
        let Offer = {
            name: name,
            phone_number: phoneNumber,
            truck_number: truckNumber,
            departure_time: departureDate.getTime().toString(),
            departure_location: departureLocation,
            arrival_location: arrivalLocation,
            weight: weight,
            cargo_type: cargoType,
            cargo_description: cargoDescription,
        };
        const headers = {'Content-Type': 'application/json'}
        const body = JSON.stringify(Offer);
        this.http.post("http://127.0.0.1:5000/cargo", body, {'headers': headers})
            .subscribe(response => {
                console.log(response["response"]);
            },)
        window.location.reload();


    }

    getClientsOffers() {

        this.clientsOffers  = this.http.get<any>('http://127.0.0.1:5000/gettransports')

    }

    async getMyOffers() {
        let uid = this.auth.currentUser?.uid;
        this.myOffers = this.firestore.collection("SellersOffers", ref => ref.where("owner", "==", uid)).valueChanges();
        if (!this.myOffers) {
            this.myOffers = this.firestore.collection("ClientsOffers", ref => ref.where("owner", "==", uid)).valueChanges();
        }
    }

    async deleteClientOffer(id: string) {
        console.log(id)
        this.http.delete<any>("http://127.0.0.1:5000/transports/" + id).subscribe({
            next: data => {
                console.log('Delete successful');
            },
            error: error => {
                // this.errorMessage = error.message;
                console.error('There was an error!', error);
            }
        });
        window.location.reload();
    }

    async deleteSellerOffer(id: string) {
        await this.firestore.collection("SellersOffers").doc(id).delete().then(async () => {
            await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).ref.get().then(async (doc) => {
                const data = doc.data() as any;
                const filtered = data.offers.filter(function (value: string, index: number, arr: []) {
                    return value != id;
                });

                await this.firestore.collection("Users").doc(this.auth.currentUser?.uid).update({"offers": filtered})
            }).then(() => {
                this.toast.success("Entry deleted succesfully");
            });
        });
    }



    redirect() {
        this.userData.subscribe((data) => {
            if (data.userType == "Client" || data.userType == "Admin") {
                this.router.navigate(['/transport']);
            }
        })
    }
}
