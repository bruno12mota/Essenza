require(["jquery", "jquery/jquery.easing.1.3"],
    function($) {
        //COVER CONTROL
        jQuery(document).ready(	function ($){
			var $tw = $("#footer_twitter");

			if($tw.length > 0){
				var $tweets = $("#footer_twitter").find(".tweets");
				var $tweetsHolder = $("#footer_twitter").find(".tweets_holder");
				var $smallTweets;

				var numTweets;
				var currentTweet;
				var twitter_height;

				$.post(
					adminAjax,
					{
						'action' : 'pq_get_twitter_feed',
						'frontend': true
					},
					function(response){
						$tweetsHolder.html(response);

						$smallTweets = $tweets.find(".tweet_small");

						numTweets = $smallTweets.length;
						currentTweet = 0;
						twitter_height = $tw.height();
			
						setInterval(nextTweet, 4000);
					}
				);

				function nextTweet(){
					currentTweet++;
					if(currentTweet >= numTweets)
						currentTweet = 0;
					$tweetsHolder.stop().animate({"top": -twitter_height*currentTweet}, 500, "easeOutExpo");
				}
			}
			
			
            
			
			var $loader = $(".big-loading");
			var rotation = 0;
			var rotateLoader = function(){
				$loader = $(".big-loading");
				
				rotation+=15;
				if(rotation >= 360)
					rotation = 0;
				
				$loader.css({
					"transform": "rotate("+rotation+"deg)",
					"-ms-transform": "rotate("+rotation+"deg)", /* IE 9 */
					"-moz-transform": "rotate("+rotation+"deg)", /* Firefox */
					"-webkit-transform": "rotate("+rotation+"deg)", /* Safari and Chrome */
					"-o-transform": "rotate("+rotation+"deg)" /* Opera */
				});
				setTimeout(rotateLoader, 40);
			};
			setTimeout(rotateLoader, 40);


			//Footer handling
			var $social_icons = $("#footer .social_icons");
			var $copyright_text = $("#footer .copyright_text");
			var $footer = $("#footer");
			var twitterUsed = $("#footer_twitter").length > 0;
			var hasSocial = $(".social_icons a").length > 0;
			var hasFooterText = $("#footer_optional_text").length > 0;
			function footerResize(){
				var visible = true; 
				if(!$footer.is(":visible")){
					$footer.css("display", "block");
					visible = false;
				}

				var twitterVisible = twitterUsed;
				if(twitterUsed){
					$tw.show();
					if($tw.width() < 350){
						$tw.hide();
						twitterVisible = false;
					}
				}


				$social_icons.removeClass("center");
				$copyright_text.removeClass("center");
				$copyright_text.show();
				if(!twitterVisible){
					if(hasSocial && !hasFooterText)
						$social_icons.addClass("center");
					
					else if(!hasSocial && hasFooterText)
						$copyright_text.addClass("center");

					else{ //has the two
						var availableWidth = $footer.width();
						if($copyright_text.width()+$social_icons.width() > availableWidth){
							$social_icons.addClass("center");
							$copyright_text.hide();
						}
						
					} 
				}

				if(!visible)
					$footer.css("display", "");

			}
			$(window).resize(footerResize);
			footerResize();
		});
	}
);