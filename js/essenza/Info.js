define(["jquery", "essenza/Cover"], function($) {

    var Info = function($obj, shown){
		this.$obj = $obj;
		this.shown = shown;
    	$(document).ready($.proxy(this.initiate, this));
    }
    
    Info.prototype = {
    	initiate: function(){
			//wait page ready
			this.$container = this.$obj.find(".container");
	    	
	    	//add close action
			$(".close_btn", this.$obj).click($.proxy(this.close, this));
		    this.$obj.find(".click_area").click($.proxy(this.close, this));
		    
		    if(!this.shown)
		    	this.$obj.fadeTo(0, 0).css("display", "none");
		    else
		    	this.open();
		    	
		    this.$obj.bind("open", $.proxy(this.open, this));
		    this.$obj.bind("close", $.proxy(this.close, this));
    	},

    	//toogle open/close
    	toogle: function(){
    		if(this.shown)
    			this.close();
			else
    			this.open();
    	},
    	
    	//Close Info
	    close : function(){
        	this.shown = false;

			this.$obj.stop().fadeTo(200, 0, function(){
				$(this).css("display", "none");
			});    
	        //Content cover in
	        contentCoverOut(true);
	        
	        $(window).unbind("resize", $.proxy(this.resize, this));

			$("#page-wraper").css({"height": "", "overflow": ""});
			$("#page-wraper-full").css({"height": "", "overflow": ""});
			
			return false;
	    },
	    
	    //open Info
	    open : function(){
	        //Content cover in
	        if(contentCoverIn(true)){
	        	this.shown = true;

	        	this.$obj.css("display", "");
	    		this.resize();
	        	this.$obj.stop().fadeTo(200, 1);
	        	
	    		$(window).resize($.proxy(this.resize, this));
	        }  
	    },
	    
	    resize : function(){
    		this.$obj.removeClass("mobile");
	    	var height = this.$container.height();
	    	var totalHeight = $(".easyBackground").height();
	    	var top = totalHeight/2-height/2-30;
	    	if(WP_DEBUG)console.log(height);
	    	if(WP_DEBUG)console.log(totalHeight);
	    	if(WP_DEBUG)console.log($(".easyBackground").length);

	    	if(top < 0){
	    		this.$obj.addClass("mobile");
	    		this.$container.css({
		    		"top": ""
		    	});

    			$("#page-wraper").css({"height": height+"px", "overflow": "hidden"});
    			$("#page-wraper-full").css({"height": height+"px", "overflow": "hidden"});
	    	}
	    	else{
	    		this.$container.css({
		    		"top": top+"px"
		    	});

    			$("#page-wraper").css({"height": "", "overflow": ""});
    			$("#page-wraper-full").css({"height": "", "overflow": ""});
	    	}

	    }
    }
    
    return Info;
});