let Id = 1; //global counter for all Drivers/Riders
class Person {
  constructor(name) {
    this.ID = Id;
    Id++;
    this.name = name;
  }
}
