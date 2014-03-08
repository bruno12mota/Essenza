<?php

//DEBUG
if(WP_DEBUG){
	require_once('plusquare_admin/config-backend/scripts/FirePHPCore/fb.php');
	ob_start();
}

if(WP_DEBUG)fb::log("DEBUG ON");

//apis
require_once( 'scripts/twitteroauth/twitteroauth.php');
require_once( 'scripts/phpFlickr.php');
require_once( 'scripts/Be/Api.php' );


//Require Scripts
require_once( 'scripts/mr-image-resize.php' );


//to contact before options
$pq_shortname = "esza";



/*
 *     BACKEND
 */
if(is_admin()){
	require_once( get_template_directory() . '/plusquare_admin/config-backend/backend.php' );
}
	

/*
 *     FRONTEND
 */
if(!is_admin() || (defined('DOING_AJAX') && DOING_AJAX)){
	require_once( get_template_directory() . '/plusquare_admin/config-frontend/frontend.php' );
}



/*
 *     COMMON
 */
require_once( get_template_directory() . '/plusquare_admin/config-common/common.php' );
