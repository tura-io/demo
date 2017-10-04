$(function() {
  $.ajax({
    url: "https://api.mapbox.com/directions/v5/mapbox/driving/-122.67546,45.502647;-122.681175,45.52298?steps=true&access_token=pk.eyJ1IjoiY2hhcmxlc2VtcmljaCIsImEiOiJjajg2N3J6NnowczB4MndwbHQ5b3UwMnBrIn0.PWVhuPintFtBY8i9TqTW8w",
    dataType: 'json'
  }).done(function(result) {

    let allRoutes = [];

    for (i=0;i<result.routes.length;i++) {
      for (j=0;j<result.routes[i].legs[0].steps.length;j++) {
        allRoutes.push(result.routes[i].legs[0].steps[j].maneuver.location);
      };
    };

    console.log(allRoutes);
    return allRoutes;
  });
});
