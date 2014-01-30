<?php

function curl_exec_follow($ch, &$maxredirect = null) {
  
  // we emulate a browser here since some websites detect
  // us as a bot and don't let us do our job
  $user_agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5)".
                " Gecko/20041107 Firefox/1.0";
  curl_setopt($ch, CURLOPT_USERAGENT, $user_agent );

  $mr = $maxredirect === null ? 5 : intval($maxredirect);

  if (ini_get('open_basedir') == '' && ini_get('safe_mode') == 'Off') {

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, $mr > 0);
    curl_setopt($ch, CURLOPT_MAXREDIRS, $mr);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

  } else {
    
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

    if ($mr > 0)
    {
      $original_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
      $newurl = $original_url;
      
      $rch = curl_copy_handle($ch);
      
      curl_setopt($rch, CURLOPT_HEADER, true);
      curl_setopt($rch, CURLOPT_NOBODY, true);
      curl_setopt($rch, CURLOPT_FORBID_REUSE, false);
      do
      {
        curl_setopt($rch, CURLOPT_URL, $newurl);
        $header = curl_exec($rch);
        if (curl_errno($rch)) {
          $code = 0;
        } else {
          $code = curl_getinfo($rch, CURLINFO_HTTP_CODE);
          if ($code == 301 || $code == 302) {
            preg_match('/Location:(.*?)\n/', $header, $matches);
            $newurl = trim(array_pop($matches));
            
            // if no scheme is present then the new url is a
            // relative path and thus needs some extra care
            if(!preg_match("/^https?:/i", $newurl)){
              $newurl = $original_url . $newurl;
            }   
          } else {
            $code = 0;
          }
        }
      } while ($code && --$mr);
      
      curl_close($rch);
      
      if (!$mr)
      {
        if ($maxredirect === null)
        trigger_error('Too many redirects.', E_USER_WARNING);
        else
        $maxredirect = 0;
        
        return false;
      }
      curl_setopt($ch, CURLOPT_URL, $newurl);
    }
  }
  return curl_exec($ch);
}


/*
 *     Filter Menu
 */
require_once( get_template_directory() . '/plusquare_admin/config-frontend/php/filter.php' );

/*
 *     Posts
 */
require_once( get_template_directory() . '/plusquare_admin/config-frontend/php/posts.php' );



function getCategoriesAssociatedStr($categories, $option = "portfolio_category"){
	$parents = array();
	foreach($categories as $category){
		//push current
		array_push($parents, $category->term_id);
		
		//push all parents
		if($category->parent != 0){
			$term = $category;
			do{
				//Get parent
				$term = get_term( $term->parent, $option );
				array_push($parents, $term->term_id);
			}while($term->parent != 0);
		}
	}
	
	$parentsStr = "";
	foreach($parents as $index=>$parent){
		if($index != 0)
			$parentsStr .= ",";
		
		$parentsStr .= $parent;
	}	
	return $parentsStr;
}




/*
 *	Gets the categories of a taxonomy
 */
function get_the_category_bytax( $id = false, $tcat = 'category' ) {
    $categories = get_the_terms( $id, $tcat );
    if ( ! $categories )
        $categories = array();
		
    $categories = array_values( $categories );

    foreach ( array_keys( $categories ) as $key ) {
        _make_cat_compat( $categories[$key] );
    }
	
    // Filter name is plural because we return alot of categories (possibly more than #13237) not just one
    return apply_filters( 'get_the_categories', $categories );
}


/*
 *	Get Parent(Back) Page Of a Post
 */
function getPageToBack($template, $categories, $meta_opt){
	$categoriesList = array();
	if($categories)
		foreach($categories as $category) 
			array_push($categoriesList, $category->term_id);
	
	
	$args = array(
		'meta_key' => '_wp_page_template',
    	'meta_value' => $template,
		'post_type' => 'page',
		'post_status' => 'publish'
	); 
	$pages = get_pages($args);
	
	$max = 0;
	$current = NULL;
	foreach($pages as $page){
		$page_categories = get_post_meta($page->ID, $meta_opt, true);
		
		if($page_categories == "all")
			$count = count ( $categoriesList );
		else{
			$page_categories = explode(",", $page_categories);
			$count = count ( array_intersect($categoriesList, $page_categories) );
		}
		
		if ( $count > $max ) {
			$max = $count;
			$current = $page->ID;//get_permalink( $page->ID );
		}
	}
	
	return $current;
}



/*
 *	Get a social video iframe url from type and id
 */
function plusquare_get_page_css(){
	global $post; 
	
	$useSidebar = get_post_meta( $post->ID, "use_sidebar", true ) == "true"; 
	$page_align = get_post_meta($post->ID, "page_align", true);
	$page_width = get_post_meta($post->ID, "page_width", true);

	$rgb = hex2rgb(get_option("esza_pages_color"));

	//Page Background color opacity
	$page_transparent = get_post_meta($post->ID, "page_background_color_transparent", true);
	$page_transparent = intval($page_transparent === "" ? "100" : $page_transparent);

	if($page_width != ""){
		$page_width = intval($page_width);
		if($page_width < 770){
			$page_width = 770;
		}

		if($useSidebar == "true"){
			$page_width += 250;
		}
	}
	else
		$page_width = 770;

	$media_query = $page_width + intval(get_option("esza_site_border_size"))*2 + 100;

	//Fullscreen
	$fullscreen = get_post_meta($post->ID, "page_fullscreen", true);
	$fullscreen = $fullscreen === "" ? "false" : $fullscreen;

	//Margins
	$page_hor_margins = get_post_meta($post->ID, "page_hor_margins", true);
	$page_hor_margins = $page_hor_margins === "" ? "50" : $page_hor_margins;
	$page_top_margin = get_post_meta($post->ID, "page_top_margin", true);
	$page_top_margin = $page_top_margin === "" ? "50" : $page_top_margin;
	$page_bottom_margin = get_post_meta($post->ID, "page_bottom_margin", true);
	$page_bottom_margin = $page_bottom_margin === "" ? "50" : $page_bottom_margin;

	?>
	<style>
	    #page_<?php echo $post->ID; ?>{
			width: auto;    
			max-width: none;
			<?php 
			if($page_align != "center"){
				?>
				margin-left: <?php echo $page_hor_margins; ?>px;
				margin-right: <?php echo $page_hor_margins; ?>px;
				<?php 
			} 
			?>   
			margin-top: <?php echo $page_top_margin; ?>px;    
			margin-bottom: <?php echo $page_bottom_margin; ?>px;     
	    }
	    <?php
	      if($fullscreen != "true"){
	        ?>
	        @media screen and (min-width:<?php echo $media_query; ?>px) {
	          #page_<?php echo $post->ID; ?>{
	            width: <?php echo $page_width; ?>px;
	          }
	        }
	      <?php
	      }

	      if($page_transparent != "0"){
	        $IE_color = "#" . dechex ( intval($page_transparent)/100 * 255 ) . dechex ( $rgb[0] ) . dechex ( $rgb[1] ) . dechex ( $rgb[2] );
	        ?>
	        html.no-rgba #page_<?php echo $post->ID; ?> {
	            background: transparent; 
	            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=<?php echo $IE_color; ?>, endColorstr=<?php echo $IE_color; ?>);
	            -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=<?php echo $IE_color; ?>, endColorstr=<?php echo $IE_color; ?>)"; 
	        }
	        html.rgba #page_<?php echo $post->ID; ?> {
	            background: rgba(<?php echo $rgb[0].", ".$rgb[1].", ".$rgb[2].", ".($page_transparent/100) ;?>);   
	        }
	      <?php
	      }
	      else{
	        ?>
	        #page_<?php echo $post->ID; ?> {
	          background: transparent;
	        }
	        <?php
	      }
	    ?>
	  </style>
	<?php
}



