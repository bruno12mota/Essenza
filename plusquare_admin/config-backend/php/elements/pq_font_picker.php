<?php 

class pq_font_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare font picker
	*
	*	@author Plusquare
	*	@date 12-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		global $pq_shortname;
		
		//Get fonts
		$fontsJsonStr = get_option($pq_shortname."_google_fonts");
		$fontsJson = json_decode($fontsJsonStr);
		fb::log($pq_shortname);
		fb::log($fontsJsonStr);
		fb::log($fontsJson);
		
		$options = array();
		$values = array();
		
		if($fontsJsonStr !== FALSE && $fontsJsonStr != NULL && $fontsJsonStr != ""){
			foreach($fontsJson->items as $item){
				$fontName = $item->family;	
				
				//Variants
				foreach($item->variants as $variant){
					array_push($options, $fontName." (".$variant.")");
					array_push($values, $fontName.":".$variant);
				}
			}
		}
		
		//pq_combobox
		new pq_combobox($id, $options, $values, $value);
	}
	
	
}