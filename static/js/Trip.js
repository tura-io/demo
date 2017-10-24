let id = 0
let locationTempArr = [];
let locationStreamArr = [];

class Trip {

  constructor(driver) {
    this.Id = id;
    id++;
    this.Map = {};
    this.Driver = driver;
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

  setupLocationArr() {
    if(locationTempArr.length == 1001) {
      locationStreamArr = locationTempArr.splice(0, locationTempArr.length);
      locationTempArr = [];
    };
    if(locationStreamArr.length == 1001) {
      let data = JSON.stringify(locationStreamArr);
      locationStreamArr = [];
      this.sendDataAjax(data);
    };
  }

  sendDataAjax(data) {
    $.ajax({
      url: 'stream/collect',
      type: 'POST',
      data: data,
      dataType: 'json'
    }).then(function(res) {
        console.log(res);
    });
  }

  addRoute() {
  //Designates a random route. TODO: remove this and add params to power this choice.
    var rand = Math.floor(Math.random() * (this.Map.routes.length));
    this.Route = this.Map.routes[rand];
    this.Driver.location = this.Route.originCoords;
  }

///////////////////////////////////////////////////////////////////////////// DATA EMISSION
  emitNoisy(failPercent, minorAbbPercent, majorAbbPercent) {
    let src = this.Map.getSource(`point-${this.Id}`);
    let loc = src._options.data.features[0].geometry.coordinates;
    //Add noise to location.
    //NOTE: 1 block ~ .001 lat/lng. Also, lat/lng numbers have 14 decimal places.
    if (Math.random() * 101 < minorAbbPercent) {
      loc = loc.map(e => {
        let abb = (Math.random() * .001).toPrecision(11);
        if (Math.floor(Math.random() * 2) == 0) {
          e += abb;
        } else {
          e -= abb;
        }
      });
    }

    //Major abberations are the same as minor ones, but an order of magnitude larger.
    if (Math.random() * 101 < majorAbbPercent) {
      loc = loc.map(e => {
        let abb = (Math.random() * .01).toPrecision(12);
        if (Math.floor(Math.random() * 2) == 0) {
          e += abb;
        } else {
          e -= abb;
        }
      });
    }

///////////////////////////////////////////////////////////////////////////////
    //Package up to object to be sent to aggregation systems. //NOTE: add TIMESTAMP prop is needed
    let objectToEmit = {
      'id': this.Id,
      'location': loc
    };
///////////////////////////////////////////////////////////////////////////////

    //Emit data if we didn't roll fail-to-emit
    if (Math.random() * 101 > failPercent) {
      if(locationTempArr.length <= 1001) {
        locationTempArr.push(objectToEmit);
      };
      // console.log('Data sent.');
    } else {
      // console.log('Data failed to send!');
    }

    this.setupLocationArr();
  }

/////////////////////////////////////////////////////////////// ANIMATION
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
    for(let i = 0; i < this.Map.drivers.length; i++) {
      if(this.Map.drivers[i].location == undefined) {
        this.Map.drivers[i].location = this.Route.originCoords;
      };
    };

    let dest = {
      'type': 'FeatureCollection',
      'features': [{
          'type': 'Feature',
          'geometry': {
              'type': 'Point',
              'coordinates': this.Route.destCoords
          }
      }]
    };
    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
    var tweens = [];

    var numberOfFrames = 0;
    //NOTE: One possible optimization route is decreasing the resolution of the animations. I've made that easily controllable from within source by adding the variable below:
    var resolution = 40;
    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < resolution * lineDistance; i++) {
        var segment = turf.along(route.features[0], i / resolution, 'kilometers');
        tweens.push(segment.geometry.coordinates);
        numberOfFrames ++;
    }
    // console.log(`Frames in route: ${numberOfFrames}`);

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

    this.Map.addSource(`dest-${this.Id}`, {
        'type': 'geojson',
        'data': dest
    });

    this.Map.addLayer({
      'id': `trip-route-${this.Id}`, //NOTE: This should eventually hold a reference to some  identifier for the trip. Probably include an ID in the class?
      'source': `route-${this.Id}`,
      'type': 'line',
      'paint': {
        'line-width': 4,
        'line-color': this.Color,
        'line-opacity': .4
      }
    });

    this.Map.addLayer({
        'id': `trip-point-${this.Id}`,
        'source': `point-${this.Id}`,
        'type': 'symbol',
        'layout': {
            'icon-image': 'marker-11',
            'icon-offset': [0, -6]
        },
        'paint': {
          //NOTE: This should control the color of the icon, but currently doesn't. It requires an 'sdf icon' to work, which I thought we were using. But maybe I'm wrong.
            'icon-color': this.Color
        }
    });

    this.Map.addLayer({
      'id': `trip-dest-${this.Id}`,
      'source': `dest-${this.Id}`,
      'type': 'symbol',
      'layout': {
          'icon-image': 'marker-15',
          'icon-offset': [0, 0]
      },
      'paint': {
          'icon-color': this.Color,
      }
    });

    let myThis = this;
    function animate() {
        //Shorten route geometry
        if (route.features[0].geometry.coordinates.length > 1) {
          route.features[0].geometry.coordinates.splice(0, 1);
        }
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[0];
        myThis.Driver.location = route.features[0].geometry.coordinates[0];

        // Update the route source with the new data.
        myThis.Map.getSource(`route-${myThis.Id}`).setData(route);
        // Update the source with this new data.
        myThis.Map.getSource(`point-${myThis.Id}`).setData(point);
        //TEMP: In final code, this call this emit data to a Kafka
        myThis.emitNoisy(1, 5, 1);
        // Request the next frame of animation so long as destination has not
        // been reached.
        if (point.features[0].geometry.coordinates[0]
            !==
            route.features[0].geometry.coordinates[route.features[0].geometry.coordinates.length - 1][0]) {
          setTimeout(function() {
            requestAnimationFrame(animate);
          }, myThis.Speed);
        } else {
          myThis.complete();
        }
    }

    // Start the animation.
    animate();
  }

  complete() {
    // remove trip from those listed on the map
    this.Map.trips.splice(
      this.Map.trips.indexOf(e => e.Id === this.Id), 1);
      this.Driver.isHired = false;
    // remove point and route layers from the map
    this.Map.removeLayer(`trip-route-${this.Id}`);
    this.Map.removeLayer(`trip-point-${this.Id}`);
    this.Map.removeLayer(`trip-dest-${this.Id}`);
    // remove sources from the map
    this.Map.removeSource(`route-${this.Id}`);
    this.Map.removeSource(`point-${this.Id}`);
    this.Map.removeSource(`dest-${this.Id}`);
  }
}
