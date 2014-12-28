var $ = jQuery;

var Scroll = function ($this, active, min, max, snap, pathToElem){
	this.active = parseInt(active, 10);
	this.min = min;
	this.max = max;
	this.snap = snap;
	this.$this = $this;
	
	this.$this.css({
		"display": "block",
		"height":"11px",
		"position":"relative",
		"background-image":"url("+pathToElem+"scrollbar_background.png)",
		"background-repeat":"repeat-x",
		"cursor":"pointer",
		"-webkit-border-radius" : "5px",
     	"-moz-border-radius" : "5px",
		"-o-border-radius" : "5px",
		"border-radius" : "5px"
	}).click($.proxy(this.click, this));
	this.width = parseInt($this.width(), 10);

	this.$active = $("<div></div").css({
		"top":"0",
		"left":"0",
		"margin":"0",
		"padding":"0",
		"width":"52px",
		"height":"11px",
		"position":"absolute",
		"background-image":"url("+pathToElem+"scrollbar_background_selected.png)",
		"background-repeat":"repeat-x",
		"-webkit-border-radius" : "5px",
     	"-moz-border-radius" : "5px",
		"-o-border-radius" : "5px",
		"border-radius" : "5px",
		"-webkit-transition" : "all 0.2s ease",
     	"-moz-transition" : "all 0.2s ease",
    	"-o-transition" : "all 0.2s ease",
    	"transition" : "all 0.2s ease"
	}).appendTo($this);
	
	this.$slider = $("<div></div").css({
		"top":"-9px",
		"left":"52px",
		"margin":"0",
		"padding":"0",
		"width":"27px",
		"height":"28px",
		"position":"absolute",
		"background-image":"url("+pathToElem+"scrollbar_slider.png)",
		"background-repeat":"none",
		"-webkit-transition" : "all 0.2s ease",
     	"-moz-transition" : "all 0.2s ease",
    	"-o-transition" : "all 0.2s ease",
    	"transition" : "all 0.2s ease"
	}).appendTo($this);
	
	this.$slider.preventDragDefault();
	this.$slider.bind(mouseDownBind, $.proxy(this.dragDown, this));
	this.tooltip = new Tooltip_ui(this.active, this.$slider, [this.$this], pathToElem);
	
	this.update();
}

Scroll.prototype = {
	update: function(){
		this.width = parseInt(this.$this.width(), 10);
		
		if(this.active < 0)
			this.active = 0;
		else if(this.active > this.max)
			this.active = this.max;
		
		var lft = (this.active/this.max)*this.width;
		this.$slider.css({"left":lft-14+"px"});
		this.$active.css({"width":lft+"px"});
		
		this.tooltip.update(parseInt(this.$this.offset().left, 10)+lft-14);
		this.tooltip.changeText(this.active);
	},
	click: function(e){
		var pixOff = e.pageX - parseInt(this.$this.offset().left, 10);
		
		var snaps = Math.abs(Math.round(((pixOff/this.width)*this.max)/this.snap));
		this.active =  snaps * this.snap;
			
		this.update();
		return false;
	},
	dragDown:function(e){
		this.startX = e.pageX;
		this.old = this.active;
		
		this.tooltip.lock();
		
		$(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
		$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
	},
	dragMove: function(e){
		var newX = e.pageX;
		var dif = newX-this.startX;
		var snap = this.snap;
		
		if(dif < 0)
			snap = -this.snap;
			
		this.active = this.old;
		dif = Math.abs(Math.round(((dif/this.width)*this.max)/this.snap));
		
		while(dif--)
			this.active += snap;
		
		this.update();
	},
	dragUp: function(){
		$(document).unbind(mouseMoveBind);
		$(document).unbind(mouseUpBind);
		this.tooltip.unlock();
	},
	val:function(){
		return this.active;
	},
	info:function(){
		return this.active;
	}
}

module.exports = Scroll;
