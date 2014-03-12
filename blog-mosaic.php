<?php /* Template Name: Mosaic Blog */ ?>

<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>
	

<!-- START PAGE WRAPER -->
<div id="page-wraper">	
    
    <div class="mosaic-blog-wraper">
        <div id="mosaic-holder" class="wraper">
        
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
			require(["essenza/Masonry", "essenza/DynamicLoading", "jquery/jquery.easing.1.3"],
				function(Masonry, dynamicLoadingButton){
					var masonryGrid = new Masonry( $( '#mosaic-holder' ) , ".mosaic-post" , 440, 1, "pq_get_blog_mosaic_posts", "<?php echo $post->ID; ?>");

					var $posts;
					var $works = $( '#mosaic-holder' ).find(">.mosaic-post");
					
					<?php 
	    			if($filterMenu == "true"){
	    				plusquare_get_filter_menu_js();
	    			}
	    			?>

					var first = true;
					$(masonryGrid).bind("added", function(){
						$posts = $( '#mosaic-holder' ).find(".mosaic-post");
						$works = $posts;

						var $new = $(".dynamic_loading.new");
						$new.each(function(){
							new dynamicLoadingButton($(this));
						});
						$new.removeClass("new");

						if(!first)
							update_category(false);

						if (!Modernizr.touch)
							$posts.hover(onOver, onOut);
					});
					$(masonryGrid).bind("furnaceLoaded", function(){
						if(first){
							contentLoadingOut();
							first = false;
						}
					});

					function onOver(){
						$posts.addClass("inactive");
						$(this).removeClass("inactive");
					}

					function onOut(){
						$posts.removeClass("inactive");
					}

					function reposContents(){
						$posts = $(".mosaic-post");

						$posts.each(function(index, post){
							var $post = $(post);
							var height = $post.height();

							var $content = $post.find(".mosaic-content");
							var perc = parseFloat($content.data("position"), 10)/100;

							var availableHeight = height-$content.outerHeight();

							var top = availableHeight*perc;
							$content.css("top", top+"px");
						});
					}

					$(masonryGrid).bind("gridResize", reposContents);
			});
		});
	</script>

</div>
<!-- END PAGE WRAPER -->

<?php
}
?>

<?php get_footer(); ?>