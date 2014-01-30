define(["jquery"], function($){
	var ImageDragable = function($obj, ImagePicker, selected, pos){
		this.url = $("img", $obj).attr("src");
		this.id = $("img", $obj).attr("ref");
		this.$obj = $obj;
		this.ImagePicker = ImagePicker;
		this.selected = selected;
		
		if(selected){
			this.pos = pos;
			this.rightToLiner=false;
			this.updatePos(false);
				
			var $buttons = $("<div></div>").css({
				"height":"23",
				"position":"absolute",
				"background-color":"#FFFFFF",
				"top":"67px",
				"left":"39px",
				"overflow":"hidden"
			}).appendTo(this.$obj);
			
			var $remove = $("<a href='#'></a>").css({
				"width":"25",
				"height":"23",
				"position":"relative",
				"float":"right",
				"background-image":"url("+this.ImagePicker.builderPath+"images/Blocks/delete_icon.png)",
				"background-position":"center center",
				"background-repeat":"no-repeat"
			}).appendTo($buttons).click($.proxy(this.remove, this));
			
			$("<div></div>").css({
				"width":"1",
				"height":"15",
				"position":"relative",
				"float":"right",
				"background-color":"#E1E1E1",
				"top":"4px"
			}).appendTo($buttons);
			
			var $edit = $("<a href='media.php?attachment_id="+this.id+"&action=edit' target='_blank'></a>").css({
				"width":"25",
				"height":"23",
				"position":"relative",
				"float":"right",
				"background-image":"url("+this.ImagePicker.builderPath+"images/Blocks/edit_icon.png)",
				"background-position":"center center",
				"background-repeat":"no-repeat"
			}).appendTo($buttons);
		}
		
		$("img", $obj).grabHandOpen();
		preventDragDefault($("img", $obj));
		$("img", $obj).bind(mouseDownBind, $.proxy(this.dragDown, this));
	}
	ImageDragable.prototype = {
		updatePos: function(animate){
			var left = 10+100*this.pos;
			if(this.rightToLiner)
				left+=13;
			
			if(animate)
				this.$obj.animate({
					"left":left+"px"
				}, 200).fadeTo(150, 1);
			else
				this.$obj.css({
					"left":left+"px"
				});
		},
		changePos: function(pos, rightToLiner){
			if(pos != this.pos || this.rightToLiner != rightToLiner){
				this.pos = pos;
				this.rightToLiner = rightToLiner;
				
				this.updatePos(true);
			}
		},
		remove: function(){
			this.$obj.stop().fadeTo(150, 0, function(){
				$(this).remove();
			});
			this.ImagePicker.removeSelected(this.pos);
			return false;
		},
		dragDown: function(e){
			var newX = e.pageX;
			var newY = e.pageY;
			var offset = this.$obj.offset();
			
			this.currentX = newX;
			this.currentY = newY;
			
			this.objIniX = offset.left;
			this.objIniY = offset.top;
			
			this.$obj.fadeTo(150, 0.5);
			this.$clone = this.$obj.clone().appendTo($("body")).css({
				"position":"absolute",
				"top":offset.top+"px",
				"left":offset.left+"px",
				"z-index":"101"
			}).fadeTo(0, 0.4);
			
			this.$clone.grabHandClose();
			
			this.ImagePicker.draggingPos(newX, newY);
			
			$(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
			$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
			return false;
		},
		dragMove : function(e){
			var newX = e.pageX;
			var newY = e.pageY;
			
			var difX = newX - this.currentX;
			var difY = newY - this.currentY;
			
			this.$clone.css({
				"top": this.objIniY + difY +"px",
				"left": this.objIniX + difX +"px"
			});
			
			this.ImagePicker.draggingPos(newX, newY);
			return false;
		},
		dragUp : function(){
			unbindMoveAndUp();
			
			if(this.selected){
				//from selected images
				this.$obj.fadeTo(150, 0);
				this.ImagePicker.changeSelected(this.pos);
			}
			else{
				//from available images
				this.$obj.fadeTo(150, 1);
				this.ImagePicker.addSelected(this.url, this.id);
			}
			
			this.$clone.fadeTo(200, 0, function(){
				$(this).remove();
			})
			
			return false;
		}	
	}
	
	var ImagePicker = function ($this, active, builderPath){
		this.$this = $this;
		this.builderPath = builderPath;
		
		this.active = new Array();
		this.active = active.split(",");
		
		$this.load('../wp-content/themes/twentyeleven/page_builder/php/images_display.php', $.proxy(this.loaded, this));
	}
	
	ImagePicker.prototype = {
		loaded:function(){
			var $this = this.$this;
			
			var $main = $(".imagepicker_main", $this).css({
				"border":"solid 1px #e6e6e6",
				"display":"block",
				"position":"relative"
			});
			processFont($main, "AllerRegular", "#111111", 12)
			
			$(".imagepicker_text", $this).css({
				"padding":"10px 10px"
			});
			
			$(".imagepicker_text span", $this).css({
				"color":"#58AEB8"
			});
			
			$(".imagepicker_text span.imagepicker_greyish", $this).css({
				"color":"#999999"
			});
			
			this.$hidable = $(".imagepicker_available_hidable", $this).css({
				"overflow":"hidden",
				"height":"0px"
			});
			
			this.$availableText = $("div.imagepicker_available_text", $this);
			
			this.$currentSelectedSpan = $("div.imagepicker_text span.imagepicker_sel", $this);
			
			this.$selected_box = $(".imagepicker_selected_box", $this).css({
				"border":"solid 1px #cccccc",
				"background-color":"#e6e6e6",
				"height":"110px",
				"margin":"0px 4px 4px 4px",
				"overflow": "auto",
				"overflow-y": "hidden",
				"-ms-overflow-y": "hidden"
			});
			this.$selecteds = $(".imagepicker_selected", $this).css({
				"height":"90px",
				"margin":"10px 0px",
				"overflow": "hidden",
				"position":"relative"
			});
			
			this.$available_box = $(".imagepicker_available_box", $this).css({
				"border":"solid 1px #cccccc",
				"background-color":"#fff",
				"height":"110px",
				"margin":"0px 4px 4px 4px",
				"overflow": "auto",
				"overflow-y": "hidden",
				"-ms-overflow-y": "hidden"
			});
			
			this.$availables = $(".imagepicker_availables", $this).css({
				"height":"90px",
				"margin":"10px 0px",
				"overflow": "hidden"
			});
			
			
			$(".imagepicker_image img", $this).load(function(){
				$(this).resizeAndCenter(90, 90);
			});
			
			$(".imagepicker_image", $this).css({
				"width":"90px",
				"height":"90px",
				"overflow":"hidden",
				"float":"left",
				"margin-left":"10px"
			});
			
			var _this = this;
			_this.availables = new Array();
			$(".imagepicker_image", $this).each(function(){
				_this.availables.push(new ImageDragable($(this), _this, false));
			});
			
			this.selectedImages = new Array();
			this.$liner = $("<div id='imagepicker_line'></div>").css({
				"width":"3px",
				"height":"90px",
				"background-color":"#7CBAC9",
				"position":"absolute"
			}).appendTo(this.$selecteds).fadeTo(0, 0);
			this.linerOn = false;
			
			this.$submitButton = $('<a class="ui-button" href="#">Add more <img class="arrow-icon" src="'+this.builderPath+'UI_Elements/arrow.png"/></a>').css({
				"position":"relative",
				"float":"right",
				"margin-top":"10px"
			}).appendTo(this.$this).click($.proxy(this.toogleAddMore, this));
			
			this.opened = false;
			
			this.resize();
			$(window).resize($.proxy(this.resize, this));
			
			if(this.active.length != 0){
				var pos = 0;
				for(var i = 0; i<this.active.length ; i++){
					var url = this.active[i];
					//check if exists in availables
					var id = -1;
					for(var a= 0; a < this.availables.length ; a++)
						if(this.availables[a].url == url){
							id= this.availables[a].id;
							break;
						}
					
					if(id != -1){
						//exists
						var $newImage = this.getNewImage(url, id);
						$newImage.appendTo(this.$selecteds);
						
						this.selectedImages.push(new ImageDragable($newImage, this, true, pos++));
					}
				}
				this.updateSelected();
				this.resize();
			}
		},
		toogleAddMore:function(){
			if(this.opened){
				this.opened = false;
				this.$hidable.animate({"height": "0px"}, 200);
			}
			else{
				this.opened = true;
				var h = this.$available_box.height() + this.$availableText.height() + 20 + 6;
				
				if(this.$availables.width() > this.$available_box.width() )
					h += 15;
					
				this.$hidable.animate({"height": h + "px"}, 200);
			}
			return false;
		},
		draggingPos: function(x, y){
			var offsetBox = this.$selected_box.offset();
			if(y>offsetBox.top && y < offsetBox.top+110){
				//Y within box
				
				if(this.selectedImages.length == 0){
					if(!this.linerOn)
						this.$liner.css({
							"left":"10px"
						}).stop().fadeTo(150, 1);
					this.linerOn = true;
					this.linerPos = 0;
				}
				else{
					var offsetSel = this.$selecteds.offset();
					var relativeX = x - offsetSel.left;
					
					var pos = 0;
					while(relativeX > 0){
						relativeX -= 100;
						pos++;
					}
					
					if(pos > this.selectedImages.length)
						pos = this.selectedImages.length;
					
					if(!this.linerOn || this.linerPos != pos){
						this.linerPos = pos;
						
						this.$liner.stop().fadeTo(150, 0, $.proxy(function(){
							this.$liner.css({
								"left":10+100*this.linerPos+"px"
							}).fadeTo(150, 1);
						}, this));
					}
					
					this.linerOn = true;
					
					this.arrangeGrid();
				}
			}
			else{
				if(this.linerOn){
					this.$liner.stop().fadeTo(150, 0);
					this.linerOn = false;
					this.arrangeGrid();
				}
			}
		},
		arrangeGrid: function(){
			for(var i= 0; i< this.selectedImages.length; i++)
				this.selectedImages[i].changePos(this.selectedImages[i].pos, (this.linerOn && (this.linerPos <= this.selectedImages[i].pos)));
			
		},
		getNewImage: function(url, id){
			var $newImage = $('<div class="imagepicker_image"></div>').css({
				"width":"90px",
				"height":"90px",
				"overflow":"hidden",
				"position":"absolute",
				"top":"0px",
				"left":"0px"
			});
			
			var $img = $('<img src="'+url+'" alt="image" ref="'+id+'"/>').appendTo($newImage);
			$img.load(function(){
				$(this).resizeAndCenter(90, 90);
			});
			
			return $newImage;
		},
		addSelected: function(url, id){
			if(this.linerOn){
				var $newImage = this.getNewImage(url, id);
				
				$newImage.appendTo(this.$selecteds);
				
				for(var i= 0; i< this.selectedImages.length; i++)
					if(this.selectedImages[i].pos >= this.linerPos)
						this.selectedImages[i].pos++;
				
				this.selectedImages.push(new ImageDragable($newImage, this, true, this.linerPos));
				
				this.$liner.stop().fadeTo(150, 0);
				this.linerOn = false;
				this.arrangeGrid();
				
				this.updateSelected();
				this.resize();
			}
			
		},
		getByPos: function(pos){
			for(var i= 0; i< this.selectedImages.length; i++)
				if(this.selectedImages[i].pos == pos)
					return i;
			return -1;
		},
		getById: function(id){
			for(var i= 0; i< this.selectedImages.length; i++)
				if(this.selectedImages[i].id == id)
					return i;
			return -1;
		},
		removeSelected:function(posit){
			var imgSel = this.getByPos(posit);
			
			if(imgSel != -1){
				var pos = this.selectedImages[imgSel].pos;
				for(var i= 0; i< this.selectedImages.length; i++){
					if(this.selectedImages[i].pos > pos){
						this.selectedImages[i].pos--;
						this.selectedImages[i].updatePos(true);
					}
				}
				this.selectedImages = removePositionInArray(this.selectedImages, imgSel);
				this.updateSelected();
			}
		},
		changeSelected: function(posit){
			var imgSel = this.getByPos(posit);
			var pos = this.selectedImages[imgSel].pos;
			
			if(imgSel != -1){
				this.$liner.stop().fadeTo(150, 0);
				this.linerOn = false;
				
				var posTo = this.linerPos;
				
				if(pos >= this.selectedImages.length)
					pos = this.selectedImages.length-1;
				
				if(pos == posTo){
					this.selectedImages[imgSel].$obj.stop().fadeTo(150, 1);
					this.arrangeGrid();
					return;
				}
				
				if(pos > posTo){
					for(var i= 0; i< this.selectedImages.length; i++){
						if(this.selectedImages[i].pos >= posTo && this.selectedImages[i].pos < pos){
							this.selectedImages[i].pos++;
						}
					}
				}
				else{
					if(posTo != 0)
						posTo--;
					for(var i= 0; i< this.selectedImages.length; i++){
						if(this.selectedImages[i].pos > pos && this.selectedImages[i].pos <= posTo){
							this.selectedImages[i].pos--;
						}
					}
				}
				
				this.selectedImages[imgSel].pos = posTo;
				
				for(var i= 0; i< this.selectedImages.length; i++){
					this.selectedImages[i].rightToLiner = false;
					this.selectedImages[i].updatePos(true);
				}
				//this.arrangeGrid();
			}
		},
		updateSelected: function(){
			this.$selecteds.css("width", 10+100*this.selectedImages.length+13+"px");
			this.$currentSelectedSpan.text("("+this.selectedImages.length+")");
		},
		val:function(){
			var arr = new Array();
			for(var pos = 0; pos < this.selectedImages.length ; pos++){
				for(var a = 0; a < this.selectedImages.length ; a++)
					if(this.selectedImages[a].pos == pos){
						arr.push(this.selectedImages[a].url);
						break;
					}
			}
			
			return arr.toString();
		},
		resize: function(){
			if(this.$availables.width() > this.$available_box.width() )
				this.$available_box.css("padding-bottom", "15px");
			else
				this.$available_box.css("padding-bottom", "0px");
				
			if(this.$selecteds.width() > this.$selected_box.width() )
				this.$selected_box.css("padding-bottom", "15px");
			else
				this.$selected_box.css("padding-bottom", "0px");
		},
		info: function(){
			return this.selectedImages.length.toString();
		}
	}
	
	return ImagePicker;
});