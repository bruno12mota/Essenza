var esza_portfolio_title_font_size_max = parseInt(directory["esza_portfolio_title_font_size_max"], 10);
var esza_portfolio_title_font_size_min = parseInt(directory["esza_portfolio_title_font_size_min"], 10);

define(["jquery", 
		"utils/utils",
		"other/modernizr"], function($) {
			
	var portfolio = function(){
		jQuery(document).ready($.proxy(function ($){
			this.initiate();
		}, this));
	};
	
	portfolio.prototype = {
		initiate: function(){
			var $works = $("#portfolio .work.new");
			$works.removeClass("new");

			if (Modernizr.touch)
				return;
			
			var timeout;
			$works.data("resized", "false");
			
			var resizeDescription = this.resizeDescription;
			$works = $("#portfolio .work");
			$works.each(function(){
	            var $work = $(this);

				$work.find(".hitarea").hover(function(){
					$work.addClass("over");

					//work over
				    var from = -20;
		            var from1 = -10;
		            
		            if($work.data("resized")=="false")
		            	resizeDescription($work);

					$works.addClass("inactive");
					$work.removeClass("inactive");
		            
		            //Check if it's from the far end
		            if(parseInt($(".description-wraper", $work).css("left")) < 0){
		                from = 20;
		                from1 = 10;
		            }
		            
		            if( !$(".portfolio-wraper").hasClass("above_position") ){
			            //Animate description
						$(".description", $work).stop().css("left", from+"px").animate({
						    "left":"0px"
						}, 800, "easeOutExpo");
						
						//Animate content
						$(".content", $work).stop().css({
						    "left": from1+"px"
					    });

					    //Animate text
					    function textIn(){
			               $(this).animate({
			                    "left":"0px"
			               }, 300, "easeOutExpo");
			            }
		            
			            clearTimeout(timeout);
					    timeout = setTimeout($.proxy(textIn, $(".content", $work)), 100 );
		            }
				    
				}, function(){
					if (Modernizr.touch)
						return false;

					$work.removeClass("over");
					$works.removeClass("inactive");
					//work out
		            clearTimeout(timeout);
				});
			});
		
			$(window).resize(function(){
				$works.data("resized", "false");
			});
		},
		resizeDescription: function($work){
		    //$works.each(function(){
	    	$work.data("resized", "true");
	        var margin = 25;
	        var minMargin = 20;
	        
	        var fontSize = esza_portfolio_title_font_size_max;
	        var minFontSize = esza_portfolio_title_font_size_min;
	            
	        var h1 = $(".description .content h1", $work);
	        var hr = $(".description .content hr", $work);
	        var firstP = $(".description .content p:first", $work);
	        var secondP = $(".description .content p.category", $work);
	        
	        h1.css({
	            "font-size": fontSize+"px",
	            "line-height": fontSize+3+"px"
	        });
	        hr.css("display","");
	        firstP.css("display","");
	        secondP.css("display","");
	        
	        
	        var height = $(".description", $work).height();
	        var $content = $(".description .content", $work);
	        var contentHeight = $content.outerHeight(true);
	        
	        
	        
	        //RESIZE MARGIN
	        if(contentHeight > height){
		         do{
		            $content.css({
		                "margin": margin+"px"
		            });
		            
		            contentHeight = $content.outerHeight(true);
		            
		            if(margin > minMargin)
		                margin-=5;
		            else
		                break;
		        }while(contentHeight > height);
	        }
	        
	        //REMOVE CATEGORY
	        if(contentHeight > height){
	            secondP.css("display","none");
	            
	            //REMOVE PAR
	            contentHeight = $content.outerHeight(true);
	            if(contentHeight > height){
	                
	                secondP.css("display","");
	                firstP.css("display","none");
	                
	                contentHeight = $content.outerHeight(true);
	                
	                if(contentHeight > height){
	                    secondP.css("display","none");
	                    hr.css("display","none");
	                    contentHeight = $content.outerHeight(true);
	                }
	            }
	        }
	        
	        //RESIZE H1 FONT
	        if(contentHeight > height){
	            do{
	                h1.css({
	                    "font-size": fontSize+"px",
	                    "line-height": fontSize+3+"px"
	                });
	                
	                contentHeight = $content.outerHeight(true);
	                fontSize -= 1;
	            }while(contentHeight > height && fontSize >= minFontSize);
	            
	            
	        }


	        if($content.css("text-align") == "center"){
	        	var $description = $(".description", $work);

	        	$content.css("top", ($description.height() - margin*2)/2 - $content.outerHeight()/2 - 3 );
	        	$content.css("left", "-1px");
	        }

	       // });     
		}
	}
	return portfolio;
});