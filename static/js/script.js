$(function () {
  mapboxgl.accessToken = accessToken;

  let map = new MapBox({container: 'map', style: 'mapbox://styles/mapbox/light-v9', center: [-122.674793, 45.518233], zoom: 13.5});

  //TEMP: The next six lines seem like they should generate async errors, but currently usually don't.
  map.setLocations();
  console.log("Locations:");
  console.log(map.locations);

  map.setRoutes();
  console.log("Routes:");
  console.log(map.routes);

  // A simple line from origin to destination.
  var route = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": [
[-122.675477, 45.502647], [-122.675472, 45.502951], [-122.675466, 45.503529], [-122.675458, 45.503663], [-122.675905, 45.503668], [-122.676531, 45.503675], [-122.676534, 45.503498], [-122.676537, 45.503257], [-122.676539, 45.503145], [-122.676545, 45.503119], [-122.67656, 45.503096], [-122.676622, 45.503052], [-122.677136, 45.503422], [-122.67722, 45.50346], [-122.677258, 45.503483], [-122.67739, 45.50352], [-122.677448, 45.503559], [-122.677498, 45.503588], [-122.677549, 45.503615], [-122.677609, 45.503641], [-122.677652, 45.503657], [-122.677705, 45.503671], [-122.67776, 45.50368], [-122.677891, 45.503694], [-122.677998, 45.503738], [-122.67829, 45.503757], [-122.678505, 45.50377], [-122.678623, 45.503775], [-122.678736, 45.503777], [-122.678815, 45.503776], [-122.67903, 45.503781], [-122.679802, 45.503778], [-122.67985, 45.503778], [-122.680027, 45.503784], [-122.680182, 45.503795], [-122.680289, 45.50381], [-122.68036, 45.503827], [-122.680428, 45.50385], [-122.680504, 45.503885], [-122.680564, 45.503922], [-122.680624, 45.503965], [-122.680665, 45.504006], [-122.680703, 45.504048], [-122.680734, 45.504098], [-122.680758, 45.504147], [-122.680773, 45.504196], [-122.680778, 45.504275], [-122.680774, 45.504671], [-122.680773, 45.504858], [-122.680768, 45.505059], [-122.680768, 45.505105], [-122.680772, 45.505143], [-122.680778, 45.505174], [-122.680794, 45.505207], [-122.680813, 45.505235], [-122.680843, 45.505268], [-122.680875, 45.505298], [-122.680899, 45.505317], [-122.680928, 45.505334], [-122.680952, 45.505347], [-122.681301, 45.505506], [-122.6819, 45.50577], [-122.682017, 45.50583], [-122.682137, 45.505882], [-122.682156, 45.505887], [-122.682564, 45.506071], [-122.682974, 45.506263], [-122.683131, 45.50635], [-122.683285, 45.506449], [-122.68339, 45.506534], [-122.683521, 45.506646], [-122.683727, 45.506823], [-122.684037, 45.507087], [-122.68417, 45.507211], [-122.684203, 45.507251], [-122.68423, 45.50728], [-122.684227, 45.507298], [-122.684222, 45.507355], [-122.684223, 45.507499], [-122.684221, 45.507623], [-122.684279, 45.507897], [-122.684335, 45.50816], [-122.684393, 45.508278], [-122.68449, 45.508366], [-122.68462, 45.508447], [-122.684849, 45.508547], [-122.685175, 45.508678], [-122.685536, 45.508848], [-122.685735, 45.50895], [-122.685979, 45.509089], [-122.686445, 45.509356], [-122.687123, 45.509783], [-122.687373, 45.509994], [-122.687573, 45.510175], [-122.687781, 45.510377], [-122.688012, 45.510609], [-122.688274, 45.510898], [-122.688555, 45.51128], [-122.688797, 45.511651], [-122.689009, 45.512036], [-122.689123, 45.512275], [-122.689216, 45.512513], [-122.689318, 45.512845], [-122.68935, 45.51317], [-122.689352, 45.513422], [-122.689345, 45.513539], [-122.689329, 45.513656], [-122.689292, 45.513952], [-122.689214, 45.514179], [-122.689147, 45.514369], [-122.689072, 45.514527], [-122.688992, 45.514697], [-122.68886, 45.514937], [-122.688731, 45.51518], [-122.688593, 45.51543], [-122.688364, 45.515848], [-122.688055, 45.516429], [-122.68766, 45.517155], [-122.687424, 45.517593], [-122.687142, 45.518112], [-122.686946, 45.518431], [-122.685937, 45.520355], [-122.685748, 45.520721], [-122.685607, 45.521119], [-122.685554, 45.521369], [-122.685537, 45.521545], [-122.685542, 45.521794], [-122.68556, 45.52195], [-122.68558, 45.52211], [-122.68565, 45.522476], [-122.685726, 45.522716], [-122.685805, 45.522968], [-122.685836, 45.523086], [-122.685851, 45.523196], [-122.685851, 45.523296], [-122.685843, 45.523381], [-122.685813, 45.523516], [-122.685787, 45.523585], [-122.685774, 45.523611], [-122.685759, 45.523639], [-122.68572, 45.523696], [-122.685367, 45.524163], [-122.685307, 45.524262], [-122.685279, 45.524352], [-122.685272, 45.524396], [-122.685225, 45.524447], [-122.685252, 45.52497], [-122.685254, 45.525045], [-122.685256, 45.525118], [-122.685277, 45.525683], [-122.685279, 45.525761], [-122.685156, 45.525763], [-122.684775, 45.525769], [-122.684397, 45.525776], [-122.684359, 45.525776], [-122.684262, 45.525778], [-122.684265, 45.525845], [-122.684266, 45.525869], [-122.684286, 45.526424], [-122.684288, 45.526486], [-122.68438, 45.526484], [-122.684644, 45.526479]
              ]
          }
      }]
  };
  // A single point that animates along the route.
  // Coordinates are initially set to origin.
  var point = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [-122.67546, 45.502647]
          }
      }]
  };

  // Calculate the distance in kilometers between route start/end point.
  var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
  var tweens = [];

  // Draw an arc between the `origin` & `destination` of the two points
  for (var i = 0; i < lineDistance * 1000; i++) {
      var segment = turf.along(route.features[0], i / 1000 * lineDistance, 'kilometers');
      tweens.push(segment.geometry.coordinates);
  }

  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = tweens;

  map.on('load', function() {
    map.addLayer({
      "id": "location-list",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": map.locations
        }
      },
      "layout": {
        "icon-image": "{icon}-15",
        "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      }
    });

    map.addRoute();

    //NOTE: Anim stuff below:
    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('route', {
        "type": "geojson",
        "data": route
    });

    map.addSource('point', {
        "type": "geojson",
        "data": point
    });

    map.addLayer({
        "id": "route",
        "source": "route",
        "type": "line",
        "paint": {
            "line-width": 5,
            "line-color": "#007cbf"
        }
    });

    map.addLayer({
        "id": "point",
        "source": "point",
        "type": "symbol",
        "layout": {
            "icon-image": "marker-15"
        },
        "paint": {
          //NOTE: This should control the color of the icon, but currently doesn't. It requires an "sdf icon" to work, which I thought we were using. But maybe I'm wrong.
            "icon-color": "#FFFFFF",
        }
    });

    function animate() {
        //Shorten route geometry
        route.features[0].geometry.coordinates.splice(0, 1);
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[0];

        // Update the route source with the new data.
        map.getSource('route').setData(route);
        // Update the source with this new data.
        map.getSource('point').setData(point);

        // Request the next frame of animation so long as destination has not
        // been reached.
        if (point.features[0].geometry.coordinates[0] !== [-122.698555, 45.528652][0]) {
            requestAnimationFrame(animate);
        }
    }

    // Start the animation.
    animate();
  });


});
