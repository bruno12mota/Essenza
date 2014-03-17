<?php



/*
 *     Ajax helping functions
 */
require_once( 'ajax/functions.php' );




/*
 *
 *	Page Builder Ajax Functions
 *
 *  @description: Ajax functions used by the page builder
 *
 */

// Save Page Template
add_action( 'wp_ajax_nopriv_pq_save_page_template', 'pq_save_page_template_fun' );
add_action( 'wp_ajax_pq_save_page_template', 'pq_save_page_template_fun' );
function pq_save_page_template_fun(){
	$title = $_POST['title'];
	$content = $_POST['content'];

	//Get saved pages
	$saved_pages = get_option("esza_saved_pages_builder");

	if($saved_pages === FALSE){
		$new_item = sprintf('{"%s":"%s"}', $title, $content);
		update_option("esza_saved_pages_builder", $new_item);
	}
	else{
		$saved_pages = json_decode($saved_pages);
		$saved_pages->$title = str_replace('\"', '"', $content);
		update_option("esza_saved_pages_builder", json_encode($saved_pages));
	}

	exit;
}

// Remove Saved Page Template
add_action( 'wp_ajax_nopriv_pq_remove_page_template', 'pq_remove_page_template_fun' );
add_action( 'wp_ajax_pq_remove_page_template', 'pq_remove_page_template_fun' );
function pq_remove_page_template_fun(){
  $title = $_POST['title'];

  //Get saved pages
  $saved_pages = get_option("esza_saved_pages_builder");

  if($saved_pages !== FALSE){
    $saved_pages = json_decode($saved_pages);
    unset($saved_pages->$title);
    update_option("esza_saved_pages_builder", json_encode($saved_pages));
  }

  exit;
}

//Get shortcode options
add_action( 'wp_ajax_nopriv_pq_get_shortcode_options', 'pq_get_shortcode_options_fun' );
add_action( 'wp_ajax_pq_get_shortcode_options', 'pq_get_shortcode_options_fun' );
function pq_get_shortcode_options_fun() {
	global $essenza_shortcodes_options;
  global $essenza_column_options;
	
	// get the submitted parameters
	$shortcodeId = $_POST['shortcode'];	
	
	//Get shortcode parameters
  if($shortcodeId == 'column'){
      $shortcode = $essenza_column_options;
  }
  else{
     $shortcode = $essenza_shortcodes_options[$shortcodeId];
  }
	
	// response output
	foreach ( $shortcode["options"] as $option) {
		//Make option
		make_option($option);
	}

	exit;
}

//Get attachment
add_action( 'wp_ajax_nopriv_pq_get_add_element', 'pq_get_add_element_fun' );
add_action( 'wp_ajax_pq_get_add_element', 'pq_get_add_element_fun' );
function pq_get_add_element_fun() {
	$newElementLightbox = array(
		"label" => "Add slide Elements",
		"type" => "tabs",
		"id" => "new_slide_element",
		"options" => array("Image", "Text", "Button"),
		"values" => array("image", "text", "button"),
		"default" => "image",
		"tabs" => array(
			//Image type
			"image" => array(
				array(
					"label" => "Image Element",
					"id" => "slide_element_id",
					"type" => "media_single_picker",
					"width" => 300,
					"height" => 200,
					"info" => "Pick an image for the element you want to create, when you submit it will appear on the canvas as soon as it loads."
				)
			),
			
			//Text type
			"text" => array(
				//Text Block Picker
				array(
					"label" => "Text Block",
					"id" => "slide_text_picker",
					"type" => "text_block_picker",
					"info" => "Build a text block, when you submit it will appear on the canvas."
				)
			),
			
			//Button type
			"button" => array(
				//Button Picker
				array(
					"label" => "Buttons",
					"id" => "slide_button_picker",
					"type" => "button_picker",
					"info" => "Build a button block, when you submit it will appear on the canvas."
				)
			)
		)
	);
	
	make_option($newElementLightbox, "none");

	exit;
}







/*
 *
 *  Admin Elements Options
 *
 *  @description: Functions called by admin elements
 *
 */

