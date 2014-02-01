<?php


function parseLessVariableOption($vars, $type, $id){
	$option = get_option($id);
	
	//Pixels
	if($type == "pixels")
		$vars[$id] = $option."px";
	
	//Font
	else if($type == "font_picker"){
		$fontObj = getGoogleFontObject( $option );
		
		$vars[$id] = '"'.$fontObj["font"].'"';
		$vars[$id."_weight"] = $fontObj["weight"];
		$vars[$id."_style"] = $fontObj["style"];
	}
	
	//Other
	else
		$vars[$id] = $option;
		
	return $vars;
}


function getLessVariables(){
	global $plusquare_template_options;
	$vars = array();
	foreach($plusquare_template_options as $mainTab) {
		foreach ($mainTab['tabs'] as $tab) {
			foreach ($tab['options'] as $option) {
				if($option["type"] == "tabs_unbinded"){
					foreach($option["tabs"] as $tabUnb){
						foreach($tabUnb as $tabUnbTab){
							if(isset($tabUnbTab["less_var"]))
								$vars = parseLessVariableOption($vars, $tabUnbTab["type"], $tabUnbTab["id"]);
						}
					}
				}
				else if(isset($option["less_var"]))
					$vars = parseLessVariableOption($vars, $option["type"], $option["id"]);
			}
		}
	}	
	return $vars;
}