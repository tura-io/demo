//The accessToken below is a publicly provided one and doesn't need to be hidden.
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc2VtcmljaCIsImEiOiJjajg2N3J6NnowczB4MndwbHQ5b3UwMnBrIn0.PWVhuPintFtBY8i9TqTW8w';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v9',
center: [-122.6774833, 45.5206428],
interactive: false,
zoom: 15
});

console.log(map);
