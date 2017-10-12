class Route {

  constructor(origin, dest, oCoords, dCoords, duration, distance, routeCoords) {
    this.origin = origin;
    this.destination = dest;
    this.originCoords = oCoords;
    this.destCoords = dCoords;
    this.duration = duration;
    this.distance = distance;
    this.coords = routeCoords;
  }

  classMethodTest() {
    console.log("route works");
  }
}
