import sqlite3 as db

################################USED FOR TESTING -TEMPORARY
def create():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''CREATE TABLE locations (id real, geocode text)''') #sql-like commands, data types are limited so far
    conn.commit()
    conn.close()

def write():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''INSERT INTO locations VALUES ('1', '[X:-122.67546, Y:45.502647]')''')
    conn.commit()
    conn.close()

def drop():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''DROP TABLE locations''')
    conn.commit()
    conn.close()
########################################################

def read():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''SELECT * FROM locations''')
    result = dbi.fetchall()
    conn.close()
    return result
