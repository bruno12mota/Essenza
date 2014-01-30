<?php /* Template Name: Portfolio  */ ?>

<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


<?php
    $descPosition = get_post_meta( $post->ID, "description_position", true );
?>
     
<!-- START PAGE WRAPER -->
<div id="page-wraper">
    
    <div class="portfolio-wraper <?php echo $descPosition; ?>">
	    <div class="wraper" id="portfolio">
	    
	    </div>
		<div class="loading_more" style="display: none;"><p><?php echo get_option("esza_trans_loading_more"); ?><!--<img class="small_loading_gif" src="<?php echo get_template_directory_uri(); ?>/img/loaders/loading.gif"></img>--></p></div>
	</div>

	<!-- FITLER -->
	<?php
    $filterMenu = get_post_meta( $post->ID, "show_filter_menu", true );
    if($filterMenu == "true")
		plusquare_make_filter_menu("included_portfolio_categories", "portfolio_category", get_option("esza_trans_all_projects"));
    ?>
    
    
    <script>
		require(["jquery", "essenza/Portfolio", "essenza/Masonry", "essenza/DynamicLoading"], function($, portfolio, Masonry, dynamicLoadingButton){
			$(document).ready(function(){
				var $portfolio = $( '#portfolio' );
				var $works = $portfolio.find(">.work");
				
				var port = new portfolio();
				var masonryGrid = new Masonry( $portfolio , ".work" , 400, 2, 'pq_get_portfolio_posts', "<?php echo $post->ID; ?>");
				

				<?php plusquare_get_filter_menu_js(); ?>


				var first = true;
				$(masonryGrid).bind("added", function(){
					var $new = $(".dynamic_loading.new");
					$new.each(function(){
						new dynamicLoadingButton($(this));
					});
					port.initiate();

					$works = $portfolio.find(">.work");
					//update_category();
					//masonryGrid.resize();

					if(first){
						if(masonryGrid.loadingFurnace)
							$(masonryGrid).bind("furnaceLoaded", contentLoadingOut);
						else
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

<?php get_footer();