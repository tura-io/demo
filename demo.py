from flask import Flask, request, render_template
import db_mngr

app = Flask(__name__)

@app.route('/')#methods=['GET','POST']
def index():
    return render_template('index.html')

@app.route('/db/create')
def db_create():
    db_mngr.create()
    return render_template('index.html')

@app.route('/db/drop')
def db_drop():
    db_mngr.drop()
    return render_template('index.html')

@app.route('/db/read')
def db_read():
    result = db_mngr.read()
    return render_template('db.html', result = result)

if __name__ == '__main__':
    app.run(debug=True)
    #app.run()
    #app.run(host='0.0.0.0', port=80) #DOCKER
