class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
    this.routes = [];
    this.trips = [];
    this.drivers = [];
    this.c = 0;

    this.maxTrips = 1; //TODO: Make sure this works with Driver->Rider Trips the way we want.
    this.tripSpawnInterval = 500; //ms
    this.intervalId = 0;
    this.initialDrivers = 1;
    this.driverFirstNames = ['Parham', 'Justine', 'David', 'Molly', 'Cedar', 'Jack', 'Rachel', 'Adrian', 'Cheryl', 'Ricky'];
    this.driverLastNames = ['Parvizi', 'Wang', 'Nielsen', 'LeCompte', 'Mora', 'Emrich', 'Agnic', 'Smith', 'Wilson', 'Bobby'];
    this.eventDisplay = false;
    this.allNames = ['Parham', 'Molly', 'David', 'Justine', 'Adrian', 'Kody', 'Lucy', 'Allison', 'Ricky', 'Lucky'];
    this.tempNames = [];
  }

  initialize() {
    if (this.intervalId !== 0) {
      console.log(`Stopping: ${this.intervalId}`);
      clearInterval(this.intervalId);
    }
    let myThis = this;
    this.intervalId = setInterval(function() {
      myThis.addTrip();
    }, this.tripSpawnInterval);
  }

  initDriverPool() {
    this.tempNames = this.allNames.map(x => x);
    for (let i = 0; i < this.initialDrivers; i++) {
      let newDriver = new Driver();
      // newDriver.name = `${this.driverFirstNames[Math.floor(Math.random() * this.driverFirstNames.length)]} ${this.driverLastNames[Math.floor(Math.random() * this.driverLastNames.length)]}`;
      newDriver.name = this.tempNames[0];
      this.tempNames.splice(0, 1);
      newDriver.initClient();
      this.drivers.push(newDriver);
    };
  }

  addDriver() {
    //NOTE: This is a dummy method designed to be called by the Driver Population controls
    console.log('+1 driver...');
    let newDriver = new Driver();
    newDriver.initClient();
    this.drivers.push(newDriver);
    //TODO: Add this Driver to the map as a Symbol layer
  }

  removeDriver() {
    console.log('-1 driver...');
    this.drivers.splice(Math.floor(Math.random() * this.drivers.length), 1);
    //TODO: Remove driver's associated Symbol layer from the map.
  }

  toggleEvent(attribute) {
    //""" toggleEvent method to toggle any event boolean attribute """
    //""" Will be called by a click event handler in interface.js """
    // toggle eventDisplay true or false when its checkbox is clicked
     console.log('toggling event');
     // this.eventDisplay = !this.eventDisplay;
     map.trips.forEach(function(trip, idx) {
       console.log('trip', trip);
       console.log('attribute', attribute);
       trip.attribute = !trip.attribute;
       console.log('attribute', attribute);
     });
  }

  addTrip() {
    if (this.trips.length < this.maxTrips) {
      let newTrip = new Trip(this.drivers[this.c]);
      this.drivers[this.c].isHired = true;
      if(this.c < (this.initialDrivers - 1)) {
        this.c++;
      }else {
        this.c = 0;
      };
      newTrip.Map = this;
      // The Trigger attribute is defaulted to false for a Trip, but we want to
      // set it in response to whether the event checkbox is true or false.
      newTrip.Trigger = this.eventDisplay;
      newTrip.addRoute();
      this.trips.push(newTrip);
      newTrip.animateRoute();
      //TEMP: This should not be here, once we have actual drivers implemented.
      $('#driver-pop').text(map.trips.length);
    }
  }

  routeCall() {
    return $.ajax({
      url: 'db/routes',
      dataType: 'json',
      type: 'GET'
    });
  }
  setRoutes() { //use AJAX route response to initialize as Route object and store in array
    let thus = this;
    this.routeCall().then(function(response) {
      for (let i = 0; i < response.length; i++) {
        let newRoute = new Route(response[i][0], response[i][1], JSON.parse(response[i][2]), JSON.parse(response[i][3]), response[i][4], response[i][5], JSON.parse(response[i][6]));
        thus.routes.push(newRoute);
      };
    });
  }
  async setRoutesHelper() { //async helper
    await this.setRoutes();
  }

  async setLocations() {   //method for initializing locations as Points and storing them in Map object, currently not used
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
