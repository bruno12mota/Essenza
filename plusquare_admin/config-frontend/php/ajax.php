<?php


//Get attachment
add_action( 'wp_ajax_nopriv_pq_get_video', 'pq_get_video_fun' );
add_action( 'wp_ajax_pq_get_video', 'pq_get_video_fun' );
function pq_get_video_fun() {
	// get the submitted parameters
	$id = $_POST['id'];	
	$type = $_POST['type'];
	
	echo plusquare_get_social_video_url($type, $id);

	exit;
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
		
		$imageUrl = wp_get_attachment_image_src( get_post_meta($post->ID, "thumbnail", true), "full" );
		$imageWidth = $imageUrl[1];
		$imageHeight = $imageUrl[2];
		$imageUrl = $imageUrl[0];
		
		$categories = plusquare_get_the_category_bytax($post->ID, 'portfolio_category');
		$parentsStr = plusquare_get_categories_str($categories);
		

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

	    $categories = plusquare_get_the_category_bytax($post->ID, 'category');
		$parentsStr = plusquare_get_categories_str($categories, "included_blog_categories");
            
        ?>
        
        <div <?php post_class('masonry-post new'); ?>
        	data-categories="<?php echo $parentsStr; ?>">
    	<div class="wraper">
        	<?php
			$post_media_type = get_post_meta( $post->ID, "post_media_type", true );
			if($post_media_type != "text"){
				//echo "<div class='featured-content'>";
				//Make featured content (in functions.php)
				plusquare_make_featured_content($post_media_type, $post->ID, 440, true);
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
    		$post_mosaic_use_image = get_post_meta( $post->ID, "post_mosaic_use_image", true );
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

            $hasImage = $background_image != "" && ($post_mosaic_use_image === "true" || $post_mosaic_use_image === "");

            $title = '<h2 style="color: '.$mosaic_title_color.';">'.get_the_title().'</h2>';

            $categories = plusquare_get_the_category_bytax($post->ID, 'category');
			$parentsStr = plusquare_get_categories_str($categories, "included_blog_categories");
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
		$href = plusquare_get_social_video_url($type, $video_id);
	}
	else if( $item_type == "sound"){
		$sound = get_post_meta($id, "item_sound_url", true);
		$title = get_post_meta($id, "item_sound_title", true);
		$artist = get_post_meta($id, "item_sound_artist", true);
		$href = plusquare_get_music_player_url($item_type, $sound, $title, $artist);
	}
	else if( $item_type == "soundcloud"){
		$sound = get_post_meta($id, "item_soundcloud_url", true);
		$title = get_post_meta($id, "item_soundcloud_title", true);
		$artist = get_post_meta($id, "item_soundcloud_artist", true);
		$href = plusquare_get_music_player_url($item_type, $sound, $title, $artist);
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
			$href = plusquare_get_social_video_url($type, $id);
		}
		else if( $item_type == "sound"){
			$sound = get_post_meta($post->ID, "item_sound_url", true);
			$title = get_post_meta($post->ID, "item_sound_title", true);
			$artist = get_post_meta($post->ID, "item_sound_artist", true);
			$href = plusquare_get_music_player_url($item_type, $sound, $title, $artist);
		}
		else if( $item_type == "soundcloud"){
			$sound = get_post_meta($post->ID, "item_soundcloud_url", true);
			$title = get_post_meta($post->ID, "item_soundcloud_title", true);
			$artist = get_post_meta($post->ID, "item_soundcloud_artist", true);
			$href = plusquare_get_music_player_url($item_type, $sound, $title, $artist);
		}
		else if( $item_type == "link" ){
			$href = get_post_meta($post->ID, "item_external_link", true);
			$target = get_post_meta($post->ID, "item_external_link_target", true);
		}
		
		//Thumbnail
		$imageThumb = wp_get_attachment_image_src( get_post_meta($post->ID, "item_thumb", true) , "full");
		if($imageThumb === FALSE && isset($imageBig)){
			$imageThumb = $imageBig;
		}
		$imageThumbUrl = $imageThumb[0];
		$imageThumbWidth = $imageThumb[1];
		$imageThumbHeight = $imageThumb[2];
		
		//Get visible part
		$useLimit = get_post_meta($post->ID, "item_thumb_limit", true);
		if($useLimit === "true"){
			$height = get_post_meta($post->ID, "item_thumb_height", true);
			$alignment = get_post_meta($post->ID, "item_thumb_crop_alignment", true);
		}
		
		
		$categories = plusquare_get_the_category_bytax($post->ID, 'galleries');
		$parentsStr = plusquare_get_categories_str($categories);

		$description = get_post_meta($post->ID, "item_description", true);

		$imageThumbUrl = mr_image_resize($imageThumbUrl, $maxWidth, $useLimit==="true" ? $height : null, $useLimit=="true", $useLimit=="true" ? $alignment:'c', $pixel_ratio > 1);
		
      ?>
		
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