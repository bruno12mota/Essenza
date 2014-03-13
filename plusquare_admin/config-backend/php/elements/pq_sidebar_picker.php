<?php 

class pq_sidebar_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare sidebar picker
	*
	*	@author Plusquare
	*	@date 11-03-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;

		$options = array();
		$values = array();
		
		$args = array( 'post_type' => 'sidebar', 'nopaging' => true , 'post_status' => 'publish');
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) : $loop->the_post(); 
			global $post;
			array_push($options, get_the_title($post->ID));
			array_push($values, $post->ID);
		endwhile;
		wp_reset_postdata();
		
		if(WP_DEBUG)fb::log($value);

		//pq_combobox
		new pq_combobox($id, $options, $values, $value);
	}
}