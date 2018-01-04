# Driver

The Driver class inherits from the Person class and is initialized with a location and isHired attributes.

The Driver class has the following properties:
  -  location: set to the location argument
  -  isHired: whether the driver is in the list activeDrivers; set to false
  -  Client: an instance of the StromClient
  -  turnCount: number of turns seen
  -  turnCoords: coordinate location of a turn; initialized as `null`
  -  flagTurn: function to increment the turn count and set the coordinates for
     a turn location.
       - Javascript sets the context of `this` for the flagTurn when the function is
       called, not where it's defined. We explicitly bind the context of `this` to
       the Driver object in the constructor below to prevent losing the context of the
       Driver object (and the turnCount property on it).
  -  speedModifier: number for adjusting the trip speed. Defaults to 0.

The Driver class has the folowing methods:

```
initClient() {
  // Initialize a socket client for event streams.
  this.Client.registerDevice(this.name, this.template, this.name.replace(/\s/g, ""));
  this.Client.registerEvent('turn_event_' + this.name, this.flagTurn, true);
  this.Client.registerEvent('speed_change_' + this.name, this.alertEvent, true);
}
```

```
setModifier(modifier) {
  // Function called by the modifyDriverSpeed function on the Map object to set the new speed based on
  // user toggling of the slider component.
  this.speedModifier = modifier;
}
```

```
flagTurn(resp) {
  // Callback function for the registerEvent function on the StromClient class.
  // Increment turnCount for each event.
  this.turnCount +=1;
  console.log(this.turnCount);
  // Set turnCoords to the coordinates on the event object.
  this.turnCoords = JSON.parse(resp).event_context["location"];
  console.log(this.turnCoords);
}
```
