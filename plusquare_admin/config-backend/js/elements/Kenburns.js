define(["jquery",
		"elements/Scalable",
		"elements/Dragable"], function($, Scalable, Dragable){
	
	var Kenburns = function ($this, value, width, height){
		
		this.values = {	"top":0,
			            "left":0,
			            "bottom":0,
			            "right": 0,
			            "topRel":0,
			            "leftRel": 0,
			            "size": 1};
		$this.css({
			"width": width,
			"height": height
		});
		
		this.widthRatio = 2;
		this.width = width;
		this.height = height;
		this.$scaler = $this.find(".scaler");
		
		this.scalable = new Scalable($this.find(".scaler"), true, true, width, height, this.widthRatio);
		this.dragable = new Dragable($this.find(".scaler"), this.scalable.$dragArea, true);
		
		this.$scaler.bind("scale", $.proxy(this.changed, this));
		this.$scaler.bind("drag", $.proxy(this.changed, this));
	}
	
	Kenburns.prototype = {
		changed: function(e, values){
			this.values = values;
			
			var widthPerc = (this.width-(values.left+values.right))/this.width;
	        var heightPerc = (this.height-(values.top+values.bottom))/this.height;
	        var sizePerc = Math.max(widthPerc, heightPerc);
	        
	        var heightWindow = this.height - values.top - values.bottom;
	        var widthWindow = this.width - values.left - values.right;
	        
	        if(this.width/this.height > this.widthRatio)
	        	widthWindow = heightWindow * this.widthRatio;
	        else
	        	heightWindow = widthWindow / this.widthRatio;
	        
	        this.values["size"] = sizePerc;
	        this.values["topRel"] = ((this.height-heightWindow) != 0 ? values.top/(this.height-heightWindow) : 0);
	        this.values["leftRel"] = ((this.width-widthWindow) != 0 ? values.left/(this.width-widthWindow) : 0);
			
			$(this).trigger("change");
		},
		
		//Change ratio
		changeRatio: function(ratio){
			this.widthRatio = ratio;
			this.scalable.changeRatio(ratio);
		},
		
		//Change size
		changeSize: function(width, height, value){
			this.width = width;
			this.height = height;
			this.scalable.changeSize(width, height);
			this.val(value);
		},
		
		val: function(value){
			//Get val
			if(value == undefined)
				return this.values;
			
			//Set val
			var values = value.split("/");
			if(this.widthRatio != undefined){
				var topRel = parseFloat(values[0], 10);
				var leftRel = parseFloat(values[1], 10);
				var size = parseFloat(values[2], 10);
				
				var widthWindow, heightWindow;
				if(this.width/this.height > this.widthRatio){
					//Full area's width bigger than window max width
					heightWindow = size * this.height;
					widthWindow = heightWindow * this.widthRatio;
				}
				else{
					//Full area's height bigger than window max height
					widthWindow = size * this.width;
					heightWindow = widthWindow / this.widthRatio;
				}
				
		        var top = topRel*(this.height-heightWindow);
		        var left = leftRel*(this.width-widthWindow);
		        var bottom = this.height - top - heightWindow;
		        var right = this.width - left - widthWindow;
		        
		        this.values["top"] = top;
		        this.values["left"] = left;
		        this.values["bottom"] = bottom;
		        this.values["right"] = right;
		        this.values["size"] = size;
		        this.values["topRel"] = topRel;
		        this.values["leftRel"] = leftRel;
			}
			else{
				var top = parseFloat(values[0], 10);
				var right = parseFloat(values[1], 10);
				var bottom = parseFloat(values[2], 10);
				var left = parseFloat(values[3], 10);
				
				this.values["top"] = top;
		        this.values["left"] = left;
		        this.values["bottom"] = bottom;
		        this.values["right"] = right;
			}
	        
	        this.scalable.change(top, left, bottom, right);
		}
	}
	
	return Kenburns;
});