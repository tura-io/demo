# demo
tura.io demo &amp; test data generation project

## Description
  A testing program that simulates a ride-sharing app. Used for generation of geo-coordinate datasets.

  10,000 geo-codes / min (SpawnRate = 100ms)

## Pre-Requisites

#### Local Use:
  * Python3 enviroment
  * Flask, Sqlite3, Mapbox packages
  * Mapbox token files (see below)
  * Kafka/Zookeeper instance if streaming is enabled

#### Docker:
  * Docker client
  * Docker Kafka Container as consumer
  * (see below)

### Installation:
  * Local:
    * Install necessary packages above
    * Create "mapbox_token.js" in /static/js/
      * ``` let accessToken = 'YOURKEYHERE'; ```
    * Create "mapbox_token.py" in root
      * ``` MAPBOX_ACCESS_TOKEN = 'YOURKEYHERE' ```
    * Run:
      * ``` python demo.py ```

  * Docker:
    * NOTE: check demo.py -> app.run for correct run command before building or running locally...
    * Build:
      * ``` docker build -t "demo" . ```
    * Run:
      * ``` docker run -dp 80:80 "demo" ```

### Important Notes:
  * On server restart, browser will require hard-refresh (CTRL-F5)
  * "data_log.txt" logs all streamed data in JSON format. Log is currently not cleaned up or deleted by any process.

#### DATABASE REBUILD INSTRUCTIONS
  * Create Database:
    * ``` >>>import db_mngr ```
    * Locations Table(w/ data):
      * ``` >>>db_mngr.create_w_data() ```
    * Routes Table:
      * ``` >>>db_mngr.create_route() ```

  * Insert data into Routes table:
    * ``` >>>import routeDbBuilder ```
    * ``` >>>routeDbBuilder.rebuild_from_file() ```

    * If routes.txt is missing or corrupted:
      * ``` >>>routeDbBuilder.rebuild_from_api() ``` to generate routes.txt
      * ``` >>>routeDbBuilder.rebuild_from_file() ``` to insert data into DB from routes.txt

  * Drop Database:
    * Locations: ``` db_mngr.drop() ```
    * Routes: ``` db_mngr.drop_routes() ```
