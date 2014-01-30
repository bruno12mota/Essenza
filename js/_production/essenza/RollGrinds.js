
plusquare_runtime_javascript = function(dynamic_loaded, animate_scroll, to_scroll){

	//Shortcodes
	require(["jquery", "essenza/Shortcodes"],
		function($){
			$(document).ready(function(){
				runShortcodes();

				var $sidebar = $(".sidebar");
				if($sidebar.length > 0){
					var sidebarHeight = $sidebar.find(".row").outerHeight();
					if( sidebarHeight > $(".content_wraper").height()){
						$(".content_wraper").css("height", sidebarHeight+70+"px");
					}
				}
			});
		}
	);

	//Dynamic loading buttons
	require(["essenza/DynamicLoading"],
		function(dynamicLoadingButton){
			$(document).ready(function(){
				$(".dynamic_loading").each(function(){
					new dynamicLoadingButton($(this));
				});

				$(".blog_paginate a.page-numbers").each(function(){
					new dynamicLoadingButton($(this), $("#blog_posts_wraper"), $(".blog_page_wraper .headline"), "blog_posts");
				});

				$(".page_paginate a").each(function(){
					new dynamicLoadingButton($(this), $("#page_replace_content_wraper"), $("#page_replace_after_this"), "page");
				});
				
				$(".comments_paginate a.page-numbers").each(function(){
					new dynamicLoadingButton($(this), $("#comments_replace_content_wraper"), $("#comments_replace_after_this"), "comments");
				});
				
				$("a").each(function(){
					if(!$(this).hasClass("dynamic_binded") && !$(this).hasClass("lightbox")){
						new dynamicLoadingButton($(this));
					}
				});
			});
		}
	);

	//Lightbox
	require(["jquery", "essenza/Lightbox"],
		function($, Lightbox){
			$(document).ready(function(){
				Lightbox.getElements();
			});
		}
	);

	//To top buttons
	require(["jquery", "other/modernizr", "jquery/jquery.easing.1.3"], function($){
		jQuery(document).ready(function() {
			var $to_top = $(".to_top_btn");
			var $top_button = $(".to_top_btn");

			if(Modernizr.touch || !vars.mw_scroll == "true"){
				$to_top.click(function(){
					$('html, body').animate({"scrollTop":0}, 300, "easeOutExpo");
					
					return false;
				});

				if(dynamic_loaded === true){
					if(animate_scroll === true)
						$(window).animate({"scrollTop":to_scroll}, 400, "easeOutExpo");
					else
						$(window).scrollTop(to_scroll);
				}

				function top_button_check(){
					var top = $(this).scrollTop();
					if(top > 0)
						$top_button.addClass("active");
					else
						$top_button.removeClass("active");
				}
				

				$(window).scroll(top_button_check);
				$(window).resize(top_button_check);
			}

			if($("#page-wraper").height() < $(".easyBackground").height())
				$to_top.removeClass("active");
		});
	});


	//Window scroll with ease
	require(["jquery", "other/modernizr", "jquery/jquery.mousewheel.min", "jquery/jquery.easing.1.3"], function($){
		$(document).ready(function() {  
			if(!Modernizr.touch && vars.mw_scroll == "true"){
				var currentTop = $(window).scrollTop();
				var current = currentTop;
				var wheel = false;
				var wheelInterval;
				var scrollStepInt;

				vars.mw_ease = parseInt(vars.mw_ease, 10);

				function scrollStep(){
	            	var sum = (currentTop - current)/vars.mw_ease;
	            	console.log(current);
	            	console.log(currentTop);

	            	current += sum;

	            	if(Math.round(sum) == 0){
	            		wheel = false;
			        	clearInterval(scrollStepInt);
			        	scrollStepInt = false;
	            	}

					$('html, body').scrollTop(current);
				}
				
				if(dynamic_loaded === true){
					if(animate_scroll === true){
						wheel = true;
						currentTop = to_scroll;
						if(!scrollStepInt)
			        		scrollStepInt = setInterval(scrollStep, 33);
					}
					else{
						currentTop = to_scroll;
						current = to_scroll;
						$(window).scrollTop(to_scroll);
					}
				}
				else{
					currentTop = $(window).scrollTop();
					current = currentTop;
				}

				//$(window).scrollTop() > $(document).height() - $(window).height() - 500

				
				

				$("#page-wraper").mousewheel(function(event, delta){
					wheel = true;

			        currentTop = currentTop - delta*vars.mw_amount;
			        var maxTop = $(document).height() - $(window).height();

			        if(currentTop < 0)
			        	currentTop = 0;
			       	if(currentTop > maxTop)
			        	currentTop = maxTop;

			        if(!scrollStepInt){
			        	clearInterval(scrollStepInt);
			        	scrollStepInt = setInterval(scrollStep, 33);
			        }

			        event.preventDefault();
			        return false;
				});

				var $top_button = $(".to_top_btn");
				function top_button_check(){
					var top = $(window).scrollTop();
					if(top > 0)
						$top_button.addClass("active");
					else
						$top_button.removeClass("active");
				}
				

				$(window).resize(top_button_check);
				$(window).scroll(function(e){
					top_button_check();

					if(wheel)
						return;

					var top = $(window).scrollTop();
					current = top;
					currentTop = top;
				});

				$top_button.click(function(){
					wheel = true;
					currentTop = 0;

			        if(!scrollStepInt){
			        	clearInterval(scrollStepInt);
			        	scrollStepInt = setInterval(scrollStep, 33);
			        }
					
					return false;
				});
			}
		});
	});
}
plusquare_runtime_javascript();
$("body").addClass("runtime_javascript_ready");