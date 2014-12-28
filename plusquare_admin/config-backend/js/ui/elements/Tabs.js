var $ = jQuery;

var Tabs = function ($this, active, options, values){
	//Get numeric value of current tab
	if(isNaN(active)){
		for(var i = 0; i < values.length; i++)
			if(values[i] == active){
				active = i;
				break;
			}
		if(isNaN(active))
			active = 0;
	}
	
	//initial values
	this.active = parseInt(active, 10);
	this.values = values;
	this.options = options;
	this.tabs = $(">.ui_tabs >.ui_tab" ,$this);
	this.tabsButtons = $(">.ui_tabs_menu >a", $this).each(function(index){
		$(this).attr("rel", index);
	}).click($.proxy(this.click, this));
	
	//initial update
	this.update();
}

Tabs.prototype = {
	
	//Update current
	update: function(){
		
		//Iterate tabs buttons
		this.tabsButtons.each($.proxy(function(index, button){
			
			if(this.active == index)
				$(button).addClass("active");
			else
				$(button).removeClass("active");
			
		}, this));
		
		//Iterate tabs
		this.tabs.each($.proxy(function(index, tab){
			
			if(this.active == index)
				$(tab).addClass("active");
			else
				$(tab).removeClass("active");
			
		}, this));
		
		//Trigger change event
		$(this).trigger('change');
	},

	//On tab button clicked
	click: function(e){
		//Get which tab button was clicked
		var rel = $(e.target).attr("rel");
		
		//Update active
		this.active = parseInt(rel, 10);
		
		//update
		this.update();
			
		return false;
	},
	
	//Get or set value
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
     }
}

module.exports = Tabs;
