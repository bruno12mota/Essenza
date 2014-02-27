define(["jquery", "ui-elements"], function($) {

	var Lightbox = function(title, builderPath, saveFunction, width, exit_text, submit_text, loadingLightbox){
		if(exit_text == undefined)
			exit_text = "Exit without saving";
		if(submit_text == undefined)
			submit_text = 'Submit <img class="arrow-icon" src="'+builderPath+'images/ui/arrow.png"/>'
		if(width == undefined)
			width = 900;
		if(loadingLightbox == undefined)
			loadingLightbox = false;

		this.title = title;
		this.builderPath = builderPath;
		this.saveFunction = saveFunction;
		this.exit_text = exit_text;
		this.submit_text = submit_text;
		this.width = width;
		this.loadingLightbox = loadingLightbox;

		//build
		this.build();
	}

	Lightbox.prototype = {
		build: function(){
			var $body = $('body');
        	var width = this.width;
        	var padding = "20px 25px";

        	this.lightboxInUse = $body.hasClass("adminLightboxOpened");
        	$body.addClass("adminLightboxOpened");

        	this.$cover = $('<div></div>').css({
	            "width":"100%",
	            "height":"100%",
	            "background-color":"#000",
	            "position":"fixed",
	            "top":"0px",
	            "left":"0px",
	            "bottom":"0px",
	            "right":"0px",
	            "z-index": this.lightboxInUse ? "101" : "99"
	        }).fadeTo(0, 0).fadeTo(200, 0.7).appendTo($body);

	        var fromTop = $(window).scrollTop();
        
	        this.$editPage = $('<div></div>').css({
	            "position":"absolute",
	            "width":width+"px",
	            "background-color":"#fff",
	            "top":40+fromTop+"px",
	            "left":(-width/2)+"px",
	            "margin-left":"50%",
	            "margin-bottom":"50px",
	            "z-index": this.lightboxInUse?"102":"100",
	            "overflow":"hidden"
	        }).fadeTo(0, 0).fadeTo(200, 1).appendTo($body);
	        this.$editPage.addRoundCorners("3px");
	        this.$editPage.processFont("AllerRegular", "#26202A", 15);

	        this.$menu = $('<div>'+this.title+'</div>').css({
	            "position":"relative",
	            "display":"block",
	            "background-color":"#EEEEEE",
	            "padding":padding,
	            "border-bottom":"solid 1px #CCCCCC"
	        }).appendTo(this.$editPage);
	        
	        if(!this.loadingLightbox){
		        this.$exitButton = $('<a href="#"></a>').css({
		            "width":"9px",
		            "height":"9px",
		            "background-image":"url("+this.builderPath+"images/ui/lightbox_close.png)",
		            "position":"relative",
		            "float":"right",
		            "left": "-10px",
		            "top":"6px"
		        }).appendTo(this.$menu).click($.proxy(this.closeEdit, this));
	        }
	        
	        this.$content = $('<div></div>').css({
	            "position":"relative",
	            "padding":padding,
	            "display":"block"
	        }).appendTo(this.$editPage);
	        
	        //Loading
	        if(!this.loadingLightbox){
		        this.$loadingOptions = $('<div>Loading Options</div>').css({
		            "position":"relative",
		            "display":"block",
		            "padding-left": "30px",
		            "background-image":"url("+this.builderPath+"images/ui/loading.gif)",
		            "background-repeat":"no-repeat",
		           	"background-position":"0 50%"
		        }).appendTo(this.$content);

		        this.$submitMenu = $('<div></div>').css({
		            "position":"relative",
		            "padding":padding,
		            "border-top":"solid 1px #EEEEEE",
		            "overflow":"hidden"
		        }).appendTo(this.$editPage);
		        
		        this.$submitButton = $('<a class="ui-button disabled" href="#">'+this.submit_text+'</a>').css({
		            "position":"relative",
		            "float":"right"
		        }).appendTo(this.$submitMenu).click($.proxy(this.saveEdit, this));
		        
		        this.$exitButton = $('<a class="ui-button disabled" href="#">'+this.exit_text+'</a>').css({
		            "position":"relative",
		            "float":"right",
		            "left": "-10px"
		        }).appendTo(this.$submitMenu).click($.proxy(this.closeEdit, this));
	        }
	        else{
		        this.$loadingOptions = $('<div>Saving</div>').css({
		            "position":"relative",
		            "display":"block",
		            "padding-left": "30px",
		            "background-image":"url("+this.builderPath+"images/ui/loading.gif)",
		            "background-repeat":"no-repeat",
		           	"background-position":"0 50%"
		        }).appendTo(this.$content);
	        }
		},

		addContent: function(content){
			this.$content.append(content);
			this.$loadingOptions.remove();

			this.$submitButton.removeClass("disabled");
			this.$exitButton.removeClass("disabled");
		},

		switchLoading: function(loading_text){
			this.$submitButton.addClass("disabled");
			this.$exitButton.addClass("disabled");

			this.$content.html(this.$loadingOptions);
			this.$loadingOptions.css("display", "block");
			this.$loadingOptions.text(loading_text);
		},

		closeEdit: function(){
	        var time = 200;
			var $body = $('body');
	        
	        this.$editPage.fadeTo(time , 0);
	        this.$cover.fadeTo(time , 0, $.proxy(function(){
	            this.$editPage.remove();
	            this.$cover.remove();
	        }, this));
	        if(!this.lightboxInUse)
	        	$body.removeClass("adminLightboxOpened");

			$(this).trigger("close_lightbox");

			return false;
		},

		saveEdit: function(){
			this.saveFunction.call();

			return false;
		}
	};

	return Lightbox;
});