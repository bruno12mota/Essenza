<?php
global $pq_shortname;
$plusquare_shortcodes_options = array();



/*
 *  Icon
 *
 *	@description: Makes a font awesome icon
 *  @parameters: none
 *  @content: icon id
 */
function plusquare_icon_func($atts, $content){
	//Make divider
	return '<i class="'.$content.'"></i>';
}
add_shortcode( 'icon', 'plusquare_icon_func' );
add_shortcode( 'i', 'plusquare_icon_func' );






/*
 *  Social Video Player (Youtube, vimeo and dailymotion)
 *
 *	@description: Makes the ifrmae for youtube vimeo or dailymotion video
 *  @parameters: [ type(vimeo, youtube or dailymotion) ]
 *  @content: Video's id
 */
function plusquare_social_video_player($atts, $id){
	extract( shortcode_atts( array(
		'type' => 'vimeo',
		'height' => '56',
		'use_cover' => 'false',
		'cover' => ''
	), $atts ) );

	if($use_cover == "true" && $cover != ""){
		//Get url
		$url = plusquare_get_social_video_url($type, $id, "1");

		$imageSrc = wp_get_attachment_image_src( $cover , "full");
		$imageUrl = $imageSrc[0];
		$w = $imageSrc[1];
		$h = $imageSrc[2];

		if($w != 0){
			$ratio  = $h / $w;
			$toRatio = $height / 100.0;

			if($ratio > $toRatio){
				//height needs to be reduced
				$h = $w * $toRatio;
			}
			else{
				$w = $h / $toRatio;
			}
			$imageUrl = mr_image_resize($imageUrl, $w, $h, true, 'c', false);
		}
		
		

		$return = '<div class="social_video" data-height="'.$height.'" data-src="'.$url.'">';
		$return.= 	'<a class="tooglePlayVideo" onclick="return false;" href="#" style=""><i class="esza-play"></i></a>';
		$return.= 	'<img src="'.$imageUrl.'" style="width: 100%;">';
		$return.= '</div>';

		return $return;
	}

	//Get url
	$url = plusquare_get_social_video_url($type, $id);
	
	//Make iframe
	$iframe = '<iframe class="social_video" src="'.$url.'" width="100%" data-height="'.$height.'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

	return $iframe;
}
add_shortcode( 'socialVideo', 'plusquare_social_video_player' );

//social video shortcode options
$plusquare_shortcodes_options["socialVideo"] = array(
	"shortcode" => "socialVideo",
	"name" => "Video Object",
	"color" => "#eb3338",
	"icon" => "images/page_builder/Modules/video_object.png",
	"options" => array(
		//Video type (youtube, vimeo, dailymotion)
		array(
			"label" => "Item Video",
			"id" => "social_video_type",
			"type" => "video_picker",
			"default" => "youtube",
			"info" => "Pick the site where your video is hosted.",
			"associate" => "type"
		),
		
		//Social video id
		array(
			"label" => "Item Video Id",
			"id" => "social_video_id",
			"type" => "text",
			"help" => "Social video id you want to play, note you only need to put the video id here, not a embedding code!",
			"associate" => "content"
		),
		
		//Social video id
		array(
			"label" => "Item Video Height",
			"id" => "social_video_height",
			"type" => "percentage",
			"default" => "56",
			"info" => "The height of the video is calculated according to the width, so you can define an aspect ratio for the video, the default is 56% as it represents the 16:9 format!",
			"associate" => "height"
		),
		
		//Social video id
		array(
			"label" => "Item Video Use Cover",
			"id" => "social_video_use_cover",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "false",
			"info" => "Check this if you want to display an image before the video!",
			"associate" => "use_cover"
		),
		
		//Social video id
		array(
			"label" => "Item Video Cover",
			"id" => "social_video_cover",
			"type" => "media_single_picker",
			"width" => 200,
			"height" => 200,
			"info" => "Select the image you want to use as cover for this video object!",
			"associate" => "cover"
		)
	)
);




/*
 *  Raw code
 *
 *	@description: Makes a raw code
 *  @parameters: none
 *  @content: code
 */
function plusquare_raw_code($atts, $content){
	return do_shortcode($content);
}
add_shortcode( 'raw', 'plusquare_raw_code' );

//social video shortcode options
$plusquare_shortcodes_options["raw"] = array(
	"shortcode" => "raw",
	"name" => "Raw Code",
	"color" => "#cccccc",
	"icon" => "images/page_builder/Modules/raw_code.png",
	"options" => array(
		//Social video id
		array(
			"label" => "Code",
			"id" => "raw_code_text",
			"type" => "text_area",
			"info" => "Raw code let's you add shortcodes of your own, javascript, html, pretty much everything you want",
			"associate" => "content"
		)
	)
);





/*
 *  Tabs
 *
 *	@description: Makes a tabs component
 *  @parameters: [ 	 ]
 *  @content: Line Text
 */
function plusquare_tabs_func($atts, $content){
	//Make tabs
	return '<div class="tabs">'.do_shortcode($content).'</div>';
}
add_shortcode( 'tabs', 'plusquare_tabs_func' );

//Single Tab
function plusquare_tab_func($atts, $content){
	return '<div class="tab"><div class="tab-content">'.do_shortcode($content).'</div></div>';
}
add_shortcode( 'tab', 'plusquare_tab_func' );

//Tabs content holder
function plusquare_tabs_holder_func($atts, $content){
	return '<div class="tabs-content">'.do_shortcode($content).'</div>';
}
add_shortcode( 'tabs_holder', 'plusquare_tabs_holder_func' );

//Tabs Titles
function plusquare_tabs_titles_func($atts, $titles){
	return '<div class="tabs-titles">'.do_shortcode($titles).'</div>';
}
add_shortcode( 'tabs_titles', 'plusquare_tabs_titles_func' );

//Tab title
function plusquare_tab_title_func($atts, $title){
	return '<a href="#" onclick="return false;">'.$title.'</a>'	;
}
add_shortcode( 'tab_title', 'plusquare_tab_title_func' );

//slider shortcode options
$plusquare_shortcodes_options["tabs"] = array(
	"shortcode" => "tabs",
	"name" => "Tabs",
	"color" => "#cc66cc",
	"icon" => "images/page_builder/Modules/tabs.png",
	"options" => array(
		array(
			"label" => "Tabs Constructor",
			"id" => "tabs_constructor",
			"type" => "tabbing_builder",
			"info" => "Build your tabs component by adding components to the placeholders. Each placeholder correspond to a tab.",
			"associate" => "content"
		)
	)
);






/*
 *  Accordion
 *
 *	@description: Makes an accordion component
 *  @parameters: [ multiple(true, false) ]
 *  @content: Line Text
 */
function plusquare_accordion_func($atts, $content){
	extract( shortcode_atts( array(
		'multiple' => 'false'
	), $atts ) );
	//Make tabs
	return '<ul class="accordion"  data-multiple="'.$multiple.'">'.do_shortcode($content).'</ul>';
}
add_shortcode( 'accordion', 'plusquare_accordion_func' );

//Accordion Item
function plusquare_accordion_item_func($atts, $content){
	return '<li>'.do_shortcode("[icon]fa-angle-down[/icon]").do_shortcode($content).'</li>';
}
add_shortcode( 'accordion_item', 'plusquare_accordion_item_func' );

//Accordion 
function plusquare_accordion_item_content_func($atts, $content){
	return '<div class="content">'.do_shortcode($content).'</div>';
}
add_shortcode( 'accordion_item_content', 'plusquare_accordion_item_content_func' );

//accordion_item_title
function plusquare_accordion_item_title_func($atts, $title){
	return '<a href="#" onclick="return false;">'.$title.'</a>';
}
add_shortcode( 'accordion_item_title', 'plusquare_accordion_item_title_func' );

//slider shortcode options
$plusquare_shortcodes_options["accordion"] = array(
	"shortcode" => "accordion",
	"name" => "Accordion",
	"color" => "#cc66cc",
	"icon" => "images/page_builder/Modules/accordion.png",
	"options" => array(
		array(
			"label" => "Multiple Opened",
			"id" => "accordion_multiple",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "false",
			"help" => "Check if you want the possibility of having multiple items expanded.",
			"associate" => "multiple"
		),
		array(
			"label" => "Accordion Constructor",
			"id" => "accordion_constructor",
			"type" => "accordion_builder",
			"info" => "Build your accordion component by adding components to the placeholders. Each placeholder correspond to an accordion item.",
			"associate" => "content"
		)
	)
);

   
   
   
   
   

/*
 *  Line Text Dividers
 *
 *	@description: Makes a line divider
 *  @parameters: [ 	align(left, center or right), 
 					thickness, 
					line_style(solid, dashed, dotted, double, groove, ridge, inset, outset), 
					line_color ]
 *  @content: Line Text
 */
function plusquare_text_divider_func($atts, $content){
	extract( shortcode_atts( array(
		'align' => 'left',
		'font' => 'arial',
		'font_color' => '#CCCCCC',
		'font_size' => '12',
		'font_height' => '20',
		'thickness' => '1',
		'line_style' => 'solid',
		'line_color' => '#242424',
		'margin_top' => '0',
		'margin_bottom' => '10'
	), $atts ) );
	
	//Make divider
	return '<div class="divider" style="margin-top:'.$margin_top.'px;margin-bottom:'.$margin_bottom.'px;">
				<div class="'.$align.' line_text"><p style="'.getFontCss($font).'font-size:'.$font_size.'px;line-height:'.$font_height.'px;color:'.$font_color.';">'.$content.'</p></div>
				<div class="line" style="height: '.(intval($font_height)/2).'px;border-bottom:'.$thickness.'px '.$line_style.' '.$line_color.'"></div>
			</div>';
}
add_shortcode( 'text_divider', 'plusquare_text_divider_func' );

//line text divider shortcode options
$plusquare_shortcodes_options["text_divider"] = array(
	"shortcode" => "text_divider",
	"name" => "Text Divider",
	"color" => "#ffff00",
	"icon" => "images/page_builder/Modules/text_divider.png",
	"options" => array(
		array(
			"label" => "Options Tabs",
			"id" => "divider_unbi_tabs",
			"type" => "tabs_unbinded",
			"options" => array("Line", "Text", "Margins"),
			"tabs" => array(
				//LINE
				array(
					//Line Thickness
					array(
						"label" => "Line Thickness (px.)",
						"id" => "divider_thickness",
						"type" => "pixels",
						"default" => "1",
						"help" => "The divider's line height in pixels!",
						"associate" => "thickness"
					),
					
					//Line style
					array(
						"label" => "Divider Line Style",
						"id" => "divider_line_style",
						"type" => "combobox",
						"options" => array("Solid", "Dashed", "Dotted", "Double", "Groove", "Ridge", "Inset", "Outset"),
						"values" => array("solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"),
						"default" => "solid",
						"info" => "Choose the divider's line style.",
						"associate" => "line_style"
					),
					
					//Line color
					array(
						"label" => "Divider Line Color",
						"id" => "divider_line_color",
						"type" => "color_picker",
						"default" => "#242424",
						"info" => "Choose the divider's line color.",
						"associate" => "line_color"
					)
				),
			
				//TEXT
				array(
					//Divider Text
					array(
						"label" => "Divider Text",
						"id" => "divider_text",
						"type" => "text",
						"help" => "The text you want for this divider, leave blank if you don't want text!",
						"associate" => "content"
					),
					
					//align  left, center or right
					array(
						"label" => "Divider Text Alignment",
						"id" => "divider_alignment",
						"type" => "combobox",
						"options" => array("Left", "Center", "Right"),
						"values" => array("left", "center", "right"),
						"default" => "left",
						"info" => "Choose the alignment of the text for this divider.",
						"associate" => "align"
					),
					
					//text font 
					array(
						"label" => "Divider Text Font",
						"id" => "divider_text_font",
						"type" => "font_picker",
						"help" => "The font you want for the line's text!",
						"associate" => "font"
					),
					
					//text font color
					array(
						"label" => "Divider Font Color",
						"id" => "divider_text_font_color",
						"type" => "color_picker",
						"default" => "#CCCCCC",
						"associate" => "font_color"
					),
					
					//text font size
					array(
						"label" => "Divider Font Size (px.)",
						"id" => "divider_text_size",
						"type" => "pixels",
						"default" => "12",
						"associate" => "font_size"
					),
					
					//text font line height
					array(
						"label" => "Divider Font Line Height (px.)",
						"id" => "divider_text_line_height",
						"type" => "pixels",
						"default" => "20",
						"associate" => "font_height"
					)
				),
				
				//MARGINS
				array(
					//margin Top
					array(
						"label" => "Divider Margin Top (px.)",
						"id" => "divider_margin_top",
						"type" => "pixels",
						"default" => "0",
						"associate" => "margin_top"
					),
					//margin Bottom
					array(
						"label" => "Divider Margin Bottom (px.)",
						"id" => "divider_margin_bottom",
						"type" => "pixels",
						"default" => "10",
						"associate" => "margin_bottom"
					)
				)
			)
		)
	)
);
   




/*
 *  Line Dividers
 *
 *	@description: Makes a line divider
 *  @parameters: [ 	align(left, center or right), 
 					thickness, 
					line_style(solid, dashed, dotted, double, groove, ridge, inset, outset), 
					line_color ]
 *  @content: none
 */
function plusquare_divider_func($atts, $content){
	extract( shortcode_atts( array(
		'width' => '100',
		'thickness' => '1',
		'line_style' => 'solid',
		'line_color' => '#242424',
		'line_align' => 'left',
		'margin_top' => '0',
		'margin_bottom' => '10'
	), $atts ) );

	$align = $line_align == "left" ? "" : ($line_align == "center" ? "margin: 0 auto;" : "margin: 0 0 0 auto;");
	
	//Make divider
	return '<div class="divider" style="margin-top:'.$margin_top.'px;margin-bottom:'.$margin_bottom.'px;">
				<div class="line" style="display: block; '.$align.' width: '.$width.'%; border-bottom:'.$thickness.'px '.$line_style.' '.$line_color.'"></div>
			</div>';
}
add_shortcode( 'divider', 'plusquare_divider_func' );

