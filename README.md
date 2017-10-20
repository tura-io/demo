# demo
tura.io demo &amp; test data generation project

## Description
  A testing program that simulates a ride-sharing app. Used for generation of geo-coordinate datasets.

## Pre-Requisites

#### Local Use:
  * Python3 enviroment
  * Flask, Sqlite3, Mapbox packages
  * Mapbox token files (see below)

#### Docker:
  * Docker client
  * (see below)

### Installation:
  * Local:
    * install necessary packages above
    * create "mapbox_token.js" in /static/js/
      * ``` let accessToken = 'YOURKEYHERE'; ```
    * create "mapbox_token.py" in root
      * ``` MAPBOX_ACCESS_TOKEN = 'YOURKEYHERE' ```
    * run:
      * ``` python demo.py ```

  * Docker:
    * NOTE: check demo.py -> app.run for correct run command before building or running locally...
    * Build:
      * ``` docker build -t "demo" . ```
    * Run:
      * ``` docker run -dp 80:80 "demo" ```

### Important Notes:
  * On server restart, browser will require hard-refresh (CTRL-F5)
  * Server not required unless for startup or streaming

#### DATABASE REBUILD INSTRUCTIONS
