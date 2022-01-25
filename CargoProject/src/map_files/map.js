var config = {
    apiKey: "AIzaSyA7luWGbMhIgXImE-ZnHWwWljs35kK6GRg",
    authDomain: "cargo-management-4e50a.firebaseapp.com",
    projectId: "cargo-management-4e50a",
    storageBucket: "cargo-management-4e50a.appspot.com",
    messagingSenderId: "1097151939401",
    appId: "1:1097151939401:web:9a6e54511306e455825098",
    measurementId: "G-BG7G8D3TDQ",
    databaseURL: "https://cargo-management-4e50a-default-rtdb.europe-west1.firebasedatabase.app/"
};

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",

    "esri/Graphic",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet"

], function (esriConfig, Map, MapView,GraphicsLayer, Graphic, route, RouteParameters, FeatureSet) {
    const routeParams = new RouteParameters({
        // An authorization string used to access the routing service
        apiKey: "AAPK4cb5ec502d454db49d8bd97b36fb6b91DvZ9a-RGRK_JZ3dNW7I7gjEZqhX1rTCnLuaWBRWYAGUUdwxNq1ygpC1iRoQdDvXY",
        stops: new FeatureSet(),
        outSpatialReference: {
          // autocasts as new SpatialReference()
          wkid: 3857
        }
      });
    esriConfig.apiKey = "AAPK4cb5ec502d454db49d8bd97b36fb6b91DvZ9a-RGRK_JZ3dNW7I7gjEZqhX1rTCnLuaWBRWYAGUUdwxNq1ygpC1iRoQdDvXY";

    const routeLayer = new GraphicsLayer();
    const map = new Map({
        basemap: "arcgis-navigation", //Basemap layer service
        layers: [routeLayer]
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [25.4194, 45.7749], //Longitude, latitude
        zoom: 6
    });

    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
    firebase.initializeApp(config);
    var database = firebase.database();
    const dbRef = firebase.database().ref();
    var currentUser;

    var getUser = new Promise (function(resolve, reject) {
        dbRef.child("user").get().then((snapshot) => {
        if (snapshot.exists()) {            
                currentUser = snapshot.val().currentUser;
                resolve();
        } else {
            console.log("No data available");
            reject();
        }
    }).catch((error) => {
        console.error(error);
    })});
    getUser.then(function(){
        console.log(currentUser);
        dbRef.child(currentUser).get().then((snapshot)=>{
            if (snapshot.exists()) {      
                snapshot.forEach(function(routeCoordinates){
                    console.log(routeCoordinates.val()[0])
                    const point1 = {
                        type: "point",
                        longitude : routeCoordinates.val()[1],
                        latitude :  routeCoordinates.val()[0]
                     };
                     const point2 = {
                        type: "point",
                        longitude : routeCoordinates.val()[3],
                        latitude :  routeCoordinates.val()[2]
                     };
                     addGraphic("origin", point1);
                     addGraphic("destination", point2);
                     getRoute(routeCoordinates.val()[0]);
                     view.graphics.removeAll()
                })
      
                
        } else {
            console.log("No data available");
        }
        });
    
    });

    function addGraphic(type, point) {
        const graphic = new Graphic({
            symbol: {
                type: "simple-marker",
                color: (type === "origin") ? "white" : "black",
                size: "8px"
            },
            geometry: point
        });
        view.graphics.add(graphic);
    }

    function getRoute(colour) {
        const routeParams = new RouteParameters({
            stops: new FeatureSet({
                features: view.graphics.toArray()
            }),

            returnDirections: true

        });

        route.solve(routeUrl, routeParams)
            .then(function (data) {
                data.routeResults.forEach(function (result) {
                    result.route.symbol = {
                        type: "simple-line",
                        color: [5, 150, 255],
                        width: 3
                    };
                    view.graphics.add(result.route);
                });

            })

            .catch(function (error) {
                console.log(error);
            })

    }

});