<?php




/**
 * Enqueues
 */
function plusquare_admin_enqueue_scripts($hook) {
  if(WP_DEBUG)fb::log($hook);
  if($hook != "toplevel_page_template_customizer" && $hook != "post-new.php" && $hook != "post.php" && $hook != "edit.php")
    return;

  global $pq_shortname;

  //Media Uploader Scripts
  wp_enqueue_media();

  //Google fonts
  $google_fonts = get_google_fonts_link();
  if($google_fonts != null){
    wp_enqueue_style( $pq_shortname.'_google_fonts', $google_fonts );
  }

  // Admin fonts
  wp_enqueue_style( $pq_shortname.'_admin_fonts', get_stylesheet_directory_uri().'/plusquare_admin/config-backend/css/fonts/stylesheet.css' );
  
  // Font Awesome
  wp_enqueue_style( $pq_shortname.'_admin_fontawesome',  get_stylesheet_directory_uri().'/css/font_awesome/font-awesome.min.css' );

  // Meta options custom styles
  wp_enqueue_style( $pq_shortname.'_backend_css', get_stylesheet_directory_uri().'/plusquare_admin/config-backend/css/backend.css' );


  wp_enqueue_script( 'pq-utils',  get_stylesheet_directory_uri() . '/plusquare_admin/config-backend/js/utils/utils.js', array('jquery'), false, false);
  wp_enqueue_script( 'metabox-js',  get_stylesheet_directory_uri() . '/plusquare_admin/config-backend/js/Backend-built.js', array('jquery', 'pq-utils'), false, false);

  //Template customizer javascript
  wp_enqueue_script( 'tc-js', get_stylesheet_directory_uri() . '/plusquare_admin/config-backend/js/ui/TemplateCustomizer.js');


}
add_action( 'admin_enqueue_scripts', 'plusquare_admin_enqueue_scripts' );
