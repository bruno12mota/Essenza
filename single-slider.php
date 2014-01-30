<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


<?php global $post; ?>

<!-- make it full window -->
<div id="page-wraper-full" class="full-window">
    
	<!-- Make slider -->
    <?php 
		setup_postdata($post);
		the_content(); 
	?>
	
    
    <script type="text/javascript">
    	require(["slider/Slider", "essenza/Cover"],
			function(Slider) {
			 	var slider = new Slider({
					holder:".slider",
					ease:7,
					pathImages: "<?php echo get_template_directory_uri(); ?>/img/ui_slider/",
					height: "100%"
				});

				if(slider.hasLoaded)
					contentLoadingOut();
				else
					$(slider).bind("sliderLoaded", function(){
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

<?php get_footer();