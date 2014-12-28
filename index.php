<?php get_header(); 

//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


<!-- START PAGE WRAPER -->
<div id="page-wraper">	
	<?php

	    //page alignment
	    $page_align = 'left';
	?>
    
    <div class="container simple_page_wraper <?php echo $page_align; ?>">
        <div class="blog_page_wraper content_wraper">
        
        	<!-- Page headline -->
        	<h1>Blog</h1>
        	<hr/>
            
        	<?php
			
			//Start works iteration
			if(have_posts()): 
			while(have_posts()):  the_post();
				pq_make_regular_blog_post();
			endwhile;
			endif; 
			
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
			

			?>
            <div class="paginate_simple">
            <?php

			if($current > 1)
				echo $pagination[0];
			if($current < $total)
				echo $pagination[count($pagination)-1];
				
			?>
            </div>
            <?php

            // Restore original Query & Post Data
            wp_reset_query();
            wp_reset_postdata();?>
            
            
        </div>
    </div>
    
	<script>
		jQuery(document).ready(function($){
			var Essenza = require("./Essenza.js");
            var Cover = Essenza.Cover;
            Cover.contentLoadingOut();
		});
	</script>

</div>
<!-- END PAGE WRAPER -->

<?php
}
?>

<?php get_footer(); ?>