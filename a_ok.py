import sqlite3 as db
import db_mngr

def test():
    try:
        import location_list
    except:
        print('(!)ERROR: location_list.py might not exist')
        print()
        return True
    else:
        try:
            locations = location_list.test_locations
        except:
            print('(!)ERROR: location array might not exist')
            print()
            return True
        else:
            if len(locations) > 0:
                try:
                    locs = db_mngr.read()
                except:
                    print('ERROR: locations table in DB might not exist')
                    print('CREATING demo.db IF NULL...')
                    print('CREATING NEW TABLE locations...')
                    print()
                    db_mngr.create_w_data()
                    return False
                else:
                    if len(locs) > 0:
                        try:
                            routes = db_mngr.read_routes()
                        except:
                            print('ERROR: routes table in DB might not exist')
                            print('CREATING NEW TABLE routes...')
                            print()
                            db_mngr.create_route()
                            return False
                        else:
                            if len(routes) > 0:
                                return True
                            else:
                                print('ERROR: routes table in DB is empty')
                                print('INSERTING NEW DATA...')
                                print()
                                return False
                    else:
                        print('ERROR: locations table in DB is empty')
                        print('INSERTING NEW DATA...')
                        print()
                        db_mngr.drop()
                        db_mngr.create_w_data()
                        return False
            else:
                print('(!)ERROR: location_list is empty')
                print()
                return True
