define(["jquery"], function(){
	var Single_Pick = function(id, width, height){
		this.width = width;
		this.height = height;
		
		if(this.width == undefined)
		this.width = 400;
		
		if(this.height == undefined)
		this.height = 250;
		
		jQuery(document).ready($.proxy(function($){
			this.id = id;
			this.$input = $('#'+this.id).bind("update", $.proxy(this.updateImage, this));
			this.$button = $('#'+this.id+'_button');
			this.$grid = $('#'+this.id+'_grid');
			this.img = $("img", this.$grid);
			
			//Prepare frame
			this.frame = wp.media({
				title : 'Pick an image',
				multiple : false,
				library : { type : 'image'},
				button : { text : 'Choose' }
			});
			
			this.$button.click($.proxy(this.buttonClick, this));
			this.updateImage();
		}, this)
		);
	}
	
	Single_Pick.prototype = {
		//Button on click
		buttonClick: function(e) {
			
			//On frame close -> save selected images
			this.frame.on('close', $.proxy(this.frameClose, this));
			this.frame.on('open', $.proxy(this.frameOpen, this));
			this.frame.open();
			
			return false;
		},
		
		//Frame on open
		frameOpen: function(){
			var selection = this.frame.state().get('selection');
			//console.log(frame);
			
			//Get ids array from
			var id = this.$input.val();
			var attachment = wp.media.attachment(id);
			attachment.fetch();
			selection.add( attachment ? [ attachment ] : [] );
		},
		
		//Frame on close
		frameClose: function(){
			var id = null;
			
			var selection = this.frame.state().get('selection');
			selection.forEach($.proxy(function(obj){
				id = obj["id"];
				this.$input.val(id);
			}, this));
			
			//Get attachment
			this.updateImage();
			
		},
		
		updateImage: function(e){
			var attachmentId = this.$input.val();
			
			if(attachmentId != "" && attachmentId!= null)
				jQuery.post(
					adminAjax,
					{
						action 			: 'pq_get_attachment',
						'attachmentID'	: attachmentId,
						'width'			: this.width,
						'height'		: this.height,
						'crop'			: 'true'
					},
					$.proxy(function( response ) {
						console.log(response);
						if(response["success"] == true){
							this.img.remove();
							this.img = $("<img />").appendTo(this.$grid.find(".item-inner .img"));
							
							this.img.attr("src", response["data"]["url"]);
							
							this.$grid.find(".item-inner .img")	.data("src", response["data"]["url"])
																.data("width", response["data"]["width"])
																.data("height", response["data"]["height"]);

															
							if(e==undefined)
								this.$input.trigger("change");
							
						}
					}, this)
				);
			else
				this.img.remove();
		}
	}
	
	return Single_Pick;
});