//line divider shortcode options
$plusquare_shortcodes_options["divider"] = array(
	"shortcode" => "divider",
	"name" => "Line Divider",
	"color" => "#ffff00",
	"icon" => "images/page_builder/Modules/line_divider.png",
	"options" => array(
		array(
			"label" => "Options Tabs",
			"id" => "divider_unbi_tabs",
			"type" => "tabs_unbinded",
			"options" => array("Line", "Margins"),
			"tabs" => array(
				//LINE
				array(
					//Line Thickness
					array(
						"label" => "Line Width (%)",
						"id" => "divider_line_width",
						"type" => "percentage",
						"default" => "100",
						"help" => "The divider's line width as percentage!",
						"associate" => "width"
					),
					
					//Line Thickness
					array(
						"label" => "Line Thickness (px.)",
						"id" => "divider_thickness",
						"type" => "pixels",
						"default" => "1",
						"help" => "The divider's line height in pixels!",
						"associate" => "thickness"
					),
					
					//Line style
					array(
						"label" => "Divider Line Style",
						"id" => "divider_line_style",
						"type" => "combobox",
						"options" => array("Solid", "Dashed", "Dotted", "Double", "Groove", "Ridge", "Inset", "Outset"),
						"values" => array("solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"),
						"default" => "solid",
						"info" => "Choose the divider's line style.",
						"associate" => "line_style"
					),
					
					//Line color
					array(
						"label" => "Divider Line Color",
						"id" => "divider_line_color",
						"type" => "color_picker",
						"default" => "#242424",
						"info" => "Choose the divider's line color.",
						"associate" => "line_color"
					),

					array(
						"label" => "Divider Line Align",
						"id" => "divider_line_align",
						"type" => "combobox",
						"options" => array("Left", "Center", "Right"),
						"values" => array("left", "center", "right"),
						"default" => "left",
						"info" => "Choose the divider's line align.",
						"associate" => "line_align"
					)
				),
				
				//MARGINS
				array(
					//margin Top
					array(
						"label" => "Divider Margin Top (px.)",
						"id" => "divider_margin_top",
						"type" => "pixels",
						"default" => "0",
						"associate" => "margin_top"
					),
					//margin Bottom
					array(
						"label" => "Divider Margin Bottom (px.)",
						"id" => "divider_margin_bottom",
						"type" => "pixels",
						"default" => "10",
						"associate" => "margin_bottom"
					)
				)
			)
		)
	)
);
 
 
 
 
 
/*
 *  Music Player (Local sound or soundcloud)
 *
 *	@description: Makes a music player to play a sound
 *  @parameters: [ title:String, artist:String, type:String(sound or soundcloud) ]
 *  @content: Sound url if local or soundcloud's id
 */
function plusquare_music_player_func($atts, $url){
	extract( shortcode_atts( array(
		'title' => '',
		'artist' => '',
		'type' => 'sound'
	), $atts ) );
	
	//global $post;
	//$playerId = "player_".$post->ID;
	
	$returnStr = '
    <div class="music_player" data-type="'.$type.'" data-url="'.$url.'">
        <div class="player">
			<a href="#" class="component tooglePlay left " onclick="return false;">
				<div class="esza-play"></div>
				<div class="esza-pause"></div>
			</a>
			<div class="component right">'.
				(($type == "soundcloud") ? '<a href="'.$url.'" target="_blank" class="soundcloud"></a>':" ").
				
				'<a href="#" class="component toogleMute" onclick="return false;">
					<div class="volume_obj"><div class="esza-fullsound"></div></div>
					<div class="volume_bar1"><div class="esza-halfsound"></div></div>
					<div class="volume_bar2"><div class="esza-fullsound"></div></div>
					<div class="no_volume"><div class="esza-nosound"></div></div>
				</a>
				<a href="#" class="volume_bar_holder" onclick="return false;">
					<div class="active_bar"></div>
				</a>
				
			</div>
			<div class="component fatten">
				<div class="info_wraper">
					<div class="song_artist"><div class="sliding_text">'.$artist.'</div></div>
					<div class="song_title"><div class="sliding_text">'.$title.'</div></div>
				
					<!-- Progress Bar -->
					<div class="progress_holder none">
						<div class="current_position left">00:00</div>
						<div class="duration right">00:00</div>
						<div class="progress_bars">
							<a href="#" class="stream_bar" onclick="return false;"></a>
							<a href="#" class="active_bar" onclick="return false;"></a>
						</div>
					</div>
				</div>
			</div>
        </div>
		<div class="mobileProgress">
			<!-- Progress Bar -->
			<div class="progress_holder none">
				<div class="current_position left">00:00</div>
				<div class="duration right">00:00</div>
				<div class="progress_bars">
					<a href="#" class="stream_bar" onclick="return false;"></a>
					<a href="#" class="active_bar" onclick="return false;"></a>
				</div>
			</div>
		</div>
    </div>';
	
	return $returnStr;
}
add_shortcode( 'music_player', 'plusquare_music_player_func' );

//music player shortcode options
$plusquare_shortcodes_options["music_player"] = array(
	"shortcode" => "music_player",
	"name" => "Music Object",
	"color" => "#eb3338",
	"icon" => "images/page_builder/Modules/music_object.png",
	"options" => array(
		array(
			"label" => "Music Type",
			"id" => "music_player_type",
			"type" => "tabs",
			"options" => array("Soundcloud", "Local Sound"),
			"values" => array("soundcloud", "sound"),
			"default" => "soundcloud",
			"associate" => "type",
			"tabs" => array(
				"soundcloud" => array(
					array(
						"label" => "Soundcloud Music",
						"id" => "music_player_soundcloud_url",
						"type" => "text",
						"help" => "The url of the music you wanted hosted on soundcloud.",
						"associate" => "content"
					),
					array(
						"label" => "Sound Title",
						"id" => "music_player_soundcloud_title",
						"type" => "text",
						"help" => "The tile for the sound or music you want to appear on the music player.",
						"associate" => "title"
					),
					array(
						"label" => "Sound Artist",
						"id" => "music_player_soundcloud_artist",
						"type" => "text",
						"help" => "The artist/musician/band for the sound or music you want to appear on the music player.",
						"associate" => "artist"
					)
				),
			
				//Sound type
				"sound" => array(
					array(
						"label" => "Sound",
						"id" => "music_player_sound_url",
						"type" => "sound_picker",
						"help" => "Pick a sound or music you uploaded to your site from wordpress media upload manager.",
						"associate" => "content"
					),
					array(
						"label" => "Sound Title",
						"id" => "music_player_sound_title",
						"type" => "text",
						"help" => "The tile for the sound or music you want to appear on the music player.",
						"associate" => "title"
					),
					array(
						"label" => "Sound Artist",
						"id" => "music_player_sound_artist",
						"type" => "text",
						"help" => "The artist/musician/band for the sound or music you want to appear on the music player.",
						"associate" => "artist"
					)
				)
			)
		)
	)
);
 
 
 
 
 
/*
 *  Slider shortcode
 *
 *	@description: Makes a slider from a slider post's id
 *  @parameters: none
 *  @content: Slider post id
 */
function plusquare_slider_func( $atts, $sliderId ){
	
	$returnStr = get_post_field('post_content', $sliderId);
	
	return $returnStr.'
    <script type="text/javascript">
		jQuery(document).ready(function ($){
			var Essenza = require("./Essenza.js");

			var Slider = Essenza.Slider;

		 	var slider = new Slider({
				holder:"#slider_'.$sliderId.'",
				ease:7
			});
		});
    </script>';
}
add_shortcode( 'slider', 'plusquare_slider_func' );

//slider shortcode options
$plusquare_shortcodes_options["slider"] = array(
	"shortcode" => "slider",
	"name" => "Slider",
	"color" => "#eb3338",
	"icon" => "images/page_builder/Modules/slider.png",
	"options" => array(
		//Video type (youtube, vimeo, dailymotion)
		array(
			"label" => "Slider",
			"id" => "slider_id",
			"type" => "slider_picker",
			"help" => "Pick the slider you want, to create a new one or modify an existing one see the slider menu option on the left admin bar.",
			"associate" => "content"
		)
	)
);
 
 
 


 
 
 /*
 *  Alert boxes
 *
 *	@description: Makes an alert box
 *  @parameters: [type(success, error, info, warning)]
 *  @content: Alert's Text
 */
function plusquare_message_box_func( $atts, $content ){
	extract( shortcode_atts( array(
		'type' => 'success'
	), $atts ) );
	
	return '<div class="alert alert-'.$type.'"><p>'.$content.'</p></div>';
}
add_shortcode( 'message_box', 'plusquare_message_box_func' );

//tweet shortcode options
$plusquare_shortcodes_options["message_box"] = array(
	"shortcode" => "message_box",
	"name" => "Message Box",
	"color" => "#a7e200",
	"icon" => "images/page_builder/Modules/message_box.png",
	"options" => array(
		array(
			"label" => "Message Type",
			"id" => "message_box_type",
			"type" => "combobox",
			"options" => array("Success", "Error", "Info", "Warning"),
			"values" => array("success", "error", "info", "warning"),
			"default" => "success",
			"help" => "The type of message you want to display.",
			"associate" => "type"
		),
		array(
			"label" => "Message Text",
			"id" => "message_box_text",
			"type" => "text_area",
			"help" => "The text you want to see inside the message box.",
			"associate" => "content"
		)
	)
);
 
 
 
 

/*
 *  Pinterest images
 *
 *	@description: Makes a pinterest gallery
 *  @parameters: width, height, number
 *  @content: Pinterest username
 */
function plusquare_pinterest_func( $atts, $content ){
	extract( shortcode_atts( array(
		'number' => '6',
		'width' => '80',
		'height' => '80'
	), $atts ) );
	
	$data = curlFetchData("http://pinterestapi.co.uk/".$content."/pins");
	
	$returnStr = "";
	$json = json_decode($data);

	//Pixel ratio
	if( isset($_COOKIE["pixel_ratio"]) )
		$pixel_ratio = $_COOKIE["pixel_ratio"];
	else
		$pixel_ratio = 2;

	$counter = 0;
	foreach ($json->body as $pin) {
		$imageUrl = $pin->src;
		
		$size = @getimagesize($imageUrl);
		$background_size = "";
		if($size !== FALSE){
			$width_image = $size[0];
			$height_image = $size[1];
			$ratio = min( $width_image/$width , $height_image/$height);
			$width_image = round($width_image/$ratio);
			$height_image = round($height_image/$ratio);
			$background_size = 'background-size: '.$width_image.'px '.$height_image.'px;';
		}

    	$returnStr .= '<a target="_blank" class="overable_type" href="'.$pin->href.'" style="width: '.$width.'px; height: '.$height.'px; '.$background_size.' background-position: 50%; background-image:url('.$photo->image_teaser_url.');">';
		
		$returnStr .= '<div class="cover"></div>';
		$returnStr .= '<div class="post_type"><i class="esza-link"></i></div>';
		$returnStr .= '</a>';
		
		$counter++;
		if($counter >= $number)
			break;
	}
	
	return '<div class="blog_gallery" data-width="'.$width.'" data-height="'.$height.'">'.$returnStr.'</div>';
}
add_shortcode( 'pinterest', 'plusquare_pinterest_func' );

//pinterest shortcode options
$plusquare_shortcodes_options["pinterest"] = array(
	"shortcode" => "pinterest",
	"name" => "Pinterest Gallery",
	"color" => "#ac1e1c",
	"icon" => "images/page_builder/Modules/pinterest.png",
	"options" => array(
		array(
			"label" => "Pinterest Username",
			"id" => "pinterest_id",
			"type" => "text",
			"help" => "The author's unique username.",
			"associate" => "content"
		),
		array(
			"label" => "Number Of Images",
			"id" => "pinterest_number",
			"type" => "text",
			"default" => "6",
			"help" => "The max number of images to show up.",
			"associate" => "number"
		),
		array(
			"label" => "Images Width",
			"id" => "pinterest_images_width",
			"type" => "pixels",
			"default" => "80",
			"info" => "The width in pixels you want each image to have.",
			"associate" => "width"
		),
		array(
			"label" => "Images Height",
			"id" => "pinterest_images_height",
			"type" => "pixels",
			"default" => "80",
			"info" => "The height in pixels you want each image to have.",
			"associate" => "height"
		)
	)
);


 
 
 
/*
 *  Dribble images
 *
 *	@description: Makes an dribble gallery
 *  @parameters: [type(success, error, info, warning)]
 *  @content: Alert's Text
 */
function plusquare_dribbble_func( $atts, $content ){
	extract( shortcode_atts( array(
		'number' => '6',
		'width' => '80',
		'height' => '80'
	), $atts ) );
	
	return '<div class="blog_gallery dribbble_gallery" data-id="'.$content.'" data-number="'.$number.'" data-width="'.$width.'" data-height="'.$height.'"><p style="text-align:center;">Loading Dribbble images..</p></div>';
}
add_shortcode( 'dribbble', 'plusquare_dribbble_func' );

//Dribble shortcode options
$plusquare_shortcodes_options["dribbble"] = array(
	"shortcode" => "dribbble",
	"name" => "Dribbble Gallery",
	"color" => "#e6306b",
	"icon" => "images/page_builder/Modules/dribbble.png",
	"options" => array(
		array(
			"label" => "Dribbble User Id",
			"id" => "dribbble_id",
			"type" => "text",
			"help" => "The author's unique username.",
			"associate" => "content"
		),
		array(
			"label" => "Number Of Images",
			"id" => "dribbble_number",
			"type" => "text",
			"default" => "6",
			"help" => "The max number of images to show up.",
			"associate" => "number"
		),
		array(
			"label" => "Images Width",
			"id" => "dribbble_images_width",
			"type" => "pixels",
			"default" => "80",
			"info" => "The width in pixels you want each image to have.",
			"associate" => "width"
		),
		array(
			"label" => "Images Height",
			"id" => "dribbble_images_height",
			"type" => "pixels",
			"default" => "80",
			"info" => "The height in pixels you want each image to have.",
			"associate" => "height"
		)
	)
);




