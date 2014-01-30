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
		//'menu_icon'=>get_stylesheet_directory_uri() . '/images/Gallery_icon.png',
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






/*
*  Gallery items custom listing 
*
*  @description: Makes a custom display of the items available
*  @created: 16/01/13
*/

add_action('admin_head-edit.php','startGalleryCustomListing');
function startGalleryCustomListing(){
	//posts-filter
	global $post_type;
	if($post_type != "gallery")
		return;
	
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
			 	new CustomGridListing("gallery", "item_thumb");
			}
		);
	</script>
    <?php
}



/*
*  Create new pq meta box with the options set
*  @created: 16/01/13
*
*/


$meta_options = array(
	//Short Description
	array(
		"label" => "Short Description",
		"id" => "item_description",
		"type" => "text_editor",
		"info" => "Appears on the lightbox as the description of your content."
	),
	
	
	//Gallery item type
	array(
		"label" => "Item Media Type",
		"id" => "item_media_type",
		"type" => "tabs",
		"options" => array("Image", "Video", "Sound", "SoundCloud", "Link"),
		"values" => array("image", "video", "sound", "soundcloud", "link"),
		"default" => "text",
		"tabs" => array(
			//Image type
			"image" => array(
				array(
					"label" => "Item Image",
					"id" => "item_main_media",
					"type" => "media_single_picker",
					"width" => 500,
					"height" => 300,
					"info" => "This image will do as thumbnail and will open in lightbox with higher resolution."
				)
			),
			
			//Video type
			"video" => array(
				//Video type (youtube, vimeo, dailymotion)
				array(
					"label" => "Item Video",
					"id" => "item_video_type",
					"type" => "video_picker",
					"default" => "youtube",
					"info" => "This video will appear on the lightbox when you open the item. Pick the social video site where your video is located."
				),
				
				//Social video id
				array(
					"label" => "Item Video Id",
					"id" => "item_video_id",
					"type" => "text",
					"help" => "Social video id you want to play, note you only need to put the video id here, not a embedding code!"
				)
			),
			
			//Sound type
			"sound" => array(
				array(
					"label" => "Sound",
					"id" => "item_sound_url",
					"type" => "sound_picker",
					"help" => "Pick a sound or music you uploaded in the media uploader section."
				),
				array(
					"label" => "Sound Title",
					"id" => "item_sound_title",
					"type" => "text",
					"help" => "The tile for the sound or music you want to appear on the music player."
				),
				array(
					"label" => "Sound Artist",
					"id" => "item_sound_artist",
					"type" => "text",
					"help" => "The artist/musician/band for the sound or music you want to appear on the music player."
				)
			),
			
			//Soundcloud type
			"soundcloud" => array(
				array(
					"label" => "Soundcloud Music",
					"id" => "item_soundcloud_url",
					"type" => "text",
					"help" => "The url of the music you wanted hosted on soundcloud."
				),
				array(
					"label" => "Sound Title",
					"id" => "item_soundcloud_title",
					"type" => "text",
					"help" => "The tile for the sound or music you want to appear on the music player."
				),
				array(
					"label" => "Sound Artist",
					"id" => "item_soundcloud_artist",
					"type" => "text",
					"help" => "The artist/musician/band for the sound or music you want to appear on the music player."
				)
			),
			
			//link type
			"link" => array(
				array(
					//external link
					"label" => "Link url",
					"id" => "item_external_link",
					"type" => "text",
					"default" => "http://",
					"help" => "The url for an external page for this work. Ex: 'http://a-work.com/"
				),
				array(
					//external link target
					"label" => "Link Target",
					"id" => "item_external_link_target",
					"type" => "combobox",
					"options" => array("New Tab", "On the same window"),
					"values" => array("_blank", "_self"),
					"default" => "_blank",
					"help" => "Where you want external link to open to."
				)
			)
		)
	),
				
	//Item tumbnail
	array(
		"label" => "Item Thumbnail",
		"id" => "item_thumb",
		"type" => "media_single_picker",
		"width" => 200,
		"height" => 200,
		"info" => "This image will do as thumbnail."
	),
	
	//Item thumbnail limit height
	array(
		"label" => "Item Thumbnail Use Limit",
		"id" => "item_thumb_limit",
		"type" => "checkbox",
		"values" => array("false", "true"),
		"default" => "false",
		"help" => "Check this if you want to limit this item's height."
	),
	
	//Item thumbnail limit height pixels
	array(
		"label" => "Item Thumbnail Limit Height (px.)",
		"id" => "item_thumb_height",
		"type" => "pixels",
		"default" => "200",
		"help" => "The amount in pixels of height you want this item to have."
	),
	
	//Item thumbnail limit Crop Alignment
	array(
		"label" => "Item Thumbnail Limit Crop Alignment",
		"id" => "item_thumb_crop_alignment",
		"type" => "combobox",
		"options" => array("Center", "Top", "Right", "Bottom", "Left", "Top Left Corner", "Top Right Corner", "Bottom Right Corner", "Bottom Left Corner"),
		"values" => array("c", "t", "r", "b", "l", "tl", "tr", "br", "bl"),
		"default" => "c",
		"help" => "The part of your image you want to show."
	),
	
	//Position
	array(
		"label" => "Position",
		"id" => "position",
		"type" => "text",
		"default" => "-1",
		"hidden" => true
	),
);

include_once(get_template_directory() . '/plusquare_admin/php/pq_meta_box.php');
new pq_meta_box($meta_options, "gallery");


add_action('admin_head','customGalleryOptions');
function customGalleryOptions(){
	//posts-filter
	global $post_type;
	if($post_type != "gallery")
		return;
	
	if(isset($_POST["action"]) && $_POST["action"] == "edit"){
		//Save grid
		$args = array( 	
			'post_type' => 'gallery', 
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
	
	?>
    <script>
		jQuery(document).ready(function($){
			var $mainInput = $("#item_main_media");
			var $type = $("#item_media_type");
			var $thumbInput = $("#item_thumb");
			var $thumbHolder = $("#item_thumb_option_main_holder");
			
			//Limited checkbox
			var $checkboxLimit = $("#item_thumb_limit");
			
			//visible when limited is checked
			var $visibleWhenLimited = $("#item_thumb_height_option_main_holder, #item_thumb_crop_alignment_option_main_holder");
			
			
			//On limited changed
			function limitChanged(){
				var value = $checkboxLimit.val();
				
				if(value == "true"){
					$visibleWhenLimited.css("display", "block");
				}
				else{
					$visibleWhenLimited.css("display", "none");
				}
			}
			limitChanged();
			$checkboxLimit.bind("change", limitChanged);
			
			
			function mainChanged(){
				if($type.val() == "image"){
					if($thumbInput.val() == ""){
						var value = $mainInput.val();
						$thumbInput.val(value).trigger("update");
					}
				}
			}
			$mainInput.bind("change", mainChanged);
			
			mainChanged();
		});
	</script>
    <?php
}