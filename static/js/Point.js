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

  classMethodTest() {
    console.log("point works");
  }
}
