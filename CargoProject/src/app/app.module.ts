import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ClientdashboardComponent } from './components/dashboards/clientdashboard/clientdashboard.component';
import { CargodashboardComponent } from './components/dashboards/cargodashboard/cargodashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CrudService } from './services/crud.service';
import { AuthenticationService } from './services/authentication.service';
import { SellerformdialogComponent } from './components/sellerformdialog/sellerformdialog.component';
import { SellerOffersComponent } from './components/seller-offers/seller-offers.component';
import { ClientOffersComponent } from './components/client-offers/client-offers.component';
import { ClientformdialogComponent } from './components/clientformdialog/clientformdialog.component';
import { MyOffersComponent } from './components/my-offers/my-offers.component';
import { ArcgisMapComponent } from './components/arcgis-map/arcgis-map.component';
import { EsriMapComponent } from './components/arcgis-map/esri-map/esri-map.component';
import { OngoingDeliveriesComponent } from './components/ongoing-deliveries/ongoing-deliveries.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ClientdashboardComponent,
    CargodashboardComponent,
    HomeComponent,
    SellerformdialogComponent,
    SellerOffersComponent,
    ClientOffersComponent,
    ClientformdialogComponent,
    MyOffersComponent,
    ArcgisMapComponent,
    EsriMapComponent,
    OngoingDeliveriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule,
    HotToastModule.forRoot(),
  ],
  providers: [CrudService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
