<?php

	if(isset($_GET["rel"])){
    $essenza_page_dynamically_loaded = $_GET["rel"];
  }

	
  if(isset($essenza_page_dynamically_loaded)){
    wp_footer();
    return;
  }
		
		
	$useFooterTwitter = get_option("esza_footer_twitter");
?>  
  <a class="to_top_btn" href="#" onclick="return false;"><i class="<?php echo get_option("esza_to_top_icon"); ?>"></i></a>

	<div id="content-cover" class="loading">
    	<div class="big-loading">
        	<img src="<?php echo get_template_directory_uri(); ?>/img/loaders/loader.png"  />
        </div>
    </div>

	<div id="mobile_footer"></div>

     <div id="footer">
     	<hr/>
     	<!-- Social_Icons -->
     	<div class="social_icons">
        	<?php
				$socialIcons = array(
					"facebook",
					"google",
					"twitter",
					"vimeo",
					"youtube",
					"pinterest",
					"dribbble",
					"behance",
					"flickr",
					"rss",
					"linkedin",
					"envato",
					"tumblr",
					"instagram"
				);
				
				$has_social = false;
				foreach($socialIcons as $social){
					$option = get_option("esza_".$social."_link");
					if($option != FALSE && $option != NULL && $option != ""){
						$has_social = true;
						echo '<a href="'.$option.'" class="two-image-button socialButton '.$social.'"><div class="inner-image"></div></a>';
					}
				}
			?>
          </div>
          
          <?php
            $useFooterText = false;
            $text = get_option("esza_footer_text");
		  if($useFooterTwitter == "true" && $text!= FALSE && $text != ""){
		  		?>
		  		<div id="footer_optional_text" class="copyright_text">
			  		<?php
			  		if($has_social){
						?>
	                	<p class="sep right">|</p>
	                	<?php
	            	}
	                ?>
	     			<div class="right">
	            		<p><?php echo $text; ?></p>
	          		</div>
          		</div>
                <?php  
                $useFooterText = true;
		  }
		  ?>
     
     	<?php
		if($useFooterTwitter == "true"){
			?>
            <div id="footer_twitter">
                <p><i class="esza-tweet"></i></p>
                
                <div class="tweets">
                    <div class="tweets_holder">
                          <div class="tweet_small"><p>Loading Tweets..</p></div>
                    </div>
                </div>
            </div>
            <?php
		}
		else if($text!= FALSE && $text != ""){
			?>
            <p id="footer_optional_text"><?php echo $text; ?></p>
            <?php	
            $useFooterText = true;
		}
		?>
     
     	
     </div>
     <div class="easyBackground"></div>

	<?php wp_footer(); ?>




</body>
</html>