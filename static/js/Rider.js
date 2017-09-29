class Rider extends Person {

  constructor(isPickedUp, myDriver) {
    super();
    this.isPickedUp = isPickedUp;
    this.myDriver = myDriver;
  }

  classMethodTest() {
    console.log("works");
    console.log(this.Role);
  }
}