/*
 *  Instagram images
 *
 *	@description: Makes an instagram gallery
 *  @parameters: 
 *  @content: Alert's Text
 */
function plusquare_instagram_func( $atts, $content ){
	extract( shortcode_atts( array(
		'number' => '6',
		'token' => '329303015.f59def8.e91634a20dda4267ad85c6b615a23468',
		'width' => '80',
		'height' => '80'
	), $atts ) );

	$data = curlFetchData("https://api.instagram.com/v1/users/".$content."/media/recent/?access_token=".$token."&count=".$number);
	
	$returnStr = "";
	//if(WP_DEBUG)fb::log($data);
	$json = json_decode($data);

	//Pixel ratio
	if( isset($_COOKIE["pixel_ratio"]) )
		$pixel_ratio = $_COOKIE["pixel_ratio"];
	else
		$pixel_ratio = 2;
			

	foreach ($json->data as $photo) {

		$imageUrl = $photo->images->thumbnail->url;
		
		$size = @getimagesize($imageUrl);

		$background_size = "";
		if($size !== FALSE){
			$width_image = floatval($size[0]);
			$height_image = floatval($size[1]);
			$ratio = min( $width_image/$width , $height_image/$height);
			$width_image = round($width_image/$ratio);
			$height_image = round($height_image/$ratio);
			$background_size = 'background-size: '.$width_image.'px '.$height_image.'px;';
		}

    	$returnStr .= '<a target="_blank" class="overable_type" href="'.$photo->link.'" style="width: '.$width.'px; height: '.$height.'px; '.$background_size.' background-position: 50%; background-image:url('.$imageUrl.');">';
		
		$returnStr .= '<div class="cover"></div>';
		$returnStr .= '<div class="post_type"><i class="esza-link"></i></div>';
		$returnStr .= '</a>';
	}
	
	return '<div class="blog_gallery" data-width="'.$width.'" data-height="'.$height.'">'.$returnStr.'</div>';
}
add_shortcode( 'instagram', 'plusquare_instagram_func' );

//instagram shortcode options
$plusquare_shortcodes_options["instagram"] = array(
	"shortcode" => "instagram",
	"name" => "Instagram Gal.",
	"color" => "#e6306b",
	"icon" => "images/page_builder/Modules/instagram.png",
	"options" => array(
		array(
			"label" => "Instagram User Id",
			"id" => "instagram_id",
			"type" => "text",
			"help" => "The instagram's unique user id <a href='https://api.instagram.com/oauth/authorize/?client_id=ab103e54c54747ada9e807137db52d77&redirect_uri=http://blueprintinteractive.com/tutorials/instagram/uri.php&response_type=code' target='_blank'>Click here to get your instagram account user id and token</a>.",
			"associate" => "content"
		),
		array(
			"label" => "Instagram Token",
			"id" => "instagram_token",
			"type" => "text",
			"help" => "Token <a href='https://api.instagram.com/oauth/authorize/?client_id=ab103e54c54747ada9e807137db52d77&redirect_uri=http://blueprintinteractive.com/tutorials/instagram/uri.php&response_type=code' target='_blank'>Click here to get your instagram account user id and token</a>.",
			"associate" => "token"
		),
		array(
			"label" => "Number Of Images",
			"id" => "dribbble_number",
			"type" => "text",
			"default" => "6",
			"help" => "The max number of images to show up.",
			"associate" => "number"
		),
		array(
			"label" => "Images Width",
			"id" => "dribbble_images_width",
			"type" => "pixels",
			"default" => "80",
			"info" => "The width in pixels you want each image to have.",
			"associate" => "width"
		),
		array(
			"label" => "Images Height",
			"id" => "dribbble_images_height",
			"type" => "pixels",
			"default" => "80",
			"info" => "The height in pixels you want each image to have.",
			"associate" => "height"
		)
	)
);



/*
 *  Google + button
 *
 *	@description: Makes an google + button
 *  @parameters: 
 *  @content: float
 */
function plusquare_google_plus_func( $atts ){
	extract( shortcode_atts( array(
		'size' => 'medium',
		'annotation' => 'bubble',
		'width' => '78',
		'float' => 'left'
	), $atts ) );
	
	return '<div style="vertical-align: top; display: inline-block; float:'.$float.';width: '.$width.'px;">
			<div class="g-plusone" data-size="'.$size.'" data-annotation="'.$annotation.'" data-width="'.$width.'" style="float:left;"></div>
			</div>
			<script type="text/javascript">
			  (function() {
				var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;
				po.src = "https://apis.google.com/js/plusone.js";
				var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);
			  })();
			</script>';
}
add_shortcode( 'google_plus', 'plusquare_google_plus_func' );

//google + shortcode options
$plusquare_shortcodes_options["google_plus"] = array(
	"shortcode" => "google_plus",
	"name" => "Google+ Button",
	"color" => "#c5351a",
	"icon" => "images/page_builder/Modules/google_plus.png",
	"options" => array(
		array(
			"label" => "Float",
			"id" => "google_plus_float",
			"type" => "combobox",
			"options" => array("Left", "None", "Right"),
			"values" => array("left", "none", "right"),
			"default" => "left",
			"help" => "The float you want the button to have.",
			"associate" => "float"
		),
		array(
			"label" => "Size",
			"id" => "google_plus_type",
			"type" => "combobox",
			"options" => array("Small", "Medium", "Standard", "Tall"),
			"values" => array("small", "medium", "standard", "tall"),
			"default" => "medium",
			"help" => "The google plus size, check <a href='https://developers.google.com/+/web/+1button/'>this page</a> to see how this values alter the final button.",
			"associate" => "size"
		),
		array(
			"label" => "Annotation",
			"id" => "google_plus_annotation",
			"type" => "combobox",
			"options" => array("none", "bubble", "inline"),
			"values" => array("none", "bubble", "inline"),
			"default" => "bubble",
			"help" => "The google plus button annotation style.",
			"associate" => "annotation"
		),
		array(
			"label" => "Width",
			"id" => "google_plus_width",
			"type" => "pixels",
			"default" => "80",
			"help" => "The google plus button's holder width.",
			"associate" => "width"
		)
	)
);






/*
 *  Twitter Share button
 *
 *	@description: Makes an twitter button
 *  @parameters: 
 *  @content: float
 */
function plusquare_twitter_button_func( $atts ){
	extract( shortcode_atts( array(
		'size' => 'standard',
		'count' => 'show',
		'float' => 'left',
		'width' => '98'
	), $atts ) );
	
	
	return '<div style="vertical-align: top; display: inline-block; float:'.$float.';width: '.$width.'px;">
			<a href="https://twitter.com/share" data-url="'.get_permalink().'" class="twitter-share-button" data-related="festaseflagras" data-size="'.$size.'" data-count="'.$count.'">Tweet</a>
			</div>
			<script>
				jQuery(document).ready(function ($){
					if($("body").hasClass("TwitterLoaded"))
						refreshTweetButtons();
					else
						$("body").bind("TwitterLoaded", function(){
							refreshTweetButtons();
						});
				});
			</script>';
}
add_shortcode( 'twitter_button', 'plusquare_twitter_button_func' );

//twitter share shortcode options
$plusquare_shortcodes_options["twitter_button"] = array(
	"shortcode" => "twitter_button",
	"name" => "Twitter Button",
	"color" => "#4bc6f0",
	"icon" => "images/page_builder/Modules/twitter.png",
	"options" => array(
		array(
			"label" => "Float",
			"id" => "twitter_button_float",
			"type" => "combobox",
			"options" => array("Left", "None", "Right"),
			"values" => array("left", "none", "right"),
			"default" => "left",
			"help" => "The float you want the button to have.",
			"associate" => "float"
		),
		array(
			"label" => "Large Button",
			"id" => "twitter_button_size",
			"type" => "checkbox",
			"values" => array("standard", "large"),
			"default" => "standard",
			"help" => "Check if you want the large version of the button.",
			"associate" => "size"
		),
		array(
			"label" => "Show Count",
			"id" => "twitter_button_count",
			"type" => "checkbox",
			"values" => array("none", "show"),
			"default" => "show",
			"help" => "Check if you want to show the number of tweets the page has.",
			"associate" => "count"
		),
		array(
			"label" => "Width",
			"id" => "twitter_button_width",
			"type" => "pixels",
			"default" => "100",
			"help" => "The twitter share button's holder width.",
			"associate" => "width"
		)
	)
);





/*
 *  Facebook like button
 *
 *	@description: Makes an Facebook like button
 *  @parameters: 
 *  @content: float
 */
function plusquare_facebook_like_func( $atts ){
	extract( shortcode_atts( array(
		'layout' => 'button_count',
		'width' => '92',
		'float' => 'left'
	), $atts ) );
	
	return '<div style="vertical-align: top; text-align: left; display: inline-block; float:'.$float.';width: '.$width.'px;">
			<div class="fb-like" data-href="'.get_permalink().'" data-send="false" data-layout="'.$layout.'" data-width="'.$width.'" data-show-faces="false" data-font="arial"></div>
			</div>
			<script>
				jQuery(document).ready(function ($){
					if($("body").hasClass("FacebookLoaded"))
						refreshFacebookButtons();
					else
						$("body").bind("FacebookLoaded", function(){
							refreshFacebookButtons();
						});
				});
			</script>';
}
add_shortcode( 'facebook_like', 'plusquare_facebook_like_func' );

//facebook_like shortcode options
$plusquare_shortcodes_options["facebook_like"] = array(
	"shortcode" => "facebook_like",
	"name" => "Facebook Like",
	"color" => "#395499",
	"icon" => "images/page_builder/Modules/facebook.png",
	"options" => array(
		array(
			"label" => "Float",
			"id" => "facebook_like_float",
			"type" => "combobox",
			"options" => array("Left", "None", "Right"),
			"values" => array("left", "none", "right"),
			"default" => "left",
			"help" => "The float you want the button to have.",
			"associate" => "float"
		),
		array(
			"label" => "Layout Style",
			"id" => "facebook_like_layout",
			"type" => "combobox",
			"options" => array("standard", "Button Count", "Box Count"),
			"values" => array("standard", "button_count", "box_count"),
			"default" => "button_count",
			"info" => "Check this page to see which parameter does what <a href='https://developers.facebook.com/docs/reference/plugins/like/'>like button</a>.",
			"associate" => "layout"
		),
		array(
			"label" => "Button Width",
			"id" => "facebook_width",
			"type" => "pixels",
			"default" => "90",
			"help" => "The max width of the button",
			"associate" => "width"
		)
	)
);






/*
 *  Behance images
 *
 *	@description: Makes a behance gallery
 *  @parameters: 
 *  @content: Behance user
 */
function plusquare_behance_func( $atts, $content ){
	extract( shortcode_atts( array(
		'number' => '6',
		'type' => 'group',
		'width' => '80',
		'height' => '80'
	), $atts ) );
	
	return '<div class="blog_gallery behance_gallery" data-id="'.$content.'" data-number="'.$number.'" data-type="'.$type.'" data-width="'.$width.'" data-height="'.$height.'"><p style="text-align:center;">Loading Behance images..</p></div>';
}
add_shortcode( 'behance', 'plusquare_behance_func' );

//Behance shortcode options
$plusquare_shortcodes_options["behance"] = array(
	"shortcode" => "behance",
	"name" => "Behance Gallery",
	"color" => "#e6306b",
	"icon" => "images/page_builder/Modules/behance.png",
	"options" => array(
		array(
			"label" => "Behance User Id",
			"id" => "pq_behance_id",
			"type" => "text",
			"help" => "The id of the behance user you want to fetch the projects covers from.",
			"associate" => "content"
		),
		array(
			"label" => "Number Of Images",
			"id" => "behance_number",
			"type" => "text",
			"default" => "6",
			"help" => "The max number of images to show up.",
			"associate" => "number"
		),
		array(
			"label" => "Images Width",
			"id" => "behance_images_width",
			"type" => "pixels",
			"default" => "80",
			"info" => "The width in pixels you want each image to have.",
			"associate" => "width"
		),
		array(
			"label" => "Images Height",
			"id" => "behance_images_height",
			"type" => "pixels",
			"default" => "80",
			"info" => "The height in pixels you want each image to have.",
			"associate" => "height"
		)
	)
);//1508516@N22 envato group



 
 
 
 
/*
 *  Flickr images
 *
 *	@description: Makes an flickr gallery
 *  @parameters: 
 *  @content: Alert's Text
 */
function plusquare_flickr_func( $atts, $content ){
	global $pq_shortname;
	$flickrId = get_option($pq_shortname."_flickr_id");
	
	if($flickrId == FALSE)
		return "<p>An error occured loading flickr app options!</p>";
	
	extract( shortcode_atts( array(
		'number' => '6',
		'type' => 'group',
		'width' => '80',
		'height' => '80'
	), $atts ) );

	fb::log("KMKMKM");
	
	return '<div class="blog_gallery flickr_gallery" data-id="'.$content.'" data-number="'.$number.'" data-type="'.$type.'" data-width="'.$width.'" data-height="'.$height.'"> <p style="text-align:center;">Loading Flickr images..</p> </div>';
}
add_shortcode( 'flickr', 'plusquare_flickr_func' );

//flickr shortcode options
$plusquare_shortcodes_options["flickr"] = array(
	"shortcode" => "flickr",
	"name" => "Flickr Gallery",
	"color" => "#e6306b",
	"icon" => "images/page_builder/Modules/flickr.png",
	"options" => array(
		array(
			"label" => "Flickr Username",
			"id" => "pq_flickr_id",
			"type" => "text",
			"help" => "The username of the flickr user you want to fetch images from.",
			"associate" => "content"
		),
		array(
			"label" => "Number Of Images",
			"id" => "flickr_number",
			"type" => "text",
			"default" => "6",
			"help" => "The max number of images to show up.",
			"associate" => "number"
		),
		array(
			"label" => "Images Width",
			"id" => "flickr_images_width",
			"type" => "pixels",
			"default" => "80",
			"info" => "The width in pixels you want each image to have.",
			"associate" => "width"
		),
		array(
			"label" => "Images Height",
			"id" => "flickr_images_height",
			"type" => "pixels",
			"default" => "80",
			"info" => "The height in pixels you want each image to have.",
			"associate" => "height"
		)
	)
);//1508516@N22 envato group
 
 
 
 
 
 
 
