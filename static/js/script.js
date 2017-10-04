$(function() {
  let map;
  $.ajax({
    url: '/db/read',
    dataType: 'json'
  }).done(function(result) {
    let locList = [];

    for (i = 0; i < result.length; i++) {
      let newLoc = new Point(result[i][0], result[i][1], result[i][2]);
      // TODO: Add locList to map object rather than leaving it global
      locList.push(newLoc);
    };
    //The accessToken below is a publicly provided one and doesn't need to be hidden.
    //TODO: Switch to our token and stash it in an appropriate way.
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc2VtcmljaCIsImEiOiJjajg2N3J6NnowczB4MndwbHQ5b3UwMnBrIn0.PWVhuPintFtBY8i9TqTW8w';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-122.6774833, 45.5206428],
      interactive: false,
      zoom: 15
    });
    map.locations = locList;
    console.log(map.locations);
  })
  .then(function() {
    map.on('load', function() {
      getRoute();
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

      //Animation Test Sandbox
      var radius = 0.001

      function pointOnCircle(angle) {
          return {
              "type": "Point",
              "coordinates": [
                  Math.cos(angle) * radius + -122.673081,
                  Math.sin(angle) * radius + 45.522668
              ]
          };
      }

      // Add a source and layer displaying a point which will be animated in a circle.
      map.addSource('point', {
          "type": "geojson",
          "data": pointOnCircle(0)
      });

      map.addLayer({
          "id": "point",
          "source": "point",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "#007cbf"
          }
      });

      function animateMarker(timestamp) {
          // Update the data to a new position based on the animation timestamp. The
          // divisor in the expression `timestamp / 1000` controls the animation speed.
          map.getSource('point').setData(pointOnCircle(timestamp / 1000));

          // Request the next frame of the animation.
          requestAnimationFrame(animateMarker);
      }

      // Start the animation.
      animateMarker(0);
    });

    // setTimeout(function() {
    //   console.log('Ping');
    //   map.removeLayer("points");
    // }, 3000);
  });
});

function getRoute() {
  var start = [-122.67546, 45.502647];
  var end = [-122.67027, 45.523056];
  var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
  $.ajax({
    method: 'GET',
    url: directionsRequest,
  }).done(function(data) {
    var route = data.routes[0].geometry;
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route
        }
      },
      paint: {
        'line-width': 2
      }
    });
    // this is where the code from the next step will go
  });
}
