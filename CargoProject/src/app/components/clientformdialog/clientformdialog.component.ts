import {Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CrudService} from 'src/app/services/crud.service';
import {GoogleMap} from '@angular/google-maps';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {Auth} from 'firebase/auth';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

@Component({
    selector: 'app-clientformdialog',
    templateUrl: './clientformdialog.component.html',
    styleUrls: ['./clientformdialog.component.css']
})

export class ClientformdialogComponent implements OnInit {

    userData: any;
    @ViewChild('departureLoc', {static: true})
    searchElementRefDeparture!: ElementRef;
    @ViewChild('arrivalLoc', {static: true})
    searchElementRefArrival!: ElementRef;
    arrivalName: string = "";
    departureName: string = "";

    constructor(private crud: CrudService, public dialogRef: MatDialogRef<ClientformdialogComponent>, public db: AngularFireDatabase) {
    }

    ngOnInit(): void {
        this.crud.userData.subscribe((data) => {
            this.userData = data;
        });
    }

    ngAfterViewInit(): void {
        const searchBoxDeparture = new google.maps.places.SearchBox(
            this.searchElementRefDeparture.nativeElement,
        );
        const searchBoxArrival = new google.maps.places.SearchBox(
            this.searchElementRefArrival.nativeElement,
        );
        searchBoxDeparture.addListener('places_changed', () => {
            const places = searchBoxDeparture.getPlaces();
            if (places.length === 0) {
                return;
            }
            const bounds = new google.maps.LatLngBounds();
            this.departureName = places[0].name;
            this.crud.mapCoordinates[0] = places[0].geometry?.location.lat()!;
            this.crud.mapCoordinates[1] = places[0].geometry?.location.lng()!;
        })

        searchBoxArrival.addListener('places_changed', () => {
            const places = searchBoxArrival.getPlaces();
            if (places.length === 0) {
                return;
            }
            const bounds = new google.maps.LatLngBounds();
            this.arrivalName = places[0].name;
            this.crud.mapCoordinates[2] = places[0].geometry?.location.lat()!;
            this.crud.mapCoordinates[3] = places[0].geometry?.location.lng()!;
            this.crud.mapCoordinates[4] = this.random_rgb();

        })
    }

    random_rgb() {
        var o = Math.round, r = Math.random, s = 255;
        return [o(r() * s), o(r() * s), o(r() * s)];
    }

    clientForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        phone_number: new FormControl('', Validators.required),
        truck_number: new FormControl('', Validators.required),
        departure_time: new FormControl('', Validators.required),
        departure_location: new FormControl('', Validators.required),
        arrival_location: new FormControl('', Validators.required),
        weight: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
        cargo_type: new FormControl('', Validators.required),
        cargo_description: new FormControl('', Validators.required),
    });

    initializeFormGroup() {
        this.clientForm.setValue({
            name: '',
            phone_number:'',
            truck_number:'',
            departure_time: '',
            departure_location: '',
            arrival_location: '',
            weight: '0',
            cargo_type: '',
            cargo_description: '',
        });
    }

    get departure_time() {
        return this.clientForm.get('departure_time');
    }

    get name() {
        return this.clientForm.get('name');
    }

    get departure_location() {
        return this.clientForm.get('departure_location');
    }

    get arrival_location() {
        return this.clientForm.get('arrival_location');
    }

    get cargo_type() {
        return this.clientForm.get('cargoType');
    }

    get cargo_description() {
        return this.clientForm.get('cargo_description');
    }

    get weight() {
        return this.clientForm.get('weight');
    }

    get phone_number() {
        return this.clientForm.get('phone_number');
    }

    get truck_number() {
        return this.clientForm.get('truck_number');
    }


    clear() {
        this.clientForm.reset();
        this.initializeFormGroup();
    }

    submit() {
        if (!this.clientForm.valid) {
            return;
        }

        const {
            name,
            phone_number,
            truck_number,
            departure_time,
            departure_location,
            arrival_location,
            weight,
            cargo_type,
            cargo_description,
        } = this.clientForm.value;

        this.crud.createClientOffer(
            name,
            phone_number,
            truck_number,
            departure_time,
            this.departureName,
            this.arrivalName,
            weight,
            cargo_type,
            cargo_description,
        );
        this.close();

    }

    close() {
        this.dialogRef.close();
    }
}
