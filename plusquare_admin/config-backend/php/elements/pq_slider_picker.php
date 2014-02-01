<?php 

class pq_slider_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare slider picker
	*
	*	@author Plusquare
	*	@date 28-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		//Get sliders
		$values = array();
		$options = array();
		$args = array( 'post_type' => 'slider', 'nopaging'=> true );
		$myposts = get_posts( $args );
		foreach( $myposts as $slide ) :	
			array_push($values, $slide->ID);
			array_push($options, $slide->post_title);
		endforeach;
		
		
		//pq_combobox
		new pq_combobox($id, $options, $values, $value);
	}
	
	
}