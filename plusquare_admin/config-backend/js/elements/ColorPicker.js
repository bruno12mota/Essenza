define(["jquery", "utils/utils"], function($){
	var ColorPicker = function ($this, active, id){
		this.active = active;
		this.opened = false;
		
		this.h = 90;
		this.s = 100;
		this.v = 50;
		
		this.id = id;
		
		this.$obj = $this;
	
		//Large Menu
		this.$largeMenu = $('<div class="largeMenu"></div>').appendTo($this);
		
		this.$color_circle = $('<div class="color_circle"></div>').appendTo(this.$largeMenu).click($.proxy(this.circlePickerClicked, this));
		
		this.$circle_picker = $('<div class="circle_picker"></div>').appendTo(this.$color_circle);
		
		this.$color_triangle = $('<div class="color_triangle"></div>').appendTo(this.$largeMenu).click($.proxy(this.circlePickerClicked, this));
		
		this.$triangle_overlap = $('<div class="triangle_overlap"></div>').appendTo(this.$color_triangle).click($.proxy(this.triangleClick, this));
		
		this.$triangle_picker = $('<a class="triangle_picker" onClick="return false;"></a>').appendTo(this.$triangle_overlap);
	
		
		//Small Menu
		this.$smallMenu = $('<div class="smallMenu"></div>').appendTo($this);
		
		this.$currentColor = $('<a class="currentColor" href="#" onClick="return false;"></a>').appendTo(this.$smallMenu).click($.proxy(this.click, this));
		
		this.$currentText = $('<input type="text" value="'+active+'" class="currentText"/>').appendTo(this.$smallMenu).blur($.proxy(this.changeAccordingToText, this));
		
		this.$currentOpenState =  $('<a href="#" class="currentOpenState" onClick="return false;"></a>').appendTo(this.$smallMenu).click($.proxy(this.click, this));
		
		//Circle picker
		preventDragDefault(this.$circle_picker);
		this.$circle_picker.bind(mouseDownBind, $.proxy(this.dragDownCircle, this));
		
		//Triangle picker
		preventDragDefault(this.$triangle_picker);
		this.$triangle_picker.bind(mouseDownBind, $.proxy(this.dragDownTriangle, this));
		
		if(this.id != undefined){
			//console.log(active+"/"+$("#"+this.id).val());
			//this.$currentText.val($("#"+this.id).val());
			$("#"+this.id).bind("update", $.proxy(this.onInputUpdate, this));
		}
		this.initial = true;
		
		this.update(false);
		this.changeAccordingToText();
		
	}
	
	ColorPicker.prototype = {
		circlePickerClicked: function(e){
			var offset = this.$color_circle.offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			
			var center_x = 53;
			var center_y = 53;
			var radius = 53;
			var radius1 = 40;
			
			//Check if it's between 
			var insideAro = (Math.pow((x-center_x), 2) + Math.pow((y - center_y), 2) < Math.pow(radius,2)) && 
							(Math.pow((x-center_x), 2) + Math.pow((y - center_y), 2) > Math.pow(radius1,2));
			
			if(insideAro){
				// get angle
				var difX = x-center_x;
				var difY =y-center_y; 
			
				var angle = Math.atan(Math.abs(difX)/ Math.abs(difY))*(180/Math.PI); // degrees
			
				if(difX >= 0){
					//to the right
					if(difY < 0)
						//1st quadrant
						this.h = angle;
					else
						//4th quadrant
						this.h = 180 - angle;
				}
				else{
					//to the left
					if(difY < 0)
						//2nd quadrant
						this.h = 360-angle;
					else
						//3rd quadrant
						this.h = 180+angle;
				}
				
				this.updatePickers();
			}
		},
		onInputUpdate: function(){
			var value = $("#"+this.id).val();

			this.$currentText.val(value);
			this.changeAccordingToText();
		},
		
		update: function(animate){
			var height = 0;
	        var height1 = 0;
			var top = 0;
			var time = 0;
			var op = 1;
			
			if(this.opened){
				height = 147;
	            height1 = 123;
				top = 123;
				op = 1;
			}
				
			if(animate)
				time = 150;
			
			this.$largeMenu.stop().animate({"height":height+"px", "opacity":op}, time);
			this.$smallMenu.stop().animate({"top":top+"px"}, time);
			this.$obj.stop().animate({"height":height1+28+"px"}, time);
		},
		updatePickers: function(){
			
			//CIRCLE
			var angleRad = (this.h-90)*(Math.PI/180);
			
			var circleTop = Math.round(53 + Math.sin(angleRad) * 47);
			var circleLeft = Math.round(53 + Math.cos(angleRad) * 47);
			
			this.$circle_picker.css({"top":circleTop+"px", "left":circleLeft+"px"});
			
			
			//TRIANGLE
			var triangLeft = 60 * (1-this.v/100);
			var tg = 60/33.5;
			var lineHeight = ((60 - triangLeft) / tg) * 2;
			
			var triangleTop = 67/2 - lineHeight/2 + lineHeight * (1-this.s/100);
			
			this.$triangle_picker.css({"top":triangleTop+"px", "left":triangLeft+"px"});
			
			
			//GET COLOR
			var rgb = hsvToRgb(this.h, this.s, this.v);
			var color = rgbToHex(rgb[0], rgb[1], rgb[2]);
			
			this.active = color;
			this.$currentColor.css("background-color", this.active);
			this.$currentText.val(this.active);
			
			
			var trueRgb = hsvToRgb(this.h, 100, 100);
			var trueColor = rgbToHex(trueRgb[0], trueRgb[1], trueRgb[2]);
			this.$color_triangle.css({
				"border-left": "60px solid "+trueColor
			});
			
				
			if(this.id != undefined){
				$("#"+this.id).val(this.$currentText.val()).trigger("change");
			}
			this.initial = false;
		},
		changeAccordingToText:function(){
			var hex = this.$currentText.val();

			var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
			if(!isOk){
				hex = "#000000";
				this.$currentText.val("#000000");
			}

			var rgb = hex2rgb(hex);
			var hsv = rgbToHsv(rgb.red, rgb.green, rgb.blue);
			
			this.h = Math.round(hsv[0]*10)/10;
			this.s = Math.round(hsv[1]*10)/10;
			this.v = Math.round(hsv[2]*10)/10;
			
			this.updatePickers();
		},
		dragDownCircle:function(e){
			var offset = this.$color_circle.offset();
			this.centerX = offset.left + 53;
			this.centerY = offset.top + 53;
	
			$(document).bind(mouseMoveBind, $.proxy(this.dragMoveCircle, this));
			$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
		},
		dragMoveCircle: function(e){
			var newX = e.pageX;
			var newY = e.pageY;
			
			var difX = Math.abs(newX-this.centerX);
			var difY = Math.abs(newY-this.centerY); 
			
			var angle = Math.atan(difX/difY)*(180/Math.PI); // degrees
			
			if(newX >= this.centerX){
				//to the right
				if(newY < this.centerY)
					//1st quadrant
					this.h = angle;
				else
					//4th quadrant
					this.h = 180 - angle;
			}
			else{
				//to the left
				if(newY < this.centerY)
					//2nd quadrant
					this.h = 360-angle;
				else
					//3rd quadrant
					this.h = 180+angle;
			}
			
			
			
			this.updatePickers();
		},
		dragDownTriangle:function(e){
			this.offset = this.$triangle_overlap.offset();
	
			$(document).bind(mouseMoveBind, $.proxy(this.dragMoveTriangle, this));
			$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
		},
		dragMoveTriangle: function(e){
			var newX = e.pageX;
			var newY = e.pageY;
			
			var difLeft = newX-this.offset.left;
			if(difLeft < 0)
				 difLeft = 0;
			else if(difLeft > 60)
				 difLeft = 60;
			
			this.v = Math.round((1-difLeft/60) * 100);
			var tg = 60/33.5;
			var lineHeight = ((60 - difLeft) / tg) * 2;
			
			//range from 67/2 - lineHeight/2
			//		to 67/2 + lineHeight/2
			var difTop = newY-this.offset.top;
			if(difTop < 67/2 - lineHeight/2)
				 difTop = 67/2 - lineHeight/2;
			else if(difTop > 67/2 + lineHeight/2)
				 difTop = 67/2 + lineHeight/2;
				 
			if(lineHeight!=0)
				this.s = Math.round( (1-((difTop-(67-lineHeight)/2)/lineHeight)) * 100);
			else
				this.s = 0;
			
			this.updatePickers();
		},
		dragUp: function(){
			$(document).unbind(mouseMoveBind);
			$(document).unbind(mouseUpBind);
		},
		triangleClick: function(e){
			this.offset = this.$triangle_overlap.offset();
			
			var newX = e.pageX;
			var newY = e.pageY;
			
			var difLeft = newX-this.offset.left;
			if(difLeft < 0)
				 difLeft = 0;
			else if(difLeft > 60)
				 difLeft = 60;
				
			var tg = 60/33.5;
			var lineHeight = ((60 - difLeft) / tg) * 2; 
			
			var difTop = newY-this.offset.top;
			if(difTop > 67/2 - lineHeight/2 && difTop < 67/2 + lineHeight/2)
				 this.dragMoveTriangle(e);
			
			return false;
		},
		click: function(){
			if(this.opened)
				this.opened = false;
			else
				this.opened = true;
				
			this.update(true);
			return false;
		},
		val:function(color){
		    if(color == undefined)
	            return this.active;
		    this.$currentText.val(color);
	        this.changeAccordingToText();
	    },
		info:function(){
			return this.active.toString();
		}
	}
	return ColorPicker;
});