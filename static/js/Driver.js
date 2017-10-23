class Driver extends Person {

  constructor(location, isHired = false) {
    super();
    this.location = location;
    this.isHired = isHired;
  }

  classMethodTest() {
    console.log("works");
  }
}
