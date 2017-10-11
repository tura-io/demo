from flask import Flask, render_template
import json
import db_mngr

app = Flask(__name__)

@app.route('/')#methods=['GET','POST']
def index():
    return render_template('index.html')

@app.route('/db/read')
def db_read():
    result = db_mngr.read()
    return json.dumps(result)

@app.route('/db/routes')
def db_read_routes():
    all_routes = db_mngr.read_routes()
    return json.dumps(all_routes)

############################################TESTING TEMP
@app.route('/db/create')
def db_create():
    db_mngr.create_w_data()
    return render_template('db.html')

@app.route('/db/drop')
def db_drop():
    db_mngr.drop()
    return render_template('db.html')

@app.route('/api/routecall')
def route_call():
    response = route_caller.call()
    return json.dumps(response)
##############################################

if __name__ == '__main__':
    app.run(debug=True)
    #app.run()
    #app.run(host='0.0.0.0', port=80) #DOCKER