/*
 *	Get a social video iframe url from type and id
 */
function getSocialVideoUrl($type, $id, $autoplay = "0"){
	if($type == "vimeo"){
		//Vimeo options
		$options = array(
			"title" => get_option("vimeo_title"),
			"byline" => get_option("vimeo_byline"),
			"portrait" => get_option("vimeo_portrait"),
			"color" => get_option("vimeo_color"),
			"autoplay" => $autoplay
		);
		
		$parameters="";
		$count = 0;
		foreach($options as $key => $value){				
			if($value !== FALSE){
				if($count++ != 0)
					$parameters = $parameters."&";

				if($key == "color")
					$value = substr($value, 1);
				$parameters = $parameters.$key."=".$value;
			}
		}
		
		//Make vimeo iframe
		return 'http://player.vimeo.com/video/'.$id.'?'.$parameters;
	}
	
	
	//YOUTUBE
	else if($type == "youtube"){
		//Youtube options
		$options = array(
			"autohide" => get_option("youtube_autohide"),
			"cc_load_policy" => get_option("youtube_cc_load_policy"),
			"color" => get_option("youtube_color"),
			"theme" => get_option("youtube_theme"),
			"controls" => get_option("youtube_controls"),
			"iv_load_policy" => get_option("youtube_iv_load_policy"),
			"modestbranding" => get_option("youtube_modestbranding"),
			"rel" => get_option("youtube_rel"),
			"autoplay" => $autoplay
		);
		
		//Make youtube iframe
		$parameters="";
		foreach($options as $key => $value){
			if($value !== FALSE)
				$parameters = $parameters."&".$key."=".$value;	
		}
		
		return 'http://www.youtube.com/embed/'.$id.'?wmode=transparent'.$parameters;
	}
	
	
	//DAILYMOTION
	else if($type == "dailymotion"){
		//Vimeo options
		$options = array(
			"foreground" => get_option("dailymotion_foreground"),
			"background" => get_option("dailymotion_background"),
			"highlight" => get_option("dailymotion_highlight"),
			"related" => get_option("dailymotion_related"),
			"logo" => get_option("dailymotion_logo"),
			"info" => get_option("dailymotion_info"),
			"autoplay" => $autoplay
		);
		
		//Make vimeo iframe
		$parameters="";
		$count = 0;
		foreach($options as $key => $value){
			if($count++ != 0)
				$parameters = $parameters."&";
				
			if($value !== FALSE)
				$parameters = $parameters.$key."=".$value;
		}
		return 'http://www.dailymotion.com/embed/video/'.$id.'?'.$parameters;
	}
}

//Get attachment
add_action( 'wp_ajax_nopriv_pq_get_video', 'pq_get_video_fun' );
add_action( 'wp_ajax_pq_get_video', 'pq_get_video_fun' );
function pq_get_video_fun() {
	// get the submitted parameters
	$id = $_POST['id'];	
	$type = $_POST['type'];
	
	echo getSocialVideoUrl($type, $id);

	exit;
}


//Get a music player ur for ajax load
function getMusicPlayerUrl($type, $sound, $title, $artist){
	$str = get_template_directory_uri()."/scripts/music-player.php?type=".$type."&url=".$sound.'&title='.$title.'&artist='.$artist;
	$str = str_replace(" ", "%20", $str);
	$str = str_replace("&", "&#38;", $str);
	$str = str_replace("=", "&#61;", $str);
	return $str;
}



//Get Url Content with curl
function curlFetchData($url){
	if(function_exists('curl_init')){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0); 
        $output = curl_exec($ch);
        echo curl_error($ch);
        curl_close($ch);
        return $output;
    }else{
        return file_get_contents($url);
    }
}


//Get time passed string
function getStringTimePassed($diff){
	//Seconds
	$seconds = $diff;
	
	$str = "";
	if($seconds >= 60){
		//minutes
		$minutes = round($seconds/60);
		if($minutes >= 60){
			//hours
			$hours = round($minutes/60);
			if($hours >= 24){
				//days
				$days = round($hours/24);
				if($days >= 30){
					//months
					$months = round($days/30);
					if($months >= 12){
						//years
						$years = round($months/12);
						
						$str = $years;
						if($years == 1)
							$str .= " year ago";
						else
							$str .= " years ago";
					}
					else{
						$str = $months;
						if($months == 1)
							$str .= " month ago";
						else
							$str .= " months ago";
					}
				}
				else{
					$str = $days;
					if($days == 1)
						$str .= " day ago";
					else
						$str .= " days ago";
				}
			}
			else{
				$str = $hours;
				if($hours == 1)
					$str .= " hour ago";
				else
					$str .= " hours ago";
			}
		}
		else{
			$str = $minutes;
			if($minutes == 1)
				$str .= " minute ago";
			else
				$str .= " minutes ago";
		}
	}
	else{
		$str = $seconds;
		if($seconds == 1)
			$str .= " second ago";
		else
			$str .= " seconds ago";
	}	
	
	return $str;
}




//Get favicon
function getFavicon(){
	global $pq_shortname;
	$faviconId = get_option($pq_shortname."_favicon");
	
	if($faviconId === FALSE)
		return "";
		
	$faviconUrl = wp_get_attachment_url( $faviconId );
	
	return '<link rel="shortcut icon" href="'.$faviconUrl.'">';
}

//Get logo
function getLogo(){
	global $pq_shortname;
	$logoId = get_option($pq_shortname."_logo");
	
	if($logoId === false)
		return "";
		
	$logoUrl = wp_get_attachment_image_src( $logoId, "full" );
	
	$url = $logoUrl[0];
	$width = intval($logoUrl[1])/2;
	$height = intval($logoUrl[2])/2;
	
	//$url = mr_image_resize($url, $width, $height, false);

	return '<a href="'.get_home_url().'" id="logo" class="dynamic_loading" style="background:url('.$url.') no-repeat center center; background-size: '.$width.'px '.$height.'px; width:'.$width.'px;"></a>';
}

