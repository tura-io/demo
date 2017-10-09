from mapbox import Directions
import sqlite3 as db
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
    result = response.geojson()
    coords = result['features'][0]['geometry']
    str_coords = str(coords)
    ########################################    DB
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''INSERT INTO routes (origin, dest, route) VALUES (?, ?, ?)''', ('Tura', 'Market', str_coords))
    conn.commit()
    conn.close()
    #####################################
    #db.save(x, x, result['lat']['lat2'])
    return result
