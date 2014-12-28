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