function pq_calculate_resized_url($args){
	list($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust) = $args;
	$needsResize = false;

	//Size with retina multiplier
	$width = $width * ($retina ? 2 : 1);
	$height = $height * ($retina ? 2 : 1);

	//get width and height minimum values if no crop
	if(!$crop && $original_width > $width && $original_height > $height){
		if($width == NULL)
			$ratio = $height/$original_height;
		else if($height == NULL || $height === 0)
			$ratio = $width/$original_width;
		else if($adjust)
			$ratio = min($width/$original_width, $height/$original_height);
		else
			$ratio = max($width/$original_width, $height/$original_height);

		$width = ceil($original_width * $ratio);
		$height = ceil($original_height * $ratio);

		$needsResize = true;
	}

	//Snapping images sizes
	if($needsResize && $snap){

		//Snap vars
		$widthSnap = $original_width;
		$heightSnap = $original_height;
		$ratio = $widthSnap / $heightSnap;

		while(true){
			if($ratio >= 1){
				//landscape image
				$tempWidth = $widthSnap-$snapValue;
				$tempHeight = round($tempWidth / $ratio);
			}
			else{
				//portrait image
				$tempHeight = $heightSnap-$snapValue;
				$tempWidth = round($tempHeight * $ratio);
			}

			//Check breaking point
			if($tempWidth < $width || $tempHeight < $height)
				break;

			$widthSnap = $tempWidth;
			$heightSnap = $tempHeight;
		}

		$width = $widthSnap;
		$height = $heightSnap;
	}

	//Resize or crop if needed
	if($needsResize || $crop)
		$url = mr_image_resize($url, $width, $height, $crop, $align, false);
	else{
		$width = $original_width;
		$height = $original_height;
	}

	return array(
		"url"=> $url,
		"width"=> $width,
		"height"=> $height
	);
}



//Get attachment
add_action( 'wp_ajax_nopriv_pq_get_attachment', 'pq_get_attachment_fun' );
add_action( 'wp_ajax_pq_get_attachment', 'pq_get_attachment_fun' );
function pq_get_attachment_fun() {
	// get the submitted parameters
	$attachmentID = $_POST['attachmentID'];	

	$retina = isset($_POST['retina']) ? ($_POST['retina']=="true"?true:false) : true;
	$width = isset($_POST['width']) ? $_POST['width'] : NULL;
	$height = isset($_POST['height']) ? $_POST['height'] : NULL;
	$crop = isset($_POST['crop']) ? ($_POST['crop']=="true"?true:false) : false;
	$snap = isset($_POST['snap']) ? ($_POST['snap']=="true"?true:false) : false;
	$snapValue = isset($_POST['snap_value']) ? intval($_POST['snap_value']) : 100;
	$align = isset($_POST['align']) ? $_POST['align'] : 'c';
	$adjust = isset($_POST['adjust']) ? ($_POST['adjust']=="true"?true:false) : false;

	$image = wp_get_attachment_image_src( $attachmentID, "full" );
	
	$url = $image[0];
	$original_width = intval($image[1]);
	$original_height = intval($image[2]);
	
	$json = pq_calculate_resized_url(array($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust));

	// response output
	//if ( ! $attachment = wp_prepare_attachment_for_js( $attachmentID ) )
		//wp_send_json_error();
	$editUrl = get_edit_post_link( $attachmentID , '&');
	$json["editLink"] = $editUrl;

	wp_send_json_success( $json );

	exit;
}

add_action( 'wp_ajax_nopriv_pq_get_resized', 'pq_get_resized_fun' );
add_action( 'wp_ajax_pq_get_resized', 'pq_get_resized_fun' );
function pq_get_resized_fun() {
	$url = $_POST['url'];	
	$retina = isset($_POST['retina']) ? ($_POST['retina']=="true"?true:false) : true;
	$width = isset($_POST['width']) ? $_POST['width'] : NULL;
	$height = isset($_POST['height']) ? $_POST['height'] : NULL;
	$crop = isset($_POST['crop']) ? ($_POST['crop']=="true"?true:false) : false;
	$snap = isset($_POST['snap']) ? ($_POST['snap']=="true"?true:false) : false;
	$snapValue = isset($_POST['snap_value']) ? intval($_POST['snap_value']) : 100;
	$align = isset($_POST['align']) ? $_POST['align'] : 'c';
	$adjust = isset($_POST['adjust']) ? ($_POST['adjust']=="true"?true:false) : false;

	$site_url = site_url();
	if (strpos($url, $site_url) !== false) {
	    $url = str_replace($site_url, "..", $url);
	}

	//Get image original size
	$size = @getimagesize($url);

	// If no size data obtained, return error or null
	if ($size === FALSE) {
		fb::log("Error getting image size!");
		return is_user_logged_in() ? "getimagesize_error_common" : null;
	}

	// Set original width and height
	list($original_width, $original_height, $orig_type) = $size;

	$json = pq_calculate_resized_url(array($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust));

	wp_send_json_success( $json );

	exit;
}

function pq_get_image_resized_fun($url, $width, $height, $crop, $retina, $snap, $snapValue, $align, $adjust){

	$site_url = site_url();
	if (strpos($url, $site_url) !== false) {
	    $url = str_replace($site_url, "..", $url);
	}

	//Get image original size
	$size = @getimagesize($url);

	// If no size data obtained, return error or null
	if ($size === FALSE) {
		fb::log("Error getting image size!");
		return array(
			"url"=> $url,
			"width"=> NULL,
			"height"=> NULL
		);
	}

	// Set original width and height
	list($original_width, $original_height, $orig_type) = $size;

	$json = pq_calculate_resized_url(array($url, $width, $height, $original_width, $original_height, $crop, $retina, $snap, $snapValue, $align, $adjust));
}



//Send email
add_action( 'wp_ajax_nopriv_pq_send_email', 'pq_send_email_fun' );
add_action( 'wp_ajax_pq_send_email', 'pq_send_email_fun' );
function pq_send_email_fun() {
	$message = "";
	foreach ($_POST as $param_name => $param_val) {
		if($param_name != "pq_title" && $param_name != "pq_email_subject" && $param_name != "pq_email_to" && $param_name != "pq_email_from" && $param_name != "pq_email_from_name" && $param_name != "action")
	    	$message .= $param_name.": ".$param_val."\n\n";
	}

	$subject = isset($_POST["pq_email_subject"]) ? $_POST["pq_email_subject"] : $_POST["pq_title"];

	if(isset($_POST["pq_email_from"])){
		$isSetName = isset($_POST["pq_email_from_name"]);
		$from = ($isSetName ? $_POST["pq_email_from_name"]." <" : "") . $_POST["pq_email_from"] . ($isSetName ? ">" : "");

		$headers = 'From: '.$from."\r\n";

		echo wp_mail( $_POST["pq_email_to"], $subject, $message, $headers );
	}
	else
		echo wp_mail( $_POST["pq_email_to"], $subject, $message );

	exit;
}



