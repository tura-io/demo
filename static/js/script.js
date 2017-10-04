//The accessToken below is a publicly provided one and doesn't need to be hidden.
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc2VtcmljaCIsImEiOiJjajg2N3J6NnowczB4MndwbHQ5b3UwMnBrIn0.PWVhuPintFtBY8i9TqTW8w';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v9',
center: [-122.6774833, 45.5206428],
interactive: false,
zoom: 15
});
map.on('load', function() {
  getRoute();
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
