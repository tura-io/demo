$(function () { //on docu load

  mapboxgl.accessToken = accessToken;
  let map;  //init map var

  //=================================================DRAWING ROUTES
  let route;

  $.ajax({
    url: 'db/routes',
    dataType: 'json'
  }).done(function(response) {
      route = response
      console.log(response);
  });
//=========================================================
  $.ajax({
    url: 'db/read',
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
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-122.674793, 45.518233],
      // interactive: false,
      zoom: 13.5
    });
    map.locations = locList;
    console.log(map.locations);
  })
  .then(function() {
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
//================================================================ANIMATION
        var radius = 0.001
        function pointOnCircle(angle) {
            return {
                "type": "Point",
                "coordinates": [
                    Math.cos(angle) * radius + -122.673081,
                    Math.sin(angle) * radius + 45.522668
                ]
            };
        };
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
            map.getSource('point').setData(pointOnCircle(timestamp / 1000));
            requestAnimationFrame(animateMarker);
        }
        animateMarker(0);
//============================================================================
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': route
              }
            }
          },
          'paint': {
            'line-width': 2
          }
        });
      });
  });
});
