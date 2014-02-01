<?php get_header(); ?>

<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


<?php 

global $post; 

$categories = plusquare_get_the_category_bytax($post->ID, 'portfolio_category');
$parentPage = plusquare_get_page_to_back("portfolio.php", $categories, "included_portfolio_categories");

if($parentPage != NULL){
	$linkBack = get_permalink( $parentPage );
	$parentPageCategories = get_post_meta( $parentPage, "included_portfolio_categories", true );
}

?>
<div id="page-wraper-full" class="full-window">
    <?php 
		//Get images for this work
		$attachments_str = get_post_meta( $post->ID, "images", true );
		$attachments = explode(",", $attachments_str);
		
		//Get images sizing
		$sizings_str = get_post_meta( $post->ID, "images_sizing", true );
		$sizings = explode(",", $sizings_str);
		
		//Get autoplay options
		$autoplay = get_post_meta( $post->ID, "autoplay", true );
		$autoplay = $autoplay===FALSE ? "false" : $autoplay;
		
		$kenBurns = get_post_meta( $post->ID, "use_kenburns", true );
		$kenBurns = $kenBurns===FALSE ? "false" : $kenBurns;
		
		$autoplay_time = get_post_meta( $post->ID, "autoplay_time", true );
		$autoplay_time = $autoplay_time===FALSE ? "10" : $autoplay_time;
		
		$kenburns_time = get_post_meta( $post->ID, "kenburns_time", true );
		$kenburns_time = $kenburns_time===FALSE ? "10" : $kenburns_time;
		
		$portfolio_work_numbering = get_option( "esza_portfolio_work_numbering" );
		$portfolio_work_numbering = $portfolio_work_numbering===FALSE ? "works" : $portfolio_work_numbering;

		$item_close_link = get_post_meta( $post->ID, "item_close_link", true );
		$item_close_link = $item_close_link===FALSE ? "" : $item_close_link;
		
		$slider_transition_duration = get_option( "esza_slider_transition_duration" );
		$slider_transition_type = get_option( "esza_slider_transition_type" );
		$slider_transition_ease = get_option( "esza_slider_transition_ease" );
		$slider_transition_starting = get_option( "esza_slider_transition_starting" );

		if($parentPage != NULL){
			$previous_post = mod_get_adjacent_post_position('newer', 'portfolio', $parentPageCategories, "portfolio_category");
			$next_post = mod_get_adjacent_post_position('older', 'portfolio', $parentPageCategories, "portfolio_category");
		}
		
		if(count($attachments) > 0):
	?>
    
	<!-- Make slider if 2 or more attachments -->
    <div id='slider<?php echo $post->ID; ?>' class="slider" rel="height:100%; buttonsHide:false; showArrows:true; showPlayPauseButton:<?php echo $autoplay; ?>; autoplay:<?php echo $autoplay; ?>; buttonsVO:-20; PlayPauseVO:-17; PlayPauseHO:-21; ">
    	<div class="slides">
    	<?php 
		$counter = 0;
		foreach($attachments as $attachment){ 
			$firstChar = $attachment{0};
			$isVideo = $firstChar == 'y' || $firstChar == 'v' || $firstChar == 'd';
			
			//VIDEO
			if($isVideo){
				$backgroundType = $firstChar == 'y' ? "youtube" : ($firstChar == 'v' ? "vimeo" : "dailymotion");
				$backgroundId = substr($attachment, 1);
				
				list($backgroundId, $backgroundThumb) = explode(":", $backgroundId);
			}
			//IMAGE
			else{
				$backgroundType = "image";
				$backgroundId = $attachment;
			}
			
			$imageSizing = $sizings[$counter];
			
			?>
            <div class="slide" rel='<?php echo $kenBurns == "false" ? "kbStartTop:0.5; kbStartLeft:0.5; " : ""; ?>useKenBurns:<?php echo $kenBurns; ?>; kbDuration:<?php echo $kenburns_time; ?>; slideDuration:<?php echo $autoplay_time; ?>; backgroundType:<?php echo $backgroundType; ?>; backgroundId:<?php echo $backgroundId;?>;<?php echo $isVideo?" backgroundThumb:".$backgroundThumb.";":""; ?> sizing:<?php echo $imageSizing; ?>; '></div>
            <?php
			$counter++;
		} 
		?>
		</div>
    
   
	    <!-- Go back button -->
		<?php
		if($parentPage != NULL || $item_close_link != ""){
			echo '<a class="close_button dynamic_loading" href="'.($item_close_link != "" ? $item_close_link : $linkBack).'"><div class="inside_icon close_ico"></div></a>';
		}
		?>
    </div>
    
    <?php endif; ?>
	
	
	<?php
	
	$fromLeft = get_post_meta( $post->ID, "horizontal_position", true );
	$fromTop = get_post_meta( $post->ID, "vertical_position", true );
	
	//opened at start?
	$opened = get_post_meta( $post->ID, "description_opened", true );
	?>

	<!-- control pannel -->
	<div class="work-panel <?php echo $opened == "true" ? "active" : ""; ?>" style="top:<?php echo $fromTop; ?>%;left:<?php echo $fromLeft; ?>%;">
    	<?php

		if(isset($parentPageCategories)){
			$position = intval(get_post_meta($post->ID, "position", true));
			$info = get_number_posts_by_category('portfolio', 'portfolio_category', $parentPageCategories, $position);

			//Get position
			$position = intval($info["position"]);
			if($position < 10)
				$position = "0".$position;
			
			//Number to show	
			$numAttachments = $info["total"];
			if($numAttachments < 10)
				$numAttachments = "0".$numAttachments;
		}


		$description = do_shortcode(get_post_meta( $post->ID, "item_desc", true ));

		if($description != ""){
		?>
        
        <!-- Expanded part -->
        <div class="work-expanded">
        	<div class="expanded-holder">
            	<div class="item_header">
            		<?php
            		if($parentPage != NULL){
            			?>
            			<p class="workMenuText"><span class="workMenuNumber"><?php echo $portfolio_work_numbering == "works" ? $position : "01"; ?></span><span>/<?php echo $numAttachments; ?></span></p> 
            			<?php
            		}
            		?>
                    <p class="workMenuText big"><?php the_title(); ?></p>
                    <hr class="small"/>
                </div>
                <div class="item_desc">
                	<div class="item_desc_content" style="<?php echo $parentPage != NULL ? '' : 'margin-bottom: 15px;' ?>">
                		<?php echo $description; ?>
        			</div>
        
                    <!-- Scrollbar-->
                    <div class="scrollbar">
                        <a href="#" onclick="return false;"></a>
                    </div>
                </div>
            </div>
        
        	<!-- Close button -->
            <a href="#" class="panel-button close-panel"></a>
            
        </div>
        <?php
    	}
    	?>
        
        
        <!-- Menu -->
        <?php
        if($description != ""){
	    	?>
	        <a href="#" class="panel-button expand-panel for_mobile" style="float:left; display:none;"></a>
	        <?php
    	}
    	?>
    	<p class="workMenuText">
    		<?php
        		if($parentPage != NULL){
        			?>
    				<span class="workMenuNumber"><?php echo $portfolio_work_numbering == "works" ? $position : "01"; ?></span><span>/<?php echo $numAttachments; ?></span><span class="workMenuLine"> - </span>
    				<?php
				}
				?>
				<span class="workMenuTitle"><?php the_title(); ?></span>
		</p>
        
         <!-- Add next and previous project buttons -->
	    <?php
		if($parentPage != NULL){

			//Next Post link
			if (!empty( $next_post )): ?>
			  <a class="panel-button right-arrow dynamic_loading" href="<?php echo get_permalink( $next_post->ID ); ?>"></a>
			<?php endif; ?>
	    
		    <?php
			//Previous Post link
			if (!empty( $previous_post )): ?>
			  <a class="panel-button left-arrow dynamic_loading" href="<?php echo get_permalink( $previous_post->ID ); ?>"></a>
			<?php endif; 
		} ?>


        <?php
        if($description != ""){
	    	?>
	        <a href="#" class="panel-button expand-panel"></a>
	        <?php
    	}
    	?>
        
    </div>
    
	<?php 
		
	$background_color = get_post_meta( $post->ID, "background_color", true );
	$background_color = $background_color===FALSE ? "#cccccc" : $background_color;
	?>
 
    <script type="text/javascript">
    	require(["jquery", "slider/Slider", "other/Dragable", "essenza/Cover"],
			function($, Slider, Dragable) {
				$(document).ready(function(){
				var $pageWraperFull = $("#page-wraper-full");
				
				//Slider
				var $slider = $("#slider<?php echo $post->ID; ?>");
				
				//Work Panel
				var $workPanel = $(".work-panel");
				
				//Work Expanded
				var $workExpanded = $workPanel.find(".work-expanded");
				var hasDescription = $workExpanded.length > 0;
				if(hasDescription){
					var $toDrag = $workExpanded.find(".expanded-holder");
					var $scrollbar = $workExpanded.find(".scrollbar");
					var $item_header = $workExpanded.find(".item_header");
					var $item_desc = $workExpanded.find(".item_desc");
					var $item_desc_content = $workExpanded.find(".item_desc_content");
				}
				
				
				//Small Menu
				var $workMenuNumber = $workPanel.find(".workMenuNumber");
				var $workMenuTitle = $workPanel.find(".workMenuTitle");
				var $workMenuLine = $workPanel.find(".workMenuLine");
				var $workMenuText = $workPanel.find('>.workMenuText');
				var $rightArrow = $(".work-panel .right-arrow");
				var $leftArrow = $(".work-panel .left-arrow");
				var expandButtons = $workPanel.find('.expand-panel');
				var expandButtonMobile = $workPanel.find('.expand-panel.for_mobile');
				
				
				//Other variables
				var numSlides = ($slider.find("div")).length;
				var numberButtons = numSlides <= 1 ? 1 : 3;
				var buttonsWidth = 41*numberButtons;
				var titleWidth = $workMenuText.outerWidth();
				var totalPanelWidth = buttonsWidth + titleWidth;
				var userTop = <?php echo $fromTop; ?> /100;
				var userLeft = <?php echo $fromLeft; ?> /100;
				if(hasDescription)
				var expandedHeight = $workExpanded.height();
				
				//Make description dragable
				if(hasDescription)
				var dragableDescription = new Dragable($item_desc, $item_desc_content, true, false);
				
				
				//Make Slider
			 	var slider = new Slider({
					holder:"#slider<?php echo $post->ID; ?>",
					ease:7,
					background_color: "<?php echo $background_color; ?>",
					"slider_transition_duration": <?php echo $slider_transition_duration; ?>  ,
	                "slider_transition_type": "<?php echo $slider_transition_type; ?>"  ,
	                "slider_transition_ease": "<?php echo $slider_transition_ease; ?>"  ,
	                "slider_transition_starting": <?php echo $slider_transition_starting; ?>
				}, true);
				$(slider).bind("sliderLoaded", function(){
            		contentLoadingOut();
            		$workPanel.show().fadeTo(400, 1);
				});

				$(slider).bind("video_play", function(){
					$workPanel.stop().fadeTo(500, 0);
				});

				$(slider).bind("video_close", function(){
					$workPanel.stop().fadeTo(500, 1);
				});
				
				
				//Small Menu Events
				/*$rightArrow.click( $.proxy(slider.nextSlide, slider) );
				$leftArrow.click( $.proxy(slider.previousSlide, slider) );
				if(numSlides <= 1){
					$rightArrow.css("display", "none");
					$leftArrow.css("display", "none");
				}*/
				
				
				//Check previous description opened var
				if(window['IS_DESC_OPENED'] != undefined) {
					//User has changed description opened state before
					if(IS_DESC_OPENED == "true" && hasDescription)
						expandDescription();
					else
						collapseDescription();
				}
				
				//Update it
				/*if( $workPanel.hasClass("active") )
					IS_DESC_OPENED = "true";
				else
					IS_DESC_OPENED = "false";*/
					


				//If no arrows take description a bit lower
				if($rightArrow.length == 0 && $leftArrow.length == 0)
					$workExpanded.css("margin-bottom", "-41px");
				
				
				
				
				//Expand Description
				function expandDescription(){
					if(!hasDescription)
						return false;

					//Add active class
					$workPanel.addClass("active");
					IS_DESC_OPENED = "true";
					onResize();
					
					$toDrag.stop().css("top", "15px").animate({
						"top": "0px"
					}, 300, "easeOutExpo");
					
					return false;
				}
				//Collapse Description
				function collapseDescription(){
					if(!hasDescription)
						return false;

					//Remove active class
					$workPanel.removeClass("active");
					IS_DESC_OPENED = "false";
					$workExpanded.css({
						"height": "0"
					});
					$toDrag.css({
						"top": "",
						"left": ""
					});
					onResize();
					$(window).trigger("scroll");

					return false;
				}
				if(hasDescription){
					$(".work-panel .expand-panel").click( expandDescription );
					$(".work-expanded .close-panel").click(collapseDescription);
					$(".work-expanded .close-panel").bind("vclick", collapseDescription);
				}
				
				
				
				
				//Bind slide change to update text
				if(<?php echo $portfolio_work_numbering != "works" ? "true" : "false" ?>){
					$(slider).bind("changeSlide", function(e, num){
						num++;
						$workMenuNumber.text(num < 10 ? ("0"+num) : (num));
					});
				}
				
				
				
				//On Resize Event
				var bodymargins = parseInt("<?php echo get_option('esza_site_border_size'); ?>", 10);
				function onResize(){
					/*$pageWraperFull.css({
						"position": "",
						"bottom": "",
						"left":"",
						"right":""
					});*/
					
					var windowWidth = $(window).width() - bodymargins*2;
					var windowHeight = $pageWraperFull.height();
					
					if(windowWidth < 300)
						$workPanel.css("min-width", "0");
					else 
						$workPanel.css("min-width", "300px");
					
					$workMenuTitle.css("display", "");
					$workMenuLine.css("display", "");
					if(hasDescription){
						$scrollbar.css("display", "none");
						$item_desc.css("height", "auto");
					}
					titleWidth = $workMenuText.outerWidth();
					totalPanelWidth = buttonsWidth + titleWidth;
					
					expandButtons.css("display", "");
					expandButtonMobile.css("display", "none");
					
					if($workPanel.hasClass("active") && hasDescription)
						$workExpanded.css("height", "auto");
					
					var allowedWidth = windowWidth - totalPanelWidth;
					var allowedHeight = windowHeight - $workPanel.height();
					
					var sizeAvailable;
					
					//Small Window
					if(windowWidth < 500 || windowWidth < totalPanelWidth){
						//Change to mobile version
						$workPanel.addClass("mobile");
						
						if(hasDescription)
						dragableDescription.remove();
						
						//Remove position 
						$workPanel.css({
							"top":"",
							"left":""
						});
						
						allowedHeight = windowHeight - 41;
						sizeAvailable = allowedHeight;
						
						//Update Slider's size
						var sliderHeight = ((allowedHeight/windowHeight)*100);
						if(sliderHeight<0 || $workPanel.hasClass("active"))
							sliderHeight=0;
						slider.updateSize(false, sliderHeight+"%", true);
					}
					
					//Big Window
					else{
						//Not mobile version
						$workPanel.removeClass("mobile");
						
						if(hasDescription)
						dragableDescription.rebind();
						
						//Change position according to user options
						$workPanel.css({
							"top":userTop*allowedHeight+"px",
							"left":userLeft*allowedWidth+"px"
						});
						sizeAvailable = userTop*allowedHeight;
						
						//Update Slider's size
						slider.updateSize(false, "100%", true);
					
						//Description Size Handling
						if($workPanel.hasClass("active") && hasDescription){
							var descriptionHeight = $workExpanded.height();
							var maxHeight = 370;
							
							if(descriptionHeight > maxHeight){
								descriptionHeight = maxHeight;
								$workExpanded.css("height", maxHeight+"px");
								$scrollbar.css("display", "");
							}
							
							if(descriptionHeight > sizeAvailable){
								descriptionHeight = sizeAvailable;
								$workExpanded.css("height", sizeAvailable+"px");
								$scrollbar.css("display", "");
							}
							
							$item_desc.css("height", descriptionHeight-$item_header.outerHeight()-15);
							dragableDescription.resize();

							if(!dragableDescription.enabled)
								$scrollbar.css("display", "none");
							
						}
					}
						
					//Check if title is overflowing
					if(windowWidth < totalPanelWidth){
						$workMenuTitle.css("display", "none");
						$workMenuLine.css("display", "none");
						
						expandButtons.css("display", "none");
						expandButtonMobile.css("display", "");
					}
					
				}
				$(window).resize(onResize);
				onResize();
				onResize();
				})
			}
		);
    </script>

</div>
<!-- END PAGE WRAPER -->

<?php
}
?>

<?php get_footer(); ?>