//Get portfolio posts ajax
add_action( 'wp_ajax_nopriv_pq_get_portfolio_posts', 'pq_get_portfolio_posts_fun' );
add_action( 'wp_ajax_pq_get_portfolio_posts', 'pq_get_portfolio_posts_fun' );
function pq_get_portfolio_posts_fun() {
	// get the submitted parameters
	$offset = $_POST['offset'];	
	$number = $_POST['number'];	
	$postId = $_POST['postId'];

	//Set global post for get_tax_query function
	global $post;
	$post = new stdClass();
	$post->ID = $postId;

 	$args = array( 	'post_type' => 'portfolio', 
					'post_status' => 'publish',
			'orderby' => 'meta_value_num', 
			'meta_key' => 'position',
			'order' => 'ASC',
			'nopaging'=> false,
			'offset'=>$offset,
			'posts_per_page'=>$number);
	
	//Parse categories
	$args["tax_query"] = get_tax_query("included_portfolio_categories", 'portfolio_category');
	
	//get works
	$posts = new WP_Query($args);

	$description_content_align = get_post_meta($postId, "description_content_align", true);

	//Start works iteration
	if($posts->have_posts()): 
	while($posts->have_posts()):  $posts->the_post();
	
		if( isset($_COOKIE["pixel_ratio"]) )
			$pixel_ratio = $_COOKIE["pixel_ratio"];
		else
			$pixel_ratio = 2;
		
		$stdHeight = 275 * $pixel_ratio;
		$stdWidth = 400 * $pixel_ratio;
		
		$imageUrl = wp_get_attachment_image_src( get_post_meta($post->ID, "thumbnail", true), $pixel_ratio == 1 ? "medium" : "full" );
		$imageWidth = $imageUrl[1];
		$imageHeight = $imageUrl[2];
		$imageUrl = $imageUrl[0];

		if(intval($imageHeight) < $stdHeight){
			$imageUrl = wp_get_attachment_image_src( get_post_meta($post->ID, "thumbnail", true), "full" );
			$imageWidth = $imageUrl[1];
			$imageHeight = $imageUrl[2];
			$imageUrl = $imageUrl[0];
		}
		
		$categories = get_the_category_bytax($post->ID, 'portfolio_category');
		$parentsStr = getCategoriesAssociatedStr($categories);
		

		$item_external_link = get_post_meta($post->ID, "item_external_link", true);
		$item_external_link_target = get_post_meta($post->ID, "item_external_link_target", true);

		$isExternalLink = $item_external_link!="";

		$item_desc_back = get_post_meta($post->ID, "item_desc_back", true);

		$imageUrl = mr_image_resize($imageUrl, $stdWidth, $stdHeight);
	//Make work object
	?>
	<a href="<?php echo $isExternalLink ? $item_external_link : get_permalink(); ?>" class="work masonry-block <?php echo !$isExternalLink ? "dynamic_loading " : ""; ?>new" data-categories="<?php echo $parentsStr; ?>" target="<?php echo $isExternalLink ? $item_external_link_target : "_self"; ?>">
		<img src="<?php echo $imageUrl; ?>" width="<?php echo $stdWidth/$pixel_ratio; ?>" height="<?php echo $stdHeight/$pixel_ratio; ?>"/>
		<div class="shadow"></div>
		<div class="description-wraper">
			<div class="description" style="background-color: <?php echo $item_desc_back == "" ? "rgb(17, 17, 17)" : $item_desc_back; ?>; ">
				<div class="content" style="text-align: <?php echo $description_content_align; ?>;">
					<h1 class="white" style="color: <?php echo $item_desc_back; ?>; "><?php the_title(); ?></h1>
					<hr style="<?php echo $description_content_align == "center" ? "margin-left:auto; margin-right:auto;" : ""; ?> background-color: <?php echo $item_desc_back; ?>; border-color: <?php echo $item_desc_back; ?>;"/>
					<p style="color: <?php echo $item_desc_back; ?>; "><?php echo get_post_meta($post->ID, "item_short", true); ?></p>
					<p class="category" style="color: <?php echo $item_desc_back; ?>; ">
						<?php
						$count = 0;
						foreach($categories as $category){
							if($count != 0)
								echo " / ";
							echo $category->name;
							$count++;
						}
						?>
					</p>
				</div>
			</div>
		</div>
		<div class="hitarea"></div>
	</a>
	<?php
	//End work object
  
	endwhile;
	endif; 
	// Restore original Query & Post Data
	wp_reset_query();
	wp_reset_postdata();
}


//Get blog posts ajax
add_action( 'wp_ajax_nopriv_pq_get_blog_posts', 'pq_get_blog_posts_fun' );
add_action( 'wp_ajax_pq_get_blog_posts', 'pq_get_blog_posts_fun' );
function pq_get_blog_posts_fun() {
	// get the submitted parameters
	$offset = $_POST['offset'];	
	$number = $_POST['number'];	
	$postId = $_POST['postId'];

	//Set global post for get_tax_query function
	global $post;
	$post = new stdClass();
	$post->ID = $postId;
	
	//get posts
	$args = array(  
					'post_status' => 'publish',
					'post_type' => 'post',
					'offset'=>$offset,
					'posts_per_page'=>$number );
	
	//Parse categories
	$args["tax_query"] = get_tax_query("included_blog_categories", 'category');
	
	$posts = new WP_Query( $args );

	//Start works iteration
    if($posts->have_posts()): 
        while($posts->have_posts()):  $posts->the_post();

	    $categories = get_the_category_bytax($post->ID, 'category');
		$parentsStr = getCategoriesAssociatedStr($categories, "included_blog_categories");
            
        ?>
        
        <div <?php post_class('masonry-post new'); ?>
        	data-categories="<?php echo $parentsStr; ?>">
    	<div class="wraper">
        	<?php
			$post_media_type = get_post_meta( $post->ID, "post_media_type", true );
			if($post_media_type != "text"){
				//echo "<div class='featured-content'>";
				//Make featured content (in functions.php)
				make_featured_content($post_media_type, $post->ID, 440, true);
				//echo "</div>";
			}
			
			?>
            <div class="post_date_type">
            
                <!-- Post type image -->
                <div class="post_type">
					<?php
					if($post_media_type == "" || $post_media_type == FALSE)
						$post_media_type = "text";
						
					$type = "esza-".$post_media_type;
					switch($post_media_type){
						case "sound":
						case "soundcloud":
							$type = "esza-headphones";
							break;	
						
					}
					
					echo '<i class="'.$type.'"></i>';
					
					?>
                </div>
                    
                <!-- Date -->
                <div class="date_holder">
                	<h2 class="post-day"><?php the_time("j"); ?></h2>
                	<h2 class="post-date"><?php the_time("M y"); ?></h2>
                </div>
                
                <!-- Continue Reading -->
                <div>
                	<a href="<?php the_permalink(); ?>" class="continue-reading-button subHeader dynamic_loading new">
                    	<p>Continue reading</p>
                 	</a>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="masonry-post-inner">
                
                <?php
				if($post_media_type != "quote" && $post_media_type != "tweet"){
					?>
					<a href="<?php the_permalink(); ?>" class="blog_post_title dynamic_loading new"><h2><span><?php the_title(); ?></span></h2></a>
					<?php 
				} ?>
                <p class="subHeader" style="margin-top: 8px;">Posted by <span><?php the_author(); ?></span> in 
                
                <?php
                    //get categories
                    $categories = get_the_category();
                    $count = 0;
                    if($categories){
                        foreach($categories as $category) {
                            if($count != 0)
                                echo ", ";
                            echo '<span>'.$category->name.'</span>';
                            $count++;
                        }
                    }
                ?>
                </p>
                <?php echo get_post_meta( $post->ID, "description", true ) ?>
                
                
                <?php
                if(comments_open()){
                	?>
	                <p>
	                <?php 
					$numberOfComments = get_comments_number($post->ID);
					if($numberOfComments > 0){
						?>
						<a class="dynamic_loading new" href="<?php the_permalink(); ?>" onclick="TO_COMMENTS = true;">
						<?php
					}
					?>
	                <span class="comments<?php comments_number( " no_comments", "", "" ); ?>">
	                <i class="esza-comment"></i>
	                <?php 
	                    //comments number
	                    comments_number( "0 comments", "1 comment", "% comments" ); 
	                ?> 
	                </span>
	                <?php 
					if($numberOfComments > 0){
						?>
						</a>
						<?php
					}
					?>
	                </p>
	                <?php
                }
                ?>
                
            </div>
        </div>
    	</div>
		<?php endwhile; ?>
    <?php endif; 
    // Restore original Query & Post Data
    wp_reset_query();
    wp_reset_postdata();

	exit;
}



