<?php


if(is_admin()){
	add_action( 'admin_head-post-new.php', 'template_catch' );
	add_action( 'admin_head-post.php', 'template_catch' );

	function template_catch(){
		global $post_type;
		if(strcmp($post_type, "page") != 0)
			return;
		
		
		?>
	    
	    
		<script>
			jQuery(document).ready(function ($){
				var $all = $(	"#page_builder_id_option_main_holder, "+				//0
								"#pagination_type_option_main_holder, "+				//1
								"#posts_per_page_option_main_holder, "+					//2
								"#page_fullscreen_option_main_holder, "+				//3
								"#page_align_option_main_holder, "+						//4
								"#page_width_option_main_holder, "+						//5 
								"#page_hor_margins_option_main_holder, "+				//6
								"#page_top_margin_option_main_holder, "+				//7
								"#page_bottom_margin_option_main_holder, "+				//8
								"#title_display_option_main_holder, "+					//9
								"#title_align_option_main_holder, "+					//10
								"#included_portfolio_categories_option_main_holder, "+	//11
								"#included_gallery_categories_option_main_holder, "+	//12
								"#included_blog_categories_option_main_holder, "+		//13
								"#use_sidebar_option_main_holder, "+					//14
								"#sidebar_option_main_holder, "+						//15
								"#max_thumb_width_option_main_holder, "+				//16
								"#description_position_option_main_holder, "+			//17
								"#description_content_align_option_main_holder, "+		//18
								"#show_filter_menu_option_main_holder, "+				//19
								"#filter_horizontal_option_main_holder, "+				//20
								"#filter_vertical_option_main_holder, "+				//21
								"#page_background_color_transparent_option_main_holder, "+	//22
								"#background_color_option_main_holder, "+				//23
								"#background_images_option_main_holder");				//24
				
				var templatesOptions = {
					"default":[0, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 22, 23, 24],
					"gallery.php":[12, 16, 19, 20, 21, 23],
					"blog-masonry.php":[13, 19, 20, 21, 23],
					"blog-mosaic.php":[13, 19, 20, 21, 23],
					"portfolio.php":[11, 17, 18, 19, 20, 21, 23],
					"blog.php":[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 23, 24]
				};
				
				//Update tabs available for the current page template
				function updateTabsAvailable(){
					 var template = $('#page_template').val();
					 
					 //Hide all
					 $all.css("display", "none");
					 
					 var optionsArray = templatesOptions[template];
					 $.each(
					 	optionsArray,
						function(index, value){
							$all.eq(value).css("display", "");
							
							if(index == 0)
								$all.eq(value).css("margin-top", "0px");
							else
								$all.eq(value).css("margin-top", "");
						}
					);
				}
				
				//On page template change
				$('#page_template').change(function() {
					updateTabsAvailable();
				});
				
				//initial fire
				updateTabsAvailable();
			});
		</script>
	    <?php	
	}



	/*
	*  Create new pq meta box with the options set
	*/
	$page_meta_options = array(
		//Page builder
		array(
			"label" => "Visual Pagebuilder",
			"id" => "page_builder_id",
			"type" => "page_builder",
			"info" => "You can make the content of your page here with our brand new visual pagebuilder where you can create content easily and fast with no knowledge of coding and shortcodes or effort!"
		),


		//Regular Blog
		array(
			"label" => "Pagination Type",
			"id" => "pagination_type",
			"type" => "combobox",
			"options" => array("Older&Newer", "Numeration"),
			"values" => array("simple", "numerate"),
			"help" => "Choose the pagination type for this regular blog page.",
			"default" => "simple"
		),
		array(
			"label" => "Posts Per Page",
			"id" => "posts_per_page",
			"type" => "text",
			"help" => "Number of posts per page.",
			"default" => "5"
		),


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

		//Page Display Title
		array(
			"label" => "Don't Display Title",
			"id" => "title_display",
			"type" => "checkbox",
			"values" => array("true", "false"),
			"help" => "Check if you don't want this page to display a title.",
			"default" => "true"
		),

		//Page Title alignment
		array(
			"label" => "Title Alignment",
			"id" => "title_align",
			"type" => "combobox",
			"options" => array("Left", "Center", "Right"),
			"values" => array(" ", "center", "right"),
			"help" => "Choose the title alignment in the page.",
			"default" => " "
		),



		//Categories
		array(
			//portfolio categories
			"label" => "Available Portfolio Categories",
			"id" => "included_portfolio_categories",
			"type" => "category_picker",
			"taxonomy" => "portfolio_category",
			"default" => "all",
			"info" => "Tick the categories you want to include in this page."
		),
		array(
			//gallery categories
			"label" => "Available Gallery Categories",
			"id" => "included_gallery_categories",
			"type" => "category_picker",
			"taxonomy" => "galleries",
			"default" => "all",
			"info" => "Tick the categories you want to include in this page."
		),
		array(
			//blog categories
			"label" => "Available Blog Categories",
			"id" => "included_blog_categories",
			"type" => "category_picker",
			"taxonomy" => "category",
			"default" => "all",
			"info" => "Tick the categories you want to include in this page."
		),


		//Sidebar
		array(
			//use sidebar
			"label" => "Use Sidebar",
			"id" => "use_sidebar",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "false",
			"help" => "Check if you want to use a sidebar on this page."
		),
		array(
			//sidebar
			"label" => "Sidebar Picker",
			"id" => "sidebar",
			"type" => "sidebar_picker",
			"info" => "Build your sidebar for this page, or use one already made from the ones saved."
		),


		//Max thumb width
		array(
			"label" => "Max. Thumb Width",
			"id" => "max_thumb_width",
			"type" => "text",
			"default" => "400",
			"info" => "Changing the max thumb width allows you to have more/less columns of thumbs lined up in a single screen (if you increase the value the less columns will be shown)."
			
		),


		//Portfolio description position
		array(
			"label" => "Portfolio On Hover Description Placement",
			"id" => "description_position",
			"type" => "combobox",
			"options" => array("On the side", "Above"),
			"values" => array("side_position", "above_position"),
			"default" => "side_position",
			"help" => "Choose the place where the description will appear when rolling over an item on this portfolio page."
		),
		array(
			"label" => "Portfolio On Hover Description Content Alignment",
			"id" => "description_content_align",
			"type" => "combobox",
			"options" => array("Left", "Center"),
			"values" => array("left", "center"),
			"default" => "left",
			"help" => "Choose the alignment of the elements of a portfolio item small description."
		),

		
		//Filter
		array(
			//show filter menu
			"label" => "Show Filter Menu",
			"id" => "show_filter_menu",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"help" => "Check this to show the filter menu on this page."
		),
		array(
			//Filter x position
			"label" => "Filter Menu Horizontal Position (%)",
			"id" => "filter_horizontal",
			"type" => "percentage",
			"default" => "5",
			"help" => "The Horizontal percentage position you want the menu to have."
		),
		array(
			//Filter y position
			"label" => "Filter Menu Vertical Position (%)",
			"id" => "filter_vertical",
			"type" => "percentage",
			"default" => "95",
			"help" => "The Vertical percentage position you want the menu to have."
		),



		//Page
		array(
			//background color opacity
			"label" => "Page Background Transparency",
			"id" => "page_background_color_transparent",
			"type" => "percentage",
			"help" => "The percentage of opacity you want this page to have.",
			"default" => "100"
		),


		//Background
		array(
			//background color
			"label" => "Background color",
			"id" => "background_color",
			"type" => "color_palette_picker",
			"help" => "Choose the background color of this page.",
			"default" => "#d1d1d1"
		),
		array(
			//background images
			"label" => "Background Images",
			"id" => "background_images",
			"type" => "media_picker",
			"info" => "Choose the images you want to appear as background of this page."
		)
	);

	new pq_meta_box($page_meta_options, "page");
}

