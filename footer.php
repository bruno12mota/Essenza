
<?php
//Not For IE <8
global $essenza_is_old_ie;
if($essenza_is_old_ie !== true){
?>


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
          "linkedin"
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
                    <?php
                        $tweetId = get_option("esza_twitter_id");
                        $tweetSecret = get_option("esza_twitter_secret");
                        $tweetToken = get_option("esza_twitter_token");
                        $tweetTokenSecret = get_option("esza_twitter_token_secret");
                        
                        if($tweetId == FALSE || $tweetSecret == FALSE || $tweetToken == FALSE || $tweetTokenSecret == FALSE){
                            if(WP_DEBUG)fb::log("An error occured loading twitter app options!");
                        }
                        else{
                            $number = 5;
                            $tweetUser = get_option("esza_footer_twitter_user");
                            
                            $connection = new TwitterOAuth($tweetId, $tweetSecret, $tweetToken, $tweetTokenSecret);
                            $tweets = $connection->get("statuses/user_timeline", array("screen_name" => $tweetUser, "count" => $number));
                            
                            if (is_array($tweets)) {
                              foreach($tweets as $tweet){
                                  //parse tweet date
                                  $time = strtotime($tweet->created_at);
                                  //$newformat = date('jS \of F Y', $time);
                                  
                                  $diff = time() - $time;
                                  
                                  echo '<div class="tweet_small"><p>'.getTweetHtml($tweet).'</p></div>';
                              }
                            }
                        }
                    ?>
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

<?php
} 
?>


</body>
</html>