# Route - All About the Journey

The `setRoutes` function on the Map object initializes new Route objects for each
route json in the response object from the database. The arguments for initializing
a Route all come from the json on the response object.

The Route class is initialized with the following arguments from the route request:

  - origin
  - dest
  - oCoords
  - dCoords
  - duration
  - distance
  - routeVectors

Those arguments become the value for the following properties:

  - this.origin = origin;
  - this.destination = dest;
  - this.originCoords = oCoords;
  - this.destCoords = dCoords;
  - this.duration = duration;
  - this.distance = distance;
  - this.coords = routeVectors.map(x => [x[0], x[1]]);
  - this.speedVector = routeVectors.map(x => x[2]);

The Route class has no functions.
