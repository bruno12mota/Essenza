define(["jquery"], function($){
	var RadioOption = function($this, id, pathToElem, _Radio){
		this.id = id;
		this._Radio = _Radio;
		
		$this.css({
				"width":"18px",
				"height":"18px",
				"position":"relative",
				"background-image":"url("+pathToElem+"radiobutton_background.png)",
				"background-repeat":"no-repeat",
				"cursor":"pointer"
		}).click($.proxy(this.click, this));
		
		this.$active = $("<div></div").css({
			"top":"4px",
			"left":"4px",
			"margin":"0",
			"padding":"0",
			"width":"10px",
			"height":"10px",
			"position":"absolute",
			"background-image":"url("+pathToElem+"radiobutton_fill.png)",
			"background-repeat":"no-repeat"
		}).appendTo($this);
	}
	
	RadioOption.prototype = {
		activate: function(animate){
			var time = 0;
				
			if(animate)
				time = 200;
			
			this.$active.stop().fadeTo(time, 1);
		},
		deactivate: function(animate){
			var time = 0;
				
			if(animate)
				time = 200;
			
			this.$active.stop().fadeTo(time, 0);
		},
		click:function(){
			this._Radio.change(this.id);
		}
	}
	
	var Radio = function ($this, active, pathToElem){
		this.active = parseInt(active, 10);
		this.options = new Array();
		this.$this = $this;
		var _Radio = this;
		var id = 0;
		
		$(".radio-option", $this).each(function(){
			_Radio.options.push(new RadioOption($(this), id++, pathToElem, _Radio));
		});
	
		this.update(false);
	}
	
	Radio.prototype = {
		update: function(animate){
			this.options[this.active].activate(animate);
			for(var i = 0 ; i < this.options.length ; i++)
				if(i != this.active)
					this.options[i].deactivate(animate);
		},
		change: function(id){
			this.active = id;
	        
	        this.$this.trigger("change", this.active);
			this.update(true);
		},
		val:function(to){
		    if(to == undefined)
			  return this.active;
			
			this.active = to;
			this.update();
		},
		info:function(){
			return this.active;
		}
	}

	return Radio;
});