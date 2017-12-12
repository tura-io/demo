import json
import time
from dbm import DBManager
import sqlite3 as db
from mapbox import Directions
import mapbox_token

DBM = DBManager('demo.db')

service = Directions(access_token = mapbox_token.MAPBOX_ACCESS_TOKEN) #Mapbox API

result = DBM.read_locs() #Get Location List to generate routes b/w them

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
    originCoord = str(origin['geometry']['coordinates'])
    destCoord = str(destination['geometry']['coordinates'])
    routeTime = result['features'][0]['properties']['duration']
    routeDist = result['features'][0]['properties']['distance']
    coords = result['features'][0]['geometry']['coordinates']
    str_coords = str(coords)
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''INSERT INTO routes (origin, dest, originCoords, destCoords, routeTime, routeDist, route) VALUES (?, ?, ?, ?, ?, ?, ?)''', (origin['properties']['name'], destination['properties']['name'], originCoord, destCoord, routeTime, routeDist, str_coords))
    conn.commit()
    conn.close()
    return result

def rebuild_from_api():
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
        if idx == (len(pairs)):
            print("Done.")
            break
    routefile.close()

def rebuild_from_file():
    idx = 0
    routefile = open("route_constant_speed.txt", "r")
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    for line in routefile:
        origin = pairs[idx][0]
        destination = pairs[idx][1]
        idx += 1
        print(idx)
        #Rebuild memory object from JSON
        result = json.loads(line)
        #Grab relevant keys
        originCoord = str(origin['geometry']['coordinates'])
        destCoord = str(destination['geometry']['coordinates'])
        routeTime = result['features'][0]['properties']['duration']
        routeDist = result['features'][0]['properties']['distance']
        coords = result['features'][0]['geometry']['coordinates']
        str_coords = str(coords)
        #Then do Db things to that memory object
        dbi.execute('''INSERT INTO routes (origin, dest, originCoords, destCoords, routeTime, routeDist, route) VALUES (?, ?, ?, ?, ?, ?, ?)''', (origin['properties']['name'], destination['properties']['name'], originCoord, destCoord, routeTime, routeDist, str_coords))
    conn.commit()
    conn.close()
    routefile.close()
