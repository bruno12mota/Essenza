<?php


/*
*  Sidebar Register
*
*  @description: Creates the Sidebar section in wordpress admin
*  @created: 18/11/13
*/

add_action( 'init', 'pq_sidebar' );
function pq_sidebar() {

	$labels = array(
		'name' => __("Sidebar"), 
		'singular_name' => __("Sidebar"), 
		'add_new' => __("Add New Sidebar"), 
		'add_new_item' => __("Add New Sidebar"),
		'edit_item' => __("Edit Sidebar"),
		'new_item' => __("New Sidebar"),
		'view_item' => __("View Sidebar"),
		'search_items' => __("Search Sidebar"),
		'not_found' =>  __("Not found"),
		'not_found_in_trash' => __("Trash is empty"),
		'parent_item_colon' => ''
	);
	
	register_post_type( 'sidebar' , array(
		'label'=> __('Sidebar'),
		'description'=> 'Special type of post for creating Sidebars',
		'labels' => $labels,
		'public' => true,
		'menu_position' => 5,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => false,
		'publicly_queryable' => false,
		'exclude_from_search' => true,
		'query_var' => false,
		'menu_icon'=> 'dashicons-editor-indent',
		'rewrite' => true,
		'capability_type' => 'page',
		'hierarchical' => false,
		'supports' => array( 'title', 'editor')
		)
	); 
	
	flush_rewrite_rules();
}