//Get New/Edit Color options
add_action( 'wp_ajax_nopriv_pq_get_color_options', 'pq_get_color_options_fun' );
add_action( 'wp_ajax_pq_get_color_options', 'pq_get_color_options_fun' );
function pq_get_color_options_fun() {
  $plusquare_color_options = array(
    array(
      "label" => "Color Title",
      "id" => "pq_color_option_title",
      "info" => "This will be the indication that will appear on the color pickers accross the admin area",
      "type" => "text"
    ),
    array(
      "label" => "Color",
      "id" => "pq_color_option_color",
      "type" => "color_picker"
    )
  );
  
  // response output
  foreach ( $plusquare_color_options as $option) {
    //Make option
    make_option($option);
  }

  exit;
}


//Get New/Edit Contact field options
add_action( 'wp_ajax_pq_get_contact_field_options', 'pq_get_contact_field_options_fun' );
function pq_get_contact_field_options_fun(){
  $type = isset($_POST['type']) ? $_POST['type'] : "text";
  $required = isset($_POST['required']) ? $_POST['required'] : "true";
  $label = isset($_POST['label']) ? $_POST['label'] : "";
  $combobox = isset($_POST['combobox']) ? $_POST['combobox'] : "";

  $plusquare_color_options = array(
    array(
      "label" => "Field Type",
      "id" => "pq_field_option_type",
      "info" => "The type of field you want this option to be.",
      "type" => "combobox",
      "options" => array("Text", "Name", "Email", "Subject", "Textarea", "Checkbox", "Combobox"),
      "values" => array("text", "name", "email", "subject", "textarea", "checkbox", "combobox"),
      "default" => $type
    ),
    array(
      "label" => "Required Field",
      "id" => "pq_field_option_required",
      "help" => "Check if you want this fiel to be required to fill by your users.",
      "type" => "checkbox",
      "values" => array("false", "true"),
      "default" => $required
    ),
    array(
      "label" => "Field Label",
      "id" => "pq_field_option_label",
      "info" => "The text that describes the option.",
      "type" => "text",
      "default" => $label
    ),
    array(
      "label" => "Combobox Options",
      "id" => "pq_field_option_combobox",
      "alert" => "This option is for combobox field type only.",
      "type" => "combobox_options",
      "default" => $combobox
    )
  );
  
  // response output
  foreach ( $plusquare_color_options as $option) {
    //Make option
    make_option($option);
  }

  exit;
}

//Get New/Edit Color options
add_action( 'wp_ajax_nopriv_pq_get_pages_posts', 'pq_get_pages_posts_fun' );
add_action( 'wp_ajax_pq_get_pages_posts', 'pq_get_pages_posts_fun' );
function pq_get_pages_posts_fun() {
  $option = array(
      "label" => "Pages and Posts",
      "id" => "pq_pages_posts_picker",
      "type" => "pages_posts_picker",
      "info" => "We recommend you select a page type, selecting a post of other type will make the url of your homepage redirect to the choosen post.",
      "alert" => "For fullscreen sliders you need to create a page and select the slider template and choose the slider you want in the options, then it'll show up for you to choose here."
  );
  
  //Make option
  make_option($option);
  
  exit;
}

//Get Post/Pages List
add_action( 'wp_ajax_nopriv_pq_get_pages_posts_list', 'pq_get_pages_posts_list_fun' );
add_action( 'wp_ajax_pq_get_pages_posts_list', 'pq_get_pages_posts_list_fun' );
function pq_get_pages_posts_list_fun() {
  $post_type = $_POST['post_type'];

  $query = new WP_Query( array( 'post_type' => $post_type, 'nopaging' => true ) );
  
  while ( $query->have_posts() ) {
    $query->the_post();
    echo '<a href="#" data-id="'. get_the_ID() .'">' . get_the_title() . '</a>';
  }

  exit;
}







/*
 *
 *	Import Dummy Content
 *
 *  @description: Functions called to load dummy content/options in the template customizer
 *
 */

