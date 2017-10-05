$(function () { //on docu load

  // TODO: store accessToken in hidden file
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc2VtcmljaCIsImEiOiJjajg2N3J6NnowczB4MndwbHQ5b3UwMnBrIn0.PWVhuPintFtBY8i9TqTW8w';
  let map;  //init map var

  //=================================================DRAWING ROUTES
  let route;
  let start = [-122.67546, 45.502647];
  let end = [-122.67027, 45.523056];
  let directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;

  $.ajax({
    url: directionsRequest,
    method: 'GET'
  }).done(function(data) {
      route = data.routes[0].geometry;
  });
//=========================================================

  $.ajax({
    url: 'db/read', //collect DB data
    dataType: 'json'
  }).done(function(data) {
    let locList = [];

    for (i = 0; i < data.length; i++) {
      let newLoc = new Point(data[i][0], data[i][1], data[i][2]); //init data as objects

      // TODO: add locList to Map object
      locList.push(newLoc); //store locally
    };


    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-122.6774833, 45.5206428],
      interactive: false,
      zoom: 15
    });
    map.locations = locList;  //load map with locations
    console.log(map.locations);

  }).then(function() {
      map.on('load', function() {
        map.addLayer({  //add layer w/ location points
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
      });
  });
});
