import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapsComponent } from './app.component';
import { ArcGISMapComponent } from './map/map.component';

const routes: Routes = [{
  path: '',
  component: MapsComponent,
  children: [{
    path: 'arcgis',
    component: ArcGISMapComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
