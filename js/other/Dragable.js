define(["jquery", 
		"jquery/jquery.mobile.vmouse",
		"jquery/jquery.mousewheel.min",
		"utils/utils"], function($) {
			
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
	
	return Dragable;
});