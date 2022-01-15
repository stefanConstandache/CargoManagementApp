import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'
import { ClientdashboardComponent } from './components/dashboards/clientdashboard/clientdashboard.component';
import { CargodashboardComponent } from './components/dashboards/cargodashboard/cargodashboard.component';
import { AdmindashboardComponent } from './components/dashboards/admindashboard/admindashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SellerOffersComponent } from './components/seller-offers/seller-offers.component';
import { ClientOffersComponent } from './components/client-offers/client-offers.component';

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
      { path: '', redirectTo: 'transporterOffers', pathMatch: 'full' },
    ]
  },
  {
    path: 'admin',
    component: AdmindashboardComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectToLogin)
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
