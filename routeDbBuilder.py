import requests
import json
import db_mngr

f = open("routes.txt","w+")

result = db_mngr.read()

pairs = []
for locOne in result:
    for locTwo in result:
        if (locOne != locTwo):
            if ([locOne, locTwo] not in pairs):
                pairs.append([locOne, locTwo])
            if ([locTwo, locOne] not in pairs):
                pairs.append([locTwo, locOne])

print(len(pairs))
# requests.get('')
# for i in result:
#      f.write(json.dumps(i) + "\r\n")



f.close()
