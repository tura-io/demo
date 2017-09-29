import * as MapBox from '../Map.js';

// let newRoute = new Route([0.0, 0.0], [1.1, 1.1]);
// let newPoint = new Point([0.0, 0.0]);
// let newPerson = new Person(0, "DRIVER", "TuraBot", newPoint);
// let newDriver = new Driver(newPerson, true);
// let newRider = new Rider(true, newDriver);
// let newMap = new MapBox(newDriver, newRider);
// let newTrip = new Trip(newRider, newDriver, newRoute, "PAID");
let testMapInst = new MapBox(0, 0);

console.log(testMapInst.allDrivers);
console.log("new");
