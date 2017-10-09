from mapbox import Directions
import mapbox_token

service = Directions(access_token = mapbox_token.MAPBOX_ACCESS_TOKEN)

###############################INPUT TO SDK (TEMP LOCATION FEATURES)
origin = {
    'type': 'Feature',
    'properties': {'name': 'Portland, OR'},
    'geometry': {
        'type': 'Point',
        'coordinates': [-122.67546, 45.502647]# Tura
    }
}

destination = {
    'type': 'Feature',
    'properties': {'name': 'Portland, OR'},
    'geometry': {
        'type': 'Point',
        'coordinates': [-122.67027, 45.523056]# Sat. Market
    }
}
#######################################################

def call():
    response = service.directions([origin, destination], 'mapbox.driving')
    return response.geojson()
