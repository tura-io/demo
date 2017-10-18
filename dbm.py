import sqlite3 as sql
import json

class DBManager(object):
    def __init__(self, db):
        self.conn = sql.connect(db, check_same_thread=False)
        self.dbi = self.conn.cursor()

    def read_routes(self):
        self.dbi.execute('''SELECT * FROM routes''')
        result = self.dbi.fetchall()
        return result

    def select_query(self, arg):
        self.dbi.execute(arg)
        result = self.dbi.fetchall()
        return result

    def __del__(self):
        self.conn.close()
