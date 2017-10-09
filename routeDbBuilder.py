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

def call():
    response = service.directions([origin, destination], 'mapbox.driving')
    return response.geojson()

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
idx = 0
while True:
    idx += 1
    print(idx)
    time.sleep(1)
    if idx == 10:
        break

f = open("routes.txt","w+")
# for i in result:
#      f.write(json.dumps(i) + "\r\n")
f.close()
