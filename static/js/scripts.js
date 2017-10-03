$(function() {
  alert("jquery works");
  $.ajax({
    url: '/db/read',
    dataType: 'json'
  }).done(function(result) {
    alert(result);
  });
});
