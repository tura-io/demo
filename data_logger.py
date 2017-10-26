import json

def write_data(data): #function for writing streamed data to file as JSON
    f = open('data_log.txt', 'w')
    f.write(json.dumps(data))
    f.close()
