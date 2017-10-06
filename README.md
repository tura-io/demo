# demo
tura.io demo &amp; test data generation project

## Create Mapbox Access Token
  * create new file named 'mapbox_token.js' in /static/js/
  * file should contain: 'let accessToken = 'YOUR ACCESS-TOKEN HERE';'
  * (Development of Routes): also create 'mapbox_token.py' in main dir. w/ "MAPBOX_ACCESS_TOKEN = 'token here'"

## Build Image:
  (in /demo): sudo docker build -t "demo" .

## Run Image:
  sudo docker run -p 80:80 "demo"

## Run (in detached mode):
  sudo docker run -d -p 80:80 "demo"

## For local server (w/o Docker):
  change app.run() in demo.py (check comments)

#### Local Use:
  Browser might require hard-refresh(ctrl-F5) to see changes
#### Temporary Database links for testing:
  /db/create
  /db/write
  /db/read
