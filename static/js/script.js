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

  map.on('load', function() {
    map.addLayer({
      "id": "points",
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

    // A simple line from origin to destination.
    var route = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    map.origin,
                    map.destination
                ]
            }
        }]
    };
    console.log(route);
    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    var point = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": map.origin
            }
          }]
        };
      });


});
