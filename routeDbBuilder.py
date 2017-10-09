import requests
import json
import db_mngr

f = open("routes.txt","w+")

result = db_mngr.read()

requests.get('')
# for i in result:
#      f.write(json.dumps(i) + "\r\n")



f.close()
