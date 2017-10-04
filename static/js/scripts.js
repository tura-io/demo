$(function() {
  $.ajax({
    url: "https://api.mapbox.com/directions/v5/mapbox/driving/-122.67546,45.502647;-122.681175,45.52298?steps=true&access_token=pk.eyJ1IjoiY2hhcmxlc2VtcmljaCIsImEiOiJjajg2N3J6NnowczB4MndwbHQ5b3UwMnBrIn0.PWVhuPintFtBY8i9TqTW8w",
    dataType: 'json'
  }).done(function(result) {
    console.log(result);
    console.log('');

    for (i = 0; i < result.waypoints.length; i++) {
      console.log(result.waypoints[i].name);
      console.log(result.waypoints[i].location);
    };
    console.log('');

    for (i = 0; i < result.routes.length; i++) {
      for (j = 0; j < result.routes[i].legs.length; j++) {
        for (k = 0; k < result.routes[i].legs[j].steps.length; k++) {
          console.log(result.routes[i].legs[j].steps[k].maneuver.instruction);
          console.log(result.routes[i].legs[j].steps[k].maneuver.location);
        }
      }
    };
  });
});
