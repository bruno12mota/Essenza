<?php


/*
*  Actions performed only in the backend
*/
if(is_admin()){
	/*
	*  Create new pq meta box with the options set
	*/
	$slider_meta_options = array(
	    array(
			"label" => "Slider Builder",
	         "id" => "slider_builder_id",
			"type" => "slider_builder"
		)
	);

	new pq_meta_box($slider_meta_options, "slider", false);
}