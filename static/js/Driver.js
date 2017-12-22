class Driver extends Person {

  constructor(location, isHired = false) {
    super();
    this.location = location;
    this.isHired = isHired;
    this.Client = StromClient();
    this.speedModifier = 0
    this.template = "{\"stream_name\": \"driver_data\", \"version\": 0, \"stream_token\": \"abc123\", \"timestamp\": null, \"measures\": {\"location\": {\"val\": null, \"dtype\": \"varchar(60)\"}}, \"fields\": {\"region-code\": {}}, \"user_ids\": {\"driver-id\": {}, \"id\": {}}, \"tags\": {}, \"foreign_keys\": [], \"dparam_rules\": [{\"func_name\": \"DeriveHeading\", \"func_type\": \"derive_param\", \"func_params\": {\"window\": 1, \"units\": \"deg\", \"heading_type\": \"bearing\", \"swap_lon_lat\": true}, \"measure_rules\": {\"spatial_measure\": \"location\", \"output_name\": \"bears\"}, \"measures\": [\"location\"]}, {\"func_name\": \"DeriveChange\", \"func_type\": \"derive_param\", \"func_params\": {\"window\": 1, \"angle_change\": true}, \"measure_rules\": {\"target_measure\": \"bears\", \"output_name\": \"change_in_heading\"}, \"derived_measures\": [\"bears\"]}, {\"func_name\": \"DeriveDistance\", \"func_type\": \"derive_param\", \"func_params\": {\"window\": 1,\"distance_func\":\"great_circle\" , \"swap_lon_lat\": true}, \"measure_rules\": {\"spatial_measure\": \"location\", \"output_name\": \"distance\"}, \"measures\": [\"location\"]},{\"func_name\": \"DeriveChange\", \"func_type\": \"derive_param\", \"func_params\": {\"window\": 1,\"angle_change\":false}, \"measure_rules\": {\"target_measure\": \"timestamp\", \"output_name\": \"delta_time\"}, \"measures\": [\"timestamp\"]},{\"func_name\": \"DeriveSlope\", \"func_type\": \"derive_param\", \"func_params\": {\"window\": 1}, \"measure_rules\": {\"rise_measure\": \"distance\", \"run_measure\":\"delta_time\", \"output_name\": \"speed\"}, \"derived_measures\": [\"delta_time\", \"distance\"]},{\"func_name\": \"DeriveScaled\", \"func_type\": \"derive_param\", \"func_params\": {\"scalar\": 360000}, \"measure_rules\": {\"target_measure\": \"speed\", \"output_name\": \"mph\"}, \"derived_measures\": [\"speed\"]}, {\"func_name\": \"DeriveWindowSum\", \"func_type\": \"derive_param\", \"func_params\": {\"window\": 3}, \"measure_rules\": {\"target_measure\": \"change_in_heading\", \"output_name\": \"windowed_change_heading\"}, \"derived_measures\": [\"change_in_heading\"]}], \"event_rules\": {\"turn_event\": {\"func_type\": \"detect_event\", \"func_name\": \"DetectThreshold\", \"event_rules\": {\"measure\": \"windowed_change_heading\", \"threshold_value\": 45, \"comparison_operator\": \">=\", \"absolute_compare\":true}, \"event_name\": \"turn_event\", \"stream_token\": null, \"derived_measures\": [\"windowed_change_heading\"]},\"speed_change\": {\"func_type\": \"detect_event\", \"func_name\": \"DetectThreshold\", \"event_rules\": {\"measure\": \"mph\", \"threshold_value\": 5, \"comparison_operator\": \">=\", \"absolute_compare\":true}, \"event_name\": \"speed_change\", \"stream_token\": null, \"derived_measures\": [\"mph\"]}}, \"storage_rules\":{\"store_raw\":true, \"store_filtered\":true, \"store_derived\":true}, \"engine_rules\":{\"kafka\":\"test\"}}"
  }

  initClient() {
    this.Client.registerDevice(this.name, this.template, this.name.replace(/\s/g, ""));
    this.Client.registerEvent('turn_event_' + this.name, this.alertEvent, true);
    this.Client.registerEvent('speed_change_' + this.name, this.alertEvent, true);
  }

  alertEvent(resp) {
//    if (resp) {
//      alert(resp);
//    } else {
//      alert("Event");
//    }
  }

  setModifier(modifier){
    this.speedModifier = modifier;
  }
}
