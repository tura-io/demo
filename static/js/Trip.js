let id = 0 //global counter for trips
let locationTempArr = []; //temp storage for data before streams
let locationStreamArr = []; //copied from temp storage once length hits 10k and streamed out
let sensorFailureCount = 0; //total amount of sensor failures (data null)

class Trip {

  constructor(driver) {
    this.Id = id;
    id++;
    this.Map = {};
    this.Driver = driver;
    this.Route = {};
    this.arrayLimiter = 10001; //NOTE: size of packets sent to server
    //This controls the rate at which the car moves by controlling animation refresh rate. 75ms default refresh speed moves the car in approximate realtime at 30mph. The current default, 0, allows the map to animate as quickly as it's able.
    this.Speed = 100;
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
    // when tempArr hits array limiter, it copies over data to streamArr then clears out tempArr for more data
    if(locationTempArr.length == this.arrayLimiter) {
      locationStreamArr = locationTempArr.splice(0, locationTempArr.length);
      locationTempArr = [];
    };
    // when streamArr is copied from tempArr, send data to AJAX and clear out streamArr
    if(locationStreamArr.length == this.arrayLimiter) {
      let data = JSON.stringify(locationStreamArr);
      locationStreamArr = [];
      // this.sendDataAjax(data);
      console.log('Sensor Failures: ' + sensorFailureCount);
      sensorFailureCount = 0;
    };
  }

  sendDataAjax(data) { //sends a packet of geo-codes to server to be streamed
    $.ajax({
      url: 'stream/collect',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: console.log('data sent')
    });
  }

  addRoute() {
    var rand = Math.floor(Math.random() * (this.Map.routes.length));
    this.Route = this.Map.routes[rand];
    this.Driver.location = this.Route.originCoords;
  }

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

    //Package up to object to be sent to aggregation systems.
    let objectToEmit = {
      'id': this.Id,
      'location': loc,
      'timestamp': null,
      'driver-id': this.Driver.name
    };

    let tk = new Date();
    objectToEmit.timestamp = tk.getTime();
    //Push data to array if we didn't roll fail-to-emit
    if (Math.random() * 101 > failPercent) {
      if(locationTempArr.length <= this.arrayLimiter) {
        locationTempArr.push(objectToEmit);
      };
    } else {
      sensorFailureCount++;
    }

    this.setupLocationArr(); //check if array is full every cycle | NOTE: this line (and the import of kafka.py) enables streaming
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
      'id': `trip-route-${this.Id}`,
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
            'icon-image': 'rocket-11',
            'icon-offset': [0, -6]
        },
        'paint': {
          //NOTE: This should control the color of the icon, but currently doesn't. It requires an 'sdf icon' to work.
            'icon-color': this.Color
        }
    });

    this.Map.addLayer({
      'id': `trip-dest-${this.Id}`,
      'source': `dest-${this.Id}`,
      'type': 'symbol',
      'layout': {
          'icon-image': 'alcohol-shop-15',
          'icon-offset': [0, 0]
      },
      'paint': {
          'icon-color': this.Color,
      }
    });

    let myThis = this;
    function animate() {
        //Shorten route geometry and Route speed vector
        if (route.features[0].geometry.coordinates.length > 1) {
          route.features[0].geometry.coordinates.splice(0, 1);
          myThis.Route.speedVector.splice(0, 1);
        }
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[0];
        myThis.Driver.location = route.features[0].geometry.coordinates[0];
        myThis.Speed = myThis.Route.speedVector[0];

        if (myThis.Speed >= 401) {
            myThis.Color = '#40e0d0'
        } else if (myThis.Speed >= 301) {
            myThis.Color = '#8EB55D'
        } else if (myThis.Speed >= 201) {
            myThis.Color = '#ff8c00'
        } else if (myThis.Speed >= 101) {
            myThis.Color = '#FF5230'
        } else {
            myThis.Color = '#ff0080'
        }

        // Update the route source with the new data.
        myThis.Map.getSource(`route-${myThis.Id}`).setData(route);
        myThis.Map.setPaintProperty(`trip-route-${myThis.Id}`, 'line-color', myThis.Color);
        // Update the source with this new data.
        myThis.Map.getSource(`point-${myThis.Id}`).setData(point);
        //console.log(myThis.Speed);
        //console.log(myThis.Driver.location);

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
