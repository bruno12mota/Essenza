define(["jquery"], function($){
	var OrderableList = function(id){
		//Holders
		this.$orderable_list = $("#"+id);

		this.itemId = -1;

		this.reset();

		this.$orderable_list.bind("addItem", $.proxy(this.addItem, this));
		this.$orderable_list.bind("removeItem", $.proxy(this.removeItem, this));
		this.$orderable_list.bind("changeImage", $.proxy(this.changeImage, this));
		this.$orderable_list.bind("changeTitle", $.proxy(this.changeTitle, this));
		this.$orderable_list.bind("reset", $.proxy(this.reset, this));
	}
	
	OrderableList.prototype = {
		//Change list item image
		changeImage: function(e, id, url){
			if(this.items.length > id)
			this.items[id].find(".image").css("background-image", "url("+url+")");
		},

		//Change list item title
		changeTitle: function(e, id, title){
			if(this.items.length > id)
			this.items[id].find(".title").text(title);
		},

		eventButtonClick: function(e){
			var target = $(e.target);
			var $item = this.getItem(target);
			var id = parseInt(this.$item.attr("rel"), 10);

			var eve = target.data("event");

			this.$orderable_list.triggerHandler(eve, [id]);
		},

		addItem: function(e, $dynamic, pos){
			var position = this.numItems;
			var $item = $('<div class="item"></div>')
				.append($('<div class="dynamic_part"></div>').append($dynamic))
				.append($('<div class="fix_part"><a class="depth_up" href="#" onclick="return false;"></a><a class="remove_element" href="#" onclick="return false;"></a><a class="depth_down" href="#" onclick="return false;"></a></div>'))
				.attr("rel", position).css("top", (51*position)+"px");

			//Append
			this.$orderable_list.append($item);

			$item.find(".dynamic_part a").each($.proxy(function(ind, obj){
				var $obj = $(obj);
				var eve = $obj.data("event");

				if(eve != undefined){
					$obj.click($.proxy(this.eventButtonClick, this));
				}
			}, this));

			//Binds
			$item.bind(mouseDownBind, $.proxy(this.dragDown, this)).addClass("grabhand");
			$item.find(".depth_up").click($.proxy(this.depthUpClick, this));
			$item.find(".depth_down").click($.proxy(this.depthDownClick, this));
			$item.find(".remove_element").click($.proxy(this.removeClick, this));

			if(pos != undefined)
 				this.items.splice(pos, 0, $item);
 			else
				this.items.push($item);

			this.numItems = this.items.length;
	    	this.$orderable_list.css("height", (this.numItems*51)+"px");

	    	this.organize();
		},

		//Remove an item
		removeItem: function(e, id){
			var newItems = new Array();

			for(var i = 0; i < this.numItems; i++){
				if(i == id)
					this.items[i].remove();
				else
					newItems.push(this.items[i]);
			}
			this.items = newItems;
			this.numItems = this.items.length;

	    	this.organize();
		},

		//Remove button click
		removeClick: function(e){
			var target = $(e.target);
			var $item = this.getItem(target);
			var id = parseInt(this.$item.attr("rel"), 10);

			this.removeItem(null, id);

			this.$orderable_list.trigger("itemRemoved", [id]);
		},

		reset: function(){
			this.items = new Array();
			this.numItems = 0;
			this.$orderable_list.find(".item").remove();
		},

		//On item drag down
		dragDown: function(e){
			var target = $(e.target);
			this.$item = this.getItem(target);
			this.itemId = parseInt(this.$item.attr("rel"), 10);

			this.position = this.itemId;
			this.mouseY = e.pageY;
			this.currentY = 51*this.position;

	        this.$item.addClass("down");

	        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
	        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));

	        return false;
		},

		organize: function(){
			for(var i = 0; i < this.numItems; i++){
				var item = this.items[i];
				item.attr("rel", i);

				if(i%2 == 0.0)
					item.removeClass("pair");
				else
					item.addClass("pair");

				if(i != this.itemId){
					var top = i*51;
					var currentTop = parseInt(item.css("top"), 10);

					if(top != currentTop)
						item.stop().animate({"top": top+"px"}, 300);
				}

				//Depth up button
				if(i == 0)
					item.find(".depth_up").addClass("disabled");
				else
					item.find(".depth_up").removeClass("disabled");


				//Depth down button
				if(i == this.numItems-1)
					item.find(".depth_down").addClass("disabled");
				else
					item.find(".depth_down").removeClass("disabled");
			}
		},

		dragMove: function(e){
			var dif = e.pageY - this.mouseY ;
			this.mouseY = e.pageY;
			this.currentY += dif;

			var y = this.currentY;
			if(y < 0)
				y = 0;
			if(y > 51*(this.numItems-1))
				y = 51*(this.numItems-1);

			this.$item.css("top", y+"px");

			//Position
			var position = 0;
			for(var i = 0; i < this.numItems; i++){
				if(y > 25+50*i)
					position = i+1;
			}

			this.changeItemPosition(this.itemId, position);

	        return false;
		},

		dragUp: function(e){
			unbindMoveAndUp();
	        this.$item.removeClass("down");

			this.itemId = -1;

			this.organize();
			
	        return false;
		},

		changeItemPosition: function(from, to){
			var item = this.items[from];

			if(from != to && to >= 0 && to < this.numItems){
				var newItems = new Array();
				//Reorganize
				for(var i = 0; i < this.numItems; i++){
					//Get in position i
					if(i == from)
						newItems.push(this.items[to]);
					else if(i == to)
						newItems.push(this.items[from]);
					else
						newItems.push(this.items[i]);

				}
				if(this.itemId != -1){
					this.position = to;
					this.itemId = to;
				}
				this.items = newItems;

				this.organize();

				this.$orderable_list.trigger("itemChanged", [from, to]);
			}
		},

		getItem: function(target){
			var $item;
			if(target.hasClass("item"))
				$item = target;
			else
				$item = target.closest(".item");

			return $item;
		},

		//When a depth up button is clicked event
		depthUpClick: function(e){
			var $item = this.getItem($(e.target));
			var itemId = parseInt($item.attr("rel"), 10);

			this.changeItemPosition(itemId, itemId-1 );
		},

		//When a depth down button is clicked event
		depthDownClick: function(e){
			var $item = this.getItem($(e.target));
			var itemId = parseInt($item.attr("rel"), 10);

			this.changeItemPosition(itemId, itemId+1 );
		}
	}
	
	return OrderableList;
});