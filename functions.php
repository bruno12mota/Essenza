<?php

//DEBUG
if(WP_DEBUG){
	require_once('plusquare_admin/config-backend/scripts/FirePHPCore/fb.php');
	ob_start();
}

if(WP_DEBUG)fb::log("DEBUG ON");


//Require Scripts
require_once( 'scripts/mr-image-resize.php' );


//variables
$pq_shortname = "esza";
$pq_themename = "Essenza";
$pq_themename_lc = "essenza";


//Check if it's an ajax call from frontend
$pq_ajax_frontent = false;
if(isset($_POST) && isset($_POST["frontend"])){
	$pq_ajax_frontent = true;
}


/*
 *     BACKEND
 */
if(!$pq_ajax_frontent && is_admin()){
	require_once( get_template_directory() . '/plusquare_admin/config-backend/backend.php' );
}
	

/*
 *     FRONTEND
 */
else{

	require_once( get_template_directory() . '/plusquare_admin/config-frontend/frontend.php' );
}



/*
 *     COMMON
 */
require_once( get_template_directory() . '/plusquare_admin/config-common/common.php' );
