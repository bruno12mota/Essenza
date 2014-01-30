<?php




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
                  $categories = get_the_category_bytax($post->ID, $taxonomy);
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




/*
*  Import dummy content for ajax
*
*  @description: Is called by javascript to load dummy content (sql)
*  @created: 03/01/13
*/
add_action( 'wp_ajax_nopriv_pq_import_dummy', 'pq_import_dummy_fun' );
add_action( 'wp_ajax_pq_import_dummy', 'pq_import_dummy_fun' );
function pq_import_dummy_fun() {
   $folder = $_POST['folder'];

	// get the submitted parameters
	$sql_file = get_template_directory_uri()."/plusquare_admin/dummy/".$folder."/content.sql";

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

    if($wpdb->query($sql) == FALSE)
     fb::log("ERROR ON QUERY:". $wpdb->last_error);
	}

	exit;
}

add_action( 'wp_ajax_nopriv_pq_import_dummy_images', 'pq_import_dummy_images_fun' );
add_action( 'wp_ajax_pq_import_dummy_images', 'pq_import_dummy_images_fun' );
function pq_import_dummy_images_fun() {
   $folder = $_POST['folder'];

   //Uploads
   //$zip_path = get_template_directory_uri()."/plusquare_admin/dummy/light_images.zip";
   $zip_path = "../wp-content/themes/essenza/plusquare_admin/dummy/".$folder."/media.zip";
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

   echo $message;

   exit;
}

add_action( 'wp_ajax_nopriv_pq_import_options', 'pq_import_options_fun' );
add_action( 'wp_ajax_pq_import_options', 'pq_import_options_fun' );
function pq_import_options_fun() {
   $folder = $_POST['folder'];

  // get the submitted parameters
  $sql_file = get_template_directory_uri()."/plusquare_admin/dummy/".$folder."/options.sql";

  $sql_query = curlFetchData($sql_file);
  $sql_query = remove_comments($sql_query);
  $sql_query = remove_remarks($sql_query);
  $sql_query = split_sql_file($sql_query, ';');

   //get siteurl
   $siteurl = get_option("siteurl");

  global $wpdb;
  foreach($sql_query as $sql){
    $sql = str_replace('`wp_options`', $wpdb->options , $sql);

    if($wpdb->query($sql) == FALSE)
     fb::log("ERROR ON QUERY Options-> ". $wpdb->last_error);
  }

  exit;
}

