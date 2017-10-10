import json
import time
import db_mngr
import sqlite3 as db
from mapbox import Directions
import mapbox_token

service = Directions(access_token = mapbox_token.MAPBOX_ACCESS_TOKEN)

result = db_mngr.read()

#Builds list of possible destinations and origins in memory.
pairs = []
for loc_one in result:
    for loc_two in result:
        if (loc_one != loc_two):
            #Reformat raw db data into Mapbox Points
            point_one = {
                'type': 'Feature',
                'properties': {'name': loc_one[0]},
                'geometry': {
                    'type': 'Point',
                    'coordinates': [loc_one[1], loc_one[2]]
                }
            }
            point_two = {
                'type': 'Feature',
                'properties': {'name': loc_two[0]},
                'geometry': {
                    'type': 'Point',
                    'coordinates': [loc_two[1], loc_two[2]]
                }
            }

            #Build list of possible origin/destination pairs.
            if ([point_one, point_two] not in pairs):
                pairs.append([point_one, point_two])
            if ([point_two, point_one] not in pairs):
                pairs.append([point_two, point_one])

print(len(pairs)) #Should be 2450 for a list of 50 locations.


def call(origin, destination):
    response = service.directions([origin, destination], 'mapbox.driving')
    result = response.geojson()
    coords = result['features'][0]['geometry']['coordinates']
    str_coords = str(coords)
    ########################################    DB
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''INSERT INTO routes (origin, dest, route) VALUES (?, ?, ?)''', (origin['properties']['name'], destination['properties']['name'], str_coords))
    conn.commit()
    conn.close()
    #####################################
    #db.save(x, x, result['lat']['lat2'])
    return result

idx = 0
routefile = open("routes.txt","w+")
while True:
    current_route = call(pairs[idx][0], pairs[idx][1])
    routefile.write(json.dumps(current_route) + "\r\n")
    #Reporting for the console.
    idx += 1
    print(f"Generating route #{idx}")
    time.sleep(1.001)

    #Stop when idx hits a number of our choosing.
    if idx == (len(pairs) - 1):
        break

routefile.close()
