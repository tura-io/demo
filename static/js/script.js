let map;

$(function () {
  mapboxgl.accessToken = accessToken;

  map = new MapBox({container: 'map',
                        style: 'mapbox://styles/mapbox/light-v9',
                        center: [-122.674793, 45.516233],
                        interactive: false,
                        zoom: 13.5});
  //TEMP: The next six lines seem like they should generate async errors, but currently usually don't.
  // map.setLocations();
  map.setRoutesHelper();
  map.initDriverPool();
  console.log(map.drivers);

  map.on('load', function() {

    map.initialize();

  });
});
