import sys, os, json, random
import numpy as np

def add_constant_speed(route_file, speed_per_route=True):
    with open(route_file) as route_data:
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
            out_routes.write(json.dumps(cur_json))
            out_routes.write("\n")


if __name__=="__main__":
    route_path = sys.argv[1]
    add_constant_speed(route_path)
