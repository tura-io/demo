let Id = 1;
class Person {

  constructor(name) {
    this.ID = Id;
    Id++;
    this.name = name;
  }

  checkLocation() {
    console.log("person works")
  }
}
