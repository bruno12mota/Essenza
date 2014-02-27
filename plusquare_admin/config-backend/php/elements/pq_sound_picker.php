<?php 

class pq_sound_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare sound picker
	*
	*	@author Plusquare
	*	@date 01-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		//Get sliders
		$values = array();
		$options = array();
		$sounds = get_children(
				array(
					'post_type' => 'attachment',
					'post_mime_type' => 'audio'
				)
			);
		//if(WP_DEBUG)fb::log($sounds);
		foreach( $sounds as $sound_id => $sound ) :	
			array_push($values, $sound->guid);
			array_push($options, $sound->post_title);
		endforeach;
		
		
		//pq_combobox
		new pq_combobox($id, $options, $values, $value);
	}
	
	
}