//Get mosaic posts ajax
add_action( 'wp_ajax_nopriv_pq_get_blog_mosaic_posts', 'pq_get_blog_mosaic_posts_fun' );
add_action( 'wp_ajax_pq_get_blog_mosaic_posts', 'pq_get_blog_mosaic_posts_fun' );
function pq_get_blog_mosaic_posts_fun() {
	// get the submitted parameters
	$offset = $_POST['offset'];	
	$number = $_POST['number'];	
	$postId = $_POST['postId'];

	//Set global post for get_tax_query function
	global $post;
	$post = new stdClass();
	$post->ID = $postId;
	
	//get posts
	$args = array(  'post_type' => 'post',
					'post_status' => 'publish',
					'offset'=>$offset,
					'posts_per_page'=>$number );
	
	//Parse categories
	$args["tax_query"] = get_tax_query("included_blog_categories", 'category');
	
	$posts = new WP_Query( $args );

	//Start works iteration
    if($posts->have_posts()): 
        while($posts->have_posts()):  $posts->the_post();

			//Mosaic options
            $background_image = get_post_meta( $post->ID, "post_mosaic_image", true );
            $background_color = get_post_meta( $post->ID, "mosaic_background_color", true );
            $mosaic_height = get_post_meta( $post->ID, "post_mosaic_height", true );
            $image_alignment = get_post_meta( $post->ID, "post_mosaic_image_crop_alignment", true );
            $content_top = get_post_meta( $post->ID, "post_mosaic_content_top", true );
            $mosaic_title_color = get_post_meta( $post->ID, "mosaic_title_color", true );
            $mosaic_date_color = get_post_meta( $post->ID, "mosaic_date_color", true );
            $mosaic_comment_color = get_post_meta( $post->ID, "mosaic_comment_color", true );
            $mosaic_content_padding = get_post_meta( $post->ID, "mosaic_content_padding", true );
            $post_mosaic_title_first = get_post_meta( $post->ID, "post_mosaic_title_first", true );

            $hasImage = $background_image != FALSE && $background_image != "";

            $title = '<h2 style="color: '.$mosaic_title_color.';">'.get_the_title().'</h2>';

            $categories = get_the_category_bytax($post->ID, 'category');
			$parentsStr = getCategoriesAssociatedStr($categories, "included_blog_categories");
        ?>
        
        <a href="<?php the_permalink(); ?>" 
        	<?php post_class('masonry-block mosaic-post dynamic_loading new'); ?>
        	style="background-color: <?php echo $background_color; ?>; <?php echo $hasImage ? "" : "min-height: ".$mosaic_height."px;"; ?>"
        	data-categories="<?php echo $parentsStr; ?>">
        	<?php
    		if($hasImage){
				$imageBig = wp_get_attachment_image_src( $background_image , "full");
				$imageUrl = $imageBig[0];

				if( isset($_COOKIE["pixel_ratio"]) )
					$pixel_ratio = $_COOKIE["pixel_ratio"];
				else
					$pixel_ratio = 2;

				$imageUrl = mr_image_resize($imageUrl, 440, $mosaic_height!=0 ? $mosaic_height : null, true, $image_alignment, $pixel_ratio > 1);
        		?>
        		<img src="<?php echo $imageUrl; ?>" />
        		<?php
        	}
        	?>
        	<div class="mosaic-content" data-position="<?php echo $content_top; ?>" style="padding: <?php echo $mosaic_content_padding; ?>; <?php echo !$hasImage ? "position:relative;" : ""; ?>">
        		
        		<?php
    			if($post_mosaic_title_first == "true")
    				echo $title;
    			?>
    			
    			<?php
                if(comments_open()){
                	?>
	        		<p style="color: <?php echo $mosaic_date_color; ?>;">
	        			<?php the_time("jS \of F Y"); ?>&nbsp;&nbsp;&nbsp;
		                <i class="esza-comment" style="color: <?php echo $mosaic_comment_color; ?>;"></i>&nbsp;
		                <?php 
		                    //comments number
		                    comments_number( "0 comments", "1 comment", "% comments" ); 
		                ?> 
	        		</p>
	        		<?php
        		}
        		else{
                	?>
        			<p style="color: <?php echo $mosaic_date_color; ?>;">
	        			<?php the_time("jS \of F Y"); ?>
	        		</p>
	        		<?php
        		}


        		if($post_mosaic_title_first != "true")
    				echo $title;
    			?>
        	</div>
        	<div class="shadow"></div>
    	</a>
		<?php endwhile; ?>
    <?php endif; 
    // Restore original Query & Post Data
    wp_reset_query();
    wp_reset_postdata();

	exit;
}