/*
 *  Single Tweet shortcode
 *
 *	@description: Makes a single tweet appear by it's id
 *  @parameters: none
 *  @content: Tweet's id
 */
function plusquare_tweet_func( $atts, $tweetStatus ){
	return '<div class="tweet single_tweet_stat" data-status="'.$tweetStatus.'"><p>Loading Tweet..</p></div>';
}
add_shortcode( 'tweet', 'plusquare_tweet_func' );

//tweet shortcode options
$plusquare_shortcodes_options["tweet"] = array(
	"shortcode" => "tweet",
	"name" => "Single Tweet",
	"color" => "#4bc6f0",
	"icon" => "images/page_builder/Modules/twitter.png",
	"options" => array(
		//Video type (youtube, vimeo, dailymotion)
		array(
			"label" => "Tweet's id",
			"id" => "tweet_id",
			"type" => "text",
			"help" => "The unique id of the tweet you want to appear.",
			"associate" => "content"
		)
	)
);





/*
 *  Tweet feed
 *
 *	@description: Makes a single tweet appear by it's id
 *  @parameters: none
 *  @content: Tweet's user
 */
function plusquare_tweet_feed_func( $atts, $tweetUser ){
	extract( shortcode_atts( array(
		'number' => '2'
	), $atts ) );

	return '<div class="twitter_feed_short" data-user="'.$tweetUser.'" data-number="'.$number.'"></div>';
}
add_shortcode( 'tweet_feed', 'plusquare_tweet_feed_func' );

//tweet shortcode options
$plusquare_shortcodes_options["tweet_feed"] = array(
	"shortcode" => "tweet_feed",
	"name" => "Tweet Feed",
	"color" => "#4bc6f0",
	"icon" => "images/page_builder/Modules/twitter.png",
	"options" => array(
		array(
			"label" => "Tweet's user",
			"id" => "tweet_feed_user",
			"type" => "text",
			"help" => "The id or username of the twitter user.",
			"associate" => "content"
		),
		array(
			"label" => "Tweets Count",
			"id" => "tweet_feed_number",
			"type" => "text",
			"default" => "2",
			"help" => "The number of tweets to show.",
			"associate" => "number"
		)
	)
);
 
 
 
 
 
/*
 *  Blog Gallery shortcode
 *
 *	@description: Makes a small gallery with thumbnails that can be open to lightbox
 *  @parameters: none
 *  @content: string of attachments
 */
function plusquare_blog_gallery_fun( $atts, $attachments_str ){
	extract( shortcode_atts( array(
		'width' => '100',
		'height' => '100'
	), $atts ) );

	global $post;
	
	$attachments = explode(",", $attachments_str);

	//Pixel ratio
	if( isset($_COOKIE["pixel_ratio"]) )
		$pixel_ratio = $_COOKIE["pixel_ratio"];
	else
		$pixel_ratio = 2;
	
	$returnStr = '<div class="blog_gallery" data-width="'.$width.'" data-height="'.$height.'">';
	
    foreach($attachments as $attachment){ 
        $imageUrl = wp_get_attachment_image_src( $attachment , "medium");
        $imageUrl = $imageUrl[0];
        
        $imageBigUrl = wp_get_attachment_image_src( $attachment , "full");
        $imageBigUrl = $imageBigUrl[0];

        if($imageUrl != ""){
            //Has an image available
			$imageUrl = mr_image_resize($imageUrl, $width, $height, true, 'c', $pixel_ratio > 1);

			$returnStr .= '<a href="'.$imageBigUrl.'" class="lightbox overable_type" data-group="'.$post->ID.'_group">';
			$returnStr .= '<img src="'.$imageUrl.'" width="'.$width.'" height="'.$height.'" alt="Gallery Image"/>';
			$returnStr .= '<div class="cover"></div>';
			$returnStr .= '<div class="post_type"><i class="esza-image"></i></div>';
			$returnStr .= '</a>';
        }
    }
    
    $returnStr .= '</div>';
    
    return $returnStr;
}
add_shortcode( 'blog_gallery', 'plusquare_blog_gallery_fun' );

//blog gallery shortcode options
$plusquare_shortcodes_options["blog_gallery"] = array(
	"shortcode" => "blog_gallery",
	"name" => "Image Gallery",
	"color" => "#eb3338",
	"icon" => "images/page_builder/Modules/image_gallery.png",
	"options" => array(
		array(
			"label" => "Images Width",
			"id" => "blog_gallery_images_width",
			"type" => "pixels",
			"default" => "80",
			"info" => "The width in pixels you want each image to have.",
			"associate" => "width"
		),
		array(
			"label" => "Images Height",
			"id" => "blog_gallery_images_height",
			"type" => "pixels",
			"default" => "80",
			"info" => "The height in pixels you want each image to have.",
			"associate" => "height"
		),
		array(
			"label" => "Gallery Images",
			"id" => "blog_gallery_images",
			"type" => "media_picker",
			"info" => "Choose the images you want to show, you can order them by dragging them around.",
			"associate" => "content"
		)	
	)
);





/*
 *  Row
 *
 *	@description: Makes a row with twitter bootstrap
 *  @parameters: none
 *  @content: Row content
 */
function plusquare_row_func( $atts, $content ){
	extract( shortcode_atts( array(
		'snaps' => '0000'
	), $atts ) );

	$snaps_class="";
	if($snaps[0] == 't')
		$snaps_class.="top_snap ";
	if($snaps[1] == 'l')
		$snaps_class.="left_snap ";
	if($snaps[2] == 'r')
		$snaps_class.="right_snap ";
	if($snaps[3] == 'b')
		$snaps_class.="bottom_snap";

	return '<div class="row '.$snaps_class.'">'.do_shortcode($content).'</div>';
}
add_shortcode( 'row', 'plusquare_row_func' );





/*
 *  Column
 *
 *	@description: Makes a column with twitter bootstrap
 *  @parameters: size (int from 1 to 12)
 *  @content: Column content
 */
function plusquare_column_func( $atts, $content ){
	extract( shortcode_atts( array(
		'size' => '12',
		'offset' => '0',
		'use_paddings' => 'false',
		'padding' => '0px',
		'content_align' => 'left'
	), $atts ) );

	if($use_paddings === "false"){
		$padding = "";
	}
	else{
		$padding = "padding: ".$padding.";";
	}
	
	return '<div class="col-md-'.$size.' col-md-offset-'.$offset.'" style="'.$padding.' text-align: '.$content_align.';">'.do_shortcode($content).'</div>';
}
add_shortcode( 'column', 'plusquare_column_func' );

//blog gallery shortcode options
$plusquare_column_options = array(
	"options" => array(
		array(
			"label" => "Content alignment",
			"id" => "colum_content_alignment",
			"type" => "combobox",
			"options" => array("Left", "Center", "Right"),
			"values" => array("left", "center", "right"),
			"default" => "left",
			"associate" => "content_align"
		),
		array(
			"label" => "Use custom paddings",
			"id" => "column_use_paddings",
			"type" => "checkbox",
			"values"=> array('false', 'true'),
			"default" => 'false',
			"associate" => "use_paddings",
			"info" => "Check if you want to use custom paddings for this module, then fill the values below to customize them."
		),
		array(
			"label" => "Top padding",
			"id" => "colum_top_padding",
			"type" => "pixels",
			"default" => "0",
			"associate" => "author"
		),
		array(
			"label" => "Left padding",
			"id" => "colum_left_padding",
			"type" => "pixels",
			"default" => get_option($pq_shortname."_page_grid_gap", "15"),
			"associate" => "author"
		),
		array(
			"label" => "Right padding",
			"id" => "colum_right_padding",
			"type" => "pixels",
			"default" => get_option($pq_shortname."_page_grid_gap", "15"),
			"associate" => "author"
		),
		array(
			"label" => "Bottom padding",
			"id" => "colum_bottom_padding",
			"type" => "pixels",
			"default" => "0",
			"associate" => "author"
		)
	)
);




/*
 *  Quote
 *
 *	@description: Makes a big quote rectangle
 *  @parameters: author (string)
 *  @content: Quote text
 */
function plusquare_quote_func( $atts, $content ){
	extract( shortcode_atts( array(
		'author' => ''
	), $atts ) );
	
	return '<div class="blog_quote">
				<h2>'.$content.'</h2>
				<p>'.$author.'</p>
			</div>';
}
add_shortcode( 'quote', 'plusquare_quote_func' );
						
//blog gallery shortcode options
$plusquare_shortcodes_options["quote"] = array(
	"shortcode" => "quote",
	"name" => "Quote",
	"color" => "#a7e200",
	"icon" => "images/page_builder/Modules/quote.png",
	"options" => array(
		array(
			"label" => "Quote Text",
			"id" => "quote_text",
			"type" => "text_area",
			"associate" => "content"
		),
		array(
			"label" => "Quote Author",
			"id" => "quote_author",
			"type" => "text",
			"help" => "You can leave this in blank!",
			"associate" => "author"
		)	
	)
);






/*
 *  Image Shortcode
 *
 *	@description: Inserts an image from an attachment's id
 *  @parameters: height (number)
 *  @content: Quote text
 */
function plusquare_image_func( $atts, $content ){
	extract( shortcode_atts( array(
		'height' => '200',
		'link' => '',
		'target' => '_blank',
		'max_width' => '0'
	), $atts ) );
	
    $image = wp_get_attachment_image_src( $content , "full");
    $imageUrl = $image[0];
	
	if($imageUrl != ""){
		if($max_width != "0"){
			//Pixel ratio
			if( isset($_COOKIE["pixel_ratio"]) )
				$pixel_ratio = $_COOKIE["pixel_ratio"];
			else
				$pixel_ratio = 2;
			
			$imageUrl = mr_image_resize($imageUrl, $max_width, ($height=="0"? null : $height), true, 'c', $pixel_ratio > 1);
		}
		else{
			
			$imageUrl = mr_image_resize($imageUrl, $image[1], $image[2], true, 'c', false);
		}

		//Has an image available
		if($link != ""){
			$return = 	'<a href="'.$link.'" target="'.$target.'" class="image_shortcode overable_type" style="'.($max_width == "0" ? "max-width: 100%;" : "max-width: ".$max_width."px;").' height:'.($height==0?"auto":$height."px").';">';
			$return .=		'<img src="'.$imageUrl.'" alt="Image"/>';	
			$return .=		'<div class="cover"></div>';	
			$return .=		'<div class="post_type">';	
			$return .=			'<i class="esza-link"></i>';
			$return .=		'</div>';		
			$return .=	'</a>';		

			return $return;
		}
		else
			return '<div class="image_shortcode" style="'.($max_width == "0" ? "max-width: 100%;" : "max-width: ".$max_width."px;").'height:'.($height==0?"auto":$height."px").';"><img src="'.$imageUrl.'" alt="Image" /></div>';
	}
	return "";
}
add_shortcode( 'image', 'plusquare_image_func' );
						
//blog gallery shortcode options
$plusquare_shortcodes_options["image"] = array(
	"shortcode" => "image",
	"name" => "Single Image",
	"color" => "#eb3338",
	"icon" => "images/page_builder/Modules/single_image.png",
	"options" => array(
		array(
			"label" => "Image",
			"id" => "image_id",
			"type" => "media_single_picker",
			"width" => 200,
			"height" => 200,
			"associate" => "content"
		),
		array(
			"label" => "Image Height",
			"id" => "image_height",
			"type" => "pixels",
			"default" => "0",
			"help" => "Set a fixed height for the image (set to 0 if you want the image to adjust the height auto!)",
			"associate" => "height"
		),
		array(
			"label" => "Image Max Width",
			"id" => "image_max_width",
			"type" => "pixels",
			"default" => "0",
			"help" => "Set a maximum width for the image (set to 0 if you want the image to adjust the placeholder's width!)",
			"associate" => "max_width"
		),
		array(
			"label" => "Image Link",
			"id" => "image_link",
			"type" => "text",
			"default" => "",
			"help" => "Set this image to be a link. Insert the url here or leave blank if you don't want the image to be a link.",
			"associate" => "link"
		),
		array(
			"label" => "Image Link Target",
			"id" => "image_target",
			"type" => "combobox",
			"options" => array("Same Tab", "New Tab"),
			"values" => array("_self", "_blank"),
			"default" => "_blank",
			"help" => "Where you want the link to open.",
			"associate" => "target"
		)
	)
);

			
			
			
			
/*
 *  Actionbox
 *
 *	@description: Makes a action box
 *  @parameters: height (number)
 *  @content: Quote text
 */
function plusquare_actionbox_func( $atts, $content ){
	extract( shortcode_atts( array(
		'title' => '',
		'title_float' => 'none',
		'title_margin' => '0',
		'title_color' => '#ffffff',
		'text' => '',
		'text_float' => 'none',
		'text_margin' => '0',
		'text_color' => '#ffffff',
		'button_float' => 'none',
		'button_margin' => '0',
		'border_width' => '1',
		'border_style' => 'solid',
		'border_color' => '#242424',
		'vertical_padding' => '20',
		'horizontal_padding' => '20',
		'background_color' => '#333333'
	), $atts ) );
	
	return '<div class="actionbox" style="background-color: '.$background_color.'; padding: '.$vertical_padding.'px '.$horizontal_padding.'px; border: '.$border_width.'px solid '.$border_color.';">
				<h3 style="color:'.$title_color.'; margin:'.$title_margin.';float:'. $title_float.';'  .'clear:'. ($title_float == "none" ? 'both' : 'none').';'.'"><span>'.do_shortcode($title).'</span></h3>
				<p class="white" style="color:'.$text_color.'; margin:'.$text_margin.'; float:'. $text_float.';'  .'clear:'. ($text_float == "none" ? 'both' : 'none').';'.'">'.do_shortcode($text).'</p>
				'.do_shortcode('[button margin="'.$button_margin.'" float="'.$button_float.'"]'.$content.'[/button]').'
			</div>';

}
add_shortcode( 'actionbox', 'plusquare_actionbox_func' );

