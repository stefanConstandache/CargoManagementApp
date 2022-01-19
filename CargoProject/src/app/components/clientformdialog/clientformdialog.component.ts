import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CrudService } from 'src/app/services/crud.service';
import { GoogleMap} from '@angular/google-maps';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-clientformdialog',
  templateUrl: './clientformdialog.component.html',
  styleUrls: ['./clientformdialog.component.css']
})
export class ClientformdialogComponent implements OnInit {

  userData: any;
  @ViewChild('departureLoc', { static: true })
  searchElementRefDeparture!: ElementRef;
  @ViewChild('arrivalLoc', { static: true })
  searchElementRefArrival!: ElementRef;

  arrivalName:string = "";
  departureName:string = "";
  arrivalCoordinates: [number,number] = [0.0,0.0];
  departureCoordinates: [number,number] = [0.0,0.0];

  constructor(private crud: CrudService, public dialogRef: MatDialogRef<ClientformdialogComponent>) { }

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
      searchBoxDeparture.addListener('places_changed',() =>{
        const places = searchBoxDeparture.getPlaces();
        if(places.length ===0) {
          return;
        }
        const bounds = new google.maps.LatLngBounds();
        this.departureName = places[0].name;
        this.departureCoordinates[0] = places[0].geometry?.location.lat()!;
        this.departureCoordinates[1] = places[0].geometry?.location.lng()!;
      })

      searchBoxArrival.addListener('places_changed',() =>{
        const places = searchBoxArrival.getPlaces();
        if(places.length ===0) {
          return;
        }
        const bounds = new google.maps.LatLngBounds();
        this.arrivalName = places[0].name;
        this.arrivalCoordinates[0] = places[0].geometry?.location.lat()!;
        this.arrivalCoordinates[1] = places[0].geometry?.location.lng()!;

      })
  }

  clientForm: FormGroup = new FormGroup({
    departureDate: new FormControl('', Validators.required),
    arrivalDate: new FormControl('', Validators.required),
    departureLocation: new FormControl('', Validators.required),
    arrivalLocation: new FormControl('', Validators.required),

    cargoType: new FormControl('', Validators.required),
    volume: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
    weight: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
    budget: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
  });

  initializeFormGroup() {
    this.clientForm.setValue({
      departureDate: '',
      arrivalDate: '',
      departureLocation: '',
      arrivalLocation: '',
      cargoType: '',
      volume: '0',
      weight: '0',
      budget: '0',
    });
  }

  get departureDate() {
    return this.clientForm.get('departureDate');
  }

  get arrivalDate() {
    return this.clientForm.get('arrivalDate');
  }

  get departureLocation() {
    return this.clientForm.get('departureLocation');
  }

  get arrivalLocation() {
    return this.clientForm.get('arrivalLocation');
  }

  get cargoType() {
    return this.clientForm.get('cargoType');
  }

  get volume() {
    return this.clientForm.get('volume');
  }

  get weight() {
    return this.clientForm.get('weight');
  }

  get budget() {
    return this.clientForm.get('budget');
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
      departureDate,
      arrivalDate,
      departureLocation,
      arrivalLocation,
      cargoType,
      volume,
      weight,
      budget,
    } = this.clientForm.value;

    this.crud.createClientOffer(
      this.userData.name,
      this.userData.phoneNumber,
      departureDate,
      arrivalDate,
      this.departureName,
      this.arrivalName,
      cargoType,
      volume,
      weight,
      budget,
    );
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
