import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-clientformdialog',
  templateUrl: './clientformdialog.component.html',
  styleUrls: ['./clientformdialog.component.css']
})
export class ClientformdialogComponent implements OnInit {

  constructor(private crud: CrudService, public dialogRef: MatDialogRef<ClientformdialogComponent>) { }

  ngOnInit(): void {
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
      departureDate,
      arrivalDate,
      departureLocation,
      arrivalLocation,
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
