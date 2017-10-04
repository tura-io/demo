import sqlite3 as db

test_locations = [ ['Tura.io', -122.67546, 45.502647],
                   ['PSU', -122.65772, 45.52863],
                   ['Salt N Straw', -122.698555, 45.528652],
                   ['Powells City of Books', -122.681175, 45.52298],
                   ['Pioneer Courthouse Square', -122.679339, 45.518911],
                   ['Ground Kontrol', -122.675932, 45.523959],
                   ['The Nines', -122.677967, 45.519215],
                   ['Andina', -122.684637, 45.526302],
                   ['Momo\'s', -122.682527, 45.519687],
                   ['Hotel Modera', -122.680713, 45.513792],
                   ['Portland Marriott Downtown Waterfront', -122.675589, 45.512483],
                   ['The Roxy', -122.682541, 45.522579],
                   ['Voodoo Doughnuts', -122.673081, 45.522668],
                   ['Lan Su Chinese Garden', -122.673289, 45.525384],
                   ['Mary\'s Club', -122.677913, 45.522781],
                   ['Providence Park', -122.691630, 45.521554],
                   ['Higgins', -122.681996, 45.515576],
                   ['Stag PDX', -122.677860, 45.525494],
                   ['Hotel Lucia', -122.678446, 45.521078],
                   ['Sushi Takahashi 2', -122.683509, 45.505513],
                   ['Luc Lac Vietnamese Kitchen', -122.675428, 45.516866],
                   ['Arlene Schnitzer Concert Hall', -122.681903, 45.517031],
                   ['Roseland Theatre', -122.676196, 45.523215],
                   ['The Armory', -122.681614, 45.524144],
                   ['Portland Saturday Market', -122.67027, 45.523056] ]

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
