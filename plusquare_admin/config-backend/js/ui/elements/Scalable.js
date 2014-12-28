var $ = jQuery;

var Scalable = function ($target, enabled, limited, width, height, widthRatio){
    this.$target = $target;
    this.enabled = false;
    
    this.limited = limited;
    
    this.width = width;
    this.height = height;
    this.widthRatio = widthRatio;
    
    if(enabled != undefined)
    this.enabled = enabled;
    
    var img = '<div class="scale_button"></div>';
    var imgCss = {
        "position":"absolute", 
        "margin-left":"-4px", 
        "margin-top":"-4px",
        "cursor":"pointer"
    }
    
    //DRAGGABLE
    this.$dragArea = $('<div></div>').css({
        "width":"100%",
        "height":"100%",
        "position":"absolute",
        "top":"0",
        "left":"0"
    });
    
	
	//
	this.$holder = $('<div></div>').css({
        "width":"100%",
        "height":"100%",
        "position":"absolute",
        "top":"0",
        "left":"0"
    }).appendTo(this.$target)
    .append(this.$dragArea)
    .append($(img)  .css(imgCss)
                    .css({"left":"0", "top":"0"})
                    .attr("rel", "lt")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
    .append($(img)  .css(imgCss)
                    .css({"left":"100%", "top":"0"})
                    .attr("rel", "rt")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
    .append($(img)  .css(imgCss)
                    .css({"left":"0%", "top":"100%"})
                    .attr("rel", "lb")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
    .append($(img)  .css(imgCss)
                    .css({"left":"100%", "top":"100%"})
                    .attr("rel", "rb")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
    
    this.top = 0;
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
    
	if(!this.enabled)
	    this.$holder.css("display", "none");
    
}

Scalable.prototype = {
	enable: function(){
	    this.$holder.css("display", "block");
	    this.enabled = true;
	},
	disable: function(){
	    this.$holder.css("display", "none");
        this.enabled = false;
	},
	
	//update
	update: function(){
		this.top = parseInt(this.$target.css("top"), 10);
	    this.left = parseInt(this.$target.css("left"), 10);
	    this.bottom = parseInt(this.$target.css("bottom"), 10);
	    this.right = parseInt(this.$target.css("right"), 10);
	    
	    //Strict format
        if(this.widthRatio != undefined){
        	this.ratioWidth();
        	//this.ratioHeight();
        }
        
        //Change
        this.$target.css({
            "top":this.top+"px",
            "left":this.left+"px",
            "bottom":this.bottom+"px",
            "right": this.right + "px"
        });
	},
	
	//Change ratio
	changeRatio: function(ratio){
		this.widthRatio = ratio;
		this.update();
	},
	
	//Change size
	changeSize: function(width, height){
		this.width = width;
		this.height = height;
		//this.update();
	},
	
	scaleDown:function(e){
	    if(this.enabled){
            var rel = $(e.target).attr("rel");
            
            this.iniX = e.pageX;
            this.iniY = e.pageY;
            
            //Horizontal
            this.fromLeft = false;
            if(rel.charAt(0)=='l')
                this.fromLeft = true;
            
            //vertical
            this.fromTop = false;
            if(rel.charAt(1)=='t')
                this.fromTop = true;
    
		    this.initop = parseInt(this.$target.css("top"), 10);
		    this.inileft = parseInt(this.$target.css("left"), 10);
		    this.inibottom = parseInt(this.$target.css("bottom"), 10);
		    this.iniright = parseInt(this.$target.css("right"), 10);
		    
		    this.top = this.initop;
		    this.left = this.inileft;
		    this.bottom = this.inibottom;
		    this.right = this.iniright;
            
            $(document).bind(mouseMoveBind, $.proxy(this.scaleMove, this));
            $(document).bind(mouseUpBind, $.proxy(this.scaleUp, this));
	    }
        return false;
	},
	scaleMove:function(e){
        var difX = e.pageX - this.iniX ;
        var difY = e.pageY - this.iniY ;
        
        //Vertically
        if(this.fromTop)
        	//from top
        	this.top = this.initop + difY;
        else
        	//from bottom
        	this.bottom = this.inibottom - difY;
        
        //Horizontally
        if(this.fromLeft)
        	//from left
        	this.left = this.inileft + difX;
        else
        	//from right
        	this.right = this.iniright - difX;
        
        
        //Verifications
        if(this.limited){
	        //left
	        if(this.left < 0)
	        	this.left = 0;
	        //right
	        if(this.right < 0)
	        	this.right = 0;
	        //top
	        if(this.top < 0)
	        	this.top = 0;
	        //bottom
	        if(this.bottom < 0)
	        	this.bottom = 0;
        }
        
        
        
    	//Strict format
        if(this.widthRatio != undefined){
        	if(difX > difY)
        		//In order to width
        		this.ratioWidth();
        	else
        		//In order to height
        		this.ratioHeight();
        }
        
        
        //Change
        this.$target.css({
            "top":this.top+"px",
            "left":this.left+"px",
            "bottom":this.bottom+"px",
            "right": this.right + "px"
        });
        
        this.$target.trigger("scale", {	"top": this.top,
							            "left": this.left,
							            "bottom":this.bottom,
							            "right": this.right});
        
        return false;
	},
	
	//Ratio in order to width
	ratioWidth: function(){
    	var currentWidth = this.width - this.left - this.right;
    	var currentHeight = this.height - this.top - this.bottom;
        	
		var height = currentWidth / this.widthRatio;
		var dif = height - currentHeight;
		
		 //Vertically
        if(this.fromTop){
        	//from top
        	this.top -= dif;
        	
        	if(this.limited){
	        	if(this.top < 0){
	        		var excess = 0 - this.top; // +
    				this.top = 0;
    				this.bottom -= excess; //check for overflow here?
    				
    				if(this.bottom < 0){
    					this.bottom = 0;
    					this.ratioHeight();
    				}
    					
	        	}
	        }
        }
        else{
        	//from bottom
        	this.bottom -= dif;
        	
        	if(this.limited){
	        	if(this.bottom < 0){
	        		var excess = 0 - this.bottom; // +
    				this.bottom = 0;
    				this.top -= excess; //check for overflow here?
    				
    				if(this.top < 0){
    					this.top = 0;
    					this.ratioHeight();
    				}
	        	}
	        }
        }
	},
	
	
	//Ratio in order to height
	ratioHeight: function(){
    	var currentWidth = this.width - this.left - this.right;
    	var currentHeight = this.height - this.top - this.bottom;
        	
		var width = currentHeight * this.widthRatio;
		var dif = width - currentWidth;
		
		//Horizontally
        if(this.fromLeft){
        	//from top
        	this.left -= dif;
        	
        	if(this.limited){
        		if(this.left < 0){
	        		var excess = 0 - this.left; // +
    				this.left = 0;
    				this.right -= excess; //check for overflow here?
    				
    				if(this.right < 0){
    					this.right = 0;
    					this.ratioWidth();
    				}
	        	}
        	}
        	
        }
        else{
        	//from bottom
        	this.right -= dif;
        	
        	if(this.limited){
	        	if(this.right < 0){
	        		var excess = 0 - this.right; // +
    				this.right = 0;
    				this.left -= excess; //check for overflow here?
    				
    				if(this.left < 0){
    					this.left = 0;
    					this.ratioWidth();
    				}
	        	}
	        }
        }
	},
	
	
	scaleUp:function(){
        unbindMoveAndUp();
        
        return false;
	},
	change:function(top, left, bottom, right){
	    this.$target.css({
            "top":top+"px",
            "left":left+"px",
            "bottom":bottom+"px",
            "right": right + "px"
        });
	}
}

module.exports = Scalable;
