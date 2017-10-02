class Driver extends Person {

  constructor(person, isOccupied) {
    super(person.ID, person.Role, person.Name, person.CurrentLocation);
    this.isOccupied = isOccupied;
  }

  classMethodTest() {
    console.log("works");
    console.log(this.Role);
  }
}
