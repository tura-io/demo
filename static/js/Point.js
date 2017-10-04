class Point {

  constructor(title, xGeo, yGeo) {
    this.type = "Feature";
    this.geometry = {
      "type": "Point",
      "coordinates": [xGeo, yGeo]
    },
    this.properties = {
      "title": title,
      //TODO: Redo constructor to allow custom icons.
      "icon": "monument"
    }
  }

  classMethodTest() {
    console.log("point works");
  }
}
