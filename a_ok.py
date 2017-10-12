import sqlite3 as db
import db_mngr

def test():
    try:
        import location_list
    except:
        print('ERROR: location_list.py')
        return False
    else:
        locations = location_list.test_locations
        if len(locations) > 0:
            try:
                locs = db_mngr.read()
            except:
                print('ERROR: locations table in DB might not exist')
                return False
            else:
                if len(locs) > 0:
                    try:
                        routes = db_mngr.read_routes()
                    except:
                        print('ERROR: routes table in DB might not exist')
                        return False
                    else:
                        if len(routes) > 0:
                            return True
                        else:
                            print('ERROR: routes table in DB is empty')
                            return False
                else:
                    print('ERROR: locations table in DB is empty')
                    return False
        else:
            print('ERROR: location_list is empty')
            return False
