import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CrudService } from 'src/app/services/crud.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SellerformdialogComponent } from '../sellerformdialog/sellerformdialog.component';

@Component({
  selector: 'app-seller-offers',
  templateUrl: './seller-offers.component.html',
  styleUrls: ['./seller-offers.component.css']
})
export class SellerOffersComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  user = this.auth.currentUser;
  isSeller: any;
  isClient: any;
  userData: any;
  sellersOffers: any; // List with Objects
  sellersOffersList: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  searchKey: string = "";

  constructor(private auth: Auth, private crud: CrudService, private dialog: MatDialog) {
    this.sellersOffersList = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.crud.userData.subscribe((data) => {
      this.userData = data;

      if (data.userType == "Seller") {
        this.isClient = null;
        this.isSeller = true;
        this.displayedColumns = [
          "name",
          "phoneNumber",
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
      } else if (data.userType == "Client") {
        this.isSeller = null;
        this.isClient = true;

        this.displayedColumns = [
          "actions",
          "name",
          "phoneNumber",
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
      }
    });

    this.crud.sellersOffers.subscribe((data) => {
      this.sellersOffers = data;

      this.sellersOffersList = new MatTableDataSource(this.sellersOffers);
      this.sellersOffersList.sort = this.sort;
      this.sellersOffersList.paginator = this.paginator;
    });
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "510px";
    this.dialog.open(SellerformdialogComponent, dialogConfig);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.sellersOffersList.filter = this.searchKey.trim().toLowerCase();
  }

  onTakeOffer(idOffer: string, idOwner: string) {
    this.crud.acceptSellerOffer(idOffer, idOwner);
  }
}
