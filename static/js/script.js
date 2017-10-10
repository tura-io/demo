$(function () {
  mapboxgl.accessToken = accessToken;

  let map = new MapBox({container: 'map', style: 'mapbox://styles/mapbox/light-v9', center: [-122.674793, 45.518233], zoom: 13.5});

  let route;

  $.ajax({
    url: 'db/routes',
    dataType: 'json'
  }).then(function(response) {
      route = JSON.parse(response);
      console.log(route);
  });

  //==================================================================POINTS
  map.setLocations();

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

  });
});
