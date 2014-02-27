<?php



//Shortcodes
require_once( 'config-shortcodes/shortcodes.php' );


//Page types
require_once( 'config-pages/pages.php' );


//Shortcodes
require_once( 'php/resize.php' );


//Utils
require_once( 'php/utils.php' );


//Wordpress
require_once( 'php/wordpress.php' );


//Wordpress
require_once( 'php/google_fonts.php' );




//Add global javascript variables
function addGlobal(){
   ?>
    <script>
      //Global variables
      template_directory = "<?php echo get_template_directory_uri() ?>";
      adminAjax = "<?php echo get_site_url(); ?>/wp-admin/admin-ajax.php";
      WP_DEBUG = <?php echo WP_DEBUG ? "true" : "false"; ?>;
   </script>            
   <?php
}
add_action('wp_head', 'addGlobal');
add_action('admin_head', 'addGlobal');


//Automatic feed links
add_theme_support( 'automatic-feed-links' );



//Remove wordpress admin bar
function my_function_admin_bar(){
  return false;
}
add_filter( "show_admin_bar" , "my_function_admin_bar");


//Add Support for Navigation Menus
add_theme_support( 'menus' );
if(function_exists('register_nav_menu')){
  register_nav_menu( 'primary_nav', 'Primary Navigation');
}




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



/*
 *
 *  Default Avatar
 *
 *  @description: Sets the default avatar
 *
 */
add_filter( 'avatar_defaults', 'new_default_avatar' );
function new_default_avatar ( $avatar_defaults ) {
    //Set the URL where the image file for your avatar is located
    $new_avatar_url = 'http://pt.gravatar.com/userimage/40519953/0921295dde73766afe618d0da03491ba.png?size=200';
    //Set the text that will appear to the right of your avatar in Settings>>Discussion
    $avatar_defaults[$new_avatar_url] = 'Essenza Default Avatar';
    return $avatar_defaults;
}