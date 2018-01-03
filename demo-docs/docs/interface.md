# interface - Enabling jQuery

interface.js contains a single immediately invoked JavaScript function that wraps all
the jQuery methods for interacting with the map.

interface.js makes use of the following methods:

## Passenger Control Methods:

## Driver Control Methods:

## Event Toggle Handler:

```
$('#test-event').click(function() {
  // Event Checkbox Toggle Listener: a jQuery listener that inverts the eventDisplay
  // boolean attribute on the Map class and calls the toggleEvent method, also on the
  // Map class.
  map.eventDisplay = !map.eventDisplay;
  map.toggleEvent();
});
```

## Speed Control Card:
