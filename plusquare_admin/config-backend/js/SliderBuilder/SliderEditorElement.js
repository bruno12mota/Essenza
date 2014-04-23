define(["jquery", 
		"ui/ui-elements",
        "libraries/inheritance"], function($, ui) {

	var SliderEditorElement = Class.extend({
	    
	    //COMMON PROPERTIES INIT
		generalInit:function(depth, $elements, create, props){
	        //depth
	    	this.depth = depth;
	        this.removed = false;
	        this.appended = false;
	        
	        //main vars
	        this.$elements = $elements;
	        
	        //create element
	        this.$element = $('<div class="slide_element grabhand"></div>').append(this.$content);

		    
		    //Element Instances
		    this.currentInstance = 2;

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
		    	
		    	"ease1": "easeOut",
		    	"ease2": "easeOut",
		    	"ease3": "easeOut",
		    	
		    	"type1": "Expo",
		    	"type2": "Expo",
		    	"type3": "Expo",
		    	
		    	"iniWidth": 100,
		    	"iniHeight": 0,

		    	"vertical_snapping": "center",
		    	"horizontal_snapping": "center",
		    	"min_scale": 0,
		    	"max_scale": 999
		    };

		    if(this.type == "image"){
		    	this.parameters["iniWidth"] = this.iniWidth;
		    	this.parameters["iniHeight"] = this.iniHeight;
		    }
		    
		    //Update props (Loaded element)
		    if(props != undefined){
			    $.each(
			    	props,
			    	$.proxy(function(index, value){
			    		if(this.parameters.hasOwnProperty(index))
			    			this.parameters[index] = value;
			    	}, this)
			    );
		    }
		    
		    
		    if(this.type == "image"){
	        	this.width = this.iniWidth*(this.parameters["size"+this.currentInstance]/100);
	        	this.height = this.iniHeight*(this.parameters["size"+this.currentInstance]/100);
		    }
	        
	        //Create Element
	        if(create == true || create == undefined)
	           this.createElement();
	        
	        this.updateInstance();
		},

		updateInsideContent: function($clone){
			this.$content.remove();
			this.$content = $clone.unbind("click").removeClass("button_preview").attr("id", "");;

	        this.$element.prepend(this.$content);
		},
		
		//CREATE ELEMENT IN ELEMENTS HOLDER
		createElement : function( initial ){
		    if(this.removed)
	           return;
	           
			this.selected = false;	
			
			//Make off limits graphic
			this.$offLimits = $('<a class="off_limits" href="#"></a>');
			
			//Append Element
			this.appendElement();
			
			if(initial || initial == undefined){
				//Save Element sizes
				if(this.type != "image"){
					//update current
					this.width = this.parameters["iniWidth"];
			    	
			    	this.$element.css({
	                    "width":this.width+"px"
	                });
				}
				else
	    			this.$element.css({
	    				"width":this.width+"px",
	    				"height":this.height+"px"
	    			});
			}
				
			//Update position
			this.elementsWidth = this.$elements.width();
			this.elementsHeight = this.$elements.height();

			this.updatePosition();
			//alert(this.$element.width());
			
			this.created = true;
			this.overBoards = false;
			
			//ADD SCALABLE
			if(this.type == "image"){
			    this.$content.css({
			        "width":"100%",
			        "height":"100%"
			    });
	            this.scale = new ui.RelativeScalable(this.$element, false, true, true, true, true);
			}
			else{
				this.scale = new ui.RelativeScalable(this.$element, false, true, false, true, false);
			}
			
			//Add off limits as a dragger dummi for the element target
            this.scale.addDragger(this.$offLimits); 
			
			return false;
		},
		
		//APPENDS ELEMENT TO ELEMENTS
		appendElement:function(){
			if(this.removed)
		       return;
		    if(this.appended){
		    	this.$element.stop().show();
		       return;
		    }
		   
		    this.appended = true;

	        this.$element.appendTo(this.$elements);
	        this.$offLimits.appendTo(this.$elements);
	        
	        //LISTEN TO INSTANCE CHANGING
	        this.$elements.bind("instanceChange", $.proxy(this.changeInstance, this));
	        
		    //ELEMENT
	        this.$element.preventDragDefault();
			this.$element.click($.proxy(this.selectElement, this));
	        this.$element.css("cursor", "pointer");
			
			//OFF LIMITS
	        this.$offLimits.preventDragDefault();
	        this.$offLimits.click($.proxy(this.selectElement, this));
	        this.$offLimits.css("cursor", "pointer");

	        if(this.type == "image"){
	            this.$element.unbind("change");
	            this.$element.bind("change", $.proxy(this.onImageResize, this));
	        }
	        else{
	            this.$element.unbind("change");
	            this.$element.bind("change", $.proxy(this.onOtherResize, this));
	        }
			this.updateDepth();
			this.updatePosition();
	    },
		

		updateDepth: function(){
			this.$element.css("z-index", this.depth);
		},
		
		setDepth: function(depth){
			this.depth = depth;
			this.updateDepth();
		},
		
		
		
		
		//ELEMENT DRAGGING UPDATE POSITION
		updatePosition:function(animate){
			var top = this.parameters["ypos"+this.currentInstance];
			var left = this.parameters["xpos"+this.currentInstance];
	
	        if(animate == undefined)
	            animate = false;
	        
	        var objCss = {
	            "top": top +"px",
	            "left": left +"px",
	            "opacity": 1
	        };
	        
	        //Set image type size
	        if(this.type == "image"){
	            objCss.width = (this.iniWidth*(this.parameters["size"+this.currentInstance]/100)) + "px";
	            objCss.height = (this.iniHeight*(this.parameters["size"+this.currentInstance]/100)) + "px";
	        }
	        //Set button & text width
	        else
                objCss.width = this.iniWidth+"px";

            if(WP_DEBUG)console.log(objCss);
	        
	        //Change element position
	        if(animate)
	            this.$element.stop().animate(objCss, 200);
	        else
	    		this.$element.stop().css(objCss);
			
			//If element is created
			if(this.created){
	            //image size
	            if(this.type == "image")
	               this.parameters["size"+this.currentInstance] = Math.round((this.width / this.iniWidth)*1000)/10;
			    
			    //TRIGGER CHANGE EVENT
	            $(this).trigger("changePos");
			    
			    //Check overflow
				this.checkOverflow();
			}
		},
		
		//CHECK OVERFLOW
		checkOverflow:function(){
		    var w = this.width;
            var h = this.height;
            
            var top = this.parameters["ypos"+this.currentInstance];
            var left = this.parameters["xpos"+this.currentInstance];
            
            var overRight = left > this.elementsWidth;
            var overLeft = left < 0-w;
            var overTop = top < 0-h;
            var overBottom = top > this.elementsHeight;
            
            if(overRight || overLeft || overTop || overBottom){
                //over borders
                
                var leftTo = 0;
                var topTo = 0;
                var angle = "off_bottom";
                
                var olW = 54;
                var olH = 54;
                
                //overRight = left > (this.elementsWidth-w/2);
                //overLeft = left < 0-w/2;
                //overTop = top < 0-h/2;
                //overBottom = top > (this.elementsHeight-h/2);
                
                if(overTop && overLeft){
                    //rotate 135º
                    angle = "off_lt";
                }
                else if(overTop && overRight){
                    //rotate 225º
                    angle = "off_rt";
                    leftTo =  this.elementsWidth-olW;
                }
                else if(overBottom && overLeft){
                    //rotate 45º
                    angle = "off_lb";
                    topTo =  this.elementsHeight-olH;
                }
                else if(overBottom && overRight){
                    //rotate 315º or -45º
                    angle = "off_rb";
                    leftTo =  this.elementsWidth-olW;
                    topTo =  this.elementsHeight-olH;
                }
                else if(overBottom){
                    //rotate 0º
                    angle = "off_bottom";
                    topTo =  this.elementsHeight-olH;
                    leftTo = left+w/2-olW/2;
                }
                else if(overTop){
                    //rotate 180º
                    angle = "off_top";
                    leftTo = left+w/2-olW/2;
                }
                else if(overLeft){
                    //rotate 90º
                    angle = "off_left";
                    topTo =  top+h/2-olH/2;
                }
                else if(overRight){
                    //rotate -90º or 270º
                    angle = "off_right";
                    leftTo =  this.elementsWidth-olW;
                    topTo =  top+h/2-olH/2;
                }
                
                if(overTop)
                    this.$element.css("top", -h-7 +"px");
                else if(overBottom)
                    this.$element.css("top", this.elementsHeight+3 +"px");
                    
                if(overLeft)
                    this.$element.css("left", -w-6 +"px");
                else if(overRight)
                    this.$element.css("left", this.elementsWidth+3 +"px");
                
                if(topTo < 0)
                    topTo = 0;
                else if(topTo > this.elementsHeight-olH)
                    topTo = this.elementsHeight-olH;
                    
                if(leftTo < 0)
                    leftTo = 0;
                else if(leftTo > this.elementsWidth-olW)
                    leftTo = this.elementsWidth-olW;
                
                
                this.$offLimits.css({
                    "top":topTo,
                    "left":leftTo
                }).removeClass("off_lt off_rt off_lb off_rb off_bottom off_top off_left off_right")
                .addClass(angle);
                
                if(!this.overBoards){
                    this.$offLimits.stop().css("display", "block").fadeTo(200, 1);
                    
                    this.overBoards = true;
                }
            }
            else{
                //not over borders
                if(this.overBoards){
                    this.$offLimits.stop().fadeTo(200, 0, function(){
                        $(this).css("display", "none");
                    });
                    
                    this.overBoards = false;
                }
            }
		},
		
		
		
		
		
		//GET MAIN PROPERTIES
		getInstance:function(num){
		    num++;
		    var option = new Object();
		    
		    option.x = this.parameters["xpos"+num];
	        option.y = this.parameters["ypos"+num];
	        option.opacity = this.parameters["opc"+num];
	        
	        if(this.type == "image")
	            option.size = this.parameters["size"+num];
	        
	        return option;
		},
		
	    //GET ANIMATION PROPERTIES
		getAnimationInstance:function(num){
	        num++;
	        var option = new Object();
	        
	        option.delay = this.parameters["delay"+num];
	        option.duration = this.parameters["duration"+num];
	        option.ease = this.parameters["ease"+num];
	        option.type = this.parameters["type"+num];
	        
	        return option;
	    },
	    
	    //SET MAIN PROPERTIES
	    setInstance:function(num, options){
	        num++;
	        this.currentInstance = num;
	        
	        this.parameters["xpos"+this.currentInstance] = parseInt(options.x, 10);
	        this.parameters["ypos"+this.currentInstance] = parseInt(options.y, 10);
	        this.parameters["opc"+this.currentInstance] = parseFloat(options.opacity, 10);
	        
	        if(this.type == "image"){
	            this.parameters["size"+this.currentInstance] = parseFloat(options.size, 10);
	        
				this.width = (parseFloat(options.size, 10)/100) * this.iniWidth;
				this.height = (parseFloat(options.size, 10)/100) * this.iniHeight;
	        }
	        
	        this.updateInstance();
	    },
	    
	    
	    
	    
	    
	    //IMAGE ON RESIZE
	    onImageResize:function(e, obj){
			this.width = obj.width;
			this.height = obj.height;
			
            this.parameters["xpos"+this.currentInstance] = obj.left;
            this.parameters["ypos"+this.currentInstance] = obj.top;
			
			this.updatePosition(false);
	    },
	    
	     //OTHER RESIZE 
        onOtherResize:function(e, obj){
            this.width = obj.width;
            this.parameters["iniWidth"] = this.width;
            this.parameters["ypos"+this.currentInstance] = obj.top;
            this.parameters["xpos"+this.currentInstance] = obj.left;
            
            this.updatePosition(false);
        },
	    
	    //SET MAIN PROPERTIES
	    setAnimationInstance:function(num, options){
	        num++;
	        
	        this.parameters["delay"+num] = options.delay;
	        this.parameters["duration"+num] = options.duration;
	        this.parameters["ease"+num] = options.ease;
	        this.parameters["type"+num] = options.type;
	    },
	    
	    //MATCH PREVIOUS PROPS
	    matchPrevious:function(){
	         if(this.currentInstance != 0){
	            this.parameters["xpos"+this.currentInstance] =  this.parameters["xpos"+(this.currentInstance-1)];
	            this.parameters["ypos"+this.currentInstance] = this.parameters["ypos"+(this.currentInstance-1)];
	
	            this.updateInstance();
	         }
	    },
	    
	    //MATCH FOLLOWING PROPS
	    matchFollowing:function(){
	        if(this.currentInstance != 4){
	            //NOT ANIMATION INSTANCE
	            
	            this.parameters["xpos"+this.currentInstance] =  this.parameters["xpos"+(this.currentInstance+1)];
	            this.parameters["ypos"+this.currentInstance] = this.parameters["ypos"+(this.currentInstance+1)];
	
	            this.updateInstance();
	        }
	    },
		
		//SNAP
		snapTo: function(snap){
	        var top = 0, left = 0;
	        
	        //update height
	        if(this.type != "image")
	           this.height = this.$element.height();
	       if(WP_DEBUG)console.log(this.elementsWidth);
	       if(WP_DEBUG)console.log(this.width);
	        
		    //horizontal
		    switch(snap.charAt(0)){
		        case 'l':
		           left = 0;
		           break;
		        case 'c':
	               left = (this.elementsWidth/2 - this.width/2);
		           break;
	            case 'r':
	               left = (this.elementsWidth - this.width);
	               break;
		    }
		    
		    //vertical
	        switch(snap.charAt(1)){
	            case 't':
	               top = 0;
	               break;
	            case 'c':
	               top = (this.elementsHeight/2 - this.height/2);
	               break;
	            case 'b':
	               top = (this.elementsHeight - this.height);
	               break;
	        }
		    
	        this.parameters["xpos"+this.currentInstance] = Math.round(left);
	        this.parameters["ypos"+this.currentInstance] = Math.round(top);
		    
	        this.updateInstance();
		},
		
		//CHANGE IN INSTANCE
		changeInstance:function(instance){
	        this.currentInstance = instance;
	        this.updateInstance();
		},
		
		//UPDATE INSTANCE
		updateInstance:function(){
		    var top = this.parameters["ypos"+this.currentInstance];
	        var left = this.parameters["xpos"+this.currentInstance];
	        
	        if(this.type == "image"){
	            var width = this.iniWidth*(this.parameters["size"+this.currentInstance]/100);
	            var height = this.iniHeight*(this.parameters["size"+this.currentInstance]/100);
	            
				this.width = width;
				this.height = height;
	        }
	        
	        //opacity change
	        var opc = (this.parameters["opc"+this.currentInstance]/100);
	        this.$content.stop().fadeTo(200, opc);
	        
	        this.updatePosition(true);
		},
		
		
		
		//SELECT ELEMENT HANDLER
		selectElement: function(trigger){
	        if(!this.selected){
	    		this.selected = true;
	    		
	    		this.$offLimits.css({
	    			"border":"2px solid #FFFF00",
	    			"margin-left":"-2px",
	    			"margin-top":"-2px"
	    		});
	    		
	    		this.scale.enable();
	    		//this.scale.stop().fadeTo(200, 1);
	    		
	    		this.$elements.bind(mouseDownBind, $.proxy(this.unselectElement, this));

	    		if(trigger !== false)
	    			this.$elements.trigger("elementSelected", this);
	    		
	    		//remove cursor pointer
                this.$element.css("cursor", "");
                this.$offLimits.css("cursor", "");
	            
	            //ADD KEY LISTENERS
	            $("body").keydown($.proxy(this.keyDownHandler, this));
	        }
		},
		
		keyDownHandler: function(event){
		   switch (event.which){
		       case 37:
					//left
				   	this.parameters["xpos"+this.currentInstance]--;
					this.updatePosition();
				   	event.preventDefault();
				   	break;
		       case 38:
	                //top
					this.parameters["ypos"+this.currentInstance]--;
					this.updatePosition();
					event.preventDefault();
					break;
	           case 39:
	                //right
					this.parameters["xpos"+this.currentInstance]++;
					this.updatePosition();
					event.preventDefault();
					break;
	           case 40:
	                //top
					this.parameters["ypos"+this.currentInstance]++;
					this.updatePosition();
					event.preventDefault();
					break;
		   }; 
		   
		},
		
	    //ELEMENTS HOLDER MOUSE DOWN
		unselectElement: function(e){
		    var target = $(e.target);
			if (!($(e.target).get(0) === this.$element.get(0)) && this.$element.has(target).length == 0)
				this.unselectElem();
		},
		
	    //ACTUAL ELEMENT UNSELECT
		unselectElem: function(){
			if(this.selected){
				this.$offLimits.css({
					"border":"0px solid #A9A801",
					"margin-left":"0px",
					"margin-top":"0px"
				});
				
				//this.scale.stop().fadeTo(200, 0);
	            //if(this.type == "image")
	            this.scale.disable();
				this.$elements.trigger("elementUnselect", this);
				
				this.selected = false;	
				
	            //add pointer cursor
	            this.$element.css("cursor", "pointer");
	            this.$offLimits.css("cursor", "pointer");
	            
	            //UNBIND KEYS
	            $("body").unbind("keydown");
			}
		},
		
		//REMOVE ELEMENT
		remove: function(){
		    this.$element.stop().hide();
	        this.$offLimits.stop().hide();
		},
		
		//DELETE ELEMENT
		deleteElement: function(erase_on_list){
		    this.removed = true;
		    this.$element.stop().fadeTo(200, 0, function(){$(this).remove()});
	        this.$offLimits.stop().fadeTo(200, 0, function(){$(this).remove()});
		    this.appended = false;

		    if(erase_on_list)
	        	$("#slider_elements_overview_orderable_list").trigger("removeItem", [this.depth]);
		},
		
	    setSpecificValues: function(options){
	        
	        this.$element.css({
	        	"width":"auto",
	        	"overflow":"hidden !important",
	        	"top":0,
	        	"left":0,
	        	"bottom":"auto",
	        	"right":"auto"
	        });
	        
	        //Save Element sizes
			this.width = this.$element.width();
			this.height = this.$element.height();
			
			if(this.type != "image"){
		    	this.parameters["iniWidth"] = this.width;
		    	this.parameters["iniHeight"] = this.height;
			}
			
			this.$element.css({
				"width":this.width+"px",
				"height":this.height+"px",
				"overflow":"visible"
			});
	        
	        this.updatePosition(false);
	    },
	    getSpecificValues: function(){
	        return this.specifics;
	    },
	
		//Get val
		val: function(){
			if(this.removed)
				return "";
			
			var rel = JSON.stringify(this.parameters);
			
			//Change rel
			var $return = $("<div></div>").append(this.$content).attr("rel", rel);
			
			return $("<div></div>").append($return).html(); 
		}
	});
	
	var ButtonElement = SliderEditorElement.extend({
		init: function(depth, $elements, $button, create, props){
	        this.$content = $button.removeClass("button_preview").attr("id", "").addClass("pq_button");
	        
			this.type = "button";
	        this.generalInit(depth, $elements, create, props);
		}
	});
	
	var TextElement = SliderEditorElement.extend({
		init: function(depth, $elements, $textBlock, create, props){
	        this.$content = $textBlock.removeClass("button_preview").attr("id", "");
			
	        this.type = "text";
	        this.generalInit(depth, $elements, create, props);
	        
		}
	});
	
	var ImageElement = SliderEditorElement.extend({
		init: function(depth, $elements, img, width, height, create, props){
			this.$content = img;
			this.width = width;
			this.height = height;
			
			this.iniWidth = width;
			this.iniHeight = height;
			
	        this.type = "image";
	        this.generalInit(depth, $elements, create, props);
		}
	});
	
	return {
		"ImageElement":ImageElement,
		"TextElement":TextElement,
		"ButtonElement":ButtonElement
	};
});
