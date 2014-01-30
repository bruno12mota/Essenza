define(["jquery", "utils/utils", "essenza/Shortcodes", "jquery/jquery.easing.1.3"], function(){
	
	var Element = function($obj, width, height){
		var rel = $obj.attr("rel");
		//this.$obj = $("<div class='element'></div>").append($obj);
		this.$obj = $obj;
		this.rel = $obj.attr("rel");
		this.xratio = 1;
		this.yratio = 1;
		this.offScale = 1;
		this.ratioShouldBe = 1;
	    this.currentStep = 1;
	    this.builderHeight = height;
	    this.builderWidth = width;
		
		//default options
		//parameters
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
	    	
	    	"ease1": 0,
	    	"ease2": 0,
	    	"ease3": 0,
	    	
	    	"type1": 0,
	    	"type2": 0,
	    	"type3": 0,
	    	
	    	"iniWidth": 0,
	    	"iniHeight": 0,

	    	"vertical_snapping": "center",
	    	"horizontal_snapping": "center",
	    	"min_scale": 0,
	    	"max_scale": 999
	    };
		
		this.parseProperties();
		this.minScale = parseFloat(this.parameters.min_scale, 10)/100.0;
		this.maxScale = parseFloat(this.parameters.max_scale, 10)/100.0;
		
        this.isImage = (this.parameters.type == "image");
		this.$obj.css({
			"top":0,
			"left":0,
			"line-height": "normal"
		}).addClass("element");
		
		//Size
		this.$obj.css("width", this.parameters.iniWidth+"px");
        this.$obj.find(">*").css("display", "block");
		if(this.isImage)
            this.$obj.css("height", this.parameters.iniHeight+"px");
        else
        	this.parameters.iniHeight = this.$obj.height();

        if(this.parameters.type == "button"){
        	newPqButton.call( this.$obj.find("a").get(0) );
        }
		
		this.makeAnimationInstances();
        this.transform();

        //Set opacity
        this.$obj.changeOpacity( parseFloat( this["instance"+this.currentStep].opacity, 10) );
	}
	
	Element.prototype = {
		parseProperties: function(){
			//get properties from rel attribute
            var rel = this.rel;
            var properties = jQuery.parseJSON(rel);
            
			if(properties != undefined){
	    
	            //ELEMENT PROPERTIES
	            $.each(
	                properties,
	                $.proxy(function( index, value ){
	                    if (this.parameters.hasOwnProperty(index)){
	                        //exists
	                        this.parameters[index] = value;
	                        
	                        this.parameters[index] = parseParameter(this.parameters[index]);
	                    }
	                }, this)
	            );
			}
		},
		
		makeAnimationInstances: function(){	
			
			var isImage = (this.parameters.type == "image");
			
			//var margintop = 0, marginleft = 0;
			//var width = this.$obj.outerWidth();
			//var height = this.$obj.outerHeight();

			this.instance1 = {"translateX": this.parameters.xpos1, "translateY": this.parameters.ypos1, "opacity": this.parameters.opc1};
            this.instance2 = {"translateX": this.parameters.xpos2, "translateY": this.parameters.ypos2, "opacity": this.parameters.opc2};
            this.instance3 = {"translateX": this.parameters.xpos3, "translateY": this.parameters.ypos3, "opacity": this.parameters.opc3};
            this.instance4 = {"translateX": this.parameters.xpos4, "translateY": this.parameters.ypos4, "opacity": this.parameters.opc4};
			
			if(isImage){
			    this.instance1["scale"] =  this.parameters.size1;
                this.instance2["scale"] =  this.parameters.size2;
                this.instance3["scale"] =  this.parameters.size3;
                this.instance4["scale"] =  this.parameters.size4;
			}
			
            this.transition0 = "";
            this.transition1 = getTransition(this.parameters.ease1, this.parameters.type1, this.parameters.duration1);
            this.transition2 = getTransition(this.parameters.ease2, this.parameters.type2, this.parameters.duration2);
            this.transition3 = getTransition(this.parameters.ease3, this.parameters.type3, this.parameters.duration3);
		},
		animateStep: function(){
		    clearTimeout(this.stepTimeout);
		    
		    //CSS ANIMATIONS ARE AVAILABLE
		    if(Modernizr.csstransitions){
		        
		        //Set transition properties for this step
                this.$obj.setTransition(this["transition"+this.currentStep]);
                this.currentStep ++;
                    
                //Set transform
                this.transform();

		        //Set opacity
		        this.$obj.changeOpacity( parseFloat( this["instance"+this.currentStep].opacity, 10) );
		    
			    if(this.currentStep < 3){
			        this.stepTimeout = setTimeout($.proxy(this.animateStep, this), (this.currentStep > 1 ? this.parameters["duration"+(this.currentStep-1)]*1000 : 0) + this.parameters["delay"+(this.currentStep)]*1000);
			    }
		    }
		    else{
		    	if(this.currentStep == 0){

	                //Set transform
	                this.transform();

                	this.currentStep ++;

                	this.$obj.stop().animate({  opacity: parseFloat( this["instance"+this.currentStep].opacity, 10)/100.0 }, 1);
					this.stepTimeout = setTimeout($.proxy(this.animateStep, this), this.parameters["delay"+(this.currentStep)]*1000);
		    	}
		    	else{
		    		var initialValues = this.getCurrentStepTransfValues();
		    		var transition = this["transition"+this.currentStep];
	                this.currentStep ++;
					var endValues = this.getCurrentStepTransfValues();


					this.$obj.css("borderSpacing", 0);

					this.$obj.stop();
                	this.$obj.animate({  opacity: parseFloat( this["instance"+this.currentStep].opacity, 10)/100.0 }, {queue:false}, 1);
			    	this.$obj.animate(
			    		{  	
			    			"borderSpacing": 100 
			    		}, 
			    		{
			    			//QUEUE
			    			queue: false,

					  		//STEP
					  		step: $.proxy(function( now, fx ) {
					  			now = now / 100;
					  			var transX = initialValues.transX + (endValues.transX - initialValues.transX)*now;
					  			var transY = initialValues.transY + (endValues.transY - initialValues.transY)*now;
					  			var scale = initialValues.scale + (endValues.scale - initialValues.scale)*now;

								this.applyTransform(transX, transY, scale);
					  		}, this),
					  		
					  		//DURATION
					  		duration: (this.currentStep > 1 ? this.parameters["duration"+(this.currentStep-1)]*1000 : 0),
					  		
					  		//COMPLETE
					  		complete: $.proxy(function(){
				    			if(this.currentStep < 3)
									this.stepTimeout = setTimeout($.proxy(this.animateStep, this), this.parameters["delay"+(this.currentStep)]*1000);
							}, this)
						},
						transition
					);
		    	}
				

		    }
		},

		getCurrentStepTransfValues: function(){
			var scale = this.isImage ? this["instance"+this.currentStep]["scale"] / 100 : 1;
			var stepX = this["instance"+this.currentStep].translateX;
			var stepY = this["instance"+this.currentStep].translateY;

			var transY = stepY;
			var transX = stepX;

			transX *= this.offScale;
			transY *= this.offScale;
			transX += this.xExtra;
			transY += this.yExtra;
			scale *= this.offScale;

			transX = Math.round(transX);
			transY = Math.round(transY);

			return {
				"transX": transX,
				"transY": transY,
				"scale": scale
			};
		},

		transform: function(){
			if(this["instance"+this.currentStep] == undefined)
				return;

			var values = this.getCurrentStepTransfValues();
			this.applyTransform(values.transX, values.transY, values.scale);
		},

		applyTransform: function(transX, transY, scale){

			if(this.isImage && Modernizr.csstransforms)
				this.$obj.setTransform("translate("+transX+"px,"+transY+"px) scale("+scale+")");
			
			else if(Modernizr.csstransforms){
                this.$obj.setTransform("translate("+transX+"px,"+transY+"px)");
                this.$obj.find(">*").setTransform("scale("+scale+")");
            }

            else{
				this.$obj.css({
					"top": transY+"px",
					"left": transX+"px"
				});
				
				if(this.isImage){
					this.$obj.find(">*").css({
						"width": scale*100 + "%",
						"height": scale*100 + "%"
					})
				}
				else
					this.$obj.find(">*").css({
						"-ms-filter": "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+scale+", M12=0, M21=0, M22="+scale+")",
						"filter": "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+scale+", M12=0, M21=0, M22="+scale+")"
					});
            	
            }
				
			
		},

		animateIn: function(){
		    this.currentStep = 0;
		    this.animateStep();
		},
		animateOut: function(){
		    this.currentStep = 3;
		    this.animateStep();
		},
		resize: function(width, height){
			//Set transform
			this.width = width ;
			this.height = height ;

			this.xratio = this.width / this.builderWidth;
    		this.yratio = this.height / this.builderHeight;

    		this.offScale = Math.min(this.xratio, this.yratio);

    		if(this.offScale < this.minScale)
    			this.offScale = this.minScale;
    		else if(this.offScale > this.maxScale)
    			this.offScale = this.maxScale;

    		this.xExtra = this.width - (this.builderWidth*this.offScale);
    		this.yExtra = this.height - (this.builderHeight*this.offScale);

    		this.xExtra *= ( this.parameters.horizontal_snapping == "left" ? 0 : (this.parameters.horizontal_snapping == "center" ? 0.5 : 1 ) );
    		this.yExtra *= ( this.parameters.vertical_snapping == "top" ? 0 : (this.parameters.vertical_snapping == "center" ? 0.5 : 1 ) );
			
			if(this.currentStep != -1){
				this.currentStep = 0;
		    	this.animateStep();
			}
		}
	}

	return Element;

});