from mapbox import Directions
import sqlite3 as db
import location_list
import mapbox_token

service = Directions(access_token = mapbox_token.MAPBOX_ACCESS_TOKEN)

loc_list = location_list.test_locations

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

def save(origin, dest, route):
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''INSERT INTO routes (origin, dest, route) VALUES (?, ?, ?)''', (origin, dest, route))
    conn.commit()
    conn.close()
