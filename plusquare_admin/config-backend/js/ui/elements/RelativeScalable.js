define(["jquery",
		"utils/utils"], function($){
	var RelativeScalable = function ($target, enabled, horizontal, vertical, dragable, preserveRatio){
	    //Save parameters
	    this.$target = $target;
	    this.enabled = false;
        this.dragable = dragable;
	    this.preserveRatio = preserveRatio;
	    if(this.preserveRatio == undefined)
	    	this.preserveRatio = true;
	    
        //Make holder
        this.$holder = $('<div class="scalable_holder"></div>').appendTo(this.$target);
        
	    //Get current attributes
	    this.left = parseInt($target.css("left"), 10);
        this.top = parseInt($target.css("top"), 10);
        this.width = $target.width();
        this.height = $target.height();
        this.ratio = this.width / this.height;

        if(WP_DEBUG)console.log(this.width);
        
        //Other
        this.minWidth = 5;
        this.minHeight = 5;
        
        //Save orientations
        this.horizontal = horizontal;
        this.vertical = vertical;
	    
	    
        //Dragging
        if(dragable){
            this.$dragArea = $('<div class="dragArea grabhand"></div>').appendTo(this.$holder);
            
            //bind
            this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
        }
	    
	    
		
		//Make scale draggers
        var img = '<div class="scale_button"></div>';
	    
	    //Only horizontal
	    if(horizontal && !vertical)
    	    this.$holder.append($(img)  .css({"left":"0%", "top":"50%"})
                	                    .attr("rel", "cl")
                	                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                	    .append($(img)  .css({"left":"100%", "top":"50%"})
                	                    .attr("rel", "cr")
                	                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
    	                    
    	//Only vertical
        else if(!horizontal && vertical)
            this.$holder.append($(img)  .css({"left":"0%", "top":"50%"})
                                        .attr("rel", "ct")
                                        .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                        .append($(img)  .css({"left":"100%", "top":"50%"})
                                        .attr("rel", "cb")
                                        .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
                            
        //Vertical & Horizontal
        else
            this.$holder.append($(img)  .css({"left":"0", "top":"0"})
                                        .attr("rel", "lt")
                                        .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                        .append($(img)  .css({"left":"100%", "top":"0"})
                                        .attr("rel", "rt")
                                        .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                        .append($(img)  .css({"left":"0%", "top":"100%"})
                                        .attr("rel", "lb")
                                        .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                        .append($(img)  .css({"left":"100%", "top":"100%"})
                                        .attr("rel", "rb")
                                        .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
	    
	    
	    this.$dragElements = Array();
	    this.$dragElements.push(this.$dragArea);

	    this.$scaleButtons = this.$holder.find(".scale_button");
	    
		if(!this.enabled)
		    this.$holder.css("display", "none");
	    
	}
	
	RelativeScalable.prototype = {
	    //Enable/Disable
		enable: function(){
		    this.$holder.css("display", "block");
		    this.enabled = true;
		    this.rebind();
		},
		disable: function(){
		    this.$holder.css("display", "none");
	        this.enabled = false;
		},
		rebind: function(){
 			if(this.dragable){
 				this.$dragArea.unbind(mouseDownBind);
            	this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
        	}
			this.$scaleButtons.unbind(mouseDownBind);
        	this.$scaleButtons.bind(mouseDownBind, $.proxy(this.scaleDown, this));
		},
		
		
		//Add dummi dragger
		addDragger: function($obj){
            $obj.addClass("grabhand").bind(mouseDownBind, $.proxy(this.dragDown, this));
            this.$dragElements.push($obj);
		},
		
		
		
		
		//Scale
		scaleDown:function(e){
		    if(this.enabled){
	            this.rel = $(e.target).attr("rel");
	            
	            this.iniX = e.pageX;
	            this.iniY = e.pageY;
	            
                this.left = parseInt(this.$target.css("left"), 10);
                this.top = parseInt(this.$target.css("top"), 10);
                this.width = this.$target.width();
                this.height = this.$target.height();
	            
	            $(document).bind(mouseMoveBind, $.proxy(this.scaleMove, this));
	            $(document).bind(mouseUpBind, $.proxy(this.scaleUp, this));
		    }
	        return false;
		},
		scaleMove:function(e){
	        var difX = e.pageX - this.iniX ;
	        var difY = e.pageY - this.iniY ;
	        
	        //Horizontal 
	        if(this.horizontal && !this.vertical){
		        if(this.rel == "cl"){
		        	this.left += difX;
		        	this.width -= difX;
		        }
		        else{
		        	this.width += difX;
		        }

	        
		        //Verifications
		        if(this.width < this.minWidth){
		        	if(this.rel == "cl")
			        	this.left -= (this.minWidth-this.width);
			        	
		        	this.width = this.minWidth;
		        }
	        }

	        //Vertical 
	        if(!this.horizontal && this.vertical){
		        if(this.rel == "cb"){
		        	this.top += difY;
		        	this.height -= difY;
		        }
		        else{
		        	this.height += difY;
		        }

		        //Verifications
		        if(this.height < this.minHeight){
		        	if(this.rel == "cb")
			        	this.top -= (this.minHeight-this.height);
			        	
		        	this.height = this.minHeight;
		        }
		    }

		    //Vertical & Horizontal 
	        if(this.horizontal && this.vertical){
	        	//horizontal
		        if(this.rel.charAt(0) == "l"){
		        	this.left += difX;
		        	this.width -= difX;
		        }
		        else{
		        	this.width += difX;
		        }

		        //vertical
		        if(this.rel.charAt(1) == "t"){
		        	this.top += difY;
		        	this.height -= difY;
		        }
		        else{
		        	this.height += difY;
		        }

		        //Min width
		        if(this.width < this.minWidth){
		        	if(this.rel.charAt(0) == "l")
			        	this.left -= (this.minWidth-this.width);
			        	
		        	this.width = this.minWidth;
		        }

		        //Ratio preserve
		        if(this.preserveRatio){
		        	if(this.width / this.height != this.ratio){
		        		var dif = this.height - (this.width / this.ratio);

		        		if(this.rel.charAt(1) == "t")
		        			this.top += dif;
		        		
		        		this.height = this.width / this.ratio;
		        	}
		        }
	        }

			this.iniX = e.pageX;
			this.iniY = e.pageY;
	        
            this.update();
	        
	        return false;
		},	
		scaleUp:function(){
	        unbindMoveAndUp();
	        return false;
		},
		
		
		
		
		//Dragable
		dragDown: function(e){
		    if(this.enabled){
		        this.currX = e.pageX;
                this.currY = e.pageY;
                
                this.left = parseInt(this.$target.css("left"), 10);
                this.top = parseInt(this.$target.css("top"), 10);
                this.width = this.$target.width();
                this.height = this.$target.height();
		        
                //grabhand close
                $.each(
                    this.$dragElements,
                    function(i, obj){
                        $(obj).addClass("down");
                    }
                );
		        
		        //Bind on move and up
                $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
                $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
		    }
		    return false;
		},
		dragMove: function(e){
		    var x = e.pageX;
            var y = e.pageY;
            
            //Update values
            this.left += (x - this.currX);
            this.top += (y - this.currY);
            
            //Update current
            this.currX = x;
            this.currY = y;
            
            this.update();
            
            return false;
        },
        dragUp: function(e){
            unbindMoveAndUp();
            
            //grabhand open
            $.each(
                this.$dragElements,
                function(i, obj){
                    $(obj).removeClass("down");
                }
            );
            
            return false;
        },
		
		
		
		//Validate and update current instance
		update: function(){
			var left = Math.round(this.left);
			var top = Math.round(this.top);
			var width = this.width;
			var height = this.height;
		   
		    //update position 
            this.$target.css({
                "left":left+"px",
                "top":top+"px"
            });
            
            //Horizontal
            if(this.horizontal)
                this.$target.css({
                    "width":width+"px"
                });
                
                
            //Vertical
            if(this.vertical)
                this.$target.css({
                    "height":height+"px"
                });
		    
		    //Trigger change
		    this.$target.trigger("change", {"left": left,
		                                    "top": top,
                                            "width": width,
                                            "height": height});
		},
		
		
		
		

		change:function(){
		}
	}
	
	return RelativeScalable;
});