//Get blog posts ajax
add_action( 'wp_ajax_nopriv_pq_get_gallery_posts', 'pq_get_gallery_posts_fun' );
add_action( 'wp_ajax_pq_get_gallery_posts', 'pq_get_gallery_posts_fun' );
function get_gallery_item_content($id){
	$item_type = get_post_meta($id, "item_media_type", true);

	if( $item_type == "image"){
		$imageBig = wp_get_attachment_image_src( get_post_meta($id, "item_main_media", true) , "full");
		$href = $imageBig[0];
	}
	else if( $item_type == "video"){
		$type = get_post_meta($id, "item_video_type", true);
		$video_id = get_post_meta($id, "item_video_id", true);
		$href = getSocialVideoUrl($type, $video_id);
	}
	else if( $item_type == "sound"){
		$sound = get_post_meta($id, "item_sound_url", true);
		$title = get_post_meta($id, "item_sound_title", true);
		$artist = get_post_meta($id, "item_sound_artist", true);
		$href = getMusicPlayerUrl($item_type, $sound, $title, $artist);
	}
	else if( $item_type == "soundcloud"){
		$sound = get_post_meta($id, "item_soundcloud_url", true);
		$title = get_post_meta($id, "item_soundcloud_title", true);
		$artist = get_post_meta($id, "item_soundcloud_artist", true);
		$href = getMusicPlayerUrl($item_type, $sound, $title, $artist);
	}

	return $href;
}
function get_gallery_item_description($id){
	$description = get_post_meta($id, "item_description", true);

	$return = 	'<div id="gallery_description_'.$id.'" style="display:none;">';
	$return .= 		'<h4><span>'.get_the_title($id).'</span></h4>';
	$return .= 		 do_shortcode($description);
	$return .= 	'</div>';

	return str_replace(array("\r\n", "\r"), "", $return);
}
function pq_get_gallery_posts_fun() {
	// get the submitted parameters
	$offset = $_POST['offset'];	
	$number = $_POST['number'];	
	$postId = $_POST['postId'];
	$maxWidth = isset($_POST['maxWidth']) ? intval($_POST['maxWidth']) : 400;

	//Set global post for get_tax_query function
	global $post;
	$post = new stdClass();
	$post->ID = $postId;
	
	//get posts
	$args = array(  'post_type' => 'gallery',
					'post_status' => 'publish',
					'orderby' => 'meta_value_num', 
					'meta_key' => 'position',
					'order' => 'ASC',
					'offset'=>$offset,
					'posts_per_page'=>$number );
	
	//Parse categories
	$args["tax_query"] = get_tax_query("included_gallery_categories", 'galleries');
	
	$posts = new WP_Query( $args );

	//Start works iteration
	if($posts->have_posts()): 
	while($posts->have_posts()):  $posts->the_post();
		//get type
		$item_type = get_post_meta($post->ID, "item_media_type", true);

		//Pixel ratio
		if( isset($_COOKIE["pixel_ratio"]) )
			$pixel_ratio = $_COOKIE["pixel_ratio"];
		else
			$pixel_ratio = 2;
		
		//Image Type
		if( $item_type == "image"){
			$imageBig = wp_get_attachment_image_src( get_post_meta($post->ID, "item_main_media", true) , "full");
			$href = $imageBig[0];
			$widthImage = $imageBig[1];
			$heightImage = $imageBig[2];
		}
		else if( $item_type == "video"){
			$type = get_post_meta($post->ID, "item_video_type", true);
			$id = get_post_meta($post->ID, "item_video_id", true);
			$href = getSocialVideoUrl($type, $id);
		}
		else if( $item_type == "sound"){
			$sound = get_post_meta($post->ID, "item_sound_url", true);
			$title = get_post_meta($post->ID, "item_sound_title", true);
			$artist = get_post_meta($post->ID, "item_sound_artist", true);
			$href = getMusicPlayerUrl($item_type, $sound, $title, $artist);
		}
		else if( $item_type == "soundcloud"){
			$sound = get_post_meta($post->ID, "item_soundcloud_url", true);
			$title = get_post_meta($post->ID, "item_soundcloud_title", true);
			$artist = get_post_meta($post->ID, "item_soundcloud_artist", true);
			$href = getMusicPlayerUrl($item_type, $sound, $title, $artist);
		}
		else if( $item_type == "link" ){
			$href = get_post_meta($post->ID, "item_external_link", true);
			$target = get_post_meta($post->ID, "item_external_link_target", true);
		}
		
		//Thumbnail
		$imageThumb = wp_get_attachment_image_src( get_post_meta($post->ID, "item_thumb", true) , "full");
		if($imageThumb === FALSE && isset($imageBig))
			$imageThumb = $imageBig;
		$imageThumbUrl = $imageThumb[0];
		$imageThumbWidth = $imageThumb[1];
		$imageThumbHeight = $imageThumb[2];
		
		//Get visible part
		$useLimit = get_post_meta($post->ID, "item_thumb_limit", true);
		if($useLimit === "true"){
			$height = get_post_meta($post->ID, "item_thumb_height", true);
			$alignment = get_post_meta($post->ID, "item_thumb_crop_alignment", true);
		}
		
		
		$categories = get_the_category_bytax($post->ID, 'galleries');
		$parentsStr = getCategoriesAssociatedStr($categories);

		$description = get_post_meta($post->ID, "item_description", true);

      fb::log($imageThumbUrl);
		$imageThumbUrl = mr_image_resize($imageThumbUrl, $maxWidth, $useLimit==="true" ? $height : null, $useLimit=="true", $useLimit=="true" ? $alignment:'c', $pixel_ratio > 1);
		
      fb::log($imageThumbUrl);?>
		
	    <!-- Gallery item -->
		<a 	href="<?php echo $href; ?>" 
	    	class="gallery-item masonry-block <?php echo $item_type != "link" ? "lightbox" : ""; ?>" 

	    	<?php 
	    	if($item_type != "link"){
	    		?>
	       		onclick="return false;"
	       		data-group="gallerygroup" 
				data-description="gallery_description_<?php echo $post->ID; ?>"
	       		<?php
	       	}
	       	?>
	        <?php echo $item_type == "link" ? "target='".$target."'" : ""; ?>
	        data-type="<?php echo $item_type; ?>" 
	        data-categories="<?php echo $parentsStr; ?>"
	        <?php
			if($item_type =="image"){
				?>
				data-width="<?php echo $widthImage; ?>"
				data-height="<?php echo $heightImage; ?>"
				<?php 
			} 
			?>

	        >
			<img src="<?php echo $imageThumbUrl; ?>" />
	        <div class="cover"></div>
	        <!-- Post type image -->
	        <div class="post_type">
	        	<?php
	        		$type = "esza-".$item_type;
					
					if($item_type == "sound" || $item_type == "soundcloud")
						$type = "esza-headphones";
						
					echo '<i class="'.$type.'"></i>';
				?>
	        </div>
		</a>
        <?php 
    	if($item_type != "link"){
    		?>
	        <div id="gallery_description_<?php echo $post->ID; ?>" style="display:none;">
	        	<h4><span><?php the_title(); ?></span></h4>
				<?php echo do_shortcode($description); ?>
	        </div>
	    	<?php
		}
		?>
	    <!-- END Gallery item -->
		
		<?php 
	endwhile; 
	endif; 

	// Restore original Query & Post Data
	wp_reset_query();
	wp_reset_postdata();
}


add_filter( 'avatar_defaults', 'new_default_avatar' );

function new_default_avatar ( $avatar_defaults ) {
		//Set the URL where the image file for your avatar is located
		$new_avatar_url = 'http://pt.gravatar.com/userimage/40519953/0921295dde73766afe618d0da03491ba.png?size=200';
		//Set the text that will appear to the right of your avatar in Settings>>Discussion
		$avatar_defaults[$new_avatar_url] = 'Essenza Default Avatar';
		return $avatar_defaults;
}

