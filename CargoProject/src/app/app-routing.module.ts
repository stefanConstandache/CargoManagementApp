import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard'
import {ClientdashboardComponent} from './components/dashboards/clientdashboard/clientdashboard.component';
import {HomeComponent} from './components/home/home.component';
// import { SellerOffersComponent } from './components/seller-offers/seller-offers.component';
import {ClientOffersComponent} from './components/client-offers/client-offers.component';
import {ArcgisMapComponent} from './components/arcgis-map/arcgis-map.component';

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
        path: 'transport',
        component: ClientdashboardComponent,
        ...canActivate(redirectToLogin),
        children: [
            {path: 'transports', component: ClientOffersComponent},
            // { path: 'transporterOffers', component: SellerOffersComponent },
            {path: 'map', component: ArcgisMapComponent},
            {path: '', redirectTo: 'transports', pathMatch: 'full'},
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
export class AppRoutingModule {
}
