$(function () {
  //TEMP: All of the values currently displaying should be reset to other keys later.
  $('#driver-pop').text(map.trips.length);
  $('#passenger-max').text(map.maxTrips);
  $('#passenger-spawn-rate').text(map.tripSpawnInterval);
  console.log(map);
});
