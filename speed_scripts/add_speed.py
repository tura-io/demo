import sys, os, json, random
import matplotlib.pyplot as plt
import numpy as np

def add_constant_speed(route_file, speed_per_route=True, write2file=True):
    with open(route_file) as route_data:
        if write2file:
            output_path = os.path.split(os.path.abspath(route_file))
            out_routes = open(os.path.join(output_path[0], "constant_speed_"+output_path[1]), "w")
        # cur_route = json.loads(route_data.readline())
        for cur_line in route_data.readlines():
            cur_json = json.loads(cur_line)
            for cur_route in cur_json["features"]:
                cur_speed = random.randint(1,500)
                cur_cords = np.array(cur_route["geometry"]["coordinates"])
                speed_col = np.ones((cur_cords.shape[0],1))* cur_speed
                cur_route["geometry"]["coordinates"] = np.hstack((cur_cords, speed_col)).tolist()
            if write2file:
                out_routes.write(json.dumps(cur_json))
                out_routes.write("\n")
            else:
                print(json.dumps(cur_json))
def compute_speed(position_array, plot_turns=False):
    position_array = position_array[:, [1,0]]
    heading_array = DeriveHeading.bearing(position_array, 1,)
    change_heading = (np.diff(heading_array) + 180) % 360 - 180
    change_window = DeriveWindowSum.window_sum(change_heading, 2)
    big_change = np.abs(change_window) > 60

    change_inds = np.nonzero(big_change[4:-1]+big_change[3:-2]+big_change[2:-3]+big_change[1:-4]++big_change[:-5])[0]+1
    if plot_turns:
        plt.plot(position_array[:,0], position_array[:,1],'x-')
        plt.plot(position_array[0,0], position_array[0,1], 'or')
        plt.plot(position_array[change_inds, 0], position_array[change_inds, 1], "rx")
        plt.show()
    default_speed = 65*np.ones((position_array.shape[0],1))
    default_speed[change_inds,:] = 120
    return default_speed

def add_computed_speed(route_file, write2file=True):

    with open(route_file) as route_data:
        if write2file:
            output_path = os.path.split(os.path.abspath(route_file))
            out_routes = open(os.path.join(output_path[0], "computed_speed_"+output_path[1]), "w")
        for cur_line in route_data.readlines():
            cur_json = json.loads(cur_line)
            for cur_route in cur_json["features"]:
                cur_cords = np.array(cur_route["geometry"]["coordinates"])
                speed_col = compute_speed(cur_cords)
                cur_route["geometry"]["coordinates"] = np.hstack((cur_cords, speed_col)).tolist()
            if write2file:
                out_routes.write(json.dumps(cur_json))
                out_routes.write("\n")
            else:
                print(json.dumps(cur_json))

if __name__=="__main__":
    route_path = sys.argv[1]
    sys.path.append(os.path.abspath(sys.argv[2]))
    from strom.transform.derive_param import *
    add_computed_speed(route_path, write2file=True)
