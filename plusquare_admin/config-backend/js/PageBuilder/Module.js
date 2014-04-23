define(["jquery", "Lightbox/Lightbox", "libraries/jquery.mobile.vmouse", "ui/ui-elements", "libraries/inheritance"], function($, Lightbox) {
    
    var modulesMovementSpeed = 400;
    var modulesSizeSpeed = 400;
    
//MODULE (CONTENTS AND PLACEHOLDERS)
var Module = Class.extend({
    //Update object dragging position
    updateDraggingPos : function(){
        var sumLeft = (this.currentLeftTo - this.currentLeft)/2;
        var sumTop = (this.currentTopTo - this.currentTop)/2;
        
        this.currentLeft+=sumLeft;
        this.currentTop+=sumTop;
        
        this.$objectDragging.css({
            "left": this.currentLeft,
            "top": this.currentTop
        });
        
        this.draggingTimeout = setTimeout($.proxy(this.updateDraggingPos, this), 30);
        return false;
    },
    
    //on module move
    dragMove : function(e){
        var newX = e.pageX;
        var newY = e.pageY;
        
        this.currentLeftTo += (newX-this.currentX);
        this.currentTopTo += (newY-this.currentY);
        
        this.currentX = newX;
        this.currentY = newY;
        
        //TRIGGER moduleMove for PageGrid
        if(this.type == "module")
            $(this).trigger("moduleMove", [newX, newY]);
        else
            $(this).trigger("moduleMove", [newX - this.leftDown, newY]);
        
        return false;
    }
    
    
});

//COMPONENT OBJECT
var Component = Module.extend({
    init: function(info, $viewHolder){
    	//Save shortcode name
    	this.shortcode = info.shortcode;
    	this.$viewHolder = $viewHolder;
    	
    	//Make shortcode parameters
        this.parameters = new Object();
        $.each(
        	info["options"],
        	$.proxy(function(index, option){
        		if(option.type == "tabs" || option.type == "tabs_unbinded"){
        			//Save tab choosen option
        			if(option.type == "tabs"){
        				this.parameters[option["id"]] = {"associate":option.associate, "value":(option.default != undefined ? option.default : ""), "tabs": true};
        				
	        			//Save tabs options
	        			$.each(
	        				option.tabs,
	        				$.proxy(function(tabIndex, tab){
	        					$.each(
	        						tab,
	        						$.proxy(function(tabOptionIndex, tabOption){
	        							this.parameters[tabOption["id"]] = {"associate":tabOption.associate, "value":(tabOption.default != undefined ? tabOption.default : ""), "tab":tabIndex};
	        						}, this)
	        					);
	        				}, this)
	        			);
        			}
        			else{
	        			//Save tabs options
	        			$.each(
	        				option.tabs,
	        				$.proxy(function(tabIndex, tab){
	        					$.each(
	        						tab,
	        						$.proxy(function(tabOptionIndex, tabOption){
	        							this.parameters[tabOption["id"]] = {"associate":tabOption.associate, "value":(tabOption.default != undefined ? tabOption.default : "")};
	        						}, this)
	        					);
	        				}, this)
	        			);
        			}
        		}
        		else{
    				this.parameters[option["id"]] = {"associate":option.associate, "value":(option.default != undefined ? option.default : "")};
        		}
        	}, this)
    	);
    	
    	
    	//Save general info
    	this.info = info;
    	//delete this.info["options"];
    	
    	
        this.built = false;
        this.type = "module";
        
        this.$obj = $("<div class='module'></div>").stop().css("margin-top","8px").fadeTo(0, 0);
        
        this.$obj1 = $("<div class='componentModule'></div>").css({
            "border-color":this.info.color
        }).appendTo(this.$obj);
        
    },
    
    //Build component
    build : function(){
        //this.$obj1.fadeTo(0, 0);
        
        this.$head = $("<div class='headArea'>"+this.info.name+"<img src='"+builderPath+this.info.icon+"' alt='module icon'/></div>").css({
            "color": this.info.color
        }).appendTo(this.$obj1);
        
        this.$info = $("<div class='infoArea'>Click 'edit' to change...</div>").appendTo(this.$obj1);
        
        this.$menuHolder = $("<div class='menuArea'></div>").appendTo(this.$obj1);
        
        var $deleteButton = $("<a href='#' class='smallicon delete-icon'></a>").appendTo(this.$menuHolder).click($.proxy(this.remove, this));
        this.deleteTooltip = new Tooltip($deleteButton, "Delete Module", builderPath);
        
        var $duplicateButton = $("<a href='#' class='smallicon duplicate-icon'></a>").appendTo(this.$menuHolder).click($.proxy(this.duplicate, this));
        this.duplicateTooltip = new Tooltip($duplicateButton, "Duplicate Module", builderPath);
        
        var $editButton = $("<a href='#' class='smallicon edit-icon'></a>").appendTo(this.$menuHolder).click($.proxy(this.edit, this));
        this.editTooltip = new Tooltip($editButton, "Edit Module",  builderPath);
        
        this.$head.preventDragDefault();
        this.$head.addClass("grabhand");
        this.$head.bind(mouseDownBind, $.proxy(this.dragDown, this));
           
        this.$obj.css({
            "background-color":"#fff"
        });
            
        this.$obj.stop(true, true).fadeTo(300, 1);
        this.built = true;
    },
    
    
    //Rebind events
    rebind: function(){
        if(this.built){
            this.$head.addClass("grabhand");
            this.$head.unbind(mouseDownBind)
            this.$head.bind(mouseDownBind, $.proxy(this.dragDown, this));
            
            //buttons
            var $deleteBtn = $('.delete-icon', this.$obj);
            $deleteBtn.unbind("click");
            $deleteBtn.click($.proxy(this.remove, this));
            
            var $duplicateBtn = $('.duplicate-icon', this.$obj);
            $duplicateBtn.unbind("click");
            $duplicateBtn.click($.proxy(this.duplicate, this));
            
            var $editBtn = $('.edit-icon', this.$obj);
            $editBtn.unbind("click");
            $editBtn.click($.proxy(this.edit, this));
            
            this.$obj.fadeTo(0, 1);
        }
    },
    
    /*Change component position
    changePosition: function(top){
        if(this.built)
            this.$obj.stop().animate({
                "top":top
            });
        else
            this.$obj.css("top", top);
    },*/
    
     //On start drag component
    dragDown : function(e){
        this.$head.addClass("down");
        
        this.currentX = e.pageX;
        this.currentY = e.pageY;
        
        var $view = (this.$viewHolder == undefined?$("#page_builder .viewHolder"):this.$viewHolder);
        
        var off = this.$obj.offset();
        var offView = $view.offset();
        
        this.currentLeft = off.left - offView.left;
        this.currentTop = off.top - offView.top;
        
        this.currentLeftTo = this.currentLeft;
        this.currentTopTo = this.currentTop;
        
        //Make dummy component
        this.$objectDragging = this.$obj.clone(); 
        this.$objectDragging.css({
            "position":"absolute",
            "width":this.$obj.width()+"px",
            "left":this.currentLeftTo+"px",
            "top":this.currentTopTo+"px"
        }).appendTo($view);
        this.$objectDragging.css("z-index", 3);
        
        //Fade out main component
        this.$obj.stop().fadeTo(200, 0.2);
        
        this.draggingTimeout = setTimeout($.proxy(this.updateDraggingPos, this), 30);
        
        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
        
        //trigger mouse down 
        $(this).trigger("moduleDown", [this.placeholder]);
    },
    
    //Component stop draging
    dragUp : function(){
        unbindMoveAndUp();
        clearTimeout(this.draggingTimeout);
        
        this.$obj.fadeTo(200, 1);
        this.$objectDragging.stop().fadeTo(200, 0, function(){
            $(this).remove();
        });
        
        //TRIGGER moduleUp for PageGrid
        $(this).trigger("moduleUp");
        
        this.$head.removeClass("down");
        this.rebind();

        return false;
    },
    
    removeTooltips: function(){
        this.deleteTooltip.remove();
        this.duplicateTooltip.remove();
        this.editTooltip.remove();
    },
    
    //Placeholder remove
    remove : function(  ){
        this.$obj.stop(true, true).fadeTo(200, 0, $.proxy(function(){
            this.removeTooltips();
        }, this));
        $(this).trigger("moduleDelete");
        
        return false;
    },
    
    //Duplicate component
    duplicate: function(){
    	var comp = new Component(this.info, this.$viewHolder);
    	
    	//parameters
    	$.each(
    		this.parameters,
    		$.proxy(function(index, parameter){
    			comp.parameters[index]["value"] = parameter["value"];
    		})
    	);
    	
        $(this).trigger("moduleDuplicate", comp);
        
        return false;
    },
    
    //Edit component info
    edit: function(){
        
        
        this.edit_lightbox = new Lightbox('Edit '+this.info.name, builderPath, $.proxy(this.saveEdit, this));
        
        
        /*
         *	Make options
         * 
        */
       	jQuery.post(
			adminAjax,
			{
				'action' : 'pq_get_shortcode_options',
				'shortcode': this.shortcode
			},
			$.proxy(function( response ) {
                this.edit_lightbox.addContent(response);
				
				//Set values
				//...
                $(document).ready($.proxy(function(){
    				$.each(
    					this.parameters,
    					function(key, obj){
    						//Change value
    						$("#"+key).val(obj.value).trigger("update");
    						//this.parameters[option["id"]] = {"associate":option.associate, "value":(option.value != undefined ? option.value : "")};
    					}
    				);
                }, this));
    				
			}, this)
		);
        
        
        
        return false;
    },
    saveEdit: function(){
        $.each(
			this.parameters,
			function(key, obj){
				//Change value
				obj.value = $("#"+key).val();

                if(obj.associate != "content"){
                    obj.value = obj.value.toString().replace(/"/g,'&quote;');
                    obj.value = obj.value.toString().replace(/(\r\n|\n|\r)/gm,'');
                }


				if(obj.value[obj.value.length-1] == "\n")
					obj.value = obj.value.substring(0, obj.value.length - 1);
			}
		);
        
        this.edit_lightbox.closeEdit();
        $('#page_builder_tab').trigger("save");
        $(this).trigger("changed");
        
        return false;
    }
});

//PLACEHOLDER OBJECT
var Placeholder = Module.extend({
    init: function(size, column, num, resizable){
        this.number = num;
        this.built = false;
        this.priority = 3;
        this.components = new Array();
        this.type = "placeholder";
        this.resizable = (resizable == undefined ? true : resizable);

        this.options = {
            "use_paddings": "false",
            "padding": "",
            "content_align": "left"
        }
        
        this.$obj = $("<div class='module' style='position:absolute;'></div>");
        
        this.$obj1 = $("<div class='placeholderModule' style='height:100%;'></div>").appendTo(this.$obj);
        
        this.$overObj = $("<div class='placeholder-inner'></div>").appendTo(this.$obj1).fadeTo(0, 0);
        
        
        //Head Part
        this.$dragArea = $("<div class='headDragArea'></div>");
        this.$head = $("<div class='headArea'></div>").appendTo(this.$overObj).append(this.$dragArea).append("<div>Placeholder</div>");
            
        this.$deleteButton = $("<a href='#' class='smallicon delete-icon'></a>").appendTo(this.$head).click($.proxy(this.remove, this));
        this.deleteTooltip = new Tooltip(this.$deleteButton, "Delete Module", builderPath);
        
        
        //Components Holder
        this.$componentsHolder = $("<div class='componentsHolder'></div>").appendTo(this.$overObj);
        this.$dropArea = $("<div class='dropArea'>Drop a module in here</div>").appendTo(this.$overObj);
        this.$dropAreaAlert = $("<div class='dropAreaAlert'></div>").appendTo(this.$dropArea);
        
        
        //Menu Holder
        this.$menuHolder = $("<div class='menuArea'></div>").appendTo(this.$overObj);
        
        if(this.resizable){
            this.$settingsButton = $("<a href='#' class='smallicon settings-icon' alt='Placeholder Settings' style='float: left;'></a>").appendTo(this.$menuHolder).click($.proxy(this.edit, this));
            
	        this.$plusButton = $("<a href='#' class='smallicon plus-icon' alt='Increase module width'></a>").appendTo(this.$menuHolder).click($.proxy(this.increaseWidth, this));
	        this.$sizeText = $("<div class='size_text'>1/1</div>").appendTo(this.$menuHolder);
	        this.$minusButton = $("<a href='#' class='smallicon decrease-icon' alt='Decrease module width'></a>").appendTo(this.$menuHolder).click($.proxy(this.decreaseWidth, this));
        
            this.settingsTooltip = new Tooltip(this.$settingsButton, "Placeholder Settings", builderPath);
        	this.minusTooltip = new Tooltip(this.$minusButton, "Decrease Width", builderPath);
        	this.plusTooltip = new Tooltip(this.$plusButton, "Increase Width", builderPath);
    	}
        
        this.$head.preventDragDefault();
        
        this.line = -1;
        this.column = column;
        this.size = size;
        this.offset = 0;
        
        this.update(false);
    },

    //Initial show
    show: function(){
        this.$obj.css({
            "position": "",
            "left": "",
            "top": "",
            "height": ""
        });
        this.$obj1.css("width", "");
        this.$obj1.css("height", "");
        this.$overObj.stop().fadeTo(400, 1);
    },
    
    //Rebind mouse events
    rebind: function(){
        this.$head.addClass("grabhand");
        this.$head.addClass("grabhand");
        this.$dragArea.unbind(mouseDownBind);
        this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
        
        if(this.resizable){
            this.$settingsButton.unbind("click");
	        this.$plusButton.unbind("click");
	        this.$minusButton.unbind("click");
	        this.$deleteButton.unbind("click");
            this.$settingsButton.click($.proxy(this.edit, this));
	        this.$plusButton.click($.proxy(this.increaseWidth, this));
	        this.$minusButton.click($.proxy(this.decreaseWidth, this));
	        this.$deleteButton.click($.proxy(this.remove, this));
            this.settingsTooltip.rebind();
	        this.minusTooltip.rebind();
	        this.plusTooltip.rebind();
        }
        
        $.each(
            this.components,
            function(index, comp){
                comp.rebind();
            }
        );
    },
    
    getHtml: function(offset, columnUse){
        var content = "";
        
        if(columnUse == undefined)
        	columnUse = true;
        
        //Column start
        if(columnUse)
        content += '[column size="'+this.size+'" offset="'+offset+'" content_align="'+this.options["content_align"]+'" use_paddings="'+this.options["use_paddings"]+'" padding="'+this.options["padding"]+'"] ';
        
        for(var i = 0; i< this.components.length; i++){
            var component = this.getComponent(i);
            
            //Start component
            content += "["+component.shortcode+" ";
                
            //Add parameters
            var hasContent = false;
            var contentStr = "";
            var tab = null;
            $.each(
				component.parameters,
				function(key, obj){
					//check if it's out of a tabs element
					if(!obj.hasOwnProperty("tab"))
						tab = null;
					
					
					//If it's inside a tabs element
					if(tab != null){
						if(obj.tab == tab){
							if(obj.associate != "content")
								content += obj.associate + '="' +  obj.value+ '" ';
							else{
								hasContent = true;
								contentStr = obj.value;
							}
						}
						
						return;
					}
					
					//check if it's a tabs element
					if(obj.hasOwnProperty("tabs"))
						tab = obj.value;
					
						
					if(obj.associate != "content")
						content += obj.associate + '="' +  obj.value+ '" ';
					else{
						hasContent = true;
						contentStr = obj.value;
					}
				}
			);
            //Close parameters
            content += "]";
            
            //Add content
            if(hasContent)
                content += contentStr;
                
            //Close component
            content += "[/"+component.info.shortcode+"]";
        }
        
        //Column end
        if(columnUse)
        content += '[/column]';
        
        return content;
    },
    
    //Component above (warn user)
    componentAbove: function(color){
        this.$dropArea.css("border-color", color);
        this.$dropAreaAlert.css("border", "4px solid "+color);
        this.$dropAreaAlert.addClass("active");
    },
    
    //Component not above
    cancelAbove: function(){
        this.$dropArea.css("border-color", "");
        this.$dropAreaAlert.css("border", "0px");
        this.$dropAreaAlert.removeClass("active");
    },
    
    //Add new component
    addComponent: function( component ){
        this.cancelAbove();
        
        //new component position (end of column)
        component.number = this.components.length;
        component.position = this.components.length;
        component.placeholder = this.number;
        
        //Add to holder
        this.$componentsHolder.append(component.$obj);
        
        //Add to array
        this.components.push(component);
        
        component.rebind();
        $(component).bind("moduleDelete", $.proxy(this.removeComponentEvent, this));
        $(component).bind("moduleDuplicate", $.proxy(this.duplicateComponentEvent, this));
        
        //Organize
        this.organizeComponents();
    },
    
    //Insertion of a duplicated component
    duplicateComponentEvent: function(e, comp){
    	this.addComponent(comp);
    	$(this).trigger("moduleDuplicateInsert", comp);
                    
        //build module
        comp.build();
    },
    
    removeFromGrid: function(component){
        var position = component.position;
        
        //Remove from holder
        component.$obj.remove();
        
        //Update positions
        $.each(
            this.components,
            function(index, mod){
                if(mod.position > position)
                    mod.position --;
            }
        );
            
    },
    
    //Remove component
    removeComponent: function( number ){
        //component to remove
        var component = this.components[number];
        $(component).unbind("moduleDelete");
        $(component).unbind("moduleDuplicate");
        
        this.removeFromGrid(component);
        
        //Remove from array
        this.components = removePositionInArray(this.components, number);
        
        //Update identifications
        $.each(
            this.components,
            function(index, mod){
                mod.number = index;
            }
        );
        
        //Organize
        this.organizeComponents();

        $(this).trigger("change");
    },
    
    //Remove component event
    removeComponentEvent: function(e){
        this.removeComponent(e.target.number);
    },
    
    //Moving component
    movingComponent:function(y, number){
        if(number >= this.components.length){
            if(WP_DEBUG)console.log("error moving component");
            return ;
        }
            
        //Relative position
        var offset = this.$componentsHolder.offset();
        var fromTop = y - offset.top;
        
        //Current
        var currentPosition = this.components[number].position;
        
        //Calculate future position
        var to = this.components.length-1;
        var stack = 0;
        var pos = 0;
        for(var i = 0; i< this.components.length; i++){
            var component = this.getComponent(pos);
            
            //increment stack
            stack += component.$obj.height() + 8;
            
            //Found position
            if(fromTop < stack){
                to = pos;
                break;
            }
            
            //increment counter
            pos++;
        }
        
        if(to != currentPosition){
            //Change component position
            this.moveComponentTo(this.components[number], to);
            
            this.organizeComponents();
        }
        
        
    },
    
    //Get component by position
    getComponent: function(position){
        for(var i = 0; i< this.components.length; i++)
            if(this.components[i].position == position)
                return this.components[i];
        
        return null;
    },
    
    //Organize components
    organizeComponents: function(){
       
        
    },
    
    //Append module to holder
    moveComponentTo:function(component, position){
        this.removeFromGrid(component);
        
        if(position === 0) 
            this.$componentsHolder.prepend( component.$obj );   
        else
            $(">div:nth-child(" + position + ")", this.$componentsHolder).after( component.$obj );
            
        //Rebind
        //component.rebind();
        
        //Update positions
        $.each(
            this.components,
            function(index, mod){
                if(mod.position >= position)
                    mod.position ++;
            }
        );
        
        //Update component position
        component.position = position;
    },
    
    //Update position in grid and size
    update:function(animate){
        if(this.removing === true)
            return;

        if(animate == undefined)
            animate = true;
            
        //Sizes
        var w = (this.size/12) * 100 - 0.1;
        var l = (this.offset/12) * 100 + 0.05;
        var o = (this.opacity);
    
        this.$obj.stop().css({
                "margin-left": l+"%"});
        
        if(animate)
            this.$obj.animate({
                "width": w+"%",
                "opacity": o
            }, modulesSizeSpeed, $.proxy(this.organizeComponents, this));
        
        else
            this.$obj.stop().css({
                "width": w+"%",
                "opacity": o
            });

        this.updateSizeText();
    },
    
    //Change module left offset
    changeOffset: function(off){
        if(off != this.offset){
            this.offset = off;
            this.update(true);
        }
    },
    
    //On start drag placeholder
    dragDown : function(e){
        this.$head.addClass("down");
        
        this.currentX = e.pageX;
        this.currentY = e.pageY;
        
        var $viewHolder = $("#page_builder .linesHolder");
        var viewOff = $viewHolder.offset();
        
        var off = this.$obj.offset();
        this.leftDown = this.currentX - off.left;
        
        this.currentLeft = off.left - viewOff.left ;
        this.currentTop = off.top - viewOff.top;
        
        this.currentLeftTo = this.currentLeft;
        this.currentTopTo = this.currentTop;
        
        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
        
        
        //Make dragging object
        this.$objectDragging = this.$obj.clone();
        this.$objectDragging.css({
            "z-index": 3,
            "position":"absolute",
            "margin-left":"0",
            "opacity":"0.5",
            "transform-origin": (this.currentX-off.left)+"px "+(this.currentY-off.top)+"px"
        }).appendTo( $viewHolder );
        this.$objectDragging.height();
        this.$objectDragging.addClass("dragger");
        
        //Fade out obj
        this.opacity = 0.3;
        this.update();
        
        //Set dragging timer
        this.updateDraggingPos();
        this.draggingTimeout = setTimeout($.proxy(this.updateDraggingPos, this), 30);
        
        //Trigger module down for page grid
        $(this).trigger("moduleDown", [this.number, this.line, this.column]);
        
        return false;
    },
    
    //Placeholder drag up
    dragUp : function(){
        unbindMoveAndUp();
        clearTimeout(this.draggingTimeout);
        
        //Fade in obj
        this.opacity = 1;
        this.update();
        
        this.$objectDragging.stop().fadeTo(200, 0, $.proxy(function(){
            this.$objectDragging.remove();
        }, this));
        
        //TRIGGER moduleUp for PageGrid
        $(this).trigger("moduleUp");
        
        this.$head.removeClass("down");

        return false;
    },
    
    //Update Module Size text
    updateSizeText: function(){
    	if(!this.resizable)
    		return;
    		
        if(this.size==12)
            this.$plusButton.css("background-image", "url("+builderPath+"images/page_builder/Blocks/increase_width_disabled.png)")
        else
            this.$plusButton.css("background-image", "url("+builderPath+"images/page_builder/Blocks/increase_width_enabled.png)")
            
        if(this.size==2)
            this.$minusButton.css("background-image", "url("+builderPath+"images/page_builder/Blocks/decrease_width_disabled.png)")
        else
            this.$minusButton.css("background-image", "url("+builderPath+"images/page_builder/Blocks/decrease_width_enabled.png)")
        
        var str = this.size+"/12";
        switch(this.size){
            case 2: str = "1/6";
                    break;
            case 3: str = "1/4";
                    break;
            case 4: str = "4/12";
                    break;
            case 6: str = "1/2";
                    break;
            case 8: str = "2/3";
                    break;
            case 9: str = "3/4";
                    break;
            case 10: str = "5/6";
                    break;
            case 12: str = "1/1";
                    break;
                    
        }
        this.$sizeText.text(str);
    },
     
    //Decrease module size by one
    decreaseWidth : function(){
        if(this.size > 2)
            this.size--;
        
        this.update(true);
        
        $(this).trigger("moduleResize");
        return false;
    },
    
    //Increase module size by one
    increaseWidth : function(){
        if(this.size < 12)
            this.size++;
            
        this.update(true);
        
        $(this).trigger("moduleResize");
        return false;
    },
    removeTooltips: function(){
        if(this.resizable){
	        this.minusTooltip.remove();
	        this.plusTooltip.remove();
       }
       this.deleteTooltip.remove();
    },
    
    //Placeholder remove
    remove : function(){
        this.removing = true;

        this.$obj.stop(true, true).fadeTo(200, 0, $.proxy(function(){
            this.$obj.remove();
            this.removeTooltips();
            $(this).trigger("moduleDelete", [this.number]);
        }, this));
        
        return false;
    },

    removeQuick: function(){
        this.removing = true;
        this.removeTooltips();
        this.$obj.remove();
    },
    
    //Edit component info
    edit: function(){
        
        
        this.edit_lightbox = new Lightbox('Edit Placeholder', builderPath, $.proxy(this.saveEdit, this));
        
        
        /*
         *  Make options
         * 
        */
        jQuery.post(
            adminAjax,
            {
                'action' : 'pq_get_shortcode_options',
                'shortcode': 'column'
            },
            $.proxy(function( response ) {
                this.edit_lightbox.addContent(response);

                $("#colum_content_alignment").val(this.options["content_align"]).trigger("update");
                if(this.options["padding"] != ""){
                    $("#column_use_paddings").val(this.options["use_paddings"]).trigger("update");

                    //Parse padding 
                    var paddings = this.options["padding"].split(" ");
                    
                    $("#colum_top_padding").val( parseInt(paddings[0], 10) );
                    $("#colum_right_padding").val( parseInt(paddings[1], 10) );
                    $("#colum_bottom_padding").val( parseInt(paddings[2], 10) );
                    $("#colum_left_padding").val( parseInt(paddings[3], 10) );
                }

            }, this)
        );
        
        
        
        return false;
    },
    saveEdit: function(){
        this.options["content_align"] = $("#colum_content_alignment").val();

        this.options["use_paddings"] = $("#column_use_paddings").val();
        this.options["padding"] = $("#colum_top_padding").val()+"px "+$("#colum_right_padding").val()+"px "+$("#colum_bottom_padding").val()+"px "+$("#colum_left_padding").val()+"px";
        
        this.edit_lightbox.closeEdit();
        
        return false;
    }
    
});

//PAGEBREAK OBJECT
var Pagebreak = Module.extend({
    init: function(line, number){
        this.number = number;
        this.resizable = false;
        this.priority = 0;
        this.type = "pagebreak";

        //Create object
        this.$obj = $("<div class='module'></div>");
        this.$obj1 = $("<div class='pagebreakModule'></div>").appendTo(this.$obj);
        this.$overObj = $("<div class='pagebreakModule-inner'>From this point below content will be in a new page!</div>").appendTo(this.$obj1);
        this.$deleteButton = $("<a href='#' class='smallicon delete-icon'></a>").appendTo(this.$overObj).click($.proxy(this.remove, this));

        this.$obj.preventDragDefault();

        this.line = line;
        this.column = 0;
        this.size = 12;
        this.offset = 0;
        this.opacity = 1;
        
        this.update(false);
    },

    //Rebind mouse events
    rebind: function(){
        this.$obj.addClass("grabhand");
        this.$obj.unbind(mouseDownBind);
        this.$obj.bind(mouseDownBind, $.proxy(this.dragDown, this));
        this.$deleteButton.unbind("click");
        this.$deleteButton.click($.proxy(this.remove, this));
    },

    getHtml: function(offset, columnUse){
        return '<!--nextpage-->';
    },

    changeOffset: function(){},

    //Update position in grid and size
    update:function(animate){
        if(this.removing === true)
            return;

        if(animate == undefined)
            animate = true;
            
        //Sizes
        var w = (this.size/12) * 100 - 0.1;
        var l = (this.offset/12) * 100 + 0.05;
        var o = (this.opacity);
    
        this.$obj.stop().css({
                "margin-left": l+"%"});
        
        if(animate)
            this.$obj.animate({
                "width": w+"%",
                "opacity": o
            }, modulesSizeSpeed, $.proxy(this.organizeComponents, this));
        
        else
            this.$obj.stop().css({
                "width": w+"%",
                "opacity": o
            });
    },

    //On start drag pagebreak
    dragDown : function(e){
        if($(e.target).hasClass("delete-icon"))
            return true;

        this.$obj.addClass("down");
        
        this.currentX = e.pageX;
        this.currentY = e.pageY;
        
        var $viewHolder = $("#page_builder .linesHolder");
        var viewOff = $viewHolder.offset();
        
        var off = this.$obj.offset();
        this.leftDown = this.currentX - off.left;
        
        this.currentLeft = off.left - viewOff.left ;
        this.currentTop = off.top - viewOff.top;
        
        this.currentLeftTo = this.currentLeft;
        this.currentTopTo = this.currentTop;
        
        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
        
        
        //Make dragging object
        this.$objectDragging = this.$obj.clone();
        this.$objectDragging.css({
            "z-index": 3,
            "position":"absolute",
            "margin-left":"0"
        }).appendTo( $viewHolder );
        
        //Fade out obj
        this.opacity = 0.3;
        this.update();
        
        //Set dragging timer
        this.updateDraggingPos();
        this.draggingTimeout = setTimeout($.proxy(this.updateDraggingPos, this), 30);
        
        //Trigger module down for page grid
        $(this).trigger("moduleDown", [this.number, this.line, this.column]);
        
        return false;
    },
    
    //Placeholder drag up
    dragUp : function(){
        unbindMoveAndUp();
        clearTimeout(this.draggingTimeout);
        
        //Fade in obj
        this.opacity = 1;
        this.update();
        
        this.$objectDragging.stop().fadeTo(200, 0, $.proxy(function(){
            this.$objectDragging.remove();
        }, this));
        
        //TRIGGER moduleUp for PageGrid
        $(this).trigger("moduleUp");
        
        this.$obj.removeClass("down");

        return false;
    },

    //Pagebreak remove
    remove : function(){
        this.removing = true;

        this.$obj.stop(true, true).fadeTo(200, 0, $.proxy(function(){
            this.$obj.remove();
            $(this).trigger("moduleDelete", [this.number]);
        }, this));
        
        return false;
    }
});
    
return {"Component": Component,
        "Placeholder": Placeholder,
        "Pagebreak": Pagebreak};
});
