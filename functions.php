<?php

//DEBUG
require_once('plusquare_admin/scripts/FirePHPCore/fb.php');
ob_start();

//apis
require_once( 'scripts/twitteroauth/twitteroauth.php');
require_once( 'scripts/phpFlickr.php');
require_once( 'scripts/Be/Api.php' );


//Require Scripts
require_once( 'scripts/mr-image-resize.php' );

//to contact before options
$pq_shortname = "esza";



/*
 *     IMAGES CUSTOM SIZES
 */

//Thumbnail
update_option('thumbnail_size_w', 150);
update_option('thumbnail_size_h', 150);
update_option('thumbnail_crop', 1);

//Medium
update_option('medium_size_w', 430);
update_option('medium_size_h', 9999999);
update_option('medium_crop', 0);

//Large
update_option('large_size_w', 700);
update_option('large_size_h', 9999999);
update_option('large_crop', 0);

if ( ! isset( $content_width ) )
	$content_width = 1800;



function addGlobal(){
	?>
    <script>
		//Global variables
		template_directory = "<?php echo get_template_directory_uri() ?>";
		adminAjax = "<?php echo get_site_url(); ?>/wp-admin/admin-ajax.php";
	</script>				
	<?php
}
add_action('wp_head', 'addGlobal');
add_action('admin_head', 'addGlobal');

add_theme_support( 'automatic-feed-links' );




/*
 *     UTILS
 */
require_once( get_template_directory() . '/plusquare_admin/php/utils.php' );


/*
 *     FRONTEND
 */
require_once( get_template_directory() . '/plusquare_admin/config-frontend/frontend.php' );



/*
 *     BACKEND
 */
require_once( get_template_directory() . '/plusquare_admin/config-backend/backend.php' );



/*
 *     SHORTCODES
 */
require_once( get_template_directory() . '/plusquare_admin/config-shortcodes/shortcodes.php' );



/*
 *     TEMPLATE CUSTOMIZER
 */
require_once( get_template_directory() . '/plusquare_admin/config-templatecustomizer/template_customizer.php' );



/*
 *     PORTFOLIO CMS
 */
require_once( get_template_directory() . '/plusquare_admin/config-pages/portfolio_admin.php' );



/*
 *     PAGES ADMIN
 */
require_once( get_template_directory() . '/plusquare_admin/config-pages/pages_admin.php' );



/*
 *     POSTS ADMIN
 */
require_once( get_template_directory() . '/plusquare_admin/config-pages/posts_admin.php' );



/*
 *     GALLERY CMS
 */
require_once( get_template_directory() . '/plusquare_admin/config-pages/gallery_admin.php' );



/*
 *     SLIDER CMS
 */
require_once( get_template_directory() . '/plusquare_admin/config-pages/slider_admin.php' );



/*
 *     ENQUEUES
 */
require_once( get_template_directory() . '/plusquare_admin/config-frontend/enqueues.php' );


