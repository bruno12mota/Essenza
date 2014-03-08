<?php


/*
*  Actions performed only in the backend
*/
if(is_admin()){
	/*
	*  Create new pq meta box with the options set
	*/

	$post_meta_options = array(

		//Post content builder
		array(
			"label" => "Visual Pagebuilder",
			"id" => "page_builder_id",
			"type" => "page_builder",
			"info" => "You can make the content of your page here with our brand new visual pagebuilder where you can create content easily and fast with no knowledge of coding and shortcodes or effort!"
		),
		
		//Post description
		array(
			"label" => "Post Description",
			"id" => "description",
			"type" => "text_editor",
			"info" => "Appears as the preview of your post."
		),
		
	   
		//Post type
		array(
			"label" => "Post Type",
			"id" => "post_media_type",
			"type" => "tabs",
			"options" => array("Text", "Image", "Video", "Slider", "Gallery", "Sound", "Soundcloud", "Tweet", "Quote"),
			"values" => array("text", "image", "video", "slider", "gallery", "sound", "soundcloud", "tweet", "quote"),
			"default" => "text",
			"tabs" => array(
				//Text type
				"text" => array(
					"label" => "Text type",
					"info" => "Text post type doesn't require more info."
				),
				
				//Image type
				"image" => array(
					array(
						"label" => "Post Image",
						"id" => "post_image",
						"type" => "media_single_picker",
						"width" => 600,
						"height" => 240,
						"info" => "This image will appear right above your post's title."
					),
					
					//Item thumbnail limit height pixels
					array(
						"label" => "Item Thumbnail Limit Height (px.)",
						"id" => "post_image_height",
						"type" => "pixels",
						"default" => "240",
						"help" => "The amount in pixels of the height you want the image to have in relation to 650 width (it will resize according to the space available).",
						"info" => "Put 0 (zero) if you want the image to not crop"
					),
					
					//Item thumbnail limit height pixels in overview
					array(
						"label" => "Item Thumbnail Limit Height In Overview (px.)",
						"id" => "post_image_height_overview",
						"type" => "pixels",
						"default" => "140",
						"help" => "The amount in pixels of the height you want the image to have, depending on the blog type the post will be in, in relation with the masonry blog tile (440px) or regular blog preview (650px).",
						"info" => "Put 0 (zero) if you want the image to not crop"
					),
					
					//Item thumbnail limit Crop Alignment
					array(
						"label" => "Item Thumbnail Limit Crop Alignment",
						"id" => "post_image_crop_alignment",
						"type" => "combobox",
						"options" => array("Center", "Top", "Right", "Bottom", "Left", "Top Left Corner", "Top Right Corner", "Bottom Right Corner", "Bottom Left Corner"),
						"values" => array("c", "t", "r", "b", "l", "tl", "tr", "br", "bl"),
						"default" => "c",
						"help" => "The part of your image you want to show."
					)
				),
				
				//Video type
				"video" => array(
					//Video type (youtube, vimeo, dailymotion)
					array(
						"label" => "Post Video",
						"id" => "post_video_type",
						"type" => "video_picker",
						"default" => "youtube",
						"info" => "This video will appear right above your post's title. Pick the social video site where your video is located."
					),
					
					//Social video id
					array(
						"label" => "Post Video Id",
						"id" => "post_video_id",
						"type" => "text",
						"help" => "Social video id you want to play, note you only need to put the video id here, not a embedding code!"
					),

					//Item thumbnail limit height pixels
					array(
						"label" => "Video Height (%)",
						"id" => "post_video_height",
						"type" => "percentage",
						"default" => "56",
						"info" => "The height of the video is calculated according to the width, so you can define an aspect ratio for the video, the default is 56% as it represents the 16:9 format!",
					),
					
					//Item thumbnail limit height pixels in overview
					array(
						"label" => "Video Height In Overview (%)",
						"id" => "post_video_height_overview",
						"type" => "percentage",
						"default" => "56",
						"info" => "The height of the video is calculated according to the width, so you can define an aspect ratio for the video, the default is 56% as it represents the 16:9 format!",
					),
			
					//Social video id
					array(
						"label" => "Video Use Cover",
						"id" => "post_video_use_cover",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "false",
						"info" => "Check this if you want to display an image before the video!"
					),
					
					//Social video id
					array(
						"label" => "Video Cover",
						"id" => "post_video_cover",
						"type" => "media_single_picker",
						"width" => 200,
						"height" => 200,
						"info" => "Select the image you want to use as cover for this video object!"
					)
				),
				
				//Slider type
				"slider" => array(
					"label" => "Slider",
					"id" => "post_slider",
					"type" => "slider_picker",
					"help" => "Pick the slider you want to show up for the post, to create a new one or modify an existing one see the slider menu on the left admin bar."
				),
				
				//Gallery type
				"gallery" => array(
					array(
						"label" => "Gallery Images",
						"id" => "post_images",
						"type" => "media_picker",
						"sizing" => false,
						"info" => "Choose the images you want to appear right above the post's title."
					),
					array(
						"label" => "Gallery Images Width",
						"id" => "post_images_width",
						"type" => "pixels",
						"default" => "100",
						"info" => "Choose the width you want each image to have."
					),
					array(
						"label" => "Gallery Images Height",
						"id" => "post_images_height",
						"type" => "pixels",
						"default" => "100",
						"info" => "Choose the height you want each image to have."
					)
				),
				
				//Sound type
				"sound" => array(
					array(
						"label" => "Sound",
						"id" => "post_sound_url",
						"type" => "sound_picker",
						"help" => "Pick a sound or music you uploaded from the dropbox."
					),
					array(
						"label" => "Sound Title",
						"id" => "post_sound_title",
						"type" => "text",
						"help" => "The tile for the sound or music you want to appear on the music player."
					),
					array(
						"label" => "Sound Artist",
						"id" => "post_sound_artist",
						"type" => "text",
						"help" => "The artist/musician/band for the sound or music you want to appear on the music player."
					)
				),
				
				//Soundcloud type
				"soundcloud" => array(
					array(
						"label" => "Soundcloud Music",
						"id" => "post_soundcloud_url",
						"type" => "text",
						"help" => "The url of the music you wanted hosted on soundcloud."
					),
					array(
						"label" => "Sound Title",
						"id" => "post_soundcloud_title",
						"type" => "text",
						"help" => "The tile for the sound or music you want to appear on the music player."
					),
					array(
						"label" => "Sound Artist",
						"id" => "post_soundcloud_artist",
						"type" => "text",
						"help" => "The artist/musician/band for the sound or music you want to appear on the music player."
					)
				),

				
				//Tweet type
				"tweet" => array(
					"label" => "Post Tweet",
					"id" => "tweet_id",
					"type" => "text",
					"help" => "The id for the tweet you want to show."
				),
				
				//Quote type
				"quote" => array(
					array(
						"label" => "Quote Text",
						"id" => "post_quote",
						"type" => "text_area"
					),
					array(
						"label" => "Quote Author",
						"id" => "post_quote_author",
						"type" => "text"
					)
				)
			)
		),

		array(
			"label" => "Post Options",
			"id" => "post_options_unb",
			"type" => "tabs_unbinded",
			"options" => array("Page", "Format&Date Menu" ,"Snapping", "Background", "Sidebar", "Mosaic"),
			"tabs" => array(
				//Page
				array(
					//Page Alignment
					array(
						"label" => "Fullscreen Page",
						"id" => "page_fullscreen",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"info" => "Check if you want this page to be fullscreen!",
						"default" => "false"
					),
					array(
						"label" => "Page Alignment",
						"id" => "page_align",
						"type" => "combobox",
						"options" => array("Left", "Center", "Right"),
						"values" => array(" ", "center", "right"),
						"help" => "Choose the page alignment in the window.",
						"alert" => "If Fullscreen is checked above you can skip this option!",
						"default" => " "
					),
					array(
						"label" => "Page Width (pixels)",
						"id" => "page_width",
						"type" => "pixels",
						"info" => "The size of pixels you want this page to have if the alignment is set to anything but Fullscreen. The minimum and default is 770.",
						"alert" => "If Fullscreen is checked above you can skip this option!",
						"default" => "770"
					),
					array(
						"label" => "Page Horizontal Margins (pixels)",
						"id" => "page_hor_margins",
						"type" => "pixels",
						"info" => "The margin the page will have to the left and to the right.",
						"default" => "50"
					),
					array(
						"label" => "Page Top Margin (pixels)",
						"id" => "page_top_margin",
						"type" => "pixels",
						"info" => "The margin the page will have from the top.",
						"default" => "50"
					),
					array(
						"label" => "Page Bottom Margin (pixels)",
						"id" => "page_bottom_margin",
						"type" => "pixels",
						"info" => "The margin the page will have in the bottom.",
						"default" => "50"
					),
					array(
						"label" => "Page Background Transparency",
						"id" => "page_background_color_transparent",
						"type" => "percentage",
						"help" => "The percentage of opacity you want this page to have.",
						"default" => "100"
					)
				),

				//Format&Date
				array(
					array(
						"label" => "Format&Date Menu Top Offset (px.)",
						"id" => "post_format_top_offset",
						"type" => "pixels",
						"default" => "0",
						"help" => "The amount in pixels that you want this post's format&date menu to offset.",
						"info" => "This is usefull when you have for example same page and background color and you want to align this to the title font begin (for the single posts page only)"
					)
				),

				//Snapping
				array(
					array(
						"label" => "Snap Post To Top",
						"id" => "snap_top",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"info" => "Check if you want this post's page to have zero margin on top!",
						"default" => "false"
					),
					array(
						"label" => "Snap Featured Content And Title To Left",
						"id" => "snap_left",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"info" => "Check if you want this post's featured content and title to stick to the post type&date panel!",
						"default" => "false"
					),
					array(
						"label" => "Snap Featured Content And Title Post To Right",
						"id" => "snap_right",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"info" => "Check if you want this post's featured content and title to have zero margin on the right!",
						"default" => "false"
					)
				),


				//Background
				array(
					array(
						//background color
						"label" => "Background color",
						"id" => "background_color",
						"type" => "color_palette_picker",
						"help" => "Choose the background color for this post.",
						"default" => "#d1d1d1"
					),
					array(
						//background images
						"label" => "Background Images",
						"id" => "background_images",
						"type" => "media_picker",
						"info" => "Choose the images you want to appear as background of this post."
					)
				),

				//Sidebar
				array(
					//Sidebar
					array(
						//use sidebar
						"label" => "Use Sidebar",
						"id" => "use_sidebar",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "false",
						"info" => "Check if you want to use a sidebar on this page."
					),
					array(
						//sidebar
						"label" => "Sidebar Picker",
						"id" => "sidebar",
						"type" => "sidebar_picker",
						"info" => "Build your sidebar for this page, or use one already made from the ones saved."
					)
				),


				//Mosaic
				array(
					array(
						"label" => "Mosaic Blog",
						"alert" => "The following options are for the mosaic blog type only, if you're not using this post for mosaic blog you can skip these options!"
					),
					array(
						"label" => "Use Mosaic Image",
						"id" => "post_mosaic_use_image",
						"info" => "Check if you want to use the below selected image as background for the mosaic block.",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true"
					),
					array(
						"label" => "Mosaic Image",
						"id" => "post_mosaic_image",
						"type" => "media_single_picker",
						"width" => 200,
						"height" => 240,
						"info" => "This image will be used for the mosaic blog, leave blank if you want it to have a solid color instead."
					),
					array(
						"label" => "Mosaic Height (px.)",
						"id" => "post_mosaic_height",
						"type" => "pixels",
						"default" => "0",
						"help" => "The amount in pixels of the height you want the mosaic to have in relation to 440 width (it will resize according to the grid's available space).",
						"info" => "Put 0 (zero) if you want the mosaic to addapt to the content"
					),
					array(
						"label" => "Mosaic Image Crop Alignment (image posts only)",
						"id" => "post_mosaic_image_crop_alignment",
						"type" => "combobox",
						"options" => array("Center", "Top", "Right", "Bottom", "Left", "Top Left Corner", "Top Right Corner", "Bottom Right Corner", "Bottom Left Corner"),
						"values" => array("c", "t", "r", "b", "l", "tl", "tr", "br", "bl"),
						"default" => "c",
						"help" => "The part of your image you want to show."
					),
					array(
						"label" => "Mosaic Content Position (from top)",
						"id" => "post_mosaic_content_top",
						"type" => "percentage",
						"default" => "0",
						"help" => "The percentage value of the top offset you want your content to have (0-100)."
					),
					array(
						"label" => "Mosaic Title First",
						"id" => "post_mosaic_title_first",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check if you want the title to appear above the sub title, uncheck for reverse."
					),
					array(
						"label" => "Mosaic Content Padding",
						"id" => "mosaic_content_padding",
						"type" => "text",
						"info" => "The padding property can have from one to four values. Check this link for more info on how to edit each of the paddings or a group <a href='http://www.w3schools.com/css/css_padding.asp' target='_blank'>here</a>",
						"help" => "Choose the content padding for this mosaic post.",
						"default" => "20px"
					),
					array(
						//background color
						"label" => "Mosaic Background Color",
						"id" => "mosaic_background_color",
						"type" => "color_palette_picker",
						"help" => "Choose the background color for this post.",
						"default" => "#d1d1d1"
					),
					array(
						"label" => "Mosaic Title Color",
						"id" => "mosaic_title_color",
						"type" => "color_palette_picker",
						"help" => "Choose the title color for this post mosaic.",
						"default" => "#ffffff"
					),
					array(
						"label" => "Mosaic Date Color",
						"id" => "mosaic_date_color",
						"type" => "color_palette_picker",
						"help" => "Choose the date color for this post mosaic.",
						"default" => "#ffffff"
					),
					array(
						"label" => "Mosaic Comment Icon Color",
						"id" => "mosaic_comment_color",
						"type" => "color_palette_picker",
						"help" => "Choose the comment icon color for this post mosaic.",
						"default" => "#fe5656"
					)
				)
			)
		)
		
	);

	new pq_meta_box($post_meta_options, "post");
}