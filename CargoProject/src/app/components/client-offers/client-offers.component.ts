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
  isAdmin: any;
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
        if(this.userData.userType=="Admin") {
            this.isAdmin = true
        }
        this.displayedColumns = [
            "name" ,
            "phoneNumber" ,
            "truckNumber",
            "departureDate",
            "departureLocation",
            "arrivalLocation",
            "weight",
            "cargoType",
            "cargoDescription",
        ];
        if(this.isAdmin)
            this.displayedColumns.push("actions")
    });

    this.crud.clientsOffers.subscribe((data) => {
      this.clientsOffers = data["transports"];

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
    onDelete(id: any) {
      console.log(id)
        if (confirm("Are you sure you want to delete this entry?")) {
            this.crud.deleteClientOffer(id);
        }
    }

}
