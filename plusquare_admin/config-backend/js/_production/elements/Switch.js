define(["jquery"], function($){
	var Switch = function ($this, active, pathToElem){
		if(is_string(active))
			active = (active === 'true');
		this.active = active;
		
		$this.css({
			"display":"inline-block",
			"width":"52px",
			"height":"22px",
			"position":"relative",
			"background-image":"url("+pathToElem+"switchbox_off.png)",
			"background-repeat":"none",
			"cursor":"pointer"
		}).click($.proxy(this.click, this));
	
		this.$active = $("<div></div").css({
			"top":"0",
			"left":"0",
			"margin":"0",
			"padding":"0",
			"width":"52px",
			"height":"22px",
			"position":"absolute",
			"background-image":"url("+pathToElem+"switchbox_on.png)",
			"background-repeat":"none"
		}).appendTo($this);
		
		this.$slider = $("<div></div").css({
			"top":"0",
			"left":"-1px",
			"margin":"0",
			"padding":"0",
			"width":"24px",
			"height":"24px",
			"position":"absolute",
			"background-image":"url("+pathToElem+"switchbox_slider.png)",
			"background-repeat":"none"
		}).appendTo($this);
		
		this.update(false);
	}
	
	Switch.prototype = {
		update: function(animate){
			var opc = 0;
			var lft = -1;
			var time = 0;
			
			if(this.active){
				opc = 1;
				lft = 30;
			}
				
			if(animate)
				time = 150;
			
			this.$active.stop().fadeTo(time, opc);
			this.$slider.stop().animate({"left":lft+"px"}, time);
		},
		click: function(){
			if(this.active)
				this.active = false;
			else
				this.active = true;
				
	        $(this).trigger('change');
			this.update(true);
			return false;
		},
		val:function(to){
		    if(to == undefined)
	           return this.active;
	        this.active = to;
	        this.update();
	    },
		info:function(){
			return this.active.toString();
		}
	}

	return Switch;
});
