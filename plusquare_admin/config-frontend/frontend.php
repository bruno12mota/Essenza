<?php



/*
 *     Filter Menu
 */
require_once( 'php/filter.php' );

/*
 *     Posts
 */
require_once( 'php/posts.php' );

/*
 *     Ajax
 */
require_once( 'php/ajax.php' );


/*
 *     Ajax
 */
require_once( 'php/enqueues.php' );





/*
 *
 *  Get page to back to
 *
 *  @description: Return the page to back to from a post
 *
 */
function plusquare_make_sidebar($sidebar_id){
	$content_post = get_post($sidebar_id);
	$content = $content_post->post_content;
	$content = apply_filters('the_content', $content);
	$content = str_replace(']]>', ']]&gt;', $content);
	echo do_shortcode($content);
}





/*
 *
 *  Get page to back to
 *
 *  @description: Return the page to back to from a post
 *
 */
function plusquare_get_page_to_back($template, $categories, $meta_opt){
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
 *
 *  Get page Css
 *
 *  @description: Echoes the needed Css for a page according to user options
 *
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
 *
 *  Get Social Video URL 
 *
 *  @description: Return the social video url according to the parameters
 *
 */
function plusquare_get_social_video_url($type, $id, $autoplay = "0"){
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




/*
 *
 *  Get Music Player URL 
 *
 *  @description: Return the music player url according to the parameters
 *
 */
function plusquare_get_music_player_url($type, $sound, $title, $artist){
	$str = get_template_directory_uri()."/scripts/music-player.php?type=".$type."&url=".$sound.'&title='.$title.'&artist='.$artist;
	$str = str_replace(" ", "%20", $str);
	$str = str_replace("&", "&#38;", $str);
	$str = str_replace("=", "&#61;", $str);
	return $str;
}





/*
 *
 *  Get String Time Passed
 *
 *  @description: Returns a string with human readable form of time elapsed from a difference
 *
 */
function plusquare_get_string_time_passed($diff){
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




/*
 *
 *  Get Favicon
 *
 *  @description: Returns favicon html tag
 *
 */
function plusquare_get_favicon(){
	global $pq_shortname;
	$faviconId = get_option($pq_shortname."_favicon");
	
	if($faviconId === FALSE)
		return "";
		
	$faviconUrl = wp_get_attachment_url( $faviconId );
	
	return '<link rel="shortcut icon" href="'.$faviconUrl.'">';
}



/*
 *
 *  Get Logo
 *
 *  @description: Returns logo html tag
 *
 */
function plusquare_get_logo(){
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





/*
 *
 *  Comments
 *
 *  @description: Echoes a comment according to the parameters
 *
 */
function plusquare_custom_comments($comment, $args, $depth){
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





/*
 *
 *  Make Post Featured Content
 *
 *  @description: Echoes the content for a post's featured content
 *
 */
function plusquare_make_featured_content($post_media_type, $postId, $maxWidth = 650, $overview = false){
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





/*
 *
 *  Easy Background
 *
 *  @description: Background Handling
 *
 */
function plusquare_empty_easy_background(){
	?>
	easyBackground.changeImages([]);        
	<?php
}
function plusquare_change_easy_background(){
	if(is_search()){
		$background_color = get_option("pages_color");
		plusquare_empty_easy_background();
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
			plusquare_empty_easy_background();
		}
	}
	else{
		plusquare_empty_easy_background();
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
	//if(WP_DEBUG)fb::log($post->ID);
	
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


	//if(WP_DEBUG)fb::log($query);
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
	
	//if(WP_DEBUG)fb::log($returnPost);
    return $returnPost;
}