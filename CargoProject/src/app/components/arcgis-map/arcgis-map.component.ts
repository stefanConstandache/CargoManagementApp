import {Component, OnInit, ViewChild, ElementRef, Input, SimpleChange, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import onResize from 'simple-element-resize-detector';
import {map, share, tap} from 'rxjs/operators';
import {Observable} from "rxjs";
import {GeocodeService} from "../../services/geocode.service";


declare var H: any;

@Component({
    selector: 'app-arcgis-map',
    templateUrl: './arcgis-map.component.html',
    styleUrls: ['./arcgis-map.component.css']
})
export class ArcgisMapComponent {
    // Set our map properties
    @ViewChild("map", {static: true}) public mapElement!: ElementRef;

    public lat: any = '22.5726';
    public lng: any = '88.3639';

    public width: any = '1500px';
    public height: any = '700px';

    private platform: any;
    @Input() private map: any;
    public transports: any;


    public constructor(private http: HttpClient, public geocodeService: GeocodeService) {

    }

    public static logEvent(evt) {
        alert(evt.target.routeData)
    }

    public ngOnInit() {
        this.platform = new H.service.Platform({
            apiKey: "VfMTefQBFa7_gkV33eyqExbIgt4XUekUlwZmOPYrFZ0",
        });

    }

    public ngAfterViewInit() {

        let pixelRatio = window.devicePixelRatio || 1;
        let defaultLayers = this.platform.createDefaultLayers();
        var targetElement = document.getElementById('map');


        var map = new H.Map(document.getElementById('map'),
            defaultLayers.vector.normal.map,
            {
                zoom: 10,
                center: {lat: 52.51, lng: 13.4}
            });
        window.addEventListener('resize', () => map.getViewPort().resize());


        var ui = H.ui.UI.createDefault(map, defaultLayers);
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">
    <circle cx="5" cy="5" r="4" fill="rgb(250, 127, 0)" stroke-width="1" stroke="black" opacity="1"/>
    </svg>`
        var domIcon = new H.map.DomIcon(svg)
        this.http.get<any>('http://127.0.0.1:5000/gettransports').subscribe(data => {
            this.transports = data["transports"];
            this.transports.forEach((transport) => {
                var point = new H.map.DomMarker({lat: 100, lng: 100}, {
                    icon: domIcon
                })
                map.addObject(point);
                // console.log(transport)
                var destination;
                this.geocodeService.geocode(transport["arrival_location"]).subscribe(data => {
                    // console.log(data["items"][0]["position"].lat)
                    destination = data["items"][0]["position"];
                    var origin;
                    this.geocodeService.geocode(transport["departure_location"]).subscribe(data => {
                        origin = data["items"][0]["position"];
                        var routingParameters = {
                            'routingMode': 'fast',
                            'transportMode': 'truck',
                            // The start point of the route:
                            'origin': origin["lat"] + "," + origin["lng"],
                            // The end point of the route:
                            'destination': destination["lat"] + "," + destination["lng"],
                            // Include the route shape in the response
                            'return': 'polyline,travelSummary'
                        };
                        var onResult = function (result) {
                            // ensure that at least one route was found
                            if (result.routes.length) {
                                let duration = 0,
                                    distance = 0;
                                var pointsArray = []
                                result.routes[0].sections.forEach((section) => {
                                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
                                    pointsArray = pointsArray.concat(linestring.getLatLngAltArray())
                                    distance += section.travelSummary.length;
                                    duration += section.travelSummary.duration;
                                });

                                var today = new Date();
                                var departure = transport["departure_time"]
                                var elapsedTime = (today.getTime() - departure) / 1000;
                                var percentageCompleted = elapsedTime * 100 / duration
                                var pointToShow = parseInt(String(percentageCompleted * pointsArray.length / 300));
                                // console.log(pointToShow)
                                if (pointToShow > 0 && pointToShow < pointsArray.length / 3) {
                                    point.setGeometry({
                                        lat: pointsArray[pointToShow * 3],
                                        lng: pointsArray[pointToShow * 3 + 1]
                                    })
                                    // point.routeData="drum berlin zytomyr"
                                    // point.addEventListener('tap', ArcgisMapComponent.logEvent);

                                    result.routes[0].sections.forEach((section) => {
                                        let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                                        let routeLine = new H.map.Polyline(linestring, {
                                            style: {strokeColor: 'blue', lineWidth: 3}
                                        });
                                        var routeOutline = new H.map.Polyline(linestring, {
                                            style: {
                                                lineWidth: 10,
                                                strokeColor: 'rgba(0, 128, 255, 0.7)',
                                                lineTailCap: 'arrow-tail',
                                                lineHeadCap: 'arrow-head'
                                            }
                                        });
                                        // Create a patterned polyline:
                                        var routeArrows = new H.map.Polyline(linestring, {
                                                style: {
                                                    lineWidth: 10,
                                                    fillColor: 'white',
                                                    strokeColor: 'rgba(255, 255, 255, 1)',
                                                    lineDash: [0, 2],
                                                    lineTailCap: 'arrow-tail',
                                                    lineHeadCap: 'arrow-head'
                                                }
                                            }
                                        );
                                        // create a group that represents the route line and contains
                                        // outline and the pattern
                                        // var routeLine = new H.map.Group();
                                        map.addObjects([routeOutline, routeArrows]);
                                        routeLine.routeData = transport["departure_location"] + '-' + transport["arrival_location"]
                                        routeLine.addEventListener('tap', ArcgisMapComponent.logEvent);
                                        point.routeData = transport["departure_location"] + '-' + transport["arrival_location"]
                                        point.addEventListener('tap', ArcgisMapComponent.logEvent)
                                        // Create a marker for the start point:
                                        let startMarker = new H.map.Marker(section.departure.place.location);

                                        // Create a marker for the end point:
                                        let endMarker = new H.map.Marker(section.arrival.place.location);

                                        // Add the route polyline and the two markers to the map:
                                        map.addObjects([routeLine, startMarker, endMarker]);

                                        // Set the map's viewport to make the whole route visible:
                                        map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
                                        startMarker.routeData = transport["departure_location"] + '-' + transport["arrival_location"]
                                        endMarker.routeData = transport["departure_location"] + '-' + transport["arrival_location"]
                                        startMarker.addEventListener('tap', ArcgisMapComponent.logEvent)
                                        endMarker.addEventListener('tap', ArcgisMapComponent.logEvent)

                                    });
                                }

                            }
                        };

                        var router = this.platform.getRoutingService(null, 8);
// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
                        router.calculateRoute(routingParameters, onResult,
                            function (error) {
                                alert(error.message);
                            });
                    })

                })
            })


        })

    }
}