//Button shortcode options
$plusquare_shortcodes_options["actionbox"] = array(
	"shortcode" => "actionbox",
	"name" => "Action Box",
	"color" => "#00c5ec",
	"icon" => "images/page_builder/Modules/cta_button.png",
	"options" => array(
		array(
			"label" => "Options",
			"id" => "actionbox_tabs_unbinded",
			"type" => "tabs_unbinded",
			"options" => array("Title", "Text", "Button", "Box"),
			"tabs" => array(
				array(
					array(
						"label" => "Title Text",
						"id" => "actionbox_title_text",
						"type" => "text",
						"associate" => "title"
					),
					array(
						"label" => "Title Float",
						"id" => "actionbox_title_float",
						"type" => "combobox",
						"options" => array("Left", "None", "Right"),
						"values" => array("left", "none", "right"),
						"default" => "none",
						"info" => "Setting to none will force the text to act as a block therefore occupying the 100% width of its column if not it will be an inline object",
						"associate" => "title_float"
					),
					array(
						"label" => "Title Margin",
						"id" => "actionbox_title_margin",
						"type" => "pixels",
						"associate" => "title_margin",
						"default" => "0px",
						"info" => "Margin in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
					),
					array(
						"label" => "Title Color",
						"id" => "actionbox_title_color",
						"type" => "color_picker",
						"default" => "#ffffff",
						"associate" => "title_color"
					)
					
				),
				array(
					array(
						"label" => "Text",
						"id" => "actionbox_text",
						"type" => "text",
						"associate" => "text"
					),
					array(
						"label" => "Text Float",
						"id" => "actionbox_text_float",
						"type" => "combobox",
						"options" => array("Left", "None", "Right"),
						"values" => array("left", "none", "right"),
						"default" => "none",
						"info" => "Setting to none will force the text to act as a block therefore occupying the 100% width of its column if not it will be an inline object",
						"associate" => "text_float"
					),
					array(
						"label" => "Text Margin",
						"id" => "actionbox_text_margin",
						"type" => "pixels",
						"associate" => "text_margin",
						"default" => "0px",
						"info" => "Margin in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)",
						"help" => "Example: 5px 0px 0px 0px"
					),
					array(
						"label" => "Text Color",
						"id" => "actionbox_text_color",
						"type" => "color_picker",
						"default" => "#ffffff",
						"associate" => "text_color"
					)
				),
				array(
					array(
						"label" => "Button Float",
						"id" => "actionbox_button_float",
						"type" => "combobox",
						"options" => array("Left", "None", "Right"),
						"values" => array("left", "none", "right"),
						"default" => "none",
						"info" => "Setting to none will force the button to act as a block therefore occupying the 100% width of its column if not it will be an inline object",
						"associate" => "button_float"
					),
					array(
						"label" => "Button Margin",
						"id" => "actionbox_button_margin",
						"type" => "text",
						"default" => "0",
						"associate" => "button_margin",
						"info" => "Margin in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
					),
					array(
						"label" => "Button Picker",
						"id" => "actionbox_button_pick",
						"type" => "button_picker",
						"associate" => "content"
					)
				),
				array(
					array(
						"label" => "Background Color",
						"id" => "actionbox_background_color",
						"type" => "color_picker",
						"default" => "#333333",
						"associate" => "background_color"
					),

					array(
						"label" => "Border Width (px.)",
						"id" => "actionbox_border_width",
						"type" => "pixels",
						"default" => "1",
						"associate" => "border_width"
					),
					array(
						"label" => "Border Style",
						"id" => "actionbox_border_style",
						"type" => "combobox",
						"options" => array("Solid", "Dashed", "Dotted", "Double", "Groove", "Ridge", "Inset", "Outset"),
						"values" => array("solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"),
						"default" => "solid",
						"info" => "Choose the border's line style.",
						"associate" => "border_style"
					),
					array(
						"label" => "Border Color",
						"id" => "actionbox_border_color",
						"type" => "color_picker",
						"default" => "#242424",
						"associate" => "border_color"
					),
					array(
						"label" => "Vertical Padding (px.)",
						"id" => "actionbox_vertical_padding",
						"type" => "pixels",
						"default" => "20",
						"associate" => "vertical_padding"
					),
					array(
						"label" => "Horizontal Padding (px.)",
						"id" => "actionbox_horizontal_padding",
						"type" => "pixels",
						"default" => "20",
						"associate" => "horizontal_padding"
					)
				)
			)
		)
	)
);	

			
			
			
			
/*
 *  Button
 *
 *	@description: Makes a button
 *  @parameters: height (number)
 *  @content: Quote text
 */
$pq_buttons_id = 0;
function plusquare_button_func( $atts, $content ){
	extract( shortcode_atts( array(
		'float' => 'none',
		'margin' => '0'
	), $atts ) );
	
	$content = str_replace  ( array('&#8243;', '&#171;', '&#8221;', '&#8220;', '&#187;'), '"', $content);

	$content = str_replace("&laquo;&nbsp;", '"', $content);
	$content = str_replace("&laquo;", '"', $content);
	$content = str_replace("&Prime;", '"', $content);
	$content = str_replace("&nbsp;&raquo;", '"', $content);
	$content = str_replace("&raquo;", '"', $content);
	$content = str_replace("«", '"', $content);
	$content = str_replace("»", '"', $content);
	$content = str_replace("&#8222;", '"', $content);
	//$content = sanitize_text_field( $content );

	
	if(WP_DEBUG){
		fb::log($content);
	}
	
	$fields = json_decode($content, true);
	//if(WP_DEBUG)fb::log($fields);
	
	$background = $fields["field4"];
	$backgroundAlpha = $fields["field8"];
	$backgroundOver = $fields["field5"];
	$backgroundAlphaOver = $fields["field9"];
	
	$borderColor = $fields["field6"];
	$borderColorOver = $fields["field7"];
	$color = $fields["field12"];
	$colorOver = $fields["field13"];
	
	$tweenTime = $fields["field14"];
	$tween = $fields["field15"];
	
	$css = 
	"float:". $float.";".
	"clear:". ($float == "none" ? "both" : "none").";".
	
	//Padding
	"padding: ".$fields["field1"]."px ".$fields["field0"]."px;".
	
	//Margin
	"margin: ".$margin.";".
	"background-color: ".$background.";". 
	"color: ".$color.";". 
	"border-color: ".$borderColor.";". 
	
	//Border
	"border: ".$fields["field2"]."px solid ".$fields["field6"].";".
	
	//Round Corners
	"-webkit-border-radius: ".$fields["field3"]."px;".
	"-moz-border-radius: ".$fields["field3"]."px;".
	"-o-border-radius: ".$fields["field3"]."px;".
	"border-radius: ".$fields["field3"]."px;".
	
	//Font
	getFontCss($fields["field10"]).
	"font-size: ".$fields["field11"]."px;".
	"color: ".$fields["field12"].";".
	"line-height: normal;".
	"text-align: ".$fields["field17"].";";
	
	return '<a 	href="'.(isset($fields["field18"])?$fields["field18"]:'#').'" 
				target="'.(isset($fields["field19"]) ? $fields["field19"]:'_self').'"
				onclick="'.(isset($fields["field20"]) ? $fields["field20"]:'').'"
				style="'.$css.'" 
				data-background="'.$background.'" 
				data-background_alpha="'.$backgroundAlpha.'" 
				data-background_over="'.$backgroundOver.'" 
				data-background_alpha_over="'.$backgroundAlphaOver.'" 
				data-border="'.$borderColor.'" 
				data-border_over="'.$borderColorOver.'" 
				data-color="'.$color.'" 
				data-color_over="'.$colorOver.'" 
				data-tween_time="'.$tweenTime.'" 
				data-tween="'.$tween.'" 
				class="button pq_button" >'.do_shortcode($fields["field16"]).'</a>';
	//addEaseAll($button, $inputs.eq(14).val(), $inputs.eq(15).val(), $inputs.eq(16).val(), ["border-color", "color", "background-color"]);
}
add_shortcode( 'button', 'plusquare_button_func' );
			
//Button shortcode options
$plusquare_shortcodes_options["button"] = array(
	"shortcode" => "button",
	"name" => "Button",
	"color" => "#00c5ec",
	"icon" => "images/page_builder/Modules/button.png",
	"options" => array(
		array(
			"label" => "Button Float",
			"id" => "button_text",
			"type" => "combobox",
			"options" => array("Left", "None", "Right"),
			"values" => array("left", "none", "right"),
			"info" => "Setting to none will force the button to act as a block therefore occupying the 100% width of its column if not it will be an inline object",
			"associate" => "float"
		),

		array(
			"label" => "Button Margin",
			"id" => "button_margin",
			"type" => "text",
			"default" => "0px",
			"associate" => "margin",
			"info" => "Margin in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
		),
		array(
			"label" => "Button Picker",
			"id" => "button_pick",
			"type" => "button_picker",
			"associate" => "content"
		)
	)
);			



function plusquare_image_button_func( $atts, $content ){
	extract( shortcode_atts( array(
		'float' => 'left',
		'width' => '100',
		'height' => '100',
		'link' => '#',
		'target' => '_blank',
		'margin' => '0px',

		//Image
		'image' => '',

		//Shader
		'use_shade' => 'true',
		'shade_color' => '#000000',
		'shade_opacity' => '0',
		'shade_over_opacity' => '50',

		//Over Image
		'over_image_use' => 'true',
		'over_image' => '',
		'over_image_type' => 'full',

		//Text
		'over_text_use' => 'false',
		'over_text_padding' => '20px 20px',

		//Transition
		'transition' => 'fade',
		'transition_duration' => '1',
		'transition_type' => 'Expo',
		'transition_ease' => 'easeOut',
		'transition_ini_scale' => '100',
		'transition_ini_rotation' => '0',
		'transition_scale' => '100',
		'transition_rotation' => '0'
	), $atts ) );

	$imageUrl = wp_get_attachment_url( $image );
	$overImageUrl = wp_get_attachment_url( $over_image );
	if($imageUrl != ""){ 
		//Pixel ratio
		if( isset($_COOKIE["pixel_ratio"]) )
			$pixel_ratio = $_COOKIE["pixel_ratio"];
		else
			$pixel_ratio = 2;

		$ratio = max($transition_ini_scale, $transition_scale) / 100.0;

		$imageUrl = mr_image_resize($imageUrl, $width*$ratio, $height*$ratio, true, 'c', $pixel_ratio > 1);

		//Image
		$image = "<div><img src='$imageUrl'/></div>";

		//Shader
		$shader = "";
		if($use_shade == "true"){
			$shader = "<div class='ib_shader' style='display:none; background-color:$shade_color;'></div>";
		}

		//Over Image
		$over_image = "";
		if($over_image_use == "true" && $overImageUrl != "" ){
			if($over_image_type == "full"){
				$overImageUrl = mr_image_resize($overImageUrl, $width*$ratio, $height*$ratio, true, 'c', $pixel_ratio > 1);
				$over_image = "<div class='ib_over_image' style='display:none;'><img src='$overImageUrl'/></div>";
			}
			else{
				$over_image = "<div class='ib_over_image' style='display:none; background-image: url($overImageUrl);'></div>";
			}
		}

		//Text
		$over_text = "";
		if($over_text_use == "true"){
			$over_text = "<div class='ib_over_text' style='display:none; width: ".$width."px; height: ".$height."px; padding: $over_text_padding;'>$content</div>";
		}


		//size
		$styles = "width: ".$width."px;";
		$styles .= "height: ".$height."px;";

		//float
		$styles .= "float: ".$float.";";
		$styles .= "display: inline-block;";

		//margin
		$styles .= 'margin: '.$margin.";";


		$data = "data-width = '$width'";
		$data .= "data-height = '$height'";
		$data .= "data-use_shade = '".$use_shade."' ";
		$data .= "data-shade_opacity = '".$shade_opacity."' ";
		$data .= "data-shade_over_opacity = '".$shade_over_opacity."' ";
		$data .= "data-transition = '".$transition."' ";
		$data .= "data-transition_duration = '".$transition_duration."' ";
		$data .= "data-transition_type = '".$transition_type."' ";
		$data .= "data-transition_ease = '".$transition_ease."' ";
		$data .= "data-transition_ini_scale = '".$transition_ini_scale."' ";
		$data .= "data-transition_ini_rotation = '".$transition_ini_rotation."' ";
		$data .= "data-transition_scale = '".$transition_scale."' ";
		$data .= "data-transition_rotation = '".$transition_rotation."' ";

		return "<a href='$link' target='$target' class='image_button' style='$styles' $data >$image $shader $over_image $over_text</a>";
	}

	return "";
}

