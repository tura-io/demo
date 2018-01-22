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
  * ``` pip install -r Requirements.txt ```

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
