<?php


/*
*  Contact Form Register
*
*  @description: Creates the Contact Form section in wordpress admin
*  @created: 28/02/14
*/

add_action( 'init', 'pq_contact_form' );
function pq_contact_form() {

	$labels = array(
		'name' => __("Contact Form"), 
		'singular_name' => __("Contact Form"), 
		'add_new' => __("Add New Contact Form"), 
		'add_new_item' => __("Add New Contact Form"),
		'edit_item' => __("Edit Contact Form"),
		'new_item' => __("New Contact Form"),
		'view_item' => __("View Contact Form"),
		'search_items' => __("Search Contact Form"),
		'not_found' =>  __("Not found"),
		'not_found_in_trash' => __("Trash is empty"),
		'parent_item_colon' => ''
	);
	
	register_post_type( 'contact_form' , array(
		'label'=> __('Contact Form'),
		'description'=> 'Special type of post for creating Contact Forms',
		'labels' => $labels,
		'public' => true,
		'menu_position' => 5,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => false,
		'publicly_queryable' => false,
		'exclude_from_search' => true,
		'query_var' => false,
		'menu_icon'=> 'dashicons-forms',
		'rewrite' => true,
		'capability_type' => 'page',
		'hierarchical' => false,
		'supports' => array( 'title', 'editor')
		)
	); 
	
	flush_rewrite_rules();
}