// Import and run sql
add_action( 'wp_ajax_nopriv_pq_import_dummy', 'pq_import_dummy_fun' );
add_action( 'wp_ajax_pq_import_dummy', 'pq_import_dummy_fun' );
function pq_import_dummy_fun() {
   $folder = $_POST['folder'];

	// get the submitted parameters
	//$sql_file = get_template_directory_uri()."/plusquare_admin/config-backend/dummy/".$folder."/content.sql";

  $sql_file = "http://plusquare.pt/Essenza_images/dummy/".$folder."/content.sql";

	$sql_query = curlFetchData($sql_file);
	$sql_query = remove_comments($sql_query);
	$sql_query = remove_remarks($sql_query);
	$sql_query = split_sql_file($sql_query, ';');

   //get siteurl
   $siteurl = get_option("siteurl")."/";

	global $wpdb;
	foreach($sql_query as $sql){
    $sql = str_replace('replace_with_url', $siteurl, $sql);

    $sql = str_replace('`wp_posts`', $wpdb->posts , $sql);
    $sql = str_replace('`wp_postmeta`', $wpdb->postmeta , $sql);
    $sql = str_replace('`wp_terms`', $wpdb->terms , $sql);
    $sql = str_replace('`wp_term_taxonomy`', $wpdb->term_taxonomy , $sql);
    $sql = str_replace('`wp_term_relationships`', $wpdb->term_relationships  , $sql);

    if($wpdb->query($sql) == FALSE){
      if(WP_DEBUG)fb::log("ERROR ON QUERY:". $wpdb->last_error);
    }
	}

	exit;
}



// Move images
add_action( 'wp_ajax_nopriv_pq_import_dummy_images', 'pq_import_dummy_images_fun' );
add_action( 'wp_ajax_pq_import_dummy_images', 'pq_import_dummy_images_fun' );
function pq_import_dummy_images_fun() {
  echo "Loading ...";
  $url = "http://plusquare.pt/Essenza_images/sidebar.zip";

  echo '<div id="progress-bar">';
  echo  '<div id="progress">0%</div>';
  echo '</div>';

  ob_flush();
  flush();

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_PROGRESSFUNCTION, 'progress_import_dummy');
  curl_setopt($ch, CURLOPT_NOPROGRESS, false); // needed to make progress function work
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
  $html = curl_exec($ch);
  curl_close($ch);

  echo "Done";
  ob_flush();
  flush();
  /*$folder = $_POST['folder'];

   //Uploads
   //$zip_path = get_template_directory_uri()."/plusquare_admin/dummy/light_images.zip";
   $zip_path = "../wp-content/themes/essenza/plusquare_admin/config-backend/dummy/".$folder."/media.zip";
   $target_path = "../wp-content/uploads/";

   echo $zip_path;
   echo $target_path;
   
   $zip = new ZipArchive();
   $x = $zip->open($zip_path);

   echo $x;
   if ($x === true) {
      $zip->extractTo($target_path);
      $zip->close();

      $message = "Your .zip file was unpacked.";
   }
   else { 
      $message = "There was a problem with the unpacking. Please try again.";
   }

   echo $message;*/

   exit;
}

// Options sql run
add_action( 'wp_ajax_nopriv_pq_import_options', 'pq_import_options_fun' );
add_action( 'wp_ajax_pq_import_options', 'pq_import_options_fun' );
function pq_import_options_fun() {
   $folder = $_POST['folder'];

  // get the submitted parameters
  //$sql_file = get_template_directory_uri()."/plusquare_admin/config-backend/dummy/".$folder."/options.sql";
  $sql_file = "http://plusquare.pt/Essenza_images/dummy/".$folder."/options.sql";

  $sql_query = curlFetchData($sql_file);
  $sql_query = remove_comments($sql_query);
  $sql_query = remove_remarks($sql_query);
  $sql_query = split_sql_file($sql_query, ';');

   //get siteurl
   $siteurl = get_option("siteurl");

  global $wpdb;
  foreach($sql_query as $sql){
    $sql = str_replace('`wp_options`', $wpdb->options , $sql);

    if($wpdb->query($sql) == FALSE){
     if(WP_DEBUG)fb::log("ERROR ON QUERY Options-> ". $wpdb->last_error);
    }
  }

  exit;
}

