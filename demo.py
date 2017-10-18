from flask import Flask, render_template
import json
import db_mngr, a_ok
from dbm import DBManager

app = Flask(__name__)
DBM = DBManager('demo.db')

@app.route('/')#methods=['GET','POST']
def index():
    return render_template('index.html')

@app.route('/db/read')
def db_read():
    result = db_mngr.read()
    return json.dumps(result)

@app.route('/db/routes')
def db_read_routes():
    all_routes = DBM.read_routes()
    return json.dumps(all_routes)

if __name__ == '__main__':
    aok = False
    while aok == False:
        aok = a_ok.test()
    if aok == True:
        app.run(debug=True)
        #app.run()
        #app.run(host='0.0.0.0', port=80) #DOCKER
