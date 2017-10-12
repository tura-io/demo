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
    this.Route = this.Map.routes[rand];
    console.log(this.Route);
  }

  animateRoute() {
    console.log("works");
  }

  isTripComplete() {
    console.log("works");
  }
}