//Comments
function pq_custom_comments($comment, $args, $depth){
	$GLOBALS['comment'] = $comment;
	extract($args, EXTR_SKIP);
	
	$isTopLevel = ($comment->comment_parent === "0");
	
	?>
    <?php 
		$author = $comment->comment_author;
		$isFacebook = false;
		
		if(substr($author, 0, 9) == "facebook:"){
			list($temp,$author) = explode (":", $author, 2);
			$isFacebook = true;
		}
	?>
	<div id="comment-<?php comment_ID() ?>" <?php comment_class('comment '.($isFacebook ? "facebook_comment" : "")); ?>>
    	<?php
    	if(!$isTopLevel){
            ?>
            <div class="comment_small_line"></div>
            <?php
        }
        ?>
    
		<div class="thumbnail_comment">
        <?php 
		if($isFacebook){
			echo '<img src="http://graph.facebook.com/'.$author.'/picture?redirect=true" width:"50" height:"50"/>';
		}
		else{
			//Pixel ratio
			if( isset($_COOKIE["pixel_ratio"]) ){$pixel_ratio = $_COOKIE["pixel_ratio"];}
			else{$pixel_ratio = 2;}

			if($pixel_ratio > 1){
				echo get_avatar( $comment, 100 );
			}
			else{
				echo get_avatar( $comment, 50 );
			}
		}
		?>
        </div>
		<div class="headline">
			<div class="comment_information_holder">
				<h5 class="comment_author"><?php 
				if($isFacebook){
					$resource = file_get_contents("http://graph.facebook.com/".$author);
					$json = json_decode($resource);
					$author = $json->name;
				}
				echo $author ; 
				?></h5>
				<a class="date" href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ) ?>"><?php echo comment_date('F jS h:ia'); ?></a>
				
	            
	            <!-- Reply button -->
				<?php
	            if($isTopLevel){
					?>
	            	<p class="hidden-phone">|</p>
					<a class="comment_reply" data-author="<?php echo $author ; ?>" data-commentId="<?php echo $comment->comment_ID; ?>" href="#"><?php echo get_option("esza_trans_reply"); ?></a>
					<?php
				}
				else{
					?>
	                <?php	
				}
				?>
	            
	            <!-- Edit button -->
	            <?php edit_comment_link(get_option("esza_trans_edit"),'  ','' );?>
	        </div>
			<hr class="mini"/>
		</div>
		<div class="text">
        	<?php 
			if(!$comment->comment_approved)
				echo '('.get_option("esza_trans_waiting_approval").')<br/><br/>';
			?>
			<?php echo $comment->comment_content ; ?>
		</div>
	</div>
	<?php
}

function get_the_content_with_formatting ($more_link_text = '(more...)', $stripteaser = 0, $more_file = '') {
	$content = get_the_content($more_link_text, $stripteaser, $more_file);
	$content = apply_filters('the_content', $content);
	$content = str_replace(']]>', ']]&gt;', $content);
	return $content;
}


//Make featured content
function make_featured_content($post_media_type, $postId, $maxWidth = 650, $overview = false){
	//Pixel ratio
	if( isset($_COOKIE["pixel_ratio"]) )
		$pixel_ratio = $_COOKIE["pixel_ratio"];
	else
		$pixel_ratio = 2;

	//Image
	if($post_media_type == "image"){
		$image = wp_get_attachment_image_src( get_post_meta($postId, "post_image", true) , "full");
		$imageUrl = $image[0];
		if($imageUrl != ""){
			//Has an image available
			if($overview)
				$height = get_post_meta($postId, "post_image_height_overview", true);
			else
				$height = get_post_meta($postId, "post_image_height", true);

			$crop_align = get_post_meta($postId, "post_image_crop_alignment", true);
			
			if($height == FALSE)
				$height = 240;
			if($crop_align == FALSE)
				$crop_align = "c";

			if($maxWidth == null){
				$maxWidth = $image[1];
			}

			$height =intval($height);
			
			$resized_obj = pq_get_image_resized_fun($imageUrl, $maxWidth, $height, !($height==0), $pixel_ratio>1, false, false, $crop_align, false);

			$imageUrl = $resized_obj["url"];
			?>
            <a class="dynamic_loading" href="<?php echo get_permalink( $postId ); ?>">
				<img src="<?php echo $imageUrl; ?>" alt="Blog post featured image" style="width:100%;"/>
            </a>
			<?php
		}
	}
	
	//Video
	else if($post_media_type == "video"){
		$video = get_post_meta($postId, "post_video_type", true);
		$videoid = get_post_meta($postId, "post_video_id", true);

		if($overview)
			$height = get_post_meta($postId, "post_video_height_overview", true);
		else
			$height = get_post_meta($postId, "post_video_height", true);

		$useCover = get_post_meta($postId, "post_video_use_cover", true);
		$cover = get_post_meta($postId, "post_video_cover", true);
		
		//Make shortcode
		echo do_shortcode('[socialVideo type="'.$video.'" height="'.$height.'" use_cover="'.$useCover.'" cover="'.$cover.'"]'.$videoid.'[/socialVideo]');
	}
	
	//Tweet
	else if($post_media_type == "tweet"){
		$tweetId = get_post_meta($postId, "tweet_id", true);
		
		//Make shortcode
		echo do_shortcode('[tweet]'.$tweetId.'[/tweet]');
	}
	
	//Quote
	else if($post_media_type == "quote"){
		$post_quote = get_post_meta($postId, "post_quote", true);
		$post_quote_author = get_post_meta($postId, "post_quote_author", true);
		
		//Make shortcode
		echo do_shortcode('[quote author="'.$post_quote_author.'"]'.$post_quote.'[/quote]');
	}
	
	//Gallery
	else if($post_media_type == "gallery"){
		//Get images
		$attachments_str = get_post_meta( $postId, "post_images", true );
		$width = get_post_meta( $postId, "post_images_width", true );
		$height = get_post_meta( $postId, "post_images_height", true );

		$width = $width === FALSE ? "100" : $width;
		$height = $height === FALSE ? "100" : $height;
		
		//Make shortcode
		echo do_shortcode('[blog_gallery width="'.$width.'" height="'.$height.'"]'.$attachments_str.'[/blog_gallery]');
	}
	
	//Sound
	else if($post_media_type == "sound" || $post_media_type == "soundcloud"){
		if($post_media_type == "sound"){
			$title = get_post_meta( $postId, "post_sound_title", true );
			$artist = get_post_meta( $postId, "post_sound_artist", true );
			$url = get_post_meta( $postId, "post_sound_url", true );
		}
		else{
			$title = get_post_meta( $postId, "post_soundcloud_title", true );
			$artist = get_post_meta( $postId, "post_soundcloud_artist", true );
			$url = get_post_meta( $postId, "post_soundcloud_url", true );
		}
		
		//Make shortcode
		echo do_shortcode('[music_player title="'.$title.'" artist="'.$artist.'" type="'.$post_media_type.'"]'.$url.'[/music_player]');
	}
	
	//Slider
	else if($post_media_type == "slider"){
		$sliderId = get_post_meta( $postId, "post_slider", true );
		
		//Make shortcode
		echo do_shortcode('[slider]'.$sliderId.'[/slider]');
	}
}




