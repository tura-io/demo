import sqlite3 as db

test_locations = [ ['Tura.io', -122.67546, 45.502647], ['PSU', -122.65772, 45.52863], ['Salt N Straw', -122.698555, 45.528652], ['Powells City of Books', -122.681175, 45.52298], ['Portland Saturday Market', -122.67027, 45.523056] ]

################################USED FOR TESTING -TEMPORARY
def create_w_data():
    conn = db.connect('demo.db')
    dbi = conn.cursor()
    dbi.execute('''CREATE TABLE locations (
    name text,
    x real,
    y real)''') #sql-like commands, data types are limited so far
    for loc in test_locations:
        dbi.execute('''INSERT INTO locations (name, x, y) VALUES (?, ?, ?)''', (loc[0], loc[1], loc[2]))
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
