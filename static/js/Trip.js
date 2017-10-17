let id = 0

class Trip {

  constructor(thisRider, thisDriver) {
    this.Id = id;
    id++;
    this.Map = {};
    this.Rider = thisRider;
    this.Driver = thisDriver;
    this.Route = {};
    //This controls the rate at which the car moves by controlling animation refresh rate. 75ms default refresh speed moves the car in approximate realtime at 30mph. The current default, 0, allows the map to animate as quickly as it's able.
    this.Speed = 0;
    this.Color = (function() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }());
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

    var numberOfFrames = 0;
    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < 1000 * lineDistance; i++) {
        var segment = turf.along(route.features[0], i * .001, 'kilometers');
        tweens.push(segment.geometry.coordinates);
        numberOfFrames ++;
    }
    console.log(`Frames in route: ${numberOfFrames}`);

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = tweens;

    this.Map.addSource(`route-${this.Id}`, {
        'type': 'geojson',
        'data': route
    });

    this.Map.addSource(`point-${this.Id}`, {
        'type': 'geojson',
        'data': point
    });

    this.Map.addLayer({
      'id': `trip-route-${this.Id}`, //NOTE: This should eventually hold a reference to some  identifier for the trip. Probably include an ID in the class?
      'source': `route-${this.Id}`,
      'type': 'line',
      'paint': {
        'line-width': 4,
        'line-color': this.Color
      }
    });

    this.Map.addLayer({
        'id': `trip-point-${this.Id}`,
        'source': `point-${this.Id}`,
        'type': 'symbol',
        'layout': {
            'icon-image': 'marker-15',
            'icon-offset': [0, -6]
        },
        'paint': {
          //NOTE: This should control the color of the icon, but currently doesn't. It requires an 'sdf icon' to work, which I thought we were using. But maybe I'm wrong.
            'icon-color': this.Color,
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
        myThis.Map.getSource(`route-${myThis.Id}`).setData(route);
        // Update the source with this new data.
        myThis.Map.getSource(`point-${myThis.Id}`).setData(point);

        // Request the next frame of animation so long as destination has not
        // been reached.
        if (point.features[0].geometry.coordinates[0] !== myThis.Route.destCoords[0]) {
          setTimeout(function() {
            requestAnimationFrame(animate);
          }, myThis.Speed);
        }
    }

    // Start the animation.
    animate();
  }

  isTripComplete() {
    console.log('works');
  }
}
