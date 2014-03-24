define(["jquery", 
		
		"./Slide", 
		"./Element", 
		"./KenBurns",
		 
		"jquery/jquery.easing.1.3",
		"jquery/jquery.mobile.vmouse",
		
		"utils/utils", 
		"utils/knob", 
		"utils/modernizr.custom.05064"], function($, Slide, Element, KenBurns) {
			
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
                "pauseOnOver"           :true    ,
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
	    },
	    
	    //Mouse out slider handler
	    mouseOutSlider: function(){
            if(this.parameters.buttonsHide && !this.firstSlide){
                //buttons out
                this.$buttonsHolder.stop(true, false).delay(this.parameters.buttonsHideDelay*1000).fadeTo(this.parameters.buttonsHideSpeed*1000, 0);
            }
	        else if(this.parameters.buttonsHide)
	        	this.overButtonsHolder = false;
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
                    'type': backgroundType
                },
                $.proxy(function( response ) {
                    $('<iframe src="'+response+'&autoplay=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').prependTo(this.$videoHolder);
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
        	$(document).keypress($.proxy(this.keyPressed, this));
        },
        
        //On keyboard key press
        keyPressed: function(event){
        	if ( event.keyCode  == 37 ) {
        		//left
        		this.previousSlide();
        	}
        	else if ( event.keyCode  == 39 ) {
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
	
  	return Slider;
});