import sqlite3 as db

################################USED FOR TESTING -TEMPORARY
def create_w_data():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''CREATE TABLE locations (id int, x real, y real)''') #sql-like commands, data types are limited so far
    dbi.execute('''INSERT INTO locations VALUES (1, -122.67546, 45.502647)''')
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
