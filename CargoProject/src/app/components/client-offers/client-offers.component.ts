import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CrudService } from 'src/app/services/crud.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClientformdialogComponent } from '../clientformdialog/clientformdialog.component';

@Component({
  selector: 'app-client-offers',
  templateUrl: './client-offers.component.html',
  styleUrls: ['./client-offers.component.css']
})
export class ClientOffersComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  user = this.auth.currentUser;
  isSeller: any;
  isClient: any;
  userData: any;
  clientsOffers: any; // List with Objects
  clientsOffersList: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  searchKey: string = "";

  constructor(private auth: Auth, private crud: CrudService, private dialog: MatDialog) {
    this.clientsOffersList = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.crud.userData.subscribe((data) => {
      this.userData = data;

      if (data.userType == "Client") {
        this.isClient = true;
        this.isSeller = null;
        this.displayedColumns = [
          "name",
          "phoneNumber",
          "departureDate",
          "arrivalDate",
          "departureLocation",
          "arrivalLocation",
          "cargoType",
          "volume",
          "weight",
          "budget",
        ];
      } else if (data.userType == "Seller") {
        this.isSeller = true;
        this.isClient = null;
        this.displayedColumns = [
          "actions",
          "name",
          "phoneNumber",
          "departureDate",
          "arrivalDate",
          "departureLocation",
          "arrivalLocation",
          "cargoType",
          "volume",
          "weight",
          "budget",
        ];
      }
    });

    this.crud.clientsOffers.subscribe((data) => {
      this.clientsOffers = data;

      this.clientsOffersList = new MatTableDataSource(this.clientsOffers);
      this.clientsOffersList.sort = this.sort;
      this.clientsOffersList.paginator = this.paginator;
    });
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "510px";
    this.dialog.open(ClientformdialogComponent, dialogConfig);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.clientsOffersList.filter = this.searchKey.trim().toLowerCase();
  }
}
