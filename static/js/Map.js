class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
  }

  setLocations() {  //REVISE
    let loc = [];
    $.ajax({
      url: 'db/read',
      dataType: 'json'
    }).then(function(locs) {
        for (let i = 0; i < locs.length; i++) {
          let location = new Point(locs[i][0], locs[i][1], locs[i][2]);
          loc.push(location);
        };
    });
    this.locations = loc;
    console.log(this.locations);
  }

  randomLocation() {
    let loc = this.locations[Math.floor(Math.random() * this.locations.length)];
    return loc;
  }
//========================================================ANIMATION
  // animateTest() {
  //   function pointOnCircle(angle) {
  //     var radius = 0.001
  //     return {
  //         "type": "Point",
  //         "coordinates": [
  //             Math.cos(angle) * radius + -122.673081,
  //             Math.sin(angle) * radius + 45.522668
  //         ]
  //     };
  //   }
  //   this.addSource('point', {
  //       "type": "geojson",
  //       "data": pointOnCircle(0)
  //   });
  //   this.addLayer({
  //       "id": "point",
  //       "source": "point",
  //       "type": "circle",
  //       "paint": {
  //           "circle-radius": 10,
  //           "circle-color": "#007cbf"
  //       }
  //   });
  //   function animateMarker(timestamp) {
  //     mapboxgl.Map.getSource('point').setData(pointOnCircle(timestamp / 1000));
  //     requestAnimationFrame(animateMarker);
  //   }
  //   animateMarker(0);
  // }
//==============================================================


}