function emptyEasyBackground(){
	?>
	easyBackground.changeImages([]);        
	<?php
}
function changeEasyBackground(){
	if(is_search()){
		$background_color = get_option("pages_color");
		emptyEasyBackground();
		?>
		if(easyBackground)
            easyBackground.changeColor("<?php echo $background_color; ?>");
		<?php
		return;
	}

	global $post;
	//get page background if applicable
	if($post && $post != NULL){
		$background_images_str = get_post_meta( $post->ID, "background_images", true );
		$background_color = get_post_meta( $post->ID, "background_color", true );
		
		//Color
		if($background_color != FALSE){
			?>
            if(easyBackground)
            easyBackground.changeColor("<?php echo $background_color; ?>");
            <?php
		}
		
		//Image
		if($background_images_str != "" && $background_images_str != NULL && $background_images_str != FALSE){
			//Get images for this work
			$background_images = explode(",", $background_images_str);
			
			?>
            if(easyBackground)
            easyBackground.changeImages([<?php 
                $count = 0;
                foreach($background_images as $background_image){ 
                    $imageUrl = wp_get_attachment_url( $background_image );
                    
                    if($count != 0){
                        //first one
                        echo ", ";
                    }
                    $count++;
                    
                    echo '"'.$imageUrl.'"';
                }
			?>]);
			<?php
		}
		else{
			emptyEasyBackground();
		}
	}
	else{
		emptyEasyBackground();
	}
}






/*
*  Get tax query for post meta category posts
*
*  @description: Return tax query to use in a wp_query
*  @created: 29/04/13
*/
function get_tax_query($option, $taxonomy){
	global $post;
	$categories = get_post_meta( $post->ID, $option, true );
	//fb::log($post->ID);
	
	if($categories !== FALSE && $categories !== "all"){
		$categoriesArray = array(
			'relation' => 'OR'
		);
		
		$cats = explode(",", $categories);
		foreach($cats as $cat){
			$ar = array(
				'taxonomy' => $taxonomy,
				'field' => 'id',
				'terms' => $cat
			);
			array_push ($categoriesArray, $ar);	
		}
		
		return $categoriesArray;
	}
	
	return array();
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
	die(); // stop executing script
}


global $plusquare_wherePostDate;
global $plusquare_wherePostOp;
function filter_where( $where = '') {
	global $plusquare_wherePostDate;
	global $plusquare_wherePostOp;
	// posts in the last 30 days
	$where .= " AND post_date $plusquare_wherePostOp '" . $plusquare_wherePostDate . "'";
	return $where;
}


function get_number_posts_by_category($post_type ='portfolio', $taxonomy = 'category', $categories = '', $position = 0){
	global $post;
    $globalPost = $post;

	//Query Arguments
	$args = array( 	
		'post_type' => $post_type, 
		'nopaging'=> true,
		'meta_key' => 'position',
		'orderby' => 'meta_value_num', 
		'order' => 'ASC',
		'meta_query'=> array(
		    array(
		      'key' => 'item_external_link',
		      'compare' => '=',
		      'value' => ''
		    )
		)
	);

	//categories
	if($categories != "all" && $categories != ""){
		$cats = explode(",", $categories);

		$categoriesArray = array(
			'relation' => 'OR'
		);
		
		foreach($cats as $cat){
			$ar = array(
				'taxonomy' => $taxonomy,
				'field' => 'id',
				'terms' => $cat
			);
			array_push ($categoriesArray, $ar);	
		}

		$args["tax_query"] = $categoriesArray;
	}

	$query = new WP_Query( $args );

	$actualPosition = 0;
	$numberPosts = $query->found_posts;
	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();

			$this_position = intval(get_post_meta($post->ID, "position", true));

			$actualPosition ++;

			if($position == $this_position)
				break;

		}
	} 


    $post = $globalPost;

    // Restore original Query & Post Data
	wp_reset_query();
	wp_reset_postdata();

	return array("total"=> $numberPosts, 'position' => $actualPosition);
}


function mod_get_adjacent_post_position($direction = 'newer', $post_types = 'post', $categories = '', $taxonomy = 'category') {
    global $post;


    //Portfolio
    if($post_types == "portfolio"){
    	//Variables
		$position = intval(get_post_meta($post->ID, "position", true));
		$op = $direction == 'newer' ? '<' : '>';
		$order = $direction == 'newer' ? 'DESC' : 'ASC';

		//Query Arguments
		$args = array( 	
				'post_type' => $post_types, 
				'meta_key' => 'position',
				'orderby' => 'meta_value_num', 
				'order' => $order,
				'nopaging'=> false,
				'posts_per_page'=> 1,
				'meta_query'=> array(
				    array(
				      'key' => 'position',
				      'compare' => $op,
				      'value' => $position,
				      'type' => 'numeric',
				    ),
				    array(
				      'key' => 'item_external_link',
				      'compare' => '=',
				      'value' => ''
				    )
				  )
				);

		//categories
		if($categories != "all" && $categories != ""){
			$cats = explode(",", $categories);

			$categoriesArray = array(
				'relation' => 'OR'
			);
			
			foreach($cats as $cat){
				$ar = array(
					'taxonomy' => $taxonomy,
					'field' => 'id',
					'terms' => $cat
				);
				array_push ($categoriesArray, $ar);	
			}

			$args["tax_query"] = $categoriesArray;
		}

		$query = new WP_Query( $args );
    }


    else if($post_types == "post"){
    	//Variables
    	$current_post_date = get_the_date( "Y-m-d H:i:s", $post->ID );
		$op = $direction == 'newer' ? '>' : '<';
		$order = $direction == 'newer' ? 'ASC' : 'DESC';

		//Query Arguments
		$args = array( 	
				'post_type' => $post_types, 
				'orderby' => 'date', 
				'order' => $order,
				'nopaging'=> false,
				'posts_per_page'=> 1
				);

		if($categories != "all" && $categories != ""){
			$cats = explode(",", $categories);
			$args["category__in"] = $cats;
		}

		global $plusquare_wherePostDate;
		global $plusquare_wherePostOp;
		$plusquare_wherePostDate = $current_post_date;
		$plusquare_wherePostOp = $op;

		add_filter( 'posts_where', 'filter_where');
		$query = new WP_Query( $args);
		remove_filter( 'posts_where', 'filter_where' );
    }


	//fb::log($query);
    $globalPost = $post;
    $returnPost = NULL;

    if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();
			$returnPost = $post;
		}
	} 

    $post = $globalPost;

    // Restore original Query & Post Data
	wp_reset_query();
	wp_reset_postdata();
	
	//fb::log($returnPost);
    return $returnPost;
}