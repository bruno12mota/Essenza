<?php

//Check if loaded dynamically
if(isset($_GET["rel"]))
	$essenza_page_dynamically_loaded = $_GET["rel"];

//Get title
$essenza_title = get_bloginfo('name').wp_title(" | ", FALSE);

//IE version check
$essenza_is_old_ie = is_unsupported_browser();


//Welcome Message
$useWelcome = get_option("esza_use_welcome");
if($useWelcome == "true"){
	$whenWelcome = get_option("esza_when_welcome");
	
	if( empty($_COOKIE['first_time']) ) {
		$refreshIn = ($whenWelcome == "once_day" ? 86400 : ($whenWelcome == "once_week" ? 604800 : 157680000 ) );
		setcookie("first_time", 1, time()+$refreshIn);  /* (seconds)*/
	}
}



//START OF FRESH LOADED PAGE CODE
if(!isset($essenza_page_dynamically_loaded)){
?>
<!DOCTYPE html> 
<html <?php language_attributes(); ?>>
<head>
	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
	<meta name="generator" content="WordPress <?php bloginfo('version'); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
     
	<title><?php echo $essenza_title ?></title>
     
    <!-- Favicon -->
    <?php echo plusquare_get_favicon(); ?>

	<!-- RSS FEED -->
	<link rel="alternate" type="application/rss+xml" title="RSS2.0" href="<?php bloginfo('rss2_url'); ?>" />

	<!-- PING BACK -->
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
    	
	<!-- WP headers -->
	<?php wp_head(); ?>
</head>



<?php
//Not For IE <8
if($essenza_is_old_ie === true){
	?>
	<body>
		<div class="upgrade_browser">
			<p>This is a modern site which require a more recent browser to work properly. <a href="https://www.google.com/intl/en/chrome/browser/">Please upgrade now</a>!</p>
		</div>
	</body>
	</html>
	<?php
	exit();
}
?>



<body <?php body_class(); ?>> <!-- oncontextmenu="return false"> -->

	<?php

	//Options
	$submenu_type = get_option("esza_submenu_type");

	?>



	<!-- Facebook SDK -->
	<div id="fb-root"></div>



    <!-- Header -->
	<div id="header" class="<?php echo $submenu_type; ?>">
        <!-- LOGO -->
    	<?php echo plusquare_get_logo(); ?>

    	<?php
    	$useSearch = get_option("esza_menu_search");

    	if($useSearch == "true"){
	    	?>
	        <!-- Only search button on non mobile media sizes (Right handside menu) -->
	        <div class="right menuNotMobile">
	            <a href="#" class="headerButton searchButton" onClick="return false;"><i class="esza-magnify"></i></a>
	        </div>
	        <?php
	    }
	    ?>
    
        <!-- Search and toogle menu button on mobile media sizes (Right handside menu) -->
        <div class="right menuMobile" style="display:none;">
        	<?php
        	if($useSearch == "true"){
				?>
            	<a href="#" class="headerButton searchButton" onClick="return false;"><i class="esza-magnify"></i></a>
				<?php
        	}
        	?>
            <a href="#" class="headerButton toogleMenuMobile" onClick="return false;"><i class="esza-menu"></i></a>
        </div>

		<!-- MENU -->
		<?php
			$orientation = get_option("esza_menu_orientation", " ");
		?>
		<div class="menu_wraper <?php echo $orientation; ?>" style="opacity: 0;">
		<?php
		if(function_exists('wp_nav_menu')):
			wp_nav_menu(
				array(
				'theme_location' =>'primary_nav',
				'container'=>'',
				'depth' => 0,
				'menu_id' => 'menu' )
			);
		endif;
		?>
		</div>
	</div>
    <!-- Header End -->
    

    <!-- Mobile Menu -->
    <div class="menu_wraper mobile" style="display:none;">
    	<div class="menu_mobile_background"></div>
    	<hr/>
		<?php
	    if(function_exists('wp_nav_menu')):
	        wp_nav_menu(
	            array(
				'theme_location' =>'primary_nav',
	            'container'=>'',
	            'depth' => 0,
	            'menu_id' => 'menu_mobile' )
	        );
	    endif;
	    ?>
    </div>
    <!-- Mobile Menu End -->
    

    <?php
	//Welcome Message
	
	function showWelcomeMessage(){
		?>
        <!-- Welcome Message -->
        <div class="info" id="initial_info" style="display:none; ">
        	<div class="click_area"></div>
            <div class="container">
                <h1 class="white"><?php echo get_option("esza_welcome_title"); ?></h1>
                <hr/>
                <p><?php echo get_option("esza_welcome_text"); ?></p>
                <a href="#" class="close_btn" onClick="return false;"></a>
            </div>
        </div>
        <?php	
	}
	
	if($useWelcome == "true"){
		if ( $whenWelcome == "everytime"){
			showWelcomeMessage();
		}
		else if( empty($_COOKIE['first_time']) ) {
			showWelcomeMessage();
		}
	}
	//Welcome Message End
	?>
     
     
    <!-- Search Popup -->
    <div class="info" id="search_info" style="display:none; ">
        <div class="click_area"></div>
        <div class="container">
            <div style="position:relative;">
            <?php get_search_form(); ?>
            </div>
            <a href="#" class="close_btn" onClick="return false;"></a>
        </div>
    </div>
	
	<script>
		jQuery(document).ready(function ($){

			//Info panels
			require(["jquery", "essenza/Info"],
				function($, Info) {
					$(document).ready(function(){
						if($("#initial_info").length > 0)
							new Info($("#initial_info"), true); 
						var searchInfo = new Info($("#search_info"), false);
						
						$(".searchButton").click(function(){
							searchInfo.toogle();

							if(searchInfo.shown){
								//Focus input
								$("#search").focus();
							}

							return false;
						});
					});
				}
			);

			//Easy background instanciation
			require(["essenza/EasyBackground"],
				function(EasyBackground) {
					easyBackground = new EasyBackground({
						background_color: "#111111",
						pattern: "none",
						autoplay: true,
						autoplayTime: 10000,
						
						images:[],
						images_sizing: "fill",
						
						animationIn: { attribute:["alpha"],
						value:    [0],
						easing:   ["easeOutExpo"],
						time:     [1],
						delay:    0 },
						animationOut: { attribute:["alpha"],
						value:    [0],
						easing:    ["easeOutExpo"],
						time:    [1],
						delay:    0 }
					});
					if(!<?php echo is_search() ? "true" : "false"; ?>){
						<?php plusquare_change_easy_background(); ?>
					}
				}
			);
		});
	</script>


<?php
}


//AJAX LOADED PAGES ONLY
else if($essenza_page_dynamically_loaded == "ajax"){
	?>
	<script>
		require(["jquery"], function($){
			$(document).ready(function() {
				document.title = '<?php echo $essenza_title; ?>';

				//Easy background instanciation
				require(["essenza/EasyBackground"],
					function(EasyBackground) {
						<?php plusquare_change_easy_background(); ?>
					}
				);
			});
		});
	</script>
    <?php
}
	
