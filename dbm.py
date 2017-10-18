import sqlite3 as db
import json

class DBM(object):
    def __init__(self, db):
        self.conn = db.connect('demo.db')
        self.dbi = self.conn.cursor()

    def __end__(self):
        self.conn.close()
