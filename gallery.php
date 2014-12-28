<?php /* Template Name: Gallery */ 

get_header(); 

//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>

<?php
	//Get options
	
	//filter
    $filterMenu = get_post_meta( $post->ID, "show_filter_menu", true );

    //max width
    $max_thumb_width = get_post_meta( $post->ID, "max_thumb_width", true );
    $max_thumb_width = $max_thumb_width === FALSE ? "400" : $max_thumb_width;
?>



<!-- START PAGE WRAPER -->
<div id="page-wraper">	

    <div class="portfolio-wraper">
	    <div id="gallery-holder" class="gallery_page">
	        
	        
	    </div>
		<div class="loading_more" style="display: none;"><p><?php echo get_option("esza_trans_loading_more"); ?><!--<img class="small_loading_gif" src="<?php echo get_template_directory_uri(); ?>/img/loaders/loading.gif"></img>--></p></div>
	</div>
    
    <!-- FITLER -->
	<?php
    if($filterMenu == "true")
		plusquare_make_filter_menu("included_gallery_categories", "galleries", get_option("esza_trans_all_items"));
    ?>
    
	<script>
		jQuery(document).ready(function ($){
			var Essenza = require("./Essenza.js");
			var Masonry = Essenza.Masonry;
			var Lightbox = Essenza.Lightbox;
			var Cover = Essenza.Cover;

			//Masonry grid
			var masonryGrid = new Masonry( $( '#gallery-holder' ) , ".gallery-item" , <?php echo $max_thumb_width; ?>, 2, 'pq_get_gallery_posts', "<?php echo $post->ID; ?>");
			
			var $works = $( '#gallery-holder' ).find(">.gallery-item");
			
			<?php 
			if($filterMenu == "true"){
				plusquare_get_filter_menu_js();
			}
			?>

			var first = true;
			$(masonryGrid).bind("added", function(){
				$works = $( '#gallery-holder' ).find(">.gallery-item");

				<?php 
				if($filterMenu == "true"){
					?>
					if(!first)
						update_category(false);
					<?php
				}?>

				Lightbox.getElements();
			});

			$(masonryGrid).bind("furnaceLoaded", function(){
				if(first){
					Cover.contentLoadingOut();
					first = false;

					<?php
					if(isset($_GET["item"])){
						?>
						var url = "<?php echo get_gallery_item_content($_GET['item']); ?>";
						var type = "<?php echo get_post_meta($_GET['item'], 'item_media_type', true); ?>";
						var description = $('<?php echo get_gallery_item_description($_GET['item']); ?>');
						Lightbox.open(url, type, undefined, undefined, description);
						<?php
					}
					?>
				}
			});
		});
	</script>
   
</div>

<?php
}
?>

<?php get_footer(); ?>