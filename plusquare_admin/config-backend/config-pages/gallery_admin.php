<?php

if(is_admin()){
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
		
	    <style>
			#posts-filter, .subsubsub{display: none;}
		</style>
	    <script type="text/javascript">
			require(["ui/CustomGridListing"],
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
}