<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


<!-- START PAGE WRAPER -->
<div id="page-wraper">	
	<?php
		//get posts
		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
		
		//Post per page
		$postsPerPage = 5;

	    //page alignment
	    $page_align = 'left';
	?>
    
    <div class="container simple_page_wraper <?php echo $page_align; ?>">
        <div class="blog_page_wraper content_wraper">
        
        	<!-- Page headline -->
        	<h1>Archive</h1>
        	<hr/>
            
        	<?php
			
			//Start works iteration
			if(have_posts()): 
			while(have_posts()):  the_post();
				//Post type
				$post_media_type = get_post_meta( $post->ID, "post_media_type", true );
				?>
	            
	            <div id="post-<?php the_ID(); ?>" <?php post_class('regular-post'); ?>>
	            	<div class="post_date_type">	
	                	<div class="post_type"><?php
							/*style="background-image: url(<?php bloginfo('template_directory'); ?>/img/blog/blog_<?php 
							if($post_media_type == "")
								$post_media_type = "text";
							echo $post_media_type; ?>.png);"*/
							
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
							make_featured_content($post_media_type, $post->ID, 650, true);
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
						
						
						//TITLE
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
	                    
	                    <p class="subHeader" style="<?php echo $styleSpecial; ?>">Posted by <span><?php the_author(); ?></span> in 
	                    
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
	                    <?php echo get_post_meta( $post->ID, "description", true ) ?>
	                    
	                    <a href="<?php the_permalink(); ?>" class="continue-reading-button subHeader dynamic_loading">
	                        <div class="divider">
	                              <div class="line_text"><p><?php echo get_option("esza_trans_continue_reading"); ?></p></div>
	                              <div class="line"></div>
	                         </div>
	                     </a>
	                </div>
	            </div>
	            <div class="clearfix"></div>
            
            <?php endwhile; ?>
			<?php endif; 
			
			global $wp_query;
			$total = $wp_query->max_num_pages;
			$current = max( 1, get_query_var('paged') );
			$big = 999999999; // need an unlikely integer
			
			$pagination = paginate_links( array(
				'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
				'format' => '?paged=%#%',
				'current' => $current,
				'total' => $total,
				'type' => 'array',
				'prev_text' => "Newer posts",
				'next_text' => "Older posts"
			) );
			
            // Restore original Query & Post Data
            wp_reset_query();
            wp_reset_postdata();?>
            
            
        </div>
    </div>
    
	<script>
		require(["jquery", "essenza/Cover"],
			function($){
				$(document).ready(function(){
					contentLoadingOut();
				});
			}
		);
	</script>

</div>
<!-- END PAGE WRAPER -->

<?php
}
?>

<?php get_footer(); ?>