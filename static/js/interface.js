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

  //Control Driver Population
});
