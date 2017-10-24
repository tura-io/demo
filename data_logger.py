import json

def write_data(data):
    f = open('data_log.txt', 'w')
    f.write(json.dumps(data))
    f.close()
