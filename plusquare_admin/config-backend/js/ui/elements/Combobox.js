var $ = jQuery;

var Combobox = function ($this, active, options, values, width){
	if(typeof active == "string"){
		for(var i = 0; i < values.length; i++)
			if(values[i] == active){
				active = i;
				break;
			}
		if(isNaN(active))
			active = 0;
	}
	if(typeof active == "string")
		active = 0;

	this.active = parseInt(active, 10);
	this.opened = false;	
	this.values = values;
	this.options = new Array();
	this.$combobox = $this;
	
	//Set min width by parameter
	if(width != undefined)
		$this.css({
			"width": width,
			"min-width": width
		});
		
	
	//Parse options
	if(options == undefined){
		$(".combobox-option", $this).each($.proxy(function(id, val){
			this.options.push($(val));
			$(val).attr("rel", id);
		}, this));
		this.hasOptions = true;
	}
	else{
		for(var i = 0;  i<options.length ; i++){
			var $val = $('<div class="combobox-option">'+options[i]+'</div>').appendTo($this);
			$val.attr("rel", i);
			this.options.push($val);
			this.hasOptions = true;
		}
	}
	
	
	$this.addClass("ui-combobox");
	this.$options = $(".combobox-option", $this).remove();
	
	//holder
	this.$holder = $("<div class='combobox-holder'></div>").appendTo($this);
	
	//selected text
	this.$selectedText = $("<div class='selected-text'></div>").appendTo(this.$holder);
	
	this.$optionsHolder = $("<div class='combobox-options-holder'></div>").appendTo(this.$holder);
	
	this.$options.appendTo(this.$optionsHolder);

	//First bind events
	this.rebind();
	
	//IF HAS OPTIONS
	if(this.hasOptions){
		this.update(false);
	}
	else{
		$this.stop().fadeTo(200, 0.7);
		this.$selectedText.text("no options");
	}
	
	//Bind options change
	$this.bind("changeOptions", $.proxy(this.changeOptions, this));
}

Combobox.prototype = {
	rebind: function(){
		this.$holder.click($.proxy(this.click, this)).hover($.proxy(this.interruptClose, this), $.proxy(this.closeDelay, this));

		var _this = this;
		var $this = this.$combobox;
		for(var i=0 ; i < this.options.length ; i++)
			this.options[i].click(function(){
				_this.active = parseInt($(this).attr("rel"));
				_this.update(true);
	        
	            	$(_this).trigger('change');
	            	$this.trigger('change');
			});
	},
	changeOptions: function(e, options, values, value){
		this.options = new Array();
		this.values = values;
		
		for(var i = 0;  i<options.length ; i++){
			var $val = $('<div class="combobox-option">'+options[i]+'</div>').appendTo(this.$combobox);
			$val.attr("rel", i);
			this.options.push($val);
		}
		this.$options.remove();
		this.$options = $(".combobox-option", this.$combobox).remove();
		this.$options.appendTo(this.$optionsHolder);
		
		var _this = this;
		for(var i=0 ; i < this.options.length ; i++)
		this.options[i].click(function(){
			_this.active = parseInt($(this).attr("rel"));
			_this.update(true);
        
        	$(_this).trigger('change');
        	_this.$combobox.trigger('change');
		});
	
		if(value != undefined)
			this.val(value);
		else
			this.update(false);
	},
	update: function(animate){
		var time = 0;
		
		if(animate)
			time = 150;
		
		this.$selectedText.fadeTo(time, 0, $.proxy(function(){
			if(this.active < 0 || this.active >= this.options.length)
				this.active = 0;
			
			this.$selectedText.html(this.options[this.active].html()).fadeTo(time, 1);
		}, this));
		
		$(this).trigger('change');
	},
	open: function(){
		this.$holder.css({
			"height":28+parseInt(this.$optionsHolder.height(), 10)+"px"
		}).addClass("opened");
		
		this.opened = true;
	},
	close: function(){
		this.$holder.css({
			"height":28+"px"
		}).removeClass("opened");
		
		this.opened = false;
	},
	closeDelay:function(){
		this.timer = setTimeout($.proxy(this.close, this), 300);
	},
	interruptClose:function(){
		clearTimeout(this.timer);
	},
	click: function(){
		if(this.opened)
			this.close();
		else
			this.open();
			
		return false;
	},
	val:function(value){
		//GET VALUE
		if(value == undefined)
			return this.values[this.active];
			
		//SET VALUE
		for(var i= 0; i<this.values.length; i++)
			if(this.values[i] == value){
				this.active = i;
				this.update();
				break;
			}
     },
	info:function(){
		return this.options[this.active];
	}
}

module.exports = Combobox;