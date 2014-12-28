var $ = jQuery;

//Custom Listing for posts
var CustomGridListing = function(post_type, image_meta) {
	$(document).ready($.proxy(function() {
		this.post_type = post_type;
		this.image_meta = image_meta;
		this.items = new Array();
		
		//Construct
		var $root = $("#wpbody-content");
		this.$holder = $("<div id='customPortfolioHolder'></div>").appendTo($root); 
		
		//Add content
		this.loadWorks();
	}, this));
};
CustomGridListing.prototype = {
	//Load existing works
	loadWorks: function(){
		//Load works with jquery
		//this.$holder.load(this.list_works, $.proxy(this.worksLoaded, this));
		this.$holder.html('<p>Loading grid <img src="'+template_directory+'/plusquare_admin/config-backend/images/ui/loading.gif" /></p>');
		jQuery.post(
			adminAjax,
			{
				'action' : 'pq_custom_grid_listing',
				'type': this.post_type,
				'image_meta' : this.image_meta
			},
			$.proxy(function( response ) {
				this.$holder.html(response);
				this.worksLoaded();
			}, this)
		);
	},
	
	//When works have loaded
	worksLoaded: function(){
		//Add item
		$("#queryContainer .item").each($.proxy(function(index, obj){
			var item = new Item( $(obj), this.items.length );
			this.items.push( item );
			
			$(item).bind("itemStartDrag", $.proxy(this.itemStartDrag, this));
			$(item).bind("itemMove", $.proxy(this.itemMove, this));
			$(item).bind("itemStopDrag", $.proxy(this.itemStopDrag, this));
			
		}, this));
		
		//Toogle trash part
		$("#toogleTrash").click($.proxy(this.toogleTrash, this));
		this.$trashHolder = $("#queryTrashContainer").css("display", "none");
		$(".items-grid", this.$trashHolder).css("width", $("#queryTrashContainer .item").length*165+"px");
		$(".save_button").click($.proxy(this.save, this));
	},
	
	//Toogle trash holder visibility
	toogleTrash: function(){
		this.$trashHolder.not(':animated').slideToggle(200);
		
		return false;
	},
	
	//On item start to drag
	itemStartDrag: function(){
		//Get container
		this.$grid =  $("#queryContainer");
		
		//Get container offset
		var offset = this.$grid.offset();
		this.gridLeft = offset.left;	
		this.gridTop = offset.top;	
		
		//get items per row
		this.itemsPerRow = Math.floor(this.$grid.width() / 165);
		//if(WP_DEBUG)console.log(this.itemsPerRow+" items per row");
		
		//get item height
		this.itemsHeight = this.items[0].$item.outerHeight();
		//if(WP_DEBUG)console.log(this.itemsHeight+" items height");
		
		//get num lines
		this.numLines = Math.ceil(this.items.length / this.itemsPerRow);
	},
	
	//On item move
	itemMove: function(e, posX, posY, id){
		//Get relative position
		var relativeX = posX-this.gridLeft;
		var relativeY = posY-this.gridTop;
		
		//Get grid x position
		var positionX ;
		if(relativeX < 77)
			positionX = 0;
		else
			positionX = Math.round(relativeX/165);
		
		if(positionX > this.itemsPerRow)
			positionX = this.itemsPerRow;
		
		//Get grid y position
		var positionY ;
		positionY = Math.floor(relativeY/this.itemsHeight);
		if(positionY < 0)
			positionY = 0;
		else if(positionY >= this.numLines)
			positionY = this.numLines-1;
		
		//Get position in grid
		var position = positionY*this.itemsPerRow + positionX;
		if(position > this.items.length)
			position = this.items.length;
		
		//if(WP_DEBUG)console.log("Position: "+position);
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
	},
	
	//Update items ids
	updateItemsIds: function(){
		$.each(
			this.items,
			function(index, item){
				item.gridId = index;
			}
		);
	},
	
	//On item stop dragging action
	itemStopDrag: function(){
		$.each(
			this.items,
			function(index, item){
				//item.updateMeta();
			}
		);
	},
	
	save: function(){
		$(".loading_status").css("display", "inline-block");
		$(".save_button").css("display", "none");
		
		var str = '{';
		$.each(
			this.items,
			function(index, item){
				if(index != 0)
					str += ',';
				str += '"'+item.postId+'":"'+index+'"';
			}
		);
		str += '}';
		
		$.post(adminAjax, {
			action: 'ajax_update_posts_meta',
			key: "position",
			values: str
		}, function(data) {
			$(".loading_status").css("display", "none");
			$(".save_button").css("display", "");
		});
		
		return false;
	}
};

var Item = function($item, attachmentId){
	this.$item = $item;
	this.postId = $item.attr("rel");
	this.gridId = attachmentId;
	
	//Make item		
	this.$dragArea = $(".dragArea", $item);
	
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
	},
	
	//Update meta value for the post associated
	updateMeta: function(){
		$.post(adminAjax, {
			action: 'ajax_update_meta',
			post_id: this.postId,
			key: "position",
			value: this.gridId
		}, function(data) {
		});
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
		$(this).trigger("itemMove", [this.posX+70, this.posY+80, this.gridId]);
		
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
		
		$(this).trigger("itemStopDrag");
		return false;
	}
};


module.exports = CustomGridListing;
