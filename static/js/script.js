// The script.js file is a single immediately invoked JavaScript function that loads
// an instance of the Map class from Map.js with route data and a list of drivers. Map.js
// defines the MapBox map, while script.js actually creates it.

let map;

$(function () {
  mapboxgl.accessToken = accessToken;

  map = new MapBox({container: 'map',
                        style: 'mapbox://styles/mapbox/light-v9',
                        center: [-122.674793, 45.516233],
                        // interactive: false,
                        zoom: 13.5});

  // map.setLocations(); //set and render location points, currently not used
  map.setRoutesHelper();  //AJAX call for route data
  map.initDriverPool();   //create driver instance list

  map.on('load', function() {

    map.initialize();

  });
});
