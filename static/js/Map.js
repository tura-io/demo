class MapBox extends mapboxgl.Map {

  constructor(container, style, center, zoom) {
    super(container, style, center, zoom);
    this.locations = [];
  }

  async setLocations() {  //TODO: still has asnyc issues, revise
    let result = await $.ajax({
      url: 'db/read',
      dataType: 'json'
    });
    for (let i = 0; i < result.length; i++) {
      let location = new Point(result[i][0], result[i][1], result[i][2]);
      this.locations.push(location);
    };
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

  randomLocation() {
    let loc = this.locations[Math.floor(Math.random() * this.locations.length)];
    return loc;
  }
}
