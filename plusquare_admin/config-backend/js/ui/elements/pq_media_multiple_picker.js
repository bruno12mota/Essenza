define(["jquery", "ui/elements/Combobox", "utils/utils"], function($, Combobox){
	var Media_Grid = function(id, sizing){
		jQuery(document).ready($.proxy(function($){
			this.id = id;
			this.sizing = sizing;
			this.$input = $('#'+this.id);
			
			if(this.sizing)
				this.$input_sizing = $('#'+this.id+"_sizing");
				
			this.$button = $('#'+this.id+'_button');
			this.$grid = $('#'+this.id+'_grid');
			this.$gridHolder = $('#'+this.id+'_grid_holder');
			this.items = new Array();
			
			//Prepare frame
			this.frame = wp.media({
				title : 'Pick the images for this work',
				multiple : true,
				library : { type : 'image'},
				button : { text : 'Insert' }
			});
			
			this.$button.click($.proxy(this.buttonClick, this));
			this.init();
			
			this.$input.bind("update", $.proxy(this.init, this));
			}, this)
		);
	}
	
	Media_Grid.prototype = {
		//Initial make
		init: function(){
			//Images val
			var val = this.$input.val();
			
			this.items = new Array();
			this.$grid.empty();
			
			if(val != "" && val!= null){
				var ids = val.split(',');
				ids.forEach($.proxy(function(id) {
					if(id != null && id != " " && id != "")
					this.addItem(id);
				}, this));
			}
			
			//Sizing val
			if(this.sizing){
				val = this.$input_sizing.val();
				
				if(val != "" && val!= null){
					var sizings = val.split(',');
					for(var i= 0; i < sizings.length ; i++)
						if(this.items[i].comboBox != undefined)
							this.items[i].comboBox.val(sizings[i]);
				}
			}

			this.resizeGrid();
		},
		
		//Button on click
		buttonClick: function(e) {
			
			//On frame close -> save selected images
			this.frame.on('close', $.proxy(this.frameClose, this));
			this.frame.on('open', $.proxy(this.frameOpen, this));
			this.frame.open();
			
			return false;
		},
		
		//Add video
		addVideo: function(type, id, image){
			this.addItem((type=="youtube"?"y":(type=="vimeo"?"v":"d"))+id+":"+image);
			this.updateInput();
			this.resizeGrid();
		},
		
		addItem: function(id){
			var item = new Item(id, this.items.length, this.sizing);
			this.items.push(item);
			this.$grid.append(item.$item);
			$(item).bind("itemRemoved", $.proxy(this.itemRemoved, this));
			$(item).bind("itemStartDrag", $.proxy(this.itemStartDrag, this));
			$(item).bind("itemMove", $.proxy(this.itemMove, this));
			
			if(this.sizing)
				item.comboDiv.bind("change", $.proxy(this.updateInput, this));
		},
		
		//Frame on open
		frameOpen: function(){
			var selection = this.frame.state().get('selection');
			//if(WP_DEBUG)console.log(frame);
			
			//Get ids array from
			var ids = this.$input.val().split(',');
			ids.forEach(function(id) {
				var attachment = wp.media.attachment(id);
				attachment.fetch();
				selection.add( attachment ? [ attachment ] : [] );
			});
		},
		
		//Frame on close
		frameClose: function(){
			//Clear input
			var media = new Array();
			
			// get selections and save to hidden input plus other AJAX stuff etc.
			var selection = this.frame.state().get('selection');
			selection.forEach($.proxy(function(obj){
				var id = obj["id"];
				
				if(id != null && id != " " && id != ""){
					if(!this.itemExists(id))
						this.addItem(id);
				
					media.push(id);
				}
				
				
			}, this));
			
			//media contatins all ids selected
			//check if an item no longer exists
			$.each(
				this.items,
				$.proxy(function(index, item){
					var exists = false;
					for(var i = 0; i< media.length; i++)
						if(media[i] == item.id){
							exists=true;
							break;
						}
						
					if(!exists)
						item.remove();
				}, this)
			);
			
			this.updateInput();
			this.resizeGrid();
		},
		
		//Update input
		updateInput: function(){
			//Clear input
			var media = new Array();
			
			if(this.sizing)
				var mediaSizing = new Array();
			
			$.each(
				this.items,
				$.proxy(function(index, item){
					media.push(item.id);
					
					if(this.sizing)
						mediaSizing.push(item.getSizing());
				}, this)
			);
			this.$input.val(media.toString()).trigger("change");
			
			if(this.sizing)
				this.$input_sizing.val(mediaSizing.toString());
		},
		
		//Resize grid
		resizeGrid: function(){
			this.$grid.css("width", this.items.length*165+"px");	
		},
		
		//Check if an item exists
		itemExists: function(id){
			var exists = false;
			$.each(
				this.items,
				function(index, item){
					if(item.id == id){
						exists = true;
						return true;
					}
				}
			);
			return exists;
		},
		
		itemStartDrag: function(){
			var offset = this.$grid.offset();
			this.gridLeft = offset.left;	
		},
		
		itemMove: function(e, posX, id){
			//Get relative position
			var relativeX = posX-this.gridLeft;
			
			//Get grid position
			var position ;
			if(relativeX < 77)
				position = 0;
			else
				position = Math.round(relativeX/165);
			
			if(position > this.items.length)
				position = this.items.length;
			
			//Check if it's a new position
			if(id != position && (id+1) != position)
				//change position
				this.changeItemPosition(id, position < id ? position : position-1);
			
		},
		
		//Change an item's position in grid
		changeItemPosition: function(id, to){
			var item = this.items[id];
			//Remove from current position
			item.$item.remove();
			
			//Add to the right place in grid
			if(to == 0) 
				this.$grid.prepend( item.$item );   
			else
				$(">div:nth-child(" + to + ")", this.$grid).after( item.$item );	
				
			 item.rebind();
			 
			//Change items order
			this.items = removePositionInArray(this.items, id);
			this.items.splice(to, 0, item);
			
			//update ids
			this.updateItemsIds();
			
			this.updateInput();
		},
		
		updateItemsIds: function(){
			$.each(
				this.items,
				function(index, item){
					item.gridId = index;
				}
			);
		},
		
		itemRemoved: function(e, attachmentId){
			var ids = this.$input.val().split(',');
			var newItems = new Array();
			
			for(var i= 0; i< this.items.length; i++)
				if(this.items[i].id != attachmentId)
					newItems.push(this.items[i]);
					
			this.items = newItems;
			this.updateItemsIds();
			this.updateInput();
		}
	}
	
	
	var Item = function(attachmentId, gridId, sizing){
		this.id = attachmentId;
		this.gridId = gridId;
		this.sizing = sizing;
		
		attachmentId = attachmentId.toString();
		this.isVideo = attachmentId.charAt(0) == 'y' || attachmentId.charAt(0) == 'v' || attachmentId.charAt(0) == 'd';
		
		//Make item		
		this.$item = $("<div class='item'></div>");
		var $item_inner = $("<div class='item-inner'></div>").appendTo(this.$item);
		var $img = $("<div class='img'></div>").appendTo($item_inner);
		var img = $("<img src='' />");
		this.$dragArea = $("<div class='dragArea'></div>").appendTo( $img );
		var $buttons = $("<div class='buttons'></div>").appendTo($img);
		var $editButton = $("<a href='' class='edit' target='_blank'></a>");
		this.$removeButton = $("<a href='#' class='remove'></a>").appendTo($buttons).click($.proxy(this.remove, this));
		
		
		if(this.isVideo){
        
            //is video
            $img.addClass(attachmentId.charAt(0)+"video");
		    
		    attachmentId = (attachmentId.split(":"))[1];
		}
		
		//Get attachment
		var attachment = wp.media.attachment(attachmentId);
		attachment.fetch();
		
		jQuery.post(
			adminAjax,
			{
				//action : 'get-attachment',
				//'id':attachmentId
				action 			: 'pq_get_attachment',
				'attachmentID'	: attachmentId,
				'width'			: 135,
				'height'		: 90,
				'crop'			: 'true'
			},
			function( response ) {
				if(response["success"] == true){
					img.attr("src", response["data"]["url"]).prependTo($img);
					$editButton.attr("href", response["data"]["editLink"]).prependTo($buttons);
					//if(WP_DEBUG)console.log(response);
				}
			}
		);
		
		
		if(sizing){
			this.comboDiv = $("<div></div>").appendTo($item_inner);
			this.comboBox = new Combobox(this.comboDiv, 0, ["Normal", "Fit", "Fullscreen"], ["normal", "fit", "full"], "100%");
		}	
		
		
		//Drag and drop
		this.$dragArea.bind(mouseDownBind, $.proxy(this.startDragging, this));
	};
	Item.prototype = {
		getSizing: function(){
			return this.comboBox.val();
		},
		rebind: function(){
			//Drag and drop
			this.$dragArea.unbind(mouseDownBind);
			this.$dragArea.bind(mouseDownBind, $.proxy(this.startDragging, this));
			
			this.$removeButton.unbind("click");
			this.$removeButton.click($.proxy(this.remove, this));

			if(this.sizing)
				this.comboBox.rebind();
		},
		remove: function(){
			//Remove from grid
			this.$item.remove();
			
			//Trigger item remotion
			$(this).trigger("itemRemoved", this.id);
			
			return false;
		},
		
		//Item start dragging
		startDragging: function(e){
			//Add active class
			this.$dragArea.addClass("active");
			
			//Make dragging object
			this.$draggingObj = this.$item.clone().appendTo($("body"));
			
			//Fade item
			this.$item.stop().fadeTo(200, 0.5);
			
			//Initial position
			var offset = this.$item.offset();
			
			this.x = e.pageX;
			this.y = e.pageY;
			
			this.posX = offset.left;
			this.posY = offset.top;
			
			this.$draggingObj.css({
				"position":"absolute"
			});
			
			this.updateDraggingObj();
			
			//Bind move and up
			$(document).bind(mouseMoveBind, $.proxy(this.move, this));
			$(document).bind(mouseUpBind, $.proxy(this.stopDragging, this));
			
			$(this).trigger("itemStartDrag");
			
        		return false;
		},
		
		//Update dragging object position
		updateDraggingObj: function(){
			this.$draggingObj.css({
				"top": this.posY,
				"left": this.posX
			});
		},
		
		//on mouse move when dragging
		move: function(e){
			var newX = e.pageX;
			var newY = e.pageY;
			
			this.posX = this.posX + (newX-this.x);
			this.posY = this.posY + (newY-this.y);
			
			this.x = newX;
			this.y = newY;
			
			this.updateDraggingObj();
			$(this).trigger("itemMove", [this.posX+70, this.gridId]);
			
        		return false;
		},
		
		//stop dragging
		stopDragging: function(){
			//Unbind move and up
			$(document).unbind(mouseMoveBind);
			$(document).unbind(mouseUpBind);
			
			//Remove active class
			this.$dragArea.removeClass("active");
			
			//Fade in item
			this.$item.stop().fadeTo(200, 1);
			
			//Fade out draggin obj
			var offset = this.$item.offset();
			this.$draggingObj.stop().animate({
				"opacity":0,
				"top":offset.top,
				"left":offset.left
			},300, function(){
				$(this).remove();	
			});
			
        		return false;
		}
	};
	
	return Media_Grid;
});