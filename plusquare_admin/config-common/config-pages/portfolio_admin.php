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








/*
*  Actions performed only in the backend
*/
if(is_admin()){
	/*
	*  Portfolio works custom listing 
	*
	*  @description: Makes a custom display of the works available
	*  @created: 26/12/12
	*/

	add_action('admin_head-edit.php','startCustomListing');
	function startCustomListing(){
		//posts-filter
		global $post_type;
		if($post_type != "portfolio")
			return;
		
		if(isset($_POST["action"]) && $_POST["action"] == "edit"){
			//Save grid
			$args = array( 	
				'post_type' => 'portfolio', 
				'orderby' => 'meta_value_num', 
				'meta_key' => 'position',
				'order' => 'ASC',
				'nopaging'=> true);
		
			//get gallery items
			$posts = new WP_Query( $args );	
			$count = 0;
			if($posts->have_posts()): 
				while($posts->have_posts()):  $posts->the_post();
					update_post_meta($post->ID, 'position', $count);
					$count++;
				endwhile; 
			endif; 
			
	        // Restore original Query & Post Data
	        wp_reset_query();
	        wp_reset_postdata();
		}
		
		wp_enqueue_script('wp-ajax-response');
		?>
	    
	    <link href="<?php echo get_template_directory_uri(); ?>/plusquare_admin/css/meta_options.css" rel="stylesheet" type="text/css" />
	    <link href="<?php echo get_template_directory_uri(); ?>/plusquare_admin/css/fonts/stylesheet.css" rel="stylesheet" type="text/css" />
	    <script data-main="<?php echo get_template_directory_uri(); ?>/plusquare_admin/js/CustomGridListing" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/js/require-jquery.js"></script>
	    
	    <style>
			#posts-filter, .subsubsub{display: none;}
		</style>
	    <script type="text/javascript">
			require(["CustomGridListing"],
				function(CustomGridListing) {
					adminAjax = "<?php echo get_site_url(); ?>/wp-admin/admin-ajax.php";
				 	new CustomGridListing("portfolio", "thumbnail");
				}
			);
		</script>
	    <?php
	}





	/*
	*  Create new pq meta box with the options set
	*/
	$essenza_portfolio_description_background_color = get_option("esza_portfolio_description_background_color");
	$essenza_portfolio_description_background_color = $essenza_portfolio_description_background_color === false ? "#333333" : $essenza_portfolio_description_background_color;
	$meta_options = array(

	    array(
			//thumbnail
			"label" => "Thumbnail",
			"id" => "thumbnail",
			"type" => "media_single_picker",
			"width" => 416,
			"height" => 278,
			"info" => "This will be the image appearing on the portfolio grid!"
		),
		array(
			//short
			"label" => "Short Description",
			"id" => "item_short",
			"type" => "text_area",
			"default" => "Short description to show on the portfolio main page",
			"help" => "Item short description that will appear on the portfolio grid page when hovering this item"
		),
		array(
			//short
			"label" => "Short Description Background Color",
			"id" => "item_desc_back",
			"type" => "color_palette_picker",
			"default" => $essenza_portfolio_description_background_color,
			"help" => "Item short description background color."
		),
		array(
			//external link
			"label" => "External Link (overrides normal behaviour)",
			"id" => "item_external_link",
			"type" => "text",
			"default" => "",
			"alert" => "If you put a link here this work won't have a single portfolio page! You don't need to fill anything else from External Link target on as it's work detail page options.",
			"info" => "Leave blank for normal behaviour (work on click opens the work detail page)",
			"help" => "The url for an external page for this work. Ex: 'http://a-work.com/"
		),
		array(
			//external link target
			"label" => "External Link Target",
			"id" => "item_external_link_target",
			"type" => "combobox",
			"options" => array("New Tab", "On the same window"),
			"values" => array("_blank", "_self"),
			"default" => "_blank",
			"help" => "Where you want external link to open to.",
		),
		array(
			//external link
			"label" => "Close Button Link (overrides normal behaviour)",
			"id" => "item_close_link",
			"type" => "text",
			"default" => "",
			"info" => "Leave blank for normal behaviour (close on click goes back to the portfolio overview)",
			"help" => "The url for the single portfolio page close button."
		),


		array(
			//Description horizontal position
			"label" => "Description Horizontal Position",
			"id" => "horizontal_position",
			"type" => "percentage",
			"default" => "10",
			"help" => "Percentage horizontal position in relation to the window's size for where you want the description to appear when viewing this work"
		),
		array(
			//post formats
			"label" => "Description Vertical Position",
			"id" => "vertical_position",
			"type" => "percentage",
			"default" => "90",
			"help" => "Percentage vertical position in relation to the window's size for where you want the description to appear when viewing this work"
		),
		array(
			//Description Open To
			"label" => "Description Opened",
			"id" => "description_opened",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "false",
			"help" => "Check to have the description opened when entering this work",
			"alert" => "Note that when the user closes the description in one work then goes to another work that has description opened checked, the description will appear closed as per user definition!"
		),
		array(
			//short
			"label" => "Item Description",
			"id" => "item_desc",
			"type" => "text_editor",
			"info" => "You can add google+, twitter share and facebook like by inserting the following shortcodes respectively [google_plus], [twitter_button] or [facebook_like]"
		),
		array(
			//short
			"label" => "Item Position",
			"id" => "position",
			"type" => "text",
			"default" => "-1",
			"hidden" => true
		),
	    array(
			//post formats
			"label" => "Images",
			"id" => "images",
			"type" => "media_picker",
			"media_type" => "video",
			"sizing" => true,
			"info" => "Click add images or add other content (video and sound) to add slides to your work. You can also drag them around to set their order"
		),
	    array(
			//post formats
			"label" => "Autoplay Works",
			"id" => "autoplay",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"help" => "Check to add autoplay to this work's slider"
		),
	    array(
			//autoplay_time
			"label" => "Autoplay Time (sec.)",
			"id" => "autoplay_time",
			"type" => "text",
			"default" => "10",
			"help" => "Time in seconds for the slider to change image"
		),
	    array(
			//post formats
			"label" => "KenBurns Effect",
			"id" => "use_kenburns",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"help" => "Check to add ken burns effect for fullscreen images that go beyond borders"
		),
	    array(
			//autoplay_time
			"label" => "Ken Burns Duration (sec.)",
			"id" => "kenburns_time",
			"type" => "text",
			"default" => "10",
			"help" => "If you set ken burns effect to true then here you can change the time that will take the image to tween from end to end"
		),
	    array(
			//background color
			"label" => "Background Color",
			"id" => "background_color",
			"type" => "color_palette_picker",
			"default" => "#cccccc",
			"info" => "This will be the background color of the slider!"
		)
	);

	new pq_meta_box($meta_options, "portfolio");
}

