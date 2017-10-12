$(function () {
  mapboxgl.accessToken = accessToken;

  let map = new MapBox({container: 'map', style: 'mapbox://styles/mapbox/light-v9', center: [-122.674793, 45.518233], zoom: 13.5});

  //TEMP: The next six lines seem like they should generate async errors, but currently usually don't.
  map.setLocations();
  console.log("Locations:");
  console.log(map.locations);

  map.setRoutes();
  console.log("Routes:");
  console.log(map.routes);

  // A simple line from origin to destination.
  var route = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": [
                  [-122.67546, 45.502647],
                  [-122.684637, 45.526302]
              ]
          }
      }]
  };
  // A single point that animates along the route.
  // Coordinates are initially set to origin.
  var point = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [-122.67546, 45.502647]
          }
      }]
  };

  // Calculate the distance in kilometers between route start/end point.
  var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
  console.log(lineDistance);
  var tweens = [];

  // Draw an arc between the `origin` & `destination` of the two points
  for (var i = 0; i < lineDistance * 1000; i++) {
      var segment = turf.along(route.features[0], i / 1000 * lineDistance, 'kilometers');
      tweens.push(segment.geometry.coordinates);
  }

  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = tweens;

  // Used to increment the value of the point measurement against the route.
  var counter = 0;

  map.on('load', function() {
    map.addLayer({
      "id": "location-list",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": map.locations
        }
      },
      "layout": {
        "icon-image": "{icon}-15",
        "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      }
    });

    map.addRoute();

    //NOTE: Anim stuff below:
    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('route', {
        "type": "geojson",
        "data": route
    });

    map.addSource('point', {
        "type": "geojson",
        "data": point
    });

    map.addLayer({
        "id": "route",
        "source": "route",
        "type": "line",
        "paint": {
            "line-width": 5,
            "line-color": "#007cbf"
        }
    });

    map.addLayer({
        "id": "point",
        "source": "point",
        "type": "symbol",
        "layout": {
            "icon-image": "airport-15",
            "icon-rotate": 90
        }
    });

    function animate() {
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

        // Update the source with this new data.
        map.getSource('point').setData(point);

        // Request the next frame of animation so long as destination has not
        // been reached.
        console.log(point.features[0].geometry.coordinates);
        if (point.features[0].geometry.coordinates[0] !== [-122.698555, 45.528652][0]) {
            requestAnimationFrame(animate);
        }

        counter = counter + 1;
    }

    // Start the animation.
    animate(counter);
  });


});
