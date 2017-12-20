$(function () {
  //Initialize control value displays.
  $('#driver-pop').text(map.drivers.length);
  $('#passenger-max').text(map.maxTrips);
  $('#passenger-spawn-rate').text(map.tripSpawnInterval);

  //Initialize Driver list
  updateDriverList();

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
  $('#driver-pop-plus').click(function() {
    map.addDriver();
    updateDriverList();
    $('#driver-pop').text(map.drivers.length);
  });
  $('#driver-pop-minus').click(function() {
    map.removeDriver();
    updateDriverList();
    $('#driver-pop').text(map.drivers.length);
  });

  // Event Toggle Click Handlers
  $('#test-event').click(function() {
    map.eventDisplay = !map.eventDisplay
    map.toggleEvent(trip.Trigger);
  });
});

function updateDriverList () {
  $('#driver-list > .collection').empty();
  for (var i = 0; i < map.drivers.length; i++) {
    $('#driver-list > .collection').append(
       //include unique id for driver
      `<a class="collection-item" id="${map.drivers[i].name}"><div>${map.drivers[i].name}<i class="material-icons secondary-content">fiber_manual_record</i></div></a>`
    );
    $('#driver-list > .collection a').last().click(driverListClick);
  }
}

function driverListClick (event) {
  $('#driver-card').show();

  let nameClicked = $(this).attr("id");
  let cleanName = nameClicked.replace(/\s/g,"");


  //report driver name
  $('.card-content').append(
    `<span class='card-test'>${nameClicked}</span>`);

  $('.card-content').append(
    `<br><br><br>`);

  //nonUiSliderslider
  $('.card-content').append(
    `<div class="speed-slider" id="${cleanName}-slider">`);

    var slider = document.getElementById(`${cleanName}-slider`);
    noUiSlider.create(slider, {
        start: [ 0 ],
        tooltips: true,
        range: {
            'min' : -65,
            'max' : 100
        },
        format: wNumb({
            decimals: 0
        })
    });

    // Slider callback value
    var modifier;
    slider.noUiSlider.on('end', function(values, handle){
        modifier = values[handle];
        map.modifyDriverSpeed(nameClicked,modifier);
    });

    slider.noUiSlider.on('slide', function(values, handle){
        var val = values[handle];
        var sliderLoc = $(this['target']);
        if (val < -45)
            sliderLoc.css("background-color","#2196f3");
        else if (val < -25 )
            sliderLoc.css("background-color","#5961D3");
        else if (val < 0 )
            sliderLoc.css("background-color","#6D56C0");
        else if (val < 100 )
            sliderLoc.css("background-color","#8646A6");
        else
            sliderLoc.css("background-color","#B02E7F");
    });

//  setTimeout(function() {
//    $('#driver-card').fadeOut();
//  }, 5000);
}
