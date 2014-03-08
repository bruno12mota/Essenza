<?php



/*
*  Portfolio Register
*
*  @description: Creates the portfolio section in wordpress admin
*  @created: 19/12/12
*/

add_action( 'init', 'pq_portfolio' );
function pq_portfolio() {
	 
	$labels = array(
		'name' => "Portfolio",
		'singular_name' => "Portfolio",
		'add_new' => "Add New Work",
		'add_new_item' => "Add New Work",
		'edit_item' => "Edit Work",
		'new_item' => "New Work",
		'view_item' => "View Work",
		'search_items' => "Search Work",
		'not_found' =>  "Not found",
		'not_found_in_trash' => "Trash is empty",
		'parent_item_colon' => ''
	);
	
	register_post_type( 'portfolio' , array(
		'label'=> 'Portfolio',
		'description'=> 'Special type of post for creating work',
		'labels' => $labels,
		'public' => true,
		'menu_position' => 5,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => true,
		'publicly_queryable' => true,
		'exclude_from_search' => false,
		'query_var' => true,
		'menu_icon'=> 'dashicons-portfolio',
		'rewrite' => array("slug" => "portfolio"), // Permalinks format
		'capability_type' => 'post',
		'hierarchical' => false,
		'has_archive' => false,
		'supports' => array( 'title')
		)
	  ); 
	
	/*
	*  Portfolio Categories Taxonomy
	*/
	
	$taxonomy_portfolio_category_labels = array(
		'name' => 'Portfolio Categories',
		'singular_name' => 'Portfolio Category',
		'search_items' => 'Search Portfolio Categories',
		'popular_items' => 'Popular Portfolio Categories',
		'all_items' => 'All Portfolio Categories',
		'parent_item' => 'Parent Portfolio Category',
		'parent_item_colon' => 'Parent Portfolio Category:',
		'edit_item' => 'Edit Portfolio Category',
		'update_item' => 'Update Portfolio Category',
		'add_new_item' => 'Add New Portfolio Category',
		'new_item_name' => 'New Portfolio Category Name',
		'separate_items_with_commas' => 'Separate portfolio categories with commas',
		'add_or_remove_items' => 'Add or remove portfolio categories',
		'choose_from_most_used' => 'Choose from the most used portfolio categories',
		'menu_name' => 'Portfolio Categories'
	);
	$taxonomy_portfolio_category_args = array(
		'labels' => $taxonomy_portfolio_category_labels,
		'public' => true,
		'show_in_nav_menus' => false,
		'show_ui' => true,
		'show_tagcloud' => true,
		'hierarchical' => false,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'portfolio_category' )
	);
	register_taxonomy( "portfolio_category", array("portfolio"), $taxonomy_portfolio_category_args);
	
	//$wp_rewrite->flush_rules();
	flush_rewrite_rules();
}

