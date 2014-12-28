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