add_action( 'wp_ajax_nopriv_pq_import_dummy_css', 'pq_import_dummy_css_fun' );
add_action( 'wp_ajax_pq_import_dummy_css', 'pq_import_dummy_css_fun' );
function pq_import_dummy_css_fun() {
   $folder = $_POST['folder'];

   //Uploads
   //$zip_path = get_template_directory_uri()."/plusquare_admin/dummy/light_images.zip";
   $zip_path = "../wp-content/themes/essenza/plusquare_admin/dummy/".$folder."/css.zip";
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

add_action( 'wp_ajax_nopriv_pq_import_dummy_perma', 'pq_import_dummy_perma_fun' );
add_action( 'wp_ajax_pq_import_dummy_perma', 'pq_import_dummy_perma_fun' );
function pq_import_dummy_perma_fun() {
   global $wp_rewrite;
   $wp_rewrite->set_permalink_structure( '/%postname%/' );
   $wp_rewrite->flush_rules();

   exit;
}


//
// remove_comments will strip the sql comment lines out of an uploaded sql file
// specifically for mssql and postgres type files in the install....
//
function remove_comments(&$output)
{
   $lines = explode("\n", $output);
   $output = "";

   // try to keep mem. use down
   $linecount = count($lines);

   $in_comment = false;
   for($i = 0; $i < $linecount; $i++)
   {
      if( preg_match("/^\/\*/", preg_quote($lines[$i])) )
      {
         $in_comment = true;
      }

      if( !$in_comment )
      {
         $output .= $lines[$i] . "\n";
      }

      if( preg_match("/\*\/$/", preg_quote($lines[$i])) )
      {
         $in_comment = false;
      }
   }

   unset($lines);
   return $output;
}


//
// remove_remarks will strip the sql comment lines out of an uploaded sql file
//
function remove_remarks($sql)
{
   $lines = explode("\n", $sql);

   // try to keep mem. use down
   $sql = "";

   $linecount = count($lines);
   $output = "";

   for ($i = 0; $i < $linecount; $i++)
   {
      if (($i != ($linecount - 1)) || (strlen($lines[$i]) > 0))
      {
         if (isset($lines[$i][0]) && $lines[$i][0] != "#")
         {
            $output .= $lines[$i] . "\n";
         }
         else
         {
            $output .= "\n";
         }
         // Trading a bit of speed for lower mem. use here.
         $lines[$i] = "";
      }
   }

   return $output;

}

//
// split_sql_file will split an uploaded sql file into single sql statements.
// Note: expects trim() to have already been run on $sql.
//
function split_sql_file($sql, $delimiter)
{
   // Split up our string into "possible" SQL statements.
   $tokens = explode($delimiter, $sql);

   // try to save mem.
   $sql = "";
   $output = array();

   // we don't actually care about the matches preg gives us.
   $matches = array();

   // this is faster than calling count($oktens) every time thru the loop.
   $token_count = count($tokens);
   for ($i = 0; $i < $token_count; $i++)
   {
      // Don't wanna add an empty string as the last thing in the array.
      if (($i != ($token_count - 1)) || (strlen($tokens[$i] > 0)))
      {
         // This is the total number of single quotes in the token.
         $total_quotes = preg_match_all("/'/", $tokens[$i], $matches);
         // Counts single quotes that are preceded by an odd number of backslashes,
         // which means they're escaped quotes.
         $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$i], $matches);

         $unescaped_quotes = $total_quotes - $escaped_quotes;

         // If the number of unescaped quotes is even, then the delimiter did NOT occur inside a string literal.
         if (($unescaped_quotes % 2) == 0)
         {
            // It's a complete sql statement.
            $output[] = $tokens[$i];
            // save memory.
            $tokens[$i] = "";
         }
         else
         {
            // incomplete sql statement. keep adding tokens until we have a complete one.
            // $temp will hold what we have so far.
            $temp = $tokens[$i] . $delimiter;
            // save memory..
            $tokens[$i] = "";

            // Do we have a complete statement yet?
            $complete_stmt = false;

            for ($j = $i + 1; (!$complete_stmt && ($j < $token_count)); $j++)
            {
               // This is the total number of single quotes in the token.
               $total_quotes = preg_match_all("/'/", $tokens[$j], $matches);
               // Counts single quotes that are preceded by an odd number of backslashes,
               // which means they're escaped quotes.
               $escaped_quotes = preg_match_all("/(?<!\\\\)(\\\\\\\\)*\\\\'/", $tokens[$j], $matches);

               $unescaped_quotes = $total_quotes - $escaped_quotes;

               if (($unescaped_quotes % 2) == 1)
               {
                  // odd number of unescaped quotes. In combination with the previous incomplete
                  // statement(s), we now have a complete statement. (2 odds always make an even)
                  $output[] = $temp . $tokens[$j];

                  // save memory.
                  $tokens[$j] = "";
                  $temp = "";

                  // exit the loop.
                  $complete_stmt = true;
                  // make sure the outer loop continues at the right point.
                  $i = $j;
               }
               else
               {
                  // even number of unescaped quotes. We still don't have a complete statement.
                  // (1 odd and 1 even always make an odd)
                  $temp .= $tokens[$j] . $delimiter;
                  // save memory.
                  $tokens[$j] = "";
               }

            } // for..
         } // else
      }
   }

   return $output;
}




//Fonts
function get_google_fonts_link(){
   global $pq_shortname;
   
   $fontsJsonStr = get_option($pq_shortname."_google_fonts");
   //fb::log($pq_shortname);
   //fb::log($fontsJsonStr);
   $fontsJson = json_decode($fontsJsonStr);
    $protocol = is_ssl() ? 'https' : 'http';
   
   if($fontsJsonStr != FALSE){
      $link = "$protocol://fonts.googleapis.com/css?family=";
   
      $mainCount = 0;
      foreach($fontsJson->items as $item){
         if($mainCount != 0)
            $link = $link."|";
         
         //Font family name
         $fontName = $item->family; 
         $fontName = str_replace("_", "+", $fontName);
         
         $link = $link.$fontName.":";
         
         //Variants
         $count = 0;
         foreach($item->variants as $variant){
            if($count != 0)
               $link = $link.",";
            
            //Add variant
            $link = $link.$variant; 
            
            $count++;
         }
         
         $mainCount++;
      }
      
      //return $link."&subset=cyrillic-ext,latin,cyrillic";
      return $link;
   }

   return null;
}


