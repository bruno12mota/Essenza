<?php /* Template Name: Masonry Blog */ 

get_header(); 

//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>
	

<!-- START PAGE WRAPER -->
<div id="page-wraper">	
    
    <div class="masonry-blog-wraper">
        <div id="masonry-holder" class="wraper">
        
        </div>
    	<div class="loading_more" style="display: none;"><p><?php echo get_option("esza_trans_loading_more"); ?></p></div>
    </div>

    <!-- FITLER -->
	<?php
    $filterMenu = get_post_meta( $post->ID, "show_filter_menu", true );
    if($filterMenu == "true")
		plusquare_make_filter_menu("included_blog_categories", "category", get_option("esza_trans_all_posts"));
    ?>
    
	<script>
		jQuery(document).ready(function ($){
			require(["essenza/Masonry", "essenza/DynamicLoading", "essenza/Lightbox", "jquery/jquery.easing.1.3"],
				function(Masonry, dynamicLoadingButton, Lightbox){
					var masonryGrid = new Masonry( $( '#masonry-holder' ) , ".masonry-post" , 440, 1, "pq_get_blog_posts", "<?php echo $post->ID; ?>");

					var $works = $( '#masonry-holder' ).find(">.masonry-post");
					<?php 
	    			if($filterMenu == "true"){
	    				plusquare_get_filter_menu_js();
	    			}
	    			?>

					var first = true;
					$(masonryGrid).bind("added", function(){
						$works = $( '#masonry-holder' ).find(">.masonry-post");

						<?php 
	    				if($filterMenu == "true"){
	    					?>
							if(!first)
								update_category(false);
							<?php
						}?>

						Lightbox.getElements();
						runShortcodes();
					});
					$(masonryGrid).bind("furnaceLoaded", function(){
						if(first){
							contentLoadingOut();
							first = false;
						}
					});
			});
		});
	</script>

</div>
<!-- END PAGE WRAPER -->

<?php
}
?>

<?php get_footer(); ?>