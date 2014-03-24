<?php



$plusquare_template_options = array(

	//General Settings
    array("name" => "General Settings",
          "icon" => "fa-cog",
          "tabs" => array(

			//Dummy content/options import
				// -> New import method graphics
			array(
				"name" => "Dummy Content",
				"options" => array(
					array(
						"label" => "Import Dummy Content",
						"id" => $pq_shortname."_import_dummy",
						"type" => "import_dummy"
					)
				)
			),

			//Navigation
			array(
				"name" => "Navigation",
				"options" => array(
					array(
						"label" => "Disable",
						"id" => $pq_shortname."_disable_ajax",
						"type" => "checkbox",
						"values"=> array("false", "true"),
						"default" => "false",
						"info" => "Disable ajax pages loading, this will make your site to reload every time a user visists a different page."
					),

					array(
						"label" => "Use Static Page/Post",
						"id" => "show_on_front",
						"type" => "checkbox",
						"values" => array("posts", "page"),
						"info" => "If you leave unchecked the default blog will be the frontpage."
					),
					
					array(
						"label" => "Front Page",
						"id" => "page_on_front",
						"type" => "frontpage_picker",
						"info" => "The page or post that will be your front page"
					)
				)
			),

			//Main Structure
			array(
				"name" => "Main Structure",
				"options" => array(
					array(
						"label" => "Favicon (.ico file)",
						"id" => $pq_shortname."_favicon",
						"type" => "media_single_picker",
						"width" => 16,
						"height" => 16,
						"help" => "The favicon you want to appear on the browsers' tabs!"
					),
					array(
						"label" => "Site Border Size",
						"id" => $pq_shortname."_site_border_size",
						"type" => "pixels",
						"less_var" => true,
						"default" => "12",
						"help" => "Size in pixels of the borders around the site's body."
					),
					array(
						"label" => "Page Grid Horizontal Padding",
						"id" => $pq_shortname."_page_grid_gap",
						"type" => "pixels",
						"default" => "10",
						"less_var" => true,
						"info" => "This will be the amount of padding in pixels the columns will have to the left and to the right, so setting for example 15 will mean between columns there will be a 30 pixels gap!"
					),
					array(
						"label" => "Page Grid Distance Between Rows",
						"id" => $pq_shortname."_page_grid_rows_distance",
						"type" => "pixels",
						"default" => "15",
						"less_var" => true,
						"info" => "This will be the amount of distance in pixels between rows in every page!"
					)
				)
			),

		  	//Welcome Message
			array(
				"name" => "Welcome Message",
				"options" => array(
					//Use welcome message checkbox
					array(
						"label" => "Use Welcome Message",
						"id" => $pq_shortname."_use_welcome",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"help" => "Check if you want to use a welcome message when a user enters your site!",
						"default" => 'true'
					),
					array(
						"label" => "When To Show",
						"id" => $pq_shortname."_when_welcome",
						"type" => "combobox",
						"options" => array("Every time user enters site", "Once per day", "Once per week", "Only the first time"),
						"values" => array("everytime", "once_day", "once_week", "once"),
						"help" => "Choose when the welcome message should pop up!",
						"default" => 'once_day'
					),
					array(
						"label" => "Welcome Message Title",
						"id" => $pq_shortname."_welcome_title",
						"type" => "text",
						"help" => "Your welcome message title!",
						"default" => 'Essenza -<br/>constituting the essence of a portfolio.'
					),
					array(
						"label" => "Welcome Message Text",
						"id" => $pq_shortname."_welcome_text",
						"type" => "text_area",
						"info" => "Your welcome message text!",
						"default" => 'This is an optionable welcome message. It is easy to change it or remove it completely. Nullam condimentum mauris id massa vulputate phatra vitae id sapien. Cras hendrerit, ipsum a aliquam feugiat, urna mi intedum lectus, at vehicula sem leo porttitor massa. Duis sodales, velit et egestas feugiat, turpis risus pharetra leo.'
					)
				)
			),

			//Custom Scroll
			array(
				"name" => "Custom Scroll",
				"options" => array(
					array(
						"label" => "Apply Mousewheel Scroll Ease",
						"id" => $pq_shortname."_mw_scroll",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check if you want your site to have a smooth mousewheel scroll overiding the default browser behaviour!"
					),
					array(
						"label" => "Mousewheel Scroll Amount",
						"id" => $pq_shortname."_mw_amount",
						"type" => "text",
						"default" => "120",
						"help" => "The mousewheel scroll amount is the amount of pixels a mousewheel scroll will shift the page!"
					),
					array(
						"label" => "Mousewheel Scroll Ease Amount",
						"id" => $pq_shortname."_mw_ease",
						"type" => "text",
						"default" => "7",
						"help" => "The ease amount for the mousewheel scroll, the option above must be checked (the bigger the number the slower the animation will be, we recomend a value between 4 and 7)!"
					)
				)
			),

			//Comments
			array(
				"name" => "Comments",
				"options" => array(
					array(
						"label" => "Submit Comment Button",
						"id" => $pq_shortname."_comment_submit_button",
						"type" => "button_picker",
						"info" => "The button that will appear in blog posts for submiting the comment form!",
						"link" => false
					),
					array(
						"label" => "Comment Background Color",
						"id" => $pq_shortname."_comment_back_color",
						"type" => "color_palette_picker",
						"default" => "#0C0C0C",
						"less_var" => true,
						"help" => "Select the color you want the comment's background to have."
					),
					array(
						"label" => "Comment Headline Text Color",
						"id" => $pq_shortname."_comment_headline_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the color you want the comment's headline text to have."
					),
					array(
						"label" => "Comment Date Text Color",
						"id" => $pq_shortname."_comment_date_color",
						"type" => "color_palette_picker",
						"default" => "#CCCCCC",
						"less_var" => true,
						"help" => "Select the color you want the comment's headline text to have."
					),
					array(
						"label" => "Comment Dividers Color",
						"id" => $pq_shortname."_comment_divider_color",
						"type" => "color_palette_picker",
						"default" => "#242424",
						"less_var" => true,
						"help" => "Select the color you want the comment's headline text to have."
					),
					array(
						"label" => "Comment Text Color",
						"id" => $pq_shortname."_comment_text_color",
						"type" => "color_palette_picker",
						"default" => "#CCCCCC",
						"less_var" => true,
						"help" => "Select the color you want the comment's headline text to have."
					),
					array(
						"label" => "Comment Author Color",
						"id" => $pq_shortname."_comment_author_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "Select the color you want the comment's made by the author have as bottom border."
					)
				)
			),

			//Header
			array(
				"name" => "Header",
				"options" => array(
					array(
						"label" => "Logo",
						"id" => $pq_shortname."_logo",
						"type" => "media_single_picker",
						"width" => 300,
						"height" => 100,
						"info" => "Upload the image the double size of the size you want. So if you want the logo to be 100x20 for example, you need to upload a 200x40 image for it to be retina ready.",
						"help" => "Choose an image to use as logo of your site in the menu!"
					),
					array(
						"label" => "Logo Horizontal Offset",
						"id" => $pq_shortname."_logo_hor_offset",
						"type" => "pixels",
						"less_var" => true,
						"default" => "0",
						"help" => "The horizontal offset you want the logo to have."
					),
					array(
						"label" => "Logo Vertical Offset",
						"id" => $pq_shortname."_logo_ver_offset",
						"type" => "pixels",
						"less_var" => true,
						"default" => "0",
						"help" => "The vertical offset you want the logo to have."
					),
					array(
						"label" => "Logo Mobile Horizontal Offset",
						"id" => $pq_shortname."_logo_mobile_hor_offset",
						"type" => "pixels",
						"less_var" => true,
						"default" => "0",
						"help" => "The horizontal offset you want the logo to have on mobile view."
					),
					array(
						"label" => "Logo Mobile Vertical Offset",
						"id" => $pq_shortname."_logo_mobile_ver_offset",
						"type" => "pixels",
						"less_var" => true,
						"default" => "0",
						"help" => "The vertical offset you want the logo to have on mobile view."
					),
					array(
						"label" => "Header Height",
						"id" => $pq_shortname."_menu_height",
						"type" => "pixels",
						"less_var" => true,
						"default" => "60",
						"help" => "Height in pixels you want the header to have."
					),
					array(
						"label" => "Include Search Button",
						"id" => $pq_shortname."_menu_search",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check if you want to have a search button in the header."
					)
				)
			),

			//Footer
			array(
				"name" => "Footer",
				"options" => array(
					array(
						"label" => "Footer Height",
						"id" => $pq_shortname."_footer_height",
						"type" => "pixels",
						"less_var" => true,
						"default" => "40",
						"help" => "Height in pixels you want the footer to have."
					),
					
					//Twitter
					array(
						"label" => "Footer Twitter Feed",
						"id" => $pq_shortname."_footer_twitter",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check to have a twitter feed on the footer of your site."
					),
					array(
						"label" => "Footer Twitter Feed User",
						"id" => $pq_shortname."_footer_twitter_user",
						"type" => "text",
						"default" => "plusquare",
						"help" => "The username of the twitter user you want to fetch the feed from."
					),
					
					//Copyright text
					array(
						"label" => "Footer Text",
						"id" => $pq_shortname."_footer_text",
						"type" => "text_area",
						"default" => "E-mail us: <a href='#'>info@youremail.com</a>",
						"help" => "The text that will appear next to the social icons if twitter feed is checked, or floated to the left if not."
					),

					//Font family
					array(
						"label" => "Footer Font Family",
						"id" => $pq_shortname."_footer_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Footer Font Size",
						"id" => $pq_shortname."_footer_font_size",
						"type" => "pixels",
						"default" => "11",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),

					array(
						"label" => "Footer Normal Color",
						"id" => $pq_shortname."_footer_color1",
						"type" => "color_palette_picker",
						"default" => "#666666",
						"less_var" => true,
						"help" => "Defines the color to use for the footer's text."
					),
					array(
						"label" => "Footer Link&Span Color",
						"id" => $pq_shortname."_footer_color2",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true,
						"help" => "Defines the color to use for the footer's links."
					),
					array(
						"label" => "Footer Twitter Icon Color",
						"id" => $pq_shortname."_footer_twitter_bird_color",
						"type" => "color_palette_picker",
						"default" => "#03aaee",
						"less_var" => true,
						"help" => "Defines the color to use for the footer's twitter icon when you have a tweet feed enabled."
					),
					
					//Links
					array(
						"label" => "Facebook Link",
						"id" => $pq_shortname."_facebook_link",
						"type" => "text",
						"help" => "The link for your facebook profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Google+ Link",
						"id" => $pq_shortname."_google_link",
						"type" => "text",
						"help" => "The link for your Google+ profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Twitter Link",
						"id" => $pq_shortname."_twitter_link",
						"type" => "text",
						"help" => "The link for your twitter profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Vimeo Link",
						"id" => $pq_shortname."_vimeo_link",
						"type" => "text",
						"help" => "The link for your vimeo profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Youtube Link",
						"id" => $pq_shortname."_youtube_link",
						"type" => "text",
						"help" => "The link for your youtube profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Linkedin Link",
						"id" => $pq_shortname."_linkedin_link",
						"type" => "text",
						"help" => "The link for your linkedin profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Pinterest Link",
						"id" => $pq_shortname."_pinterest_link",
						"type" => "text",
						"help" => "The link for your Pinterest profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Dribbble Link",
						"id" => $pq_shortname."_dribbble_link",
						"type" => "text",
						"help" => "The link for your Dribbble profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Behance Link",
						"id" => $pq_shortname."_behance_link",
						"type" => "text",
						"help" => "The link for your Behance profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Flickr Link",
						"id" => $pq_shortname."_flickr_link",
						"type" => "text",
						"help" => "The link for your Flickr profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Rss Feed",
						"id" => $pq_shortname."_rss_link",
						"type" => "text",
						"help" => "The link for your rss feed, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Envato Link",
						"id" => $pq_shortname."_envato_link",
						"type" => "text",
						"help" => "The link for your envato profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Tumblr Link",
						"id" => $pq_shortname."_tumblr_link",
						"type" => "text",
						"help" => "The link for your tumblr profile, leave blank if you don't want this button on the site's footer."
					),
					array(
						"label" => "Instagram Link",
						"id" => $pq_shortname."_instagram_link",
						"type" => "text",
						"help" => "The link for your instagram profile, leave blank if you don't want this button on the site's footer."
					)
				)
			),

			//Content Cover
			array(
				"name" => "Content Cover",
				"options" => array(
					array(
						"label" => "Content Cover Color",
						"id" => $pq_shortname."_cover_color",
						"type" => "color_palette_picker",
						"less_var" => true,
						"default" => "#000000",
						"help" => "The content cover color."
					),
					array(
						"label" => "Content Cover Alpha (%)",
						"id" => $pq_shortname."_cover_alpha",
						"type" => "percentage",
						"default" => "60",
						"less_var" => true,
						"help" => "The alpha percentage you want the content cover to have when active."
					),
					array(
						"label" => "Content Cover On Menu Opened",
						"id" => $pq_shortname."_cover_menu",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check if you want the cover to fade in when the menu is opened."
					)
				)
			),

			//Filter Menu
			array(
				"name" => "Filter Menu",
				"options" => array(
					array(
						"label" => "Filter Menu Round Corners",
						"id" => $pq_shortname."_filter_round_corners",
						"type" => "pixels",
						"less_var" => true,
						"default" => "3",
						"help" => "The filter menu round corners value (example: 3)."
					),
					array(
						"label" => "Filter Menu Background Color",
						"id" => $pq_shortname."_filter_back_color",
						"type" => "color_palette_picker",
						"default" => "#000000",
						"less_var" => true,
						"help" => "Select the color you want the filter menu to have."
					),

					array(
						"label" => "Filter Menu Background Alpha (%)",
						"id" => $pq_shortname."_filter_back_alpha",
						"type" => "percentage",
						"default" => "50",
						"less_var" => true,
						"help" => "The alpha percentage you want the filter's background to have (0-100)."
					),

					array(
						"label" => "Filter Menu Text Color",
						"id" => $pq_shortname."_filter_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the color you want the horizontal text divider's line to have."
					)
				)
			),

			//To Top button
			array(
				"name" => "To Top Button",
				"options" => array(
					array(
						"label" => "To Top Icon Class",
						"id" => $pq_shortname."_to_top_icon",
						"type" => "text",
						"default" => "fa-angle-up",
						"help" => "A font awesome or essenza font icon. You can see for example the ones available from font awesome at <a href='http://fortawesome.github.io/Font-Awesome/icons/' target='_blank'>FontAwesome</a>!"
					),
					array(
						"label" => "To Top Icon Font Size",
						"id" => $pq_shortname."_to_top_icon_size",
						"type" => "pixels",
						"default" => "19",
						"less_var" => true,
					),
					array(
						"label" => "To Top Horizontal From",
						"id" => $pq_shortname."_to_top_horizontal_from",
						"type" => "combobox",
						"options" => array("Left", "Right"),
						"values" => array("left", "right"),
						"default" => "right",
						"less_var" => true
					),
					array(
						"label" => "To Top Vertical Offset Value",
						"id" => $pq_shortname."_to_top_vertical_off",
						"type" => "pixels",
						"default" => "20",
						"less_var" => true
					),
					array(
						"label" => "To Top Horizontal Offset Value",
						"id" => $pq_shortname."_to_top_horizontal_off",
						"type" => "pixels",
						"default" => "20",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Width",
						"id" => $pq_shortname."_to_top_width",
						"type" => "pixels",
						"default" => "35",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Height",
						"id" => $pq_shortname."_to_top_height",
						"type" => "pixels",
						"default" => "35",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Round Corners",
						"id" => $pq_shortname."_to_top_round_corners",
						"type" => "pixels",
						"default" => "2",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Color",
						"id" => $pq_shortname."_to_top_button_color",
						"type" => "color_palette_picker",
						"default" => "#000000",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Opacity",
						"id" => $pq_shortname."_to_top_button_alpha",
						"type" => "percentage",
						"default" => "40",
						"less_var" => true
					),
					array(
						"label" => "To Top Button On Hover Color",
						"id" => $pq_shortname."_to_top_button_over_color",
						"type" => "color_palette_picker",
						"default" => "#000000",
						"less_var" => true
					),
					array(
						"label" => "To Top Button On Hover Opacity",
						"id" => $pq_shortname."_to_top_button_over_alpha",
						"type" => "percentage",
						"default" => "70",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Icon Color",
						"id" => $pq_shortname."_to_top_button_icon_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true
					),
					array(
						"label" => "To Top Button Icon On Hover Color",
						"id" => $pq_shortname."_to_top_button_icon_over_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true
					)
				)
			),

			//Lightbox
			array(
				"name" => "Lightbox",
				"options" => array(
					array(
						"label" => "Lightbox Shading Color",
						"id" => $pq_shortname."_lightbox_cover_color",
						"type" => "color_palette_picker",
						"less_var" => true,
						"default" => "#000000",
						"help" => "The shading color."
					),
					array(
						"label" => "Lightbox Shading Alpha (%)",
						"id" => $pq_shortname."_lightbox_cover_alpha",
						"type" => "percentage",
						"default" => "60",
						"less_var" => true,
						"help" => "The alpha percentage you want the shading to have when active."
					),

					//Font family
					array(
						"label" => "Lightbox Item Description Title",
						"id" => $pq_shortname."_gallery_title_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font spacing
					array(
						"label" => "Lightbox Item Description Title Letter Spacing",
						"id" => $pq_shortname."_gallery_title_letterspacing",
						"type" => "pixels",
						"default" => "0.5",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),
					
					//Font size
					array(
						"label" => "Lightbox Item Description Title Font Size",
						"id" => $pq_shortname."_gallery_title_font_size",
						"type" => "pixels",
						"default" => "15",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Lightbox Item Description Title Line Height",
						"id" => $pq_shortname."_gallery_title_line_height",
						"type" => "pixels",
						"default" => "27",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),

					array(
						"label" => "Lightbox Description Title Color",
						"id" => $pq_shortname."_lightbox_title_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true
					),
					array(
						"label" => "Lightbox Description Text Color",
						"id" => $pq_shortname."_lightbox_description_color",
						"type" => "color_palette_picker",
						"default" => "#CCCCCC",
						"less_var" => true
					)
				)
			),

			//Pagination
			array(
				"name"=>"Pagination",
				"options"=> array(
					//Font family
					array(
						"label" => "Numeration Font Family",
						"id" => $pq_shortname."_numeration_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Numeration Font Size",
						"id" => $pq_shortname."_numeration_font_size",
						"type" => "pixels",
						"default" => "12",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Numeration Line Height",
						"id" => $pq_shortname."_numeration_line_height",
						"type" => "pixels",
						"default" => "12",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),
					
					//Font spacing
					array(
						"label" => "Numeration Letter Spacing",
						"id" => $pq_shortname."_numeration_font_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					//Font family
					array(
						"label" => "Older&Newer Font Family",
						"id" => $pq_shortname."_pag_font",
						"type" => "font_picker",
						"default" => "Open_Sans:700",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Older&Newer Font Size",
						"id" => $pq_shortname."_pag_font_size",
						"type" => "pixels",
						"default" => "15",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Older&Newer Line Height",
						"id" => $pq_shortname."_pag_line_height",
						"type" => "pixels",
						"default" => "17",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),
					
					//Font spacing
					array(
						"label" => "Older&Newer Letter Spacing",
						"id" => $pq_shortname."_pag_font_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					array(
						"label" => "Numeration Background Color",
						"id" => $pq_shortname."_numeration_back_color",
						"type" => "color_palette_picker",
						"default" => "#0C0C0C",
						"less_var" => true,
						"help" => "Select the background color you want the pagination numbers to have."
					),
					array(
						"label" => "Numeration Text Color",
						"id" => $pq_shortname."_numeration_color",
						"type" => "color_palette_picker",
						"default" => "#CCCCCC",
						"less_var" => true,
						"help" => "Select the color you want the pagination numbers to have."
					),
					array(
						"label" => "Numeration Text Color On Over/Active",
						"id" => $pq_shortname."_numeration_active_color",
						"type" => "color_palette_picker",
						"default" => "#FA5654",
						"less_var" => true,
						"help" => "Select the color you want the pagination numbers to have when they are selected or when overed."
					),
					array(
						"label" => "Older&Newer Text Color",
						"id" => $pq_shortname."_pag_color",
						"type" => "color_palette_picker",
						"default" => "#CCCCCC",
						"less_var" => true,
						"help" => "Select the color you want the older/new text to have."
					),
					array(
						"label" => "Older&Newer Text Color On Over",
						"id" => $pq_shortname."_pag_active_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the color you want the older/new buttons to have when they are overed."
					)
				)
			),

			//Custom Css
			array(
				"name" => "Custom Css",
				"options" => array(
					array(
						"label" => "Custom",
						"id" => $pq_shortname."_custom_css",
						"type" => "text_area",
						"default" => "",
						"info" => "Here you can add custom css to the site."
					)
				)
			)
		)
	),

	//Menu
	array("name" => "Menu",
		  "icon" => "fa-bars",
		  "tabs" => array(

		  	//Main buttons
			array(
				"name" => "Main Buttons",
				"options" => array(
					array(
						"label" => "Menu Options",
						"type" => "tabs_unbinded",
						"id" => "menu_tabs_unb",
						"options" => array("General", "Positioning", "Text Style", "Colors"),
						"tabs" => array(

							//General
							array(
								array(
									"label" => "Menu Capitalize",
									"id" => $pq_shortname."_menu_capitalize",
									"type" => "combobox",
									"options" => array("None", "Capitalize", "Uppercase", "Lowercase"),
									"values" => array("none", "capitalize", "uppercase", "lowercase"),
									"default" => "uppercase",
									"less_var" => true,
									"help" => "The text transform you want your menu buttons to have."
								),
								array(
									"label" => "Use Icon To Indicate Submenu",
									"id" => $pq_shortname."_submenu_indication",
									"type" => "checkbox",
									"values" => array("false", "true"),
									"default" => "true",
									"help" => "Check if you want to use an icon on the main buttons to indicate the existance of a submenu."
								),
								array(
									"label" => "Icon Name",
									"id" => $pq_shortname."_submenu_indication_icon",
									"type" => "text",
									"default" => "fa-angle-down",
									"help" => "The icon to use to indicate a submenu, you can use any icon from <a href='http://fortawesome.github.io/Font-Awesome/icons/' target='_blank'>FontAwesome</a>."
								),
								array(
									"label" => "Icon Size",
									"id" => $pq_shortname."_submenu_indication_icon_size",
									"type" => "pixels",
									"default" => "14",
									"less_var" => true,
									"help" => "The icon size."
								),
								array(
									"label" => "Icon Horizontal Offset",
									"id" => $pq_shortname."_submenu_indication_icon_hor_off",
									"type" => "pixels",
									"default" => "0",
									"less_var" => true,
									"help" => "The icon horizontal offset."
								),
								array(
									"label" => "Icon Vertical Offset",
									"id" => $pq_shortname."_submenu_indication_icon_ver_off",
									"type" => "pixels",
									"default" => "0",
									"less_var" => true,
									"help" => "The icon vertical offset."
								)
							),

							//Positioning
							array(
								array(
									"label" => "Header Menu Orientation",
									"id" => $pq_shortname."_menu_orientation",
									"type" => "combobox",
									"options" => array("Left", "Right"),
									"values" => array(" ", "right"),
									"default" => " ",
									"help" => "Check if you want to have a search button in the header."
								),
								array(
									"label" => "Menu Top Offset",
									"id" => $pq_shortname."_menu_top_off",
									"type" => "pixels",
									"less_var" => true,
									"default" => "4",
									"help" => "Top offset you want the menu to have (for fine tuning)."
								),
								array(
									"label" => "Menu Left Margin",
									"id" => $pq_shortname."_menu_left_margin",
									"type" => "pixels",
									"less_var" => true,
									"default" => "30",
									"help" => "Margin of the menu on the left side."
								),
								array(
									"label" => "Menu Right Margin",
									"id" => $pq_shortname."_menu_right_margin",
									"type" => "pixels",
									"less_var" => true,
									"default" => "0",
									"help" => "Margin of the menu on the right side."
								),
								array(
									"label" => "Menu Buttons Horizontal Minimum Margin",
									"id" => $pq_shortname."_menu_min_margin",
									"type" => "pixels",
									"less_var" => true,
									"default" => "15",
									"help" => "Margin between the main buttons groups (calculated according to the all the buttons width and to this minimum gap)."
								)
							),

							//Text Style
							array(
								//Font family
								array(
									"label" => "Menu Font Family",
									"id" => $pq_shortname."_menu_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "Menu Font Size",
									"id" => $pq_shortname."_menu_font_size",
									"type" => "pixels",
									"default" => "12",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "Menu Line Height",
									"id" => $pq_shortname."_menu_line_height",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "Menu Letter Spacing",
									"id" => $pq_shortname."_menu_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),
								
								//Font size
								array(
									"label" => "Mobile Menu Font Size",
									"id" => $pq_shortname."_mobile_menu_font_size",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "Mobile Menu Line Height",
									"id" => $pq_shortname."_mobile_menu_line_height",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "Mobile Menu Letter Spacing",
									"id" => $pq_shortname."_mobile_menu_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								)
							),

							//Colors
							array(
								array(
									"label" => "Menu Buttons Normal Color",
									"id" => $pq_shortname."_menu_buttons_color",
									"type" => "color_palette_picker",
									"default" => "#727072",
									"less_var" => true,
									"help" => "Defines the color to use for the menu buttons."
								),
								array(
									"label" => "Menu Buttons Over Color",
									"id" => $pq_shortname."_menu_buttons_over_color",
									"type" => "color_palette_picker",
									"default" => "#111111",
									"less_var" => true,
									"help" => "Defines the color to use for the menu buttons on over instance."
								),
								array(
									"label" => "Menu Buttons Submenu Indication Icon Normal Color",
									"id" => $pq_shortname."_submenu_indication_icon_color",
									"type" => "color_palette_picker",
									"default" => "#727072",
									"less_var" => true,
									"help" => "Defines the color to use for the menu buttons' submenu indication icon."
								),
								array(
									"label" => "Menu Buttons Submenu Indication Icon Over Color",
									"id" => $pq_shortname."_submenu_indication_icon_over_color",
									"type" => "color_palette_picker",
									"default" => "#111111",
									"less_var" => true,
									"help" => "Defines the color to use for the menu buttons' submenu indication icon on over instance."
								),
								array(
									"label" => "Mobile Menu Buttons Normal Color",
									"id" => $pq_shortname."_mobile_menu_buttons_color",
									"type" => "color_palette_picker",
									"default" => "#727072",
									"less_var" => true,
									"help" => "Defines the color to use for the menu buttons."
								),
								array(
									"label" => "Mobile Menu Buttons Over Color",
									"id" => $pq_shortname."_mobile_menu_buttons_over_color",
									"type" => "color_palette_picker",
									"default" => "#111111",
									"less_var" => true,
									"help" => "Defines the color to use for the menu buttons on over instance."
								)
							)
						)
					)
				)
			),

			//Submenu
			array(
				"name" => "Submenu",
				"options" => array(
					array(
						"label" => "Submenu Options",
						"type" => "tabs_unbinded",
						"id" => "submenu_tabs_unb",
						"options" => array("General", "Positioning", "Text Style", "Colors", "Animation"),
						"tabs" => array(

							//General
							array(
								array(
									"label" => "Header Sub Menus Type",
									"id" => $pq_shortname."_submenu_type",
									"type" => "combobox",
									"options" => array("Group Submenus", "Individual Submenus"),
									"values" => array("submenus_group", "submenus_individual"),
									"default" => "submenus_group",
									"help" => "Choose the type of submenu action you want."
								),
								array(
									"label" => "Sub Menu Border",
									"id" => $pq_shortname."_submenu_border",
									"type" => "pixels",
									"less_var" => true,
									"default" => "0",
									"info" => "Only applies for individual submenu type",
									"help" => "Submenu border between buttons size."
								),
								array(
									"label" => "Sub Menu Top Border",
									"id" => $pq_shortname."_submenu_top_border",
									"type" => "pixels",
									"less_var" => true,
									"default" => "0",
									"info" => "Only applies for individual submenu type",
									"help" => "The size of the top border of all submenus, you can set this border color as well."
								),
								array(
									"label" => "Sub Menu Bottom Border",
									"id" => $pq_shortname."_submenu_bottom_border",
									"type" => "pixels",
									"less_var" => true,
									"default" => "0",
									"info" => "Only applies for individual submenu type",
									"help" => "The size of the bottom border of all submenus, you can set this border color as well."
								)
							),

							//Positioning
							array(
								array(
									"label" => "Sub Menu Top Margin",
									"id" => $pq_shortname."_submenu_margin",
									"type" => "pixels",
									"less_var" => true,
									"default" => "20",
									"help" => "Margin between the main buttons and the submenu."
								),
								array(
									"label" => "Sub Menu Horizontal Alignment",
									"id" => $pq_shortname."_submenu_alignment",
									"type" => "combobox",
									"less_var" => true,
									"values" => array("left", "center", "right"),
									"options" => array("Left", "Center", "Right"),
									"default" => "left",
									"info" => "Only applies for individual submenu type",
									"help" => "The horizontal alignment you want the submenus to have in relation to the main menu button link."
								),
								array(
									"label" => "Sub Menu Horizontal Offset",
									"id" => $pq_shortname."_submenu_hor_offset",
									"type" => "pixels",
									"less_var" => true,
									"default" => "0",
									"info" => "Only applies for individual submenu type",
									"help" => "The horizontal offset you want the submenus to have."
								),
								array(
									"label" => "Sub Menu Width",
									"id" => $pq_shortname."_submenu_width",
									"type" => "pixels",
									"less_var" => true,
									"default" => "0",
									"info" => "Only applies for individual submenu type",
									"help" => "The submenus width (Set to 0(zero) if you want the width to according the buttons size)."
								),
								array(
									"label" => "Sub Button Left Padding",
									"id" => $pq_shortname."_submenu_left_padding",
									"type" => "pixels",
									"less_var" => true,
									"default" => "15",
									"info" => "Only applies for individual submenu type",
									"help" => "Padding on the left side of the sub buttons."
								),
								array(
									"label" => "Sub Button Right Padding",
									"id" => $pq_shortname."_submenu_right_padding",
									"type" => "pixels",
									"less_var" => true,
									"default" => "15",
									"info" => "Only applies for individual submenu type",
									"help" => "Padding on the right side of the sub buttons."
								)
							),

							//Text Style
							array(
								array(
									"label" => "Sub Button Text Alignment",
									"id" => $pq_shortname."_submenu_text_alignment",
									"type" => "combobox",
									"less_var" => true,
									"values" => array("left", "center", "right"),
									"options" => array("Left", "Center", "Right"),
									"default" => "left",
									"info" => "Only applies for individual submenu type",
									"help" => "The horizontal alignment you want the sub buttons text to have."
								),

								//Font family
								array(
									"label" => "Submenu Font Family",
									"id" => $pq_shortname."_submenu_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "Submenu Font Size",
									"id" => $pq_shortname."_submenu_font_size",
									"type" => "pixels",
									"default" => "12",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "Submenu Line Height",
									"id" => $pq_shortname."_submenu_line_height",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "Submenu Letter Spacing",
									"id" => $pq_shortname."_submenu_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),
								
								//Font size
								array(
									"label" => "Mobile Submenu Font Size",
									"id" => $pq_shortname."_mobile_submenu_font_size",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "Mobile Submenu Line Height",
									"id" => $pq_shortname."_mobile_submenu_line_height",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "Mobile Submenu Letter Spacing",
									"id" => $pq_shortname."_mobile_submenu_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								)
							),

							//Colors
							array(
								array(
									"label" => "Submenu Top Border Color",
									"id" => $pq_shortname."_submenu_top_border_color",
									"type" => "color_palette_picker",
									"default" => "#000000",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the top border color to use for the submenus."
								),
								array(
									"label" => "Submenu Bottom Border Color",
									"id" => $pq_shortname."_submenu_bottom_border_color",
									"type" => "color_palette_picker",
									"default" => "#000000",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the bottom border color to use for the submenus."
								),
								array(
									"label" => "Submenu Buttons Normal Color",
									"id" => $pq_shortname."_submenu_buttons_color",
									"type" => "color_palette_picker",
									"default" => "#A19FA1",
									"less_var" => true,
									"help" => "Defines the color to use for the submenu buttons."
								),
								array(
									"label" => "Submenu Buttons Over Color",
									"id" => $pq_shortname."_submenu_buttons_over_color",
									"type" => "color_palette_picker",
									"default" => "#111111",
									"less_var" => true,
									"help" => "Defines the color to use for the submenu buttons on over instance."
								),
								array(
									"label" => "Submenu Buttons Border Color",
									"id" => $pq_shortname."_submenu_buttons_border_color",
									"type" => "color_palette_picker",
									"default" => "#444444",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the color to use for the submenu buttons border."
								),
								array(
									"label" => "Submenu Buttons Background Color",
									"id" => $pq_shortname."_submenu_buttons_background_color",
									"type" => "color_palette_picker",
									"default" => "#000000",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the background color to use for the submenus."
								),
								array(
									"label" => "Submenu Buttons Background Color Opacity",
									"id" => $pq_shortname."_submenu_buttons_background_color_opacity",
									"type" => "percentage",
									"default" => "90",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the background color opacity to use for the submenus."
								),
								array(
									"label" => "Submenu Buttons Background Color On Hover",
									"id" => $pq_shortname."_submenu_buttons_background_color_over",
									"type" => "color_palette_picker",
									"default" => "#000000",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the background color to use for the submenus on hover."
								),
								array(
									"label" => "Submenu Buttons Background Color Opacity On Hover",
									"id" => $pq_shortname."_submenu_buttons_background_color_opacity_over",
									"type" => "percentage",
									"default" => "100",
									"less_var" => true,
									"info" => "Only applies for individual submenu type",
									"help" => "Defines the background color opacity to use for the submenus on hover."
								),
								array(
									"label" => "Mobile Submenu Buttons Normal Color",
									"id" => $pq_shortname."_mobile_submenu_buttons_color",
									"type" => "color_palette_picker",
									"default" => "#A19FA1",
									"less_var" => true,
									"help" => "Defines the color to use for the submenu buttons."
								),
								array(
									"label" => "Mobile Submenu Buttons Over Color",
									"id" => $pq_shortname."_mobile_submenu_buttons_over_color",
									"type" => "color_palette_picker",
									"default" => "#111111",
									"less_var" => true,
									"help" => "Defines the color to use for the submenu buttons on over instance."
								)
							),

							//Animation
							array(
								array(
									"label" => "Sub Menu Start Opacity",
									"id" => $pq_shortname."_submenu_start_opacity",
									"type" => "percentage",
									"less_var" => true,
									"default" => "0",
									"info" => "Only applies for individual submenu type",
									"help" => "The initial opacity when menu button is hovered."
								),
								array(
									"label" => "Sub Menu Start Vertical Offset",
									"id" => $pq_shortname."_submenu_start_vertical_offset",
									"type" => "pixels",
									"less_var" => true,
									"default" => "-10",
									"info" => "Only applies for individual submenu type",
									"help" => "The initial vertical offset when the menu main button is hovered."
								),
								array(
									"label" => "Sub Menu Animation Duration (sec.)",
									"id" => $pq_shortname."_submenu_animation_duration",
									"type" => "text",
									"less_var" => true,
									"default" => "0.6",
									"info" => "Only applies for individual submenu type",
									"help" => "The duration of the in animation when the menu main button is hovered."
								),
								array(
									"label" => "Sub Button Rollover Duration (sec.)",
									"id" => $pq_shortname."_submenu_rollover_duration",
									"type" => "text",
									"less_var" => true,
									"default" => "0.2",
									"info" => "Only applies for individual submenu type",
									"help" => "The duration of the in animation when a sub button is hovered."
								),
								array(
									"label" => "Sub Button Rollout  Duration (sec.)",
									"id" => $pq_shortname."_submenu_rollout_duration",
									"type" => "text",
									"less_var" => true,
									"default" => "0.2",
									"info" => "Only applies for individual submenu type",
									"help" => "The duration of the out animation when a sub button is hovered."
								)
							)
						)
					)
				)
			)
		)
	),

	//Portfolio
    array("name" => "Portfolio",
          "icon" => "fa-suitcase",
          "tabs" => array(

          	//General options
			array(
				"name" => "General",
				"options" => array(
					array(
						"label" => "Portfolio Work Page",
						"id" => $pq_shortname."_portfolio_work_numbering",
						"type" => "combobox",
						"options" => array("Number of works", "Number of items in current work"),
						"values" => array("works", "items"),
						"default" => "works",
						"help" => "The number on the single work page, in the panel refering to the total."
					)
				)
			),

			array(
				"name" => "Text Styles",
				"options" => array(
					//Font family
					array(
						"label" => "Portfolio Grid Item Description Title",
						"id" => $pq_shortname."_portfolio_title_font",
						"type" => "font_picker",
						"default" => "Quattrocento_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font spacing
					array(
						"label" => "Portfolio Grid Item Description Title Letter Spacing",
						"id" => $pq_shortname."_portfolio_title_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),
					
					//Font size
					array(
						"label" => "Portfolio Grid Item Description Title Max Font Size",
						"id" => $pq_shortname."_portfolio_title_font_size_max",
						"type" => "pixels",
						"default" => "37",
						"help" => "The font size in pixels you want for this style, accordingly to the size available the font size is regulated!"
					),
					
					//Font size
					array(
						"label" => "Portfolio Grid Item Description Title Min Font Size",
						"id" => $pq_shortname."_portfolio_title_font_size_min",
						"type" => "pixels",
						"default" => "25",
						"help" => "The font size in pixels you want for this style, accordingly to the size available the font size is regulated!"
					),

					//Font family
					array(
						"label" => "Single Portfolio Item Description Title",
						"id" => $pq_shortname."_single_portfolio_title_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font spacing
					array(
						"label" => "Single Portfolio Item Description Title Letter Spacing",
						"id" => $pq_shortname."_single_portfolio_title_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					//Font family
					array(
						"label" => "Single Portfolio Opened Item Description Title",
						"id" => $pq_shortname."_single_portfolio_opened_title_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font spacing
					array(
						"label" => "Single Portfolio Opened Item Description Title Letter Spacing",
						"id" => $pq_shortname."_single_portfolio_opened_title_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					//Font family
					array(
						"label" => "Single Portfolio Item Description Numbers Font",
						"id" => $pq_shortname."_single_portfolio_numbers_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font spacing
					array(
						"label" => "Single Portfolio Item Description Numbers Letter Spacing",
						"id" => $pq_shortname."_single_portfolio_numbers_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					)
				)
			),

			//Shading
			array(
				"name" => "Shading",
				"options" => array(
					array(
						"label" => "Portfolio Works Shading Color",
						"id" => $pq_shortname."_portfolio_cover_color",
						"type" => "color_palette_picker",
						"less_var" => true,
						"default" => "#000000",
						"help" => "The shading color."
					),
					array(
						"label" => "Portfolio Works Shading Alpha (%)",
						"id" => $pq_shortname."_portfolio_cover_alpha",
						"type" => "percentage",
						"default" => "60",
						"less_var" => true,
						"help" => "The alpha percentage you want the shading to have when active."
					)
				)
			),

			//Coloring
			array(
				"name" => "Coloring",
				"options" => array(
					array(
						"label" => "Portfolio Title Color",
						"id" => $pq_shortname."_portfolio_description_title_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The color of a portfolio item title color."
					),
					array(
						"label" => "Portfolio Text Color",
						"id" => $pq_shortname."_portfolio_description_text_color",
						"type" => "color_palette_picker",
						"default" => "#C9CCC9",
						"less_var" => true,
						"help" => "The color of a portfolio item text color."
					),
					array(
						"label" => "Portfolio Categories Color",
						"id" => $pq_shortname."_portfolio_description_categories_color",
						"type" => "color_palette_picker",
						"default" => "#666666",
						"less_var" => true,
						"help" => "The color of a portfolio item categories color."
					),
					array(
						"label" => "Work Description Scrollbar&lines Color",
						"id" => $pq_shortname."_work_description_scrollbar_lines_color",
						"type" => "color_palette_picker",
						"default" => "#292929",
						"less_var" => true,
						"help" => "The scrollbar color of a works's page description panel."
					),
					array(
						"label" => "Work Description Buttons On Over Color",
						"id" => $pq_shortname."_work_description_over_color",
						"type" => "color_palette_picker",
						"default" => "#0c0c0c",
						"less_var" => true,
						"help" => "Color of the buttons on over."
					)
				)
			),

			//Single Work page options
			array(
				"name" => "Single Work",
				"options" => array(
					//Animation Duration
					array(
						"label" => "Slides Transition Duration (sec.)",
						"id" => $pq_shortname."_slider_transition_duration",
						"type" => "text",
						"default" => "1",
						"help" => "Animation duration from the previous to the next slide."
					),
					
					//Animation Tween Type
					array(
						"label" => "Slides Transition Tween Type",
						"id" => $pq_shortname."_slider_transition_type",
						"type" => "combobox",
						"options" => array( "linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
						"values" => array("linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
						"default" => "Expo",
						"help" => "Animation tween type."
					),
					
					//Animation Tween Ease
					array(
						"label" => "Slides Transition Tween Ease",
						"id" => $pq_shortname."_slider_transition_ease",
						"type" => "combobox",
						"options" => array( "Ease In", "Ease Out", "Ease In&Out" ),
						"values" => array( "easeIn", "easeOut", "easeInOut" ),
						"default" => "easeOut",
						"help" => "Animation tween ease."
					),

					//Animation Starting Point
					array(
						"label" => "Slides Transition Starting Point",
						"id" => $pq_shortname."_slider_transition_starting",
						"type" => "percentage",
						"default" => "0",
						"help" => "This defines a percentage for the starting point, setting for example to 50% will make it to jump to 50% of the slider width before starting the animation (good for fast animations). Set to 0(zero) if you don't want a starting point offset."
					)
				)
			)				
        )
	),

	//Blog
    array("name" => "Blog",
          "icon" => "fa-calendar-o",
          "tabs" => array(

			//General options
			array(
				"name" => "General",
				"options" => array(
					array(
						"label" => "Blog Type Background Color",
						"id" => $pq_shortname."_blog_type_background_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "The background color of the 50x50 square indicating the blog type."
					),
					array(
						"label" => "Blog Type Color",
						"id" => $pq_shortname."_blog_type_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The color of the icon indicating the blog type."
					)
				)
			),
          	

          	array(
          		"name" => "Text Styles",
          		"options" => array(//Font family
					array(
						"label" => "Blog Title Font",
						"id" => $pq_shortname."_blog_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Blog Title Font Size",
						"id" => $pq_shortname."_blog_font_size",
						"type" => "pixels",
						"default" => "27",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Blog Title Line Height",
						"id" => $pq_shortname."_blog_line_height",
						"type" => "pixels",
						"default" => "34",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),
					
					//Font size
					array(
						"label" => "Masonry Grid Title Font Size",
						"id" => $pq_shortname."_masonry_font_size",
						"type" => "pixels",
						"default" => "27",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Masonry Grid Title Line Height",
						"id" => $pq_shortname."_masonry_line_height",
						"type" => "pixels",
						"default" => "34",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					)
				)
			),

          	//General options
			array(
				"name" => "Social Buttons",
				"options" => array(
					array(
						"label" => "Twitter Share Button",
						"id" => $pq_shortname."_blog_twitter_share",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check to include a twitter button at the end of each blog post."
					),
					array(
						"label" => "Facebook Like Button",
						"id" => $pq_shortname."_blog_facebook_like",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check to include a facebook like button at the end of each blog post."
					),
					array(
						"label" => "Google+ Like Button",
						"id" => $pq_shortname."_blog_google_like",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check to include a google plus button at the end of each blog post."
					)
				)
			)
        )
	),

	//Mosaic Blog
    array("name" => "Mosaic Blog",
          "icon" => "fa-calendar",
          "tabs" => array(

			array(
				"name" => "Text Styles",
				"options" => array(
					//Font family
					array(
						"label" => "Mosaic Blog Title Font",
						"id" => $pq_shortname."_mosaic_blog_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Mosaic Blog Title Font Size",
						"id" => $pq_shortname."_mosaic_blog_font_size",
						"type" => "pixels",
						"default" => "25",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Mosaic Blog Title Line Height",
						"id" => $pq_shortname."_mosaic_blog_line_height",
						"type" => "pixels",
						"default" => "27",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),

					//Font family
					array(
						"label" => "Mosaic Blog Subtitle Font",
						"id" => $pq_shortname."_mosaic_blog_sub_font",
						"type" => "font_picker",
						"default" => "Open_Sans:normal",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Mosaic Blog Subtitle Font Size",
						"id" => $pq_shortname."_mosaic_blog_sub_font_size",
						"type" => "pixels",
						"default" => "25",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Mosaic Blog Title Line Height",
						"id" => $pq_shortname."_mosaic_blog_sub_line_height",
						"type" => "pixels",
						"default" => "27",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					)
				)
			),

			array(
				"name" => "Shading",
				"options" => array(
					array(
						"label" => "Mosaic Blog Shading Color",
						"id" => $pq_shortname."_mosaic_cover_color",
						"type" => "color_palette_picker",
						"less_var" => true,
						"default" => "#000000",
						"help" => "The shading color."
					),
					array(
						"label" => "Mosaic Blog Shading Alpha (%)",
						"id" => $pq_shortname."_mosaic_cover_alpha",
						"type" => "percentage",
						"default" => "60",
						"less_var" => true,
						"help" => "The alpha percentage you want the shading to have when active."
					)
				)
			)
        )
	),

	//Slider
    array("name" => "Slider",
          "icon" => "fa-film",
          "tabs" => array(

          	//Ui
			array(
				"name" => "UI",
				"options" => array(
					array(
						"label" => "Slider UI Backcolor",
						"id" => $pq_shortname."_slider_ui_color",
						"type" => "color_palette_picker",
						"less_var" => true,
						"default" => "#000000",
						"help" => "The shading color."
					),
					array(
						"label" => "Slider UI Backcolor Alpha (%)",
						"id" => $pq_shortname."_slider_ui_alpha",
						"type" => "percentage",
						"default" => "30",
						"less_var" => true,
						"help" => "The alpha percentage you want the shading to have when active."
					)
				)
			)
        )
	),

	//Gallery
    array("name" => "Gallery",
          "icon" => "fa-picture-o",
          "tabs" => array(

			//Coloring
			array(
				"name" => "Coloring",
				"options" => array(
					array(
						"label" => "Gallery Type Background Color",
						"id" => $pq_shortname."_gallery_type_background_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "The background color of the 50x50 circle indicating the gallery item type."
					),
					array(
						"label" => "Gallery Type Color",
						"id" => $pq_shortname."_gallery_type_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The color of the icon indicating the gallery item type."
					)
				)
			),

			//Shading
			array(
				"name" => "Shading",
				"options" => array(
					array(
						"label" => "Gallery Shading Color",
						"id" => $pq_shortname."_gallery_cover_color",
						"type" => "color_palette_picker",
						"less_var" => true,
						"default" => "#000000",
						"help" => "The shading color."
					),
					array(
						"label" => "Gallery Shading Alpha (%)",
						"id" => $pq_shortname."_gallery_cover_alpha",
						"type" => "percentage",
						"default" => "60",
						"less_var" => true,
						"help" => "The alpha percentage you want the shading to have when active."
					)
				)
			)
        )
	),

	//Shortcodes
    array("name" => "Shortcodes",
          "icon" => "fa-cogs",
          "tabs" => array(

			//Contact Forms
			array(
				"name" => "Contact Form",
				"options" => array(
					array(
						"label" => "Contact Forms Round Corners",
						"id" => $pq_shortname."_contact_forms_round_corners",
						"type" => "pixels",
						"less_var" => true,
						"default" => "4",
						"help" => "The contact forms' fields round corners value (example: 3)."
					),
					array(
						"label" => "Form Fields Background Color",
						"id" => $pq_shortname."_form_fields_background_color",
						"type" => "color_palette_picker",
						"default" => "#0C0C0C",
						"less_var" => true,
						"help" => "The background color of the forms input fields."
					),
					array(
						"label" => "Form Fields Text Color",
						"id" => $pq_shortname."_form_fields_text_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The text color of the forms input fields."
					),
					array(
						"label" => "Form Fields Border Color",
						"id" => $pq_shortname."_form_fields_border_color",
						"type" => "color_palette_picker",
						"default" => "#292929",
						"less_var" => true,
						"help" => "The border color of the forms input fields."
					),
					array(
						"label" => "Form Fields Border Focused Color",
						"id" => $pq_shortname."_form_fields_border_over_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "The border color of the forms input fields."
					)
				)
			),

			//Music Player
			array(
				"name" => "Music Player",
				"options" => array(
					array(
						"label" => "Background Color",
						"id" => $pq_shortname."_music_player_background_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "The background color of the music player."
					),
					array(
						"label" => "Bars Background Color",
						"id" => $pq_shortname."_music_player_bars_normal",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true,
						"help" => "The music player bars' background color."
					),
					array(
						"label" => "Bars Stream Background Color",
						"id" => $pq_shortname."_music_player_bars_stream",
						"type" => "color_palette_picker",
						"default" => "#fb7776",
						"less_var" => true,
						"help" => "The music player stream bars' color."
					),
					array(
						"label" => "Bars Progress Background Color",
						"id" => $pq_shortname."_music_player_bars_active",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The music player progress/current bars' color."
					),
					array(
						"label" => "Author/Artist Text Color",
						"id" => $pq_shortname."_music_player_author",
						"type" => "color_palette_picker",
						"default" => "#fb7776",
						"less_var" => true,
						"help" => "The music's artist text field color."
					),
					array(
						"label" => "Title Text Color",
						"id" => $pq_shortname."_music_player_title",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true,
						"help" => "The music's title text field color."
					),
					array(
						"label" => "Buttons Color",
						"id" => $pq_shortname."_music_player_button",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Color of the buttons in the music player."
					),
					array(
						"label" => "Buttons Over Color",
						"id" => $pq_shortname."_music_player_button_over",
						"type" => "color_palette_picker",
						"default" => "#fb7776",
						"less_var" => true,
						"help" => "Color of the buttons on mouse over in the music player."
					)
				)
			),

			//Quote
			array(
				"name" => "Quote",
				"options" => array(
					//Font family
					array(
						"label" => "Quote Font Family",
						"id" => $pq_shortname."_inline_quote_font",
						"type" => "font_picker",
						"default" => "Lato:italic",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Quote Font Size",
						"id" => $pq_shortname."_inline_quote_font_size",
						"type" => "pixels",
						"default" => "12",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Quote Line Height",
						"id" => $pq_shortname."_inline_quote_line_height",
						"type" => "pixels",
						"default" => "20",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),
					
					//Font spacing
					array(
						"label" => "Quote Letter Spacing",
						"id" => $pq_shortname."_inline_quote_font_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					array(
						"label" => "Quote Text Color",
						"id" => $pq_shortname."_inline_quote_text_color",
						"type" => "color_palette_picker",
						"default" => "#999999",
						"less_var" => true,
						"help" => "The inline quote text color."
					),
					array(
						"label" => "Quote Icon Color",
						"id" => $pq_shortname."_inline_quote_icon_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The inline quote icon color."
					)
				)
			),
			
			//Block Quote
			array(
				"name" => "Quote Block",
				"options" => array(
					//Font family
					array(
						"label" => "Quote Block Font Family",
						"id" => $pq_shortname."_quote_font",
						"type" => "font_picker",
						"default" => "Lato:italic",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Quote Block Font Size",
						"id" => $pq_shortname."_quote_font_size",
						"type" => "pixels",
						"default" => "23",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Quote Block Line Height",
						"id" => $pq_shortname."_quote_line_height",
						"type" => "pixels",
						"default" => "28",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),
					
					//Font spacing
					array(
						"label" => "Quote Block Letter Spacing",
						"id" => $pq_shortname."_quote_font_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					array(
						"label" => "Quote Block Background Color",
						"id" => $pq_shortname."_quote_block_background_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "The background color of quote block shortcode."
					),
					array(
						"label" => "Quote Block Text Color",
						"id" => $pq_shortname."_quote_block_text_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The quote block shortcode's text color."
					),
					array(
						"label" => "Quote Block Author Color" ,
						"id" => $pq_shortname."_quote_block_author_color",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true,
						"help" => "The quote block shortcode's author text color."
					)
				)
			),

			//Twitter Quote
			array(
				"name" => "Twitter Quote",
				"options" => array(
					//Font family
					array(
						"label" => "Twitter Quote Font Family",
						"id" => $pq_shortname."_twitter_quote_font",
						"type" => "font_picker",
						"default" => "Lato:italic",
						"less_var" => true,
						"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
					),
					
					//Font size
					array(
						"label" => "Twitter Quote Font Size",
						"id" => $pq_shortname."_twitter_quote_font_size",
						"type" => "pixels",
						"default" => "23",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!"
					),
					
					//Font line height
					array(
						"label" => "Twitter Quote Line Height",
						"id" => $pq_shortname."_twitter_quote_line_height",
						"type" => "pixels",
						"default" => "28",
						"less_var" => true,
						"help" => "The style's line height in pixels!"
					),
					
					//Font spacing
					array(
						"label" => "Twitter Quote Letter Spacing",
						"id" => $pq_shortname."_twitter_quote_font_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!"
					),

					array(
						"label" => "Single Tweet Block Background Color",
						"id" => $pq_shortname."_tweet_block_background_color",
						"type" => "color_palette_picker",
						"default" => "#03aaee",
						"less_var" => true,
						"help" => "The background color of Tweet block shortcode."
					),
					array(
						"label" => "Single Tweet Block Text Color",
						"id" => $pq_shortname."_tweet_block_text_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The Tweet block shortcode's text color."
					),
					array(
						"label" => "Single Tweet Block Author Color" ,
						"id" => $pq_shortname."_tweet_block_author_color",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true,
						"help" => "The Tweet block shortcode's date text color."
					)
				)
			),

			//Dropcaps
			array(
				"name" => "Dropcaps",
				"options" => array(
					array(
						"label" => "Round Dropcap Background Color",
						"id" => $pq_shortname."_dropcap1_background_color",
						"type" => "color_palette_picker",
						"default" => "#FE5656",
						"less_var" => true,
						"help" => "Select the background color you want for this dropcap style."
					),
					array(
						"label" => "Round Dropcap Font Color",
						"id" => $pq_shortname."_dropcap1_font_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the font color you want for this dropcap style."
					),
					array(
						"label" => "Square Dropcap Background Color",
						"id" => $pq_shortname."_dropcap3_background_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the background color you want for this dropcap style."
					),
					array(
						"label" => "Square Dropcap Font Color",
						"id" => $pq_shortname."_dropcap3_font_color",
						"type" => "color_palette_picker",
						"default" => "#111111",
						"less_var" => true,
						"help" => "Select the font color you want for this dropcap style."
					),
					array(
						"label" => "Simple Dropcap Font Color",
						"id" => $pq_shortname."_dropcap2_font_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the font color you want for this dropcap style."
					)
				)
			),

			//Video
			array(
				"name" => "Video",
				"options" => array(
					array(
						"label" => "Video Play Button Background Color",
						"id" => $pq_shortname."_video_background_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true
					),
					array(
						"label" => "Video Play Button Icon Color",
						"id" => $pq_shortname."_video_icon_color",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true
					),
					array(
						"label" => "Video Play Button Background On Hover Color",
						"id" => $pq_shortname."_video_background_over_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true
					),
					array(
						"label" => "Video Play Button Icon On Hover Color",
						"id" => $pq_shortname."_video_icon_over_color",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"less_var" => true
					)
				)
			),

			//Tabs
			array(
				"name" => "Tabs",
				"options" => array(
					array(
						"label" => "Tabs Titles Color",
						"id" => $pq_shortname."_tabs_title_color",
						"type" => "color_palette_picker",
						"default" => "#cccccc",
						"less_var" => true,
						"help" => "The color for the tabs' shortcodes title color."
					),
					array(
						"label" => "Tabs Titles Active Color",
						"id" => $pq_shortname."_tabs_title_active_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The color for the tabs' shortcodes title color when active or hovered."
					),
					array(
						"label" => "Tabs Borders And Background Active Color",
						"id" => $pq_shortname."_tabs_border_background_color",
						"type" => "color_palette_picker",
						"default" => "#cccccc",
						"less_var" => true,
						"help" => "The color for the tabs' lines color."
					)
				)
			),

			//Alert Boxes
			array(
				"name" => "Alert Boxes",
				"options" => array(
					array(
						"label" => "Alert Boxes Text Color",
						"id" => $pq_shortname."_alert_text_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "The text color for the alert boxes."
					),
					array(
						"label" => "Warning Box Color",
						"id" => $pq_shortname."_alert_warning_color",
						"type" => "color_palette_picker",
						"default" => "#b89605",
						"less_var" => true,
						"help" => "The borders color for this alert box."
					),
					array(
						"label" => "Success Box Color",
						"id" => $pq_shortname."_alert_success_color",
						"type" => "color_palette_picker",
						"default" => "#A1C648",
						"less_var" => true,
						"help" => "The borders color for this alert box."
					),
					array(
						"label" => "Error Box Color",
						"id" => $pq_shortname."_alert_error_color",
						"type" => "color_palette_picker",
						"default" => "#9f1906",
						"less_var" => true,
						"help" => "The borders color for this alert box."
					),
					array(
						"label" => "Info Box Color",
						"id" => $pq_shortname."_alert_info_color",
						"type" => "color_palette_picker",
						"default" => "#2197BA",
						"less_var" => true,
						"help" => "The borders color for this alert box."
					)
				)
			)

        )
	),

	//Font Settings
    array("name" => "Font Settings",
          "icon" => "fa-font",
          "tabs" => array(
		  
		  	//Google Fonts
			array(
				"name" => "Fonts",
				"options" => array(
					//https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDuFXpZscDhn2EXFgFh9d3EQbuuYOOS8mM
					//Post content builder
					array(
						"label" => "Pick From Google Fonts",
						"id" => $pq_shortname."_google_fonts",
						"type" => "google_fonts_picker",
						"info" => "You can choose which fonts you want to use simply by dragging the ones you want from the left to the right panel.",
						"default" => '{"items": [{ "family": "Open_Sans","variants": ["regular","italic","700","700italic"]},{ "family": "Quattrocento_Sans","variants": ["regular","italic","700","700italic"]},{ "family": "Lato","variants": ["italic"]}]}'
					),

					array(
						"label" => "Characters Set",
						"id" => $pq_shortname."_google_fonts_set",
						"type" => "checkbox_options",
						"options" => array(
							"latin" => "Latin",
							"greek-ex" => "Greek Extended",
							"cyrillic" => "Cyrillic",
							"cyrillic-ext" => "Cyrillic Extended",
							"greek" => "Greek",
							"greek-ext" => "Greek Extended"
						),
						"default" => '{"latin":"true","greek-ex":"false","cyrillic":"false","cyrillic-ext":"false","greek":"false","greek-ext":"false"}',
						"info" => "The fonts subsets you want to be imported for each selected font."
					)
				)
			),
			
			//Text Styles
			array(
				"name" => "Text styles",
				"options" => array(
					//Texts styles
					array(
						"label" => "Formats",
						"type" => "tabs_unbinded",
						"id" => "formats_tabs",
						"options" => array("H1", "H2", "H3", "H4", "H5", "H6", "P"),
						"tabs" => array(
							//H1
							array(
								//Font family
								array(
									"label" => "H1 Font Family",
									"id" => $pq_shortname."_h1_font",
									"type" => "font_picker",
									"default" => "Quattrocento_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "H1 Font Size",
									"id" => $pq_shortname."_h1_font_size",
									"type" => "pixels",
									"default" => "37",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "H1 Line Height",
									"id" => $pq_shortname."_h1_line_height",
									"type" => "pixels",
									"default" => "41",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "H1 Letter Spacing",
									"id" => $pq_shortname."_h1_font_letterspacing",
									"type" => "pixels",
									"default" => "0",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "H1 Font Color",
									"id" => $pq_shortname."_h1_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							),
							
							//H2
							array(
								//Font family
								array(
									"label" => "H2 Font Family",
									"id" => $pq_shortname."_h2_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "H2 Font Size",
									"id" => $pq_shortname."_h2_font_size",
									"type" => "pixels",
									"default" => "30",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "H2 Line Height",
									"id" => $pq_shortname."_h2_line_height",
									"type" => "pixels",
									"default" => "34",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "H2 Letter Spacing",
									"id" => $pq_shortname."_h2_font_letterspacing",
									"type" => "pixels",
									"default" => "0",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "H2 Font Color",
									"id" => $pq_shortname."_h2_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							),
							
							//H3
							array(
								//Font family
								array(
									"label" => "H3 Font Family",
									"id" => $pq_shortname."_h3_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "H3 Font Size",
									"id" => $pq_shortname."_h3_font_size",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "H3 Line Height",
									"id" => $pq_shortname."_h3_line_height",
									"type" => "pixels",
									"default" => "32",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "H3 Letter Spacing",
									"id" => $pq_shortname."_h3_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "H3 Font Color",
									"id" => $pq_shortname."_h3_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							),
							
							//H4
							array(
								//Font family
								array(
									"label" => "H4 Font Family",
									"id" => $pq_shortname."_h4_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "H4 Font Size",
									"id" => $pq_shortname."_h4_font_size",
									"type" => "pixels",
									"default" => "15",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "H4 Line Height",
									"id" => $pq_shortname."_h4_line_height",
									"type" => "pixels",
									"default" => "27",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "H4 Letter Spacing",
									"id" => $pq_shortname."_h4_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "H4 Font Color",
									"id" => $pq_shortname."_h4_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							),
							
							//H5
							array(
								//Font family
								array(
									"label" => "H5 Font Family",
									"id" => $pq_shortname."_h5_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "H5 Font Size",
									"id" => $pq_shortname."_h5_font_size",
									"type" => "pixels",
									"default" => "12",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								
								//Font line height
								array(
									"label" => "H5 Line Height",
									"id" => $pq_shortname."_h5_line_height",
									"type" => "pixels",
									"default" => "24",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "H5 Letter Spacing",
									"id" => $pq_shortname."_h5_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "H5 Font Color",
									"id" => $pq_shortname."_h5_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							),
							
							//H6
							array(
								//Font family
								array(
									"label" => "H6 Font Family",
									"id" => $pq_shortname."_h6_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "H6 Font Size",
									"id" => $pq_shortname."_h6_font_size",
									"type" => "pixels",
									"default" => "10",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "H6 Line Height",
									"id" => $pq_shortname."_h6_line_height",
									"type" => "pixels",
									"default" => "22",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "H6 Letter Spacing",
									"id" => $pq_shortname."_h6_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "H6 Font Color",
									"id" => $pq_shortname."_h6_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							),
							
							//P
							array(
								//Font family
								array(
									"label" => "P Font Family",
									"id" => $pq_shortname."_p_font",
									"type" => "font_picker",
									"default" => "Open_Sans:normal",
									"less_var" => true,
									"help" => "Select the font you want for this style from the ones selected by you in the fonts tab."
								),
								
								//Font size
								array(
									"label" => "P Font Size",
									"id" => $pq_shortname."_p_font_size",
									"type" => "pixels",
									"default" => "12",
									"less_var" => true,
									"help" => "The font size in pixels you want for this style!"
								),
								
								//Font line height
								array(
									"label" => "P Line Height",
									"id" => $pq_shortname."_p_line_height",
									"type" => "pixels",
									"default" => "20",
									"less_var" => true,
									"help" => "The style's line height in pixels!"
								),
								
								//Font spacing
								array(
									"label" => "P Letter Spacing",
									"id" => $pq_shortname."_p_font_letterspacing",
									"type" => "pixels",
									"default" => "0.5",
									"less_var" => true,
									"help" => "The style's letter spacing in pixels!"
								),

								array(
									"label" => "Paragraphs Style Color",
									"id" => $pq_shortname."_paragraphs_color",
									"type" => "color_palette_picker",
									"default" => "#CCCCCC",
									"less_var" => true,
									"help" => "Defines the color to use for paragraphs."
								),
								array(
									"label" => "Paragraphs Highlights Style Color",
									"id" => $pq_shortname."_paragraphs_highlight_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Defines the color to use for p tags in special ocasions when there's the need to highlight some part a bit like the category and author in an opened post."
								),
								array(
									"label" => "Paragraphs Obfuscated Style Color",
									"id" => $pq_shortname."_paragraphs_obfuscated_color",
									"type" => "color_palette_picker",
									"default" => "#999999",
									"less_var" => true,
									"help" => "Defines the color to use for p tags in special ocasions when we don't want to give much attention to that text, Such as the 'posted by' in a regular opened post."
								),
								array(
									"label" => "Paragraphs Not Important Style Color",
									"id" => $pq_shortname."_paragraphs_irrelevant_color",
									"type" => "color_palette_picker",
									"default" => "#444444",
									"less_var" => true,
									"help" => "Defines the color to use for p tags in special ocasions when we want to give even less attention to that text than the obfuscated one, such as the 'tags' in a regular opened post."
								),

								array(
									"label" => "Span Font Color",
									"id" => $pq_shortname."_span_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								),
								array(
									"label" => "A(Links) Font Color",
									"id" => $pq_shortname."_a_font_color",
									"type" => "color_palette_picker",
									"default" => "#ffffff",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								),
								array(
									"label" => "A(Links) Font Color On Over",
									"id" => $pq_shortname."_a_font_color_over",
									"type" => "color_palette_picker",
									"default" => "#fe5656",
									"less_var" => true,
									"help" => "Select the font color you want for this style."
								)
							)
						)
					)
				)
			)
		),
    ),
	
	//COLOR SETTINGS
    array("name" => "Color Settings",
          "icon" => "fa-tint",
          "tabs" => array(
          	//Main
			array(
				"name" => "Color Palette",
				"options" => array(
					array(
						"label" => "Color palette",
						"id" => $pq_shortname."_color_palette",
						"type" => "color_palette",
						"info" => "Saving colors within the color palette makes it super easy to use them anywhere else in the admin!"
					)
				)
			),
		  	//Main
			array(
				"name" => "Main Coloring Parts",
				"options" => array(
					array(
						"label" => "Site Border",
						"id" => $pq_shortname."_site_border_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Defines the color to use for the menu and the borders."
					),
					array(
						"label" => "Pages Color",
						"id" => $pq_shortname."_pages_color",
						"type" => "color_palette_picker",
						"default" => "#111111",
						"less_var" => true,
						"help" => "Defines the color to use as background for pages."
					),
					array(
						"label" => "Sidebars Color",
						"id" => $pq_shortname."_sidebars_color",
						"type" => "color_palette_picker",
						"default" => "#0c0c0c",
						"less_var" => true,
						"help" => "Defines the color to use as background for sidebars."
					),
					array(
						//sidebar border
						"label" => "Sidebar Border Size in pixels",
						"id" => $pq_shortname."_sidebar_border",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The border width in the seperation between the page and the sidebar"
					),
					array(
						//sidebar border color
						"label" => "Sidebar Border color",
						"id" => $pq_shortname."_sidebar_border_color",
						"type" => "color_palette_picker",
						"help" => "Choose the background color for the border.",
						"less_var" => true,
						"default" => "#cccccc"
					),
					array(
						"label" => "Highlight Color",
						"id" => $pq_shortname."_highlight_color",
						"type" => "color_palette_picker",
						"default" => "#fe5656",
						"less_var" => true,
						"help" => "Defines the color to use as the main highlight color of the site ( the pink color in the preview )."
					),
					array(
						"label" => "Highlight Contrast Color",
						"id" => $pq_shortname."_highlight_contrast_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Defines the color to use as the main highlight contrast color of the site ( the white above the pink color in the preview )."
					),
					array(
						"label" => "Highlight Secondary Contrast Color",
						"id" => $pq_shortname."_highlight_secondary_contrast_color",
						"type" => "color_palette_picker",
						"default" => "#333333",
						"help" => "Defines the color to use as the secondary highlight contrast color of the site ( the dark grey above the pink color in the preview )."
					),
					array(
						"label" => "Pages Buttons Color",
						"id" => $pq_shortname."_pages_buttons_color",
						"type" => "color_palette_picker",
						"default" => "#111111",
						"less_var" => true,
						"help" => "Defines the color to use for the buttons builted in pages like the close information box button or the go to top button."
					),
					array(
						"label" => "Pages Buttons Color On Over",
						"id" => $pq_shortname."_pages_buttons_over_color",
						"type" => "color_palette_picker",
						"default" => "#000000",
						"less_var" => true,
						"help" => "Defines the color to use for the buttons builted in pages like the close information box button or the go to top button."
					),
					array(
						"label" => "Pages Lines & dividers Color",
						"id" => $pq_shortname."_pages_lines_color",
						"type" => "color_palette_picker",
						"default" => "#242424",
						"less_var" => true,
						"help" => "Defines the color to use for the buttons limit lines and other delimiting/divider lines."
					),
					array(
						"label" => "Main Horizontal Line Color",
						"id" => $pq_shortname."_hr_color",
						"type" => "color_palette_picker",
						"default" => "#ffffff",
						"less_var" => true,
						"help" => "Select the color you want the main horizontal line to have (this is the line that appears right after a page title for example)."
					),
					array(
						"label" => "Full Width Divider Line Color",
						"id" => $pq_shortname."_hr_divider_color",
						"type" => "color_palette_picker",
						"default" => "#242424",
						"less_var" => true,
						"help" => "Select the color you want the horizontal text divider's line to have (this is the line that appears right after a post content preview for example)."
					)
				)
			)
	    )
	),
	
	//VIDEO SETTINGS
    array("name" => "Video Settings",
          "icon" => "fa-video-camera",
          "tabs" => array(
		  	//Youtube
			array(
				"name" => "Youtube player",
				"options" => array(
					//autohide (0, 1 or 2)
					array(
						"label" => "Auto Hide Video Controls",
						"id" => $pq_shortname."_youtube_autohide",
						"type" => "combobox",
						"options" => array("Partial Autohide", "Autohide", "Never"),
						"values" => array("2", "1", "0"),
						"default" => "2",
						"help" => "This parameter indicates whether the video controls will automatically hide after a video begins playing."
					),
					
					//cc_load_policy -> show closed captions (0 or 1)
					array(
						"label" => "Show Closed Captions",
						"id" => $pq_shortname."_youtube_cc_load_policy",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 0,
						"help" => "This parameter indicates whether the video controls will automatically hide after a video begins playing."
					),
					
					//color -> red or white
					array(
						"label" => "Player Color",
						"id" => $pq_shortname."_youtube_color",
						"type" => "combobox",
						"options" => array("Red", "White"),
						"values" => array("red", "white"),
						"default" => "red",
						"help" => "This parameter specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen."
					),
					
					//theme -> player theme (dark or light)
					array(
						"label" => "Player Theme",
						"id" => $pq_shortname."_youtube_theme",
						"type" => "combobox",
						"options" => array("Dark", "Light"),
						"values" => array("dark", "light"),
						"default" => "dark",
						"help" => "This parameter indicates whether the embedded player will display player controls (like a 'play' button or volume control) within a dark or light control bar."
					),
					
					//controls -> player controls display (0, 1 or 2)
					array(
						"label" => "Player Controls",
						"id" => $pq_shortname."_youtube_controls",
						"type" => "combobox",
						"options" => array("No display", "Display (Flash player loads immediately)", "Display (Flash player loads afer the user initiates the video playback)"),
						"values" => array("0", "1", "2"),
						"default" => "2",
						"help" => "This parameter indicates whether the video player controls will display. For AS3 players, it also defines when the Flash player will load."
					),
					
					//iv_load_policy -> show video annotations (0 or 1)
					array(
						"label" => "Show Video Annotations",
						"id" => $pq_shortname."_youtube_iv_load_policy",
						"type" => "checkbox",
						"values" => array(3, 1),
						"default" => 3,
						"help" => "Check if you want to show annotations of a video while playing."
					),
					
					//modestbranding -> prevent youtube logo from appearing (0 or 1)
					array(
						"label" => "Player Modest Branding",
						"id" => $pq_shortname."_youtube_modestbranding",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 0,
						"help" => "This parameter lets you use a YouTube player that does not show a YouTube logo. Set the parameter value to 1 to prevent the YouTube logo from displaying in the control bar.",
						"info" => "Modest branding will not work if you set the player color to white!"
					),
					
					//rel -> show related videos at the end (0 or 1)
					array(
						"label" => "Show Related",
						"id" => $pq_shortname."_youtube_rel",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 1,
						"help" => "This parameter specifies wheter you want to show related videos at the end of a video."
					)
					
				)
			),
			
		  	//Vimeo
			array(
				"name" => "Vimeo player",
				"options" => array(
					//title -> Show the title
					array(
						"label" => "Show Title",
						"id" => $pq_shortname."_vimeo_title",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 1,
						"help" => "Check if you want to show the title on the vimeo's player."
					),
					
					//byline -> Show user's byline
					array(
						"label" => "Show Video Author's Byline",
						"id" => $pq_shortname."_vimeo_byline",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 0,
						"help" => "Check if you want to show the video author's byline on the vimeo's player."
					),
					
					//portrait -> Show user's portrait
					array(
						"label" => "Show Video Author's Portrait",
						"id" => $pq_shortname."_vimeo_portrait",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 0,
						"help" => "Check if you want to show the video author's portrait on the vimeo's player."
					),
					
					//color -> Video Player highlight color
					array(
						"label" => "Highlight Color",
						"id" => $pq_shortname."_vimeo_color",
						"type" => "color_palette_picker",
						"default" => "#00adef",
						"help" => "Defines the color to use to highlight the player components."
					)
				)
			),
			
		  	//Dailymotion
			array(
				"name" => "Dailymotion player",
				"options" => array(
					//foreground -> foreground color 
					array(
						"label" => "Foreground Color",
						"id" => $pq_shortname."_dailymotion_foreground",
						"type" => "color_palette_picker",
						"default" => "#F7FFFD",
						"help" => "Defines the color to use for the forground of controls elements."
					),
					
					//background -> background color
					array(
						"label" => "Background Color",
						"id" => $pq_shortname."_dailymotion_background",
						"type" => "color_palette_picker",
						"default" => "#FFC300",
						"help" => "HTML color of the background of controls elements."
					),
					
					//highlight -> highlight color
					array(
						"label" => "Highlight Color",
						"id" => $pq_shortname."_dailymotion_highlight",
						"type" => "color_palette_picker",
						"default" => "#171D1B",
						"help" => "HTML color of the controls elements’ highlights."
					),
					
					//related -> Show related videos at the end of the video
					array(
						"label" => "Show Related",
						"id" => $pq_shortname."_dailymotion_related",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 1,
						"help" => "This parameter specifies wheter you want to show related videos at the end of a video."
					),
					
					//logo -> check if you want to show the Dailymotion logo
					array(
						"label" => "Show Logo",
						"id" => $pq_shortname."_dailymotion_logo",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 0,
						"help" => "Check if you want to show the Dailymotion logo."
					),
					
					//info -> Show videos info (title/author) on the start screen
					array(
						"label" => "Show Info",
						"id" => $pq_shortname."_dailymotion_info",
						"type" => "checkbox",
						"values" => array(0, 1),
						"default" => 0,
						"help" => "Check if you want to show videos info (title/author) on the start screen."
					)
				)
			)
		),
    ),
	//APIS SETTINGS
    array("name" => "Apis Settings",
          "icon" => "fa-dashboard",
          "tabs" => array(
			//Google Fonts&Maps&Analytics
		  	array(
				"name" => "Google Api",
				"options" => array(
					array(
						"label" => "Google Key",
						"id" => $pq_shortname."_google_id",
						"type" => "text",
						"info" => "To use google fonts, google maps and analytics you need to register your site on the google api and get your app id. To do so you can go to this url: <a href='https://developers.google.com/maps/documentation/javascript/tutorial#api_key' target='_blank'>google api tutorial</a>, login if you haven't and follow the small tutorial. Fill in the required information and you'll be given a api key. <b>Don't forget you need to tick 'Google Maps API v3' , 'Web Fonts Developer API' and 'Analytics API' on the services list</b>",
						"help" => "Your google api key"
					),
					array(
						"label" => "Google Analytics Control Id",
						"id" => $pq_shortname."_google_analytics_id",
						"type" => "text",
						"info" => "To use google analytics you need to create an account on <a href='https://www.google.com/analytics/web/' target='_blank'>google analytics</a> page if you don't have already one. When you create one, will be given a control id, that's the code you need to put below",
						"help" => "Your google analytics control id"
					)
				)
			),
			
		  	//Facebook
		  	array(
				"name" => "Facebook Api",
				"options" => array(
					array(
						"label" => "Facebook App Id",
						"id" => $pq_shortname."_facebook_id",
						"type" => "text",
						"info" => "To use facebook commenting system you need to register your site on facbook and get your app id. To do so you can go to this url: <a href='https://developers.facebook.com/apps' target='_blank'>facebook apps</a>, login if you haven't and click on create new app. Fill in the required information and you'll be given the app id.",
						"help" => "Your App ID/API Key"
					)
				)
			),
			
			//Twitter
		  	array(
				"name" => "Twitter Api",
				"options" => array(
					array(
						"label" => "Twitter Consumer Key",
						"id" => $pq_shortname."_twitter_id",
						"type" => "text",
						"info" => "To use twitter shortcodes like tweet feed you need to register your site on twitter and get your app id. To do so you can go to this url: <a href='https://dev.twitter.com/apps' target='_blank'>twitter apps</a>, login if you haven't and click on create new app. Fill in the required information and you'll be given a consumer key and a consumer secret(don't share your consumer secret with anyone).",
						"help" => "Your consumer key"
					),
					array(
						"label" => "Twitter Consumer Secret",
						"id" => $pq_shortname."_twitter_secret",
						"type" => "text",
						"help" => "Your consumer secret"
					),
					array(
						"label" => "Twitter Access Token",
						"id" => $pq_shortname."_twitter_token",
						"type" => "text",
						"info" => "You just need access to read only purposes as essenza doesn't make posts to twitter.",
						"help" => "Your access token id"
					),
					array(
						"label" => "Twitter Access Token Secret",
						"id" => $pq_shortname."_twitter_token_secret",
						"type" => "text",
						"help" => "Your access secret token id"
					)
				)
			),
			
			//Flickr
		  	array(
				"name" => "Flickr Api",
				"options" => array(
					array(
						"label" => "Flickr Key",
						"id" => $pq_shortname."_flickr_id",
						"type" => "text",
						"info" => "To use flickr gallery shortcode you need to register your site on flickr and get your app id. To do so you can go to this url: <a href='http://www.flickr.com/services/apps/' target='_blank'>flickr apps</a>, login if you haven't and click on create new app. Fill in the required information and you'll be given a key.",
						"help" => "Your flickr key"
					)
				)
			),
			
			//Behance
		  	array(
				"name" => "Behance Api",
				"options" => array(
					array(
						"label" => "Behance Key",
						"id" => $pq_shortname."_behance_id",
						"type" => "text",
						"info" => "To use behance gallery shortcode you need to register your site on behance and get your app id. To do so you can go to this url: <a href='http://www.behance.net/dev/apps' target='_blank'>behance apps</a>, login if you haven't and click on create new app. Fill in the required information and you'll be given a API KEY and a CLIENT SECRET(don't share your consumer secret with anyone).",
						"help" => "Your behance API KEY / CLIENT ID"
					),
					array(
						"label" => "Behance Client Secret",
						"id" => $pq_shortname."_behance_secret",
						"type" => "text",
						"help" => "Your client secret id"
					)
				)
			)
			
		  )
	),
	
	//Font Settings
    array("name" => "Language Settings",
          "icon" => "fa-quote-right",
          "tabs" => array(
		  
			array(
				"name" => "Phrase&Words Translation",
				"options" => array(
					array(
						"label" => "Latest Tweets",
						"id" => $pq_shortname."_trans_latest_tweets",
						"type" => "text",
						"help" => "Footer Twitter widget text before tweets.",
						"default" => 'Latest Tweets'
					),
					array(
						"label" => "What are you searching for?",
						"id" => $pq_shortname."_trans_searching_for",
						"type" => "text",
						"help" => "Text that comes in the search pop up.",
						"default" => 'What are you searching for?'
					),
					array(
						"label" => "Search results",
						"id" => $pq_shortname."_trans_search_headline",
						"type" => "text",
						"help" => "Headline of the search page.",
						"default" => 'Search results'
					),
					array(
						"label" => "No Search Results",
						"id" => $pq_shortname."_trans_search_no_results",
						"type" => "text",
						"help" => "Text that appears on the search page when no result has been found.",
						"info" => "To make a search again button put the words between '#search_link#' and '#search_link_end#', e.g: #search_link#search again#search_link_end#",
						"default" => "Your search didn't return any results. Try #search_link#searching again#search_link_end#."
					),
					array(
						"label" => "Comment (Singular)",
						"id" => $pq_shortname."_trans_comment",
						"type" => "text",
						"help" => "Singular translation for comment.",
						"default" => 'Comment'
					),
					array(
						"label" => "Comments (Multiple)",
						"id" => $pq_shortname."_trans_comments",
						"type" => "text",
						"help" => "Multiple translation for comments.",
						"default" => 'Comments'
					),
					array(
						"label" => "No Comments",
						"id" => $pq_shortname."_trans_no_comments",
						"type" => "text",
						"help" => "'No Comments' translation",
						"default" => 'No Comments'
					),
					
					array(
						"label" => "show",
						"id" => $pq_shortname."_trans_show",
						"type" => "text",
						"help" => "Appears in the button for showing the comments.",
						"default" => 'show'
					),
					
					array(
						"label" => "hide",
						"id" => $pq_shortname."_trans_hide",
						"type" => "text",
						"help" => "Appears in the button for hiding the comments.",
						"default" => 'hide'
					),
					array(
						"label" => "Leave a comment",
						"id" => $pq_shortname."_trans_leave_comment",
						"type" => "text",
						"help" => "Appear in the comment form as title.",
						"default" => 'Leave a comment'
					),
					array(
						"label" => "Name",
						"id" => $pq_shortname."_trans_name",
						"type" => "text",
						"help" => "Comment form name field.",
						"default" => 'Name'
					),
					array(
						"label" => "E-mail",
						"id" => $pq_shortname."_trans_email",
						"type" => "text",
						"help" => "Comment form email field.",
						"default" => 'E-mail'
					),
					array(
						"label" => "Website",
						"id" => $pq_shortname."_trans_website",
						"type" => "text",
						"help" => "Comment form website field.",
						"default" => 'Website'
					),
					array(
						"label" => "Message",
						"id" => $pq_shortname."_trans_message",
						"type" => "text",
						"help" => "Comment form message field.",
						"default" => 'Message'
					),
					array(
						"label" => "Or connect using Facebook",
						"id" => $pq_shortname."_trans_or_facebook",
						"type" => "text",
						"help" => "'Or connect using Facebook' translation.",
						"default" => 'Or connect using Facebook'
					),
					array(
						"label" => "You're logged in as",
						"id" => $pq_shortname."_trans_logged_as",
						"type" => "text",
						"help" => "'You're logged in as' translation.",
						"default" => "You're logged in as"
					),
					array(
						"label" => "Log out",
						"id" => $pq_shortname."_trans_log_out",
						"type" => "text",
						"help" => "'Log out' translation.",
						"default" => "Log out"
					),
					array(
						"label" => "cancel reply to",
						"id" => $pq_shortname."_trans_cancel_reply",
						"type" => "text",
						"help" => "'cancel reply to' translation.",
						"default" => "cancel reply to"
					),
					array(
						"label" => "Reply to",
						"id" => $pq_shortname."_trans_reply_to",
						"type" => "text",
						"help" => "'Reply to' translation.",
						"default" => "Reply to"
					),
					array(
						"label" => "Reply",
						"id" => $pq_shortname."_trans_reply",
						"type" => "text",
						"help" => "'Reply' translation.",
						"default" => "Reply"
					),
					array(
						"label" => "Edit",
						"id" => $pq_shortname."_trans_edit",
						"type" => "text",
						"help" => "'Edit' translation.",
						"default" => "Edit"
					),
					array(
						"label" => "Comment waiting for approval",
						"id" => $pq_shortname."_trans_waiting_approval",
						"type" => "text",
						"help" => "Comment waiting for approval' translation.",
						"default" => "Comment waiting for approval"
					),
					array(
						"label" => "At least one required field is empty!",
						"id" => $pq_shortname."_trans_comment_error",
						"type" => "text",
						"help" => "'At least one required field is empty!' translation",
						"default" => "At least one required field is empty!"
					),
					array(
						"label" => "Loading more items",
						"id" => $pq_shortname."_trans_loading_more",
						"type" => "text",
						"help" => "'Loading more items' translation.",
						"default" => "Loading more items"
					),
					array(
						"label" => "Continue Reading",
						"id" => $pq_shortname."_trans_continue_reading",
						"type" => "text",
						"help" => "'Continue Reading' translation.",
						"default" => "Continue Reading"
					),
					array(
						"label" => "All projects",
						"id" => $pq_shortname."_trans_all_projects",
						"type" => "text",
						"help" => "'All projects' translation.",
						"default" => "All projects"
					),
					array(
						"label" => "All posts",
						"id" => $pq_shortname."_trans_all_posts",
						"type" => "text",
						"help" => "'All posts' translation.",
						"default" => "All posts"
					),
					array(
						"label" => "All items",
						"id" => $pq_shortname."_trans_all_items",
						"type" => "text",
						"help" => "'All items' translation.",
						"default" => "All items"
					),
					array(
						"label" => "Newer posts",
						"id" => $pq_shortname."_trans_newer_posts",
						"type" => "text",
						"help" => "'Newer posts' translation.",
						"default" => "Newer posts"
					),
					array(
						"label" => "Older posts",
						"id" => $pq_shortname."_trans_older_posts",
						"type" => "text",
						"help" => "'Older posts' translation.",
						"default" => "Older posts"
					),
					array(
						"label" => "What are you searching for?",
						"id" => $pq_shortname."_trans_searching_for",
						"type" => "text",
						"help" => "'What are you searching for?' translation.",
						"default" => "What are you searching for?"
					)
				)
			)
		)
	)
);