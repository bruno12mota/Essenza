<?php 

class pq_slider_builder {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare slider editor
	*
	*	@author Plusquare
	*	@date 18-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id){
		$this->id = $id;

		//Pages
		$pages = get_pages(); 
		$pagesOptions = array();
		$pagesValues = array();
		foreach($pages as $page){
			array_push ($pagesOptions, $page->post_title);
			array_push ($pagesValues, $page->guid);
		}
		
		$options = array(
		
			//Slide Settings
    		array(
				"name" => "Slide Configuration",
          		"icon" => get_template_directory_uri()."/plusquare_admin/UI_Elements/slider_builder/slide_configuration.png",
				"tabs" => array(
					//Slide background
					array(
						"name" => "Slide settings",
						"options" => array(
							//Slide duration
							array(
								"label" => "Slide duration",
								"id" => "duration_input",
								"type" => "text",
								"default" => "7.0",
								"help" => "Slide duration in seconds."
							),
					
							//Slide background
							array(
								"label" => "Slide Background",
								"id" => "slide_media_type",
								"type" => "tabs",
								"options" => array("Image", "Video", "Color"),
								"values" => array("image", "video", "color"),
								"default" => "image",
								"tabs" => array(
									//Image type
									"image" => array(
										"label" => "Item Image",
										"id" => "slide_image_id",
										"type" => "media_single_picker",
										"width" => 200,
										"height" => 200,
										"info" => "This image will serve as the slide background, the best resolution will be used for each ocasion so feel free to choose a high resolution one even if you're using only for blog."
									),
									
									//Video type
									"video" => array(
										//Video type (youtube, vimeo, dailymotion)
										array(
											"label" => "Item Video",
											"id" => "slide_video_type",
											"type" => "video_picker",
											"default" => "youtube",
											"info" => "This video will appear on the lightbox when you open the item. Pick the social video site where your video is located."
										),
										
										//Social video id
										array(
											"label" => "Item Video Id",
											"id" => "slide_video_id",
											"type" => "text",
											"help" => "Social video id you want to play, note you only need to put the video id here, not a embedding code!"
										),
										
										//Social video thumb
										array(
											"label" => "Slide Image",
											"id" => "slide_video_image",
											"type" => "media_single_picker",
											"width" => 200,
											"height" => 200,
											"info" => "The image you want for this slide to be used as preview of this video!"
										),

										array(
											"label" => "Video Autoplay",
											"id"=> "slide_video_autoplay",
											"type"=> "checkbox",
											"values" => array("false", "true"),
											"default" => "false",
											"info" => "Check to make the video autoplay as soon as available or on slide enter!"
										)
									),

									//Color type
									"color" => array(
										array(
											"label" => "Slide Background Color",
											"id" => "slide_background_color",
											"type" => "color_picker",
											"default" => "#ffffff",
											"info" => "This color will be used as background for the current slide."
										)
									)
								)
							),


							//Slide thumbnail
							array(
								"label" => "Slide Thumbnail",
								"id" => "slide_thumbnail_id",
								"type" => "media_single_picker",
								"width" => 100,
								"height" => 100,
								"info" => "This image will serve as the slide thumbnail."
							)
						)
					),
					
					
					//Slide elements
					array(
						"name" => "Slide elements",
						"options" => array(
							array(
								"label" => "Slide Elements Overview",
								"id" => "slider_elements_overview",
								"type" => "orderable_list",
								"info" => "Change the depth of the elements by dragging them around or use the arrow buttons on the right."
							),


							array(
								"label" => "Editing Element",
								"id" => "slide_element_tabs_unb",
								"type" => "tabs_unbinded",
								"options" => array("Properties", "Animation"),
								"tabs" => array(
									//Properties
									array(
										//Vertical Snapping
										array(
											"label" => "Vertical Snapping",
											"id" => "vertical_snapping",
											"type" => "combobox",
											"options" => array("Top", "Center", "Bottom"),
											"values" => array("top", "center", "bottom"),
											"default"=> "center",
											"info" => "This will set the element vertical alignment for fullscreen mode when the ratio(width/height) is lower than the one from the builder!"
										),

										//Horizontal Snapping
										array(
											"label" => "Horizontal Snapping",
											"id" => "horizontal_snapping",
											"type" => "combobox",
											"options" => array("Left", "Center", "Right"),
											"values" => array("left", "center", "right"),
											"default"=> "center",
											"info" => "This will set the element horizontal alignment for fullscreen mode when the ratio(width/height) is higher than the one from the builder!"
										),

										//Element Max/min Scaling
										array(
											"label" => "Min. Scale",
											"id" => "min_scale",
											"type" => "percentage",
											"default" => "0",
											"help" => "The minimum scale value you want the element to have (normal size is 100)."
										),
										array(
											"label" => "Max. Scale",
											"id" => "max_scale",
											"type" => "percentage",
											"default" => "999",
											"help" => "The maximum scale value you want the elements to have."
										),
						
										//Text type properties
										array(
											"label" => "Text Block",
											"id" => "slide_text_properties",
											"type" => "text_block_picker",
											"info" => "Edit the properties of the current selected text block and see the changes on the canvas, when editing text fields you have to click outside the input field to see the changes!"
										),
										
										//Button type properties
										array(
											"label" => "Buttons",
											"id" => "slide_button_properties",
											"type" => "button_picker",
											"info" => "Edit the properties of the current selected button block and see the changes on the canvas, when editing text fields you have to click outside the input field to see the changes!"
										)
									),

									//Animation
									array(
										array(
											"label" => "Selected Element Animation",
											"id" => "slider_element_animation",
											"type" => "slide_element"
										)
									)
								)
							)
						)
					),
					
					
					//Ken Burns
					array(
						"name" => "Position & Ken Burns",
						"options" => array(
							array(
								"label" => "Background zoom and positioning",
								"id" => "slide_background_position",
								"type" => "ken_burns",
								"info" => "This will take effect on the image instance when animates in, there is no animation associated with this unless you define the second instance and tick the ken burns effect below."
							),
							array(
								"label" => "Ken burns effect",
								"id" => "slide_use_ken_burns",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "false",
								"help" => "Check this if you want to use ken burns effect."
							),
							array(
								"label" => "Background zoom and positioning",
								"id" => "slide_background_end_position",
								"type" => "ken_burns",
								"info" => "This will be the last ken burns positioning, it will animate from the first instance above to this within the time you specify below."
							),
							array(
								"label" => "Ken burns effect duration",
								"id" => "slide_ken_burns_duration",
								"type" => "text",
								"default" => "7",
								"help" => "Set the time you want the ken burns effect to last."
							),

							//Vertical Snapping
							array(
								"label" => "Background Vertical Snapping",
								"id" => "background_vertical_snapping",
								"type" => "combobox",
								"options" => array("Top", "Center", "Bottom"),
								"values" => array("top", "center", "bottom"),
								"default"=> "center",
								"info" => "This will set the background vertical alignment for fullscreen mode when the ratio(width/height) is lower than the one from the builder!"
							),

							//Horizontal Snapping
							array(
								"label" => "Background Horizontal Snapping",
								"id" => "background_horizontal_snapping",
								"type" => "combobox",
								"options" => array("Left", "Center", "Right"),
								"values" => array("left", "center", "right"),
								"default"=> "center",
								"info" => "This will set the background horizontal alignment for fullscreen mode when the ratio(width/height) is higher than the one from the builder!"
							),
						)
					)
				)
			),
			
			
			//Slider Configuration
    		array(
				"name" => "Slider Configuration",
          		"icon" => get_template_directory_uri()."/plusquare_admin/UI_Elements/slider_builder/slider_configuration.png",
				"tabs" => array(
					//Slide elements
					array(
						"name" => "Slides overview",
						"options" => array(
							array(
								"label" => "Slides Overview",
								"id" => "slides_overview",
								"type" => "orderable_list",
								"info" => "Change the order of the slides by dragging them around or use the arrow buttons on the right."
							)
						)
					),

					//Configuration
					array(
						"name" => "Slider settings",
						"options" => array(
							array(
								"label" => "Slider Relative Height",
								"id" => "height",
								"type" => "percentage",
								"default" => "45",
								"help" => "Slider height is relative to the slider's width, so if the slider is 500px wide and you set 50% as height it will have 250px height in this case."
							),

							//Animation Duration
							array(
								"label" => "Slides Transition Duration (sec.)",
								"id" => "slider_transition_duration",
								"type" => "text",
								"default" => "1",
								"help" => "Animation duration from the previous to the next phase."
							),
							
							//Animation Tween Type
							array(
								"label" => "Slides Transition Tween Type",
								"id" => "slider_transition_type",
								"type" => "combobox",
								"options" => array( "linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
								"values" => array("linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
								"default" => "Expo",
								"help" => "Animation tween type."
							),
							
							//Animation Tween Ease
							array(
								"label" => "Slides Transition Tween Ease",
								"id" => "slider_transition_ease",
								"type" => "combobox",
								"options" => array( "Ease In", "Ease Out", "Ease In&Out" ),
								"values" => array( "easeIn", "easeOut", "easeInOut" ),
								"default" => "easeOut",
								"help" => "Animation tween ease."
							),

							//Animation Starting Point
							array(
								"label" => "Slides Transition Starting Point",
								"id" => "slider_transition_starting",
								"type" => "percentage",
								"default" => "0",
								"help" => "This defines a percentage for the starting point, setting for example to 50% will make it to jump to 50% of the slider width before starting the animation (good for fast animations). Set to 0(zero) if you don't want a starting point offset."
							),
							
							//mouseDragging
							array(
								"label" => "Mouse&Touch Swipe",
								"id" => "mouseDragging",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "true",
								"help" => "Check if you want the slider to change slide on mouse swipe."
							),
							
							//handCursor
							array(
								"label" => "Show Hand Cursor",
								"id" => "handCursor",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "true",
								"help" => "Check if you want the custom hand cursos to show up on over."
							),
							
							//autoplay
							array(
								"label" => "Autoplay",
								"id" => "autoplay",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "true",
								"help" => "Check if you want the slider to autoplay at start."
							),

							//background color
							array(
								"label" => "Background Color",
								"id" => "backgroundColor",
								"type" => "color_picker",
								"default" => "#dddddd",
								"help" => "The slider's background color."
							)						
						)
					),
					
					//Buttons
					array(
						"name" => "Buttons",
						"options" => array(
							//buttonsHide
							array(
								"label" => "Hide Buttons On Mouse Out",
								"id" => "buttonsHide",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "true",
								"help" => "Check if you want the buttons to fade out on mouse out of the slider."
							),
							
							//buttonsHideDelay
							array(
								"label" => "Hide Delay (sec.)",
								"id" => "buttonsHideDelay",
								"type" => "text",
								"default" => "0",
								"help" => "Time in seconds before buttons fade out (in case hide buttons above is set to true)."
							),
							
							//buttonsHideSpeed
							array(
								"label" => "Hide Speed (sec.)",
								"id" => "buttonsHideSpeed",
								"type" => "text",
								"default" => "0.5",
								"help" => "Time in seconds the buttons take to fade out and in (in case hide buttons above is set to true)."
							),
							
							//pauseOnOver
							array(
								"label" => "Pause Slideshow On Mouse Over",
								"id" => "pauseOnOver",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "false",
								"help" => "Check if you want the slider to stop autoplay on mouse over."
							),
							
							array(
								"label" => "Different Buttons Settings",
								"id" => "multiple_button_settings",
								"type" => "tabs_unbinded",
								"options" => array("Left & Right", "Slides Buttons", "Play/Pause", "Close Link"),
								"tabs" => array(
									//Left & Right
									array(
										//showArrows
										array(
											"label" => "Show Arrows",
											"id" => "showArrows",
											"type" => "checkbox",
											"values" => array("false", "true"),
											"default" => "true",
											"help" => "Check if you want the next and previous slide arrows to appear."
										),
										
										//leftArrowVA
										array(
											"label" => "Left Arrow Vertical Alignment",
											"id" => "leftArrowVA",
											"type" => "combobox",
											"options" => array("Top", "Center", "Bottom"),
											"values" => array("top", "center", "bottom"),
											"default" => "center",
											"help" => "Choose the left arrow's vertical alignment between top, center and bottom."
										),
										
										//leftArrowHA
										array(
											"label" => "Left Arrow Horizontal Alignment",
											"id" => "leftArrowHA",
											"type" => "combobox",
											"options" => array("Left", "Center", "Right"),
											"values" => array("left", "center", "right"),
											"default" => "left",
											"help" => "Choose the left arrow's horizontal alignment between left, center and right."
										),
										
										//leftArrowVO
										array(
											"label" => "Left Arrow Vertical Offset (px.)",
											"id" => "leftArrowVO",
											"type" => "text",
											"default" => "0",
											"help" => "Vertical offset from the alignment you set before."
										),
										
										//leftArrowHO
										array(
											"label" => "Left Arrow Horizontal Offset (px.)",
											"id" => "leftArrowHO",
											"type" => "text",
											"default" => "10",
											"help" => "Horizontal offset from the alignment you set before."
										),
										
										//rightArrowVA
										array(
											"label" => "Right Arrow Vertical Alignment",
											"id" => "rightArrowVA",
											"type" => "combobox",
											"options" => array("Top", "Center", "Bottom"),
											"values" => array("top", "center", "bottom"),
											"default" => "center",
											"help" => "Choose the right arrow's vertical alignment between top, center and bottom."
										),
										
										//rightArrowHA
										array(
											"label" => "Right Arrow Horizontal Alignment",
											"id" => "rightArrowHA",
											"type" => "combobox",
											"options" => array("Left", "Center", "Right"),
											"values" => array("left", "center", "right"),
											"default" => "right",
											"help" => "Choose the right arrow's horizontal alignment between left, center and right."
										),
										
										//rightArrowVO
										array(
											"label" => "Right Arrow Vertica Offset (px.)",
											"id" => "rightArrowVO",
											"type" => "text",
											"default" => "0",
											"help" => "Vertical offset from the alignment you set before."
										),
										
										//rightArrowHO
										array(
											"label" => "Right Arrow Horizontal Offset (px.)",
											"id" => "rightArrowHO",
											"type" => "text",
											"default" => "-10",
											"help" => "Horizontal offset from the alignment you set before."
										)
									),
									
									//Slides Buttons
									array(
										//showButtons
										array(
											"label" => "Show Buttons",
											"id" => "showButtons",
											"type" => "checkbox",
											"values" => array("false", "true"),
											"default" => "true",
											"help" => "Check if you want the slides buttons/bullets to show up."
										),
										
										//buttonsVA
										array(
											"label" => "Buttons Vertical Alignment",
											"id" => "buttonsVA",
											"type" => "combobox",
											"options" => array("Top", "Center", "Bottom"),
											"values" => array("top", "center", "bottom"),
											"default" => "bottom",
											"help" => "Choose the buttons's vertical alignment between top, center and bottom."
										),
										
										//buttonsHA
										array(
											"label" => "Buttons Horizontal Alignment",
											"id" => "buttonsHA",
											"type" => "combobox",
											"options" => array("Left", "Center", "Right"),
											"values" => array("left", "center", "right"),
											"default" => "center",
											"help" => "Choose the buttons's horizontal alignment between left, center and right."
										),
										
										//buttonsVO
										array(
											"label" => "Buttons Vertical Offset (px.)",
											"id" => "buttonsVO",
											"type" => "text",
											"default" => "-10",
											"help" => "Vertical offset from the alignment you set before."
										),
										
										//buttonsHO
										array(
											"label" => "Buttons Horizontal Offset (px.)",
											"id" => "buttonsHO",
											"type" => "text",
											"default" => "0",
											"help" => "Horizontal offset from the alignment you set before."
										)
									),
									
									//Play/Pause
									array(
										//showPlayPauseButton
										array(
											"label" => "Show Play/Pause",
											"id" => "showPlayPauseButton",
											"type" => "checkbox",
											"values" => array("false", "true"),
											"default" => "true",
											"help" => "Check if you want the Play/Pause button to show up."
										),
										
										//PlayPauseVA
										array(
											"label" => "Play/Pause Vertical Alignment",
											"id" => "PlayPauseVA",
											"type" => "combobox",
											"options" => array("Top", "Center", "Bottom"),
											"values" => array("top", "center", "bottom"),
											"default" => "bottom",
											"help" => "Choose the Play/Pause's vertical alignment between top, center and bottom."
										),
										
										//PlayPauseHA
										array(
											"label" => "Play/Pause Horizontal Alignment",
											"id" => "PlayPauseHA",
											"type" => "combobox",
											"options" => array("Left", "Center", "Right"),
											"values" => array("left", "center", "right"),
											"default" => "right",
											"help" => "Choose the Play/Pause's horizontal alignment between left, center and right."
										),
										
										//PlayPauseVO
										array(
											"label" => "Play/Pause Vertical Offset (px.)",
											"id" => "PlayPauseVO",
											"type" => "text",
											"default" => "-8",
											"help" => "Vertical offset from the alignment you set before."
										),
										
										//PlayPauseHO
										array(
											"label" => "Play/Pause Horizontal Offset (px.)",
											"id" => "PlayPauseHO",
											"type" => "text",
											"default" => "-8",
											"help" => "Horizontal offset from the alignment you set before."
										)
									),

									//Close Link
									array(
										//showCloseButton
										array(
											"label" => "Show Close Button",
											"id" => "showCloseButton",
											"type" => "checkbox",
											"values" => array("false", "true"),
											"default" => "false",
											"help" => "Check if you want the Close button to show up.",
											"info" => "This will only appear for this fullscreen slider page (won't appear when slider is inserted on a blog page for example)."
										),

										//CloseLink
										array(
											"label" => "Close Button Link",
											"id" => "closeLink",
											"type" => "combobox",
											"options" => $pagesOptions,
											"values" => $pagesValues,
											"help" => "The page you want the close button to direct to."
										),
										
										//CloseVA
										array(
											"label" => "Close Button Vertical Alignment",
											"id" => "closeVA",
											"type" => "combobox",
											"options" => array("Top", "Center", "Bottom"),
											"values" => array("top", "center", "bottom"),
											"default" => "top",
											"help" => "Choose the Close Button's vertical alignment between top, center and bottom."
										),
										
										//PlayPauseHA
										array(
											"label" => "Close Button Horizontal Alignment",
											"id" => "closeHA",
											"type" => "combobox",
											"options" => array("Left", "Center", "Right"),
											"values" => array("left", "center", "right"),
											"default" => "right",
											"help" => "Choose the Close Button's horizontal alignment between left, center and right."
										),
										
										//PlayPauseVO
										array(
											"label" => "Close Button Vertical Offset (px.)",
											"id" => "closeVO",
											"type" => "text",
											"default" => "-8",
											"help" => "Vertical offset from the alignment you set before."
										),
										
										//PlayPauseHO
										array(
											"label" => "Close Button Horizontal Offset (px.)",
											"id" => "closeHO",
											"type" => "text",
											"default" => "-8",
											"help" => "Horizontal offset from the alignment you set before."
										)
									)
								)
							)		
						)
					),
					
					//Thumbnails
					array(
						"name" => "Thumbnails",
						"options" => array(
							//useThumbnails
							array(
								"label" => "Use Thumbnails",
								"id" => "useThumbnails",
								"type" => "checkbox",
								"values" => array("false", "true"),
								"default" => "false",
								"help" => "Check if you want to use thumbnails for each slide.",
								"info" => "Checking thumbnails will prevent bullet buttons to appear, they are replaced by the thumbnails representation."
							),
							
							array(
								"label" => "Thumbnails Settings",
								"id" => "thumbnails_tab_settings",
								"type" => "tabs_unbinded",
								"options" => array("General options", "Thumbnail options", "Background options"),
								"tabs" => array(
									//General options
									array(
										//thumbsPosition
										array(
											"label" => "Thumbs position",
											"id" => "thumbsPosition",
											"type" => "combobox",
											"options" => array("Top", "Right", "Bottom", "Left"),
											"values" => array("top", "right", "bottom", "left"),
											"default" => "bottom",
											"help" => "The position of the thumbs in the slider holder."
										),
										
										//thumbsActiveCenter
										array(
											"label" => "Active Thumb To Center",
											"id" => "thumbsActiveCenter",
											"type" => "checkbox",
											"values" => array("false", "true"),
											"default" => "false",
											"help" => "Check if you want the active thumb to be in the center."
										),
										
										//thumbsScrollSpeed
										array(
											"label" => "Scroll Speed",
											"id" => "thumbsScrollSpeed",
											"type" => "text",
											"default" => "3",
											"help" => "Scroll speed for when there is the need to scroll thumbnails."
										)
									),
									
									//Thumbnail options
									array(
										//thumbWidth
										array(
											"label" => "Thumbnail Width (px.)",
											"id" => "thumbWidth",
											"type" => "text",
											"default" => "70",
											"help" => "Width in pixels for each thumbnail."
										),
										
										//thumbHeight
										array(
											"label" => "Thumbnail Height (px.)",
											"id" => "thumbHeight",
											"type" => "text",
											"default" => "50",
											"help" => "Height in pixels for each thumbnail."
										),
										
										//thumbRound
										array(
											"label" => "Rounded Corners (px.)",
											"id" => "thumbRound",
											"type" => "text",
											"default" => "0",
											"help" => "Thumbnail round corners value in pixels, set 0 if you don't want rounded corners."
										),
										
										//thumbAlign
										
										
										//thumbSpacing
										array(
											"label" => "Vertical Margin (px.)",
											"id" => "thumbVerMargin",
											"type" => "pixels",
											"default" => "0",
											"help" => "Time in seconds before buttons fade out (in case hide buttons above is set to true)."
										),
										
										//thumbBorder	
										array(
											"label" => "Horizontal Margin (px.)",
											"id" => "thumbHorMargin",
											"type" => "pixels",
											"default" => "0",
											"help" => "Time in seconds before buttons fade out (in case hide buttons above is set to true)."
										),
										
										//thumbOverOpc
										array(
											"label" => "Rollover Opacity",
											"id" => "thumbOverOpc",
											"type" => "percentage",
											"default" => "80",
											"help" => "Percentage value (0-100) for the opacity you want the thumbnail to tween to when mouse over."
										),
										
										//thumbActiveOpc
										array(
											"label" => "Active Opacity",
											"id" => "thumbActiveOpc",
											"type" => "percentage",
											"default" => "100",
											"help" => "Percentage value (0-100) for the opacity you want the thumbnail to tween to when respective slide is active."
										),
										
										//thumbDeactiveOpc
										array(
											"label" => "Deactive opacity",
											"id" => "thumbDeactiveOpc",
											"type" => "percentage",
											"default" => "50",
											"help" => "Percentage value (0-100) for the opacity you want the thumbnail to tween to when it's not active nor the mouse is over."
										)
									),
									
									//Background options
									array(
										//thumbsBackground
										array(
											"label" => "Use Background",
											"id" => "thumbsBackground",
											"type" => "checkbox",
											"values" => array("false", "true"),
											"default" => "true",
											"help" => "Check if you want to use a background behind the thumbnails holder."
										),
							
										//thumbsBackgroundOpc
										array(
											"label" => "Background opacity",
											"id" => "thumbsBackgroundOpc",
											"type" => "percentage",
											"default" => "50",
											"help" => "Percentage value (0-100) for the opacity you want the thumbnails's background to have."
										),
										
										//thumbsBackgroundColor
										array(
											"label" => "Background Color",
											"id" => "thumbsBackgroundColor",
											"type" => "color_picker",
											"default" => "#000000",
											"help" => "Thumbnails's holder background color."
										)
									)
								)
							)
						)
					)
				)
			)
		);

		
		?>
        
        
        <div id="<?php echo $id; ?>" class='slideManager'>
        	<div class="sliderHolder">
                <div class="sliderHolderInfo"></div>
                <div class="landingPage">
                	<div class="landingPageImage">No content yet!</div>
                </div>
                
                <!-- Slider background holder -->
                <div class="background"></div>
                
                <!-- Trace for selected elements -->
                <div class="tracer"></div>
                
                <!-- Slider elements holder -->
                <div class="elements"></div>
                
                <!-- Loading holder -->
                <div class="loading">
                	<div class="loading-gif">Loading background...</div>
                </div>
            </div>
            
            <!-- Menu slider builder -->
            <div class="menu_top">
            	<a href="#" class="changeSlide previous"></a>
                <div class="info">Current selected slide: <span>1/3</span></div>
                <a href="#" class="changeSlide next"></a>

                <a id="slider_publish_button" class="ui-button livePreview" href="#"><img class="arrow-icon-left" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/UI_Elements/live_preview_icon.png"/>Publish Slider</a>
            
                <a href='#' class='menu_btn remove_slide'>Remove this slide</a>
                <a href='#' class='menu_btn add_new'>Add new slide</a>
                
            </div>
            
            <!-- Edit Tabs -->
            <div class="customizer_tabs_wraper">
            	<!-- MENU -->
                <div class="menu">
                	<ul>
                    	<?php
                            $count = 0;
                            foreach($options as $mainTab) {
                                    echo '<li><a href="#" class="tc_button"><img src="'.$mainTab['icon'].'"/>'.$mainTab['name'].'</a>';
                                
                                //sub buttons
                                echo '<ul>';
                                foreach ($mainTab['tabs'] as $tab) {
                                    //tab
                                    echo '<li><a href="#" class="tc_sub_button" rel="'.$count.'">'.$tab['name'].'</a></li>';
                                    $count++;
                                }
                                echo '</ul>';
                            }
                        ?>
                    </ul>
                </div>
                
                <!-- CONTENT -->
                <div class="contents" style="width: 695px;">
                	<?php
                        foreach($options as $mainTab) {
                            foreach ($mainTab['tabs'] as $tab) {
                                ?>
                                <div class="content" style="display: none;">
                                <?php
                                //iterate tab options
                                foreach ($tab['options'] as $option) {
                                    make_option($option, "option");
                                }
                                ?>
                                </div>
                                <?php
                            }
                        }
                    ?>
                </div>
            </div>
        </div>
        
        
        
        <style>
			#postbox-container-1{
				display: none !important;
				float: left !important;
				margin-right: 0px !important;
				width: 100% !important;
			}
			#post-body{
				margin-right: 0px !important;
			}
			#side-sortables{
				min-height: 0 !important;	
			}
		</style>
        <!-- Add page builder dynamically -->
        <script type="text/javascript">
            require(["jquery", "SliderBuilder/SliderEditor"],
                function($, SliderBuilder) {
                	$(document).ready(function(){
                		var mainOptionsIds = [
						<?php 
							$first = true;
							foreach($options[1]["tabs"] as $tab){
								foreach($tab["options"]	as $option){
									
									if($option["type"] == "tabs_unbinded"){
										foreach($option["tabs"]	as $subTab){
											foreach($subTab	as $suboption){
												if(!$first)
													echo ",";	
												echo '"'.$suboption["id"].'"';
												$first = false;
											}
										}
									}
									else{
										if(!$first)
											echo ",";	
										echo '"'.$option["id"].'"';
										$first = false;
									}
								}
							}
						?>
						];
						//console.log(mainOptionsIds);
						
	                    new SliderBuilder("#<?php echo $id; ?>", "<?php echo get_template_directory_uri(); ?>/plusquare_admin/", mainOptionsIds, "<?php
							global $post;
							echo $post->ID;
						?>");
	                
	                    $("#slider_publish_button").click(function(){
	                    	$("#publish").trigger("click");
	                    	return false;
	                    });
                	});
                }
            );
        </script>
        <?php
	}
	
	
}