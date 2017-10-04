
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
    });
  });
});
