var $ = jQuery;

var $availablesPanel;
var $selectedPanel;
var $input;
	
var FontPicker = function (id, value){
	$input = $("#"+id);
	this.$picker = $("#"+id+"_picker");
	$availablesPanel = this.$picker.find(".panel:first-child");
	$selectedPanel = this.$picker.find(".panel:last-child");
	
	//Add actions to available fonts
	$availablesPanel.find(".font").each(function(index, font){
		new DragableFont($(font));
	});
	
	$selectedPanel.bind("change", $.proxy(this.changed, this));
	
	this.setValue(value);
}

FontPicker.prototype = {
	setValue: function(value){
		var items = value["items"];
		$.each(
			items,
			function(index, item){
				var fontFamily = item["family"];
				
				//Fetch font object
				var $fontObj = $availablesPanel.find(".font[rel="+fontFamily+"]");
				
				if($fontObj.length == 0){
					if(WP_DEBUG)console.log("Error loading google font!");
				}
				else{
					$fontObj = $fontObj.clone();
					$selectedPanel.find(".panel-inner").append($fontObj);
					
					var variants = item["variants"];
					$fontObj.find(".format").removeClass("selected");
					//Check variants
					$.each(
						variants,
						function(index, variant){
							$fontObj.find(".format[rel="+variant+"]").addClass("selected");
						}
					);
					
					new SelFont($fontObj);
					
					$availablesPanel.find(".font[rel="+fontFamily+"]").css("display", "none");
				}
				
			}
		)
	},
	changed: function(){
		//vars for returning in event
		var options = new Array();
		var values = new Array();
		
		//vars for Parsing for input
		var value = '{"items": [';
		var count = 0;
		
		//For each font object
		$selectedPanel.find(".font").each(function(){
			var $font = $(this);
			var fontFamily = $(this).attr("rel");
			var formats = new Array();
			
			var $formats = $font.find(".format");
			if($formats.length == 0){
				formats.push( $font.find(".font_formats").attr("rel") );
			}
			else{
				var $selecteds = $font.find(".format.selected");
				if($selecteds.length > 0){
					$selecteds.each(function(){
						formats.push( $(this).attr("rel") );
					});
				}
			}
			
			//Parse to json string
			if(formats.length > 0){
				if(count != 0)
					value += ",";
				value += '{ "family": "'+fontFamily+'","variants": [';
				for(var i = 0; i<formats.length; i++){
					value += '"'+formats[i]+'"';
					if(i != formats.length-1)
						value += ',';
						
					options.push(fontFamily+" ("+formats[i]+")");
					values.push(fontFamily+":"+formats[i]);
				}
				value += ']}';
				count++;
			}
		});
		value+=']}';
		$input.val(value);
		
		//trigger event
		this.$picker.trigger("changeFonts", [options, values]);
	}
}

var DragableFont = function($font){
	this.$font = $font;
	
	//Bind drag
	this.$font.bind(mouseDownBind, $.proxy(this.startDrag, this));
}
DragableFont.prototype = {
	//Update dragging object position
	updateDragPosition: function(){
		
		this.$dragObj.css({
			"top": this.posTop + "px",
			"left": this.posLeft + "px"
		})
	},
	
	//Start dragging object
	startDrag: function(e){
		this.$dragObj = this.$font.clone().appendTo("body").css({
			"position": "absolute",
			"width": this.$font.width()+"px"
		}).addClass("down");
		
		this.posLeft = this.$font.offset().left;
		this.posTop = this.$font.offset().top;
		
		this.currentLeft = e.pageX;
		this.currentTop = e.pageY;
		
		this.panelRangeMinLeft = $selectedPanel.offset().left;
		this.panelRangeMinTop = $selectedPanel.offset().top;
		this.panelRangeMaxLeft = this.panelRangeMinLeft + $selectedPanel.width();
		this.panelRangeMaxTop = this.panelRangeMinTop + $selectedPanel.height();
		
		this.updateDragPosition();
		
		$(document).bind(mouseMoveBind, $.proxy(this.drag, this));
		$(document).bind(mouseUpBind, $.proxy(this.stopDrag, this));
		
		return false;
	},
	
	//On Drag move
	drag: function(e){
		//update positions
		this.posLeft = this.posLeft + (e.pageX - this.currentLeft);
		this.posTop = this.posTop + (e.pageY - this.currentTop);
		
		this.currentLeft = e.pageX;
		this.currentTop = e.pageY;
		
		if(	this.currentLeft >= this.panelRangeMinLeft && this.currentLeft <= this.panelRangeMaxLeft &&
			this.currentTop >= this.panelRangeMinTop && this.currentTop <= this.panelRangeMaxTop)
			$selectedPanel.addClass("active");
		else
			$selectedPanel.removeClass("active");
		
		//Update dragging object position
		this.updateDragPosition();
		return false;
	},
	stopDrag: function(e){
		//Unbind mouse move and up
		unbindMoveAndUp();
		
		this.$dragObj.removeClass("down").stop().fadeTo(200, 0, $.proxy(this.fate, this));
		
		return false;
	},
	fate: function(){
		var rel = this.$dragObj.attr("rel");
		this.$dragObj.remove();
		
		if($selectedPanel.hasClass("active") && $selectedPanel.find(".font[rel="+rel+"]").length == 0){
			//Remove from available ones
			$availablesPanel.find(".font[rel="+rel+"]").slideUp(200);
			
			//Add to selected ones
			$selectedPanel.find(".panel-inner").append(this.$dragObj.css({
				"position": "relative",
				"width": "",
				"top": "0",
				"left": "0"
			}).fadeTo(200, 1));
			new SelFont(this.$dragObj);
		}
		$selectedPanel.removeClass("active");
	}
}

var SelFont = function($font){
	this.$font = $font.removeClass("grabhand").addClass("active");
	
	this.rel = $font.attr("rel");
	
	this.$formatsHolder = this.$font.find(".formats_holder");
	this.num_formats = this.$formatsHolder.find(".format").click($.proxy(this.clicked, this)).length;
	this.font_formats = this.$font.find(".font_formats");
	this.$closeButton = this.$font.find(".font_title a").click($.proxy(this.remove, this));
	this.$expandButton = this.$font.find(".expand").click($.proxy(this.expand, this));
	
	this.changeFormatsText();
	$selectedPanel.trigger("change");
}
SelFont.prototype = {
	changeFormatsText: function(){
		if(this.num_formats > 1){
			var selectedNum = this.$font.find(".formats_holder .format.selected").length;
			
			this.font_formats.text(selectedNum+"/"+this.num_formats+" formats");
		}
	},
	expand: function(){
		var btn = this.$expandButton;
		this.$formatsHolder.slideToggle(300, function(){
			if($(this).is(":visible"))
				btn.addClass("opened");
			else
				btn.removeClass("opened");
		});
		
		return false;
	},
	clicked: function(e){
		var format = $(e.target);
		
		if(format.hasClass("selected"))
			format.removeClass("selected");
		else
			format.addClass("selected");
	
		this.changeFormatsText();
		
		$selectedPanel.trigger("change");
			
		return false;
	},
	remove: function(){
		//Fade out selected
		this.$font.slideUp(200, function(){
			$(this).remove();
			$selectedPanel.trigger("change");
		});
		
		//Fade in in availables
		$availablesPanel.find(".font[rel="+this.rel+"]").slideDown(200);
		
		return false;
	}
}
	
module.exports = FontPicker;

