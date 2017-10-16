from flask import Flask, render_template
import json
import db_mngr, a_ok

app = Flask(__name__)

@app.route('/')#methods=['GET','POST']
def index():
    return render_template('index.html')

@app.route('/db/create')
def db_create():
    db_mngr.create_w_data()
    return render_template('db.html')

@app.route('/db/read')
def db_read():
    result = db_mngr.read()
    return json.dumps(result)

@app.route('/db/routes')
def db_read_routes():
    all_routes = db_mngr.read_routes()
    return json.dumps(all_routes)

@app.route('/db/routeinfo')
def db_route_info():
    res = db_mngr.read_route_info()
    return json.dumps(res)

@app.route('/db/drop')
def db_drop():
    db_mngr.drop()
    db_mngr.drop_routes()
    return render_template('db.html')


if __name__ == '__main__':
    aok = False
    while aok == False:
        aok = a_ok.test()
    if aok == True:
        app.run(debug=True)
        #app.run()
        #app.run(host='0.0.0.0', port=80) #DOCKER
