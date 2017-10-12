class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
    this.routes = [];
    this.trips = [];
  }

  addTrip() {
    let newTrip = new Trip('rider_placeholder','driver_placeholder','type_placeholder');
    newTrip.Map = this;
    newTrip.addRoute();
    this.trips.push(newTrip);
    this.addLayer({
      'id': 'tripRoute', //NOTE: This should eventually hold a reference to some unique identifier for the trip. Probably include an ID in the class?
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': newTrip.Route.coords
          }
        }
      },
      'paint': {
        'line-width': 2
      }
    });
  }

  async setLocations() {  //TODO: still has asnyc issues, revise
    let result = await $.ajax({
      url: 'db/read',
      dataType: 'json'
    });
    for (let i = 0; i < result.length; i++) {
      let location = new Point(result[i][0], result[i][1], result[i][2]);
      this.locations.push(location);
    };
  }

  async setRoutes() {
    let response = await $.ajax({
      url: 'db/routes',
      dataType: 'json'
    });
    for (let i = 0; i < response.length; i++) {
      let newRoute = new Route(response[i][0], response[i][1], JSON.parse(response[i][2]), JSON.parse(response[i][3]), response[i][4], response[i][5], JSON.parse(response[i][6]));
      this.routes.push(newRoute);
    };
  }

}