add_shortcode( 'image_button', 'plusquare_image_button_func' );
$plusquare_shortcodes_options["image_button"] = array(
	"shortcode" => "image_button",
	"name" => "Image Button",
	"color" => "#00c5ec",
	"icon" => "images/page_builder/Modules/image_button.png",
	"options" => array(
		array(
			"label" => "Image Button Link",
			"id" => "image_button_link",
			"type" => "text",
			"default" => "",
			"help" => "Url for this button.",
			"associate" => "link"
		),
		array(
			"label" => "Image Button Link Target",
			"id" => "image_button_target",
			"type" => "combobox",
			"options" => array("Same Tab", "New Tab"),
			"values" => array("_self", "_blank"),
			"default" => "_blank",
			"help" => "Where you want the link to open.",
			"associate" => "target"
		),
		array(
			"label" => "Image Button Width",
			"id" => "image_button_width",
			"type" => "pixels",
			"default" => "100",
			"associate" => "width"
		),
		array(
			"label" => "Image Button Height",
			"id" => "image_button_height",
			"type" => "pixels",
			"default" => "100",
			"associate" => "height"
		),
		array(
			"label" => "Image Button Float",
			"id" => "image_button_float",
			"type" => "combobox",
			"options" => array("Left", "None", "Right"),
			"values" => array("left", "none", "right"),
			"default" => 'none',
			"associate" => "float"
		),
		array(
			"label" => "Image Button Margin",
			"id" => "image_button_margin",
			"type" => "text",
			"default" => "0px",
			"associate" => "margin",
			"info" => "Margin in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
		),
		array(
			"label" => "Image Button Options",
			"type" => "tabs_unbinded",
			"id" => "image_button_options_unbinded",
			"options" => array("Normal Image", "Between Shader" ,"Image On Hover", "Text On Hover", "Animation"),
			"tabs" => array(
				//Normal Image
				array(
					array(
						"label" => "Normal Image",
						"id" => "image_button_image",
						"type" => "media_single_picker",
						"width" => 100,
						"height" => 100,
						"help" => "Your button's background image!",
						"associate" => "image"
					)
				),

				//Shader
				array(
					array(
						"label" => "Shader Color",
						"id" => "image_button_shader_use",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "false",
						"help" => "Check if you want to use a shader between the two images!",
						"associate" => "use_shade"
					),
					array(
						"label" => "Shader Color",
						"id" => "image_button_shader_color",
						"type" => "color_picker",
						"default" => "#000000",
						"help" => "Your shader background color!",
						"associate" => "shade_color"
					),
					array(
						"label" => "Shader Opacity",
						"id" => "image_button_shader_color_opacity",
						"type" => "percentage",
						"default" => "0",
						"help" => "Your shader background color opacity!",
						"associate" => "shade_opacity"
					),
					array(
						"label" => "Shader Opacity On Hover",
						"id" => "image_button_shader_color_over_opacity",
						"type" => "percentage",
						"default" => "50",
						"help" => "Your shader background color opacity on button hover!",
						"associate" => "shade_over_opacity"
					)
				),

				//Over State
				array(
					array(
						"label" => "Use Image On Hover",
						"id" => "image_button_over_image_use",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "true",
						"help" => "Check if you want to use a over image!",
						"associate" => "over_image_use"
					),
					array(
						"label" => "Image On Hover",
						"id" => "image_button_over_image",
						"type" => "media_single_picker",
						"width" => 100,
						"height" => 100,
						"help" => "Your button's background image!",
						"associate" => "over_image"
					),
					array(
						"label" => "Type Of Image on Hover",
						"id" => "image_button_over_image_type",
						"type" => "combobox",
						"values" => array("full", "icon"),
						"options" => array("Resize&Cover Size", "No Resize & Center"),
						"help" => "The type of over image you want!",
						"associate" => "over_image_type"
					)
				),

				//Text On Hover State
				array(
					array(
						"label" => "Use Text On Hover",
						"id" => "image_button_over_text_use",
						"type" => "checkbox",
						"values" => array("false", "true"),
						"default" => "false",
						"help" => "Check if you want to use a over image!",
						"associate" => "over_text_use"
					),
					array(
						"label" => "Text",
						"id" => "image_button_over_text",
						"type" => "rich_editor",
						"associate" => "content"
					),
					array(
						"label" => "Text Padding",
						"id" => "image_button_over_text_padding",
						"type" => "text",
						"default" => "20px 20px",
						"associate" => "over_text_padding",
						"info" => "Padding in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
					)
				),


				//Animation
				array(
					array(
						"label" => "Type Of Animation On Hover",
						"id" => "image_button_transition",
						"type" => "combobox",
						"values" => array("fade", "mouse", "mouseIn", "transformation"),
						"options" => array("Fade In&Out", "Slide In&Out (Mouse Position)", "Slide In (Mouse Position)", "Transformation"),
						"help" => "The type of transition you want the image to make on hover!",
						"associate" => "transition"
					),

					//Animation Duration
					array(
						"label" => "Animation Duration (sec.)",
						"id" => "image_button_duration",
						"type" => "text",
						"default" => "1",
						"help" => "Animation duration.",
						"associate" => "transition_duration"
					),
			
					//Animation Tween Type
					array(
						"label" => "Tween Type",
						"id" => "image_button_type",
						"type" => "combobox",
						"options" => array( "linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
						"values" => array("linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
						"default" => "Expo",
						"help" => "Animation tween type.",
						"associate" => "transition_type"
					),
					
					//Animation Tween Ease
					array(
						"label" => "Tween Ease",
						"id" => "image_button_ease",
						"type" => "combobox",
						"options" => array( "Ease In", "Ease Out", "Ease In&Out" ),
						"values" => array( "easeIn", "easeOut", "easeInOut" ),
						"default" => "easeOut",
						"help" => "Animation tween ease.",
						"associate" => "transition_ease"
					),

					array(
						"label" => "Transformation Normal Scale",
						"id" => "image_button_tranformation_ini_scale",
						"type" => "percentage",
						"default" => "110",
						"alert" => "Applicable only when type of animation is set to Transformation",
						"help" => "Transformation scale, set values bigger than 100 to augment the image, exactly 100 if you don't want it to be scaled.",
						"associate" => "transition_ini_scale"
					),

					array(
						"label" => "Transformation Normal Rotation (degrees)",
						"id" => "image_button_tranformation_ini_rotation",
						"type" => "text",
						"default" => "0",
						"alert" => "Applicable only when type of animation is set to Transformation",
						"help" => "Transformation rotation set in degrees.",
						"associate" => "transition_ini_rotation"
					),

					array(
						"label" => "Transformation On Hover Scale",
						"id" => "image_button_tranformation_scale",
						"type" => "percentage",
						"default" => "120",
						"alert" => "Applicable only when type of animation is set to Transformation",
						"help" => "Transformation scale, set values bigger than 100 to augment the image, exactly 100 if you don't want it to be scaled.",
						"associate" => "transition_scale"
					),

					array(
						"label" => "Transformation On Hover Rotation (degrees)",
						"id" => "image_button_tranformation_rotation",
						"type" => "text",
						"default" => "10",
						"alert" => "Applicable only when type of animation is set to Transformation",
						"help" => "Transformation rotation set in degrees.",
						"associate" => "transition_rotation"
					)
				)
			)
		)
	)
);	








/*
 *  Contact Form
 *
 *	@description: Makes a contact form
 *  @parameters: 
 *  @content: Contact form fields
 */
function plusquare_contact_form_func( $atts, $content ){

	$post_id = $content;

	//Contact form meta
	$to = 			get_post_meta($post_id, "contact_form_to", true);
	$title = 		get_post_meta($post_id, "contact_form_title", true);
	$labels_pos = 	get_post_meta($post_id, "contact_form_labels_position", true);
	$success = 		get_post_meta($post_id, "contact_form_success", true);
	$error = 		get_post_meta($post_id, "contact_form_error", true);
	$submit_margin= get_post_meta($post_id, "contact_form_button_margin", true);
	$submit_align = get_post_meta($post_id, "contact_form_button_align", true);
	$button = 		get_post_meta($post_id, "submit_button", true);

	//Content (form fields)
	$content_post = get_post($post_id);
	if($content_post == null){
		return;
	}
	$content = $content_post->post_content;

	//Get fields array
	$fields = json_decode($content);

	//open form element
	$return = 	'<form class="mainform form_shortcode '.($labels_pos == "top" ? "labels_top" : "").'">';
	$return .=		"<input type='hidden' name='pq_email_to' value='$to'/>";
	$return .=		"<input type='hidden' name='pq_title' value='$title'/>";

	//make fields
	foreach($fields as $field){
		$return .=	plusquare_contact_field_func($field);
	}

	//Success and error message
	$return .= 		'<div class="row on_success" style="display:none;"><div class="col-md-10 col-md-offset-2">'.do_shortcode("[message_box type='success']".$success."[/message_box]").'</div></div>';
	$return .= 		'<div class="row on_error" style="display:none;"><div class="col-md-10 col-md-offset-2">'.do_shortcode("[message_box type='error']".$error."[/message_box]").'</div></div>';


	//Sanitize button
	$button = str_replace("&laquo;&nbsp;", '"', $button);
	$button = str_replace("&laquo;", '"', $button);
	$button = str_replace("&Prime;", '"', $button);
	$button = str_replace("&nbsp;&raquo;", '"', $button);
	$button = str_replace("&raquo;", '"', $button);
	$button = str_replace("«", '"', $button);
	$button = str_replace("»", '"', $button);
	$button = str_replace("&#8243;", '"', $button);
	$button = str_replace("&#8222;", '"', $button);

	//button
	$return .= 		'<div class="row"><div class="col-md-2"><p>&nbsp;</p></div><div class="col-md-10" style="margin: '.$submit_margin.'; text-align: '.$submit_align.';">'.do_shortcode("[button]".$button."[/button]").'</div></div>';
	
	//close form
	$return .=	'</form>';

	return $return;
}
add_shortcode( 'contact_form', 'plusquare_contact_form_func' );

function plusquare_contact_field_func( $field ){
	$type = $field->type;
	$required = $field->required;
	$content = $field->label;
	
	//Label
	$label = '<div class="col-md-2"><p>'.$content.'</p></div>';
	
	$name = preg_replace ( "/[^a-zA-Z0-9]/" , "_" , $content );
	if($type == "text")
		$input = "<input value='' data-required='".$required."' type='text' name='".$name."'/>";
	else if($type == "email")
		$input = "<input value='' data-required='".$required."' type='email' name='pq_email_from'/>";
	else if($type == "name")
		$input = "<input value='' data-required='".$required."' type='text' name='pq_email_from_name'/>";
	else if($type == "subject")
		$input = "<input value='' data-required='".$required."' type='text' name='pq_email_subject'/>";
	else if($type == "textarea")
		$input = "<textarea data-required='".$required."' name='".$name."'></textarea>";
	else if($type == "checkbox")
		$input = "<a href='#' onclick='return false;' class='checkbox'><div class='checkbox_inner'></div><input value='' style='display:none;' data-required='".$required."' type='text' name='".$name."'/></a>";
	else if($type == "combobox"){
		$input  =	"<div class='combobox'>";
		$input .= 		"<div class='combobox-holder'>";
		$input .=			"<div class='selected-text'></div>";
		$input .=			"<div class='status'><i class='fa-angle-down closed-status'></i><i class='fa-angle-up opened-status' style='display:none;'></i></div>";
		$input .= 			"<div class='combobox-options-holder'>";

		$options = json_decode($field->combobox);
		if($options !== false){
			foreach($options as $option){
				$input .= "<div class='combobox-option'>$option</div>";
			}	
		}


		$input .= 			"</div>";
		$input .= 		"</div>";
		$input .= 		"<input value='' style='display:none;' data-required='".$required."' type='text' name='".$name."'/>";
		$input .= 	"</div>";
		
	}
		
	return '<div class="row">'.$label.'<div class="col-md-10">'.$input.'</div></div>';
}
			
//Contact form shortcode options
$plusquare_shortcodes_options["contact_form"] = array(
	"shortcode" => "contact_form",
	"name" => "Contact Form",
	"color" => "#3366cc",
	"icon" => "images/page_builder/Modules/contact_form.png",
	"options" => array(
		array(
			"label" => "Contact Form",
			"id" => "contact_form_picker",
			"type" => "contact_form_picker",
			"associate" => "content"
		)
	)
);
			
						
						
							


/*
 *  Text Shortcode
 *
 *	@description: Makes a text block
 *  @parameters: none
 *  @content: Text
 */
function plusquare_text_func( $atts, $content ){
	$content = do_shortcode( shortcode_unautop( $content ) );
	if ( '</p>' == substr( $content, 0, 4 )
	and '<p>' == substr( $content, strlen( $content ) - 3 ) )
		$content = substr( $content, 4, strlen( $content ) - 7 );
		
	return $content;
}
add_shortcode( 'text', 'plusquare_text_func' );

//text shortcode options
$plusquare_shortcodes_options["text"] = array(
	"shortcode" => "text",
	"name" => "Text Block",
	"color" => "#a7e200",
	"icon" => "images/page_builder/Modules/text_block.png",
	"options" => array(
		array(
			"label" => "Text Editor",
			"id" => "text_editor",
			"type" => "rich_editor",
			"associate" => "content"
		)	
	)
);




/*
 *  Google Maps Shortcode
 *
 *	@description: Makes a text block
 *  @parameters: none
 *  @content: Text
 */
function plusquare_google_maps_func( $atts, $styles ){
	global $pq_shortname;
	$googleId = get_option($pq_shortname."_google_id");
	
	if($googleId == FALSE)
		return "<p>An error occured loading google app options!</p>";
	
	extract( shortcode_atts( array(
		'height' => '300',
		'latitude' => '0',
		'longitude' => '0',
		'zoom' => '10',
		'scrollwheel' => 'true',
		'zoomcontrol' => 'false',
		'maptypecontrol' => 'false',
		'usemarker' => 'true',
		'marker' => ''
	), $atts ) );

	if($styles == "")
		$styles = "[]";
	$styles = strip_tags($styles);
	
	static $mapId = 0;
	$mapId++;

	//Marker Image
	if($usemarker == 'true' && $marker != '' && $marker != FALSE){

        $markerUrl = wp_get_attachment_image_src( $marker , "normal");
        $markerUrlWidth = $markerUrl[1] / 2;
        $markerUrlHeight = $markerUrl[2] / 2;
        $markerUrl = $markerUrl[0];

		$marker = true;
	}
	else
		$marker = false;

	return '<div style="height:'.$height.'px;"><div id="g_map_'.$mapId.'" class="g_map" style="height:'.$height.'px; margin:0;"></div></div>
			<script>
				jQuery(document).ready(function ($){
					window.plusquare_initialize = function() {
						$("body").addClass("googleInitiated").trigger("googleInitiated");
					}

					var body = $("body");
					
					function plusquare_initiateThis(){
						var latLng = new google.maps.LatLng('.$latitude.', '.$longitude.');
						var mapOptions = {
							zoom: '.$zoom.',
							center: latLng,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							streetViewControl: false,
							mapTypeControl: '.$maptypecontrol.',
							scrollwheel: '.$scrollwheel.',
							zoomControl: '.$zoomcontrol.',
							styles: '.$styles.'
						}
						var map = new google.maps.Map(document.getElementById("g_map_'.$mapId.'"), mapOptions);
						
						if('.$usemarker.'){
							'.($marker ? 'var myIcon = new google.maps.MarkerImage("'.$markerUrl.'", null, null, null, new google.maps.Size('.$markerUrlWidth.', '.$markerUrlHeight.'));' : '').'
							var marker = new google.maps.Marker({
							  position: latLng,
							  map: map
							  '.($marker ? ',icon: myIcon' : '').'
							});
						}
					}
					
					if(!body.hasClass("googleInit")){
						body.addClass("googleInit");
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.src = "http://maps.googleapis.com/maps/api/js?key='.$googleId.'&sensor=false&callback=plusquare_initialize";
						document.body.appendChild(script);
					}
					
					if(body.hasClass("googleInitiated"))
						plusquare_initiateThis();
					else
						body.bind("googleInitiated", plusquare_initiateThis);
				});
			</script>';
}
add_shortcode( 'google_maps', 'plusquare_google_maps_func' );

//google_maps shortcode options
$plusquare_shortcodes_options["google_maps"] = array(
	"shortcode" => "google_maps",
	"name" => "Google Maps",
	"color" => "#b2d516",
	"icon" => "images/page_builder/Modules/google_maps.png",
	"options" => array(
		//Height
		array(
			"label" => "Map Height",
			"id" => "google_maps_height",
			"type" => "pixels",
			"associate" => "height"
		),
	
		//latitude
		array(
			"label" => "Latitude",
			"id" => "google_maps_latitude",
			"type" => "text",
			"associate" => "latitude"
		),
		
		//longitude
		array(
			"label" => "Longitude",
			"id" => "google_maps_longitude",
			"type" => "text",
			"associate" => "longitude"
		),
		
		//zoom
		array(
			"label" => "Map Zoom",
			"id" => "google_maps_zoom",
			"type" => "text",
			"default" => "15",
			"associate" => "zoom"
		),
		
		//scrollwheel (true or false)
		array(
			"label" => "Use Scrollwheel",
			"id" => "google_maps_scrollwheel",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "true",
			"associate" => "scrollwheel"
		),
			
		//zoomControl (true or false)
		array(
			"label" => "Include Zoom Controls",
			"id" => "google_maps_zoom_controls",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "false",
			"associate" => "zoomcontrol"
		),
		
		//mapTypeControl (true or false)
		array(
			"label" => "Include Map Type Controls",
			"id" => "google_maps_type_control",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "false",
			"associate" => "maptypecontrol"
		),
		
		//useMarker (true or false)
		array(
			"label" => "Use Marker",
			"id" => "google_maps_marker",
			"type" => "checkbox",
			"values" => array("false", "true"),
			"default" => "true",
			"associate" => "usemarker"
		),

		array(
			"label" => "Marker Image",
			"id" => "google_maps_marker_image",
			"type" => "media_single_picker",
			"info" => "The image must be 2x the size you want as it will be used for retina displays as well.",
			"associate" => "marker",
			"height" => "40",
			"width" => "40"
		),

		array(
			"label" => "Map Visual Options",
			"id" => "google_maps_json",
			"type" => "text_area",
			"default" => "[]",
			"info" => "For editing how the map is shown (roads colors, backgrounds, etc). For this you can use the editor from google at <a href='http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html' target='_blank'>gmaps</a>. When you finish editing here click the show json button at the right bottom corner and copy the result and paste it here.",
			"associate" => "content"
		)
	)
);





/*
 *  Text Box
 *
 *	@description: Makes a text box
 *  @parameters: none
 *  @content: Text
 */
add_filter('the_content', 'plusquare_shortcode_empty_paragraph_fix');
function plusquare_shortcode_empty_paragraph_fix($content)
{   
	$array = array (
		'<p>[' => '[', 
		']</p>' => ']', 
		']<br />' => ']'
	);

	$content = strtr($content, $array);

	return $content;
}
function plusquare_text_box_func( $atts, $content ){
	extract( shortcode_atts( array(
		'background_color' => '#242424',
		'border_width' => '1',
		'border_style' => 'solid',
		'border_color' => '#242424',
		'vertical_padding' => '20',
		'horizontal_padding' => '20'
	), $atts ) );

	$content = do_shortcode( shortcode_unautop( $content ) );
	if ( '</p>' == substr( $content, 0, 4 )
	and '<p>' == substr( $content, strlen( $content ) - 3 ) )
		$content = substr( $content, 4, strlen( $content ) - 7 );
	
	if ( '<br>' == substr( $content, 0, 4 ) )
		$content = substr( $content, 4 );
	
	$content = plusquare_shortcode_empty_paragraph_fix($content);

	$return  =	'<div class="textbox" style="background-color: '.$background_color.'; padding: '.$vertical_padding.'px '.$horizontal_padding.'px; border: '.$border_width.'px solid '.$border_color.';">';
	$return .=		do_shortcode($content);
	$return .=	'</div>';
		
	return $return;
}
add_shortcode( 'text_box', 'plusquare_text_box_func' );

//text shortcode options
$plusquare_shortcodes_options["text_box"] = array(
	"shortcode" => "text_box",
	"name" => "Text Box Block",
	"color" => "#a7e200",
	"icon" => "images/page_builder/Modules/text_box.png",
	"options" => array(
		array(
			"label" => "Options",
			"id" => "text_box_unbinded",
			"type" => "tabs_unbinded",
			"options" => array("Text", "Box"),
			"tabs" => array(

				//Text
				array(
					array(
						"label" => "Text",
						"id" => "text_box_text_editor",
						"type" => "rich_editor",
						"associate" => "content"
					)
				),

				//Box
				array(
					array(
						"label" => "Background Color",
						"id" => "text_box_background_color",
						"type" => "color_picker",
						"default" => "#242424",
						"associate" => "background_color"
					),
					array(
						"label" => "Border Width (px.)",
						"id" => "text_box_border_width",
						"type" => "pixels",
						"default" => "1",
						"associate" => "border_width"
					),
					array(
						"label" => "Border Style",
						"id" => "text_box_border_style",
						"type" => "combobox",
						"options" => array("Solid", "Dashed", "Dotted", "Double", "Groove", "Ridge", "Inset", "Outset"),
						"values" => array("solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"),
						"default" => "solid",
						"info" => "Choose the border's line style.",
						"associate" => "border_style"
					),
					array(
						"label" => "Border Color",
						"id" => "text_box_border_color",
						"type" => "color_picker",
						"default" => "#242424",
						"associate" => "border_color"
					),
					array(
						"label" => "Vertical Padding (px.)",
						"id" => "text_box_vertical_padding",
						"type" => "pixels",
						"default" => "20",
						"associate" => "vertical_padding"
					),
					array(
						"label" => "Horizontal Padding (px.)",
						"id" => "text_box_horizontal_padding",
						"type" => "pixels",
						"default" => "20",
						"associate" => "horizontal_padding"
					)
				)
			)
		)
	)
);	




function plusquare_text_header_func( $atts, $content ){
	extract( shortcode_atts( array(

		//Font
		"font" => "Verdana",
		"font_size" => "25",
		"line_height" => "35",
		"letterspacing" => "0",
		"color" => "#ffffff",
		"align" => "left",
		"padding" => "10px",

		//Box
		"border_width" => "1",
		"border_style" => "solid",
		"border_color" => "#ffffff",

		//Line
		"line_type" => "none",
		"line_size" => "1",
		"line_color"=> "#ffffff",
		"line_width" => "40",
		"line_ver" => "5",
		"line_hor" => "5"

	), $atts ) );

	$content = do_shortcode( $content );

	$line_styles = "border-bottom:".$line_size."px solid ".$line_color.";".($line_type != "cross" ? "max-width: ".$line_width."px; margin-left: ".$line_hor."px;" : "");

	$return  =	'<div class="text_header line_'.$line_type.'">';

	if($line_type == "top"){
		$return .=	'<span style="'.$line_styles.' margin-bottom: '.$line_ver.'px;" ></span>';
	}

	if($line_type == "cross"){
		$return .=	'<span class="cross_over" style="'.$line_styles.' width: '.$line_width.'px;" ></span>';
	}
	//Content
	$return  .=	'<div style="
					'.getFontCss($font).'
					font-size: '.$font_size.'px; 
					line-height: '.$line_height.'px; 
					letter-spacing: '.$letterspacing.'px; 
					text-align: '.$align.'px;
					color: '.$color.';

					'.($line_type == "cross" ? "margin-left:".$line_width."px; margin-right:".$line_width."px;" : "").'

					padding: '.$padding.'; 
					border: '.$border_width.'px '.$border_style.' '.$border_color.';">';
	$return .=		do_shortcode($content);
	$return .=	'</div>';

	if($line_type == "cross"){
		$return .=	'<span class="cross_over" style="'.$line_styles.' width: '.$line_width.'px; margin-left: -'.$line_width.'px" ></span>';
	}

	if($line_type == "bottom"){
		$return .=	'<span style="'.$line_styles.'margin-top: '.$line_ver.'px;" ></span>';
	}
	$return .=	'</div>';
		
	return $return;
}
add_shortcode( 'text_header', 'plusquare_text_header_func' );

//text shortcode options
$plusquare_shortcodes_options["text_header"] = array(
	"shortcode" => "text_header",
	"name" => "Text Header",
	"color" => "#a7e200",
	"icon" => "images/page_builder/Modules/text_header_icon.png",
	"options" => array(
		array(
			"label" => "Options",
			"id" => "text_box_unbinded",
			"type" => "tabs_unbinded",
			"options" => array("Text", "Box", "Line"),
			"tabs" => array(

				//Text
				array(
					array(
						"label" => "Text",
						"id" => "text_header_text",
						"type" => "text_area",
						"associate" => "content"
					),
					//Font family
					array(
						"label" => "Font Family",
						"id" => "text_header_font",
						"type" => "font_picker",
						"default" => "",
						"less_var" => true,
						"help" => "Select the font you want.",
						"associate" => "font"
					),
					
					//Font size
					array(
						"label" => "Font Size",
						"id" => "text_header_font_size",
						"type" => "pixels",
						"default" => "25",
						"less_var" => true,
						"help" => "The font size in pixels you want for this style!",
						"associate" => "font_size"
					),
					
					//Font line height
					array(
						"label" => "Line Height",
						"id" => "text_header_line_height",
						"type" => "pixels",
						"default" => "35",
						"less_var" => true,
						"help" => "The style's line height in pixels!",
						"associate" => "line_height"
					),
					
					//Font spacing
					array(
						"label" => "Letter Spacing",
						"id" => "text_header_font_letterspacing",
						"type" => "pixels",
						"default" => "0",
						"less_var" => true,
						"help" => "The style's letter spacing in pixels!",
						"associate" => "letterspacing"
					),
					array(
						"label" => "Text Color",
						"id" => "text_header_color",
						"type" => "color_picker",
						"default" => "#ffffff",
						"associate" => "color"
					),
					array(
						"label" => "Text Align",
						"id" => "text_header_align",
						"type" => "combobox",
						"options" => array("Left", "Center", "Right"),
						"values" => array("left", "center", "right"),
						"default" => "left",
						"associate" => "align"
					),
					array(
						"label" => "Text Padding",
						"id" => "text_header_text_padding",
						"type" => "text",
						"default" => "20px 20px",
						"associate" => "padding",
						"info" => "Padding in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
					)
				),

				//Box
				array(
					array(
						"label" => "Border Width (px.)",
						"id" => "text_header_border_width",
						"type" => "pixels",
						"default" => "1",
						"associate" => "border_width"
					),
					array(
						"label" => "Border Style",
						"id" => "text_header_border_style",
						"type" => "combobox",
						"options" => array("Solid", "Dashed", "Dotted", "Double", "Groove", "Ridge", "Inset", "Outset"),
						"values" => array("solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"),
						"default" => "solid",
						"info" => "Choose the border's line style.",
						"associate" => "border_style"
					),
					array(
						"label" => "Border Color",
						"id" => "text_header_border_color",
						"type" => "color_picker",
						"default" => "#ffffff",
						"associate" => "border_color"
					)
				),

				//Line
				array(
					array(
						"label" => "Line Type",
						"id" => "text_header_line_type",
						"type" => "combobox",
						"options" => array("None", "Bottom Line", "Crossline", "Top Line"),
						"values" => array("none", "bottom", "cross", "top"),
						"default" => "none",
						"associate" => "line_type"
					),
					array(
						"label" => "Line Size",
						"id" => "text_header_line_size",
						"type" => "pixels",
						"default" => "1",
						"less_var" => true,
						"help" => "The line size in pixels!",
						"associate" => "line_size"
					),
					array(
						"label" => "Line Color",
						"id" => "text_header_line_color",
						"type" => "color_picker",
						"default" => "#ffffff",
						"associate" => "line_color"
					),
					array(
						"label" => "Line Width",
						"id" => "text_header_line_width",
						"type" => "pixels",
						"default" => "40",
						"associate" => "line_width"
					),
					array(
						"label" => "Line Vertical Offset",
						"id" => "text_header_line_ver_offset",
						"type" => "pixels",
						"default" => "5",
						"associate" => "line_ver",
						"info" => "Applies only for bottom and top line type"
					),
					array(
						"label" => "Line Horizontal Offset",
						"id" => "text_header_line_hor_offset",
						"type" => "pixels",
						"default" => "0",
						"associate" => "line_hor",
						"info" => "Applies only for bottom and top line type"
					)

				)
			)
		)
	)
);	




/*
 *  Ordered list ord
 *
 *	@description: Makes a text box
 *  @parameters: none
 *  @content: Text
 */
function plusquare_ord_func( $atts, $content ){
	return '<span class="ord">'.do_shortcode($content).'</span>';
}
add_shortcode( 'ord', 'plusquare_ord_func' );






/*
 *  Vertical Space
 *
 *	@description: Makes a vertical space with variable height
 *  @parameters: none
 *  @content: Height
 */
function plusquare_vertical_space_func( $atts, $content ){
	return '<div style="height:'.$content.'px;clear:both;"></div>';
}
add_shortcode( 'vertical_space', 'plusquare_vertical_space_func' );

//text shortcode options
$plusquare_shortcodes_options["vertical_space"] = array(
	"shortcode" => "vertical_space",
	"name" => "Vertical Space",
	"color" => "#ffff00",
	"icon" => "images/page_builder/Modules/vertical_space.png",
	"options" => array(
		array(
			"label" => "Vertical Space Amount",
			"id" => "vertical_space_height",
			"default" => "10",
			"type" => "pixels",
			"help" => "Amount in pixels that you want this spacer to have.",
			"associate" => "content"
		)	
	)
);







//Dropcap
function plusquare_dropcap_func( $atts, $content ){
	extract( shortcode_atts( array(
		'type' => ''
	), $atts ) );
	
	return '<span class="dropcap'.$type.'">'.do_shortcode($content).'</span>';
}
add_shortcode( 'dropcap', 'plusquare_dropcap_func' );





/*
 *  Display Posts
 *
 *	@description: Makes a vertical space with variable height
 *  @parameters: none
 *  @content: Height
 */
add_shortcode( 'display-posts', 'plusquare_be_display_posts_shortcode' );
function plusquare_be_display_posts_shortcode( $atts ) {
	global $pq_shortname;

	// Original Attributes, for filters
	$original_atts = $atts;

	// Pull in shortcode attributes and set defaults
	$atts = shortcode_atts( array(
		'author'              => '',
		'category'            => '',
		'date_format'         => '(n/j/Y)',
		'id'                  => false,
		'ignore_sticky_posts' => false,
		'image_size'          => false,
		'include_content'     => false,
		'include_date'        => false,
		'include_excerpt'     => false,
		'meta_key'            => '',
		'no_posts_message'    => '',
		'offset'              => 0,
		'order'               => 'DESC',
		'orderby'             => 'date',
		'post_parent'         => false,
		'post_status'         => 'publish',
		'post_type'           => 'post',
		'posts_per_page'      => '10',
		'tag'                 => '',
		'tax_operator'        => 'IN',
		'tax_term'            => false,
		'taxonomy'            => false,
		'wrapper'             => 'div',
	), $atts );

	$author = sanitize_text_field( $atts['author'] );
	$category = sanitize_text_field( $atts['category'] );
	$date_format = sanitize_text_field( $atts['date_format'] );
	$id = $atts['id']; // Sanitized later as an array of integers
	$ignore_sticky_posts = (bool) $atts['ignore_sticky_posts'];
	$image_size = sanitize_key( $atts['image_size'] );
	$include_content = (bool)$atts['include_content'];
	$include_date = (bool)$atts['include_date'];
	$include_excerpt = (bool)$atts['include_excerpt'];
	$meta_key = sanitize_text_field( $atts['meta_key'] );
	$no_posts_message = sanitize_text_field( $atts['no_posts_message'] );
	$offset = intval( $atts['offset'] );
	$order = sanitize_key( $atts['order'] );
	$orderby = sanitize_key( $atts['orderby'] );
	$post_parent = $atts['post_parent']; // Validated later, after check for 'current'
	$post_status = $atts['post_status']; // Validated later as one of a few values
	$post_type = sanitize_text_field( $atts['post_type'] );
	$posts_per_page = intval( $atts['posts_per_page'] );
	$tag = sanitize_text_field( $atts['tag'] );
	$tax_operator = $atts['tax_operator']; // Validated later as one of a few values
	$tax_term = sanitize_text_field( $atts['tax_term'] );
	$taxonomy = sanitize_key( $atts['taxonomy'] );
	$wrapper = sanitize_text_field( $atts['wrapper'] );

	
	// Set up initial query for post
	$args = array(
		'category_name'       => $category,
		'order'               => $order,
		'orderby'             => $orderby,
		'post_type'           => explode( ',', $post_type ),
		'posts_per_page'      => $posts_per_page,
		'tag'                 => $tag,
	);
	
	// Ignore Sticky Posts
	if( $ignore_sticky_posts )
		$args['ignore_sticky_posts'] = true;
	
	// Meta key (for ordering)
	if( !empty( $meta_key ) )
		$args['meta_key'] = $meta_key;
	
	// If Post IDs
	if( $id ) {
		$posts_in = array_map( 'intval', explode( ',', $id ) );
		$args['post__in'] = $posts_in;
	}
	
	// Post Author
	if( !empty( $author ) )
		$args['author_name'] = $author;
		
	// Offset
	if( !empty( $offset ) )
		$args['offset'] = $offset;
	
	// Post Status	
	$post_status = explode( ', ', $post_status );		
	$validated = array();
	$available = array( 'publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any' );
	foreach ( $post_status as $unvalidated )
		if ( in_array( $unvalidated, $available ) )
			$validated[] = $unvalidated;
	if( !empty( $validated ) )		
		$args['post_status'] = $validated;
	
	
	// If taxonomy attributes, create a taxonomy query
	if ( !empty( $taxonomy ) && !empty( $tax_term ) ) {
	
		// Term string to array
		$tax_term = explode( ', ', $tax_term );
		
		// Validate operator
		if( !in_array( $tax_operator, array( 'IN', 'NOT IN', 'AND' ) ) )
			$tax_operator = 'IN';
					
		$tax_args = array(
			'tax_query' => array(
				array(
					'taxonomy' => $taxonomy,
					'field'    => 'slug',
					'terms'    => $tax_term,
					'operator' => $tax_operator
				)
			)
		);
		
		// Check for multiple taxonomy queries
		$count = 2;
		$more_tax_queries = false;
		while( 
			isset( $original_atts['taxonomy_' . $count] ) && !empty( $original_atts['taxonomy_' . $count] ) && 
			isset( $original_atts['tax_' . $count . '_term'] ) && !empty( $original_atts['tax_' . $count . '_term'] ) 
		):
		
			// Sanitize values
			$more_tax_queries = true;
			$taxonomy = sanitize_key( $original_atts['taxonomy_' . $count] );
	 		$terms = explode( ', ', sanitize_text_field( $original_atts['tax_' . $count . '_term'] ) );
	 		$tax_operator = isset( $original_atts['tax_' . $count . '_operator'] ) ? $original_atts['tax_' . $count . '_operator'] : 'IN';
	 		$tax_operator = in_array( $tax_operator, array( 'IN', 'NOT IN', 'AND' ) ) ? $tax_operator : 'IN';
	 		
	 		$tax_args['tax_query'][] = array(
	 			'taxonomy' => $taxonomy,
	 			'field' => 'slug',
	 			'terms' => $terms,
	 			'operator' => $tax_operator
	 		);
	
			$count++;
			
		endwhile;
		
		if( $more_tax_queries ):
			$tax_relation = 'AND';
			if( isset( $original_atts['tax_relation'] ) && in_array( $original_atts['tax_relation'], array( 'AND', 'OR' ) ) )
				$tax_relation = $original_atts['tax_relation'];
			$args['tax_query']['relation'] = $tax_relation;
		endif;
		
		$args = array_merge( $args, $tax_args );
	}
	
	// If post parent attribute, set up parent
	if( $post_parent ) {
		if( 'current' == $post_parent ) {
			global $post;
			$post_parent = $post->ID;
		}
		$args['post_parent'] = intval( $post_parent );
	}
	
	// Set up html elements used to wrap the posts. 
	// Default is ul/li, but can also be ol/li and div/div
	$wrapper_options = array( 'ul', 'ol', 'div' );
	if( ! in_array( $wrapper, $wrapper_options ) )
		$wrapper = 'ul';
	$inner_wrapper = 'div' == $wrapper ? 'div' : 'li';

	
	$listing = new WP_Query( apply_filters( 'display_posts_shortcode_args', $args, $original_atts ) );
	if ( ! $listing->have_posts() )
		return apply_filters( 'display_posts_shortcode_no_results', wpautop( $no_posts_message ) );
		
	$inner = '';
	while ( $listing->have_posts() ): $listing->the_post(); global $post;
		
		$image = $date = $excerpt = $content = '';
		
		$title = '<a class="title" href="' . apply_filters( 'the_permalink', get_permalink() ) . '"><p>' . apply_filters( 'the_title', get_the_title() ) . '</p></a>';
		
		//Get Post Type
        $post_media_type = get_post_meta( $post->ID, "post_media_type", true );
			
		//Image
		if ( $post_media_type == "image" )  {
			//Pixel ratio
			if( isset($_COOKIE["pixel_ratio"]) )
				$pixel_ratio = $_COOKIE["pixel_ratio"];
			else
				$pixel_ratio = 2;

			$imageUrl = wp_get_attachment_image_src( get_post_meta($post->ID, "post_image", true), "thumbnail" );
			$imageUrl = $imageUrl[0];
			$imageUrl = mr_image_resize($imageUrl, 40, 40, true, 'c', $pixel_ratio > 1);
			$image = '<a class="post_type" href="' . get_permalink() . '"><img src="'. $imageUrl .'" alt="Post thumbnail"/></a> ';
		}
		else{
			if($post_media_type == "" || $post_media_type == FALSE)
				$post_media_type = "text";
				
			$type = "esza-".$post_media_type;
			switch($post_media_type){
				case "sound":
				case "soundcloud":
					$type = "esza-headphones";
					break;	
				
			}
			
			$image = '<a class="post_type" href="' . get_permalink() . '"><i class="'.$type.'"></i></a>';
		
		}
			
		//Date
		if ( $include_date ) 
			$date = ' <span class="date">' . get_the_date( $date_format ) . '</span>';
		
		//Excerpt
		if ( $include_excerpt ) 
			$excerpt = ' <span class="excerpt-dash">-</span> <span class="excerpt">' . get_the_excerpt() . '</span>';
			
		//Content
		if( $include_content )
			$content = '<div class="content">' . apply_filters( 'the_content', get_the_content() ) . '</div>'; 
			
		//Comments
		$num_comments = get_comments_number(); // get_comments_number returns only a numeric value

		$comment_Str = get_option($pq_shortname."_trans_comment", "Comment");
		$comments_Str = get_option($pq_shortname."_trans_comments", "comments");
		if ( comments_open() ) {
			if ( $num_comments == 0 ) {
				$write_comments = '0 '.$comments_Str;
			} elseif ( $num_comments > 1 ) {
				$write_comments = $num_comments . " " .$comments_Str;
			} else {
				$write_comments = '1 '.$comment_Str;
			}
		} else {
			$write_comments =  '';
		}
		$comments = '<a href="'.apply_filters( 'the_permalink', get_permalink() ).'" class="dynamic_loading" onclick="TO_COMMENTS = true;"><span class="comments'.($num_comments == 0 ? ' no_comments': '').'">
                        <i class="esza-comment"></i>'.$write_comments.'</span></a>';
		
		//Unite
		$class = array( 'listing-item' );
		$class = apply_filters( 'display_posts_shortcode_post_class', $class, $post, $listing );
		$output = '<' . $inner_wrapper . ' class="' . implode( ' ', $class ) . '">' . $image . '<div class="listing-item-content">'. $title . $comments. $date . $excerpt . $content . '</div>' . '</' . $inner_wrapper . '>';
		
		// If post is set to private, only show to logged in users
		if( 'private' == get_post_status( $post->ID ) && !current_user_can( 'read_private_posts' ) )
			$output = '';
		
		$inner .= apply_filters( 'display_posts_shortcode_output', $output, $original_atts, $image, $title, $date, $excerpt, $inner_wrapper, $content, $class 			);
		
	endwhile; wp_reset_postdata();
	
	$open = apply_filters( 'display_posts_shortcode_wrapper_open', '<' . $wrapper . ' class="display-posts-listing">', $original_atts );
	$close = apply_filters( 'display_posts_shortcode_wrapper_close', '</' . $wrapper . '>', $original_atts );
	$return = $open . $inner . $close;

	return $return;
}

//posts_per_page orderby order offset
$plusquare_shortcodes_options["display-posts"] = array(
	"shortcode" => "display-posts",
	"name" => "Display Posts",
	"color" => "#00cc00",
	"icon" => "images/page_builder/Modules/display_posts.png",
	"options" => array(
		array(
			"label" => "Number Of Posts To Display",
			"id" => "posts_number",
			"type" => "text",
			"default" => "3",
			"associate" => "posts_per_page"
		),
		array(
			"label" => "Order Posts By",
			"id" => "posts_orderby",
			"type" => "combobox",
			"options" => array("None", "Date", "ID", "Author", "Title", "Name", "Last Modified", "Random", "Comments Count"),
			"values" => array("none", "date", "ID", "author", "title", "name", "modified", "rand", "comment_count"),
			"default" => "date",
			"associate" => "orderby"
		),
		array(
			"label" => "Order",
			"id" => "posts_order",
			"type" => "combobox",
			"options" => array("Ascendant", "Descendant"),
			"values" => array("ASC", "DESC"),
			"default" => "DESC",
			"associate" => "order"
		),
		array(
			"label" => "Number Of Posts To Offset",
			"id" => "posts_offset",
			"type" => "text",
			"default" => "0",
			"associate" => "offset"
		)
	)
);	











//Orders shortcodes for page builder and stack builder
function plusquare_order_shortcodes(){
	global $plusquare_shortcodes_options;

	//Order shortcodes
	$order = array(
		//grey
		"raw",

		//greens
		"text",
		"text_header",
		"text_box",
		"quote",
		"message_box",
		
		//purples
		"accordion",
		"tabs",
		
		//red
		"image",
		"blog_gallery",
		"slider",
		"socialVideo",
		"music_player",
		
		//yellow
		"divider",
		"text_divider",
		"vertical_space",
		
		//blue
		"contact_form",
		"button",
		"image_button",
		"actionbox",
		
		//orange
		
		//dark green
		"display-posts",
		
		//other
		"google_maps",
		"flickr",
		"behance",
		//"pinterest",
		"dribbble",
		"instagram",
		"facebook_like",
		"google_plus",
		"twitter_button",
		"tweet_feed",
		"tweet"
	);

	$temp = array();
	foreach($order as $id){
		$temp[$id] = $plusquare_shortcodes_options[$id];
	}

	return $temp;
}

$plusquare_shortcodes_options = plusquare_order_shortcodes();
