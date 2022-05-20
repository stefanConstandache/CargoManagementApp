import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CrudService } from 'src/app/services/crud.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  user = this.auth.currentUser;
  isSeller: any;
  isClient: any;
  userData: any;
  myOffers: any; // List with Objects
  myOffersList: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  searchKey: string = "";

  constructor(
    private auth: Auth,
    private crud: CrudService,
  ) {
    this.myOffersList = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.crud.userData.subscribe((data) => {
      this.userData = data;

      if (data.userType == "Client") {
        this.isClient = true;
        this.isSeller = null;
        this.displayedColumns = [
          "actions",
          "status",
          "departureDate",
          "arrivalDate",
          "departureLocation",
          "arrivalLocation",
          "cargoType",
          "volume",
          "weight",
          "budget",
        ];

        this.crud.clientsOffers.subscribe((data) => {
          this.myOffers = data;

          this.myOffersList = new MatTableDataSource(this.myOffers);
          this.myOffersList.sort = this.sort;
          this.myOffersList.paginator = this.paginator;
        });
      } else if (data.userType == "Seller") {
        this.isSeller = true;
        this.isClient = null;
        this.displayedColumns = [
          "actions",
          "status",
          "departureDate",
          "arrivalDate",
          "departureLocation",
          "arrivalLocation",
          "brand",
          "maxVolume",
          "maxWeight",
          "gauge",
          "priceEmpty",
          "priceFull",
        ];

        this.crud.sellersOffers.subscribe((data) => {
          this.myOffers = data;

          this.myOffersList = new MatTableDataSource(this.myOffers);
          this.myOffersList.sort = this.sort;
          this.myOffersList.paginator = this.paginator;
        });
      }
    });


  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.myOffersList.filter = this.searchKey.trim().toLowerCase();
  }

    onDelete(id: any) {
        if (confirm("Are you sure you want to delete this entry?")) {
            this.crud.deleteClientOffer(id);
        }
    }
}
