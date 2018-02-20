class Driver extends Person {

  constructor(location, isHired = false) {
    super();
    this.location = location;
    this.isHired = isHired;
    this.Client = StromClient();
    this.turnCount = 0;
    this.turnCoords = null;
    this.flagTurn = this.flagTurn.bind(this);
    this.speedModifier = 0
    this.template = "{\"stream_name\": \"driver_data\", \"version\": 0, \"stream_token\": \"abc123\", \"timestamp\": null, \"template_id\": \"dumb\", \"user_description\": \"Demo_template\", \"measures\": {\"location\": {\"val\": null, \"dtype\": \"varchar(60)\"}}, \"fields\": {\"region-code\": {}}, \"user_ids\": {\"driver-id\": {}, \"id\": {}}, \"tags\": {}, \"foreign_keys\": [], \"dparam_rules\": [{\"partition_list\": [[\"driver-id\", \"Parham\",\"==\"]], \"measure_list\": [\"location\"], \"transform_type\": \"derive_param\", \"transform_name\": \"DeriveHeading\", \"param_dict\": {\"func_params\": {\"window_len\": 1, \"units\": \"deg\", \"heading_type\": \"bearing\", \"swap_lon_lat\": true}, \"measure_rules\": {\"spatial_measure\": \"location\", \"output_name\": \"headParham\"}}, \"logical_comparison\": \"AND\"}, {\"partition_list\": [[\"driver-id\", \"Molly\",\"==\"]], \"measure_list\": [\"location\"], \"transform_type\": \"derive_param\", \"transform_name\": \"DeriveHeading\", \"param_dict\": {\"func_params\": {\"window_len\": 1, \"units\": \"deg\", \"heading_type\": \"bearing\", \"swap_lon_lat\": true}, \"measure_rules\": {\"spatial_measure\": \"location\", \"output_name\": \"headMolly\"}}, \"logical_comparison\": \"AND\"}, {\"partition_list\": [[\"driver-id\", \"David\",\"==\"]], \"measure_list\": [\"location\"], \"transform_type\": \"derive_param\", \"transform_name\": \"DeriveHeading\", \"param_dict\": {\"func_params\": {\"window_len\": 1, \"units\": \"deg\", \"heading_type\": \"bearing\", \"swap_lon_lat\": true}, \"measure_rules\": {\"spatial_measure\": \"location\", \"output_name\": \"headDavid\"}}, \"logical_comparison\": \"AND\"},{\"partition_list\": [], \"measure_list\": [\"headParham\"], \"transform_type\": \"derive_param\", \"transform_name\": \"DeriveChange\", \"param_dict\": {\"func_params\": {\"window_len\": 1, \"angle_change\": true}, \"measure_rules\": {\"target_measure\": \"headParham\", \"output_name\": \"head_changeParham\"}}, \"logical_comparison\": \"AND\"},{\"partition_list\": [], \"measure_list\": [\"headMolly\"], \"transform_type\": \"derive_param\", \"transform_name\": \"DeriveChange\", \"param_dict\": {\"func_params\": {\"window_len\": 1, \"angle_change\": true}, \"measure_rules\": {\"target_measure\": \"headMolly\", \"output_name\": \"head_changeMolly\"}}, \"logical_comparison\": \"AND\"}, {\"partition_list\": [], \"measure_list\": [\"headDavid\"], \"transform_type\": \"derive_param\", \"transform_name\": \"DeriveChange\", \"param_dict\": {\"func_params\": {\"window_len\": 1, \"angle_change\": true}, \"measure_rules\": {\"target_measure\": \"headDavid\", \"output_name\": \"head_changeDavid\"}}, \"logical_comparison\": \"AND\"}], \"event_rules\": {\"turn_eventParham\": {\"partition_list\": [], \"measure_list\": [\"timestamp\", \"head_changeParham\"], \"transform_type\": \"detect_event\", \"transform_name\": \"DetectThreshold\", \"param_dict\": {\"event_rules\": {\"measure\": \"head_changeParham\", \"threshold_value\": 55, \"comparison_operator\": \">=\", \"absolute_compare\": true}, \"event_name\": \"turn_eventParham\", \"stream_id\": \"abc123\"}, \"logical_comparison\": \"AND\"}, \"turn_eventMolly\": {\"partition_list\": [], \"measure_list\": [\"timestamp\", \"head_changeMolly\"], \"transform_type\": \"detect_event\", \"transform_name\": \"DetectThreshold\", \"param_dict\": {\"event_rules\": {\"measure\": \"head_changeMolly\", \"threshold_value\": 55, \"comparison_operator\": \">=\", \"absolute_compare\": true}, \"event_name\": \"turn_eventMolly\", \"stream_id\": \"abc123\"}, \"logical_comparison\": \"AND\"}, \"turn_eventDavid\": {\"partition_list\": [], \"measure_list\": [\"timestamp\", \"head_changeDavid\"], \"transform_type\": \"detect_event\", \"transform_name\": \"DetectThreshold\", \"param_dict\": {\"event_rules\": {\"measure\": \"head_changeDavid\", \"threshold_value\": 55, \"comparison_operator\": \">=\", \"absolute_compare\": true}, \"event_name\": \"turn_eventDavid\", \"stream_id\": \"abc123\"}, \"logical_comparison\": \"AND\"}}, \"storage_rules\": {\"store_raw\": true, \"store_filtered\": true, \"store_derived\": true}, \"engine_rules\": {\"kafka\": \"test\"}}"
  }



  initClient() {
    this.Client.registerDevice(this.name, this.template, this.name.replace(/\s/g, ""));
    this.Client.registerEvent('turn_event' + this.name, this.flagTurn, true);
    //this.Client.registerEvent('speed_change_' + this.name, this.alertEvent, true);
  }

  alertEvent(resp) {
//    if (resp) {
//      alert(resp);
//    } else {
//      alert("Event");
//    }
  }

  setModifier(modifier){
    // Called by the modifyDriverSpeed function in Map to modify the speedModifier attribute
    // for a specific driver.
    this.speedModifier = modifier;
  }

  flagTurn(resp) {
    //let dictResp = JSON.parse(resp);
    let another = JSON.parse(JSON.parse(resp));
    console.log("event");
    // console.log(another.location);
    this.turnCount +=1;
    // console.log(this.turnCount);
    this.turnCoords = another.location;
    // this.turnCoords = JSON.parse(resp).event_context["location"];
    // console.log(this.turnCoords);
  }
}
