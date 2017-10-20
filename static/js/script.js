$(function () {
  mapboxgl.accessToken = accessToken;

  let map = new MapBox({container: 'map',
                        style: 'mapbox://styles/mapbox/light-v9',
                        center: [-122.674793, 45.518233],
                        // interactive: false,
                        zoom: 13.5});

  map.setRoutesHelper();
  map.driverPool();

  map.on('load', function() {

    map.initialize();

  });
});
