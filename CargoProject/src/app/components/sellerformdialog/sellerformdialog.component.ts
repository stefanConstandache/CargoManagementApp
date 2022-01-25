import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-sellerformdialog',
  templateUrl: './sellerformdialog.component.html',
  styleUrls: ['./sellerformdialog.component.css']
})
export class SellerformdialogComponent implements OnInit {

  userData: any;
  @ViewChild('departureLoc', { static: true })
  searchElementRefDeparture!: ElementRef;
  @ViewChild('arrivalLoc', { static: true })
  searchElementRefArrival!: ElementRef;
  arrivalName:string = "";
  departureName:string = "";

  constructor(private crud: CrudService, public dialogRef: MatDialogRef<SellerformdialogComponent>, public db: AngularFireDatabase) { }

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
        this.crud.mapCoordinates[0] = places[0].geometry?.location.lat()!;
        this.crud.mapCoordinates[1] = places[0].geometry?.location.lng()!;
      })

      searchBoxArrival.addListener('places_changed',() =>{
        const places = searchBoxArrival.getPlaces();
        if(places.length ===0) {
          return;
        }
        const bounds = new google.maps.LatLngBounds();
        this.arrivalName = places[0].name;
        this.crud.mapCoordinates[2] = places[0].geometry?.location.lat()!;
        this.crud.mapCoordinates[3] = places[0].geometry?.location.lng()!;

      })
  }
  sellerForm: FormGroup = new FormGroup({
    departureDate: new FormControl('', Validators.required),
    arrivalDate: new FormControl('', Validators.required),
    departureLocation: new FormControl('', Validators.required),
    arrivalLocation: new FormControl('', Validators.required),

    brand: new FormControl('', Validators.required),
    maxVolume: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
    maxWeight: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
    gauge: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
    priceEmpty: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
    priceFull: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,9}(?:\.?[0-9]{1,2})?')]),
  });

  initializeFormGroup() {
    this.sellerForm.setValue({
      departureDate: '',
      arrivalDate: '',
      departureLocation: '',
      arrivalLocation: '',
      brand: '',
      maxVolume: '0',
      maxWeight: '0',
      gauge: '0',
      priceEmpty: '0',
      priceFull: '0',
    });
  }

  get departureDate() {
    return this.sellerForm.get('departureDate');
  }

  get arrivalDate() {
    return this.sellerForm.get('arrivalDate');
  }

  get departureLocation() {
    return this.sellerForm.get('departureLocation');
  }

  get arrivalLocation() {
    return this.sellerForm.get('arrivalLocation');
  }

  get brand() {
    return this.sellerForm.get('brand');
  }

  get maxVolume() {
    return this.sellerForm.get('maxVolume');
  }

  get maxWeight() {
    return this.sellerForm.get('maxWeight');
  }

  get gauge() {
    return this.sellerForm.get('gauge');
  }

  get priceEmpty() {
    return this.sellerForm.get('priceEmpty');
  }

  get priceFull() {
    return this.sellerForm.get('priceFull');
  }

  clear() {
    this.sellerForm.reset();
    this.initializeFormGroup();
  }

  submit() {
    if (!this.sellerForm.valid) {
      return;
    }

    const {
      departureDate,
      arrivalDate,
      departureLocation,
      arrivalLocation,
      brand,
      maxVolume,
      maxWeight,
      gauge,
      priceEmpty,
      priceFull,
    } = this.sellerForm.value;

    this.crud.createSellerOffer(
      this.userData.name,
      this.userData.phoneNumber,
      departureDate,
      arrivalDate,
      this.departureName,
      this.arrivalName,
      brand,
      maxVolume,
      maxWeight,
      gauge,
      priceEmpty,
      priceFull,
    );
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
