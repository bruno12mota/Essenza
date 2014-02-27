define(["jquery"], function($){
	//IS IE
	//var isIE = jQuery.browser.msie;
	
	var Tooltip_ui = function (tip, $obj, $objArray, pathToElem){
		this.$obj = $obj;
		this.locked = false;
		
		this.$tooltip = $('<div>'+tip.toString()+'</div>').css({
			"-moz-font-feature-settings": "normal",
		    "-moz-font-language-override": "normal",
		    "height":"10px",
		    "display": "inline-block",
		    "pointer-events": "none",
		    "position": "absolute",
		    "text-align": "center",
		    "text-decoration": "none",
			"padding": "5px 10px",
			"background-image": "url("+pathToElem+"scrollbar_value.png)",
			"background-repeat": "x-repeat",
			"-webkit-transition" : "all 0.2s ease",
     		"-moz-transition" : "all 0.2s ease",
    		"-o-transition" : "all 0.2s ease",
    		"transition" : "all 0.2s ease",
    		"opacity" : "0"
	 	}).appendTo($("body"));  
		this.$tooltip.processFont('AllerRegular', "#FFFFFF", 9);
		this.$tooltip.addRoundCorners("5px");
		
		this.$triangle = $('<div></div>').css({
			"float":"left",
		    "position": "absolute",
		    "top":"100%",
		    "left":"50%",
		    "margin-left":"-5px",
			"width": "0px",
			"height": "0px",
			"border-left": "5px solid transparent",
			"border-right": "5px solid transparent",
			"border-top": "4px solid #5D5D5D"
		}).appendTo(this.$tooltip);
	    
	    this.update();
	    
	    $obj.bind(mouseOverBind, $.proxy(this.over, this));
	    $obj.bind(mouseOutBind, $.proxy(this.out, this));
	    
	    if($objArray != null)
	        $($objArray).each($.proxy(function(id, val){
	            $(val).bind(mouseOverBind, $.proxy(this.over, this));
	            $(val).bind(mouseOutBind, $.proxy(this.out, this));
	        }, this));
	}
	Tooltip_ui.prototype = {
		update : function(forceLeft, forceTop) {
			var linkPosition = this.$obj.offset();
			
		    if(forceLeft != undefined)
		    	linkPosition.left = forceLeft;
		    	
		    if(forceTop != undefined)
		    	linkPosition.top = forceTop;
		    
		    var top = linkPosition.top - this.$tooltip.outerHeight() - 4;
       		var left = linkPosition.left - (this.$tooltip.width()/2) + parseInt(this.$obj.width(), 10)/4 -3;
		    
		    this.$tooltip.css({
		        "top": top,
		        "left": left
		    });
		},
		changeText : function(text){
			this.$tooltip.text(text).append(this.$triangle);
		},
		over: function(){
	        if( !this.$obj.hasClass("disabled") ){
	            this.update();
	            this.$tooltip.stop().css("opacity", 1);  
	        }    
		},
		out: function(){
			if(!this.locked)
				this.$tooltip.stop().css("opacity", 0);  
		},
		remove: function(){
			this.$tooltip.remove();
		},
		lock: function(){
			this.locked = true;
			this.over();
		},
		unlock: function(){
			this.locked = false;
			this.out();
		}
	}

	return Tooltip_ui;
});