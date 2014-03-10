define(["jquery",
		"utils/utils"], function($) {
	
    var Masonry = function($holder, objects_query, maxWidth, minColumns, ajaxFunction, postID){
    	$(document).ready(	$.proxy(function ($){
    		//Save holder
    		this.$holder = $holder;
    		this.$loading_more = $(".loading_more");
    		this.objects_query = objects_query;
    		this.postID = postID
    		this.$fullDiv = $(".easyBackground");
    		this.itemsShown = 0;
    		
    		//Variables
    		this.maxWidth = maxWidth;
    		this.minColumns = minColumns;
    		this.loadingFurnace = false;
    		this.firstFurnace = true;
    		this.hasMore = true;
    		this.currentNumber = 0;
    		

    		//Posts
    		var holderWidth = this.$holder.width();
	    	var numberOfColumns = this.getNumberColumns(holderWidth);
	    	this.number = numberOfColumns*7;
    		this.offset = 0;
    		this.ajaxFunction = ajaxFunction;
    		
    		//Load first furnace
    		this.loadFurnace();

    		//Listen for window resize
            $(window).resize($.proxy(this.window_resize_timeout, this));
			
	    }, this));
    }
    
    Masonry.prototype = {

    	loadFurnace: function(){
    		if(this.loadingFurnace || !this.hasMore || this.$holder.length == 0)
    			return;

    		if(!this.firstFurnace)
    			this.$loading_more.show();

    		var objSend = "number="+this.number+"&offset="+this.offset+"&action="+this.ajaxFunction+"&postId="+this.postID+"&maxWidth="+this.maxWidth;

    		this.loadingFurnace = true;
    		this.offset += this.number;

    		if(WP_DEBUG)console.log("Trying to load "+this.number+" items");

    		//Load posts by ajax
    		var startTime = new Date().getTime();
			$.post( adminAjax, objSend, $.proxy(function(data, textStatus){
				var time = new Date().getTime();
				console.log("Time: "+(time-startTime));
				var $data = $(data);

				//Append new objects
				this.$holder.append($data);

				var number = this.$holder.find(this.objects_query).length - this.currentNumber;
				this.currentNumber += number; 
				if(number < this.number)
					this.hasMore = false;

				//Get all objects
	    		var objects = $(this.objects_query).css({
	    			"position": "absolute"
	    		});
	    		
	    		//Save objects
	    		this.items = new Array();
	    		objects.each($.proxy(function(index, item){
	    			var $item = $(item);
	    			
	    			//Add to items array
	    			this.items.push($item);
	    		}, this));

	    		this.ensureLoad();
	    		$(this).trigger("added");
			}, this));

    		
    	},

    	ensureLoad: function(){
    		var $loadableItems = this.$holder.find('img, .slider').not(".slider img");
    		// get number of loadable elements
			var num = $loadableItems.length;
			// counter to keep track of number of elements that are done loading
			var counter = 0;

			var load_timeout;

			// if there are one or more elements that need to load, bind events to them.
			if (num > 0) {
			    load_timeout = setTimeout($.proxy(this.allElementsAreLoaded, this), 2000);
			    $loadableItems.ensureLoad($.proxy(function(){
			    	clearTimeout(load_timeout);
		            counter++;
		            if(WP_DEBUG)console.log("loaded "+counter+"/"+num);

		            if (counter == num && this.loadingFurnace) 
		                  this.allElementsAreLoaded();
		            else
			    		load_timeout = setTimeout($.proxy(this.allElementsAreLoaded, this), 2000);
			      }, this));
			} 
			else 
				this.allElementsAreLoaded();
    	},

    	allElementsAreLoaded: function(){

    		this.loadingFurnace = false;

    		//Initial resize
    		this.resize();
    		this.$holder.find('.slider').trigger("resizeSlider");
    		this.resize();
            this.window_resize_timeout();

    		this.$loading_more.hide();
    		
    		//show up items
    		this.showItem();

    		if(this.firstFurnace){
    			this.firstFurnace = false;

    			//Set on scroll capture for loading more
				$(window).unbind("scroll", $.proxy(this.onGridScroll, this));
    			$(window).scroll($.proxy(this.onGridScroll, this));
    		}
    		
			$(this).trigger("furnaceLoaded");
    	},
    	

    	onGridScroll: function(){
    		if(!this.hasMore)
    			return;

			if($(window).scrollTop() > $(document).height() - $(window).height() - 500) {
           		// ajax call get data from server and append to the div
           		this.loadFurnace();
    		}
    	},

    	//Show item
    	showItem: function(){
    		//Clear timeout (precaution)
    		clearTimeout(this.showItemsTimeout);
    		
    		if(this.items[this.itemsShown] != undefined){
	    		//Show item
	    		this.items[this.itemsShown++].addClass("appear");
	    		
	    		//Show next
	    		if(this.itemsShown < this.items.length)
	    			this.showItemsTimeout = setTimeout($.proxy(this.showItem, this), 60);
    		}
    	},
    	
    	
    	//On Window Resize
	    windowResized: function(){
	    	if(this.items == undefined)
	    		return;
	    	
	    	//make timeout to resize
	    	if(this.items.length > 0)
	    	  this.resize();
	    	//this.resizeTimeout = setTimeout( $.proxy(this.resize, this), 200);
	    },

	    
    	window_resize_timeout: function(){
    		clearTimeout(this.resize_timeout);
            this.resize_timeout = setTimeout($.proxy(this.windowResized, this), 200);
    	},
	    
	    
	    getNumberColumns: function(totalWidth){
	    	var numColumns = 0;
	    	var w = this.maxWidth+1;
	    	while( w > this.maxWidth){
	    		numColumns++;
	    		w = totalWidth/numColumns;
	    	}
	    	if(numColumns < this.minColumns )
	    		numColumns = this.minColumns ;
	    	
	    	return numColumns;
	    },
	    
	    changedCategory: function(animateTranslation){
	    	this.resize(animateTranslation === false ? false : true);
	    },
	    
	    //On Actual Resize
	    resize: function(animateTranslation){
	    	if(this.loadingFurnace)
	    		return;
	    	
	    	var AvHeight = this.$fullDiv.height();
	    	var hasScrollbar = false;

	    	if(AvHeight < this.$holder.height())
	    		hasScrollbar = true;

	    	//Get number of columns
	    	var holderWidth = this.$holder.width();
	    	var numberOfColumns = this.getNumberColumns(holderWidth);
	    	var itemsWidth = Math.ceil(holderWidth/numberOfColumns);
	    	this.number = numberOfColumns*7;
	    	
	    	var columnsHeight = [], i = numberOfColumns;
			while (i--) {
				columnsHeight[i] = 0;
			}
	    	
	    	var counter = 0;
	    	$.each(
	    		this.items,
	    		$.proxy(function(index, item){
	    			if(item.is(":visible")){
	    				//Set width
		    			//item.css({
		    			//	"width": 100/numberOfColumns + "%"
		    			//});
	                    item.css({
	                        "width": itemsWidth + "px"
	                    });
		    			
		    			var itemHeight = Math.floor(item.height())-1;
		    			
		    			//get column
		    			var column = counter++;
		    			while(column >= numberOfColumns)
		    				column -= numberOfColumns;
		    			
		    			var top = columnsHeight[column];


		    			//check max
		    			var columnIt = 0;
		    			var max = 0;
		    			while(columnIt < numberOfColumns){
		    				if(columnsHeight[columnIt] > max)
		    					max = columnsHeight[columnIt];
		    				columnIt++;
		    			}


		    			
		    			//check other position
		    			var columnIt = 0;
		    			var min = itemHeight/2;
		    			while(columnIt < numberOfColumns){
		    				if(max - columnsHeight[columnIt] >  min){
		    					top = columnsHeight[columnIt];
		    					column = columnIt;
		    					min = max - columnsHeight[columnIt];
		    				}
		    				columnIt++;
		    			}

		    			//Change position
		    			//item.css({
		    			//	"left": (100/numberOfColumns) * column+ "%",
		    			//	"top": top + "px"
		    			//});
						if(animateTranslation)
							item.stop().animate({
		                        "left": itemsWidth * column+ "px",
		                        "top": top + "px"
		                    }, 500, "easeOutExpo");
						else
			    			item.css({
		                        "left": itemsWidth * column+ "px",
		                        "top": top + "px"
		                    });
		    			
		    			if(column == numberOfColumns-1)
		    				item.addClass("last");
		    			else
		    				item.removeClass("last");

		    			
		    			//Update current column
		    			columnsHeight[column] += itemHeight;
	    			}
	    			
	    			
	    		}, this)
	    	);
	    	
	    	//Get total height
	    	var totalHeight = 0;
	    	for(var i = 0; i<columnsHeight.length; i++)
	    		if(columnsHeight[i] > totalHeight)
	    			totalHeight = columnsHeight[i];
	    	
	    	/*var minHeight = $(".easyBackground").height();
	    	if(totalHeight < minHeight)
	    		totalHeight = minHeight;*/

	    	this.$holder.css("height", totalHeight+"px");

	    	if(AvHeight >= totalHeight && hasScrollbar){
	    		var scroll = $(window).scrollTop();
	    		this.$holder.css("height", AvHeight-1+"px");
	    		this.resize(animateTranslation);

	    		$(window).scrollTop(scroll);

	    		return;
	    	}
	    	else if(AvHeight < totalHeight && !hasScrollbar){
	    		this.resize(animateTranslation);
	    	}
	    		

	    	$(this).trigger("gridResize");
	    	this.$holder.find(".social_video").trigger("gridResize");
	    	this.$holder.find('.music_player').trigger("playerResize");
	    }
    }
    
    return Masonry;
});