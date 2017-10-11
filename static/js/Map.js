class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
  }

  async setLocations() {  //REVISE
    let result = await $.ajax({
      url: 'db/read',
      dataType: 'json'
    });
    for (let i = 0; i < result.length; i++) {
      let location = new Point(result[i][0], result[i][1], result[i][2]);
      this.locations.push(location);
    };
    // console.log(this.locations);
  }

  // getLocations() {
  //   return $.ajax({
  //     url: 'db/read',
  //     dataType: 'json'
  //   });
  // }
  //
  // async setLocations() {
  //   let result = await this.getLocations();
  //   for (let i = 0; i < result.length; i++) {
  //     let location = new Point(result[i][0], result[i][1], result[i][2]);
  //     this.locations.push(location);
  //   };
  // }



  // randomLocation() {
  //   let loc = this.locations[Math.floor(Math.random() * this.locations.length)];
  //   return loc;
  // }
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
