$(function () {
  //TEMP: All of the values currently displaying should be reset to other keys later.
  $('#driver-pop').text(map.trips.length);
  $('#passenger-max').text(map.maxTrips);
  $('#passenger-spawn-rate').text(map.tripSpawnInterval);

  //Control Passenger Spawn Rate
  $('#passenger-spawn-plus').click(function() {
    //NOTE: This functionally sets a max spawn delay of 3 sec. That seems reasonable, but might be changed later.
    if (map.tripSpawnInterval < 3000) {
      map.tripSpawnInterval += 100;
      $('#passenger-spawn-rate').text(map.tripSpawnInterval);
      map.initialize();
    }
  });
  $('#passenger-spawn-minus').click(function() {
    //NOTE: This won't let spawn delay drop below 100ms.
    if (map.tripSpawnInterval > 100) {
      map.tripSpawnInterval -= 100;
      $('#passenger-spawn-rate').text(map.tripSpawnInterval);
      map.initialize();
    }
  });

  //Control Maximum Passengers
  $('#passenger-max-plus').click(function() {
    //NOTE: This sets a default maximum number of passengers at 10, which is much lower than we'd like, but will keep things from chugging. Hopefully this can be raised after optimization.
    if (map.maxTrips < 10) {
      map.maxTrips += 1;
      $('#passenger-max').text(map.maxTrips);
    }
  });
  $('#passenger-max-minus').click(function() {
    if (map.maxTrips > 0) {
      map.maxTrips -= 1;
      $('#passenger-max').text(map.maxTrips);
    }
  });
  //Control Driver Population
});