//Css Replacement
add_action( 'wp_ajax_nopriv_pq_import_dummy_css', 'pq_import_dummy_css_fun' );
add_action( 'wp_ajax_pq_import_dummy_css', 'pq_import_dummy_css_fun' );
function pq_import_dummy_css_fun() {
   $folder = $_POST['folder'];

   //Uploads
   //$zip_path = get_template_directory_uri()."/plusquare_admin/dummy/light_images.zip";
   //$zip_path = "../wp-content/themes/essenza/plusquare_admin/config-backend/dummy/".$folder."/css.zip";
    $zip_path = "http://plusquare.pt/Essenza_images/dummy/".$folder."/css.zip";
   $target_path = "../wp-content/themes/essenza/css/";

   echo $zip_path;
   echo $target_path;
   
   $zip = new ZipArchive();
   $x = $zip->open($zip_path);

   echo $x;
   if ($x === true) {
      $zip->extractTo($target_path);
      $zip->close();

      $message = "Your .zip file was unpacked.";
   }
   else { 
      $message = "There was a problem with the unpacking. Please try again.";
   }

   echo $message;

   exit;
}

//Update permalink Structure
add_action( 'wp_ajax_nopriv_pq_import_dummy_perma', 'pq_import_dummy_perma_fun' );
add_action( 'wp_ajax_pq_import_dummy_perma', 'pq_import_dummy_perma_fun' );
function pq_import_dummy_perma_fun() {
   global $wp_rewrite;
   $wp_rewrite->set_permalink_structure( '/%postname%/' );
   $wp_rewrite->flush_rules();

   exit;
}







/*
 *
 *  Update multiple posts meta with ajax
 *
 *  @description: Make custom function to update posts meta values with ajax
 *
 */
add_action( 'wp_ajax_ajax_update_posts_meta', 'ajax_update_posts_meta_stuff' ); // ajax for logged in users
add_action( 'wp_ajax_nopriv_ajax_update_posts_meta', 'ajax_update_posts_meta_stuff' ); // ajax for not logged in users
function ajax_update_posts_meta_stuff() {
	$values = $_POST['values']; // getting variables from ajax post
	$key = $_POST['key']; // getting variables from ajax post
	
	$values = ereg_replace("[\]" ,"", $values );
	$valuesJson = json_decode($values);
	
	foreach($valuesJson as $post_id => $value){
		update_post_meta(strval($post_id), $key, strval($value));
	}

	exit;
}


/*
*  Update post meta with ajax
*
*  @description: Make custom function to update post meta values with ajax
*  @created: 03/01/13
*/
add_action( 'wp_ajax_ajax_update_meta', 'ajax_update_meta_stuff' ); // ajax for logged in users
add_action( 'wp_ajax_nopriv_ajax_update_meta', 'ajax_update_meta_stuff' ); // ajax for not logged in users
function ajax_update_meta_stuff() {
  $post_id = $_POST['post_id']; // getting variables from ajax post
  $value = $_POST['value']; // getting variables from ajax post
  $key = $_POST['key']; // getting variables from ajax post
  
  $result = update_post_meta($post_id, $key, $value);
  
  if($result)
    echo 'ajax submitted with positive result';
  else
    echo 'ajax submitted with negative result';

  exit;
}





/*
 *
 *  Make custom posts grid view
 *
 *  @description: makes a grid view of a gallery/portfolio post type
 *
 */
