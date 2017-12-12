class Route {

  constructor(origin, dest, oCoords, dCoords, duration, distance, routeVectors) {
    this.origin = origin;
    this.destination = dest;
    this.originCoords = oCoords;
    this.destCoords = dCoords;
    this.duration = duration;
    this.distance = distance;
    this.coords = routeVectors.map(x => [x[0], x[1]]);
    this.speedVector = routeVectors.map(x => x[2]);
  }
}
