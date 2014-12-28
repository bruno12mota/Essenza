require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./Essenza.js":[function(require,module,exports){

esza_cover_menu = (directory.cover_menu === "true" || directory.cover_menu === true) ? true : false;

require("./essenza/Shortcodes.js");
require("./essenza/menu.js");

module.exports = {
	Portfolio: require("./essenza/Portfolio.js"),
	Masonry: require("./essenza/Masonry.js"),
	DynamicLoading: require("./essenza/DynamicLoading.js"),
	Lightbox: require("./essenza/Lightbox.js"),
	Info: require("./essenza/Info.js"),
	EasyBackground: require("./essenza/EasyBackground.js"),
	Cover: require("./essenza/Cover.js"),

	Slider: require("./slider/Slider.js"),

	Dragable: require("./other/Dragable.js")
};
},{"./essenza/Cover.js":1,"./essenza/DynamicLoading.js":2,"./essenza/EasyBackground.js":3,"./essenza/Info.js":4,"./essenza/Lightbox.js":5,"./essenza/Masonry.js":6,"./essenza/Portfolio.js":8,"./essenza/Shortcodes.js":9,"./essenza/menu.js":10,"./other/Dragable.js":11,"./slider/Slider.js":15}],1:[function(require,module,exports){

var $ = jQuery;

var $cover = $("#content-cover");
$cover.data("priority", false);

var Cover = {
	contentCoverIn: function(priority){
		if(!$cover.data("priority")){
			$cover.stop().css("display", "").fadeTo(600, 1, "easeOutExpo");
				
			if(priority === true)
				$cover.data("priority", true);
				
			return true;
		}
			
		return false;
	},
	contentLoadingIn: function(){
		$cover.addClass("loading");
		Cover.contentCoverIn();
	},

	contentCoverOut: function(priority){
		if( ((!$cover.data("priority") && !priority) || priority) ){

			//Not loading
			if(!$cover.hasClass("loading"))
				$cover.stop().fadeTo(600, 0, "easeOutExpo", function(){
					$(this).css("display", "none");	
				});
			
			$cover.data("priority", false);
			return true;
		}
		return false;
	},
	contentLoadingOut: function(){
		$cover.removeClass("loading");
		Cover.contentCoverOut();
	}
}

module.exports = Cover;
},{}],2:[function(require,module,exports){

var esza_url = directory["esza_url"];
var esza_disable_ajax = directory["esza_disable_ajax"];

var popped = false;
var loadingPage = false;

var customVars = false;
var $holder_load;
var $afterThis_load;
var idAction_load;
var $ = jQuery;
var Cover = require("./Cover.js");

var backs = [document.URL];

function changeContent(data){
	var to = 0;
	if(customVars){
		$holder_load.remove();
        $(data).insertAfter($afterThis_load);
        to = (idAction_load=="comments" ? $("#comments_replace_content_wraper").offset().top-80 : 0);
	}
	else{
		//Remove current page
    	$('#page-wraper').remove();
    	$('#page-wraper-full').remove();
    	
    	//New page loaded
        $(data).insertAfter($("#header"));
	}
    
    //Remove loading state
	if($("body").hasClass("runtime_javascript_ready") )
		plusquare_runtime_javascript(true, customVars, to);

	customVars = false;
	loadingPage = false;

	$(document).ready(function(){
		$(".dynamic_loading").each(function(){
			new dynamicLoadingButton($(this));
		});
	});
	
}

var dynamicLoadingButton = function($obj, $holder, $afterThis, idAction){
	this.href = $obj.attr('href');

	if(this.href == undefined)
		return;

	if($obj.attr("target") && $obj.attr("target") === "_blank"){
		return;
	}

	if(esza_disable_ajax == "true"){
		var href = this.href;
		$obj.bind(clickBind, function(){
			window.location.href = href;
		} );
		
		return;
	}

	if(this.href.indexOf(esza_url) == -1 || this.href.indexOf(".zip") != -1 || this.href.indexOf(".pdf") != -1 || esza_disable_ajax == "true")
		return;

	$obj.addClass("dynamic_binded");

	this.$holder = $holder;
	this.$afterThis = $afterThis;
	this.idAction = idAction;
	$obj.removeClass("dynamic_loading");

	if(this.idAction == undefined && this.href.indexOf("rel=ajax") > -1){
		this.href = this.href.replace("&rel=ajax","");
		this.href = this.href.replace("?rel=ajax","");
		$obj.attr('href', this.href); 
	}
	else if(this.idAction != undefined){
		this.href = this.href.replace("&rel=ajax","");
		this.href = this.href.replace("?rel=ajax","");
		this.href = this.href.replace("&rel="+this.idAction, "");
		this.href = this.href.replace("?rel="+this.idAction,"");
		$obj.attr('href', this.href); 
	}

	$obj.bind(clickBind, $.proxy(this.onClick, this) );

}

var loadUrlDynamic = function(pageurl){
	loadingPage = true;
    popped = true;

    //Add loading state
    Cover.contentLoadingIn();

    //get the link location that was clicked
    if(pageurl.indexOf("rel=") === -1){
		var action = customVars ? idAction_load : "ajax";
        var loadUrl = pageurl+'?rel='+action;

        var regexStr = ".*?\\?(.+\\=.+)+";
        var regex = new RegExp(regexStr, "gi");
        var matched = pageurl.match(regex);

        var regStr = "\\#.+";
        var regx = new RegExp(regStr, "gi");
        var match = pageurl.match(regx);

        if(match != null){
        	var hash = match[0];
			pageurl = pageurl.substring(0, pageurl.length-hash.length);
		}

        if(matched != null)
            loadUrl = pageurl+'&rel='+action;
        else
			loadUrl = pageurl+'?rel='+action;

		if(match != null)
			loadUrl += match[0];
	}
	else{
		var loadUrl = pageurl;
		pageurl = pageurl.replace("&rel=ajax","");
		pageurl = pageurl.replace("?rel=ajax","");
		if(idAction_load != undefined){
			pageurl = pageurl.replace("&rel="+idAction_load,"");
			pageurl = pageurl.replace("?rel="+idAction_load,"");
		}
	}
	
	  
    //Load new page
    $.ajax({url:loadUrl ,success: changeContent});
    

    //to change the browser URL to the given link location
    if(pageurl!=window.location){
    	if ( window.history.pushState != undefined )
        	window.history.pushState({path:pageurl},'',pageurl);
    }
    backs.push(pageurl);
}

dynamicLoadingButton.prototype = {
	onClick:function(e){
		e.preventDefault();
        /*
        if uncomment the above line, html5 nonsupported browers won't change the url but will display the ajax content;
        if commented, html5 nonsupported browers will reload the page to the specified link.
        */
       
       	if(!loadingPage){

	    	if(this.idAction != undefined){
	    		$holder_load = this.$holder;
	    		$afterThis_load = this.$afterThis;
	    		idAction_load = this.idAction;
	    		customVars = true;
	    	}
	    	else{
	    		customVars = false;
	    	}

			loadUrlDynamic(this.href);
		}
    
        return false;
	}
	
}
	

module.exports = dynamicLoadingButton;
	
jQuery(document).ready(function($){
	//For menu links
	$("#menu a").each(function(){
		new dynamicLoadingButton($(this));
	});

	$("#menu_mobile a").each(function(){
		new dynamicLoadingButton($(this));
	});


	$("#searchform").submit(function(e){
		var search = $(this).find("#search").val();

		if(search == ""){
			e.preventDefault();
			return false;
		}

		var href= $(this).attr("action");
		
	    $("#search_info").trigger("close");

		var url = href+"?s="+search;
		var load = url+'&rel=ajax';

		loadUrlDynamic(url, load);

		return false;
	});
	
    /* the below code is to override back button to get the ajax content without page reload*/
    $(window).bind('popstate', function(e) {
    	if(!popped){
    		popped = true;
    		return;
    	}

    	if(backs.length == 1){
    		return true;
    	}

    	backs.pop();
    	var to = backs[backs.length-1];

    	if(backs.length > 0)
    		backs.pop();
    	
        //load page
		loadUrlDynamic(to);

    });
});

},{"./Cover.js":1}],3:[function(require,module,exports){
var $ = jQuery;
	
//Class instanciation
var EasyBackground = function( params ){
        //default parameters
        this.parameters = {
            "background_color": "none",
            "background_pattern": "none",
            "autoplay": false,
            "autoplayTime": 4000,
            "images_sizing": "fill",
            "images": [],
            "animationIn": {},
            "animationOut": {},
            "extraCss": {}
        };
        
        //parse parameters
        $.each(
            params,
            $.proxy(function(index, value){
                if(this.parameters.hasOwnProperty(index))
                    this.parameters[index] = value;
            }, this)
        );
        
        //holders
        this.images = new Array();
        
        //Vars
        this.current = 0;
        this.numImages = 0;
        this.loadedImages = 0;
        
            
        ///////////////////////////////////////////////
        // CREATES THE BACKGROUND HOLDERS
        this.$background = $('.easyBackground');

        if(this.$background.length == 0){
            this.$background = $('<div class="easyBackground"></div>');
            $('body').append(this.$background);
        }
        
        var obj = {
            "background-color" : this.parameters.background_color
        };
        
        //extra css rules
        $.each(
            this.parameters.extraCss,
            function(key, value){
                obj[key] = value;
            }
        );
        
        //set css
        this.$background.css(obj);
        
        //Content Holder
        this.$content = $('<div class="background-content"></div>');
                    
        //Pattern Holder
        this.$pattern = $('<div class="background-content"></div>');
        
        if(this.parameters.background_pattern != undefined && this.parameters.background_pattern != "none")
        	 this.$pattern.css({"background-image" :  "url("+this.parameters.background_pattern+")"});
        
                    
        this.$background.append(this.$content);
                
        $(window).resize($.proxy(this.onResize, this));
        ///////////////////////////////////////////////
        
        
        //if(this.$background.width() < 600)
            //return;
        
        ///////////////////////////////////////////////
        //initial load
        if(this.parameters.images.length > 0)
            this.loadImage(0);
        ///////////////////////////////////////////////
        
        
};


EasyBackground.prototype = {
	// Load an image 
    loadImage: function (num){
        //Make image
        this.loadingImage = $("<img alt='background image'/>").attr("src", this.parameters.images[num]).css({
            "max-width":"none"
        });
        
        //On load image complete
        this.loadingImage.ensureLoad( $.proxy(this.imageLoaded, this) );
    },
    
	// On image load complete
    imageLoaded: function() {
    	this.loadingImage = this.loadingImage.get(0);
    	
        var $image = $('<div><div>');
        
        $image.css({
            "position" : "absolute",
            "top":0,
            "bottom":0,
            "right":0,
            "left":0
        });
        
        //Create image object
        var obj = new Object();
        obj.img = this.loadingImage;
        obj.width = this.loadingImage.naturalWidth;
        obj.height = this.loadingImage.naturalHeight;
        obj.holder = $image;
        
        if($.isArray(this.parameters.images_sizing))
            obj.sizing = this.parameters.images_sizing[this.loadedImages];
        else
            obj.sizing = this.parameters.images_sizing;
        
        //Add it to the images array
        this.images.push(obj);
        
        if(obj.sizing == "repeat")
            $image.css({
                "width" : "100%",
                "height" : "100%",
                "background-image" : "url("+this.parameters.images[num]+")",
                "background-repeat" : "repeat"
            });
        else
            $image.append(this.loadingImage);
        
        //Fire on resize
        this.onResize();
        
        //Increment loaded images
        this.loadedImages++;
        
        //If the first image is loaded
        if(this.loadedImages == 1){
        	//First image animate in
            this.imageIn();
            this.$content.fadeTo(200, 1);
            this.onResize();
        }
        
        //If there is more images to load
        if(this.parameters.images.length > this.loadedImages)
        	this.loadImage(this.loadedImages);
    },
    
    // TWEEN IN FUNCTION
    tweenIn: function($div, num){
        var attribute = this.parameters.animationIn.attribute[num];
        var easing = this.parameters.animationIn.easing[num];
        var time = parseFloat(this.parameters.animationIn.time[num], 10)*1000;

        if(attribute == "x")
            $div.animate({ left:0 }, { queue: false, duration: time, easing: easing  });
        else if(attribute == "y")
            $div.animate({ top:0 }, { queue: false, duration: time, easing: easing  });
        else if(attribute == "alpha")
            $div.animate({ opacity:1 }, { queue: false, duration: time, easing: easing});
            
        num++;
        if(num < this.parameters.animationIn.attribute.length){
            this.tweenIn($div, num);
        }
    },
    
    // TWEEN OUT FUNCTION
    tweenOut: function ($div, i){
        var attribute = this.parameters.animationOut.attribute[i];
        var value = this.parameters.animationOut.value[i];
        var easing = this.parameters.animationOut.easing[i];
    
        var time = parseFloat(this.parameters.animationOut.time[i], 10)*1000;
        
        if(attribute == "x"){
            var windowWidth =  this.$background.width(); 
            var to;
            if(value == "right")
                to = windowWidth+"px";
            else if(value == "left")
                to = -windowWidth+"px";
            else
                to = value;
            
            $div.animate({ left:to }, { queue: false, duration: time, easing: easing  });
        }
        else if(attribute == "y"){
            var windowHeight = this.$background.height();
            var to;
            if(value == "top")
                to = -windowHeight+"px";
            else if(value == "bottom")
                to = windowWidth+"px";
            else
                to = value;
                
            $div.animate({ top:to }, { queue: false, duration: time, easing: easing  });
        }
        else if(attribute == "alpha"){
            $div.animate({ opacity:parseFloat(value, 10) }, { queue: false, duration: time, easing: easing});
        }
            
        i++;
        if(i < this.parameters.animationOut.attribute.length){
            this.tweenOut($div, i);
        }
    },
    
    // IMAGE IN
    imageIn: function(){
        var windowWidth =  this.$background.width(); 
        var windowHeight = this.$background.height();
        
        var $div = $('<div class="background_holder"><div>');
        $div.css({
            "position" : "absolute",
            "overflow": "hidden",
            "width" : "100%",
            "height" : "100%"
        });
        $div.append(this.images[this.current].holder);
        $div.append(this.$pattern);
        this.$content.append( $div );
        
        for(var i = 0 ; i<this.parameters.animationIn.attribute.length ; i++){
            var attribute = this.parameters.animationIn.attribute[i];
            var value = this.parameters.animationIn.value[i];
            
            if(attribute == "x"){
                var from;
                if(value == "right")
                    from = windowWidth+"px";
                else if(value == "left")
                    from = -windowWidth+"px";
                else
                    from = value;
                
                $div.css("left", from);
            }
            else if(attribute == "y"){
                var from;
                if(value == "top")
                    from = -windowHeight+"px";
                else if(value == "bottom")
                    from = windowWidth+"px";
                else
                    from = value;
                    
                $div.css("top", from);
            }
            else if(attribute == "alpha"){
            	$div.css("opacity", parseFloat(value, 10));
            }
        }
        
        if(this.parameters.animationIn.attribute.length > 0){
            var delay = parseFloat(this.parameters.animationIn.delay, 10)*1000;
            setTimeout($.proxy(function(){
            	$div.stop();
                this.tweenIn($div, 0);
            }, this), delay);
        }
        
        if(this.parameters.images.length > 1 && this.parameters.autoplay){
            clearTimeout(this.autoplayTimer);
            this.autoplayTimer = setTimeout($.proxy(this.next, this), this.parameters.autoplayTime);
        }
    },
    
    
    // IMAGE OUT
    imageOut: function(){
        //select div to tween out
        var $div = $('div.background_out', this.$content).stop();
        
        //start tweening after delay
        var delay = parseFloat(this.parameters.animationOut.delay, 10)*1000;
        if(this.parameters.animationOut.attribute.length > 0){
            setTimeout($.proxy(function(){
                this.tweenOut($div, 0);
            }, this), delay);
        }
        
        //check time to wait before deleting item
        var maxTime = 0;
        for(var i = 0; i< this.parameters.animationOut.attribute.length ; i++){
            var time = parseFloat(this.parameters.animationOut.time[i], 10) * 1000 + delay;
            if(time > maxTime)
                maxTime = time;
        }
        
        var delay1 = parseFloat(this.parameters.animationIn.delay, 10)*1000;
        for(var i = 0; i< this.parameters.animationIn.attribute.length ; i++){
            var time = parseFloat(this.parameters.animationIn.time[i], 10) * 1000 + delay1;
            if(time > maxTime)
                maxTime = time;
        }
        
        //delete item
        $div.removeClass('background_out');
        var timer = setTimeout(function(){ $div.remove() } , maxTime );
    },
    
    
    // Reset Easy background
    reset: function (){
        this.images = new Array();
        this.numImages = 0;
        this.current = 0;
        this.numImages = 0;
        this.loadedImages = 0;
        clearTimeout(this.autoplayTimer);
    },
    
    //Change Image
    changeImage: function (){
        $('div.background_holder', this.$content).addClass('background_out');
        this.imageOut();
        this.imageIn();
    },
    
    //Next image
    next: function (){
        if(this.current < (this.loadedImages - 1))
            this.current++;
        else
            this.current = 0;
        this.changeImage();
    },
    
    //Change to nth image
    changeTo: function(num){
        if(num >= 0 && num < this.loadedImages){
            this.current = num;
            this.changeImage();
        }
    },
    
    //Previous image
    previous: function(){
        if(this.current > 0)
            this.current--;
        else
            this.current = (this.loadedImages - 1);
        this.changeImage();
    },
    
    //Toogle Autoplay
    toogleAutoplay: function(){
        if(this.parameters.autoplay){
            clearTimeout(this.autoplayTimer);
            this.parameters.autoplay = false;
        }
        else    {
            this.autoplayTimer = setTimeout($.proxy(this.next, this), this.parameters.autoplayTime);
            this.parameters.autoplay = true;
        }
        return this.parameters.autoplay;
    },
    
    //Reset and change Easy bacground images
    changeImages: function(newImages){
        this.$content.stop().fadeTo(200, 0, $.proxy(function(){
            this.$content.empty();

            //Reset variables
            this.reset();
            
            //if(this.$background.width() < 600)
                //return;
            
            //Update images
            this.parameters.images = newImages;
            
            if(this.parameters.images.length > 0)
                this.loadImage(0);
        }, this));
        
        
    },


	changeColor: function(color){
		this.$background.css("background-color", color);
	},
    
    
    // ON RESIZE HANDLER
    onResize: function (){
        var maxWidth =  this.$background.width(); 
        var maxHeight =  this.$background.height();
                
        for(var i=0; i<this.images.length ; i++){
            if(this.images[i].sizing != "repeat"){
                var img = this.images[i].img;
                
                if(this.images[i].sizing == "fill" || this.images[i].sizing == "adjust"){
                    var width = this.images[i].width;
                    var height = this.images[i].height;
                    
                    var ratio = width / maxWidth;

                    if(this.images[i].sizing == "fill" && ratio > (height/maxHeight))
                        ratio = height / maxHeight;
                        
                    if(this.images[i].sizing == "adjust" && ratio < (height/maxHeight))
                        ratio = height / maxHeight;
                        
                    img.width = Math.ceil(width/ratio);                
                    img.height = Math.ceil(height/ratio);
                }
                else if(this.images[i].sizing == "stretch"){
                    img.width = maxWidth;
                    img.height = maxHeight;
                }
                
                var top = Math.round(maxHeight/2-img.height/2);
                var left = Math.round(maxWidth/2-img.width/2);
                this.images[i].holder.css({
                    "left": (left>0 ? 0 : left)+"px",
                    "top": (top>0 ? 0 : top)+"px"
                });
            }
        }
    }
	
};
    
module.exports = EasyBackground;
    

},{}],4:[function(require,module,exports){
var $ = jQuery;
var Cover = require("./Cover.js");

var Info = function($obj, shown){
	this.$obj = $obj;
	this.shown = shown;
	$(document).ready($.proxy(this.initiate, this));
}

Info.prototype = {
	initiate: function(){
		//wait page ready
		this.$container = this.$obj.find(".container");
    	
    	//add close action
		$(".close_btn", this.$obj).click($.proxy(this.close, this));
	    this.$obj.find(".click_area").click($.proxy(this.close, this));
	    
	    if(!this.shown)
	    	this.$obj.fadeTo(0, 0).css("display", "none");
	    else
	    	this.open();
	    	
	    this.$obj.bind("open", $.proxy(this.open, this));
	    this.$obj.bind("close", $.proxy(this.close, this));
	},

	//toogle open/close
	toogle: function(){
		if(this.shown)
			this.close();
		else
			this.open();
	},
	
	//Close Info
    close : function(){
    	this.shown = false;

		this.$obj.stop().fadeTo(200, 0, function(){
			$(this).css("display", "none");
		});    
        //Content cover in
        Cover.contentCoverOut(true);
        
        $(window).unbind("resize", $.proxy(this.resize, this));

		$("#page-wraper").css({"height": "", "overflow": ""});
		$("#page-wraper-full").css({"height": "", "overflow": ""});
		
		return false;
    },
    
    //open Info
    open : function(){
        //Content cover in
        if(Cover.contentCoverIn(true)){
        	this.shown = true;

        	this.$obj.css("display", "");
    		this.resize();
        	this.$obj.stop().fadeTo(200, 1);
        	
    		$(window).resize($.proxy(this.resize, this));
        }  
    },
    
    resize : function(){
		this.$obj.removeClass("mobile");
    	var height = this.$container.height();
    	var totalHeight = $(".easyBackground").height();
    	var top = totalHeight/2-height/2-30;
    	if(WP_DEBUG)console.log(height);
    	if(WP_DEBUG)console.log(totalHeight);
    	if(WP_DEBUG)console.log($(".easyBackground").length);

    	if(top < 0){
    		this.$obj.addClass("mobile");
    		this.$container.css({
	    		"top": ""
	    	});

			$("#page-wraper").css({"height": height+"px", "overflow": "hidden"});
			$("#page-wraper-full").css({"height": height+"px", "overflow": "hidden"});
    	}
    	else{
    		this.$container.css({
	    		"top": top+"px"
	    	});

			$("#page-wraper").css({"height": "", "overflow": ""});
			$("#page-wraper-full").css({"height": "", "overflow": ""});
    	}

    }
}
    
module.exports = Info;

},{"./Cover.js":1}],5:[function(require,module,exports){
var $ = jQuery;
		    
//Holders
var $cover, $holder, $contentHolder, $content, description_holder, $close_area;

//Buttons
var leftButton, rightButton, descButton, closeButton;

//Other
var groups, description, descriptionOn, group, groupId, img, contentOriginalWidth, contentOriginalHeight, descriptionInterval;

var imgWidth, imgHeight, imgRatio, descriptionHeight, descriptionIteration, descriptionIterations;


//Construct lightbox
$(document).ready(function(){
	window.devicePixelRatio = window.devicePixelRatio || Math.round(window.screen.availWidth / document.documentElement.clientWidth);

    //Lightbox background cover
    $cover = $("<div class='lightbox_cover'></div>"); 

    //Loading clip
    $loadingclip = $('<div class="big-loading"><img src="'+template_directory+'/img/loaders/loader.png" alt="Be patient..." /></div>').appendTo($cover);  
    
    //Lightbox holder
    $holder = $("<div class='lightbox_holder'></div>");
    
    //Close holder
    $close_area = $("<div class='close_area'></div>").appendTo($holder);
    
    //Content holder
    $contentHolder = $("<div class='lightbox_content_holder'></div>").appendTo($holder);
    
    //Content
    $content = $("<div class='lightbox_content'></div>").appendTo($contentHolder);
    
    //Buttons
    leftButton = $("<a href='#' class='lightbox_button previous' onclick='return false;'></a>").appendTo($holder);
    rightButton = $("<a href='#' class='lightbox_button next' onclick='return false;'></a>").appendTo($holder);
    descButton = $("<a href='#' class='lightbox_button desc' onclick='return false;'></a>").appendTo($holder);
    closeButton = $("<a href='#' class='lightbox_button close' onclick='return false;'></a>").appendTo($holder);
    
    //Get lightbox objects
    //getElements();
});


//Gets all the lightbox elements
function getElements(){
	//get elements with class lightbox
	var $items = $(".lightbox");
	
	//Create groups
	groups = new Object();
	$items.each(function(index, item){
		var $item = $(item);
		
		//get group
		var rel = $item.attr("data-group");
		
		//If belongs to a group
		if(rel != undefined){
			if(!groups.hasOwnProperty(rel))
				//First element of this group
				groups[rel] = new Array();
			
			//Update id
			$item.attr("data-num", groups[rel].length);
			
			//Append to group
			var data = new Object();
			data.content = $item.attr("href");
			data.type = $item.attr("data-type");
			data.type = (data.type==undefined ? "image" : data.type);
			data.width = $item.data("width");
			data.height = $item.data("height");
			if($item.data("description") != undefined)
				data.description = $("body").find("#"+$item.data("description"));
			else
				data.description = $item.find(".description");

			groups[rel].push( data );
		}
	});
	
	//Click events
	$items.bind(clickBind, lightboxItemClicked);
}


//When a lightbox is clicked, open lightbox
function lightboxItemClicked(){
    var href = $(this).attr("href");
    var group = $(this).attr("data-group");
    var type = $(this).attr("data-type");
    var groupId = parseInt($(this).attr("data-num"), 10);
    var description;

    if($(this).data("description") != undefined)
		description = $("body").find("#"+$(this).data("description"));
	else
		description = $(this).find(".description");
    
    type = (type==undefined ? "image" : type);

    if(type == "image"){
		//Get content size
		contentOriginalWidth = parseInt($(this).data("width"), 10);
		contentOriginalHeight = parseInt($(this).data("height"), 10);
	}
    
    //open lightbox
    open(href, type, group, groupId, description.length > 0 ? description : false);
    
    return false;
}
	
//Open lightbox
function open(content, type, _group, _groupId, description){
	//get body
	var body = $("body");
	
	//initially
	descriptionOn = false;
	
	//Save group
	group = _group;
	groupId = _groupId;
	
	//Append cover and fade in
	$cover.appendTo(body).stop().fadeTo(0, 0).fadeTo(250, 0.85, "easeOutExpo");
	
	//Append holder and fade in
	$holder.appendTo(body).stop().fadeTo(0, 0).fadeTo(250, 1, "easeOutExpo");
	
	//Fade out content
	$content.stop().fadeTo(0, 0);
	
	//Load content
	loadContent(content, type, description);
	
	//Update buttons
	updateButtons();
	
	//Binds
	$close_area.unbind(clickBind).bind(clickBind, close);
	closeButton.unbind(clickBind).bind(clickBind, close);
	leftButton.unbind(clickBind).bind(clickBind, previous);
	rightButton.unbind(clickBind).bind(clickBind, next);
	descButton.unbind(clickBind).bind(clickBind, toogleDescription);
	$(document).keypress(keyPressed);
}
	
	
//Load content
function loadContent(content, _type, _description){
	if(_description != false)
		description = _description.clone().addClass("description").show();
	else
		description = false;
	
	type = _type;

	$cover.addClass("loading");
	
	//Image type
	if(type == "image"){
		//Get available space
		var availableWidth = $(window).width();
		var availableHeight = $(window).height() ;
		var imageWidth = 0;
		
		if(!(availableWidth <= 700 || availableHeight <= 500)){
			availableWidth *= 0.8;
			availableHeight *= 0.9;
		}

		/*if(!isNaN(contentOriginalWidth)){
			var minWidth = availableWidth;
			var minHeight = availableHeight;

			//Resize image
			if(contentOriginalWidth > availableWidth || contentOriginalHeight > availableHeight){
				var ratio = contentOriginalHeight / availableHeight;
				
				minWidth = contentOriginalWidth / ratio;
				minHeight = contentOriginalHeight / ratio;
				
				if(minWidth > availableWidth){
					ratio = contentOriginalWidth / availableWidth;
					
					minWidth = contentOriginalWidth / ratio;
					minHeight = contentOriginalHeight / ratio;
				}
			}
			availableWidth = minWidth;
			availableHeight = minHeight;

			var imageRatio = contentOriginalWidth / contentOriginalHeight;
	        var windowRatio = availableWidth / availableHeight;

	        if(windowRatio >= imageRatio)
	        	imageWidth = Math.round(availableWidth);
	        else
        		imageWidth = Math.round(availableHeight * imageRatio);
	        

	        //Accomodate phones resolutions
	        if(windowRatio < 1 && imageWidth < availableHeight)
	        	imageWidth = Math.round(availableHeight);

			//Normalize
        	if(imageWidth > contentOriginalWidth)
	    		imageWidth = contentOriginalWidth;

	    	contentOriginalWidth = imageWidth;
	    	contentOriginalHeight = imageWidth / imageRatio;
		}
		else
			imageWidth = availableWidth;


		//Retina 
		imageWidth *= window.devicePixelRatio;*/
		
		//Load attachment
        jQuery.post(
			adminAjax,
			{
				'action' : 'pq_get_resized',
				'url': content,
				'retina' : window.devicePixelRatio>1  ? 'true' : 'false',
				'width': availableWidth,
				'height': availableHeight,
				'crop': "false",
				"snap": "true",
				"adjust": "true",
				"frontend": "true"
			},
			$.proxy(function( response ) {
				if(response["success"] == true){
					if(WP_DEBUG)console.log(response);
					img = $("<img />").attr('src', response["data"]["url"])
	                     .load(contentLoaded);

	                contentOriginalWidth = parseInt(response["data"]["width"], 10);
	    			contentOriginalHeight = parseInt(response["data"]["height"], 10);
				}
			})
		);

		
	}
	
	//Video
	else if(type == "video"){
		img = $('<iframe src="'+content+'" width="500" height="500" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
		contentLoaded();
	}
	
	//Sound / Music
	else if(type == "sound" || type == "soundcloud")
		img = $('<div></div>').load(content, contentLoaded);
	
}
	
	
//After content has successfully loaded
function contentLoaded(){
	if(type == "image"){
		//Get content size
		if(isNaN(contentOriginalWidth) || isNaN(contentOriginalHeight)){
			contentOriginalWidth = img.get(0).width;
			contentOriginalHeight = img.get(0).height;
		}
	}
	else if(type == "video"){
		contentOriginalWidth = 1000;
		contentOriginalHeight = 620;
	}
	else if(type == "sound" || type == "soundcloud"){
		contentOriginalWidth = 700;
		contentOriginalHeight = 100;
	}
	
	//First resize
	onResize();
	
	//Append content
	$content.append(img).stop().fadeTo(300, 1, "easeOutExpo");
	
	//Run shortcodes for music player
    if(type == "sound" || type == "soundcloud")
	    runShortcodes();
	
	//Append description
	if(description){
		if(description !== false)
		 description_holder = $("<div class='description_holder'></div>").append(description);
		
		if(!descriptionOn)
			description_holder.hide();
		else
			description_holder.show();

		$content.append(description_holder);
		
	}
	$cover.removeClass("loading");
	
	//Resize event
	$(window).unbind("resize", onResize);
	$(window).resize(onResize);
	onResize();
}
	
	
//Toogle image description
function toogleDescription(){
	//Update description on
	descriptionOn = descriptionOn ? false : true;
	
	if(descriptionOn){
		description_holder.stop().fadeTo(1, 0).show();
		onResize();
		description_holder.fadeTo(300, 1);
	}
	else
		description_holder.stop().fadeTo(300, 0, function(){$(this).hide();});
	
}
	
	
//Change to the new image
function loadNew(){
	//Remove old content
	removeContent();
	
	//Get new content
	var content = groups[group][groupId].content;
	var description = groups[group][groupId].description;
	var type = groups[group][groupId].type;

    if(type == "image"){
		//Get content size
		contentOriginalWidth = groups[group][groupId].width;
		contentOriginalHeight = groups[group][groupId].height;
	}

	//Load it
	loadContent(content, type, description.length > 0 ? description : false);
	
	//Upadte buttons
	updateButtons();
}
	
//Go to the nth image in the current group
function goTo(to){
	groupId = to;
	
	$content.stop().fadeTo(200, 0, "easeOutExpo", loadNew);
}
	
//Go to next image
function next(){
	var groupSize = groups[group].length;
	if(groupId < groupSize-1)
		goTo(groupId+1);
		
	return false;
}
	
//Go to previous image
function previous(){
	if(groupId > 0)
		goTo(groupId-1);
		
	return false;
}

//On keyboard key press
function keyPressed(event){
	if ( event.keyCode  == 37 ) {
		//left
		previous();
	}
	else if ( event.keyCode  == 39 ) {
		//right
		next();
	}
}
	
//Update buttons according to group position
function updateButtons(){
	if(description === false)
		descButton.css("display", "none");
	else
		descButton.css("display", "inline");
	
	if(group == undefined){
		//No previous and next buttons
		leftButton.css("display", "none");
		rightButton.css("display", "none");
	}
	else{
		//Is from a group
		var groupSize = groups[group].length;

		leftButton.css("display", "");
		rightButton.css("display", "");
		
		//Left button
		if(groupId <= 0)
			leftButton.addClass("disabled");
		else
			leftButton.removeClass("disabled");
			
		//Right button
		if(groupId >= groupSize-1)
			rightButton.addClass("disabled");
		else
			rightButton.removeClass("disabled");
	}
}
	
	
//When window is resized
function onResize(){
	//Get available space
	var availableWidth = $(window).width() ;
	var availableHeight = $(window).height() ;
	
	if(!(availableWidth <= 700 || availableHeight <= 500)){
		availableWidth *= 0.8;
		availableHeight *= 0.9;
	}
	else{
		availableWidth -= 20;
		availableHeight -= 20;
	}

	
	//Final sizes
	var width = contentOriginalWidth;
	var height = contentOriginalHeight;
	
	//Resize image
	if(width > availableWidth || height > availableHeight){
		var ratio = contentOriginalHeight / availableHeight;
		
		width = contentOriginalWidth / ratio;
		height = contentOriginalHeight / ratio;
		
		if(width > availableWidth){
			ratio = contentOriginalWidth / availableWidth;
			
			width = contentOriginalWidth / ratio;
			height = contentOriginalHeight / ratio;
		}
	}
	
	//Update image size
	if(type == "sound" || type == "soundcloud"){
		img.css({
			"width": width+"px",
			"height": "auto"
		});
		height = img.height();
	}
	else
		img.css({
			"width": width+"px",
			"height": height+"px"
		});
	
	//Update content position
	var fromTop = -height/2;
	$content.css({
		"top": fromTop + "px",
		"left": -width/2 + "px"
	});

	//description height
	if(description != false){
		var descriptionHeight = description.height();
		description.css("margin-top", (height/2-descriptionHeight/2)+"px");
	}
}
	
	
//Remove current content
function removeContent(){
	$content.empty();
}
	
//Close lightbox
function close(){
	//Remove binds
	$close_area.unbind(clickBind);
	closeButton.unbind(clickBind);
	leftButton.unbind(clickBind);
	rightButton.unbind(clickBind);
	descButton.unbind(clickBind);
	$(document).unbind("keypress", keyPressed);

	//Remove cover
	$cover.stop().fadeTo(250, 0, "easeOutExpo", function(){$(this).remove();});
	
	//Remove holder
	$holder.stop().fadeTo(250, 0, "easeOutExpo", function(){$(this).remove();});
	
	//Remove content
	setTimeout(removeContent, 250);
	
	return false;
}

module.exports = {
	getElements: getElements, 
	open: open
};

},{}],6:[function(require,module,exports){
var $ = jQuery;
	
var Masonry = function($holder, objects_query, maxWidth, minColumns, ajaxFunction, postID){
	$(document).ready(	$.proxy(function ($){
		//Save holder
		this.$holder = $holder;
		this.$loading_more = $(".loading_more");
		this.objects_query = objects_query;
		this.postID = postID
		this.$fullDiv = $(".easyBackground");
		this.itemsShown = 0;
		
		//Variables
		this.maxWidth = maxWidth;
		this.minColumns = minColumns;
		this.loadingFurnace = false;
		this.firstFurnace = true;
		this.hasMore = true;
		this.currentNumber = 0;
		

		//Posts
		var holderWidth = this.$holder.width();
    	var numberOfColumns = this.getNumberColumns(holderWidth);
    	this.number = numberOfColumns*7;
		this.offset = 0;
		this.ajaxFunction = ajaxFunction;
		
		//Load first furnace
		this.loadFurnace();

		//Listen for window resize
        $(window).resize($.proxy(this.window_resize_timeout, this));
        $(window).bind("resize_grid", $.proxy(this.window_resize_timeout, this));
		
    }, this));
}

Masonry.prototype = {

	loadFurnace: function(){
		if(this.loadingFurnace || !this.hasMore || this.$holder.length == 0)
			return;

		if(!this.firstFurnace)
			this.$loading_more.show();

		var objSend = "frontend=true&number="+this.number+"&offset="+this.offset+"&action="+this.ajaxFunction+"&postId="+this.postID+"&maxWidth="+this.maxWidth;

		this.loadingFurnace = true;
		this.offset += this.number;

		if(WP_DEBUG)console.log("Trying to load "+this.number+" items");

		//Load posts by ajax
		var startTime = new Date().getTime();
		$.post( adminAjax, objSend, $.proxy(function(data, textStatus){
			var time = new Date().getTime();
			if(WP_DEBUG)console.log("Time: "+(time-startTime));
			var $data = $(data);

			//Append new objects
			this.$holder.append($data);

			var number = this.$holder.find(this.objects_query).length - this.currentNumber;
			this.currentNumber += number; 
			if(number < this.number)
				this.hasMore = false;

			//Get all objects
    		var objects = $(this.objects_query).css({
    			"position": "absolute"
    		});
    		
    		//Save objects
    		this.items = new Array();
    		objects.each($.proxy(function(index, item){
    			var $item = $(item);
    			
    			//Add to items array
    			this.items.push($item);
    		}, this));

    		this.ensureLoad();
    		$(this).trigger("added");
		}, this));

		
	},

	ensureLoad: function(){
		var $loadableItems = this.$holder.find('img, .slider').not(".slider img");
		// get number of loadable elements
		var num = $loadableItems.length;
		// counter to keep track of number of elements that are done loading
		var counter = 0;

		var load_timeout;

		// if there are one or more elements that need to load, bind events to them.
		if (num > 0) {
		    load_timeout = setTimeout($.proxy(this.allElementsAreLoaded, this), 2000);
		    $loadableItems.ensureLoad($.proxy(function(){
		    	clearTimeout(load_timeout);
	            counter++;
	            if(WP_DEBUG)console.log("loaded "+counter+"/"+num);

	            if (counter == num && this.loadingFurnace) 
	                  this.allElementsAreLoaded();
	            else
		    		load_timeout = setTimeout($.proxy(this.allElementsAreLoaded, this), 2000);
		      }, this));
		} 
		else 
			this.allElementsAreLoaded();
	},

	allElementsAreLoaded: function(){

		this.loadingFurnace = false;

		//Initial resize
		this.resize();
		this.$holder.find('.slider').trigger("resizeSlider");
		this.resize();
        this.window_resize_timeout();

		this.$loading_more.hide();
		
		//show up items
		this.showItem();

		if(this.firstFurnace){
			this.firstFurnace = false;

			//Set on scroll capture for loading more
			$(window).unbind("scroll", $.proxy(this.onGridScroll, this));
			$(window).scroll($.proxy(this.onGridScroll, this));
		}
		
		$(this).trigger("furnaceLoaded");
	},
	

	onGridScroll: function(){
		if(!this.hasMore)
			return;

		if($(window).scrollTop() > $(document).height() - $(window).height() - 500) {
       		// ajax call get data from server and append to the div
       		this.loadFurnace();
		}
	},

	//Show item
	showItem: function(){
		//Clear timeout (precaution)
		clearTimeout(this.showItemsTimeout);
		
		if(this.items[this.itemsShown] != undefined){
    		//Show item
    		this.items[this.itemsShown++].addClass("appear");
    		
    		//Show next
    		if(this.itemsShown < this.items.length)
    			this.showItemsTimeout = setTimeout($.proxy(this.showItem, this), 60);
		}
	},
	
	
	//On Window Resize
    windowResized: function(){
    	if(this.items == undefined)
    		return;
    	
    	//make timeout to resize
    	if(this.items.length > 0)
    	  this.resize();
    	//this.resizeTimeout = setTimeout( $.proxy(this.resize, this), 200);
    },

    
	window_resize_timeout: function(){
		clearTimeout(this.resize_timeout);
        this.resize_timeout = setTimeout($.proxy(this.windowResized, this), 200);
	},
    
    
    getNumberColumns: function(totalWidth){
    	var numColumns = 0;
    	var w = this.maxWidth+1;
    	while( w > this.maxWidth){
    		numColumns++;
    		w = totalWidth/numColumns;
    	}
    	if(numColumns < this.minColumns )
    		numColumns = this.minColumns ;
    	
    	return numColumns;
    },
    
    changedCategory: function(animateTranslation){
    	this.resize(animateTranslation === false ? false : true);
    },
    
    //On Actual Resize
    resize: function(animateTranslation){
    	if(this.loadingFurnace)
    		return;
    	
    	var AvHeight = this.$fullDiv.height();
    	var hasScrollbar = false;

    	if(AvHeight < this.$holder.height())
    		hasScrollbar = true;

    	//Get number of columns
    	var holderWidth = this.$holder.width();
    	var numberOfColumns = this.getNumberColumns(holderWidth);
    	var itemsWidth = Math.ceil(holderWidth/numberOfColumns);
    	this.number = numberOfColumns*7;
    	
    	var columnsHeight = [], i = numberOfColumns;
		while (i--) {
			columnsHeight[i] = 0;
		}
    	
    	var counter = 0;
    	$.each(
    		this.items,
    		$.proxy(function(index, item){
    			if(item.is(":visible")){
    				//Set width
	    			//item.css({
	    			//	"width": 100/numberOfColumns + "%"
	    			//});
                    item.css({
                        "width": itemsWidth + "px"
                    });
	    			
	    			var itemHeight = Math.floor(item.height())-1;
	    			
	    			//get column
	    			var column = counter++;
	    			while(column >= numberOfColumns)
	    				column -= numberOfColumns;
	    			
	    			var top = columnsHeight[column];


	    			//check max
	    			var columnIt = 0;
	    			var max = 0;
	    			while(columnIt < numberOfColumns){
	    				if(columnsHeight[columnIt] > max)
	    					max = columnsHeight[columnIt];
	    				columnIt++;
	    			}


	    			
	    			//check other position
	    			var columnIt = 0;
	    			var min = itemHeight/2;
	    			while(columnIt < numberOfColumns){
	    				if(max - columnsHeight[columnIt] >  min){
	    					top = columnsHeight[columnIt];
	    					column = columnIt;
	    					min = max - columnsHeight[columnIt];
	    				}
	    				columnIt++;
	    			}

	    			//Change position
	    			//item.css({
	    			//	"left": (100/numberOfColumns) * column+ "%",
	    			//	"top": top + "px"
	    			//});
					if(animateTranslation)
						item.stop().animate({
	                        "left": itemsWidth * column+ "px",
	                        "top": top + "px"
	                    }, 500, "easeOutExpo");
					else
		    			item.css({
	                        "left": itemsWidth * column+ "px",
	                        "top": top + "px"
	                    });
	    			
	    			if(column == numberOfColumns-1)
	    				item.addClass("last");
	    			else
	    				item.removeClass("last");

	    			
	    			//Update current column
	    			columnsHeight[column] += itemHeight;
    			}
    			
    			
    		}, this)
    	);
    	
    	//Get total height
    	var totalHeight = 0;
    	for(var i = 0; i<columnsHeight.length; i++)
    		if(columnsHeight[i] > totalHeight)
    			totalHeight = columnsHeight[i];
    	
    	/*var minHeight = $(".easyBackground").height();
    	if(totalHeight < minHeight)
    		totalHeight = minHeight;*/

    	this.$holder.css("height", totalHeight+"px");

    	if(AvHeight >= totalHeight && hasScrollbar){
    		var scroll = $(window).scrollTop();
    		this.$holder.css("height", AvHeight-1+"px");
    		this.resize(animateTranslation);

    		$(window).scrollTop(scroll);

    		return;
    	}
    	else if(AvHeight < totalHeight && !hasScrollbar){
    		this.resize(animateTranslation);
    	}
    		

    	$(this).trigger("gridResize");
    	this.$holder.find(".social_video").trigger("gridResize");
    	this.$holder.find('.music_player').trigger("playerResize");
    }
}
    
module.exports = Masonry;
},{}],7:[function(require,module,exports){
var $ = jQuery;
			
var SlidingText = function($holder){
	this.position = 0;
	this.time = 1000;
	
	this.$holder = $holder;
	this.$slide = $holder.find(".sliding_text");
		
	this.$holder.bind(mouseOverBind, $.proxy(this.startTween, this));
	this.$holder.bind(mouseOutBind, $.proxy(this.stopTween, this));
}
SlidingText.prototype = {
	startTween: function(){
		this.overplus = this.$slide.width() - this.$holder.width();
		this.time = 50*this.overplus;
		
		if(this.overplus > 0)
			this.tweenLeft();
	},
	tweenLeft: function(){
		this.$slide.stop().animate({"left":-this.overplus+"px"}, this.time, $.proxy(this.tweenRight, this));
	},
	tweenRight: function(){
		this.$slide.stop().animate({"left":0+"px"}, this.time, $.proxy(this.tweenLeft, this));
	},
	stopTween: function(){
		this.$slide.stop().animate({"left":"0px"}, 500);
	}
}

var MusicPlayer = function($player, url){
	jQuery(document).ready(	$.proxy(function ($){
		//Save variables
		this.defaultVolume = 70;
		this.url = url;
		this.$player = $player;
		
		//Play&Pause button
		this.$tooglePlay = this.$player.find(".tooglePlay");
		
		//Volume
		this.$bar1 = this.$player.find(".volume_bar1");
		this.$bar2 = this.$player.find(".volume_bar2");
		this.$toogleMute = this.$player.find(".toogleMute");
		this.$volActiveBar = this.$player.find(".volume_bar_holder .active_bar");
		this.$volBar = this.$player.find(".volume_bar_holder");
		
		//progress bars
		this.$streamBar = this.$player.find(".stream_bar");
		this.$progressBar = this.$player.find(".progress_bars .active_bar");
		this.$progressBars = this.$player.find(".progress_bars");
		
		//progress labels
		this.$durationLabel = this.$player.find(".duration");
		this.$currentLabel = this.$player.find(".current_position");
		
		//Bind events
		this.$toogleMute.click($.proxy(this.toogleMute, this));
		this.$tooglePlay.click($.proxy(this.tooglePlay, this));
		this.$volBar.bind(mouseDownBind, $.proxy(this.volumeBarDown, this));
		this.$streamBar.click($.proxy(this.progressBarClick, this));
		this.$progressBar.click($.proxy(this.progressBarClick, this));
		
		this.$rightComp=this.$player.find(".component.right");
		
        $(window).resize($.proxy(this.window_resize_timeout, this));

		//Listen for window resize
		$player.bind("playerResize", $.proxy(this.windowResized, this));
        $player.bind("playerResize", $.proxy(this.window_resize_timeout, this));
		
		this.windowResized();
		
		new SlidingText(this.$player.find(".song_artist"));
		new SlidingText(this.$player.find(".song_title"));
		
		//Listen for sound manager ready state
		soundManager.onready($.proxy(this.createSound, this));
    }, this));
}

MusicPlayer.prototype = {
	window_resize_timeout: function(){
		clearTimeout(this.resize_timeout);
        this.resize_timeout = setTimeout($.proxy(this.windowResized, this), 200);
	},

	//On window resize
	windowResized: function(){
		var width = this.$player.width();

		this.$player.removeClass("stage1 stage2 stage3");
		
		if(width < 450)
			this.$player.addClass("stage1");
		
		if(width < 390)
			this.$player.addClass("stage2");
		
		if(width < 330)
			this.$player.addClass("stage3");
	},
	
	
	//When progress bar is clicked
	progressBarClick: function(e){
		if(this.sound.playState === 1){
			//Is buffering or playing
			var barsPosition, streamWidth;

			if(this.$player.hasClass("stage3")){
				barsPosition = this.$progressBars.eq(1).offset().left;
				streamWidth = this.$streamBar.eq(1).width();
			}
			else{
				barsPosition = this.$progressBars.eq(0).offset().left;
				streamWidth = this.$streamBar.eq(0).width();
			}

			var position = e.pageX;
			
			var percStream = (position-barsPosition)/streamWidth;
			var goTo = percStream * this.sound.duration;
			
			//Set music position
			this.sound.setPosition(goTo);
		}
		
		return false;
	},
	
	//Change volume according to bar position
	volumeBarChange: function(position){
		var volumeBarWidth = 50;
		
		if(position < 0)
			position = 0;
		else if(position > 50)
			position = 50;
		
		var perc = Math.round((position / 50) * 100);
		
		//Set sound volume
		this.sound.setVolume(perc);
		
		if(this.sound.muted && this.sound.volume > 0)
			this.sound.unmute();
		else if(!this.sound.muted && this.sound.volume == 0)
			this.sound.mute();
		
		//update graphicss
		this.changeVolume(false);
	},
	
	//When volume bar has been clicked (Mouse down)
	volumeBarDown: function(e){
		this.barPosition = this.$volBar.offset().left;
		this.currentPosition = e.pageX;
		
		this.volumeBarChange(this.currentPosition - this.barPosition);
		
		$(document).bind(mouseMoveBind, $.proxy(this.volumeBarMove, this));
		$(document).bind(mouseUpBind, $.proxy(this.mouseUp, this));
		
		return false;
	},
	
	//On mouse move when changing volume
	volumeBarMove: function(e){
		this.currentPosition = e.pageX;
		
		//Update bar
		this.volumeBarChange(this.currentPosition - this.barPosition);
		
		return false;
	},
	
	//On mouse up
	mouseUp: function(){
		unbindMoveAndUp();
		
		return false;
	},
	
	//Finished sound
	stoppedSound: function(){
		this.changePlayingStatus();
	},
	
	//While loading sound (update stream bar)
	whileloading: function(){
		var percentage = this.sound.bytesLoaded / this.sound.bytesTotal;
				
		this.$streamBar.css("width", percentage*100+"%");
		
		var secondsPassed = Math.round(this.sound.duration/1000);
		var minutesPassed = 0;
		if(secondsPassed >= 60){
			minutesPassed = Math.floor(secondsPassed/60);
			secondsPassed = secondsPassed - minutesPassed*60;
		}
		
		this.$durationLabel.text(
			(minutesPassed < 10 ? "0"+minutesPassed : minutesPassed) + ":" + 
			(secondsPassed < 10 ? "0"+secondsPassed : secondsPassed));
	},
	
	
	//While playing sound (update progress bar and labels)
	whileplaying: function(){
		var percentage;
				
		if(this.sound.loaded)
			percentage = this.sound.position / this.sound.duration;
		else
			percentage = this.sound.position / this.sound.durationEstimate;
		this.$progressBar.css("width", percentage*100+"%");
		
		var secondsPassed = Math.round(this.sound.position/1000);
		var minutesPassed = 0;
		if(secondsPassed >= 60){
			minutesPassed = Math.floor(secondsPassed/60);
			secondsPassed = secondsPassed - minutesPassed*60;
		}
		
		this.$currentLabel.text(
			(minutesPassed < 10 ? "0"+minutesPassed : minutesPassed) + ":" + 
			(secondsPassed < 10 ? "0"+secondsPassed : secondsPassed));



		if(!this.$player.is(":visible")) 
			this.sound.destruct();
	},
	
	
	//Create sound manager instance
	createSound: function(){
		var uniqueId = "id"+Math.floor( Math.random()*99999 );
		this.$player.attr("id", uniqueId);
		this.sound = soundManager.createSound({
			id: uniqueId,
			url: this.url,
			autoLoad: false,
			autoPlay: false,
			onfinish: $.proxy(this.stoppedSound, this),
			
			//Stream Bar
			whileloading: $.proxy(this.whileloading, this),
			
			//Progress Bar
			whileplaying: $.proxy(this.whileplaying, this),
			
			//Initial volume
			volume: this.defaultVolume
		});
		this.changePlayingStatus();
		this.changeVolume();
    },
    
    //Change volume
    changeVolume: function (animate){
		var vol = this.sound.muted ? 0 : this.sound.volume; //0-100
		
		var time = 200;
		if(animate === false)
			time = 1;
		
		//Change sound bars opacity
		if(vol == 0)
			//Muted
			this.$toogleMute.addClass("muted");
		else{
			//Not muted
			this.$toogleMute.removeClass("muted");
			if(vol < 50){
				// < 50
				this.$bar1.stop().fadeTo(time, vol/50);
				this.$bar2.stop().fadeTo(time, 0);
			}
			else{
				// >= 50
				this.$bar1.stop().fadeTo(time, 1);
				this.$bar2.stop().fadeTo(time, (vol-50)/50);
			}
		}
		
		//change bars size
		this.$volActiveBar.stop().animate({"width": vol+"%"}, time);
	},
	
	//Toogle mute state
	toogleMute: function(){
		//toogle sound mute
		this.sound.toggleMute();
		
		if(!this.sound.muted && this.sound.volume == 0)
			this.sound.setVolume(this.defaultVolume);
		
		//update volume graphics
		this.changeVolume();
		
		return false;
	},
	
	
	//Toogle play state
	tooglePlay: function(){
		//toogle sound mute
		this.sound.togglePause();
		
		//update play graphics
		this.changePlayingStatus();
		
		return false;
	},
	
	//On playing status change
	changePlayingStatus: function(){
		if(this.sound.paused || this.sound.playState === 0){
			//its paused (show play graphic)
			this.$tooglePlay.removeClass("playing");
		}
		else{
			//Playing, show pause graphic
			this.$tooglePlay.addClass("playing");
		}
		
	}
}
    
module.exports = MusicPlayer;

},{}],8:[function(require,module,exports){
var esza_portfolio_title_font_size_max = parseInt(directory["esza_portfolio_title_font_size_max"], 10);
var esza_portfolio_title_font_size_min = parseInt(directory["esza_portfolio_title_font_size_min"], 10);

var $ = jQuery;
			
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

module.exports = portfolio;
},{}],9:[function(require,module,exports){

var $ = jQuery;

var MusicPlayer = require("./MusicPlayer.js");

var tabsTweenSpeed = 150;
var accordionTweenSpeed = 150;
	

// Tabs Shortcode
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




// Accordion Shortcode
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



//Checkbox
var Checkbox = function ($this){
	this.values = ["Unchecked", "Checked"];
	this.active = 0;
	this.$checkbox = $this;
	
	$this.click($.proxy(this.click, this));

	//Make active (checked image)
	this.$active = this.$checkbox.find(".checkbox_inner");

	this.$input = this.$checkbox.find("input");
	
	//First update
	this.update(false);
}

Checkbox.prototype = {
	update: function(animate){
		var opc = 0
		var time = 0;
		
		if(this.active)
			opc = 1;
			
		if(animate)
			time = 150;
		
		this.$active.fadeTo(time, opc);

		this.$input.val(this.values[this.active==true?1:0]);
	},

	click: function(){
		if(this.active)
			this.active = false;
		else
			this.active = true;
			
        $(this).trigger('change');
		this.update(true);
		
		return false;
	},
	val:function(to){
		//get
	    if(to == undefined)
           return (this.active ? this.values[1]: this.values[0]);
        
        //change
        this.active = (to===this.values[1]);
        
        //update
        this.update();
    },
	info:function(){
		return this.active.toString();
	}
}



//Combobox
var Combobox = function ($this){
	this.active = 0;
	this.opened = false;	
	this.values = [];
	this.options = new Array();
	this.$combobox = $this;
	
	this.$input = this.$combobox.find("input");

	//Set min width by parameter
	var width = 150;
	if(width != undefined){
		$this.css({
			"width": width,
			"min-width": width
		});
	}
		
	
	//Parse options
	$(".combobox-option", $this).each($.proxy(function(id, val){
		var $option = $(val);
		this.options.push( $option );
		$option.attr("rel", id);
		this.hasOptions = true;

		this.values.push($option.text());
	}, this));

	
	//holder
	this.$holder = this.$combobox.find(".combobox-holder");
	
	//selected text
	this.$selectedText = this.$combobox.find(".selected-text");
	
	this.$optionsHolder = this.$combobox.find(".combobox-options-holder");

	this.$closed_status = this.$combobox.find(".closed-status");
	this.$opened_status = this.$combobox.find(".opened-status");

	//First bind events
	this.rebind();
	
	//IF HAS OPTIONS
	if(this.hasOptions){
		this.update(false);
	}
	else{
		$this.stop().fadeTo(200, 0.7);
		this.$selectedText.text("no options");
	}
	
	//Bind options change
	$this.bind("changeOptions", $.proxy(this.changeOptions, this));
}

Combobox.prototype = {
	rebind: function(){
		this.$holder.click($.proxy(this.click, this)).hover($.proxy(this.interruptClose, this), $.proxy(this.closeDelay, this));

		var _this = this;
		var $this = this.$combobox;
		for(var i=0 ; i < this.options.length ; i++)
			this.options[i].click(function(){
				_this.active = parseInt($(this).attr("rel"));
				_this.update(true);
	        
	            	$(_this).trigger('change');
	            	$this.trigger('change');
			});
	},
	changeOptions: function(e, options, values, value){
		this.options = new Array();
		this.values = values;
		
		for(var i = 0;  i<options.length ; i++){
			var $val = $('<div class="combobox-option">'+options[i]+'</div>').appendTo(this.$combobox);
			$val.attr("rel", i);
			this.options.push($val);
		}
		this.$options.remove();
		this.$options = $(".combobox-option", this.$combobox).remove();
		this.$options.appendTo(this.$optionsHolder);
		
		var _this = this;
		for(var i=0 ; i < this.options.length ; i++)
		this.options[i].click(function(){
			_this.active = parseInt($(this).attr("rel"));
			_this.update(true);
        
        	$(_this).trigger('change');
        	_this.$combobox.trigger('change');
		});
	
		if(value != undefined)
			this.val(value);
		else
			this.update(false);
	},
	update: function(animate){
		var time = 0;
		
		if(animate)
			time = 150;

		if(this.active < 0 || this.active >= this.options.length)
			this.active = 0;
		
		this.$selectedText.fadeTo(time, 0, $.proxy(function(){
			this.$selectedText.html(this.options[this.active].html()).fadeTo(time, 1);
		}, this));

		this.$input.val( this.options[this.active].html() );
		
		$(this).trigger('change');
	},
	open: function(){
		this.$holder.css({
			"height":28+parseInt(this.$optionsHolder.height(), 10)+"px"
		}).addClass("opened");

		this.$closed_status.hide();
		this.$opened_status.show();
		
		this.opened = true;
	},
	close: function(){
		this.$holder.css({
			"height":28+"px"
		}).removeClass("opened");

		this.$closed_status.show();
		this.$opened_status.hide();
		
		this.opened = false;
	},
	closeDelay:function(){
		if(!ismobile)
		this.timer = setTimeout($.proxy(this.close, this), 300);
	},
	interruptClose:function(){
		if(!ismobile)
		clearTimeout(this.timer);
	},
	click: function(){
		if(this.opened)
			this.close();
		else
			this.open();
			
		return false;
	},
	val:function(value){
		//GET VALUE
		if(value == undefined)
			return this.values[this.active];
			
		//SET VALUE
		for(var i= 0; i<this.values.length; i++)
			if(this.values[i] == value){
				this.active = i;
				this.update();
				break;
			}
     },
	info:function(){
		return this.options[this.active];
	}
}



//Galleries arrange
function resizeGalleries(){
    $(".blog_gallery").each(function(){
    	var $this = $(this);
    	var $items = $this.find(">a");

    	if($items.length == 0){
			return;
    	}

    	var width = $this.width();

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


					$shader.css("opacity", shade_over_opacity);$shader.height();
					$text.css("opacity", 1);$text.height();
					
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
					$shader.css("opacity", shade_opacity);$shader.height();
					$text.css("opacity", 0);$text.height();
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


	//Tweets
	$(document).ready(function(){
		$(".single_tweet_stat").each(function(){
			var $this = $(this);
			var status = $this.attr("data-status");

			$.post(
				adminAjax,
				{
					'action' : 'pq_get_twitter_single_stat',
					'frontend': true,
					'tweetStatus': status
				},
				function(response){
					$this.html(response);

					$(document).trigger("resize_grid");
				}
			);
		});

		$(".twitter_feed_short").each(function(){
			var $this = $(this);
			var user = $this.attr("data-user");
			var number = $this.attr("data-number");

			$.post(
				adminAjax,
				{
					'action' : 'pq_get_twitter_short_feed',
					'frontend': true,
					'user': user,
					'number': number
				},
				function(response){
					$this.html(response);
				}
			);
		});

		$(".behance_gallery").each(function(){
			var $this = $(this);
			var id = $this.attr("data-id");
			var type = $this.attr("data-type");
			var number = $this.attr("data-number");
			var width = $this.attr("data-width");
			var height = $this.attr("data-height");

			$.post(
				adminAjax,
				{
					'action' : 'pq_get_behance',
					'frontend': true,
					'id': id,
					'type': type,
					'number': number,
					'width': width,
					'height': height
				},
				function(response){
					$this.html(response);
					resizeGalleries();
				}
			);
		});

		
		$(".dribbble_gallery").each(function(){
			var $this = $(this);
			var id = $this.attr("data-id");
			var number = $this.attr("data-number");
			var width = $this.attr("data-width");
			var height = $this.attr("data-height");

			$.post(
				adminAjax,
				{
					'action' : 'pq_get_dribbble',
					'frontend': true,
					'id': id,
					'number': number,
					'width': width,
					'height': height
				},
				function(response){
					$this.html(response);
					resizeGalleries();
				}
			);
		});

		
		$(".flickr_gallery").each(function(){
			var $this = $(this);
			var id = $this.attr("data-id");
			var type = $this.attr("data-type");
			var number = $this.attr("data-number");
			var width = $this.attr("data-width");
			var height = $this.attr("data-height");

			$.post(
				adminAjax,
				{
					'action' : 'pq_get_flickr',
					'frontend': true,
					'id': id,
					'type': type,
					'number': number,
					'width': width,
					'height': height
				},
				function(response){
					$this.html(response);
					resizeGalleries();
				}
			);
		});



		//Pages with sidebar
		var $pageWithSidebar = $(".with_sidebar");

		if($pageWithSidebar.length > 0){
			function resizeContentSidebar(){
				var parentHeight = $pageWithSidebar.height(),
				    contentHeight = $pageWithSidebar.find('.content_wraper').height(),
				    sidebarHeight = $pageWithSidebar.find('.sidebar .row-fluid').height();

				if (sidebarHeight > parentHeight) {
				    $pageWithSidebar.find('.content_wraper').height(sidebarHeight+"px");
				}
			}
			$(window).load(function(){
				resizeContentSidebar();
				setTimeout(resizeContentSidebar, 1000);
			});
			
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
						objSend += "&action=pq_send_email&frontend=true";
						$form.find(".button").fadeTo(300, 0.4).trigger("mouseout").addClass("disabled");
						$.post( adminAjax, objSend, function(data, textStatus){
							if((data == "1" || data == 1) && textStatus == "success"){
								$form.find(".on_success").slideDown(250);
								$form.find("input, textarea").val("");
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

        //Checkbox
        $(".checkbox").each(function(){
        	new Checkbox($(this));
        });
        
        
        // Combobox
        $(".combobox").each(function(){
            new Combobox($(this));
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
		
	});
}

module.exports = runShortcodes;

},{"./MusicPlayer.js":7}],10:[function(require,module,exports){
var esza_submenu_alignment = directory["esza_submenu_alignment"];
var esza_submenu_start_opacity = parseFloat(directory["esza_submenu_start_opacity"], 10);
var esza_submenu_start_vertical_offset = parseFloat(directory["esza_submenu_start_vertical_offset"], 10);
var esza_submenu_animation_duration = parseFloat(directory["esza_submenu_animation_duration"], 10) * 1000;
var esza_submenu_indication = directory["esza_submenu_indication"];
var esza_submenu_indication_icon = directory["esza_submenu_indication_icon"];
var esza_menu_min_margin = parseInt(directory["esza_menu_min_margin"], 10);

var $ = jQuery;
var Dragable = require("../other/Dragable.js");
var Cover = require("./Cover.js");


//STATE 0 -> normal stance
//STATE 1 -> mobile stance
var menuState = -1;

//Holders
var $normalWraper, $mobileWraper, $normalMenu, $mobileMenu, $subMenus, $header, $subMenus, $footer;
var $mobileComp, $normalComp, $logo;


//Variables
var opened = false;		//true if menu is opened
var logoWidth, menuNotMobileWidth, isTouch, openedHeight, closedHeigth;
var previousTopPosition = 0;
var normalMenuHeight = 0;
var noSubmenu = true;

var submenusIndividual = false;


//Initiate Menu function (called after jquery ready event)
function initiateMenu(){
	//Holders
	$normalWraper = $(".menu_wraper").eq(0);
	$mobileWraper = $(".menu_wraper.mobile");

	$footer = $("#footer");

	$normalMenu = $("#menu");
	$mobileMenu = $("#menu_mobile");
    $subMenus = $normalMenu.find(".sub-menu");

    $header = $("#header");
    $mobileComp = $(".menuMobile"); 
    $normalComp = $(".menuNotMobile");

    $subMenus = $normalMenu.find(".sub-menu");

	//Variables
    $logo = $("#logo");
	logoWidth = $logo.width() + parseInt( $logo.css("margin-left") , 10);
    menuNotMobileWidth = $normalComp.length > 0 ? $normalComp.width() : 0;
    isTouch = $("html").hasClass("touch");
    openedHeight = $normalMenu.height()+25;
    closedHeigth = $header.height();
    submenusIndividual = $header.hasClass("submenus_individual");

	//Arrange
    arrangeMenu();

	//Initial settings
    if(!submenusIndividual)
	   $subMenus.stop().fadeTo(0, 0);
    onResize();

	//Bindings
    $(window).resize(onResize);

    $("#menu a").bind(clickBind, closeMenu);
    $("#menu_mobile a").bind(clickBind, closeMenu);
    $(".toogleMenuMobile").bind(clickBind, toogleMenu);

    if(menuState == 0)
        $normalWraper.fadeTo(300, 1);
}


//Arrange Menu Spacings
function arrangeMenu(){
    var $lis = $normalMenu.find(">li");

    if(esza_submenu_indication == "true")
        $lis.each(function(){
            var $this = $(this);
            var $u = $this.find(">ul");

            if($u.length > 0){
                $this.find(">a").append("<i class='"+esza_submenu_indication_icon+"'></i>");
            }
        });

    

    if(submenusIndividual){
        var numLis = $lis.length;
        $lis.each(function(index){
            var $this = $(this);
            var $u = $this.find(">ul");
            var $a = $this.find(">a");

            var aWidth = $a.width();
            var uWidth = $u.length == 0 ? 0 : $u.width();

            if($u.length != 0)
                noSubmenu = false;

            if(index == numLis-1)
                $this.css("width", aWidth+"px");
            else
                $this.css("width", aWidth+esza_menu_min_margin+"px");

            if($u.length > 0){
                var left = esza_submenu_alignment == "left" ? 0 : (esza_submenu_alignment == "center" ? Math.round((aWidth-uWidth)/2) : aWidth-uWidth);

                $u.css({"opacity": 0, "width": uWidth+"px", "left":left+"px"}).hide();
            }

            if(index == numLis-1)
                normalMenuHeight += aWidth;
            else
                normalMenuHeight += aWidth+esza_menu_min_margin;
        });
        normalMenuHeight += parseInt($normalMenu.css("margin-left"), 10);
        normalMenuHeight += parseInt($normalMenu.css("margin-right"), 10);
    }
    else{
        //Normal Menu Arrange
        var objects = new Array();

        //Get max width
        $lis.each(function(){
            var $this = $(this);
            var $u = $this.find("ul");
            var $a = $this.find("a");

            var uWidth = $u.length == 0 ? 0 : $u.width();
            var aWidth = $a.width();

            if($u.length != 0)
                noSubmenu = false;

            objects.push({
                "u": $u,
                "a": $a,
                "uw": uWidth,
                "aw": aWidth
            });
        });

        //Get max gap
        var maxGap = 20;    //Minimum gap
        $.each(
            objects,
            function(index, obj){
                var gap = Math.max(obj.uw - obj.aw, 0);
                if(gap > maxGap)
                    maxGap = gap;
            }
        );

        //Arrange
        $.each(
            objects,
            function(index, obj){
                var w = obj.aw + maxGap;

                if(obj.u.length != 0)
                    obj.u.css("width", w+"px");
                obj.a.parent(".menu-item").css("width", w+"px");
                var margin = parseInt(obj.a.parent(".menu-item").css("margin-right"), 10);

                normalMenuHeight += w+margin;
            }
        );
    }
	
}



//Toogle Menu
function toogleMenu(){
	if(opened)
        //close menu
        closeMenu();
    else
        //open menu
        openMenu();
}



//Open Menu
function openMenu(){
    opened = true;
    
    //If not the mobile
    if(menuState == 0 && !noSubmenu){
        //Individual submenu
        if(submenusIndividual){
            var $li = $(this);
            var $submenu = $li.find("ul");

            if($submenu.length > 0)
                $submenu.stop().show().css({"opacity": esza_submenu_start_opacity, "top": esza_submenu_start_vertical_offset+"px"}).animate({
                        "opacity": 1,
                        "top": "0px"
                    }, esza_submenu_animation_duration, "easeOutExpo");
        }
        else{
            $subMenus.show();
            openedHeight = 25 + $normalMenu.height();

            //Submenus vertical offset position
            var del = 0;
            $subMenus.each(function(i, subMenu){
                var $subMenu = $(subMenu);
                $subMenu.stop().css({"opacity": 0, "top": "15px"}).delay(del).animate({
                    "opacity": 1,
                    "top": "0px"
                }, 600, "easeOutExpo");
                del += 70;
            });

            $header.stop().css("height", (openedHeight-15 > closedHeigth) ? openedHeight-15 : closedHeigth).animate({
                "height":openedHeight+"px"
            }, 900, "easeOutExpo");

    
            //Content cover in
            if(esza_cover_menu)
                Cover.contentCoverIn();
        }
    }
    
    //If mobile
    else if(menuState == 1){
    	previousTopPosition = $(document).scrollTop();

    	//Restrain page size
    	var height = $mobileWraper.show().height();

        //var available = $(".easyBackground").height();

        //if(height > available){
        $("#page-wraper").css({"height": height+"px", "overflow": "hidden"});
        $("#page-wraper-full").css({"height": height+"px", "overflow": "hidden"});
        //}

    	//Show menu
    	$mobileMenu.stop().css("top", "-20px").animate({"top": "0px"}, 300, "easeOutExpo");

    	//Show hr
    	$("#footer, .menu_wraper.mobile").find("hr").show();

    	//Footer
    	$footer.css("display", "block");

    	//scroll top
    	$('html, body').animate({"scrollTop":0}, 400, "easeOutExpo");
    
        //Content cover in
        if(esza_cover_menu)
            Cover.contentCoverIn();
    }
}



//Close Menu
function closeMenu(){
    opened = false;
    
    //If not the mobile
    if(menuState == 0 && !noSubmenu){
        if(submenusIndividual){
            var $li = $(this);
            var $submenu = $li.find("ul");

            if($submenu.length > 0)
                $submenu.hide();
        }
        else{
            $subMenus.hide();

            $header.stop().css("height", (closedHeigth+15 < openedHeight) ? closedHeigth+15 : openedHeight).animate({
                    "height":closedHeigth+"px"
            }, 900, "easeOutExpo");
    
            //Content cover out
            if(esza_cover_menu)
                Cover.contentCoverOut();
        }
	}
	else if(menuState == 1){
		$mobileWraper.hide();

		$("#page-wraper").css({"height": "", "overflow": ""});
		$("#page-wraper-full").css({"height": "", "overflow": ""});

    	$("#footer, .menu_wraper.mobile").find("hr").hide();
    	$footer.css("display", "");

    	$('html, body').animate({"scrollTop":previousTopPosition+"px"}, 400, "easeOutExpo");
    
        //Content cover out
        if(esza_cover_menu)
            Cover.contentCoverOut();
	}
}



//Normal Menu config
function normalMenu(){
    if(menuState == 0)
        return;
    
    if(opened)
        closeMenu();
    
    smallMenuOut();

    $normalWraper.show();

    if(submenusIndividual){
        var $lis = $normalMenu.find(">li");
        $lis.hover(openMenu, closeMenu);

        if(esza_cover_menu)
            $normalMenu.hover(Cover.contentCoverIn, Cover.contentCoverOut);
    }
    else{
        $subMenus.show();
        openedHeight = $normalMenu.height()+25;
        $normalMenu.hover(openMenu, closeMenu);
        $subMenus.hide();
    }


    menuState = 0;
}

function normalMenuOut(){
    $normalMenu.unbind("hover");
    $normalWraper.hide();
}

//Mobile Menu config
function smallMenu(){
    $mobileComp.css("display", "");
    var dif = ($logo.offset().left + logoWidth) - $mobileComp.offset().left;
    if(dif > 0){
        var w = (logoWidth - dif) / logoWidth;
        $logo.setTransform("scale("+w+", "+w+")");
    }
    else{
        $logo.setTransform("scale(1, 1)");
    }


    if(menuState == 1)
        return;
    
    if(opened)
        //close menu
        closeMenu();
    
    //Leave previous state
    normalMenuOut();
        

    $header.addClass("mobile");
    
    //Hide non mobile components
    $normalComp.css("display", "none");
    
    //Show mobile components
    $mobileComp.css("display", "");
    
    //If current state is opened, open menu
    if(opened)
        openMenu();
    
    //Change state
    menuState = 1;
        
}
function smallMenuOut(){
    $header.removeClass("mobile");
    
    $mobileWraper.css("display", "none");
    $normalComp.css("display", "");
    $mobileComp.css("display", "none");
    $normalWraper.css("height", "");
}


    
    
//On Resize Event Handler
function onResize(){
	var windowWidth = $(window).width();
	
	var bigWidth = windowWidth - (33*2) - logoWidth - menuNotMobileWidth - 30;
	
    if(isTouch || normalMenuHeight >= bigWidth)
        smallMenu();
    else
        normalMenu();
}
    


//On jquery ready initiate menu
jQuery(document).ready(initiateMenu);


},{"../other/Dragable.js":11,"./Cover.js":1}],11:[function(require,module,exports){
var $ = jQuery;

			
var Dragable = function ($holder, $target, verticaly, horizontaly){
    this.$target = $target;
    this.$holder = $holder;
    
    this.verticaly = verticaly;
    this.horizontaly = horizontaly;
    
    this.$scrollbar = $holder.find(".scrollbar");
    this.hasScrollbar = this.$scrollbar.length > 0;
    //ELEMENT DRAG
    this.$holder.bind(mouseDownBind, $.proxy(this.dragDown, this));
    if(this.hasScrollbar){
    	this.$scroller = this.$scrollbar.find(">a");
    	this.$scrollbar.bind(mouseDownBind, $.proxy(this.scrollerDragDown, this));
    }
    	
    this.$holder.bind("mousewheel", $.proxy(this.mouseWheel, this));
    $(window).resize($.proxy(this.resize, this));
    
    //resize
    this.resize();
}

Dragable.prototype = {
	resize:function(){
        //Get heights
        if(this.verticaly){
        	this.currentHeight = this.$target.outerHeight();
        	this.holderHeight = this.$holder.height();
        	this.heightDiference = this.currentHeight - this.holderHeight;
        	//if(WP_DEBUG)console.log("holder H: "+this.holderHeight + " |  content H:"+ this.currentHeight);
        }
        if(this.horizontaly){
        	this.currentWidth = this.$target.outerWidth();
        	this.holderWidth = this.$holder.width();
        	this.widthDiference = this.currentWidth - this.holderWidth;
        }
        
        //Set scrollbar height
        if(this.hasScrollbar){
        	var dif = this.holderHeight / this.currentHeight;
        	var scrollbarFullHeight = this.$scrollbar.height();
        	var scrollbarHeight = this.$scrollbar.height() * dif;
        	this.$scroller.css("height", scrollbarHeight+"px");
        	
        	this.scrollbarDif = scrollbarFullHeight / this.currentHeight;
        }

        if(this.verticaly && this.currentHeight <= this.holderHeight && this.enabled){
        	this.enabled = false;
        	this.remove();
        }
        else if(!this.enabled){
        	this.enabled = true;
        	this.rebind();
        }

	},
	
	mouseWheel: function(e, delta){
        
        this.currentTop = parseInt(this.$target.css("top"), 10);
        this.currentLeft = parseInt(this.$target.css("left"), 10);

    	this.change(this.currentTop+delta*13,
                    	this.currentLeft);
	},
	
	//On drag down common for scrollbar and holder
	dragDownCommon: function(e){
        this.iniX = e.pageX;
        this.iniY = e.pageY;
        
        this.currentTop = parseInt(this.$target.css("top"), 10);
        this.currentLeft = parseInt(this.$target.css("left"), 10);
        
        if(isNaN(this.currentTop))
           this.currentTop = 0;
        if(isNaN(this.currentLeft))
           this.currentLeft = 0;
        
        //Get fresh values
        this.resize();
	},
	//Scrollbar start dragging
	scrollerDragDown: function(e){
		this.dragDownCommon(e);
    	
        //Listen for move and up events
        $(document).bind(mouseMoveBind, $.proxy(this.scrollerDragMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
        
        return false;
	},
	//Holder start dragging
    dragDown:function(e){
		this.dragDownCommon(e);
    	
        //Listen for move and up events
        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
        
        return false;
    },
    
    scrollerDragMove:function(e){
        var difX = (this.iniX - e.pageX);
        var difY = (this.iniY - e.pageY) / this.scrollbarDif;
    	
        this.change(this.currentTop+(this.verticaly ? difY : 0),
                    this.currentLeft+(this.horizontaly ? difX : 0));
        
        return false;
    },
    
    dragMove:function(e){
        var difX = this.iniX - e.pageX;
        var difY = this.iniY - e.pageY;
        
        this.change(this.currentTop-(this.verticaly ? difY : 0),
                    this.currentLeft-(this.horizontaly ? difX : 0));
        
        return false;
    },
    dragUp:function(){
        unbindMoveAndUp();
        
        return false;
    },
    change:function(top, left){
    	if(!this.enabled)
    		return;

    	//Check Vertical Position
		if(this.verticaly){
			//CHECK TOP LIMIT
			if(top > 0)
				top = 0;
       
    		//CHECK BOTTOM LIMIT
			if(top < -this.heightDiference)
				top = -this.heightDiference;
	    }
       
    	//Check Horizontal Position
		if(this.horizontaly){
			//CHECK RIGHT LIMIT
			if(left + this.currentWidth > this.limitRight)
				left = this.limitRight - this.currentWidth;
			       
			//CHECK LEFT LIMIT
			if(left < this.limitLeft)
				left = this.limitLeft;
		}
        
        this.$target.css({
            "top":top+"px",
            "left":left+"px"
        });
        
        if(this.hasScrollbar)
        this.$scroller.css({
        	"top": -top*this.scrollbarDif+"px"
        });
        
        
        //TRIGGER CHANGE EVENT
        this.$target.trigger("drag", {"top":top, "left":left});
    },
    changeLimits: function(limitTop, limitRight, limitBottom, limitLeft){
        this.limitTop = limitTop;
        this.limitRight = limitRight;
        this.limitBottom = limitBottom;
        this.limitLeft = limitLeft;
    },
    rebind: function(){

	    if(this.currentHeight <= this.holderHeight){
        	this.enabled = false;
	    	return;
	    }

    	this.remove(true);
    	
    	this.$holder.bind(mouseDownBind, $.proxy(this.dragDown, this));
    	if(this.hasScrollbar)
	    	this.$scrollbar.bind(mouseDownBind, $.proxy(this.scrollerDragDown, this));
	    
	    this.$holder.bind("mousewheel", $.proxy(this.mouseWheel, this));
    },
    remove: function(noReset){
        this.$holder.unbind(mouseDownBind);
        if(this.hasScrollbar)
    		this.$scrollbar.unbind(mouseDownBind);
    	
	    this.$holder.unbind("mousewheel", $.proxy(this.mouseWheel, this));
	    
	    if(noReset !== true){
		    this.$target.css({
	            "top":0+"px",
	            "left":0+"px"
	        });
	        this.$scroller.css({
	        	"top": 0+"px"
	        });
	    }
    }
}

module.exports = Dragable;

},{}],12:[function(require,module,exports){
var $ = jQuery;
	
var Element = function($obj, width, height){
	var rel = $obj.attr("rel");
	//this.$obj = $("<div class='element'></div>").append($obj);
	this.$obj = $obj;
	this.rel = $obj.attr("rel");
	this.xratio = 1;
	this.yratio = 1;
	this.offScale = 1;
	this.ratioShouldBe = 1;
    this.currentStep = 1;
    this.builderHeight = height;
    this.builderWidth = width;
	
	//default options
	//parameters
    this.parameters = {
        "type": this.type,
	    	
    	"xpos1": 0,
    	"xpos2": 0,
    	"xpos3": 0,
    	"xpos4": 0,
    	
    	"ypos1": 0,
    	"ypos2": 0,
    	"ypos3": 0,
    	"ypos4": 0,
    	
    	"opc1": 100,
    	"opc2": 100,
    	"opc3": 100,
    	"opc4": 100,
    	
    	"size1": 100,
    	"size2": 100,
    	"size3": 100,
    	"size4": 100,
    	
    	"duration1": 0.5,
    	"duration2": 0.5,
    	"duration3": 0.5,
    	
    	"delay1": 0,
    	"delay2": 0,
    	"delay3": 0,
    	
    	"ease1": 0,
    	"ease2": 0,
    	"ease3": 0,
    	
    	"type1": 0,
    	"type2": 0,
    	"type3": 0,
    	
    	"iniWidth": 0,
    	"iniHeight": 0,

    	"vertical_snapping": "center",
    	"horizontal_snapping": "center",
    	"min_scale": 0,
    	"max_scale": 999
    };
	
	this.parseProperties();
	this.minScale = parseFloat(this.parameters.min_scale, 10)/100.0;
	this.maxScale = parseFloat(this.parameters.max_scale, 10)/100.0;
	
    this.isImage = (this.parameters.type == "image");
	this.$obj.css({
		"top":0,
		"left":0,
		"line-height": "normal"
	}).addClass("element");
	
	//Size
	this.$obj.css("width", this.parameters.iniWidth+"px");
    this.$obj.find(">*").css("display", "block");
	if(this.isImage)
        this.$obj.css("height", this.parameters.iniHeight+"px");
    else
    	this.parameters.iniHeight = this.$obj.height();

    if(this.parameters.type == "button"){
    	newPqButton.call( this.$obj.find("a").get(0) );
    }
	
	this.makeAnimationInstances();
    this.transform();

    //Set opacity
    this.$obj.changeOpacity( parseFloat( this["instance"+this.currentStep].opacity, 10) );
}

Element.prototype = {
	parseProperties: function(){
		//get properties from rel attribute
        var rel = this.rel;
        var properties = jQuery.parseJSON(rel);
        
		if(properties != undefined){
    
            //ELEMENT PROPERTIES
            $.each(
                properties,
                $.proxy(function( index, value ){
                    if (this.parameters.hasOwnProperty(index)){
                        //exists
                        this.parameters[index] = value;
                        
                        this.parameters[index] = parseParameter(this.parameters[index]);
                    }
                }, this)
            );
		}
	},
	
	makeAnimationInstances: function(){	
		
		var isImage = (this.parameters.type == "image");
		
		//var margintop = 0, marginleft = 0;
		//var width = this.$obj.outerWidth();
		//var height = this.$obj.outerHeight();

		this.instance1 = {"translateX": this.parameters.xpos1, "translateY": this.parameters.ypos1, "opacity": this.parameters.opc1};
        this.instance2 = {"translateX": this.parameters.xpos2, "translateY": this.parameters.ypos2, "opacity": this.parameters.opc2};
        this.instance3 = {"translateX": this.parameters.xpos3, "translateY": this.parameters.ypos3, "opacity": this.parameters.opc3};
        this.instance4 = {"translateX": this.parameters.xpos4, "translateY": this.parameters.ypos4, "opacity": this.parameters.opc4};
		
		if(isImage){
		    this.instance1["scale"] =  this.parameters.size1;
            this.instance2["scale"] =  this.parameters.size2;
            this.instance3["scale"] =  this.parameters.size3;
            this.instance4["scale"] =  this.parameters.size4;
		}
		
        this.transition0 = "";
        this.transition1 = getTransition(this.parameters.ease1, this.parameters.type1, this.parameters.duration1);
        this.transition2 = getTransition(this.parameters.ease2, this.parameters.type2, this.parameters.duration2);
        this.transition3 = getTransition(this.parameters.ease3, this.parameters.type3, this.parameters.duration3);
	},
	animateStep: function(){
	    clearTimeout(this.stepTimeout);
	    
	    //CSS ANIMATIONS ARE AVAILABLE
	    if(Modernizr.csstransitions){
	        
	        //Set transition properties for this step
            this.$obj.setTransition(this["transition"+this.currentStep]);
            this.currentStep ++;
                
            //Set transform
            this.transform();

	        //Set opacity
	        this.$obj.changeOpacity( parseFloat( this["instance"+this.currentStep].opacity, 10) );
	    
		    if(this.currentStep < 3){
		        this.stepTimeout = setTimeout($.proxy(this.animateStep, this), (this.currentStep > 1 ? this.parameters["duration"+(this.currentStep-1)]*1000 : 0) + this.parameters["delay"+(this.currentStep)]*1000);
		    }
	    }
	    else{
	    	if(this.currentStep == 0){

                //Set transform
                this.transform();

            	this.currentStep ++;

            	this.$obj.stop().animate({  opacity: parseFloat( this["instance"+this.currentStep].opacity, 10)/100.0 }, 1);
				this.stepTimeout = setTimeout($.proxy(this.animateStep, this), this.parameters["delay"+(this.currentStep)]*1000);
	    	}
	    	else{
	    		var initialValues = this.getCurrentStepTransfValues();
	    		var transition = this["transition"+this.currentStep];
                this.currentStep ++;
				var endValues = this.getCurrentStepTransfValues();


				this.$obj.css("borderSpacing", 0);

				this.$obj.stop();
            	this.$obj.animate({  opacity: parseFloat( this["instance"+this.currentStep].opacity, 10)/100.0 }, {queue:false}, 1);
		    	this.$obj.animate(
		    		{  	
		    			"borderSpacing": 100 
		    		}, 
		    		{
		    			//QUEUE
		    			queue: false,

				  		//STEP
				  		step: $.proxy(function( now, fx ) {
				  			now = now / 100;
				  			var transX = initialValues.transX + (endValues.transX - initialValues.transX)*now;
				  			var transY = initialValues.transY + (endValues.transY - initialValues.transY)*now;
				  			var scale = initialValues.scale + (endValues.scale - initialValues.scale)*now;

							this.applyTransform(transX, transY, scale);
				  		}, this),
				  		
				  		//DURATION
				  		duration: (this.currentStep > 1 ? this.parameters["duration"+(this.currentStep-1)]*1000 : 0),
				  		
				  		//COMPLETE
				  		complete: $.proxy(function(){
			    			if(this.currentStep < 3)
								this.stepTimeout = setTimeout($.proxy(this.animateStep, this), this.parameters["delay"+(this.currentStep)]*1000);
						}, this)
					},
					transition
				);
	    	}
			

	    }
	},

	getCurrentStepTransfValues: function(){
		var scale = this.isImage ? this["instance"+this.currentStep]["scale"] / 100 : 1;
		var stepX = this["instance"+this.currentStep].translateX;
		var stepY = this["instance"+this.currentStep].translateY;

		var transY = stepY;
		var transX = stepX;

		transX *= this.offScale;
		transY *= this.offScale;
		transX += this.xExtra;
		transY += this.yExtra;
		scale *= this.offScale;

		transX = Math.round(transX);
		transY = Math.round(transY);

		return {
			"transX": transX,
			"transY": transY,
			"scale": scale
		};
	},

	transform: function(){
		if(this["instance"+this.currentStep] == undefined)
			return;

		var values = this.getCurrentStepTransfValues();
		this.applyTransform(values.transX, values.transY, values.scale);
	},

	applyTransform: function(transX, transY, scale){

		if(this.isImage && Modernizr.csstransforms)
			this.$obj.setTransform("translate("+transX+"px,"+transY+"px) scale("+scale+")");
		
		else if(Modernizr.csstransforms){
            this.$obj.setTransform("translate("+transX+"px,"+transY+"px)");
            this.$obj.find(">*").setTransform("scale("+scale+")");
        }

        else{
			this.$obj.css({
				"top": transY+"px",
				"left": transX+"px"
			});
			
			if(this.isImage){
				this.$obj.find(">*").css({
					"width": scale*100 + "%",
					"height": scale*100 + "%"
				})
			}
			else
				this.$obj.find(">*").css({
					"-ms-filter": "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+scale+", M12=0, M21=0, M22="+scale+")",
					"filter": "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+scale+", M12=0, M21=0, M22="+scale+")"
				});
        	
        }
			
		
	},

	animateIn: function(){
	    this.currentStep = 0;
	    this.animateStep();
	},
	animateOut: function(){
	    this.currentStep = 3;
	    this.animateStep();
	},
	resize: function(width, height){
		//Set transform
		this.width = width ;
		this.height = height ;

		this.xratio = this.width / this.builderWidth;
		this.yratio = this.height / this.builderHeight;

		this.offScale = Math.min(this.xratio, this.yratio);

		if(this.offScale < this.minScale)
			this.offScale = this.minScale;
		else if(this.offScale > this.maxScale)
			this.offScale = this.maxScale;

		this.xExtra = this.width - (this.builderWidth*this.offScale);
		this.yExtra = this.height - (this.builderHeight*this.offScale);

		this.xExtra *= ( this.parameters.horizontal_snapping == "left" ? 0 : (this.parameters.horizontal_snapping == "center" ? 0.5 : 1 ) );
		this.yExtra *= ( this.parameters.vertical_snapping == "top" ? 0 : (this.parameters.vertical_snapping == "center" ? 0.5 : 1 ) );
		
		if(this.currentStep != -1){
			this.currentStep = 0;
	    	this.animateStep();
		}
	}
}

module.exports = Element;

},{}],13:[function(require,module,exports){
var $ = jQuery;
	
var KenBurns = function($obj, width, height, imageWidth, imageHeight, parameters, originalRatio, isFullscreen){
	this.$elem = $obj;
	this.rate = 30;
	
	this.width = width;
    this.height = height;

    this.originalRatio = originalRatio;
    this.isFullscreen = isFullscreen;
	
	this.imageOriginalWidth = imageWidth;
    this.imageOriginalHeight = imageHeight;
    this.numIteration = 0;
    this.resizeImage();
	
	//parameters
	this.parameters = parameters;
	
    this.numIterations = Math.round(((this.parameters.kbDuration*1000)/this.rate));
    
}

KenBurns.prototype = {
	start: function(){
	    if(this.parameters.backgroundType == "image"){
	        //apply ken burns
            
            //TRANSFORM
            this.getTransformValues(0);
            
            if(this.parameters.useKenBurns){
            	clearInterval(this.interval);
            	this.interval = setInterval($.proxy(this.iteration, this), this.rate);
            }
	    }
	},
	
	stop: function(){
	    clearInterval(this.interval);
	},
	
	getTransformValues: function(startIteration){
		var w = this.width;
		var h = this.height;
    	var currentRatio = this.height/this.width;

    	var noSnaping = this.parameters.horizontal_snapping == "none" && this.parameters.vertical_snapping == "none";

		if(this.isFullscreen && !noSnaping){

        	//portrait mode
        	if(this.originalRatio < currentRatio) 
        		w = h / this.originalRatio;
        	
        	else
        		h = w * this.originalRatio;
		}

		var ratioScaleHor = (w / parseFloat(this.parameters.kbStartSize, 10)) / this.imageWidth;
		var ratioScaleVer = (h / parseFloat(this.parameters.kbStartSize, 10)) / this.imageHeight;

	    //INITIAL
        var initialScale = Math.max(ratioScaleHor , ratioScaleVer);
        
    	var initialRemainingX = (w-(this.imageWidth*initialScale));
        var initialRemainingY = (h-(this.imageHeight*initialScale));

        var initialTransX = parseFloat(this.parameters.kbStartLeft, 10) * initialRemainingX;
        var initialTransY = parseFloat(this.parameters.kbStartTop, 10) * initialRemainingY;

        if(this.isFullscreen && !noSnaping){
        	 //portrait mode
        	if(this.originalRatio < currentRatio){
        		var leftover = this.width - w;
        		initialTransX += ( this.parameters.horizontal_snapping == "left" ? 0 : (this.parameters.horizontal_snapping == "center" ? leftover/2 : leftover ) );
        	}
        	else if(this.originalRatio > currentRatio){
        		var leftover = this.height - h;
        		initialTransY += ( this.parameters.vertical_snapping == "top" ? 0 : (this.parameters.vertical_snapping == "center" ? leftover/2 : leftover ) );
        	}
        }
        
        if(this.parameters.useKenBurns){
	        this.numIteration = startIteration;
	    
	        //END
	        var endScale = Math.max( (w / this.parameters.kbEndSize) / this.imageWidth, (h / this.parameters.kbEndSize) / this.imageHeight);
	        var remainingX = (w-(this.imageWidth*endScale));
	        var remainingY = (h-(this.imageHeight*endScale));
	        var endTransX = parseFloat(this.parameters.kbEndLeft, 10) * remainingX;
	        var endTransY = parseFloat(this.parameters.kbEndTop, 10) * remainingY;

	        if(this.isFullscreen && !noSnaping){
	        	 //portrait mode
	        	if(this.originalRatio < currentRatio){
	        		var leftover = this.width - w;
	        		endTransX += ( this.parameters.horizontal_snapping == "left" ? 0 : (this.parameters.horizontal_snapping == "center" ? leftover/2 : leftover ) );
	        	}
	        	else if(this.originalRatio > currentRatio){
	        		var leftover = this.height - h;
	        		endTransY += ( this.parameters.vertical_snapping == "top" ? 0 : (this.parameters.vertical_snapping == "center" ? leftover/2 : leftover ) );
	        	}
	        }
	        
	        this.scaleIt = (endScale - initialScale)/this.numIterations;
	        this.transXIt = (endTransX - initialTransX)/this.numIterations;
	        this.transYIt = (endTransY - initialTransY)/this.numIterations;
        }
        else{
	        this.scaleIt = 0;
	        this.transXIt = 0;
	        this.transYIt = 0;
        }
        
        this.currentScale = initialScale+this.scaleIt*startIteration;
        this.currentTransX = initialTransX+this.transXIt*startIteration;
        this.currentTransY = initialTransY+this.transYIt*startIteration;
        
        this.transform();
	},
	
	iteration:function(){
	    this.currentScale += this.scaleIt;
        this.currentTransX += this.transXIt;
        this.currentTransY += this.transYIt;
                
        this.transform();
        
        if(++this.numIteration >= this.numIterations)
            clearInterval(this.interval);
	},
    
    transform: function(){
        if(Modernizr.csstransforms)
            this.$elem.setTransform("rotate(0.01deg) translate("+this.currentTransX+"px,"+this.currentTransY+"px) scale("+this.currentScale+")");
        else
            this.$elem.setIETransform({"scale":this.currentScale, "translateX":this.currentTransX, "translateY":this.currentTransY});
    },
	
	resizeImage: function(){
	    var ratio = this.width/this.imageOriginalWidth;
	    this.imageWidth = this.imageOriginalWidth*ratio;
	    this.imageHeight = this.imageOriginalHeight*ratio;
	    if(this.imageHeight < this.height){
	    	ratio = this.height/this.imageOriginalHeight;
	    	this.imageWidth = this.imageOriginalWidth*ratio;
	    	this.imageHeight = this.imageOriginalHeight*ratio;
	    }
	    this.$elem.css({
	    	"width": this.imageWidth+"px",
	    	"height": this.imageHeight+"px"
	    });
	},
	
	resize: function(w, h){
		//Update viewer size
	    this.width = w;
        this.height = h;
        
        //Resize image
        this.resizeImage();
        
        //Update kenburns
        this.getTransformValues(this.numIteration);
        this.transform();
	}
}

module.exports = KenBurns;

},{}],14:[function(require,module,exports){
var $ = jQuery;

var KenBurns = require("./KenBurns.js");
var Element = require("./Element.js");
	
var Slide = function($obj, ease, id, isFullscreen, originalRatio, thumbnailOptions){
	this.$slide = $obj;
	this.current = 100;
	this.to = 100;
	this.ease = ease;
	this.supportTransitions = true;
    this.state = "off";
    this.id = id;
    this.thumbLoaded = false;
    this.isFullscreen = isFullscreen;
    this.originalRatio = originalRatio;
    this.thumbnailOptions = thumbnailOptions;
    if(isNaN(this.originalRatio))
    	this.originalRatio = 0.6;
    this.loadedSlide = false;
	
	//parameters
	this.parameters = {
		"sizing": "full",
         //MAIN
        "buttonsColor"  : 0,
        
        //BACKGROUND
        "backgroundType": "image",
        "backgroundId"	: "",
        "backgroundThumb": "none",
        "videoAutoplay": false,
        "thumbnail"		: "",
        "slideDuration" : 10.0,
        
        //KEN BURNS
        "useKenBurns"      : true ,
        "kbDelay"          : 0     ,
        "kbDuration"       : 10     ,
        "kbStartTop"       : 0     ,
        "kbStartLeft"      : 0     ,
        "kbStartSize"      : 1     ,
        "kbEndTop"         : 1     ,
        "kbEndLeft"        : 1     ,
        "kbEndSize"        : 1     ,

    	"vertical_snapping": "none",
    	"horizontal_snapping": "none"

	}

    //Parse parameters
    this.parseParameters();
    
    this.isVideo = this.parameters.backgroundType != "image" && this.parameters.backgroundType != "color";
	
	//build slide
	this.build();
}

Slide.prototype = {
    
    //PARSE SLIDE PARAMETERS
    parseParameters: function(){
        //get properties from rel attribute
        var rel = this.$slide.attr("rel");
        //this.$slide.removeAttr("rel");
        var properties = stringToObject(rel);

        //SLIDE PROPERTIES
        $.each(
            properties,
            $.proxy(function( index, key ){
                if (this.parameters.hasOwnProperty(index)){
                    //exists
                    this.parameters[index] = key;
                    
                    this.parameters[index] = parseParameter(this.parameters[index]);
                }
            }, this)
        );
    },
    
    //BUILD SLIDE
	build: function(){
	    //styles
	    var insideSlideCss = {
	        "position":"absolute",
            "top":"0",
            "left":"0"
	    }
    
        this.width = this.$slide.width();
        this.height = this.$slide.height();
		//this.$slide.css("left", this.width);
		
		//Fetch slide components
		this.$elements = $(".slide_elements", this.$slide);
        this.elements = new Array();
        var ratio = this.width/900;
        $(">*", this.$elements).each($.proxy(function(id, obj){
            $(obj).css(insideSlideCss);
            
            this.elements.push( new Element($(obj), 900, 900*this.originalRatio) );
        }, this));
        
        
        //background
        this.$background = $("<div></div>").prependTo(this.$slide);

        if(this.parameters.backgroundType != "color"){
        	//image background
            this.$image = $("<img style='max-width:none;' alt='Slide background image'/>");

            var attachmentID = this.parameters.backgroundType == "image" ? this.parameters.backgroundId : this.parameters.backgroundThumb;

            var retina = window.devicePixelRatio > 1;
            var windowRatio = this.width / this.height;

            var imageScale = 1;

	        //Kenburns sizing
	        if(this.parameters.sizing == "full"){
			    //Scales
			    var scale = this.parameters.kbStartSize;
				if(this.parameters.useKenBurns && this.parameters.kbEndSize < scale)
			    	scale = this.parameters.kbEndSize;
			    
			    scale = 1/scale;
			    imageScale = scale;
	        }
            
            //Load attachment
            jQuery.post(
				adminAjax,
				{
					'action' : 'pq_get_attachment',
					'attachmentID': attachmentID,
					'retina' : retina  ? 'true' : 'false',
					'width': Math.ceil(this.width*imageScale),
					'height': Math.ceil(this.height*imageScale),
					'crop': "false",
					"snap": 'true',
					"frontend": "true"
				},
				$.proxy(function( response ) {
					if(response["success"] == true){
					    this.originalWidth = response["data"]["width"];
				        this.originalHeight = response["data"]["height"];
				        var url = response["data"]["url"];
				        
				        var minHeight = this.height;
				        var minWidth = this.width;

				        var imageRatio = this.originalWidth / this.originalHeight;
				        

			            //KEN BURNS
			            if(this.parameters.sizing == "full")
			            	this.kenBurns = new KenBurns(this.$image, this.$slide.width(), this.$slide.height(), this.originalWidth, this.originalHeight, this.parameters, this.originalRatio, this.isFullscreen);
			            

			            this.$image.attr('src', url)
			                                    .appendTo(this.$background).css({
			                                        "position":"absolute",
			                                        "image-rendering":"optimizeQuality"
			                                    })
			                                    .setTransformOrigin(0, 0)
			                                    .load($.proxy(this.backgroundLoadComplete, this));


			        	if(this.parameters.thumbnail != "")
		            		this.loadThumbnail();
					}
				}, this)
			);
        }
        else{
        	this.$background.css({
        		"background-color": this.parameters.backgroundId,
        		"position": "absolute",
        		"top": "0",
        		"left": "0",
        		"bottom": "0",
        		"right": "0"
        	});
        	this.backgroundLoadComplete();

        	if(this.parameters.thumbnail != "")
        		this.loadThumbnail();
        }
        

	},

	loadThumbnail: function(){
		if(!this.thumbnailOptions.useThumbnails)
			return;

		 //Load thumbnail
        jQuery.post(
			adminAjax,
			{
				'action' : 'pq_get_attachment',
				'attachmentID': this.parameters.thumbnail,
				'retina' : window.devicePixelRatio > 1  ? 'true' : 'false',
				'width': this.thumbnailOptions.thumbWidth,
				'height': this.thumbnailOptions.thumbHeight,
				'crop': "true"
			},
			$.proxy(function( response ) {
				if(response["success"] == true){
					var url = response["data"]["url"];
					//Trigger thumbnails load
		            $(this).trigger("thumbnailInfoLoaded", [url, this.id]);
		            this.thumbLoaded = true;
		            this.thumbInfo = url;
				}
			}, this)
		);
	},
	
	
	//Check if thumb already loaded
	checkLoadedThumb: function(){
		if(this.thumbLoaded){
            $(this).trigger("thumbnailInfoLoaded", [this.thumbInfo, this.id]);
		}
	},
	
	//UPDATE SLIDE BACKGROUND SIZE
	updateSize:function(){
		if(this.parameters.backgroundType != "color" && this.parameters.sizing != "full")
			this.$image.resizeAndCenter(this.width, this.height, this.originalWidth, this.originalHeight, this.parameters.sizing);
	},


	//Background Load complete
	backgroundLoadComplete: function(){
		var $imageElements = this.$elements.find("img");
		var number = $imageElements.length;
		var count = 0;

		if(number == 0)
			this.loadComplete();
		else
			this.$elements.find("img").ensureLoad($.proxy(function(){
				count ++;
				if(count == number)
					this.loadComplete();
			}, this));
	},
	
	//
	loadComplete:function(){
        this.loadedSlide = true;
        this.resize(this.width, this.height);

		$(this).trigger("loaded"); 
	},
	
	animateIn:function(){

		//KEN BURNS
		if(this.parameters.backgroundType == "image"){
			if(this.kenBurns != undefined)
	            this.kenBurns.start();
       	}
		
		//animate content
		for(var i = 0; i < this.elements.length; i++)
			this.elements[i].animateIn();
	},
	
	animateOut:function(  ){
		
        //KEN BURNS
		if(this.parameters.backgroundType == "image"){
			if(this.kenBurns != undefined)
          		this.kenBurns.stop();
		}
        
		
		//animate content
		for(var i = 0; i < this.elements.length; i++)
			this.elements[i].animateOut();
	},
	
	resize: function(w, h){
	    this.width = w;
        this.height = h;

        if(!this.loadedSlide)
        	return;
          
        //IMAGE RESIZING
        this.updateSize();

        //Elements
        for(var i = 0; i < this.elements.length; i++)
			this.elements[i].resize(this.width, this.height);
            
        //KEN BURNS
        if(this.kenBurns != undefined)
          this.kenBurns.resize(this.width, this.height);
	}
}

module.exports = Slide;


},{"./Element.js":12,"./KenBurns.js":13}],15:[function(require,module,exports){
var $ = jQuery;

var Slide = require("./Slide.js");
var Element = require("./Element.js");
var KenBurns = require("./KenBurns.js");

		
var Slider = function(parameters, docReady){
    this.inParameters = parameters;
    window.devicePixelRatio = window.devicePixelRatio || Math.round(window.screen.availWidth / document.documentElement.clientWidth);
    
    if(docReady)
    	this.initiate();
    else
        $(document).ready($.proxy(this.initiate, this));
    
}
Slider.prototype = {

    //INITIAL FUNCTION
    initiate: function(){
	     //default values
	    this.firstSlide = true;
        this.ease = 7;
        this.width = 500;
        this.height = 500;
        this.autoplayTime = 7000;
        this.autoPlayRate = 35;
    	this.overButtonsHolder = false;
        this.dragging = false;

        this.dragOffset = 0;
        this.current = 0;
        
        this.currentSlide = 0;
        this.oldSlide = -1;

        this.hasLoaded = false;
        
        //SLIDER PROPERTIES
        this.parameters = {
            //MAIN
            "height"                :30      ,
            "keyboard"              :true    ,
            "backgroundColor"       :"transparent",

            //TRANSITION
            "slider_transition_duration": 1  ,
            "slider_transition_type": "Expo"  ,
            "slider_transition_ease": "easeOut"  ,
            "slider_transition_starting": 0,

            
            //BUTTONS
            "buttonsHide"           :true    ,
            "buttonsHideDelay"      :1.2     ,
            "buttonsHideSpeed"      :3       ,
            "mouseDragging"         :true    ,
            "handCursor"            :true    ,
            "autoplay"              :true    ,
            "pauseOnOver"           :false   ,
            "showArrows"            :true    ,
            "leftArrowVA"           :"center", //top, center, bottom
            "leftArrowVO"           :0       ,
            "rightArrowVA"          :"center", //top, center, bottom
            "rightArrowVO"          :0       ,
            "leftArrowHA"           :"left"	 , //left, center, right
            "leftArrowHO"           :20       ,
            "rightArrowHA"          :"right" , //left, center, right
            "rightArrowHO"          :-20       ,
            "showButtons"           :true    ,
            "buttonsVA"             :"bottom", //top, center, bottom
            "buttonsVO"             :0       ,
            "buttonsHA"             :"center", //left, center, right
            "buttonsHO"             :0       ,
            "showPlayPauseButton"   :true    ,
            "PlayPauseVA"           :"bottom", //top, center, bottom
            "PlayPauseVO"           :0       ,
            "PlayPauseHA"           :"right" , //left, center, right
            "PlayPauseHO"           :0       ,
            "showCloseButton"       :false    ,
            "closeVA"               :"bottom", //top, center, bottom
            "closeVO"               :0       ,
            "closeHA"               :"right" , //left, center, right
            "closeHO"               :0       ,
            "closeLink"             :"#"     ,

            //THUMBNAILS
            "useThumbnails"			:false	 ,
            "thumbsPosition"      	:"bottom", //top, right, bottom or left
            "thumbsActiveCenter"	:"false" ,
            "thumbsScrollSpeed"     :3       ,
            "thumbWidth"            :70      ,
            "thumbHeight"           :50      ,
            "thumbRound"            :3       ,
            "thumbVerMargin"        :0       ,
            "thumbHorMargin"        :0       ,
            "thumbOverOpc"          :80      ,
            "thumbActiveOpc"        :100     ,
            "thumbDeactiveOpc"      :50      ,
            "thumbsBackground"      :true    ,
            "thumbsBackgroundOpc"   :50      ,
            "thumbsBackgroundColor" :"#000000"
        };
        
        //Parse parameters
        this.parseParameters(this.inParameters); 
        this.transitionString = getTransition(this.parameters.slider_transition_ease, this.parameters.slider_transition_type, this.parameters.slider_transition_duration);
        this.parameters.slider_transition_starting = parseInt(this.parameters.slider_transition_starting, 10);

        //main slider build
        this.build();
        
        //drag area build
        if(this.parameters.mouseDragging && this.slides.length > 1)
        	this.buildDragArea();
        
        //buttons
        if(this.slides.length <= 1){
            this.parameters.showButtons = false;
            this.parameters.useThumbnails = false;
            this.parameters.showArrows = false;
            this.parameters.showPlayPauseButton = false;
        }
        
        if(this.parameters.showButtons && !this.parameters.useThumbnails)
            this.buildButtons();
        else if(this.parameters.useThumbnails){
        	this.parameters.showButtons = false;
            this.buildThumbnails();
        }
            
        //arrows
        if(this.parameters.showArrows)
            this.buildArrows();
            
        //play|pause button
        if(this.parameters.showPlayPauseButton)
            this.buildPlayPause();
            
        //Keyboard interaction
        if(this.parameters.keyboard)
        	this.addKeyboardInteraction();
        
        //Play video button
        this.buildPlayVideo();

        //Close button
        if(this.parameters.showCloseButton)
            this.buildCloseButton();

        //Buttons to hide
        this.$buttonsHolder = this.$root.find(">.buttons , >.arrow_button, >.tooglePlay");
            
        this.$root.hover($.proxy(this.mouseOverSlider, this), $.proxy(this.mouseOutSlider, this));
        
        this.updateSize();
        this.$root.bind("resizeSlider", $.proxy(this.updateSize, this));
        $(window).resize($.proxy(this.window_resize_timeout, this));
        
        //fire first
        this.loadedSlides = 0;
        this.loadSlides();
        
    },


    //Check the loading on all slides in an ordered way
    loadSlides: function(){


        //Slide already loaded
        if(this.slides[this.loadedSlides].loadedSlide)
            this.slideLoaded();

        //Slide needs to load first
        else{
            $(this.slides[this.loadedSlides]).bind("loaded", $.proxy(function(){
                $(this.slides[this.loadedSlides]).unbind("loaded");

                this.slideLoaded();
            }, this)); 
        }
    },


    //Actions for when a slide has completely loaded
    slideLoaded: function(){

        //Enter slide when first slide has loaded
       if(this.loadedSlides == 0){
            this.updateSlide();
            this.updateSize();
       }
            this.updateSlide();


        //Buttons
        if(this.parameters.showButtons && !this.parameters.useThumbnails)
            this.buttons[this.loadedSlides].show().fadeTo(500, 1);

        //Thumbnails
        else if(this.parameters.useThumbnails){
            $(this.slides[this.loadedSlides]).bind("thumbnailInfoLoaded", $.proxy(this.addThumbnail, this));
            this.slides[this.loadedSlides].checkLoadedThumb();
        }

        this.loadedSlides++;
        if(WP_DEBUG)console.log("Loaded slide: "+this.loadedSlides+"/"+this.slides.length);

        //More slides to load
        if(this.loadedSlides < this.slides.length)
            this.loadSlides();

        //Wait for all slides to load to show slider
        //else
            //this.updateSlide();
    },
    
    
    //Mouse over slider handler
    mouseOverSlider: function(){
        if(this.parameters.buttonsHide && !this.firstSlide){
            //buttons in
            this.$buttonsHolder.stop(true, false).fadeTo(this.parameters.buttonsHideSpeed*1000, 1);
        }
        else if(this.parameters.buttonsHide)
        	this.overButtonsHolder = true;

        if(this.parameters.pauseOnOver){
            //Pause autoplay
            this.pauseAutoplay();
        }
    },
    
    //Mouse out slider handler
    mouseOutSlider: function(){
        if(this.parameters.buttonsHide && !this.firstSlide){
            //buttons out
            this.$buttonsHolder.stop(true, false).delay(this.parameters.buttonsHideDelay*1000).fadeTo(this.parameters.buttonsHideSpeed*1000, 0);
        }
        else if(this.parameters.buttonsHide)
        	this.overButtonsHolder = false;
        
        
        if(this.parameters.pauseOnOver){
            //Pause autoplay
            this.resumeAutoplay();
        }
    },
    
    
    //Parse Slider Parameters
	parseParameters: function(paramaters){
		//Get slider holder
		this.$root = $(paramaters.holder);
		
		if(!isNaN(paramaters.ease))
		this.ease = parseInt(paramaters.ease, 10);
		
		if(paramaters.hasOwnProperty("background_color"))
			this.$root.css("background-color", paramaters.background_color);
		
        //get properties from rel attribute
        var rel = this.$root.attr("rel");
        this.$root.removeAttr("rel");
		var properties = stringToObject(rel);
        
        //SLIDER MAIN PROPERTIES
        $.each(
            this.parameters,
            $.proxy(function( index, value ){
                if (properties.hasOwnProperty(index)){
                    //exists
                    this.parameters[index] = parseParameter( properties[ index ] );
                }
            }, this)
        );

        this.originalRatio = this.parameters.height/100;
        
        //SLIDER CALL PARAMETERS
        $.each(
            this.inParameters,
            $.proxy(function( index, value ){
                if (this.parameters.hasOwnProperty(index)){
                    //exists
                    this.parameters[index] = parseParameter(value);
                }
            }, this)
        );
        
        if(ismobile && this.parameters.buttonsHide)
        	this.parameters.buttonsHide = false;
	},
	
	
	//Build Slider
	build:function(){
		this.slides = new Array();
		var isFullscreen = isNaN(this.parameters.height);

        //Background color
        this.$root.css("background-color", this.parameters.backgroundColor);
		
		//go trough slides
        this.$slides_holder = this.$root.find(".slides");
        this.$slides = $(">div", this.$root);
        var numSlides = this.$slides.length;
        this.$slides_holder.css("width", (numSlides*100)+"%");
		$(".slide", this.$root).each($.proxy(function(id, obj){
		    //new slide
			var $slide = $(obj);

			 
            var thumbnailOptions = {
                "useThumbnails"         : ((this.parameters.useThumbnails === "true" || this.parameters.useThumbnails === true) ? true : false)   ,
                "thumbWidth"            :this.parameters.thumbWidth   ,
                "thumbHeight"           :this.parameters.thumbHeight 
            };
			var slide = new Slide($slide, this.ease, this.slides.length, isFullscreen, this.originalRatio, thumbnailOptions);
            slide.$slide.css("left", ((100/numSlides)*id)+"%");
            
			this.slides.push(slide);
		}, this));
		
		this.numSlides = this.slides.length;
			
		//ALL BUTTONS HOLDERS
        //this.$buttonsHolder = this.$root;//$("<div class='buttonsHolder'></div>").appendTo(this.$root);
	},
	
	getPercentageFromOption:function(VA){
	    return (VA == "top" || VA == "left") ? "0%" : (VA == "center" ? "50%" : "100%");
	},
	
	
	//Build Drag Area
	buildDragArea: function(){
		//Make area
		//this.$dragarea = $("<div class='dragArea'></div>").appendTo(this.$buttonsHolder);
        
        //hand cursor
        if(this.parameters.handCursor)
        	this.$slides_holder.addClass("grabhand");
        	
       	//Start dragging on mouse down
		this.$slides_holder.bind(mouseDownBind, $.proxy(this.startDragging, this));
	},
	
	//Start Dragging Handler
	startDragging: function(e){
        var target = $( e.target );
        if ( target.is( "a" ) ) {
            return true;
        }

        this.dragging = true;

		//Add down class for the cursor
		this.$slides_holder.addClass("down");
		
		//Save initial position
		this.dragInitialX = e.pageX;
		this.dragInitialY = e.pageY;
		
		//Initial diference
		this.difference = 0;
		
        this.easeTemp = this.ease;
        this.ease = 1;

        if(Modernizr.csstransitions)
            this.$slides_holder.setTransition( "none" );
        else
            clearInterval(this.interval);
		
		//Bind move and up
		$(document).bind(mouseMoveBind, $.proxy(this.onDrag, this));
		$(document).bind(mouseUpBind, $.proxy(this.stopDragging, this));
		
		//prevent default
		return false;
	},
	
	//On Drag Handler
	onDrag: function(e){
		//get difference
		this.difference = e.pageX - this.dragInitialX;
		
		if(this.currentSlide<=0 && this.difference > 0)
			this.difference/=3;	
		
		if(this.currentSlide >= this.slides.length-1 && this.difference < 0)
			this.difference/=3;
		
		//Update images position
        this.dragOffset = (this.difference/this.width) * 100;

        this.animateInc();
		
		
		//prevent default
		return false;
	},
	
	//Stop Dragging Handler
	stopDragging: function(){
		//Remove down class for the cursor
		this.$slides_holder.removeClass("down");

        this.dragging = false;
		
		//Unbind move and up
		unbindMoveAndUp();

        this.dragOffset = 0;
        this.ease = this.easeTemp;
		
		//Change slide
        if(this.difference == 0){
            var off_left = this.$root.offset().left;
            var rel_off = this.dragInitialX - off_left;

            if(rel_off < this.width/2){
                //left side
                this.previousSlide();
            }
            else {
                //right side
                this.nextSlide();
            }
        }
		else if(this.difference < 0 && this.currentSlide < this.slides.length-1)
			this.nextSlide();
		else if(this.difference > 0 && this.currentSlide > 0)
			this.previousSlide();
        else{
            this.animateInc(true);
            //clearInterval(this.interval);
            //this.interval = setInterval($.proxy(this.animateInc, this), 30);
        }
		
		//prevent default
		return false;
	},
	
	
	//BUILD BUTTONS
	buildButtons:function(){
	    //"buttonsVA"             
        //"buttonsVO" 
        //"buttonsHA" 
        //"buttonsHO"     
        var buttonWidth = 15;
        var buttonHeight = 15;
        
        var top = this.getPercentageFromOption(this.parameters.buttonsVA);
        var left = 0;
        
        var marginTop = (this.parameters.buttonsVA == "top" ? 0 : (this.parameters.buttonsVA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.buttonsVO;
        var marginLeft = this.parameters.buttonsHO;
        
        this.$buttons = $("<div class='buttons'></div>").css({
            "position":"absolute",
            "width":"100%",
            "top": top,
            "left": left,
            "margin-top": marginTop,
            "margin-left": marginLeft,
            "text-align": this.parameters.buttonsHA == "center" ? "center" : ""
        }).appendTo(this.$root);
        
        //make buttons
        var flt = this.parameters.buttonsHA == "left" ? "left" : (this.parameters.buttonsHA == "center" ? "none" : "right");
        this.buttons = new Array();
        for(var i = 0; i< this.slides.length ; i++){
            var $button = $("<a href='#' alt='slider go to button' onclick='return false;' style='display:none; opacity: 0;'></a>").css({
                "width":buttonWidth,
                "height":buttonHeight,
                "float":flt,
                "margin-right": (i<this.slides.length ? 5 : 0) +"px"
            }).attr("rel", i).appendTo(this.$buttons).bind(clickBind, $.proxy(this.goToClick, this));
            
            $("<div></div>").attr("rel", i).appendTo($button);
            
            $button.hover(this.buttonOver, this.buttonOut);
            
            this.buttons.push($button);
        }
	},


    buildCloseButton: function(){
        //"showCloseButton" 
        //"closeVA"          
        //"closeVO"            
        //"closeHA" 
        //"closeHO"
        //"closeLink" 
        var buttonWidth = 30;
        var buttonHeight = 30;

        var top = this.getPercentageFromOption(this.parameters.closeVA);
        var left = this.getPercentageFromOption(this.parameters.closeHA);
        var mTop = (this.parameters.closeVA == "top" ? 0 : (this.parameters.closeVA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.closeVO;
        var mLeft = (this.parameters.closeHA == "left" ? 0 : (this.parameters.closeHA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.closeHO;
        var closeButton = $('<a class="close_button dynamic_loading" href="'+this.parameters.closeLink+'"><div class="inside_icon close_ico"></div></a>').css({
            "position":"absolute",
            "top":top,
            "left":left,
            "margin-top":mTop,
            "margin-left":mLeft,
            "width":buttonWidth,
            "height":buttonHeight
        }).appendTo(this.$root);
    },
	
	buildThumbnails: function(){
		//"thumbsActiveCenter"
		//"thumbsPosition"
        //"thumbsHide"
        //"thumbsHideDelay"
        //"thumbsHideSpeed"
        //"thumbsScrollSpeed"
        //"thumbWidth" 
        //"thumbHeight" 
        //"thumbRound"  
        //"thumbVerMargin"   
        //"thumbHorMargin"
        //"thumbOverOpc"  
        //"thumbActiveOpc"  
        //"thumbDeactiveOpc" 
        //"thumbsBackground"
        //"thumbsBackgroundOpc"
        //"thumbsBackgroundColor" 
        this.$thumbnails = $("<div class='slider_thumbnails'></div>").appendTo(this.$root);
        switch(this.parameters.thumbsPosition){
        	case "top":
        		this.$thumbnails.css({
        			"top":0,
        			"width":"100%",
        			//"right":0,
                    //"left":0,
        			"height":(this.parameters.thumbHeight+this.parameters.thumbVerMargin*2) + "px"
        		});
        		break;
        	case "bottom":
        		this.$thumbnails.css({
        			"bottom":0,
                    "width":"100%",
        			//"left":0,
        			//"right":0,
        			"height":(this.parameters.thumbHeight+this.parameters.thumbVerMargin*2) + "px"
        		});
        		break;
        	case "right":
        		this.$thumbnails.css({
        			//"top":0,
        			//"bottom":0,
                    "height":"100%",
        			"right":0,
        			"width":(this.parameters.thumbWidth+this.parameters.thumbHorMargin*2) + "px"
        		});
        		break;
        	case "left":
        		this.$thumbnails.css({
        			//"top":0,
        			//"bottom":0,
                    "height":"100%",
        			"left":0,
        			"width":(this.parameters.thumbWidth+this.parameters.thumbHorMargin*2) + "px"
        		});
        		break;
        }
        
		//Background
		if(this.parameters.thumbsBackground)
			this.$thumbnails.processColorAndPattern(this.parameters.thumbsBackgroundColor, parseFloat(this.parameters.thumbsBackgroundOpc, 10)/100.0);
		
		
		//Update opacities
		this.parameters.thumbDeactiveOpc = this.parameters.thumbDeactiveOpc/100.0;
		this.parameters.thumbActiveOpc = this.parameters.thumbActiveOpc/100.0;
		this.parameters.thumbOverOpc = this.parameters.thumbOverOpc/100.0;
			
		//Make thumbnails
		this.$thumbnailsHolder = $("<div class='thumbnailsHolder'></div>").appendTo(this.$thumbnails);

		//Active to center
		if(this.parameters.thumbsActiveCenter){
			//center horizontally
			if(this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom")
				this.$thumbnailsHolder.css({
					"left": "50%",
					"margin-left": (-this.parameters.thumbWidth/2) +"px"
				});
			
			//center vertically
			else
				this.$thumbnailsHolder.css({
					"top": "50%",
					"margin-top": (-this.parameters.thumbHeight/2) +"px"
				});
			
		}
        else{
            this.thumbnailsTo = 0;
            this.thumbnailsCurrent = 0;
            this.thumbnailsIsOver = false;
            if (!Modernizr.touch){
                this.$thumbnails.hover($.proxy(this.thumbnailsOver, this), $.proxy(this.thumbnailsOut, this));
            }
            this.thumbnailsInterval = setInterval($.proxy(this.thumbnailsUpdate, this), 30);
        }

        var horizontal = (this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom");

		var width = this.parameters.thumbWidth;
		var height = this.parameters.thumbHeight;
		this.thumbnails = new Array();
		for(var i = 0; i< this.slides.length ; i++){
			var $thumbnail = $("<a href='#' rel='"+i+"' class='slider_thumbnail'></a>").css({
				"width": this.parameters.thumbWidth+"px",
				"height": this.parameters.thumbHeight+"px",
				"overflow": "hidden",
                "left": horizontal ? (this.parameters.thumbHorMargin + (this.parameters.thumbHorMargin+this.parameters.thumbWidth)*i)+ "px" : "auto" ,
                "top": !horizontal ? (this.parameters.thumbVerMargin + (this.parameters.thumbVerMargin+this.parameters.thumbHeight)*i)+ "px" : "auto",
				"margin": (horizontal ? this.parameters.thumbVerMargin : 0)+"px "+(horizontal ? 0 : this.parameters.thumbHorMargin)+"px"
				//"margin-left": ((this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom") && i!=0) ? 0+"px": this.parameters.thumbHorMargin+"px",
				//"margin-top": ((this.parameters.thumbsPosition == "left" || this.parameters.thumbsPosition == "right") && i!=0) ? 0+"px": this.parameters.thumbVerMargin+"px"
			});
			this.thumbnails.push($thumbnail);
			this.$thumbnailsHolder.append($thumbnail);
		
			//Deactivated initially
			$thumbnail.fadeTo(400, this.parameters.thumbDeactiveOpc);
			$thumbnail.hover($.proxy(this.thumbnailOver, this), $.proxy(this.thumbnailOut, this)).bind(clickBind, $.proxy(this.thumbnailClick, this));
		}
		
	},

    //Update
    thumbnailsUpdate: function(){
        this.thumbnailsCurrent += ((this.thumbnailsTo-this.thumbnailsCurrent)/(this.parameters.thumbsScrollSpeed==0 ? 1 : this.parameters.thumbsScrollSpeed));

        if(this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom")
            this.$thumbnailsHolder.css({
                "left":this.thumbnailsCurrent+"px"
            })
        else
            this.$thumbnailsHolder.css({
                "top":this.thumbnailsCurrent+"px"
            })
    },

    //To normal position
    thumbnailsToNormalPos: function(){
        if(this.thumbnailsIsOver)
            return;

        if(this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom"){
            var pos = (this.parameters.thumbWidth + this.parameters.thumbHorMargin)*(this.currentSlide+1);
            var comp = this.width/2 + this.parameters.thumbWidth/2;
            this.thumbnailsTo = (comp  < pos ? (comp - pos) : 0);

            var max = this.width - ((this.parameters.thumbWidth + this.parameters.thumbHorMargin)*(this.slides.length) + this.parameters.thumbHorMargin);
            if(this.thumbnailsTo < max)
                this.thumbnailsTo = max;
        }
        else{
            var pos = (this.parameters.thumbHeight + this.parameters.thumbVerMargin)*(this.currentSlide+1);
            var comp = this.height/2 + this.parameters.thumbHeight/2;
            this.thumbnailsTo = (comp  < pos ? (comp - pos) : 0);

            var max = this.height - ((this.parameters.thumbHeight + this.parameters.thumbVerMargin)*(this.slides.length) + this.parameters.thumbVerMargin);
            if(this.thumbnailsTo < max)
                this.thumbnailsTo = max;
        }
        
    },

    //On thumbnails holder over (Start scrolling)
    thumbnailsOver: function(){
        this.thumbnailsIsOver = true;
        $(window).bind(mouseMoveBind, $.proxy(this.thumbnailsMove, this));
    },

    //On thumbnails holder over (End scrolling)
    thumbnailsOut: function(){
        this.thumbnailsIsOver = false;
        $(window).unbind(mouseMoveBind, $.proxy(this.thumbnailsMove, this));
        this.thumbnailsToNormalPos();
    },

    //On mouse move
    thumbnailsMove: function(e){
        var offset = this.$thumbnails.offset();
        if(this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom"){
            //Horizontal
            var x = e.pageX;
            var offX = offset.left;
            var relativeX = x - offX;

            var width = (this.parameters.thumbWidth + this.parameters.thumbHorMargin) * this.thumbnails.length + this.parameters.thumbHorMargin;
            var widthAvailable = this.$thumbnails.width();

            var percentagePosition = relativeX/widthAvailable;
            this.thumbnailsTo = -Math.round((width - widthAvailable) * percentagePosition);
        }
        else{
            //Vertical
            var y = e.pageY;
            var offX = offset.top;
            var relativeY = y - offX;

            var height = (this.parameters.thumbHeight + this.parameters.thumbVerMargin) * this.thumbnails.length + this.parameters.thumbVerMargin;
            var heightAvailable = this.$thumbnails.height();

            var percentagePosition = relativeY/heightAvailable;
            this.thumbnailsTo = -Math.round((height - heightAvailable) * percentagePosition);
        }
    },
	
	//Add a thumbnail to the holder
	addThumbnail: function(e, data, id){
		//Create thumbnail
		var width = this.parameters.thumbWidth;
		var height = this.parameters.thumbHeight;
		var $thumbnail = this.thumbnails[id];
		$thumbnail.append( $("<img alt='Slide thumbnail'/>").attr("src", data).load(function(){
			$(this).resizeAndCenter(width, height, undefined, undefined, "full");
		}).css("opacity", 0).fadeTo(500, 1) );
	},
	
	//Mouse over thumbnail
	thumbnailOver:function (e){
		var $target = $(e.target);
		
		//Get thumbnail
		var $thumbnail;
		if($target.hasClass("slider_thumbnail"))
			$thumbnail = $target;
		else
			$thumbnail = $target.parent();
		
		if(!$thumbnail.hasClass("active"))
			$thumbnail.stop().fadeTo(400, this.parameters.thumbOverOpc);
	},
	
	//Mouse out thumbnail
	thumbnailOut:function (e){
		var $target = $(e.target);
		
		//Get thumbnail
		var $thumbnail;
		if($target.hasClass("slider_thumbnail"))
			$thumbnail = $target;
		else
			$thumbnail = $target.parent();
		
		if(!$thumbnail.hasClass("active"))
			$thumbnail.stop().fadeTo(400, this.parameters.thumbDeactiveOpc);
	},
	
	//THumbnail click
	thumbnailClick:function (e){
		var $target = $(e.target);
		
		//Get thumbnail
		var $thumbnail;
		if($target.hasClass("slider_thumbnail"))
			$thumbnail = $target;
		else
			$thumbnail = $target.parent();
		
		if(!$thumbnail.hasClass("active")){
			var rel = parseInt($thumbnail.attr("rel"), 10);
	    
        	this.currentSlide = rel;
        	this.updateSlide();
		}
		
		return false;
	},
	
	//BUILD ARROWS
	buildArrows:function(){
	    //"leftArrowVA"
        //"leftArrowVO"
        //"leftArrowHA"
        //"leftArrowHO"
        //"rightArrowVA"
        //"rightArrowVO"
        //"rightArrowHA"
        //"rightArrowHO"
        var buttonWidth = 30;
        var buttonHeight = 30;
        
        
        //BUILD LEFT ARROW
        var top = this.getPercentageFromOption(this.parameters.leftArrowVA);
        var left = this.getPercentageFromOption(this.parameters.leftArrowHA);
        var mTop = (this.parameters.leftArrowVA == "top" ? 0 : (this.parameters.leftArrowVA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.leftArrowVO;
        var mLeft = (this.parameters.leftArrowHA == "left" ? 0 : (this.parameters.leftArrowHA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.leftArrowHO;
        this.$leftArrow = $("<a class='arrow_button' href='#' onclick='return false;'><div class='inside_icon arrow_left'></div></a>").css({
            "position":"absolute",
            "top":top,
            "left":left,
            "margin-top":mTop,
            "margin-left":mLeft,
            "width":buttonWidth,
            "height":buttonHeight
        }).appendTo(this.$root).bind(clickBind, $.proxy(this.previousSlide, this));
        
        //BUILD RIGHT ARROW
        var top = this.getPercentageFromOption(this.parameters.rightArrowVA);
        var left = this.getPercentageFromOption(this.parameters.rightArrowHA);
        var mTop = (this.parameters.rightArrowVA == "top" ? 0 : (this.parameters.rightArrowVA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.rightArrowVO;
        var mLeft = (this.parameters.rightArrowHA == "left" ? 0 : (this.parameters.rightArrowHA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.rightArrowHO;
        this.$rightArrow = $("<a class='arrow_button' href='#' onclick='return false;'><div class='inside_icon arrow_right'></div></a>").css({
            "position":"absolute",
            "top":top,
            "left":left,
            "margin-top":mTop,
            "margin-left":mLeft,
            "width":buttonWidth,
            "height":buttonHeight
        }).appendTo(this.$root).bind(clickBind, $.proxy(this.nextSlide, this));
	},
	
    //BUILD PLAY VIDEO BUTTON
	buildPlayVideo: function(){
        var buttonWidth = 65;
        var buttonHeight = 42;
        
        this.$playVideo = $("<a class='tooglePlayVideo' href='#' onclick='return false;'><i class='esza-play'></i></a>").appendTo(this.$root).css("display", "none").bind(clickBind, $.proxy(this.playVideo, this));
        
        this.$videoHolder = $("<div class='videoHolder'></div>").appendTo(this.$root).css({
            "display": "none",
            "opacity": "0"
        });
        
        //Make close video button
        $("<a class='close_button' href='#' onclick='return false;'><div class='close_ico inside_icon'></div></a>").appendTo(this.$videoHolder).bind(clickBind, $.proxy(this.closeVideo, this));
	
	},
	
	playVideo: function(){
	    this.$videoHolder.css("display", "").fadeTo(150, 1);
	    
	    var url = "";
        this.playerId = "";
        
        var backgroundType = this.slides[this.currentSlide].parameters.backgroundType;
        var backgroundId = this.slides[this.currentSlide].parameters.backgroundId;
        this.backgroundId = backgroundId;
        
        jQuery.post(
            adminAjax,
            {
                'action' : 'pq_get_video',
                'id': backgroundId,
                'type': backgroundType,
                'autoplay': "1",
                "frontend": "true"
            },
            $.proxy(function( response ) {
                $('<iframe src="'+response+'" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').prependTo(this.$videoHolder);
            }, this)
        );
        
        //Pause autoplay
        this.pauseAutoplay();

        $(this).trigger("video_play");
        
        return false;
	},
	
	//Closes the video holder
	closeVideo: function(){
	    //Fade out and remove
	    this.$videoHolder.fadeTo(200, 0, function(){
	       $(this).css("display", "none"); 
	       $(this).find("iframe").remove();
	    });
           
        //Resume autoplay
        this.resumeAutoplay();

        $(this).trigger("video_close");
	},
    
    
	
	//BUILD PLAY|PAUSE BUTTON
    buildPlayPause:function(){
        //"PlayPauseVA" 
        //"PlayPauseVO" 
        //"PlayPauseHA"
        //"PlayPauseHO" 
        var buttonWidth = 24;
        var buttonHeight = 24;
        
        
        //BUILD PLAY|PAUSE BUTTON
        var top = this.getPercentageFromOption(this.parameters.PlayPauseVA);
        var left = this.getPercentageFromOption(this.parameters.PlayPauseHA);
        var mTop = (this.parameters.PlayPauseVA == "top" ? 0 : (this.parameters.PlayPauseVA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.PlayPauseVO;
        var mLeft = (this.parameters.PlayPauseHA == "left" ? 0 : (this.parameters.PlayPauseHA == "center" ? -buttonHeight/2 : -buttonHeight)) + this.parameters.PlayPauseHO;
        this.$tooglePlay = $("<a class='tooglePlay' href='#' onclick='return false;'><div class='inside_icon'></div></a>").css({
            "position":"absolute",
            "top":top,
            "left":left,
            "margin-top":mTop,
            "margin-left":mLeft,
            "width":buttonWidth,
            "height":buttonHeight
        }).appendTo(this.$root).bind(clickBind, $.proxy(this.toogleAutoplay, this));
        
        if(Modernizr.canvas){
            this.$knob = $('<div></div>').css({
                "position":"absolute",
                "top":0,
                "left":0
            }).appendTo(this.$tooglePlay);
            
            this.$knob.knob({
                'readOnly' : "true",
                "displayInput ":"false",
                "displayPrevious ":"false",
                "width":buttonWidth,
                "thickness":0.21,
                "fgColor":"#ffffff",
                "bgColor":"transparent"
            });
        }
    },
    
    
    
    //Keyboard interaction
    addKeyboardInteraction: function(){
    	$(document).keydown($.proxy(this.keyPressed, this));
    },
    
    //On keyboard key press
    keyPressed: function(event){
        var key = event.which;
    	if ( key  == 37 ) {
    		//left
    		this.previousSlide();
    	}
    	else if ( key  == 39 ) {
    		//right
    		this.nextSlide();
    	}
    },
    
	
	//UPDATE SIZE
	updateSize: function(norepeat, customHeight, customIsPercentage){

		var isHeightPercentage = isNaN(this.parameters.height);
	    this.width = parseFloat(this.$root.width(), 10);
	    
	    if(customHeight != undefined){
	    	this.parameters.height = customHeight;
	    	isHeightPercentage = customIsPercentage;
	    }
	    
	    if(isHeightPercentage)
	    	this.height = this.parameters.height;
	    else
        	this.height = Math.round((parseFloat(this.parameters.height, 10) / 100.0) * this.width);
        	
	    this.$root.css("height", this.height);
	    
	    var height = this.height;
	    if(isHeightPercentage)
	    	height = this.$root.height();
	    
	    for(var i = 0; i< this.slides.length ; i++)
            this.slides[i].resize(this.width, height);
        
        if(norepeat){
        	clearTimeout(this.sizeTimeout);
        	this.sizeTimeout = setTimeout($.proxy(function(){
                this.updateSize(false);
            }, this), 50);
        }
        this.height = height;
	},

    window_resize_timeout: function(){
        clearTimeout(this.resize_timeout);
        this.resize_timeout = setTimeout($.proxy(this.updateSize, this), 200);
    },
	
    //RESET AUTOPLAY
	resetAutoplay: function(){
	    this.currentTime = 0;
	    
	    clearInterval(this.autoplayTimer);
        this.autoplayTimer = setInterval($.proxy(this.fireAutoplay, this), this.autoPlayRate);
	},
	
    //FIRES AUTOPLAY
	fireAutoplay: function(){
		this.currentTime += this.autoPlayRate;
		if(this.currentTime >= this.autoplayTime){
		    //finished
		    this.currentTime = 0;
		    this.nextSlide();
		}
		
		this.knobUpdate(100 * (this.currentTime/this.autoplayTime));
	},
	
	//UPDATE PLAY/PAUSE BUTTON TIMER
	knobUpdate: function(angle){
        if(this.parameters.showPlayPauseButton && Modernizr.canvas)
            this.$knob.val(angle).trigger('change'); 
	},


    animateInc: function(blockOffset){

        var to = (this.currentSlide * -100) + this.dragOffset;

        var previousSlidePosition = this.oldSlide * -100;

        if( blockOffset !== true && !this.dragging && this.parameters.slider_transition_starting > 0 && Math.abs(this.current - previousSlidePosition) <  this.parameters.slider_transition_starting){
            if(Modernizr.csstransitions)
                this.$slides_holder.setTransition( "none" );

            var jumpTo = previousSlidePosition > to ? previousSlidePosition - this.parameters.slider_transition_starting : previousSlidePosition + this.parameters.slider_transition_starting;
            
            this.$slides_holder.css("left", jumpTo+"%");
            this.$slides_holder.height();
        }

        if(Modernizr.csstransitions && !this.dragging){
            this.$slides_holder.setTransition( this.transitionString );
            this.$slides_holder.css("left", to+"%");
        }
        else{
            if(this.dragging)
                this.$slides_holder.css("left", to+"%");
            else
                this.$slides_holder.stop().animate({
                    "left": to+"%"
                }, this.parameters.slider_transition_duration*1000 , getTween(this.parameters.slider_transition_ease, this.parameters.slider_transition_type));
        }


        this.current = to;
        
        
    },
	
    //UPDATE CURRENT SLIDE
	updateSlide: function(){
	    if(this.currentSlide != this.oldSlide){
            if(this.currentSlide < 0)
                this.currentSlide = this.numSlides-1;
            if(this.currentSlide >= this.numSlides)
                this.currentSlide = 0;
                
            //animate In
            this.slides[this.currentSlide].animateIn( );
            
            if(this.firstSlide){
            	if(!this.parameters.buttonsHide || (this.parameters.buttonsHide && this.overButtonsHolder))
            		this.$buttonsHolder.stop(true, false).fadeTo(400, 1);
            }

            if(this.firstSlide){
                this.$slides_holder.fadeTo(400, 1);
                this.hasLoaded = true;
                $(this).trigger("sliderLoaded");
                this.$root.trigger("load");
                this.$root.get( 0 ).complete = true;
            }
            else{
                this.animateInc();
            }

            
            this.firstSlide = false;
                
            //animate Out
            if(this.oldSlide != -1)
            this.slides[this.oldSlide].animateOut(  );
            
            
            
            //buttons
            if(this.parameters.showButtons){
                $.each(
                    this.buttons,
                    $.proxy(function(index, button){
                        button.removeClass("active");
                        $.proxy(this.buttonOut, button)();
                    }, this)
                );

                this.buttons[this.currentSlide].addClass("active");
                $.proxy(this.buttonOver, this.buttons[this.currentSlide])();
            }
            //thumbnails
            else if(this.parameters.useThumbnails){
            	if(this.oldSlide != -1){
            		this.thumbnails[this.oldSlide].removeClass("active");
            		this.thumbnails[this.oldSlide].stop().fadeTo(400, this.parameters.thumbDeactiveOpc);
            	}
            	
        		this.thumbnails[this.currentSlide].addClass("active");
        		this.thumbnails[this.currentSlide].stop().fadeTo(400, this.parameters.thumbActiveOpc);

        		//Active to center
				if(this.parameters.thumbsActiveCenter){
					//center horizontally
					if(this.parameters.thumbsPosition == "top" || this.parameters.thumbsPosition == "bottom")
						this.$thumbnailsHolder.animate({
							"margin-left": ((-this.parameters.thumbWidth/2) - (this.parameters.thumbWidth + this.parameters.thumbHorMargin)*this.currentSlide) +"px"
						}, 300, "easeOutExpo");
					
					//center vertically
					else
						this.$thumbnailsHolder.animate({
							"margin-top": ((-this.parameters.thumbHeight/2)- (this.parameters.thumbHeight + this.parameters.thumbVerMargin)*this.currentSlide) +"px"
						}, 300, "easeOutExpo");
					
				}
                else{
                    this.thumbnailsToNormalPos();
                }
            }

            //video
            if(this.slides[this.currentSlide].isVideo){
                this.$playVideo.css("display", "");
                if( this.slides[this.currentSlide].parameters.videoAutoplay ){
                    this.playVideo();
                }
            }
            else
                this.$playVideo.css("display", "none");
                
            
            this.oldSlide = this.currentSlide;
            
            this.autoplayTime = this.slides[this.currentSlide].parameters.slideDuration * 1000;
            if(this.parameters.autoplay )
                this.resetAutoplay();
            else {
                this.currentTime = 0;
                this.knobUpdate(0);
            }
            
            //Trigger slide change for binding
            $(this).trigger("changeSlide", [this.currentSlide]);
	    }
	},
	
    //NEXT SLIDE
	nextSlide: function(){
		if(this.slides.length > 1){
			this.currentSlide ++;
			this.updateSlide();
		}
		
		return false;
	},
	
    //PREVIOUS SLIDE
	previousSlide: function(){
		if(this.slides.length > 1){
			this.currentSlide --;
			this.updateSlide();
		}
        return false;
	},
	
	//Pause slider autoplay
	pauseAutoplay: function(){
	    if(this.parameters.autoplay){
            clearInterval(this.autoplayTimer);
            this.parameters.autoplay = false;
            if(this.parameters.showPlayPauseButton)
             this.$tooglePlay.addClass("paused");
        }
	},
	
    //Resume slider autoplay
	resumeAutoplay: function(){
	    if(!this.parameters.autoplay){
	        this.autoplayTimer = setInterval($.proxy(this.fireAutoplay, this), this.autoPlayRate);
            this.parameters.autoplay = true;
            if(this.parameters.showPlayPauseButton)
                this.$tooglePlay.removeClass("paused");
	    }
	},
	
	//TOOGLE AUTOPLAY
	toogleAutoplay: function(){
	    if(this.parameters.autoplay)
            this.pauseAutoplay();
	    else
            this.resumeAutoplay();
	    return false;
	},
	
	//BUTTON CLICK
	goToClick:function(e){
		if(this.slides.length > 1){
	    	var $target = $(e.target);
	    	var rel = parseInt($target.attr("rel"), 10);
	    
        	this.currentSlide = rel;
        	this.updateSlide();
      	}
        return false;
	},
    
    //BUTTON OVER
    buttonOver:function(){
        $("div", $(this)).stop().fadeTo(200, 1);
    },
    
    //BUTTON OUT
    buttonOut:function(){
        if( !$(this).hasClass("active") )
            $("div", $(this)).stop().fadeTo(200, 0);
    }
};

module.exports = Slider;

},{"./Element.js":12,"./KenBurns.js":13,"./Slide.js":14}]},{},[]);
