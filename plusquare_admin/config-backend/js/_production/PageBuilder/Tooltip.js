

//TOOLTIP OBJECT
Tooltip = function(obj, text, builderPath) {
	this.tooltipFadeTime = 300;
	
	this.$tooltip = $("<div>"+text+"</div>").css({
		"-moz-font-feature-settings": "normal",
		"-moz-font-language-override": "normal",
		"display": "inline-block",
		"pointer-events": "none",
		"position": "absolute",
		"text-align": "center",
		"text-decoration": "none",
		"padding": "2px 5px",
		"padding-top":"3px",
		"z-index" : "2",
		"background-image":"url("+builderPath+"images/General/tile.png)",
		"border":"solid 1px #767676"
	}).appendTo($('body'));
	
	processFont(this.$tooltip, "AllerRegular", "#000000", 12);
	addRoundCorners(this.$tooltip, 3);
	
	this.$obj = obj; 
	
    this.$tooltip.stop().fadeTo(0, 0);  
    
    this.$obj.bind(mouseOverBind, $.proxy(this.over, this));
    this.$obj.bind(mouseOutBind, $.proxy(this.out, this));
};
Tooltip.prototype = {
    rebind:function(){
        this.$obj.unbind(mouseOverBind);
        this.$obj.unbind(mouseOutBind);
        this.$obj.bind(mouseOverBind, $.proxy(this.over, this));
        this.$obj.bind(mouseOutBind, $.proxy(this.out, this));
        
        this.out();
    },
	updateTooltipPosition : function(e) {
		var linkPositionX = e.pageX;
		var linkPositionY = e.pageY;
	    
	    var top = linkPositionY + parseInt(this.$tooltip.height(), 10) + 5;
	    var left = linkPositionX + 10;
	    
	    this.$tooltip.css({
	        "top": top,
	        "left": left
	    });
	},
	over: function(e){
        if( !this.$obj.hasClass("disabled") ){
            this.updateTooltipPosition(e);
            this.$tooltip.stop().fadeTo(this.tooltipFadeTime, 1);  
            
            //MOUSE MOVE BIND
			$(document).bind(mouseMoveBind, $.proxy(this.move, this));
        }    
	},
	out: function(){
		$(document).unbind(mouseMoveBind, $.proxy(this.move, this));
		
		this.$tooltip.stop().fadeTo(this.tooltipFadeTime, 0);  
	},
	move: function(e){
        this.updateTooltipPosition(e);
		
		return false;
	},
	remove: function(){
		this.$tooltip.remove();
	}
};