<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


<?php 
	global $post; 
	setup_postdata($post);

    if(isset($_GET["rel"])){
        $essenza_page_dynamically_loaded = $_GET["rel"];
    }

    //Check if it's not page change dynamically loaded
    if(isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded == "comments" ){
        if(comments_open())
        comments_template('', true);
        ?>
        <script>
            require(["jquery", "essenza/Cover"],function($){
                $(document).ready(function(){
                    contentLoadingOut();
                });
            });
        </script>
        <?php
    }
    else{
	

    //Check if it's not page change dynamically loaded
    if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "page") ){

	$categories = get_the_category();
	
	$parentPage = plusquare_get_page_to_back("blog.php", $categories, "included_blog_categories");

	if($parentPage == NULL)
		$parentPage = plusquare_get_page_to_back("blog-masonry.php", $categories, "included_blog_categories");

    if($parentPage == NULL)
        $parentPage = plusquare_get_page_to_back("blog-mosaic.php", $categories, "included_blog_categories");
	
    if($parentPage != NULL)
        $linkBack = get_permalink( $parentPage );
    $parentPageCategories = get_post_meta( $parentPage, "included_blog_categories", true );

    //use sidebar
    $useSidebar = get_post_meta( $post->ID, "use_sidebar", true ) == "true"; 

    //page alignment
    $page_align = get_post_meta($post->ID, "page_align", true);

    //post_format_top_offset
    $post_format_top_offset = get_post_meta($post->ID, "post_format_top_offset", true);
?>


<!-- START PAGE WRAPER -->
<div id="page-wraper">	

    <?php plusquare_get_page_css(); ?>

    <div id="page_<?php echo $post->ID; ?>" class="container simple_page_wraper <?php echo $useSidebar ?  "with_sidebar" : ""; ?> <?php echo $page_align; ?>">
        <div class="content_wraper dynamic_layout single_blog_page_wraper">
            <div <?php post_class('regular-post'.(get_post_meta($post->ID, "snap_top", true) === "true" ? " snap_top" : "")); ?>>
                <div class="post_date_type" style="top: <?php echo $post_format_top_offset; ?>px;">	
                	<div class="post_type"><?php
						/*style="background-image: url(<?php bloginfo('template_directory'); ?>/img/blog/blog_<?php 
						if($post_media_type == "")
							$post_media_type = "text";
						echo $post_media_type; ?>.png);"*/
						$post_media_type = get_post_meta( $post->ID, "post_media_type", true );
						
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
                    
                    <div class="posts-navigation">
                        <!-- Next and previous post buttons -->
                        <?php
    					//Next post
    					$next = mod_get_adjacent_post_position('older','post', $parentPageCategories);
    					if($parentPage != NULL && $next != NULL){
    						?>
    						<a class="single_post_button dynamic_loading next" href="<?php echo get_permalink($next); ?>"></a>
    						<?php
    					}
    					
    					//Previous post
    					$previous = mod_get_adjacent_post_position('newer','post', $parentPageCategories);
    					if($parentPage != NULL && $previous != NULL){
    						?>
                            <a class="single_post_button dynamic_loading previous" href="<?php echo get_permalink($previous); ?>"></a>
                            <?php
    					}
                        
    					if($parentPage != NULL){
    						?>
                        	<!-- Return to blog page button -->
                        	<a class="single_post_button dynamic_loading back" href="<?php echo $linkBack; ?>"></a>
                            <?php
    					}
    					?>
                    </div>
                </div>
                <div class="regular-post-inner">

                    <div id="page_replace_after_this" class="page_padded <?php echo get_post_meta($post->ID, "snap_left", true) === "true" ? "snap_left" : ""; ?> <?php echo get_post_meta($post->ID, "snap_right", true) === "true" ? "snap_right " : ""; ?>">
                        
                        <?php
                           //before title check for featured content
    						if($post_media_type != "text"){
    							echo "<div class='featured-content'>";

                                $page_width = get_post_meta($post->ID, "page_width", true);
                                //Fullscreen
                                $fullscreen = get_post_meta($post->ID, "page_fullscreen", true);
                                $fullscreen = $fullscreen === FALSE ? "false" : $fullscreen;

                                //Make featured content (in functions.php)
                                plusquare_make_featured_content($post_media_type, $post->ID, $fullscreen ? null : $page_width, false);
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
                            
                            
                            <!-- Return to blog page button -->
                            <?php
                            if($parentPage != FALSE){
                                ?>
                                <a class="single_post_button dynamic_loading back" href="<?php echo $linkBack; ?>"></a>
                                <?php
                            }
                            ?>
                            
                            <!-- Next and previous post buttons -->
    						<?php
                            //Next post
                            if($parentPage != NULL && $next != NULL){
                                ?>
                                <a class="single_post_button dynamic_loading next" href="<?php echo get_permalink($next); ?>"></a>
                                <?php
                            }
                            
                            //Previous post
                            if($parentPage != NULL && $previous != NULL){
                                ?>
                                <a class="single_post_button dynamic_loading previous" href="<?php echo get_permalink($previous); ?>"></a>
                                <?php
                            }
                            ?>
                        </div>	
                    
                    
                        <h2 class="blog_post_title"><span><?php the_title(); ?></span></h2>
                        <p class="subHeader">Posted by <span style="color:#ffffff;"><?php the_author(); ?></span> in 
                        <?php
                            //get categories
                            $count = 0;
                            if($categories){
                                foreach($categories as $category) {
                                    if($count != 0)
                                        echo ", ";
                                    echo '<span style="color:#ffffff;">'.$category->name.'</span>';
                                    $count++;
                                }
                            }
                        ?>
                        
                        <?php
                        if(comments_open()){
                            ?>
                            <span class="comments<?php comments_number( " no_comments", "", "" ); ?>" style="color:#ffffff;">
                            <i class="esza-comment"></i>
                            <?php 
                                //comments number
                                comments_number( "0 ".get_option("esza_trans_comments", "comments"), "1 ".get_option("esza_trans_comment", "comment"), "% ".get_option("esza_trans_comments", "comments") ); 
                            ?> 
                            </span>
                            <?php
                        }
                        ?>
                        </p>
                    </div>

    <?php
    } //Now starts the content loaded for replacing page
    ?>

                        <div id="page_replace_content_wraper">
                            <?php 
                            the_content() ;
                            ?>

                            <script>
                                require(["jquery", "essenza/Cover"],function($){
                                    $(document).ready(function(){
                                        contentLoadingOut();
                                    });
                                });
                            </script>


                            <div style="padding-bottom:0px;" class="page_padded <?php echo get_post_meta($post->ID, "snap_left", true) === "true" ? "snap_left" : ""; ?> <?php echo get_post_meta($post->ID, "snap_right", true) === "true" ? "snap_right " : ""; ?>">
                    
                                <?php           
                                
                                //Tags
                                $posttags = get_the_tags();
                                if ($posttags) {
                                    echo '<p class="irrelevant_text tags">Tags: ';
                                    $count = 0;
                                    foreach($posttags as $tag) {
                                        if($count != 0)
                                            echo ', ';
                                        echo $tag->name; 
                                        $count ++;
                                    }
                                    echo '</p>';
                                }
                                ?>
                                
                                <div class="clearfix"></div>
                                
                                <!-- Social sharing -->
                                
                                <!-- Google + -->
                                <?php if(get_option("esza_blog_google_like") == "true") echo do_shortcode("[google_plus]"); ?>
                                
                                
                                <!-- Share on Twiter -->
                                <?php if(get_option("esza_blog_twitter_share") == "true") echo do_shortcode("[twitter_button]"); ?>
                                
                                
                                <!-- Facebook Like -->
                                <?php if(get_option("esza_blog_facebook_like") == "true") echo do_shortcode("[facebook_like width='72']"); ?>
                                
                        
                                <div class="paginate page_paginate" style="text-align:right;margin-top: 0px;">
                                <?php

                                wp_link_pages( array(
                                    'before'           => '',
                                    'after'            => '',
                                    'link_before'      => '<span>',
                                    'link_after'       => '</span>',
                                    'next_or_number'   => 'number',
                                    'nextpagelink'     => 'Next page',
                                    'previouspagelink' => 'Previous page',
                                    'pagelink'         => '%',
                                    'echo'             => 1
                                ) );

                                ?>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
    <?php
    //Check if it's not page change dynamically loaded
    if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "page") ){
    ?>                          
                        <div class="page_padded last <?php echo get_post_meta($post->ID, "snap_left", true) === "true" ? "snap_left" : ""; ?> <?php echo get_post_meta($post->ID, "snap_right", true) === "true" ? "snap_right " : ""; ?>">
                    
                            <?php 
                                if(comments_open())
                                    comments_template('', true); 
                            ?>

                        </div>
                </div>
            </div>
        </div>
        

        <?php
        if($useSidebar){
            //SIDEBAR
            ?>
            <div class="sidebar">
                <?php echo plusquare_make_sidebar(get_post_meta( $post->ID, "sidebar", true )); ?>
            </div>
            <?php
        }
        ?>
    </div>
</div>
    <?php
    }
}
//END PAGE WRAPER -->
}
?>


<?php get_footer(); ?>