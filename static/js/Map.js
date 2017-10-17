class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
    this.routes = [];
    this.trips = [];

    this.maxTrips = 3; //NOTE: Make sure this works with Driver->Rider Trips the way we want.
    this.tripSpawnInterval = 1000; //ms
    this.intervalId = 0;
  }

  initialize() {
    let myThis = this;
    //NOTE: This looks like an unnecessarily verbose way to set up the interval, but it solves a this-scoping issue which arises otherwise.
    this.intervalId = setInterval(function() {
      myThis.addTrip();
    }, this.tripSpawnInterval);
  }

  reinitialize() {
    console.log(`Stopping: ${this.intervalId}`);
    clearInterval(this.intervalId);
  }

  addTrip() {
    if (this.trips.length < this.maxTrips) {
      console.log(`Current trips: ${this.trips.length}. Adding one.`);
      let newTrip = new Trip('rider_placeholder','driver_placeholder','type_placeholder');
      newTrip.Map = this;
      newTrip.addRoute();
      this.trips.push(newTrip);http://desalasworks.com/article/javascript-performance-techniques/

      // TEMP: Probably make this next call from elsewhere?
      newTrip.animateRoute();
    }
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

  async setRoutes() { //TODO: async http://desalasworks.com/article/javascript-performance-techniques/issue, revise
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
