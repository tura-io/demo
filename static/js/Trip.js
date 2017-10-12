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
  }

  animateRoute() {
    // A path line from origin to destination.
    var route = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': this.Route.coords
            }
        }]
    };
    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    var point = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': this.Route.originCoords
            }
        }]
    };
    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
    var tweens = [];

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance * 1000; i++) {
        var segment = turf.along(route.features[0], i / 1000 * lineDistance, 'kilometers');
        tweens.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = tweens;

    this.Map.addSource('route', {
        'type': 'geojson',
        'data': route
    });

    this.Map.addSource('point', {
        'type': 'geojson',
        'data': point
    });

    this.Map.addLayer({
      'id': 'tripRoute', //NOTE: This should eventually hold a reference to some unique identifier for the trip. Probably include an ID in the class?
      'source': 'route',
      'type': 'line',
      'paint': {
        'line-width': 2,
        'line-color': '#007cbf'
      }
    });

    this.Map.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
            'icon-image': 'marker-15'
        },
        'paint': {
          //NOTE: This should control the color of the icon, but currently doesn't. It requires an 'sdf icon' to work, which I thought we were using. But maybe I'm wrong.
            'icon-color': '#FFFFFF',
        }
    });

    let myThis = this;
    function animate() {
        //Shorten route geometry
        route.features[0].geometry.coordinates.splice(0, 1);
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[0];

        // Update the route source with the new data.
        myThis.Map.getSource('route').setData(route);
        // Update the source with this new data.
        myThis.Map.getSource('point').setData(point);

        // Request the next frame of animation so long as destination has not
        // been reached.
        if (point.features[0].geometry.coordinates[0] !== [-122.698555, 45.528652][0]) {
            requestAnimationFrame(animate);
        }
    }

    // Start the animation.
    animate();
  }

  isTripComplete() {
    console.log('works');
  }
}
