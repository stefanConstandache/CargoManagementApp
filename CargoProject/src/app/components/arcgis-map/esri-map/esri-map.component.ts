import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import { setDefaultOptions } from 'esri-loader';
import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef | undefined;

  /**
   * @private _zoom sets map zoom
   * @private _center sets map center
   * @private _basemap sets type of map
   */
  private _zoom: number = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap: string = 'streets';
  mapView: esri.MapView;

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  
  constructor() { this.mapView = new esri.MapView({}); }

  async initializeMap() {
    try {
      // setDefaultOptions({ version: '4.13' });
      const [esriConfig, EsriMap, EsriMapView, Graphic, route, RouteParameters, FeatureSet] = await loadModules([
        'esri/config',	
        'esri/Map',
        'esri/views/MapView',

        "esri/Graphic",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet"
      ]);

      // Set type of map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Set type of map view
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl?.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      esriConfig.apiKey = "AAPK4cb5ec502d454db49d8bd97b36fb6b91DvZ9a-RGRK_JZ3dNW7I7gjEZqhX1rTCnLuaWBRWYAGUUdwxNq1ygpC1iRoQdDvXY";
      const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
      this.mapView = new EsriMapView(mapViewProperties);
      const mapView = this.mapView;

      function getRoute() {
        const routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: mapView.graphics.toArray()
          }),
  
          returnDirections: true
  
        });
  
        route.solve(routeUrl, routeParams)
          .then(function(data: { routeResults: any[]; }) {
            data.routeResults.forEach(function(result) {
              result.route.symbol = {
                type: "simple-line",
                color: [5, 150, 255],
                width: 3
              };
              mapView.graphics.add(result.route);
            });
  
            // Display directions
           if (data.routeResults.length > 0) {
             const directions = document.createElement("ol");
            //  directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
             directions.style.marginTop = "0";
             directions.style.padding = "15px 15px 15px 30px";
             const features = data.routeResults[0].directions.features;
  
             // Show each direction
             features.forEach(function(result: { attributes: { text: string; length: number; }; },i: any){
               const direction = document.createElement("li");
               direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
               directions.appendChild(direction);
             });
  
             mapView.ui.empty("top-right");
             mapView.ui.add(directions, "top-right");
  
           }
  
          })
        }

      function addGraphic(type: string, point: any) {
        const graphic = new Graphic({
          symbol: {
            type: "simple-marker",
            color: (type === "origin") ? "white" : "black",
            size: "8px"
          },
          geometry: point
        });
        mapView.graphics.add(graphic);
      }

      mapView.on("click", function(event){

        if (mapView.graphics.length === 0) {
          addGraphic("origin", event.mapPoint);
        } else if (mapView.graphics.length === 1) {
          addGraphic("destination", event.mapPoint);
  
          getRoute(); // Call the route service
  
        } else {
          mapView.graphics.removeAll();
          addGraphic("origin",event.mapPoint);
        }
  
      });

      // All resources in the MapView and the map have loaded.
      // Now execute additional processes
      mapView.when(() => {
        this.mapLoaded.emit(true);
      });
    } catch (error) {
      alert('We have an error: ' + error);
    }
  }

  ngOnInit() {
    this.initializeMap();
  }

}
