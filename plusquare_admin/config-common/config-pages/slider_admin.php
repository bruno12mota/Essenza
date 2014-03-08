<?php



/*
*  Slider Register
*
*  @description: Creates the Slider section in wordpress admin
*  @created: 19/12/12
*/

add_action( 'init', 'pq_slider' );
function pq_slider() {
	 
	$labels = array(
		'name' => "Slider", 
		'singular_name' => "Slider", 
		'add_new' => "Add New Slider", 
		'add_new_item' => "Add New Slider",
		'edit_item' => "Edit Slider",
		'new_item' => "New Slider",
		'view_item' => "View Slider",
		'search_items' => "Search Slider",
		'not_found' =>  "Not found",
		'not_found_in_trash' => "Trash is empty",
		'parent_item_colon' => ''
	);
	
	register_post_type( 'slider' , array(
		'label'=> 'Slider',
		'description'=> 'Special type of post for creating Slider Item',
		'labels' => $labels,
		'public' => true,
		'menu_position' => 5,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => true,
		'publicly_queryable' => true,
		'exclude_from_search' => true,
		'query_var' => true,
		'menu_icon'=> "dashicons-images-alt2",
		'rewrite' => true,
		'capability_type' => 'page',
		'hierarchical' => false,
		'supports' => array( 'title', 'editor')
		)
	  ); 
	
	//$wp_rewrite->flush_rules();
	flush_rewrite_rules();
}

