class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
    this.routes = [];
    //TEMP: I don't think these should be here long term?
    this.origin = [];
    this.destination = [];
    this.currentRoute = [];
  }

  addRoute() {
  //Designates a random route. TODO: remove this and add params to power this choice.
    var rand = Math.floor(Math.random() * (this.routes.length));
    var route = this.routes[rand][2];
    this.origin = route[0];
    this.destination = route[route.length - 1];
  //Actually display a route.
    this.addLayer({
      'id': 'tripRoute',
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

  randomLocation() {
    let loc = this.locations[Math.floor(Math.random() * this.locations.length)];
    return loc;
  }

  setRoutes() {
    let routes = [];
    $.ajax({
      url: 'db/routes',
      dataType: 'json'
    }).then(function(response) {
        response.forEach(function(e) {
          //TODO: Make these into Route-class objects as above.
          routes.push([e[0], e[1], JSON.parse(e[2])]);
        });
    });
    this.routes = routes;
  }
}
