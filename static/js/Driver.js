class Driver extends Person {

  constructor(location, isHired = false) { //unique name
    super();
    this.location = location;
    this.isHired = isHired;
  }

  classMethodTest() {
    console.log("works");
  }
}
