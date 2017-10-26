let map;

$(function () {
  mapboxgl.accessToken = accessToken;

  map = new MapBox({container: 'map',
                        style: 'mapbox://styles/mapbox/light-v9',
                        center: [-122.674793, 45.516233],
                        // interactive: false,
                        zoom: 13.5});

  // map.setLocations();
  map.setRoutesHelper();
  map.initDriverPool();

  map.on('load', function() {

    map.initialize();

  });
});
