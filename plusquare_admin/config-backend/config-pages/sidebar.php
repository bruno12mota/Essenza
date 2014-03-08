<?php


/*
*  Create new pq meta box with the options set
*  @created: 18/11/13
*
*/
if(is_admin()){
	$sidebar_meta_options = array(
	    array(
			"label" => "Sidebar Builder",
	        "id" => "sidebar_builder_id",
			"type" => "sidebar_builder"
		)
	);
	new pq_meta_box($sidebar_meta_options, "sidebar");
}