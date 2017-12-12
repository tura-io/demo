class Point {

  constructor(title, xGeo, yGeo) {
    this.type = "Feature";
    this.geometry = {
      "type": "Point",
      "coordinates": [xGeo, yGeo]
    },
    this.properties = {
      "title": title,
      "icon": "monument"
    }
  }
}
// class for initializing location points, currently not rendered on map
