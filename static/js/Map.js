class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
  }

  addRoute() {

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
  }
}
