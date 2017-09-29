import Map, Trip, Route, Person, Driver, Rider, Point

var newMap = new Map(newDriver, newRider);
var newTrip = new Trip(newRider, newDriver, newRoute, "PAID");
var newRoute = new Route([0.0, 0.0], [1.1, 1.1]);
var newPerson = new Person(0, "DRIVER", "TuraBot", newPoint);
var newDriver = new Driver(true);
var newRider = new Rider(true, newDriver);
var newPoint = new Point([0.0, 0.0]);
