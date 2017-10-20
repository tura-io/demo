class MapBox extends mapboxgl.Map {
///////////////////////////////////////////////////////////// CONSTRUCT
  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
    this.routes = [];
    this.trips = [];
    this.drivers = [];
    this.c = 0;

    this.maxTrips = 10; //NOTE: Make sure this works with Driver->Rider Trips the way we want.
    this.tripSpawnInterval = 500; //ms
    this.intervalId = 0;
    this.amountOfDrivers = 10;
  }

//////////////////////////////////////////////////////////// TRIP INIT
  initialize() {
    let myThis = this;
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
      // console.log(`Current trips: ${this.trips.length}. Adding one.`);
      let newTrip = new Trip(this.drivers[this.c]);
      if(this.c < (this.amountOfDrivers - 1)) {
        this.c++;
      }else {
        this.c = 0;
      };
      newTrip.Map = this;
      newTrip.addRoute();
      this.trips.push(newTrip);

      // TEMP: Probably make this next call from elsewhere?
      newTrip.animateRoute();
    }
  }

  driverPool() {
    let names = ['Parham', 'Justine', 'David', 'Molly', 'Cedar', 'Jack', 'Rachel', 'Bob', 'Cheryl', 'Ricky'];
    for (let i = 0; i < this.amountOfDrivers; i++) {
      let newDriver = new Driver();
      if(this.amountOfDrivers <= names.length) {
        newDriver.name = names[i];
      };
      this.drivers.push(newDriver);
    };
  }

//////////////////////////////////////////////////////////// API / AJAX
  routeCall() {
    return $.ajax({
      url: 'db/routes',
      dataType: 'json',
      type: 'GET'
    });
  }
  setRoutes() {
    let thus = this;
    this.routeCall().then(function(response) {
      for (let i = 0; i < response.length; i++) {
        let newRoute = new Route(response[i][0], response[i][1], JSON.parse(response[i][2]), JSON.parse(response[i][3]), response[i][4], response[i][5], JSON.parse(response[i][6]));
        thus.routes.push(newRoute);
      };
    });
  }
  async setRoutesHelper() {
    await this.setRoutes();
  }
  async setLocations() {
    let result = await $.ajax({
      url: 'db/read',
      dataType: 'json'
    });
    for (let i = 0; i < result.length; i++) {
      let location = new Point(result[i][0], result[i][1], result[i][2]);
      this.locations.push(location);
    };
  }
}
