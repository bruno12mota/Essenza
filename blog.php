<?php /* Template Name: Regular Blog */ 

get_header(); 

//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){

	if(isset($_GET["rel"])){
		$essenza_page_dynamically_loaded = $_GET["rel"];
	}

	$sticky = get_option( 'sticky_posts' );

	//get posts
	$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
	
	//use sidebar
	$useSidebar = get_post_meta( $post->ID, "use_sidebar", true ) == "true"; 
	
	//Post per page
	$postsPerPage = get_post_meta( $post->ID, "posts_per_page", true );
	$postsPerPage = $postsPerPage===FALSE ? 5 : $postsPerPage;
	
	//Pagination Type
	$paginateType = get_post_meta( $post->ID, "pagination_type", true );
	$paginateType = $paginateType===FALSE ? "simple" : $paginateType;

    //page alignment
    $page_align = get_post_meta($post->ID, "page_align", true);

    $tax_query = get_tax_query("included_blog_categories", 'category');

    if($paged == 1 && count($sticky)>0){
		$stickyArgs = array( 
					'post_status' => 'publish',
					'post_type' => 'post', 
        			'post__in' => $sticky);
		$stickyArgs["tax_query"] = $tax_query;
		$stickyposts = new WP_Query( $stickyArgs );
	}
	
	$args = array( 
				'post_status' => 'publish',
				'post_type' => 'post', 
				'paged' => $paged, 
				'posts_per_page' => $postsPerPage,
    			'post__not_in' => $sticky);
				
	
	//Parse categories
	$args["tax_query"] = $tax_query;
	$posts = new WP_Query( $args );

	if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "blog_posts") ){
		$title_display = get_post_meta($post->ID, "title_display", true);
		$title_align = get_post_meta($post->ID, "title_align", true);

		$titleStyle = $title_align == "center" ? "text-align: center;" : ($title_align == "right" ? "text-align: right;" : "");
		?>

		<!-- START PAGE WRAPER -->
		<div id="page-wraper">	

  			<?php 

  			//Get page CSS
  			plusquare_get_page_css(); 
			
  			?>
		    
		    <div id="page_<?php echo $post->ID; ?>" class="container simple_page_wraper <?php echo $useSidebar ?  "with_sidebar" : ""; ?> <?php echo $page_align; ?>">
		        <div class="blog_page_wraper content_wraper">
		        
		        	<?php 
			        if($title_display === "true" || $title_display === ""){
			          	?>
			        	<!-- Page headline -->
			        	<div class="headline" style="<?php echo $titleStyle; ?>">
				        	<h1 id="post-<?php the_ID(); ?>"><?php the_title();?></h1>
				        	<hr/>
				        </div>
				        <?php
			        }?>


		<?php
	}
	?>

		            <div id="blog_posts_wraper">
			        	<?php

			        	//Start sticky posts iteration
			        	if($paged == 1 && count($sticky) > 0){
							if($stickyposts->have_posts()): 
							while($stickyposts->have_posts()):  $stickyposts->the_post();
								//Make post
								pq_make_regular_blog_post();
							endwhile;
							endif; 
						}
						
						//Start works iteration
						if($posts->have_posts()): 
						while($posts->have_posts()):  $posts->the_post();
							//Make post
							pq_make_regular_blog_post();
						endwhile;
						endif; 
						
						$total = $posts->max_num_pages;
						$current = max( 1, get_query_var('paged') );
						$big = 999999999; // need an unlikely integer
						
						if($paginateType == "numerate"){
							?>
			                <div class="paginate blog_paginate">
			                <?php
							echo paginate_links( array(
								'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
								'format' => '?paged=%#%',
								'current' => $current,
								'total' => $total,
								'prev_text' => "<i class='fa-arrow-left'></i>",
								'next_text' => "<i class='fa-arrow-right'></i>"
							) );
							?>
			                </div>
			                <?php
						}
						else if($paginateType == "simple"){
							?>
			                <div class="paginate_simple blog_paginate">
			                <?php
							$pagination = paginate_links( array(
								'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
								'format' => '?paged=%#%',
								'current' => $current,
								'total' => $total,
								'type' => 'array',
								'prev_text' => get_option("esza_trans_newer_posts", "Newer posts"),
								'next_text' => get_option("esza_trans_older_posts", "Older posts")
							) );
							
							if($current > 1)
								echo $pagination[0];
							if($current < $total)
								echo $pagination[count($pagination)-1];
							
							?>
			                </div>
			                <?php
						}
						
			            // Restore original Query & Post Data
			            wp_reset_query();
			            wp_reset_postdata();?>
    
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
    
    <?php
	if(!isset($essenza_page_dynamically_loaded) || (isset($essenza_page_dynamically_loaded) && $essenza_page_dynamically_loaded != "blog_posts") ){
    	?>    
    			</div>
		        <?php
				if($useSidebar){
					//SIDEBAR
					?>
					<div class="sidebar">
            			<?php echo plusquare_make_sidebar( get_post_meta( $post->ID, "sidebar", true ) ); ?>
					</div>
					<?php
				}
		?>
    			</div>

		</div>
		<!-- END PAGE WRAPER -->

<?php
	}
}
?>

<?php get_footer(); 