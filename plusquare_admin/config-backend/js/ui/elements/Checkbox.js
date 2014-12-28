var $ = jQuery;

var Checkbox = function ($this, active, values){
	this.values = values;
	this.active = active===values[1];
	this.$checkbox = $this;
	
	$this.click($.proxy(this.click, this));

	//Make active (checked image)
	this.$active = $("<div class='active'></div").appendTo($this);
	
	//First update
	this.update(false);
}

Checkbox.prototype = {
	update: function(animate){
		var opc = 0
		var time = 0;
		
		if(this.active)
			opc = 1;
			
		if(animate)
			time = 150;
		
		this.$active.fadeTo(time, opc);
	},

	click: function(){
		if(this.active)
			this.active = false;
		else
			this.active = true;
			
        $(this).trigger('change');
		this.update(true);
		
		return false;
	},
	val:function(to){
		//get
	    if(to == undefined)
           return (this.active ? this.values[1]: this.values[0]);
        
        //change
        this.active = (to===this.values[1]);
        
        //update
        this.update();
    },
	info:function(){
		return this.active.toString();
	}
}
	
module.exports = Checkbox;