add_action( 'wp_ajax_nopriv_pq_custom_grid_listing', 'pq_custom_grid_listing_fun' );
add_action( 'wp_ajax_pq_custom_grid_listing', 'pq_custom_grid_listing_fun' );
function pq_custom_grid_listing_fun(){
  $type = $_POST['type'];
  $image_meta = $_POST['image_meta'];

   $posts = new WP_Query( array(    'post_type' => $type, 
                           'post_status' => array('publish', 'draft', 'pending', 'future', 'private', 'inherit', 'auto-draft'),
                           'orderby' => 'meta_value_num', 
                           'meta_key' => 'position',
                           'order' => 'ASC',
                           'nopaging'=> true ));
   ?>
    
   <div style="margin-top: 10px; overflow:hidden;">
       <h2 class="pq_style" style="float:left; padding-right:20px; margin:0; float:left; ">Current items</h2>
       <div class="save_grid" style="overflow:hidden;">
           <a href="#" class="pq_style save_button" style="float:left;" onclick="return false;">Click to save grid order</a>
           <p class="loading-gif loading_status" style="display:none; color:#AAAAAA; margin:0;">Saving <?php echo $type; ?> items grid, closing the window now might prevent your changes from saving!</p>
       </div>
   </div>
   <div id="queryContainer" style="clear:both;margin-top:20px;position:relative;">
       <?php if($posts->have_posts()): 
         while($posts->have_posts()):  $posts->the_post();  global $post; ?>

            <div class="item" rel="<?php echo $post->ID; ?>">
               <div class="item-inner">
                     <div class="img">
                        <?php 
                        echo wp_get_attachment_image( get_post_meta($post->ID, $image_meta, true), "thumbnail" ); 
                        ?>
                           <div class="dragArea"></div>
                           <div class="buttons">
                               <a class="edit" target="_blank" href="<?php echo get_edit_post_link( $post->ID ); ?>"></a>
                               <a class="trash" href="<?php echo get_delete_post_link( $post->ID ); ?> "></a>
                           </div>
                       </div>
                     <div class="title"><?php the_title(); ?></div >
                       
                       <?php
                  $status = get_post_status( $post->ID );
                  
                  $taxonomy = "category";
                  if($type == "portfolio")
                     $taxonomy = "portfolio_category";
                  else if($type == "gallery")
                     $taxonomy = "galleries";
                  $categories = plusquare_get_the_category_bytax($post->ID, $taxonomy);
                  if(count($categories) == 0)
                     $status = "Uncategorized";
                  
                  if( $status == "publish" || $status == "private"){
                     echo "<div class='sub online'>".($status == "publish" ? "published" : $status)."</div>";  
                  }
                  else{
                     echo "<div class='sub offline'>".$status."</div>"; 
                  }
                  ?>
                  </div>
               </div>
         <?php endwhile; ?>
       <?php endif; 
      // Restore original Query & Post Data
      wp_reset_query();
      wp_reset_postdata();?>
   </div>

   <?php          
      $trash = new WP_Query( array( 'post_type' => $type, 
                           'post_status' => array('trash'),
                           'nopaging'=> true,
                           'orderby' => 'modified' ));
   ?>

   <div class="clear"></div>

   <h2 class="pq_style" style="color: #9b9a9b;">Trashed items</h2>
   <?php 
   if($trash->have_posts()){
       ?>
      <a class="pq_style" href="#" id="toogleTrash">Click to view trashed items</a>
       <?php
   }
   else{
      ?>
      <p>There are no items in the trash bin!</p>
       <?php
   }
   ?>
   <div id="queryTrashContainer" class="items-grid-holder">
       <div class="items-grid">
           <?php if($trash->have_posts()): 
               while($trash->have_posts()):  $trash->the_post();   global $post;?>
                   <div class="item">
                       <div class="item-inner">
                           <div class="img">
                               <?php echo wp_get_attachment_image( get_post_meta($post->ID, $image_meta, true), "thumbnail" ); ?>
                               <div class="buttons">
                                   <a class="restore" href="<?php echo wp_nonce_url( home_url() . "/wp-admin/post.php?action=untrash&amp;post=" . $post->ID, 'untrash-post_' . $post->ID) ?>"></a>
                                   <a class="remove" href="<?php echo wp_nonce_url( home_url() . "/wp-admin/post.php?action=delete&amp;post=" . $post->ID, 'delete-post_' . $post->ID) ?>"></a>
                               </div>
                           </div>
                           <div class="title"><?php the_title(); ?></div >
                           
                           <?php
                           $status = get_post_status( $post->ID );
                           if( $status == "publish" || $status == "private"){
                               echo "<div class='sub online'>".$status."</div>"; 
                           }
                           else{
                               echo "<div class='sub offline'>".$status."</div>";   
                           }
                           ?>
                       </div>
                   </div>
               <?php endwhile; ?>
           <?php endif; 
           // Restore original Query & Post Data
           wp_reset_query();
           wp_reset_postdata();?>
       </div>
   </div>
   <?php

  exit;
}