<?php




/**
 * Enqueues
 */
function plusquare_frontend_scripts() {
	if(isset($_GET["rel"]))
		return;

	//Check ie version
	preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
	$version = 999;
	if (count($matches)>1)
		//Then we're using IE
		$version = $matches[1];

	if($version <= 7)
		return;
     
    //Twitter bootstrap
    wp_enqueue_style( 'bootstrap_css',  get_template_directory_uri().'/css/bootstrap/bootstrap.min.css' );
    
    //Font Awesome
    wp_enqueue_style( 'font_awesome',  get_template_directory_uri().'/css/font_awesome/font-awesome.min.css' );
    
    //Plusquare icons
    wp_enqueue_style( 'essenza_icons',  get_template_directory_uri().'/css/essenza_icons/pq-icon-font.css' );

    
    //Main Stylesheet
    wp_enqueue_style( 'main_css',  get_template_directory_uri().'/css/main.css' );

    //Google fonts
    wp_enqueue_style( 'essenza_google_fonts', get_google_fonts_link() );

    //JQuery
	wp_enqueue_script( 'jquery' );


	//Sound manager
	wp_register_script( 'soundmanager2-js', get_template_directory_uri() . '/js/other/soundmanager2.js');
	wp_localize_script( 'soundmanager2-js', 'directory', array('path' => get_template_directory_uri() . '/swf') );
	wp_enqueue_script( 'soundmanager2-js' );


	//Main Javascript compilation
  	wp_register_script( 'require-js', get_stylesheet_directory_uri() . '/js/libs/require.js', array( "jquery" ), false, false );
  	wp_register_script( 'essenza-js', get_stylesheet_directory_uri() . '/js/Essenza.js', array( 'require-js' ), false, false);

	$esza_portfolio_title_font_size_max = get_option("esza_portfolio_title_font_size_max", "true");
	$esza_portfolio_title_font_size_min = get_option("esza_portfolio_title_font_size_min", "true");
	$esza_portfolio_title_font_size_max = $esza_portfolio_title_font_size_max === FALSE ? "37" : $esza_portfolio_title_font_size_max;
	$esza_portfolio_title_font_size_min = $esza_portfolio_title_font_size_min === FALSE ? "25" : $esza_portfolio_title_font_size_min;
	$WP_DIRECTORY = array( 
		'path' => get_template_directory_uri() . '/js' , 
		'cover_menu' => get_option("esza_cover_menu", "true"),
		'esza_portfolio_title_font_size_max' => get_option("esza_portfolio_title_font_size_max", "true"),
		'esza_portfolio_title_font_size_min' => get_option("esza_portfolio_title_font_size_min", "true"),
		'esza_submenu_alignment' => get_option("esza_submenu_alignment", "left"),
		'esza_submenu_start_opacity' => get_option("esza_submenu_start_opacity", "0"),
		'esza_submenu_start_vertical_offset' => get_option("esza_submenu_start_vertical_offset", "-10"),
		'esza_submenu_animation_duration' => get_option("esza_submenu_animation_duration", "0.6"),
		'esza_submenu_indication' => get_option("esza_submenu_indication", "true"),
		'esza_submenu_indication_icon' => get_option("esza_submenu_indication_icon", "fa-angle-down"),
		'esza_menu_min_margin' => get_option("esza_menu_min_margin", "25px"),
		'esza_disable_ajax' => get_option("esza_disable_ajax", "false"),
		'esza_url' => home_url()
	);
	wp_localize_script( 'essenza-js', 'directory', $WP_DIRECTORY );
	
	wp_enqueue_script( 'essenza-js' );
	wp_enqueue_script( 'require-js' );


	//Html 5 fallback script
    if($version < 9)
    	wp_enqueue_script( 'htlm5-js',  get_template_directory_uri().'/js/other/html5.js' );

	//Comment reply function
	wp_enqueue_script( 'comment-reply' );



	//Check For Retina Display
	if( !isset($_COOKIE["pixel_ratio"]) ){
		wp_register_script( 'pixel_ratio_cookie', get_template_directory_uri() . '/js/other/writePixelRatioCookie.js');
		wp_localize_script( 'pixel_ratio_cookie', 'vars', array('php_self' => $_SERVER['PHP_SELF']) );
    	wp_enqueue_script( 'pixel_ratio_cookie' );
	}
   


	//Apis

	//Video
	wp_enqueue_script( 'video-js',  get_template_directory_uri().'/js/apis/video.js' );

	//google_analytics
	$googleAnalyticsId = get_option("esza_google_analytics_id");
	if($googleAnalyticsId != FALSE && $googleAnalyticsId != NULL){
		wp_register_script( 'google_analytics-js',  get_template_directory_uri().'/js/apis/google_analytics.js' );
		wp_localize_script( 'google_analytics-js', 'vars', array('id' => $googleAnalyticsId) );
    	wp_enqueue_script( 'google_analytics-js' );
	}

	//twitter
	wp_enqueue_script( 'twitter-js',  get_template_directory_uri().'/js/apis/twitter.js' );

	//twitter
	wp_enqueue_script( 'respond-js',  get_template_directory_uri().'/js/other/respond.min.js' );


	//facebook
	$facebookUserAppId = get_option("esza_facebook_id");
	if($facebookUserAppId != FALSE && $facebookUserAppId != NULL){
		wp_register_script( 'facebook-js',  get_template_directory_uri().'/js/apis/facebook.js' );
		wp_localize_script( 'facebook-js', 'vars', array(
			'app_id' => $facebookUserAppId, 
			'channel' => (get_bloginfo('template_directory').'/channel.php') 
		));
    	wp_enqueue_script( 'facebook-js' );
	}


	//Runtime javascript calls
    if(isset($_GET["rel"]))
		$essenza_page_dynamically_loaded = $_GET["rel"];
	$mw_scroll = get_option("esza_mw_scroll");
	$mw_ease = get_option("esza_mw_ease");
	$mw_amount = get_option("esza_mw_amount");
	$useFooterTwitter = get_option("esza_footer_twitter");

	wp_register_script( 'roll_grinds', get_template_directory_uri().'/js/essenza/RollGrinds.js', array("require-js"), false, true );
	wp_localize_script( 'roll_grinds', 'vars', array(
		'mw_scroll' => $mw_scroll, 
		'mw_ease' => $mw_ease ,
		'mw_amount' => $mw_amount,
		'dynamic_loaded' => isset($essenza_page_dynamically_loaded) ? true : false
	));
	wp_enqueue_script( 'roll_grinds');
	wp_enqueue_script( 'roll_grinds_once', get_template_directory_uri().'/js/essenza/RollGrindsOnce.js', array("require-js"), false, true );

}
add_action( 'wp_enqueue_scripts', 'plusquare_frontend_scripts' );


function print_inline_script() {
	global $pq_shortname;
	?>
	<style type="text/css">
		<?php echo get_option($pq_shortname."_custom_css"); ?>
	</style>
	<?php
}
add_action( 'wp_head', 'print_inline_script' );