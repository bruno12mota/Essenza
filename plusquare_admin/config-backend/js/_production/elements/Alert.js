define(["jquery"], function(){
	var Alert = function ($this, pathToElem, text, hideable){
		this.pathToElem = pathToElem;
		this.$this = $this;
		
		if(hideable == undefined)
		   hideable = true;
		
		$this.css({
			"position":"relative",
			"display":"block",
			"overflow":"hidden",
			"background-color":"#FBFAA6",
			"margin-bottom":"20px"
		});
		
		//icon
		$("<div><img src='"+pathToElem+"information_icon.png' alt='info' style='top:1px;'/></div>").css({
			"padding":"0px 2px",
			"background-color":"#F7E088",
			"float":"left"
		}).appendTo($this);
	
		processFont($this, 'AllerRegular', "#011111", 12);
		
		$("<div>"+text+"</div>").css({
			"padding":"12px 15px",
			"float":"left"
		}).appendTo($this);
		
		if(hideable)
	    	$("<a href='#'></div>").css({
	    		"float":"right",
	    		"background-image":"url("+pathToElem+"lightbox_close.png)",
	    		"background-repeat":"no-repeat",
	    		"position":"relative",
	    		"top":"15px",
	    		"padding":"0px 10px",
	    		"width":"9px",
	    		"height":"9px"
	    	}).appendTo($this).click($.proxy(this.close, this));
	}
	
	Alert.prototype = {
		close: function(){
			var height = this.$this.height();
			this.$this.css("height", height+"px").animate({
				"height":"0px",
				"margin-bottom":"0px"
			}, 150, function(){
				$(this).css("display", "none");
			});
			
			return false;
		}
	}
	
	return Alert;
});