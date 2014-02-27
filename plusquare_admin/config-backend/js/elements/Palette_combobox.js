define(["jquery"], function(){
	var Palette_combobox = function (id, active, options){
		//Parameters
		this.active = active;
		this.options = options;

		//Check active
		var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.active);
		if(!isOk){
			this.active = "#000000";
		}

		//Variables
		this.opened = false;

		//Holders
		this.$holder = $("#"+id+"_palette_combobox"); 
		this.$input = $("#"+id); 
		this.$color = this.$holder.find(".color");
		this.$toogle_btn = this.$holder.find(">a");

		//Build
		this.build();

		//Update
		this.update();

		//Open event
		this.$toogle_btn.click($.proxy(this.toogle_dropdown, this));

		this.$input.on('input', $.proxy(this.on_input, this));
	}
	
	Palette_combobox.prototype = {

		on_input: function(){
			var hex = this.$input.val();
			var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
			if(isOk){
				this.active = hex;
				this.update();
			}
		},


		//Builds options
		build: function(){

			//Options holder
			this.$options_holder = $('<div class="palette_combobox_options"></div>');


			//each option
			$.each(
				this.options,
				$.proxy(function(index, option){

					//Build option
					var $option = $('<a class="option" href="#" onclick="return false;" data-color="'+option.color+'"><div class="color" style="background-color:'+option.color+';"></div><p>'+option.title+'</p></a>');

					//click action
					$option.click($.proxy(this.option_clicked, this));

					//Append
					this.$options_holder.append($option);

				}, this)
			);

			this.$options = this.$options_holder.find(".option");


			//Append options holder
			$("body").append(this.$options_holder);

			//Check width
			var width = this.$options_holder.width();
			this.options_holder_height = this.$options_holder.height();
			if(width > 150){
				this.$holder.css("width", width+"px");
			}

			//hide
			this.$options_holder.hide();
		},


		//Update current color
		update: function(){
			this.$color.css("background-color", this.active);

			//Check if exists in options
			$.each(
				this.$options,
				$.proxy(function(index, option){
					var $option = $(option);

					if($option.data("color") === this.active){
						$option.addClass("active");
					}
					else{
						$option.removeClass("active");
					}
				}, this)
			);

			this.$input.val(this.active);
		},


		//Palette option clicked
		option_clicked: function(e){
			var $button = $(e.target);
			if(!$button.hasClass("option")){
				$button = $button.parent();
			}

			this.active = $button.data("color");

			//Update
			this.update();
		},


		//Toogles combobox open state
		toogle_dropdown: function(){


			//Opened
			if(this.opened){
				this.close_dropdown();
			}


			//Closed
			else{

				//Show
				this.$options_holder.show();

				//position
				var offset = this.$holder.offset();
				var top = offset.top;
				var left = offset.left;
				this.$options_holder.css({
					"top": top-this.options_holder_height+"px",
					"left": left+"px"
				});

				//Add opened class
				this.$holder.addClass("opened");

				//Binds
				this.$holder.hover($.proxy(this.stop_close_timer, this), $.proxy(this.start_close_timer, this));
				this.$options_holder.hover($.proxy(this.stop_close_timer, this), $.proxy(this.start_close_timer, this));

				//Change icon
				this.$toogle_btn.find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");

				this.opened = true;
			}

		},

		//Closes options dropdown
		close_dropdown: function(){
			if(!this.opened)
				return;

			//Hide
			this.$options_holder.hide();

			//Remove opened class
			this.$holder.removeClass("opened");

			//Unbinds
			this.$holder.unbind("hover");
			this.$options_holder.unbind("hover");

			//Change icon
			this.$toogle_btn.find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");

			this.opened = false;
		},

		//Starts timer to close dropdown
		start_close_timer: function(){
			this.closeInterval = setTimeout($.proxy(this.close_dropdown, this), 200);
		},

		//Stops timer to close dropdown
		stop_close_timer: function(){
			clearTimeout(this.closeInterval);
		}
	}


	
	
	return Palette_combobox;
});