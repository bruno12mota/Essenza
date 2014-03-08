<?php



/*
*  Gallery Register
*
*  @description: Creates the Gallery section in wordpress admin
*  @created: 19/12/12
*/

add_action( 'init', 'pq_gallery' );
function pq_gallery() {
	 
	$labels = array(
		'name' => "Gallery",
		'singular_name' => "Gallery",
		'add_new' => "Add New Gallery Item",
		'add_new_item' => "Add New Gallery Item",
		'edit_item' => "Edit Gallery Item",
		'new_item' => "New Gallery Item",
		'view_item' => "View Gallery Item",
		'search_items' => "Search Gallery Item",
		'not_found' =>  "Not found",
		'not_found_in_trash' => "Trash is empty",
		'parent_item_colon' => ''
	);
	
	register_post_type( 'gallery' , array(
		'label'=> 'Gallery',
		'description'=> 'Special type of post for creating Gallery Item',
		'labels' => $labels,
		'public' => true,
		'menu_position' => 5,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => false,
		'publicly_queryable' => true,
		'exclude_from_search' => false,
		'query_var' => true,
		'menu_icon'=> 'dashicons-format-gallery',
		'rewrite' => array("slug" => "gallery"), // Permalinks format
		'capability_type' => 'post',
		'hierarchical' => false,
		'supports' => array( 'title')
		)
	  ); 

	/*
	*  Gallery Categories Taxonomy
	*
	*  @description: Makes Gallery Gallery Items categorizable
	*  @created: 19/12/12
	*/
	
	$taxonomy_gallery_category_labels = array(
		'name' => 'Gallery Categories',
		'singular_name' => 'Gallery Category',
		'search_items' => 'Search Gallery Categories',
		'popular_items' => 'Popular Gallery Categories',
		'all_items' => 'All Gallery Categories',
		'parent_item' => 'Parent Gallery Category',
		'parent_item_colon' => 'Parent Gallery Category:',
		'edit_item' => 'Edit Gallery Category',
		'update_item' => 'Update Gallery Category',
		'add_new_item' => 'Add New Gallery Category',
		'new_item_name' => 'New Gallery Category Name',
		'separate_items_with_commas' => 'Separate Gallery categories with commas',
		'add_or_remove_items' => 'Add or remove Gallery categories',
		'choose_from_most_used' => 'Choose from the most used Gallery categories',
		'menu_name' => 'Gallery Categories'
	);
	$taxonomy_gallery_category_args = array(
		'labels' => $taxonomy_gallery_category_labels,
		'public' => true,
		'show_in_nav_menus' => false,
		'show_admin_column' => true,
		'show_ui' => true,
		'show_tagcloud' => true,
		'hierarchical' => false,
		'rewrite' => array("slug" => "galleries"), // Permalinks format
		'query_var' => true
	);
	register_taxonomy( "galleries", array("gallery"), $taxonomy_gallery_category_args);
	
	//$wp_rewrite->flush_rules();
	flush_rewrite_rules();
}