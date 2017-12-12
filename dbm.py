import sqlite3 as sql
import json
import location_list

locs = location_list.test_locations

class DBManager(object):
    def __init__(self, db):
        self.conn = sql.connect(db, check_same_thread=False)
        self.dbi = self.conn.cursor()

    def create_loc_wdata(self):
        self.dbi.execute('''CREATE TABLE locations (
        name text,
        x real,
        y real)''')
        for loc in locs:
            self.dbi.execute('''INSERT INTO locations (name, x, y) VALUES (?, ?, ?)''', (loc[0], loc[1], loc[2]))
            self.conn.commit()

    def create_routes(self):
        self.dbi.execute('''CREATE TABLE routes (
        origin text,
        dest text,
        originCoords text,
        destCoords text,
        routeTime real,
        routeDist real,
        route text)''')
        self.conn.commit()

    def drop(self):
        self.dbi.execute('''DROP TABLE locations''')
        self.conn.commit()
        self.dbi.execute('''DROP TABLE routes''')
        self.conn.commit()

    def read_locs(self):
        self.dbi.execute('''SELECT * FROM locations''')
        result = self.dbi.fetchall()
        return result

    def read_routes(self):
        self.dbi.execute('''SELECT * FROM routes''')
        result = self.dbi.fetchall()
        return result

    def __del__(self):
        self.conn.close()
