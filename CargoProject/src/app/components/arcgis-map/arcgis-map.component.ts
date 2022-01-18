import { Component } from '@angular/core';

@Component({
  selector: 'app-arcgis-map',
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css']
})
export class ArcgisMapComponent {
  // Set our map properties
  mapCenter = [25.4194, 45.7749];
  basemapType = 'streets';
  mapZoomLevel = 7;

  mapLoadedEvent(status: boolean) {
    console.log('The map has loaded: ' + status);
  }
}

