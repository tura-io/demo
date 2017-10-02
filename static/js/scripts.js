let newMap = new MapBox(1, 1);
let Origin = new Point([0.0, 0.0]);
let Dest = new Point([1.1, 1.1]);
let newRoute = new Route(Origin, Dest);
let newPerson = new Person(1, 'DRIVER', 'AJ', Origin);
let newDriver = new Driver(newPerson, true);
let newRider = new Rider(true, newDriver);
let newTrip = new Trip(newRider, newDriver, newRoute, 'DROPOFF');

console.log(newDriver.ID); //person class inheritance props
console.log(newDriver.Role);
console.log(newDriver.isOccupied); //driver class props

console.log(newRider.myDriver); //driver object returned
