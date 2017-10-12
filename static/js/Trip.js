class Trip {

  constructor(thisRider, thisDriver, tripType) {
    this.Map = {};
    this.Rider = thisRider;
    this.Driver = thisDriver;
    this.Route = {};
    this.tripType = tripType;
  }


  addRoute() {
  //Designates a random route. TODO: remove this and add params to power this choice.
    var rand = Math.floor(Math.random() * (this.Map.routes.length));
    var route = this.Map.routes[rand][2];
  //Actually display a route.
    this.Map.addLayer({
      'id': 'tripRoute', //NOTE: This should eventually hold a reference to some unique identifier for the trip. Probably include an ID in the class?
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': route
          }
        }
      },
      'paint': {
        'line-width': 2
      }
    });
  }

  animateRoute() {
    console.log("works");
  }

  isTripComplete() {
    console.log("works");
  }
}
