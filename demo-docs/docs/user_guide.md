# User Guide

The demo project is a visualization of drivers and trips within Portland using our platform to
process data and detect events.

## Getting Started

See below for installing and starting the demo project (from the README):

### Tura Strom Demo

##### Description:
Data-generation app and demonstration of Strom event-detection capabilities.

#### Pre-Requisites:
* Python 3.6
* [Flask](http://flask.pocoo.org/)
  * *HTTP Server and templating micro-framework*
* [Sqlite3](https://www.sqlite.org/)
  * *Light-weight SQL Database engine*
* [Mapbox](https://www.mapbox.com/)
  * *Mapping library*
* Mapbox token files (see below)
* *All can be installed with*:
  * ``` pip install Requirements.txt ```

#### Download:
* ``` git clone git@github.com:tura-io/demo.git ```

#### Mapbox Requirements:
Create token files(example uses linux commands, replace these with whichever is correct for your OS):
  * ``` cd demo/ ```
  * ``` touch mapbox_token.py ```
    * mapbox_token.py should contain:
      * ``` MAPBOX_ACCESS_TOKEN = 'YOURKEYHERE' ```

  * ``` cd demo/static/js ```
  * ``` touch mapbox_token.js ```
    * mapbox_token.js should contain:
      * ``` let accessToken = 'YOURKEYHERE'; ```

#### Run:
Make sure that you have the strom project running and piping data first before starting the demo by
running the strom start script. Once the strom project has been successfully started, run the following
commands in the demo project:

* ``` cd demo/ ```
* ``` python demo.py ```

### Important Notes:
  * On server restart, browser will require hard-refresh (CTRL-F5)

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

## Adjusting Map Defaults

Beyond the UI controls in the speed slider and the event display checkbox, you can adjust the
map default settings by changing the properties of the Map class object.

Change the following to adjust the visualization accordingly:

  - `this.maxTrips`: dictates the number of trips displayed on the map
  - `this.tripSpawnInterval`: governs the wait time between when a trip is removed from the Map and a new one replaces it
  - `this.initialDrivers`: how many drivers first appear on the map
  - `this.allNames`: the names of all the potential drivers
