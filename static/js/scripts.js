$(function() {
  $.ajax({
    url: '/db/read',
    dataType: 'json'
  }).done(function(result) {
    let locList = [];

    for (i = 0; i < result.length; i++) {
      let newLoc = new Point(result[i][0], result[i][1], result[i][2]);
      locList.push(newLoc);
    };
    console.log(locList);
  });
});
