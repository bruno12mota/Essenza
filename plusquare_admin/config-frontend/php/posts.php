<?php

function pq_make_regular_blog_post(){
	global $post;
	//Post type
	$post_media_type = get_post_meta( $post->ID, "post_media_type", true );
	$sticky = is_sticky();
	?>
	<div <?php post_class('regular-post'); ?>>
		<div class="post_date_type">	
	    	<div class="post_type"><?php
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
	        <h2 class="post-day"><?php the_time("j"); ?></h2>
	        <h2 class="post-date"><?php the_time("M y"); ?></h2>
	    </div>
	    <div class="regular-post-inner">
	    	<?php
			//before title check for featured content
			if($post_media_type != "text"){
				echo "<div class='featured-content'>";
				//Make featured content (in functions.php)

				$page_width = get_post_meta($post->ID, "page_width", true);
				//Fullscreen
				$fullscreen = get_post_meta($post->ID, "page_fullscreen", true);
				$fullscreen = $fullscreen === FALSE ? "false" : $fullscreen;

				plusquare_make_featured_content($post_media_type, $post->ID, $fullscreen ? null : $page_width, true);
				echo "</div>";
			}
			
			//Post date & type for mobile
			?>
			<div class="post_date_type mobile">	
	            <div class="post_type">
	            	<?php
						echo '<i class="'.$type.'"></i>';
					?>
	            </div>
	            <div class="date_holder">
	            	<h2 class="post-day"><?php the_time("j"); ?></h2>
	            	<h2 class="post-date"><?php the_time("M y"); ?></h2>
	            </div>
	        </div>	
	        <?php
			
			
			// Title
			$styleSpecial = "";
			if($post_media_type != "quote" && $post_media_type != "tweet"){
				?>
				<a href="<?php the_permalink(); ?>" class="blog_post_title dynamic_loading"><h2><span><?php the_title(); ?></span></h2></a>
				<?php
			}
			else{
				$styleSpecial = "margin-top: 10px;";
			}
			?>
	        
	        <p class="subHeader" style="<?php echo $styleSpecial; ?>"><?php echo $sticky===true ? "Sticky post by" : "Posted by";?> <span><?php the_author(); ?></span> in 
	        
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
	        
	        
	        <?php 
	        if(comments_open()){
				$numberOfComments = get_comments_number($post->ID);
				if($numberOfComments > 0){
					?>
		            <a class="dynamic_loading" href="<?php the_permalink(); ?>" onclick="TO_COMMENTS = true;">
		            <?php
				}
				?>
		        <span class="comments<?php comments_number( " no_comments", "", "" ); ?>">
			        <i class="esza-comment"></i>
			        <?php 
						//comments number
			        	comments_number( "0 ".get_option("esza_trans_comments", "comments"), "1 ".get_option("esza_trans_comment", "comment"), "% ".get_option("esza_trans_comments", "comments") ); 
					?> 
	        	</span>
	        	<?php 
				if($numberOfComments > 0){
					?>
		            </a>
		            <?php
				}
			}
			?>
	        
	        
	        
	        </p>
	        <?php 
            $description = get_post_meta( $post->ID, "description", true );

            if($description === false || $description == "")
            	the_excerpt();
            else
            	echo '<p>'.$description.'</p>'; 
        	?>
	        
	        <a href="<?php the_permalink(); ?>" class="continue-reading-button subHeader dynamic_loading">
	            <div class="divider">
	                  <div class="line_text"><p><?php 
	                              	echo get_option("esza_trans_continue_reading", "Continue Reading");
	                              ?></p></div>
	                  <div class="line"></div>
	             </div>
	         </a>
	    </div>
	</div>
	<div class="clearfix"></div>
<?php
}