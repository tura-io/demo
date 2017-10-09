import json
import db_mngr
import time
from mapbox import Directions
import mapbox_token

service = Directions(access_token = mapbox_token.MAPBOX_ACCESS_TOKEN)

result = db_mngr.read()

#Builds list of possible destinations and origins in memory.
pairs = []
for locOne in result:
    for locTwo in result:
        if (locOne != locTwo):
            if ([locOne, locTwo] not in pairs):
                pairs.append([locOne, locTwo])
            if ([locTwo, locOne] not in pairs):
                pairs.append([locTwo, locOne])

print(len(pairs)) #Should be 2450 for a list of 50 locations.

def call(origin, destination):
    response = service.directions([origin, destination], 'mapbox.driving')
    result = response.geojson()
    coords = result['features'][0]['geometry']['coordinates']
    str_coords = str(coords)
    ########################################    DB
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''INSERT INTO routes (origin, dest, route) VALUES (?, ?, ?)''', ('Tura', 'Market', str_coords))# for example, variables need change
    conn.commit()
    conn.close()
    #####################################
    #db.save(x, x, result['lat']['lat2'])
    return result

idx = 0
while True:
    idx += 1
    print(f"Generating route #{idx}")
    call()
    time.sleep(.25)
    if idx == 10:
        break
