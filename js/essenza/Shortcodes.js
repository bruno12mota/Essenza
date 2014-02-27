define(["jquery", "essenza/MusicPlayer"], function($, MusicPlayer) {
    var tabsTweenSpeed = 150;
    var accordionTweenSpeed = 150;
	
	
	//TABS
	var Tabs = function($tabs){
		jQuery(document).ready($.proxy(function ($){
		    this.current = -1;
		    
		    this.$contents = $(".tabs-content", $tabs);
	        this.$titles = $(".tabs-titles", $tabs);
	        
	        //CONTENT
	        this.tabs = new Array();
	        $(".tab", this.$contents).each($.proxy(function(index, tab){
	            this.tabs.push(new Tab( $(tab) ));
	        }, this));
	        
	        //TITLES
	        this.links = new Array();
	        $(">a", this.$titles).each($.proxy(function(index, obj){
	            var $button = $(obj);
	            $button.attr("rel", index);
	            $button.click($.proxy(this.tabClick, this));
	            
	            this.links.push( $button );
	            
	        }, this));
	        
	        //initial
	        this.changeTab(0);
        }, this));
	}
	Tabs.prototype = {
	    tabClick: function(e){
	        var rel = parseInt($(e.target).attr("rel"), 10);
	        
	        this.changeTab(rel);
	        
	        return false;
	    },
	    changeTab: function(to){
	        if(this.current != -1){
                this.tabs[this.current].close();
                this.links[this.current].removeClass("active");
	        }
            
            var height = this.tabs[to].open();
            this.links[to].addClass("active");
            
            this.current = to;
            
            this.$contents.animate({
                "height":height
            }, tabsTweenSpeed);
	    }
	}
	
	var Tab = function($tab){
	    this.$tab = $tab;
	    
        this.$tab.fadeTo(0, 0);
        this.$tab.css({
        	"display": "none",
        	"opacity": 0
        });
	}
	Tab.prototype = {
        open: function(){
            this.$tab.stop().css("display", "block").delay(tabsTweenSpeed).fadeTo(tabsTweenSpeed, 1);
            
            return this.$tab.height();
        },
        close: function(){
            this.$tab.stop().fadeTo(tabsTweenSpeed, 0 , function(){$(this).css("display", "none");});
        }
    }
	//TABS END
	
	
	//ACCORDION
	var Accordion = function($accordion){
	    this.multiple = $accordion.attr("data-multiple");
	    
	    //each accordion element
	    this.elements = new Array();
	    $("li", $accordion).each($.proxy(function(index, obj){
	        this.elements.push(new AccordionElement($(obj), index, $.proxy(this.changeTab, this)));
	    }, this));
	}
	Accordion.prototype = {
	    changeTab: function(num){
	        if(this.multiple == "false"){
                for(var i = 0; i < this.elements.length ; i++)
                    if(i != num)
                    this.elements[i].close();
	        }
	        
	    }
	}
	
	var AccordionElement = function($element, num, onOpen){
	    this.opened = false;
        this.number = num;
        this.onOpen = onOpen;
	    
	    this.iconNormal = "fa-angle-down";
	    this.iconActive = "fa-angle-up";
	    
	    this.$head = $(">a", $element);
	    this.$content = $(">.content", $element);
	    this.$icon = $(">i", $element);
	    
	    if(!this.opened)
            this.$content.css("display", "none");

        this.$head.click($.proxy(this.toogle, this));
	}
	AccordionElement.prototype = {
	    close: function(){
	        if (!this.$content.is(':hidden'))
                this.$content.slideToggle(accordionTweenSpeed, $.proxy(this.onHidingChange, this));
	        
	    },
        toogle: function(e){
            e.preventDefault();
            
            if (this.$content.is(':hidden'))
                this.onOpen(this.number);
                
            this.$content.not(':animated').slideToggle(accordionTweenSpeed, $.proxy(this.onHidingChange, this));
            this.$icon.fadeTo(accordionTweenSpeed, 0);
            
            return false;
        },
        onHidingChange: function(){
            if (this.$content.is(':hidden')){
                this.$head.removeClass("active");
                this.$icon.removeClass(this.iconActive).addClass(this.iconNormal).fadeTo(accordionTweenSpeed, 1);
            }
            else {
                this.$head.addClass("active");
                this.$icon.removeClass(this.iconNormal).addClass(this.iconActive).fadeTo(accordionTweenSpeed, 1);
            }
            
            return false;
        }
    }
	


    //Galleries arrange
    function resizeGalleries(){
        $(".blog_gallery").each(function(){
        	var $this = $(this);

        	var width = $this.width();

        	var $items = $this.find(">a");
        	var numItems = $items.length;

        	var eachItemWidth = parseInt($this.attr("data-width"), 10);
        	var eachItemHeight = parseInt($this.attr("data-height"), 10);
        	var ratio = eachItemWidth/eachItemHeight;

        	//check leftover
        	var fits = Math.floor(width/eachItemWidth);
        	var leftover = width - (fits * eachItemWidth);

        	//Check if can rescale
        	if(leftover > fits){
        		//one more
        		var sizeToBe = Math.floor(width / (fits+1)) - 1 ;

        		$items.css({
        			"width": sizeToBe+"px",
        			"height": Math.round(sizeToBe/ratio)+"px"
        		});
        	}
        });
    }
    $(window).resize(function(){setTimeout(resizeGalleries, 200);});


    var mousepositionHover = function($button, e){
		var offset = $button.offset();
		var fromTop = offset.top;
		var fromLeft = offset.left;
		var height = $button.height();
		var width = $button.width();

		var vertical = "top";
		var horizontal = "left";

		//Vertical
		if(e.pageY > fromTop+height/2){
			//bottom
			vertical = "bottom";
			verticalValue = fromTop+height - e.pageY; 
		}
		else{
			verticalValue = e.pageY - fromTop; 
		}
		//Horizontal
		if(e.pageX > fromLeft+width/2){
			//bottom
			horizontal = "right";
			horizontalValue = fromLeft+width - e.pageX;
		}
		else{
			horizontalValue = e.pageX - fromLeft; 
		}

		//FINAL
		var final_from = vertical;
		if( verticalValue > horizontalValue)
			final_from = horizontal;

		return final_from;
    }


    var imageButton = function(){
		var $button = $(this);

		//Shade
		var shade_opacity = parseFloat($button.data("shade_opacity"), 10)/100;
		var shade_over_opacity = parseFloat($button.data("shade_over_opacity"), 10)/100;

		//Parts
		var $parts = $button.find(">*");
		var $normal = $button.find("div:first-child");
		var $shader = $button.find(".ib_shader").css({
			"display": "block",
			"opacity": shade_opacity
		});
		var $over = $button.find(".ib_over_image").css({
			"display": "block",
			"opacity": "0"
		});
		var $text = $button.find(".ib_over_text").css({
			"display": "block",
			"opacity": "0"
		});

		var original_width = parseFloat($button.data("width"), 10);
		var original_height = parseFloat($button.data("height"), 10);
		var original_ratio = original_width/original_height;


		//Transition
		var transition_type = $button.data("transition");
		var ease = $button.data("transition_ease");
		var type = $button.data("transition_type");
		var duration = $button.data("transition_duration");

		$parts.setTransition( getTransition(ease, type, duration) );


		//Transform
		var ini_scale = parseFloat($button.data("transition_ini_scale"), 10)/100;
		var ini_rotation = $button.data("transition_ini_rotation");
		var scale = parseFloat($button.data("transition_scale"), 10)/100;
		var rotation = $button.data("transition_rotation");


		//Initial
		if(transition_type == "transformation"){
			$over.setTransform("rotate("+ini_rotation+"deg) scale("+ini_scale+", "+ini_scale+")");
			$normal.setTransform("rotate("+ini_rotation+"deg) scale("+ini_scale+", "+ini_scale+")");
		}

		var width, height;
		function resizeImageButton(){
			width = $button.width();
			height = $button.height();	

			if(width < original_width){
				$button.css("height", Math.round(width/original_ratio));

				var resize_ratio = width / original_width;

				$parts.setTransition( "none" );
				$text.setTransform("scale("+resize_ratio+", "+resize_ratio+")");
				$parts.height();
				$parts.setTransition( getTransition(ease, type, duration) );
			}
			else{
				$button.css("height", original_height);
				$parts.setTransition( "none" );
				$text.setTransform("scale(1, 1)");
				$parts.height();
				$parts.setTransition( getTransition(ease, type, duration) );
			}
		}
		resizeImageButton();

		var resize_timeout;
		$(window).resize(function(){
            clearTimeout(resize_timeout);
            resize_timeout = setTimeout(resizeImageButton, 200);
        });


		if($("html").hasClass("no-touch")){
			$button.unbind("hover");
			$button.hover(
				function (e) {
					if(!$button.hasClass("disabled")){
						//Over
						if(transition_type == "mouse" || transition_type == "mouseIn"){
							$parts.setTransition( "none" );
							$parts.height();

							//Comes from
							var final_from = mousepositionHover($button, e);

							//Initial sets
							$over.css("opacity", "1");
							if(final_from == "top"){
								$over.css({
									"top": -height+"px",
									"left": "0px"
								});
							}
							else if(final_from == "bottom"){
								$over.css({
									"top": height+"px",
									"left": "0px"
								});
							}
							else if(final_from == "left"){
								$over.css({
									"left": -width+"px",
									"top": "0px"
								});
							}
							else if(final_from == "right"){
								$over.css({
									"left": width+"px",
									"top": "0px"
								});
							}

							//End sets
							$parts.height();
							$parts.setTransition( getTransition(ease, type, duration) );
							$over.css({
								"top": "0px",
								"left": "0px"
							});
						}
						else{
							$over.css("opacity", "1");
						}

						if(transition_type == "transformation"){
							$over.setTransform("rotate("+rotation+"deg) scale("+scale+", "+scale+")");
							$normal.setTransform("rotate("+rotation+"deg) scale("+scale+", "+scale+")");
						}


						$shader.css("opacity", shade_over_opacity);
						$text.css("opacity", 1);
					}
				},
				function (e) {
					if(!$button.hasClass("disabled")){

						if(transition_type == "mouse"){
							//Comes from
							var final_from = mousepositionHover($button, e);

							//End sets
							$over.css("opacity", "1");
							if(final_from == "top"){
								$over.css("top", -height+"px");
							}
							else if(final_from == "bottom"){
								$over.css("top", height+"px");
							}
							else if(final_from == "left"){
								$over.css("left", -width+"px");
							}
							else if(final_from == "right"){
								$over.css("left", width+"px");
							}

						}
						else{
							$over.css("opacity", "0");
						}
						

						if(transition_type == "transformation"){
							$over.setTransform("rotate("+ini_rotation+"deg) scale("+ini_scale+", "+ini_scale+")");
							$normal.setTransform("rotate("+ini_rotation+"deg) scale("+ini_scale+", "+ini_scale+")");
						}

						//Out
						$shader.css("opacity", shade_opacity);
						$text.css("opacity", 0);
					}
				}
			);
		}
    }



    newPqButton = function(){
		var $button = $(this);

		var background_color = $button.data("background");
		var background_alpha = parseFloat($button.data("background_alpha"), 10)/100.0;
		var background_color_over = $button.data("background_over");
		var background_alpha_over = parseFloat($button.data("background_alpha_over"), 10)/100.0;
		
		var color = $button.data("color");
		var colorOver = $button.data("color_over");
		var border = $button.data("border");
		var borderOver = $button.data("border_over");
		
		var overCSS = {
			"border-color": borderOver,
			"color": colorOver
		}
		var normalCSS = {
			"border-color": border,
			"color": color
		}
		
		var tweenTime = $button.data("tween_time");
		var tween = $button.data("tween");
		
		$button.processColorAndPattern(background_color, background_alpha);
		$button.addEaseAll(tweenTime, tween, ["border-color", "color", "background-color"]);
		$button.unbind("hover");
		$button.hover(
			function () {
				if(!$button.hasClass("disabled")){
					//Over
					$button.css(overCSS);
					$button.processColorAndPattern(background_color_over, background_alpha_over);
				}
			},
			function () {
				if(!$button.hasClass("disabled")){
					//Out
					$button.css(normalCSS);
					$button.processColorAndPattern(background_color, background_alpha);
				}
			}
		);
    }

	
	runShortcodes = function(){
		//Pages with sidebar
		var $pageWithSidebar = $(".with_sidebar");

		if($pageWithSidebar.length > 0){
			var parentHeight = $pageWithSidebar.height(),
			    contentHeight = $pageWithSidebar.find('.content_wraper').height(),
			    sidebarHeight = $pageWithSidebar.find('.sidebar .row-fluid').height();

			if (sidebarHeight > parentHeight) {
			    $pageWithSidebar.find('.content_wraper').height(sidebarHeight+"px");
			}
		}


		//Video
		$(".social_video").each(function(){
			var $social_video = $(this);
			var heightPerc = parseFloat($social_video.data("height"), 10) / 100.0;
			function social_video_resize(){
				$social_video.height( Math.round($social_video.parent().width()*heightPerc) );
			}
			social_video_resize();

			var timeout;
			$(window).resize(function(){
				clearTimeout(timeout);
				timeout = setTimeout(social_video_resize, 200);
			});
			$social_video.bind("gridResize", social_video_resize);



			//Covers
			function close_social_video(){
				$close_btn = $social_video.find(".close_button").unbind("click");

				$social_video.find("iframe, .close_button").remove();
				$social_video.find("a, div, img").show();
			}
			function open_social_video(){
				var src = $social_video.data("src");
				
				var $iframe = $('<iframe src="'+src+'" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
				var $close_btn = $('<a class="close_button" onclick="return false;" href="#"><div class="close_ico inside_icon"></div></a>').click(close_social_video);

				$social_video.find("a, div, img").hide();
				$social_video.append($iframe);
				$social_video.append($close_btn);
			}

			if($social_video.data("src") != undefined){
				$social_video.find(".tooglePlayVideo").click(open_social_video);
			}
		});

		
		//CONTACT FORMS
		$(".form_shortcode").each(function(){
			var $form = $(this);
			$form.find(".button").click(function(){
				$form.submit();
				return false;
			});
			$form.submit(function(){
				if(!$form.hasClass("busy")){
					var $error = $form.find(".on_error");
					var valid = true;

					//VERIFICATIONS
					$form.find("input, textarea").each(function(index, input){
						$input = $(input);
						var type = $input.attr("type");

						//Ignore hidden
						if(type != "hidden"){
							var isRequired = $input.attr("data-required");
							var value = $input.val();

							if(isRequired == "true" && value == ""){
								//Require field is empty
								$error.slideDown(250);
								valid = false;
								return;
							}
							else if(isRequired == "true" || (isRequired == "false" && type == "email" && value != "")){
								//Check Required field, or non required email filled

								if(type == "email"){
	    							var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	    							
	    							if( !pattern.test(value) ){
	    								//Email inputed is invalid
										$error.slideDown(250);
										valid = false;
										return;
	    							}
								}
							}
							
						}
					});

					if(valid){
						$form.addClass("busy");
						if(!$error.is(":hidden"))
							$error.slideUp(250);

						//SEND EMAIL
						var objSend = $form.serialize();
						objSend += "&action=pq_send_email";
						$form.find(".button").fadeTo(300, 0.4).trigger("mouseout").addClass("disabled");
						$.post( adminAjax, objSend, function(data, textStatus){
							if((data == "1" || data == 1) && textStatus == "success"){
								$form.find(".on_success").slideDown(250);
							}
							else{
								$form.find(".on_error").slideDown(250);
							}
							$form.removeClass("busy");
							$form.find(".button").fadeTo(300, 1).removeClass("disabled");
						});
					}
				}
				
				return false;
			});
		});
		
	    //TABS
        $(".tabs").each(function(){
            new Tabs($(this));
        });
        
        
        //ACCORDION
        $(".accordion").each(function(){
            new Accordion($(this));
        });


        //GALLERIES
        resizeGalleries();

        
        //BUTTONS
		$(".pq_button").each(newPqButton);


		//IMAGE BUTTONS
		$(".image_button").each(imageButton);

        
        //Music player
		var consumer_key = "6c786345f5161898f1e1380802ce9226";
		$(".music_player").each(function(){
			var $this = $(this);
			var url = $this.data("url");
			var type = $this.data("type");
			if(type == "sound")
				new MusicPlayer($this, url);
			else
				$.getJSON("http://api.soundcloud.com/resolve?url=" + url + "&format=json&consumer_key=" + consumer_key + "&callback=?", function(music){
					//Sound information loaded from soundcloud
					if(WP_DEBUG)console.log(music);
					var music_url = music.stream_url;
					(music_url.indexOf("secret_token") == -1) ? music_url = music_url + "?" : music_url = music_url + "&";
					music_url = music_url + "consumer_key=" + consumer_key;
					
					new MusicPlayer($this, music_url);
					
				});
		});
	}
	
    return runShortcodes;
});