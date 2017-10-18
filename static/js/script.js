$(function () {
  mapboxgl.accessToken = accessToken;

  let map = new MapBox({container: 'map',
                        style: 'mapbox://styles/mapbox/light-v9',
                        center: [-122.674793, 45.518233],
                        // interactive: false,
                        zoom: 13.5});

  //TEMP: The next six lines seem like they should generate async errors, but currently usually don't.
  // map.setLocations();
  map.setRoutesHelper();

  map.on('load', function() {
    // map.addLayer({
    //   "id": "location-list",
    //   "type": "symbol",
    //   "source": {
    //     "type": "geojson",
    //     "data": {
    //       "type": "FeatureCollection",
    //       "features": map.locations
    //     }
    //   },
    //   "layout": {
    //     "icon-image": "{icon}-15",
    //     "text-field": "{title}",
    //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    //     "text-offset": [0, 0.6],
    //     "text-anchor": "top"
    //   }
    // });

    map.initialize();
  });
});
