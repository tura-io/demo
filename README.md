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
  (In Python interpreter):
  * ```>>> from dbm import DBManager ```
  * ```>>> DBM = DBManager('demo.db') ```
  * ```>>> DBM.drop() ``` ...will delete all tables in case of corruption

  * Create Location table w/ data:
    * ```>>> DBM.create_loc_wdata() ```
  * Create Routes table:
    * ```>>> DBM.create_routes() ```

  * Insert data into Routes table:
    * ```>>> import builder ```
    * ```>>> builder.rebuild_from_file() ```
  * If routes.txt does not exist or is corrupted:
    * ```>>> builder.rebuild_from_api() ```
    * leave running until complete