function get_google_fonts_list(){
    global $pq_shortname;
   
    $fontsJsonStr = get_option($pq_shortname."_google_fonts");
    $fontsJson = json_decode($fontsJsonStr);

    if($fontsJsonStr != FALSE){
        $mainCount = 0;
        $list = "[";
        foreach($fontsJson->items as $item){
            fb::log($item);

            $fontName = $item->family; 
            $fontName = str_replace("_", " ", $fontName);

            if($mainCount != 0)
               $list .= ",";

            $count = 0;
            foreach($item->variants as $variant){
                $variant = (string)$variant;
                if($count != 0)
                   $list .= ",";

                $list .= "{name: '".$fontName." (".$variant.")', element: 'span', styles : { ";
                
                //Font family
                $list .= "'font-family': '\"".$fontName."\"',";

                //Weight and style
                $num = strpos($variant, "italic");
                $weight = "400";
                $style = "normal";
                if($num === false){
                    if($variant == "regular")
                        $weight = "400";
                    else
                        $weight = $variant;

                    $style = "normal";
                }
                else if($num == 0){
                    $weight = "400";
                    $style = "italic";
                }
                else{
                    $weight = substr($variant, -$num);
                    $style = "italic";
                }
                $list .= "'font-weight': '".$weight."',";
                $list .= "'font-style': '".$style."'";

                //Close styles
                $list .= "}"; 

                //Close element
                $list .= "}"; 
                
                $count++;
             }
       
            $mainCount ++;
        }

        return $list."]";
    }

    return "[]";
}



function getGoogleFontObject($font){
   $obj = array();
   
   $parts = explode (":", $font, 2);

   $fontFamily = isset($parts[0]) ? $parts[0] : "Arial";
   $weight = isset($parts[1]) ? $parts[1] : "regular" ;

   $obj["font"] = str_replace("_", " ", $fontFamily);
   
   //weight
   $num = strpos($weight, "italic");
   
   if($num === false){
      if($weight == "regular")
         $obj["weight"] = "400";
      else
         $obj["weight"] = $weight;
      $obj["style"] = "normal";
   }
   else if($num == 0){
      $obj["weight"] = "400";
      $obj["style"] = "italic";
   }
   else{
      $obj["weight"] = substr($weight, 0, $num);
      $obj["style"] = "italic";

      console.log("Weight: "+$obj["weight"]);
   }
   
   return $obj;
}
function getFontCss($font){
   $obj = getGoogleFontObject($font);
   
   return "font-family:".$obj["font"]."; font-weight:".$obj["weight"].";";
}




/*
*  Update multiple posts meta with ajax
*
*  @description: Make custom function to update posts meta values with ajax
*  @created: 03/01/13
*/
add_action( 'wp_ajax_ajax_update_posts_meta', 'ajax_update_posts_meta_stuff' ); // ajax for logged in users
add_action( 'wp_ajax_nopriv_ajax_update_posts_meta', 'ajax_update_posts_meta_stuff' ); // ajax for not logged in users
function ajax_update_posts_meta_stuff() {
	$values = $_POST['values']; // getting variables from ajax post
	$key = $_POST['key']; // getting variables from ajax post
	
	$values = ereg_replace("[\]" ,"", $values );
	$valuesJson = json_decode($values);
	
	foreach($valuesJson as $post_id => $value){
		//fb::log($post_id.":".$value.":".$key);
		update_post_meta(strval($post_id), $key, strval($value));
	}
	
	/*if($result)
		echo 'ajax submitted with positive result';
	else
		echo 'ajax submitted with negative result';*/
	exit; // stop executing script
}

//Prevent user from rich editing
add_filter ( 'user_can_richedit' , create_function ( '$a' , 'return false;' ) , 50 );

//if ( function_exists('register_sidebar') )
//register_sidebar();

function my_function_admin_bar(){
	return false;
}
add_filter( "show_admin_bar" , "my_function_admin_bar");




//Add Support for Navigation Menus
add_theme_support( 'menus' );
if(function_exists('register_nav_menu')){
	register_nav_menu( 'primary_nav', 'Primary Navigation');
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