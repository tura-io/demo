from flask import Flask, render_template, request
import json
import data_logger
# from kafka import Producer #enables streaming
from dbm import DBManager

app = Flask(__name__)
DBM = DBManager('demo.db') #DB manager class w/ connection object init
# producer = Producer()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/db/read') #returns location data
def db_read():
    result = DBM.read_locs()
    return json.dumps(result)

@app.route('/db/routes') #returns route data
def db_read_routes():
    all_routes = DBM.read_routes()
    return json.dumps(all_routes)

@app.route('/stream/collect', methods=['POST']) #route for AJAX post from Trip.js
def stream_collect_data():
    if request.method == 'POST':
        json_data = request.get_json(force=True)
        data_logger.write_data(json_data) #log all stream data as JSON in data_log.txt
        producer.stream_out(request.data) #send data to Kafka client
        return render_template('error.html') #have to return something small to avoid error, this return does nothing


if __name__ == '__main__':
    #app.run(debug=True)
    app.run()
    #app.run(host='0.0.0.0', port=80) #USE FOR DOCKER BUILD
