define(["jquery"], function($) {
	var Slide = function(){
	    
	    this.elements = new Array();//SliderEditorElement objects
	    
	    this.parameters = {
	         //MAIN
	        "buttonsColor"  : 0,
	        
	        //BACKGROUND
	        "backgroundType": "image",
	        "backgroundId"	: "",
	        "backgroundThumb": "",
	        "thumbnail"		: "",
	        "slideDuration" : 7.0,
	        "videoAutoplay" : "false",
	        
	        //KEN BURNS
	        "useKenBurns"   : "false",
	        "kbDelay"       : 0,
	        "kbDuration"    : 4,
	        "kbStartTop"    : 0.5,
	        "kbStartLeft"   : 0.5,
	        "kbStartSize"   : 1,
	        "kbEndTop"      : 0.5,
	        "kbEndLeft"     : 0.5,
	        "kbEndSize"     : 1 ,

	    	"vertical_snapping": "center",
	    	"horizontal_snapping": "center"
	    };
	}
	Slide.prototype = {
		/*--------------------------------------------------------------------------------------
		 *
		 * Elements
		 * 
		 *--------------------------------------------------------------------------------------*/
		
		//Add element to this slider
	    addElement: function(element){
	        this.elements.push(element);
	    },
	    
	    //Remove all elements
	    removeElements: function(){
	    	$.each(
	    		this.elements,
	    		function(index, element){
	    			element.remove();
	    		}
	    	);
	    },

	    //Remove Element
	    removeElement: function(depth){
	    	var i;
	    	for(i = 0; i < this.elements.length ; i++)
				if(this.elements[i].depth == depth){
	    			this.elements.splice(i, 1);
	    			break;
				}

			for(var a = i; a < this.elements.length ; a++)
		    	this.elements[a].depth --;
	    },
	    
	    //Append all elements
	    appendElements: function(){
	    	$.each(
	    		this.elements,
	    		function(index, element){
	    			if(element.created)
	    				element.appendElement();
	    			else
	    				element.createElement(false);

	    			element.updatePosition(false);
	    		}
	    	);
	    },

	    //Change all elements animation phase
	    changeElementsPhase: function(phase){
	    	$.each(
	    		this.elements,
	    		function(i, element){
					element.changeInstance( phase );
	    		}
	    	);
	    },
	    
	    
	    
	    /*--------------------------------------------------------------------------------------
		 *
		 * Configuration Options
		 * 
		 *--------------------------------------------------------------------------------------*/
		
	    //Set configuration 
	    setMain: function(options){
	        this.parameters.buttonsColor = options.buttonsColor;
	    },
	    //Get configuration 
	    getMain: function(){
	        var options = new Object();
	        
	        options.buttonsColor = this.parameters.buttonsColor;
	        
	        return options;
	    },
	    
	    
	    
	    
	    /*--------------------------------------------------------------------------------------
		 *
		 * Background Options
		 * 
		 *--------------------------------------------------------------------------------------*/
	    
	    //Set background
	    setBackground: function(obj){
	        this.parameters.backgroundType = obj.type;
	        this.parameters.backgroundId = obj.id;
	        this.parameters.backgroundThumb = obj.thumb;
	        this.parameters.thumbnail = obj.thumbnail;
	        this.parameters.videoAutoplay = obj.videoAutoplay;
	    },
	    //Get background
	    getBackground: function(){
	        var obj = new Object();
	        
	        obj.type = this.parameters.backgroundType;
	        obj.id = this.parameters.backgroundId;
	        obj.thumb = this.parameters.backgroundThumb;
	        obj.thumbnail = this.parameters.thumbnail;
	        obj.videoAutoplay = this.parameters.videoAutoplay;
	        
	        return obj;
	    },
	    
	    
	    
	    /*--------------------------------------------------------------------------------------
		 *
		 * Ken Burns Options
		 * 
		 *--------------------------------------------------------------------------------------*/
	    setKenBurns: function(options){
	        this.parameters.useKenBurns = options.use;
	        this.parameters.kbDelay = parseFloat(options.delay, 10);
	        this.parameters.kbDuration = parseFloat(options.duration, 10);
	        
	        this.parameters.kbStartTop = options.startTop;
	        this.parameters.kbStartLeft = options.startLeft;
	        this.parameters.kbStartSize = options.startSize;
	        this.parameters.kbEndTop = options.endTop;
	        this.parameters.kbEndLeft = options.endLeft;
	        this.parameters.kbEndSize = options.endSize;
	    },
	    getKenBurns:function(){
	        var options = new Object();
	        
	        options.use = this.parameters.useKenBurns;
	        options.delay = this.parameters.kbDelay;
	        options.duration = this.parameters.kbDuration;
	        
	        options.startTop = this.parameters.kbStartTop;
	        options.startLeft = this.parameters.kbStartLeft;
	        options.startSize = this.parameters.kbStartSize;
	        options.endTop = this.parameters.kbEndTop;
	        options.endLeft = this.parameters.kbEndLeft;
	        options.endSize = this.parameters.kbEndSize;
	        
	        return options;
	    },
	    
	    
	    
	    val:function(){
	        var val = "";
	        
            val += "<div class='slide' rel='";
            
            //main
            $.each(
                this.parameters,
                $.proxy(function(index, value){
                    val+= index + ":" + value + "; ";
                })
            );
            
            val += "'>";
            
            //Elements
            val += "<div class='slide_elements'>";
            for(var i = 0; i < this.elements.length ; i++)
            	for(var a = 0; a < this.elements.length ; a++)
            		if(this.elements[a].depth == i){
                		val += this.elements[a].val();
            			break;
            		}
            	
            
            val+= "</div></div>";
	        
	        return val;
	    },
	    setVal:function($slide){
	        var rel = stringToObject($slide.attr("rel"));
	        
	        //Set parameters
	        $.each(
	            this.parameters,
	            $.proxy(function(index){
	                if(rel.hasOwnProperty(index))
	                    this.parameters[index] = parseParameter(rel[index]);
	            }, this)
	        );
        	if(WP_DEBUG)console.log(this.parameters);
	    }
	}
	
	return Slide;
});

