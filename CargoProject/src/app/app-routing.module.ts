import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'
import { ClientdashboardComponent } from './components/dashboards/clientdashboard/clientdashboard.component';
import { CargodashboardComponent } from './components/dashboards/cargodashboard/cargodashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SellerOffersComponent } from './components/seller-offers/seller-offers.component';
import { ClientOffersComponent } from './components/client-offers/client-offers.component';
import { MyOffersComponent } from './components/my-offers/my-offers.component';
import { ArcgisMapComponent } from './components/arcgis-map/arcgis-map.component';
import { OngoingDeliveriesComponent } from './components/ongoing-deliveries/ongoing-deliveries.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'client',
    component: ClientdashboardComponent,
    ...canActivate(redirectToLogin),
    children: [
      { path: 'clientOffers', component: ClientOffersComponent },
      { path: 'transporterOffers', component: SellerOffersComponent },
      { path: 'myOffers', component: MyOffersComponent },
      { path: '', redirectTo: 'clientOffers', pathMatch: 'full' },
    ]
  },
  {
    path: 'cargo',
    component: CargodashboardComponent,
    ...canActivate(redirectToLogin),
    children: [
      { path: 'transporterOffers', component: SellerOffersComponent },
      { path: 'clientOffers', component: ClientOffersComponent },
      { path: 'myOffers', component: MyOffersComponent },
      { path: '', redirectTo: 'transporterOffers', pathMatch: 'full' },
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'map',
    component: ArcgisMapComponent,
    ...canActivate(redirectToLogin)
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
