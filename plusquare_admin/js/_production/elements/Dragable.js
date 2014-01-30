define(["jquery"], function(){
	var Dragable = function ($target, $dragArea, limited){
	    this.$target = $target;
	    this.$dragArea = $dragArea;
	    
	    this.limited = limited;
	    
	    this.top = 0;
	    this.left = 0;
	    this.right = 0;
	    this.bottom = 0;
	    
	    //ELEMENT DRAG
	    this.$target.addClass("grabhand");
	    this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
	}
	
	Dragable.prototype = {
		
		//On start drag
		dragDown:function(e){
	        var rel = $(e.target).attr("rel");
	        
	        this.$target.addClass("down");
	        
	        this.iniX = e.pageX;
	        this.iniY = e.pageY;
	        
	        this.iniTop = parseInt(this.$target.css("top"), 10);
	        this.iniLeft = parseInt(this.$target.css("left"), 10);
	        this.iniBottom = parseInt(this.$target.css("bottom"), 10);
	        this.iniRight = parseInt(this.$target.css("right"), 10);
	        
	        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
	        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
		    
	        return false;
		},
		
		//On drag move
		dragMove:function(e){
	        var difX = this.iniX - e.pageX;
	        var difY = this.iniY - e.pageY;
	        
	        this.top = this.iniTop - difY;
	        this.bottom = this.iniBottom + difY;
	        
	        this.left = this.iniLeft - difX;
	        this.right = this.iniRight + difX;
	        
	        if(this.top < 0){
	        	//overflow
	        	var excess = -this.top;
	        	this.top = 0;
	        	this.bottom -= excess;
	        }
	        else if(this.bottom < 0){
	        	//overflow
	        	var excess = -this.bottom;
	        	this.bottom = 0;
	        	this.top -= excess;
	        }
	        
	        if(this.left < 0){
	        	//overflow
	        	var excess = -this.left;
	        	this.left = 0;
	        	this.right -= excess;
	        }
	        else if(this.right < 0){
	        	//overflow
	        	var excess = -this.right;
	        	this.right = 0;
	        	this.left -= excess;
	        }
	        	
	        
	       	//Change
	        this.$target.css({
	            "top":this.top+"px",
	            "left":this.left+"px",
	            "bottom":this.bottom+"px",
	            "right": this.right + "px"
	        });
	        
	        
	        this.$target.trigger("drag", {	"top":this.top,
								            "left":this.left,
								            "bottom":this.bottom,
								            "right": this.right});
	        
	        return false;
		},
		
		//on drag end
		dragUp:function(){
	        this.$target.removeClass("down");
	        unbindMoveAndUp();
	        
	        return false;
		},
		
		change:function(top, left){
		    //CHECK TOP LIMIT
		    if(this.limitTop != undefined){
		       if(top < this.limitTop)
		           top = this.limitTop;
	        }
	       
	        //CHECK RIGHT LIMIT
	        if(this.limitRight != undefined){
	           if(left + this.currentWidth > this.limitRight)
	               left = this.limitRight - this.currentWidth;
	        }
	               
	        //CHECK BOTTOM LIMIT
	        if(this.limitBottom != undefined){
	           if(top + this.currentHeight > this.limitBottom)
	               top = this.limitBottom - this.currentHeight;
	        }
	               
	        //CHECK LEFT LIMIT
	        if(this.limitLeft != undefined){
	           if(left < this.limitLeft)
	               left = this.limitLeft;
	        }
		    
		    this.$target.css({
	            "top":top+"px",
	            "left":left+"px"
	        });
	        
	        //TRIGGER CHANGE EVENT
	        this.$target.trigger("drag", {"top":top, "left":left});
		},
		changeLimits: function(limitTop, limitRight, limitBottom, limitLeft){
		    this.limitTop = limitTop;
	        this.limitRight = limitRight;
	        this.limitBottom = limitBottom;
	        this.limitLeft = limitLeft;
		}
	}
	return Dragable;
});