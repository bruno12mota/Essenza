define(["jquery", "jquery/jquery.easing.1.3", "utils/utils"], function($) {
	
	
	
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
    
    return EasyBackground;
});
    
