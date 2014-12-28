require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./Backend.js":[function(require,module,exports){

module.exports = {

	ui: require("./ui/ui-elements.js"),
	FontPicker: require("./ui/FontPicker.js"),
	Lightbox: require("./Lightbox/Lightbox.js"),

	PageBuilder: require("./PageBuilder/PageBuilder.js"),
	StackBuilder: require("./PageBuilder/StackBuilder.js")

};
},{"./Lightbox/Lightbox.js":1,"./PageBuilder/PageBuilder.js":5,"./PageBuilder/StackBuilder.js":6,"./ui/FontPicker.js":10,"./ui/ui-elements.js":31}],1:[function(require,module,exports){
var $ = jQuery;

var Lightbox = function(title, builderPath, saveFunction, width, exit_text, submit_text, loadingLightbox){
	if(exit_text == undefined)
		exit_text = "Exit without saving";
	if(submit_text == undefined)
		submit_text = 'Submit <img class="arrow-icon" src="'+builderPath+'images/ui/arrow.png"/>'
	if(width == undefined)
		width = 900;
	if(loadingLightbox == undefined)
		loadingLightbox = false;

	this.title = title;
	this.builderPath = builderPath;
	this.saveFunction = saveFunction;
	this.exit_text = exit_text;
	this.submit_text = submit_text;
	this.width = width;
	this.loadingLightbox = loadingLightbox;

	//build
	this.build();
}

Lightbox.prototype = {
	build: function(){
		var $body = $('body');
    	var width = this.width;
    	var padding = "20px 25px";

    	this.lightboxInUse = $body.hasClass("adminLightboxOpened");
    	$body.addClass("adminLightboxOpened");

    	this.$cover = $('<div></div>').css({
            "width":"100%",
            "height":"100%",
            "background-color":"#000",
            "position":"fixed",
            "top":"0px",
            "left":"0px",
            "bottom":"0px",
            "right":"0px",
            "z-index": this.lightboxInUse ? "101" : "99"
        }).fadeTo(0, 0).fadeTo(200, 0.7).appendTo($body);

        var fromTop = $(window).scrollTop();
    
        this.$editPage = $('<div></div>').css({
            "position":"absolute",
            "width":width+"px",
            "background-color":"#fff",
            "top":40+fromTop+"px",
            "left":(-width/2)+"px",
            "margin-left":"50%",
            "margin-bottom":"50px",
            "z-index": this.lightboxInUse?"102":"100",
            "overflow":"hidden"
        }).fadeTo(0, 0).fadeTo(200, 1).appendTo($body);
        this.$editPage.addRoundCorners("3px");
        this.$editPage.processFont("AllerRegular", "#26202A", 15);

        this.$menu = $('<div>'+this.title+'</div>').css({
            "position":"relative",
            "display":"block",
            "background-color":"#EEEEEE",
            "padding":padding,
            "border-bottom":"solid 1px #CCCCCC"
        }).appendTo(this.$editPage);
        
        if(!this.loadingLightbox){
	        this.$exitButton = $('<a href="#"></a>').css({
	            "width":"9px",
	            "height":"9px",
	            "background-image":"url("+this.builderPath+"images/ui/lightbox_close.png)",
	            "position":"relative",
	            "float":"right",
	            "left": "-10px",
	            "top":"6px"
	        }).appendTo(this.$menu).click($.proxy(this.closeEdit, this));
        }
        
        this.$content = $('<div></div>').css({
            "position":"relative",
            "padding":padding,
            "display":"block"
        }).appendTo(this.$editPage);
        
        //Loading
        if(!this.loadingLightbox){
	        this.$loadingOptions = $('<div>Loading Options</div>').css({
	            "position":"relative",
	            "display":"block",
	            "padding-left": "30px",
	            "background-image":"url("+this.builderPath+"images/ui/loading.gif)",
	            "background-repeat":"no-repeat",
	           	"background-position":"0 50%"
	        }).appendTo(this.$content);

	        this.$submitMenu = $('<div></div>').css({
	            "position":"relative",
	            "padding":padding,
	            "border-top":"solid 1px #EEEEEE",
	            "overflow":"hidden"
	        }).appendTo(this.$editPage);
	        
	        this.$submitButton = $('<a class="button button-primary button-large disabled" href="#">'+this.submit_text+'</a>').css({
	            "position":"relative",
	            "float":"right"
	        }).appendTo(this.$submitMenu).click($.proxy(this.saveEdit, this));
	        
	        this.$exitButton = $('<a class="button button-primary button-large disabled" href="#">'+this.exit_text+'</a>').css({
	            "position":"relative",
	            "float":"right",
	            "left": "-10px"
	        }).appendTo(this.$submitMenu).click($.proxy(this.closeEdit, this));
        }
        else{
	        this.$loadingOptions = $('<div>Saving</div>').css({
	            "position":"relative",
	            "display":"block",
	            "padding-left": "30px",
	            "background-image":"url("+this.builderPath+"images/ui/loading.gif)",
	            "background-repeat":"no-repeat",
	           	"background-position":"0 50%"
	        }).appendTo(this.$content);
        }
	},

	addContent: function(content){
		this.$content.append(content);
		this.$loadingOptions.remove();

		this.$submitButton.removeClass("disabled");
		this.$exitButton.removeClass("disabled");
	},

	switchLoading: function(loading_text){
		this.$submitButton.addClass("disabled");
		this.$exitButton.addClass("disabled");

		this.$content.html(this.$loadingOptions);
		this.$loadingOptions.css("display", "block");
		this.$loadingOptions.text(loading_text);
	},

	closeEdit: function(){
        var time = 200;
		var $body = $('body');
        
        this.$editPage.fadeTo(time , 0);
        this.$cover.fadeTo(time , 0, $.proxy(function(){
            this.$editPage.remove();
            this.$cover.remove();
        }, this));
        if(!this.lightboxInUse)
        	$body.removeClass("adminLightboxOpened");

		$(this).trigger("close_lightbox");

		return false;
	},

	saveEdit: function(){
		this.saveFunction.call();

		return false;
	}
};

module.exports = Lightbox;

},{}],2:[function(require,module,exports){
var $ = jQuery;

require("../libraries/jquery.mobile.vmouse.js");
require("../libraries/inheritance.js");

// GRID LINE
var Line = function(holder, id, $baseLine){
    //id
    this.id = id;
    
    //modules
    this.modules = new Array();
    
    //holder
    this.holder = $("<div class='line-holder'></div>").appendTo(holder).hover($.proxy(this.overThis, this));
    
    //pluses grid
    this.baseline = $baseLine.clone().appendTo(holder);
}
Line.prototype = {
    overThis: function(){
        $(this).trigger("overThis", [this.id]);
        return false;
    },
    isEmpty: function(){
        return this.modules.length == 0;
    },
    
    getOffsetY: function(){
        return this.holder.offset().top;
    },


    hasOnly: function(module){
        return this.modules.length == 1 && this.modules[0].number == module.number;
    },
    
    //Occupy grid
    occupyGrid: function(column, size, grid, num){
        for(var i = column; i<(column+size) ; i++)
            grid[i] = num;
        
        return grid;
    },
    
    //Check if a module fits in a grid
    canFitIn: function(column, size, grid){
        var spaceLeft = size;
        for(var i = column; i<(column+size) ; i++){
            if(grid[i] != -1)
                break;
                
            spaceLeft--;
        }
        
        return spaceLeft;
    },
    
    //Organize modules in this line
    //Returns: excedent lines to past to the next line
    organize: function(){
        var priorityRow = this.getPriority();
        var excessModules = new Array();
        
        //if(WP_DEBUG)console.log("Line: "+this.id+" PR : "+priorityRow);
        
        var gridOccupied = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        var shouldBe = 0;
        //Iterate modules
        var i;
        for(i = 0; i < priorityRow.length ; i++){
            //Module
            var module = this.modules[ priorityRow[i] ];
            
            //if(WP_DEBUG)console.log("Col: "+module.column+" in "+spaceOccupied);
            if(module.column + module.size > 12)
                module.column = 12 - module.size;
            
            //Check module position
            var spaceRemaining = this.canFitIn(module.column, module.size, gridOccupied);
                //if(WP_DEBUG)console.log(spaceRemaining);
            if( spaceRemaining == 0)
                //Fits where it wants to stand
                gridOccupied = this.occupyGrid(module.column, module.size, gridOccupied, priorityRow[i]);
            else{
                //Doesn't fit where it wants to stand
                //if(WP_DEBUG)console.log("DOESNT FIT");
                
                //Check if it has some space backwards
                var count = module.column - 1;
                var spaceAvailableBackwards = 0;
                while(count >= 0 && gridOccupied[count] == -1){
                    spaceAvailableBackwards++;
                    count--;
                }
                
                if(spaceAvailableBackwards >= spaceRemaining)
                    //Can step a little backwards (SITUATION RESOLVED)
                    module.column -= spaceRemaining;
                
                else{
                    //No space to the left TRY TO THE RIGHT
                    count = module.column + 1;
                    var size = 0;
                    var col = -1;
                    while(count < 12 ){
                        if(gridOccupied[count] == -1){
                            //is NOT occupied
                            if(size == 0)
                                col = count;
                            size++;
                            if(size == module.size)
                                break;
                        }
                        else{
                            //is occupied
                            size = 0;
                            col = -1;
                        }
                        count++;
                    }
                    
                    if(size == module.size)
                        //Has space to the right (SITUATION RESOLVED)
                        module.column = col;
                    else{
                        //if(WP_DEBUG)console.log("DOESNT FIT AT ALL");
                        break;
                    }
                        
                    gridOccupied = this.occupyGrid(module.column, module.size, gridOccupied, priorityRow[i]);
                }
            }
            
        }
        
        //Add modules to the right places and set offsets
        var position = 0;
        var blankSpace = 0;
        for(var a = 0; a < 12; a++){
            if(gridOccupied[a] == -1){
                //BLANK SPACE
                blankSpace++;
            }
            else{
                //Module
                var module = this.modules[ gridOccupied[a] ];
                
                //Check if module is in this line
                if(module.line != this.id)
                    //append
                    this.appendModuleAt(module, position);
                
                
                //Check if it's on the right position
                else if(module.positionInLine != i){
                    //Remove it from current position
                    this.removeModuleFromHolder(module);
                    
                    //Add it to new position
                    this.appendModuleAt(module, position);
                }
                
                //Check if it needs offset
                if(blankSpace > 0)
                    module.changeOffset( blankSpace );
                else
                    module.changeOffset( 0 );
                
                blankSpace = 0;
                position++;
                
                var modNum = gridOccupied[a];
                while(gridOccupied[a] == modNum && a < 12)
                    a++;
                a--;
            }
            
        }
        
        if(i != priorityRow.length){
            //Has Overflowed
            //if(WP_DEBUG)console.log("OVERFLOW");
            
            //Remove modules from this line
            for(i ; i < priorityRow.length ; i++){
                //Module
                var module = this.modules[ priorityRow[i] ];
            
                //add to excess
                excessModules.push( module );
            }
            
            
            //remove modules
            $.each(
                excessModules,
                $.proxy(function(index, module){
                    this.removeModule(module.number);
                }, this)
            );
        }
        
        return excessModules;
    },
    
    //Gets a priority list
    //Returns: ordered modules list
    getPriority: function(){
        var priorityRow = new Array();
        
        //Check elements dragging
        $.each(
            this.modules,
            function(index, mod){
                if(mod.priority == 3 || mod.priority == 2)
                    priorityRow.push(index);
            }
        );
        
        if(this.modules.length > priorityRow.length){
            for(var i = 0; i<12; i++){
                //Get modules in column i
                var modsInColumn = this.getModulesInColumn(i);
                
                //Only one module in this column
                if(modsInColumn.length == 1){
                    //Add module to prority row
                    addIfDoesnExist(modsInColumn[0], priorityRow);
                }
                
                //Modules coliding in same position
                else if(modsInColumn.length > 1){
                    while(modsInColumn.length > 0){
                        //Get highest priority module
                        var moduleNum = this.getHighestPriorityModule(modsInColumn);
                        
                        //Add it to prority row
                        addIfDoesnExist(modsInColumn[moduleNum], priorityRow);
                        
                        //Remove from array
                        modsInColumn = removePositionInArray(modsInColumn, moduleNum);
                    };
                }
            }
        }
        
        return priorityRow;
    },
    
    //Get the highest prority module number
    getHighestPriorityModule: function(mods){
        var max = -1;
        var module;
        $.each(
            mods,
            $.proxy(function(index, modNum){
                if(this.modules[modNum].priority > max){
                    max = this.modules[modNum].priority;
                    module = index;
                }
                if(this.modules[modNum].priority == 1)
                    this.modules[modNum].priority = 0;
            },this)
        );
        
        return module;
    },
    
    //Get modules numbers in a specific column
    getModulesInColumn: function(column){
        var mods = new Array();
        $.each(
            this.modules,
            function(index, module){
                if(module.column == column)
                    mods.push(index);
            }
        );
        
        return mods;
    },

    //Pop all modules from line
    popModules: function(){
        var mods = this.modules;
        while(this.modules.length > 0){
            this.removeModule(this.modules[0].number);
        }
        
        return mods;
    },
    
    //Push modules to line (Begining)
    pushModules: function(mods, begining){
        if(begining == undefined)
            begining = true;
        if(mods)
        $.each(
            mods,
            $.proxy(function(index, module){
                module.priority = 1;
                if(begining)
                module.column = 0;
                this.addModule(module);
            }, this)
        );
    },

    //Get module id
    getModuleById: function(id){
        for(var i = 0; i< this.modules.length; i++)
            if(this.modules[i].number == id)
                return i;
        
        return -1;
    },
    
    //Append module to holder
    appendModuleAt:function(module, position){
        if(position === 0) 
            this.holder.prepend( module.$obj );   
        else
            $(">div:nth-child(" + position + ")", this.holder).after( module.$obj );
            
        //Rebind
        module.rebind();
        module.update(false);
        
        //increment following modules position
        var lineId = this.id;
        $.each(
            this.modules,
            function(index, mod){
                if(mod.line == lineId && mod.positionInLine >= position)
                    mod.positionInLine ++;
            }
        );
        
        //Update module line
        module.line = this.id;
        
        //Update module position in line
        module.positionInLine = position;
    },

    //Remove module from holder
    removeModuleFromHolder:function(module){
        //get it's position in the line
        var position = module.positionInLine;
        
        //Remove it form the holder
        module.$obj.remove();
        
        //decrement following modules position
        var lineId = this.id;
        $.each(
            this.modules,
            function(index, mod){
                if(mod.line == lineId && mod.positionInLine > position)
                    mod.positionInLine --;
            }
        );
    },
    
    getModuleInColumn: function(position){
        var moduleRet = null;
        $.each(
            this.modules,
            function(index, mod){
                if(mod.positionInLine == position){
                    moduleRet = mod;
                    return;
                }
            }
        );
        return moduleRet;
    },

    hasColumnInEnd: function(){
        var moduleRet = false;
        $.each(
            this.modules,
            function(index, mod){
                if(mod.column+mod.size >= 12){
                    moduleRet = true;
                    return;
                }
            }
        );
        return moduleRet;
    },

    getOrderedModules: function(){
        var modulesReturn = new Array();
        
        for(var i = 0; i < 12 ; i++){
            var module = this.getModuleInColumn(i);
            
            if(module != null)
                addIfDoesnExist(module.number, modulesReturn);
            
        }
        
        return modulesReturn;  
    },

    //Add module
    addModule: function(module){
        this.modules.push(module);
    },
    
    //Remove module
    removeModule: function(moduleId){
        var num = this.getModuleById(moduleId);
        
        if(num != -1){
            
            //Remove from holder
            if(this.modules[num].line == this.id)
                this.removeModuleFromHolder(this.modules[num]);
            
            //Remove from array
            this.modules = removePositionInArray(this.modules, num);
        }
        
    }
}


module.exports = {newLine: Line};

},{"../libraries/inheritance.js":8,"../libraries/jquery.mobile.vmouse.js":9}],3:[function(require,module,exports){
var $ = jQuery;
var Lightbox = require("../Lightbox/Lightbox.js");

require("../libraries/jquery.mobile.vmouse.js");
require("../libraries/inheritance.js");
 
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
    
module.exports = {
    "Component": Component,
    "Placeholder": Placeholder,
    "Pagebreak": Pagebreak
};


},{"../Lightbox/Lightbox.js":1,"../libraries/inheritance.js":8,"../libraries/jquery.mobile.vmouse.js":9}],4:[function(require,module,exports){
var $ = jQuery;

require("../libraries/jquery.mobile.vmouse.js");
require("../libraries/inheritance.js");

//MODULE BUTTON CLASS
var ModuleButton = Class.extend({
    mouseDown: function(e){
        $body.append(this.$toDrag);
        
        var off = this.$obj.offset();
        
        //position
        this.currentLeft = off.left;
        this.currentTop = off.top;
        
        this.currentX = e.pageX;
        this.currentY = e.pageY; 
        
        //Save Dragger
        this.$toDrag.css({
            "left": this.currentLeft,
            "top": this.currentTop,
            "display":"block",
            "z-index":"1001"
        }).fadeTo(0, 1);
        
        //TRIGGER moduleButtonDown for PageGrid
        if(this.type == "module"){
            $(this).trigger("moduleButtonDown", [this.shortcode, this.currentLeft, this.currentTop]);
        }
        else if(this.type == "placeholder")
            $(this).trigger("moduleButtonDown", [this.sizes, this.size, this.currentX, this.currentY]);
        else
            return;
            
        
        //Mouse Events
        $(document).bind(mouseMoveBind, $.proxy(this.mouseMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.mouseUp, this));
    
        return false;
    },
    mouseMove: function(e){
        var newX = e.pageX;
        var newY = e.pageY;
        
        this.currentLeft += (newX-this.currentX);
        this.currentTop += (newY-this.currentY);
        
        this.currentX = newX;
        this.currentY = newY;
        
        this.$toDrag.css({
            "left": this.currentLeft,
            "top": this.currentTop
        });
        
        //TRIGGER moduleButtonMove for PageGrid
        $(this).trigger("moduleButtonMove", [newX, newY]);
        
    },
    mouseUp: function(){
        unbindMoveAndUp();
        
        this.$toDrag.stop().fadeTo(500, 0, function(){
            $(this).css("display","none")
        });
        
        //TRIGGER moduleButtonUp for PageGrid
        $(this).trigger("moduleButtonUp", [this.currentLeft, this.currentTop]);
        
        return false;
    }
});

//COMPONENT BUTTON OBJECT
var ComponentButton = ModuleButton.extend({
    init: function(info){
        var image = builderPath+info.icon;
        var text = info.name;
        
        this.shortcode = info.shortcode;
        this.info = info;
        this.type = "module";
        
        this.$obj = $("<a href='#' alt='"+text+"'>"+text+"</a>").css({
            "text-decoration":"none",
            "display":"block",
            "width":"91px",
            "margin":"0",
            "padding":"9px 9px 9px 30px",
            "background-image":"url("+image+")",
            "background-repeat":"no-repeat",
            "background-position" : "5px 50%",
            "border-bottom":"solid 1px #464646"
        });
        this.$obj.processFont("AllerRegular", "#fff", 12);
        
        this.$toDrag = $("<div></div>").append(this.$obj.clone().css({"border":"none"})).css({
            "width":"130px",
            "height":"29px",
            "background-image":"url("+builderPath+"images/page_builder/Modules/drag_background.png)",
            "background-repeat":"no-repeat",
            "position":"absolute",
            "z-index":"2"
        });
        
        this.$obj.hover(function() {
            $(this).css('background-color', "#2C2C2C");
        }, function() {
            $(this).css('background-color', 'transparent');
        });
        new Tooltip(this.$obj, text, builderPath);
        
        
        this.$obj.preventDragDefault();
        //MOUSE DOWN BIND
        this.$obj.bind(mouseDownBind, $.proxy(this.mouseDown, this));
        
    }
});

//PLACEHOLDER BUTTON OBJECT
var PlaceholderButton = ModuleButton.extend({
    init: function(image, text, sizes){
        this.info = new Object();
        this.info.text = text;
        
        this.sizes = sizes;
        this.size = 0;
        for(var i = 0; i < sizes.length; i++)
            this.size += sizes[i]; 
        this.type = "placeholder";
        
        this.$obj = $("<a href='#' alt='"+text+"'></a>").css({
            "text-decoration":"none",
            "display":"block",
            "width":"172px",
            "height":"29px",
            "margin":"0",
            "background-image":"url("+image+")",
            "background-repeat":"no-repeat",
            "background-position" : "8px 10px",
            "border-bottom":"solid 1px #464646"
        });
        
        this.$toDrag = $("<div></div>").append(this.$obj.clone().css({"border":"none"})).css({
            "width":"172px",
            "height":"29px",
            "background-image":"url("+builderPath+"images/page_builder/Placeholder/drag_background.png)",
            "background-repeat":"no-repeat",
            "position":"absolute",
            "z-index":"2"
        });
        
        this.$obj.hover(function() {
            $(this).css('background-color', "#2C2C2C");
        }, function() {
            $(this).css('background-color', 'transparent');
        });
        new Tooltip(this.$obj, text, builderPath);
        
        
        this.$obj.preventDragDefault();
        //MOUSE DOWN BIND
        this.$obj.bind(mouseDownBind, $.proxy(this.mouseDown, this));
        
    }
});

module.exports = {	
    "ComponentButton": ComponentButton,
	"PlaceholderButton": PlaceholderButton
};

},{"../libraries/inheritance.js":8,"../libraries/jquery.mobile.vmouse.js":9}],5:[function(require,module,exports){
var $ = jQuery;

require("../libraries/jquery.mobile.vmouse.js");
require("../libraries/inheritance.js");

var Lightbox = require("../Lightbox/Lightbox.js");
var ModuleButton = require("./ModuleButton.js");
var Module = require("./Module.js");
var Line = require("./Line.js");
require("./Tooltip.js");
    
//Shortcodes info
var shortcodes;


var PageBuilder = function($tab, buildPath, _shortcodes, _saved_pages){
	shortcodes = _shortcodes;
    this.saved_pages = _saved_pages;
	builderPath = buildPath;
	$body = $("body");
	
    //Modules
    this.modules = new Array();
    this.lineNum = 0;
    
    //Lines
    this.lines = new Array();
    this.linesSnaps = new Array();
    this.bottomSnaps = new Array();
    this.lineOver = 0;
    
    this.$pageBuilderTab = $tab;
    
    this.build();
    this.moduleDragging = -1;
    
    $(window).resize($.proxy(this.onResize, this));
        
    $("#post").submit( $.proxy(this.makeHtml, this) );
    this.fromHtml();
    
    this.menuFromTop = this.$pageBuilderMenu.offset().top;
    this.menuOffTop = $("#wpbody").offset().top;
    $(window).scroll( $.proxy(this.onScroll, this) );
}

PageBuilder.prototype = {
    //Build page builder grid
    build: function(){
        //Page Builder Menu
        this.$pageBuilderMenu = $("<div class='menu'></div>").appendTo(this.$pageBuilderTab);
        
        this.$pageBuilderTab.bind("save", $.proxy(this.makeHtml, this));

        ///////////////place holder button
        var $addPlaceholder = $("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);
        var $addPlaceholderButton = $("<a href='#'>Add new placeholder</a>").appendTo($addPlaceholder);
        $addPlaceholderButton.processIcon(builderPath+"images/page_builder/MainMenu/placeholder_icon.png");

        ///////////////add module button
        var $addModule = $("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);
        var $addModuleButton = $("<a href='#'>Add new module</a>").appendTo($addModule);
        $addModuleButton.processIcon(builderPath+"images/page_builder/MainMenu/add_icon.png");

        ///////////////add module button
        var $addPageBreak = $("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);
        var $addPageBreakButton = $("<a href='#'>Add Pagebreak</a>").appendTo($addPageBreak);
        $addPageBreakButton.processIcon(builderPath+"images/page_builder/MainMenu/add_icon.png");

        ///////////////load page button
        var $loadModule = $("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);
        var $loadPageButton = $("<a href='#'>Load page</a>").appendTo($loadModule);
        $loadPageButton.processIcon(builderPath+"images/page_builder/MainMenu/load_icon.png");

        ///////////////save page button
        var $saveModule = $("<div class='menu-button right' style='position:relative;'></div>").appendTo(this.$pageBuilderMenu);
        var $savePageButton = $("<a href='#'>Save page</a>").appendTo($saveModule);
        $savePageButton.processIcon(builderPath+"images/page_builder/MainMenu/save_icon.png");

        ///////////////clear page button
        var $clearModule = $("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);
        var $clearPageButton = $("<a href='#'>Clear page</a>").appendTo($clearModule).click($.proxy(this.clearAllClick, this));
        $clearPageButton.processIcon(builderPath+"images/page_builder/MainMenu/delete_icon.png");



        //Load menu
        this.$loadModuleMenu = $("<div class='menu-dropdown' id='loadDrop'></div>").appendTo($loadModule);
        var $loadModuleMenu = this.$loadModuleMenu;
        $loadModule.hover(function() {
            $loadModuleMenu.stop().css("display", "block").fadeTo(150, 1);
        }, function() {
            $loadModuleMenu.stop().fadeTo(150, 0, function(){$(this).css("display", "none")});
        });

        this.number_saved_pages = 0;
        $.each(this.saved_pages, $.proxy(function(title, saved_page){
            this.add_new_page_template_button(title);
        }, this));
        
        if(this.number_saved_pages == 0)
            this.$loadModuleMenu.html("<p>No saved pages to load!</p>");



        //Save menu
        var $saveModuleMenu = $("<div class='menu-dropdown' id='saveDrop'></div>").appendTo($saveModule);

        this.save_input = $("<input type='text'/>").appendTo($saveModuleMenu);
        $('<a href="#" onclick="return false;">Save</a>').appendTo($saveModuleMenu).click($.proxy(this.save_page, this));
        
        var save_input = this.save_input;
        $saveModule.hover(function() {
            save_input.unbind("blur");
            $saveModuleMenu.stop().css("display", "block").fadeTo(150, 1);
        }, function() {
            if(!save_input.is(":focus"))
                $saveModuleMenu.stop().fadeTo(150, 0, function(){$(this).css("display", "none")});
            else
                save_input.bind("blur", function(){
                    $saveModuleMenu.stop().fadeTo(150, 0, function(){$(this).css("display", "none")});
                });
        });

        
        //PLACEHOLDER MENU
        var $placeholderMenu = $("<div class='menu-dropdown' id='placeholderDrop' style='left: -1px;'></div>").appendTo($addPlaceholder);
        
        $addPlaceholder.hover(function() {
            $placeholderMenu.stop().css("display", "block").fadeTo(150, 1);
        }, function() {
            $placeholderMenu.stop().fadeTo(150, 0, function(){$(this).css("display", "none")});
        });
        
        var $placeHolderHideable =  $("<div class='wraper'></div>").appendTo($placeholderMenu)
                                            .append($("<div class='info-small-pb'>Info</div>"))
                                            .append($("<div class='info-pb'>Drag and drop these placeholders on the canvas to create spaces in which you can later drag and drop modules.</div>"))
        
        var $placeHolderColumns = $("<div class='row-fluid columns-wraper'></div>").appendTo($placeholderMenu);
        
        //columns
        var $leftColumn = $("<div class='span6'></div>").appendTo($placeHolderColumns);
        var $rightColumn = $("<div class='span6'></div>").appendTo($placeHolderColumns);
        var columnsPlaceholders = [$leftColumn, $rightColumn];
        
        var placeholdersConstructor = [
            {image: "images/page_builder/Placeholder/1-1.png",                       column:0,   label:"1"   ,                               sizes:[12]},
            {image: "images/page_builder/Placeholder/1-2.png",                       column:0,   label:"1/2" ,                               sizes:[6]},
            {image: "images/page_builder/Placeholder/1-2_1-2.png",                   column:0,   label:"1/2 + 1/2" ,                         sizes:[6, 6]},
            {image: "images/page_builder/Placeholder/1-3.png",                       column:0,   label:"1-3" ,                               sizes:[4]},
            {image: "images/page_builder/Placeholder/1-3_1-3_1-3.png",               column:0,   label:"1-3 + 1-3 + 1-3" ,                   sizes:[4, 4, 4]},
            {image: "images/page_builder/Placeholder/1-3_2-3.png",                   column:1,   label:"1/3 + 2/3" ,                         sizes:[4, 8]},
            {image: "images/page_builder/Placeholder/2-3_1-3.png",                   column:1,   label:"2/3 + 1/3" ,                         sizes:[8, 4]},
            {image: "images/page_builder/Placeholder/1-6.png",                       column:1,   label:"1/6" ,                               sizes:[2]},
            {image: "images/page_builder/Placeholder/1-6_1-6_1-6_1-6_1-6_1-6.png",   column:1,   label:"1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6" , sizes:[2, 2, 2, 2, 2, 2]}
        ]
        
        //make buttons
        $.each(
            placeholdersConstructor,
            $.proxy(function(index, obj){
                var placeholderButton = new ModuleButton.PlaceholderButton(builderPath+obj.image, obj.label, obj.sizes); 
                columnsPlaceholders[obj.column].append( placeholderButton.$obj );
                
                $(placeholderButton).bind("moduleButtonDown", $.proxy(this.createPlaceholder, this));
            }  , this)
        );

        //Page break
        $addPageBreakButton.click($.proxy(this.createPageBreak, this));
        
        
        //MODULES MENU
        var $modulesMenu = $("<div class='menu-dropdown' id='modulesDrop'></div>").appendTo($addModule);
        
        $addModule.hover(function() {
            $modulesMenu.stop().css("display", "block").fadeTo(150, 1);
        }, function() {
            $modulesMenu.stop().fadeTo(150, 0, function(){$(this).css("display", "none")});
        });
        
        var $modulesHideable = $placeHolderHideable.clone().appendTo($modulesMenu);
        $('div.info-pb', $modulesHideable).text("Drag and drop these modules within placeholders. Once placed, you can edit the modules by pressing the edit icon and drag an drop them to different locations.");
        
        
        //Custom Column
        var $customColumnText = $("<p class='title_menu'>Shortcodes</p>").appendTo($modulesMenu);
        var $mainrow = $("<div class='row-fluid columns-wraper'></div>").appendTo($modulesMenu);
        
        //var $customColumns = $("<div class='row-fluid'></div>").appendTo($modulesCustomColumn);
        
        var $customColumn1 = $("<div class='span3 column'></div>").appendTo($mainrow);
        var $customColumn2 = $("<div class='span3 column'></div>").appendTo($mainrow);
        var $customColumn3 = $("<div class='span3 column'></div>").appendTo($mainrow);
        var $customColumn4 = $("<div class='span3 column'></div>").appendTo($mainrow);
        
        var componentsColumns = [$customColumn1, $customColumn2, $customColumn3, $customColumn4];
        
        //make buttons
	    var size = 0, key;
	    for (key in shortcodes) {
	        if (shortcodes.hasOwnProperty(key)) size++;
	    }

        var shortcodesPerColumn = Math.ceil(size/4);
        
        var counter = 0;
        var currentColumn = 0;
        $.each(
            shortcodes,
            $.proxy(function(index, obj){
                var moduleButton = new ModuleButton.ComponentButton( obj ); 
                componentsColumns[currentColumn].append( moduleButton.$obj );
                
                counter++;
                if(counter == shortcodesPerColumn){
                	counter = 0;
                	currentColumn++;
                }
                
                $(moduleButton).bind("moduleButtonDown", $.proxy(this.createComponent, this));
            }  , this)
        );
        

        //CONSTRUCT VIEW
        this.$view = $("<div class='view'></div>").appendTo(this.$pageBuilderTab);

        //VIEW HOLDER
        this.$viewHolder = $("<div class='viewHolder'></div>").appendTo(this.$view);

        //LINES
        this.$linesHolderOuter = $("<div class='linesHolder'></div>").appendTo(this.$viewHolder);
        
        //Draggers
        this.$linesHolder = $("<div class='linesHolderInner'></div>").appendTo(this.$linesHolderOuter);
        
        //Lines Controller
        
    
        //Make Baseline
        this.$baseLine = $("<div class='lineBase'></div>").appendTo(this.$linesHolder);
        var numPluses = 7;
        var marginLeft = (1/6) * 100;
        for (var i = 0; i < numPluses; i++)
            var $plus = $("<div></div>").css({
                "position" : "absolute",
                "width" : "9px",
                "height" : "9px",
                "left" : (- 4 - 0.2*i) + "px",
                "margin-left":marginLeft*i+"%",
                "background-image" : "url("+builderPath+"images/page_builder/General/grid_plus.png)",
                "background-repeat":"no-repeat"
            }).appendTo(this.$baseLine);
        this.addLine();
        this.addLine();
        this.addLine();


        //Add vertical snappings
        this.$top_snap = $("<a href='#' class='snap_button to_top' data-snap='top'></a>").appendTo(this.$view).click(this.snap_click);
        this.$bottom_snap = $("<a href='#' class='snap_button to_bottom' data-snap='bottom'></a>").appendTo(this.$view).click(this.snap_click);
        new Tooltip(this.$top_snap, "Snap first row to the top", builderPath);
        new Tooltip(this.$bottom_snap, "Snap last row with content to the bottom", builderPath);
    },
    
    



    /*
     *    Html and Modules Parsing
    */

    //Get modules from html
    fromHtml: function(){
        var content = $("#content").val().toString();
        
        if(WP_DEBUG)console.log("CONTENT:"+content+"\n\n");

        var shortcodesArr = [
            //grey
            "raw",

            //greens
            "text",
            "text_box",
            "text_header",
            "quote",
            "message_box",
            
            //purples
            "accordion",
            "tabs",
            
            //red
            "image",
            "blog_gallery",
            "slider",
            "socialVideo",
            "music_player",
            
            //yellow
            "divider",
            "text_divider",
            "vertical_space",
            
            //blue
            "contact_form",
            "button",
            "image_button",
            "actionbox",
            
            //orange
            
            //dark green
            "display-posts",
            
            //other
            "google_maps",
            "flickr",
            "behance",
            "pinterest",
            "dribbble",
            "instagram",
            "facebook_like",
            "google_plus",
            "twitter_button",
            "tweet_feed",
            "tweet"
        ];

        var shortcodesConditional = "(";
        $.each(
            shortcodesArr,
            function(index, shortStr){
                if(index != 0)
                    shortcodesConditional += '|';
                shortcodesConditional += shortStr;
            }
        );
        shortcodesConditional += ")";
        
        if(content != null && content != undefined && content != ""){
            //GET ROWS
            var regexStr = "(\\[row.*?\\][\\s\\S]*?\\[\\/row\\]|\\<\\!\\-\\-nextpage\\-\\-\\>)";
            var regex = new RegExp(regexStr, "gi");
            
            var matched = content.match(regex);
            
            //Iterate rows
            if(matched != null){
                //for each row
                for(var rowId = 0; rowId < matched.length ; rowId ++){
                    if(WP_DEBUG)console.log("ROW: "+matched[rowId]+"\n\n");
                    //Process row

                    if(matched[rowId] == "<!--nextpage-->"){
                        if(WP_DEBUG)console.log("Found line break!"+"\n\n");
                        this.createPageBreak();
                    }
                    else{

                        //SNAPS
                        var regexSnapsStr = 'snaps=".*?"';
                        var regexSnaps = new RegExp(regexSnapsStr, "i");
                        
                        var snapsStr = matched[rowId].match(regexSnaps);
                        if(snapsStr != null){
                            snapsStr = snapsStr[0];
                            
                            var from = 7;
                            var to = snapsStr.length-1;
                            var snaps = snapsStr.substring(from, to);
                        }

                    
                        //GET COLUMNS IN ROWID
                        var regexColumnsStr = "\\[column.*?\\][\\s\\S]*?\\[\\/column\\]";
                        var regexColumns = new RegExp(regexColumnsStr, "gi");
                        
                        var matchedColumns = matched[rowId].match(regexColumns);
                        
                        //Iterate columns in rowId
                        if(matchedColumns != null){
                            
                            //for each column in rowId
                            var column = 0;
                            for(var columnId = 0; columnId < matchedColumns.length ; columnId ++){
                                if(WP_DEBUG)console.log("COLUMN: "+matchedColumns[columnId]+"\n");
                                //Get column parameters part
                                var regexColumnParametersStr = "\\[column.*?\\]";
                                var regexColumnParameters = new RegExp(regexColumnParametersStr, "gi");
                                
                                var matchedParameters = matchedColumns[columnId].match(regexColumnParameters);
                                
                                if(matchedParameters == null){
                                    if(WP_DEBUG)console.log("Page Builder error");
                                    return;
                                }
                                
                                //Get column size
                                var regexParStr = 'size=".*?"';
                                var regexPar = new RegExp(regexParStr, "i");
                                
                                var sizeStr = matchedParameters[0].match(regexPar);
                                sizeStr = sizeStr[0];
                                
                                var from = 6;
                                var to = sizeStr.length-1;
                                var size = parseInt(sizeStr.substring(from, to), 10);
                                
                                //Get column offset
                                regexParStr = 'offset=".*?"';
                                regexPar = new RegExp(regexParStr, "i");
                                
                                var offStr = matchedParameters[0].match(regexPar);
                                offStr = offStr[0];
                                
                                from = 8;
                                to = offStr.length-1;
                                var offset = parseInt(offStr.substring(from, to), 10);
                                
                                column += offset;
                                
                                if(WP_DEBUG)console.log("----------------size: "+size);
                                if(WP_DEBUG)console.log("----------------offset: "+offset);
                                if(WP_DEBUG)console.log("----------------column: "+column);

                                //Content Alignment
                                regexPar = new RegExp('content_align=".*?"', "i");
                                var contentAlignStr = matchedParameters[0].match(regexPar);
                                if(contentAlignStr != null){
                                    contentAlignStr = contentAlignStr[0];
                                    from = 15;
                                    to = contentAlignStr.length-1;
                                    var content_align = contentAlignStr.substring(from, to);
                                }
                                


                                //Get padding
                                regexPar = new RegExp('use_paddings=".*?"', "i");
                                var usePaddStr = matchedParameters[0].match(regexPar);
                                if(usePaddStr != null){
                                    usePaddStr = usePaddStr[0];
                                    from = 14;
                                    to = usePaddStr.length-1;
                                    var use_paddings = usePaddStr.substring(from, to);
                                }

                                regexPar = new RegExp('padding=".*?"', "i");
                                var paddStr = matchedParameters[0].match(regexPar);
                                if(paddStr != null){
                                    paddStr = paddStr[0];
                                    from = 9;
                                    to = paddStr.length-1;
                                    var padding = paddStr.substring(from, to);
                                }
                                
                                
                                
                                //Make placeholder
                                var placeholder = new Module.Placeholder(size, column, this.modules.length);
                                this.lines[rowId].addModule(placeholder);
                                placeholder.show();
                                placeholder.priority = 0;
                                this.modules.push(placeholder);
                                $(placeholder).bind("moduleDown", $.proxy(this.placeholderDown, this));
                                $(placeholder).bind("moduleDelete", $.proxy(this.placeholderDelete, this));
                    			$(placeholder).bind("moduleResize", $.proxy(this.correctGrid, this));
                    			$(placeholder).bind("moduleDuplicateInsert", $.proxy(this.duplicateInsertGrid, this));

                                if(usePaddStr != null){
                                    placeholder.options["use_paddings"] = use_paddings;
                                    placeholder.options["padding"] = padding;
                                }
                                if(contentAlignStr != null){
                                    placeholder.options["content_align"] = content_align;
                                }
                                
                                column += size;
                                
                                //GET COLUMNID content string
                                var columnContent = matchedColumns[columnId].substring(matchedParameters[0].length, matchedColumns[columnId].length-9);
                                if(WP_DEBUG)console.log("----------------content: "+columnContent);
                                
                                //GET COMPONENTS in COLUMNID content
                            	var regexComponentInitialStr = "\\["+shortcodesConditional+"{1}[\\s\\S]*?\\]";
                            	var regexComponentInitial = new RegExp(regexComponentInitialStr, "gi");

                                //if(WP_DEBUG)console.log(regexComponentInitialStr);
                                do{
                                	 var matchedComponentInitial = columnContent.match(regexComponentInitial);
                                	 
                                	 if(matchedComponentInitial != null){
                                	 	var str = matchedComponentInitial[0];
                                	 	
                                	 	var shortcodeStr = "";
                                	 	var count = 1;
                                	 	while(str.charAt(count) != ' ' && str.charAt(count) != ']'){
                                	 		shortcodeStr += str.charAt(count);
                                	 		count++;
                                	 	}
                                        if(WP_DEBUG)console.log("----------------shortcode: "+shortcodeStr);
                                	 	
                                	 	//Get all shortcode
                                	 	var regexComponentStr = "\\["+shortcodeStr+"[\\s\\S]*?\\][\\s\\S]*?\\[\\/"+shortcodeStr+"\\]";
                                		var regexComponent = new RegExp(regexComponentStr, "gi");
                                
                                		var matchedComponent = columnContent.match(regexComponent);
                                		
                                		if(matchedComponent != null){
                                			matchedComponent = matchedComponent[0];
                                			//if(WP_DEBUG)console.log("Creating component with shortcode: "+shortcodeStr);
                                            if(WP_DEBUG)console.log("--------------------------------shortcode component: "+matchedComponent);
                                			
                                			//Shift columnContent
                                			columnContent = columnContent.substring(matchedComponent.length);
                                			//if(WP_DEBUG)console.log("Rest: "+columnContent);
                                			
	                                        var matchedIP = str;
	                                        
	                                        
	                                        //Make component
	                                        var info = shortcodes[shortcodeStr];
	                                        var component = new Module.Component( info );
	                                        
	                                        function parseModule(obj){
	                                        	if(obj.associate != "content"){
	                                        		if(WP_DEBUG)console.log(obj.associate);
													var regexParStr = "\\s"+obj.associate+'="[\\s\\S]*?"';
													var regexPar = new RegExp(regexParStr, "i");
													if(WP_DEBUG)console.log(matchedIP);
													var matchedPar = matchedIP.match(regexPar);
													
													if(matchedPar != null){
														matchedPar = matchedPar[0];
														
														//Cut what isn't needed
														if(matchedPar != null){
											    			var from = obj.associate.length+3;
											    			var to = matchedPar.length-1;
											    			var value = matchedPar.substring(from, to);
											    			if(WP_DEBUG)console.log(obj.associate+": "+value);
                                                            value = value.toString().replace(/(&quote;)/g,'"');
											            
											            	component.parameters[obj.id].value = value;
											        	}
													}
													
													return value;
										  		}  
										  		else{
										  			//Has content
		                                            var fromContent = matchedIP.length;
		                                            var toContent = matchedComponent.length - (shortcodeStr.length + 3);
		                                            var value
		                                            if(toContent<=fromContent)
		                                            	value="";
		                                            else
		                                            	value = matchedComponent.substring(fromContent, toContent);
		                                            
		                                            if(WP_DEBUG)console.log("--------------------------------shortcode content:"+ value);
		                                            component.parameters[obj.id].value = value;
		                                            
													return value;
										  		}
	                                        }
	                                        $.each(
												info.options,
												function(index, obj){
													if(obj.type == "tabs" || obj.type == "tabs_unbinded"){
														if(obj.type == "tabs"){
															var tabSelected = parseModule(obj);
															
															//Make only the selected tab options
															$.each(
																obj.tabs[tabSelected],
																function(index1, subObj){
																	parseModule(subObj);
															});
														}
														else{
															$.each(
																obj.tabs,
																function(index1, tab){
																	$.each(
																		tab,
																		function(index1, subObj){
																			parseModule(subObj);
																	});
															});
														}
													}
													else{
														parseModule(obj);
													}
													
												}
	                                        );
	                                        
	                                        //Add to the targeted placeholder
	                                        placeholder.addComponent( component );
	                                        
	                                        //build module
	                                        component.build();
	                                        
	                                        //Bind module down
	                                        $(component).bind("moduleDown", $.proxy(this.componentDown, this));
                                		}
                                	 }
                                }while(matchedComponentInitial != null && columnContent.length > 1);
                            }
                        }
                                
                        this.checkNumLines();

                        if(snapsStr != null){

                            if(rowId == 0 && snaps.charAt(0) == 't')
                                this.$top_snap.addClass("active");
                            else if(rowId == 0)
                                this.$top_snap.removeClass("active");

                            if(snaps.charAt(1) == 'l')
                                this.linesSnaps[rowId].eq(0).addClass("active");
                            else
                                this.linesSnaps[rowId].eq(0).removeClass("active");

                            if(snaps.charAt(2) == 'r')
                                this.linesSnaps[rowId].eq(1).addClass("active");
                            else
                                this.linesSnaps[rowId].eq(1).removeClass("active");

                            if(snaps.charAt(3) == 'b' && rowId == matched.length-1)
                                this.$bottom_snap.addClass("active");
                            else if(snaps.charAt(3) == 'b')
                                this.bottomSnaps[rowId].addClass("active");
                            else{
                                this.bottomSnaps[rowId].removeClass("active");
                                this.$bottom_snap.removeClass("active");
                            }
                        }
                    }      
                }

                //rows are parsed
                    
                
            }
            else{
                $("#content").val('[row snaps="0000"][column size="12" offset="0" content_align="left" use_paddings="false" padding=""] [raw ]'+content+'[/raw][/column][/row]')
                
                this.fromHtml();
                return;
            }
            
            this.correctGrid();
        }         
    },
    
    //Get html from modules
    makeHtml: function () {
        // Shortcodes
        // [page_builder_column][/page_builder_column]
        
        var content = "";
        
        for(var i= 0; i< this.lines.length ; i++){
        	var line = this.lines[i];
        	
        	//Check if line is not empty
            if(!line.isEmpty()){
                var isPageBreak = line.modules.length == 1 && line.modules[0].type=="pagebreak";

                //Start row
                if(!isPageBreak)
                content += '[row snaps="';

                //Snaps
                var snaps = "";

                    //Top
                    if(i==0 && this.$top_snap.hasClass("active"))
                        snaps+="t";
                    else
                        snaps+= "0";

                    //left
                    if(this.linesSnaps[i].eq(0).hasClass("active") && this.linesSnaps[i].eq(0).is(":visible"))
                        snaps+="l";
                    else
                        snaps+= "0";

                    //right
                    if(this.linesSnaps[i].eq(1).hasClass("active") && this.linesSnaps[i].eq(1).is(":visible"))
                        snaps+="r";
                    else
                        snaps+= "0";

                    //bottom
                    if((i < this.lines.length && this.lines[i+1].isEmpty() && this.$bottom_snap.hasClass("active")) || (i < this.lines.length && !this.lines[i+1].isEmpty() && this.bottomSnaps[i].hasClass("active")))
                        snaps+="b";
                    else
                        snaps+= "0";
                

                //close
                content += snaps+'"]';
                
                //Iterate columns
                var lineModules = this.lines[i].getOrderedModules();
                var shouldBe = 0;
                $.each(
                    lineModules,
                    $.proxy(function(index, moduleId){
                        var module = this.modules[moduleId];
                        var offset = 0;

                        if(shouldBe != module.column)
                            offset = module.column - shouldBe;
                            
                        //Get module html
                        content += module.getHtml(offset);
                        
                        //Increment should be
                        shouldBe = module.column + module.size;
                    }, this)
                )
                
                //End row
                if(!isPageBreak)
                content += "[/row]";
            }
        }
        
        //alert(content);
        $("#content").val(content);

        if(WP_DEBUG)console.log(content);
        
        return true;
    },
    






    /*
     * Save and Loading Page templates
    */

    //Save Action
    save_page: function(){
        var name = this.save_input.val();

        this.confirm_lightbox = new Lightbox('Confirm Save', builderPath, $.proxy(this.save_confirmed, this), 500, "No", "Yes, I'm sure!");

        if(this.saved_pages.hasOwnProperty(name))
            this.confirm_lightbox.addContent("<p>Are you sure you want to save this page and <strong>replace</strong> the existing "+name+" page template?</p>");
        else
            this.confirm_lightbox.addContent("<p>Are you sure you want to save this page template as "+name+"?</p>");
    
        return false;
    },

    //Save confirmed
    save_confirmed: function(  ){

        this.confirm_lightbox.switchLoading("Saving Template");
        title = this.save_input.val();

        //generate html
        this.makeHtml();

        jQuery.post(
            adminAjax,
            {
                'action' : 'pq_save_page_template',
                'title': title,
                'content': $("#content").val()
            },
            $.proxy(function( response ) {
                if(!this.saved_pages.hasOwnProperty(title))
                    this.add_new_page_template_button(title);

                this.saved_pages[title] = $("#content").val();
                this.confirm_lightbox.closeEdit();
            }, this)
        );

    },

    add_new_page_template_button: function(title){
        if(this.number_saved_pages == 0)
            this.$loadModuleMenu.html("");

        var $link = $('<div href="#" data-rel="'+title+'" onclick="return false;">'+title+'<a class="remove_saved" href="#"></a></div>').appendTo(this.$loadModuleMenu).click($.proxy(this.load_page, this));

        this.number_saved_pages++;
    },


    //Load Action
    load_page: function(e){
        var $target = $(e.target);

        if($target.hasClass("remove_saved")){
            //Remove button clicked
            var to_title = $target.parent().attr("data-rel");
            this.to_remove_title = to_title;
            this.confirm_lightbox = new Lightbox('Confirm Saved Page Remove', builderPath, $.proxy(this.template_remove_confirmed, this), 500, "No", "Yes, I'm sure!");
            this.confirm_lightbox.addContent("<p>Are you sure you want to <strong>remove</strong> the "+to_title+" page template?</p>");

        }
        else{
            //Load page template
            var to_title = $target.attr("data-rel");
            this.to_load_title = to_title;
            this.confirm_lightbox = new Lightbox('Confirm Load', builderPath, $.proxy(this.load_confirmed, this), 500, "No", "Yes, I'm sure!");
            this.confirm_lightbox.addContent("<p>Are you sure you want to load "+to_title+" page template? <strong>This will erase everything you have on your page now!</strong></p>");

        }
        return false;
    },

    //Load page template confirmed
    load_confirmed: function(  ){

        this.confirm_lightbox.closeEdit();
        
        //Clear page
        this.clearAll();

        //Set content
        $("#content").val( this.saved_pages[this.to_load_title] );

        //Generate
        this.fromHtml();
    },

    //Remove page template confirmed
    template_remove_confirmed: function(){
        //Close lightbox
        this.confirm_lightbox.switchLoading("Removing Template");

        jQuery.post(
            adminAjax,
            {
                'action' : 'pq_remove_page_template',
                'title': this.to_remove_title
            },
            $.proxy(function( response ) {
                this.$loadModuleMenu.find('div[data-rel="'+this.to_remove_title+'"]').remove();

                this.confirm_lightbox.closeEdit();
                this.number_saved_pages--;
        
                if(this.number_saved_pages == 0)
                    this.$loadModuleMenu.html("<p>No saved pages to load!</p>");
            }, this)
        );
    },









    /*
     *    Modules Functions
    */

    //Get grid position relative
    getCenteredRelativeGridPosition: function(x, y, size){
        var gridPos = this.getGridPos(x, y);
        var line = gridPos.line;
        var column = Math.round(gridPos.column - size/2);
        
         //limit left
        if(column < 0)
            column = 0;
        
        //limit right
        if(column + size > 12)
            column = 12 - size;
            
        return {"column":column , "line":line};
    },
    
    //Create Module (both)
    createModuleFinal: function(e){
        //unbind
        $(e.target).unbind("moduleButtonMove");
        $(e.target).unbind("moduleButtonUp");
    
        if(this.type == "module"){
            
            if(this.targetPlaceholder != -1){
                //Valid position
                
                //Add to the targeted placeholder
                this.modules[this.targetPlaceholder].addComponent( this.module );
                
                //build module
                this.module.build();
                
                //Bind module down
                $(this.module).bind("moduleDown", $.proxy(this.componentDown, this));
            }
            
            this.checkNumLines();
            this.correctGrid();
        }
        else{
            for(var i=0 ; i<this.sizes.length ; i++){
                this.placeholders[i].show();

                //add to new line
                this.lines[this.currentLine].addModule( this.placeholders[i] );

                $(this.placeholders[i]).bind("moduleDown", $.proxy(this.placeholderDown, this));
                $(this.placeholders[i]).bind("moduleDelete", $.proxy(this.placeholderDelete, this));
                $(this.placeholders[i]).bind("moduleResize", $.proxy(this.correctGrid, this));
                $(this.placeholders[i]).bind("moduleDuplicateInsert", $.proxy(this.duplicateInsertGrid, this));
            }
            
            this.checkNumLines();
            this.correctGrid();

            for(var i=0 ; i<this.sizes.length ; i++){
                this.placeholders[i].priority = 0;
            }
        }
        
        
        return false;
    },
    








    /*
     *    Components Functions
    */
    
    //Component Initial Create
    createComponent: function(e, shortcode){
        
        //Create Module
        this.module = new Module.Component( shortcodes[shortcode] );
        
        this.type = "module";
        this.targetPlaceholder = -1;
        
        //Mouse Events
        $(e.target).bind("moduleButtonMove", $.proxy(this.movingComponentInit, this));
        $(e.target).bind("moduleButtonUp", $.proxy(this.createModuleFinal, this));
    },
    
    //Process component moving
    processComponentMoving: function(hittedPlaceholder, color){
        if(hittedPlaceholder != -1){
            if(this.targetPlaceholder != hittedPlaceholder){
                //Above placeholder
                var placeholder = this.modules[hittedPlaceholder];
                
                //Cancel above on previous
                if(this.targetPlaceholder != -1)
                    this.modules[this.targetPlaceholder].cancelAbove();
                    
                //warn placeholder
                placeholder.componentAbove( color );
                
                this.targetPlaceholder = hittedPlaceholder;
            }
        }
        else{
            if(this.targetPlaceholder != -1)
                this.modules[this.targetPlaceholder].cancelAbove();
            
            this.targetPlaceholder = -1;
        }
    },
    
    //Component Initial on move
    movingComponentInit: function(e, newX, newY){
        //get grid pos
        var gridPos = this.getGridPos(newX, newY);
        var line = gridPos["line"];
        var column = gridPos["column"];
        
        //check if above placeholder 
        var hittedPlaceholder = this.hittedPlaceholder(line, column);
        
        this.processComponentMoving( hittedPlaceholder , e.target.info.color );
    },
    
    //Bind a duplicated module
    duplicateInsertGrid: function(e, comp){
        //Bind module down
        $(comp).bind("moduleDown", $.proxy(this.componentDown, this));
        $('html, body').animate({"scrollTop":comp.$obj.offset().top+"px"}, 300);
    },
   
    //Component down
    componentDown: function(e, placeholder){
        if(WP_DEBUG)console.log("componentDown");
        
        this.targetPlaceholder = placeholder;
        
        //Placeholder Events
        $(e.target).bind("moduleMove", $.proxy(this.movingComponent, this));
        $(e.target).bind("moduleUp"  , $.proxy(this.placeComponent, this));
        
        return false;
    },
    
    //Component On Move 
    movingComponent: function(e, newX, newY){
        var component = e.target;
        
        //get grid pos
        var gridPos = this.getGridPos(newX, newY);
        var line = gridPos["line"];
        var column = gridPos["column"];
        
        //check if above placeholder 
        var hittedPlaceholder = this.hittedPlaceholder(line, column);
        
        var componentPlaceholder = component.placeholder;
        
        if(hittedPlaceholder != -1 && hittedPlaceholder != componentPlaceholder){
            //Different placeholder
            this.processComponentMoving(hittedPlaceholder, component.info.color );
        }
        else{
            //Same placeholder
            this.modules[component.placeholder].movingComponent(newY, component.number);
            
            if(this.targetPlaceholder != component.placeholder)
                this.modules[this.targetPlaceholder].cancelAbove();
            
            this.targetPlaceholder = component.placeholder;
        }
        
        
        return false;
    },
    
    //Placeholder Place 
    placeComponent: function(e){
        $(e.target).unbind("moduleMove");
        $(e.target).unbind("moduleUp");
        
        var placeholder = e.target.placeholder;
        
        if(this.targetPlaceholder != -1 && this.targetPlaceholder != placeholder){
            //Add to different placeholder
            
            //remove from current one
            this.modules[placeholder].removeComponent(e.target.number);
            
            //add to new placeholder
            this.modules[this.targetPlaceholder].addComponent(e.target);
        }
        
        return false;
    },
    
    
    





    /*
     *    Placeholders Functions
    */
    
    //Moving the initial placeholders block
    movingPlaceholdersBlock: function(line, column){
        if(line != this.currentLine || column != this.currentColumn){
            this.currentColumn = column;
            this.currentLine = line;
            for(var i=0 ; i<this.sizes.length ; i++){
                this.$spotlight = this.placeholders[i].$obj;
                this.updateSpotlight();

                this.placeholders[i].column = this.currentColumn;
                this.currentColumn += this.sizes[i];
            }
        }
    },
    
    //Placeholder Initial Create
    createPlaceholder: function(e, sizes, size, newX, newY){
        //Create Placeholders
        this.placeholders = new Array();
        this.combinedSize = 0;
        this.sizes = sizes;
        this.size = size;
        
        //Initial position
        var gridPos = this.getCenteredRelativeGridPosition(newX, newY, size);
        var line = gridPos.line;
        var column = gridPos.column;
        
        while(this.lines[line].isEmpty() && line != 0)
            line--;
        
        this.currentLine = -1;
        this.currentColumn = -1;

        for(var i=0 ; i< sizes.length ; i++)
            this.combinedSize += sizes[i];

        if(column + this.combinedSize > 12)
            column = 12-this.combinedSize;
        
        this.combinedSize = 0;
        for(var i=0 ; i< sizes.length ; i++){
            //Create placeholder
            var placeholder = new Module.Placeholder(sizes[i], column+this.combinedSize, this.modules.length);
            
            this.modules.push( placeholder );
            this.placeholders.push( placeholder );
            this.combinedSize += sizes[i];
            
            placeholder.$obj.appendTo(this.$viewHolder);
            placeholder.$obj1.css("width", Math.round(this.$linesHolder.width()*(sizes[i]/12) - 14)+"px");
        }
        
        this.type = "placeholder";
        
        //Mouse Events
        $(e.target).bind("moduleButtonMove", $.proxy(this.movingPlaceholderInit, this));
        $(e.target).bind("moduleButtonUp", $.proxy(this.createModuleFinal, this));
        
        this.movingPlaceholdersBlock(line, column);
    },
    
    //Placeholder Initial on move
    movingPlaceholderInit: function(e, newX, newY){
        //
        var gridPos = this.getCenteredRelativeGridPosition(newX, newY, this.size);
        var line = gridPos.line;
        var column = gridPos.column;
        
        while(line > 0 && this.lines[line-1].isEmpty())
            line--;

        if(column + this.combinedSize > 12)
            column = 12-this.combinedSize;
            
        //If something has changed
        this.movingPlaceholdersBlock(line, column);

        return false;
    },

    //Placeholder delete
    placeholderDelete: function(e, number){
        //Remove from line
        this.lines[this.modules[number].line].removeModule(number);
        
        //Remove from array
        this.modules = removePositionInArray(this.modules, number);
        
        //Update modules serial
        for(var a = 0; a < this.modules.length ; a++)
            this.modules[a].number = a;

        this.correctGrid();
        this.checkNumLines();
    },

    //Placeholder start drag
    placeholderDown: function(e, number, line, column){
        if(WP_DEBUG)console.log("placeholderDown");

        this.initialLine = line;
        this.initialColumn = column;

        this.currentLine = line;
        this.currentColumn = column;
        
        this.moduleDragging = number;
        this.modules[ number ].priority = 2; 

        this.$spotlight = $("<div class='placeholderModule' style='position:absolute;'></div>").css("width", this.modules[ number ].$obj.width()-14).appendTo(this.$viewHolder);
        this.updateSpotlight();
        
        //Placeholder Events
        $(e.target).bind("moduleMove", $.proxy(this.movingPlaceholder, this));
        $(e.target).bind("moduleUp"  , $.proxy(this.placePlaceholder, this));
        
        return false;
    },

    updateSpotlight: function(){
        var top = this.lines[this.currentLine].getOffsetY()-this.$viewHolder.offset().top;
        var left = 15 + this.$viewHolder.width()/12 * this.currentColumn;
        var height = this.lines[this.currentLine].holder.height()-3;
        this.$spotlight.css({
            "top": top+"px",
            "left": left+"px",
            "height": height+"px"
        });
    },
    
    //Placeholder On Move 
    movingPlaceholder: function(e, newX, newY){
        var gridPos = this.getGridPos(newX, newY);
        var line = gridPos.line;
        var column = gridPos.column;
        
        var placeholder = this.modules[this.moduleDragging];
            
        if(column + placeholder.size > 12)
            column = 12-placeholder.size;

        while(line > 0 && (this.lines[line-1].isEmpty() || (this.lines[line].isEmpty() && this.lines[line-1].hasOnly(placeholder)) ))
            line--;
            
        //If something has changed
        if(line != this.currentLine || column != this.currentColumn){
            this.currentLine = line;
            this.currentColumn = column;
            this.updateSpotlight();

            placeholder.column = this.currentColumn;
        }
        
        return false;
    },
    
    //Placeholder Place 
    placePlaceholder: function(e){
        $(e.target).unbind("moduleMove");
        $(e.target).unbind("moduleUp");
        
        var placeholder = this.modules[this.moduleDragging];

        if(this.currentLine != this.initialLine){
            //Change line
            
            //remove from current line
            this.lines[this.initialLine].removeModule( this.moduleDragging );
            
            //add to new line
            this.lines[this.currentLine].addModule( placeholder );
        }
        if(this.currentColumn != this.initialColumn){
            //Change column
            placeholder.column = this.currentColumn;
        }

        this.$spotlight.remove();
        
        this.correctGrid();
        this.modules[ this.moduleDragging ].priority = 0; 
        this.moduleDragging = -1;  
        
        return false;
    },
    
    
    





    /*
     *    Page Break Functions
    */

    //Create Page break
    createPageBreak: function(){
        var line = this.lines.length;
        while(this.lines[line-1].isEmpty() && line-1 != 0)
            line--;

        //Create module
        var pagebreak = new Module.Pagebreak(line, this.modules.length);
        this.modules.push( pagebreak );
            
        //Add to line
        this.lines[line].addModule(pagebreak);

        //bind
        $(pagebreak).bind("moduleDown", $.proxy(this.placeholderDown, this));
        $(pagebreak).bind("moduleDelete", $.proxy(this.placeholderDelete, this));
        
        //Check grid status
        this.checkNumLines();
        this.correctGrid();

        return false;
    },
    
    
    



    
    
    /*
     *    Grid Functions
    */

    //checks if there is at least one module in a line (Revised)
    checkIntersection: function (line){
        for(var i = 0; i < this.modules.length ; i++)
            if(this.modules[i].line == line)
                return true;
        return false;
    },
    
    //Resolves an intersection (Revised)
    resolveIntersection: function (line){
        var lineTemp = 0;
        
        //check if there is space to top
        while(lineTemp < line){
            if(this.lines[lineTemp].isEmpty()){
                for(var i = 0; i < this.modules.length ; i++){
                    if(this.modules[i].line == line)
                        this.modules[i].changeLine( lineTemp );
                }
                return;
            }
            lineTemp++;
        }
        
        //go to the bottom
        lineTemp = line;
        //while(lineTemp <= builder.lineNum){
            var intersection = false;
            
            //Check intersection in the line below
            if(this.checkIntersection(lineTemp+1)){
                this.resolveIntersection(lineTemp+1);
                intersection = true;
            }
            
            for(var i = 0; i < this.modules.length ; i++){
                if(this.modules[i].line == lineTemp)
                    this.modules[i].changeLine( lineTemp+1 );
            }
            
            if(!intersection)
                return;
            
            //lineTemp++;
        //}
    },
    
    //check if position is hitting a placeholder
    hittedPlaceholder: function (line, column){
        for(var i = 0; i < this.modules.length ; i++)
            if(this.modules[i].type == "placeholder" && this.modules[i].line == line && (column >= this.modules[i].column  && column < this.modules[i].column + this.modules[i].size  ))
                return i;
        return -1;
    },

    //Menu on scroll
    onScroll : function(){
        var scrollTop = $(window).scrollTop();
        
        this.menuFromTop = this.$pageBuilderTab.offset().top;
        var maxTop = this.menuFromTop+this.$pageBuilderTab.height()-this.menuFromTop;
        var to = scrollTop-this.menuFromTop+this.menuOffTop;
        
        if(to < maxTop){
            if(scrollTop>(this.menuFromTop-this.menuOffTop)){
                this.$pageBuilderMenu.css({
                    "top":scrollTop-this.menuFromTop+this.menuOffTop+"px"
                });
            }
            else{
                this.$pageBuilderMenu.css({
                    "top":0+"px"
                });
            }
        }
    },


    clearAllClick: function(){
        //Load page template
        this.clear_all_lightbox = new Lightbox('Confirm Clear All', builderPath, $.proxy(this.clearAll, this), 500, "No", "Yes, I'm sure!");
        this.clear_all_lightbox.addContent("<p>Are you sure you want to clear all modules and placeholders on this page? This action doesn't have undo!</p>");

        return false;
    },
    
    //Clear all modules
    clearAll: function (){
        for(var i = 0; i< this.modules.length ; i++){
            this.modules[i].removeQuick();
        }

        this.modules = new Array();
        
        //Update modules serial
        for(var a = 0; a < this.lines.length ; a++)
            this.lines[a].modules = new Array();

        this.correctGrid();
        this.checkNumLines();

        if(this.clear_all_lightbox !== undefined){
            this.clear_all_lightbox.closeEdit();
            this.clear_all_lightbox = undefined;
        }
        return false;
    },
    
    //On current line over change
    currentOverLine: function(e, num){
        this.lineOver = num;
        return false;
    },
    
     //Add new line
    addLine: function () {

        var line = new Line.newLine(this.$linesHolder, this.lines.length, this.$baseLine);
        
        var $left = $("<a href='#' class='snap_button to_left' data-snap='"+this.lines.length+"'></a>").appendTo(this.$view).click(this.snap_click);
        var $right = $("<a href='#' class='snap_button to_right' data-snap='"+this.lines.length+"'></a>").appendTo(this.$view).click(this.snap_click);
        new Tooltip($left, "Snap row to the left", builderPath);
        new Tooltip($right, "Snap row to the right", builderPath);

        var $bottom = $("<a href='#' class='snap_button vertical' data-snap='"+this.lines.length+"'></a>").appendTo( line.baseline ).click(this.snap_click);
        new Tooltip($bottom, "No margin between these 2 rows", builderPath);

        $(line).bind("overThis", $.proxy(this.currentOverLine, this));
        
        this.lines.push(line);
        this.linesSnaps.push($left.add($right));
        this.bottomSnaps.push($bottom);

        this.correctGrid();
    },

    snap_click: function(){
        var $this = $(this);

        if($this.hasClass("active"))
            $this.removeClass("active");
        else
            $this.addClass("active");

        return false;
    },
    
    //Remove a line
    removeLine: function (){
        
    },
    
    //Correct grid
    correctGrid: function(){
        
        //Check grid consistency
        $.each(
            this.lines,
            $.proxy(
                function(index, line){
                    //Organize line
                    var excedentModules = line.organize();
                    
                    //Add excedent modules to next line
                    if(excedentModules && excedentModules.length > 0){
                        //if line above
                        if(index != 0 && this.lines[index-1].isEmpty()){
                            this.lines[index-1].pushModules( excedentModules );
                            this.lines[index-1].organize();
                        }
                        else
                            this.lines[index+1].pushModules( excedentModules );
                    }

                    var snapsTop = line.getOffsetY() - this.$view.offset().top + line.holder.height()/2 - 13;
                    this.linesSnaps[index].css("top", snapsTop+"px");

                    if(index == this.lines.length - 1 || line.isEmpty() || this.lines[index+1].isEmpty() ){
                        this.bottomSnaps[index].hide();
                    }
                    else
                        this.bottomSnaps[index].show();

                    if(line.isEmpty()){
                        this.linesSnaps[index].hide();
                    }
                    else{ 
                        if(line.getModulesInColumn(0).length == 0)
                            this.linesSnaps[index].eq(0).hide();
                        else
                            this.linesSnaps[index].eq(0).show();

                        if(line.hasColumnInEnd())
                            this.linesSnaps[index].eq(1).show();
                        else
                            this.linesSnaps[index].eq(1).hide();

                    }
                }
                ,this
            )
        );
        
        //Clear blank lines
        this.clearBlankLines();
        
        //Check available lines number
        this.checkNumLines();
    },
    
    //Clears Blank Rows
    clearBlankLines: function (){
        for(var i = 0; i< this.lines.length ; i++)
            if(this.lines[i].isEmpty())
                this.pushAllTop(i+1);
            
    },
    
    //push all modules up from a linne down (Revised)
    pushAllTop: function (line){
        if(line == 0)
            return ;
            
        for(var i = line; i < this.lines.length ; i++){
            var mods = this.lines[i].popModules();
            this.lines[i-1].pushModules(mods);
            this.lines[i-1].organize();
            this.lines[i].organize();
        }
    },

    //checks the number of empty lines in the grid
    checkNumLines: function(){
        var num = 0;
        
        $.each(
            this.lines,
            function(index, line){
                if(line.isEmpty())
                    num++;
            }
        );
        
        if(num <= 1){
            var number = this.addLine();  
            return;
        }
        
        while(num > 2){
            this.removeLine();
            num--;
        }
    },
    
    //returns number of empty lines in the grid
    getNumberEmptyLines: function(){
        var max = 0;
        for(var i = 0; i < this.modules.length; i++){
            if(this.modules[i].line>max)
                max = this.modules[i].line;
        }
        
        return gridLines.length - (max+1);
    },
    
    //Get position in grid (Revised)
    getGridPos : function(posX, posY){
        
        //RELATIVE POSITIONS
        var off = this.$linesHolder.offset();
        var posX = posX - off.left;
        
        //Column
        var width = this.$linesHolder.width();
        var perc = posX / width;
        var column = Math.round(12*perc);
        if(column < 0)
            column = 0;
        else if(column > 10)
            column = 10;
            
        //Line
        var line = this.lines.length-1;
        for(var i=1 ; i<this.lines.length; i++){
            if(posY < this.lines[i].getOffsetY()){
                line = i-1;
                break;
            }
        }
        
        return {"column":column, "line":line};
    },
    
    //Get grid priority row (Revised)
    getPriorityRow: function(){
        var line = 0;
        var column = 0;
        
        var priorityRow = new Array();
        var mods = this.getModulesFromLine(line);
        var blankSpaceLeft = 0;
        var blankSpaceAbove = 0;
        
        //GET PRIORITY ROW OF MODULES
        do{
            var modsHitting = this.getModulesHittingPos(column, line);
            
            if(modsHitting.length != 0){
                if(modsHitting.length==1){
                    //hitted only one module
                    
                    if(modsHitting[0] == this.moduleDragging){
                        addIfDoesnExist(modsHitting[0], priorityRow);
                    }
                    else{
                        //if doesnt collide with dragging add it
                        var dragCollideAt = this.modCollidesWithDrag(modsHitting[0]);
                        
                        if(dragCollideAt == -1)
                            //doesnt collide
                            addIfDoesnExist(modsHitting[0], priorityRow);
                        else{
                            var modSize = this.modules[modsHitting[0]].size;
                            //check if blank space enough
                            if(blankSpaceAbove >= modSize){
                                //space above
                                addIfDoesnExist(modsHitting[0], priorityRow);
                                blankSpaceAbove -= modSize;
                            }
                            else if(blankSpaceLeft >= modSize - dragCollideAt){
                                //space left
                                addIfDoesnExist(modsHitting[0], priorityRow);
                                blankSpaceLeft -= (modSize - dragCollideAt);
                            }
                            else{
                                //dragging must be first
                                addIfDoesnExist(this.moduleDragging, priorityRow);
                                addIfDoesnExist(modsHitting[0], priorityRow);
                            }
                            
                        }
                    }
                    
                }
                else{
                    //Collision between 2 or more modules
                    var priority = 0;
                    var counter = 0;
                    while(modsHitting.length != 0){
                        //get one with highest priority
                        var num = this.getHighestPriority(modsHitting);
                        
                        var numberToAdd = modsHitting[num];
                        
                        //remove it from the array
                        modsHitting = removePositionInArray(modsHitting, num);
                        
                        if(numberToAdd == this.moduleDragging)
                            if(modsHitting.length > 0){
                                //might have space to the left for another component
                                num = this.getHighestPriority(modsHitting);
                                
                                var modSize = this.modules[modsHitting[num]].size;
                                //check if blank space enough
                                if(blankSpaceAbove >= modSize){
                                    //space above
                                    addIfDoesnExist(modsHitting[num], priorityRow);
                                    modsHitting = removePositionInArray(modsHitting, num);
                                    blankSpaceAbove -= modSize;
                                }
                                else if(blankSpaceLeft >= modSize){
                                    //space left
                                    addIfDoesnExist(modsHitting[num], priorityRow);
                                    modsHitting = removePositionInArray(modsHitting, num);
                                    blankSpaceLeft -= modSize;
                                }
                            }
                        
                        addIfDoesnExist(numberToAdd, priorityRow);
                    }
                }
                
                blankSpaceLeft = 0;
            }
            else
                blankSpaceLeft++;
            
            
            
            //Change to next pos
            column ++;
            if(column == 12){
                column = 0;
                line ++;
                mods = this.getModulesFromLine(line);
                
                blankSpaceAbove = blankSpaceLeft;
                blankSpaceLeft = 0;
            }
        }while(priorityRow.length != this.modules.length);
        
        return priorityRow;
    },
    
    //Return Highest Priority Module in the parameter array position (Revised)
    getHighestPriority: function (mods){
        //Check if any is dragging
        for(var i=0; i<mods.length ; i++)
            if(mods[i] == this.moduleDragging)
                return i;
        
        //Check which one comes first
        var minColumn = 20;
        var whichOne = -1;
        for(var i=0; i < mods.length ; i++)
            if(this.modules[mods[i]].column < minColumn){
                minColumn = this.modules[mods[i]].column;
                whichOne = i;
            }
        
        return whichOne;
    },
    
    //Check if module collides with the one dragging (Revised)
    modCollidesWithDrag: function (modId){
        if(this.moduleDragging == -1)
            return -1;
        
        var modDrag = this.modules[this.moduleDragging];
        var mod = this.modules[modId];   
        if(modDrag.line == mod.line && modDrag.column >= mod.column && modDrag.column < mod.column + mod.size)
            return modDrag.column - mod.column;
        
        return -1;
    },
    
    //Get all modules from a line (Revised)
    getModulesFromLine: function (line){
        var mods = new Array();
        $.each(
            this.modules,
            function(index, module){
                if(module.line == line)
                    mods.push(module);
            }
        );
            
        return mods;        
    },
    
    //Return array of modules numbers (Revised)
    getModulesHittingPos: function (column, line){
        var modsHitting = new Array();
        
        $.each(
            this.modules,
            function(index, module){
                if(module.line == line && module.column == column)
                    modsHitting.push(index);
            }
        );
        
        return modsHitting;
    }
}

module.exports = PageBuilder;


},{"../Lightbox/Lightbox.js":1,"../libraries/inheritance.js":8,"../libraries/jquery.mobile.vmouse.js":9,"./Line.js":2,"./Module.js":3,"./ModuleButton.js":4,"./Tooltip.js":7}],6:[function(require,module,exports){
var $ = jQuery;

require("../libraries/jquery.mobile.vmouse.js");
require("../libraries/inheritance.js");

var Lightbox = require("../Lightbox/Lightbox.js");
var ModuleButton = require("./ModuleButton.js");
var Module = require("./Module.js");
var Line = require("./Line.js");
require("./Tooltip.js");

//Shortcodes info
var shortcodes;


var StackBuilder = function($input, $placeholdersHolder, $menuHolder, multiple, buildPath, _shortcodes, rowShortcode){
	shortcodes = _shortcodes;
	builderPath = buildPath;
	$body = $("body");

    if(rowShortcode == null)
        rowShortcode = undefined;
	
    //Modules
    this.modules = new Array();
    this.lineNum = 0;
	this.parsingFromHtml = false;
    
    this.$input = $input;
    this.multiple = multiple;
    this.rowShortcode = rowShortcode;
    this.$placeholdersHolder = $placeholdersHolder;
    this.$menuHolder = $menuHolder;
    
    this.build();
    this.moduleDragging = -1;
    
    $(window).resize($.proxy(this.onResize, this));
        
    //$("#post").submit( $.proxy(this.makeHtml, this) );
    this.fromHtml();
    
    this.menuFromTop = this.$pageBuilderMenu.offset().top;
    this.menuOffTop = $("#wpbody").offset().top;
    $(window).scroll( $.proxy(this.onScroll, this) );
}

StackBuilder.prototype = {
    //Build page builder grid
    build: function(){
        //Page Builder Menu
        this.$pageBuilderMenu = $("<div class='menu'></div>").appendTo(this.$menuHolder);

        ///////////////place holder button
        if(this.multiple){
            var $addPlaceholder = $("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);
            var $addPlaceholderButton = $("<a href='#'>Add new placeholder</a>").appendTo($addPlaceholder);
            $addPlaceholderButton.processIcon(builderPath+"images/page_builder/MainMenu/placeholder_icon.png");
            
            $addPlaceholderButton.click($.proxy(this.createPlaceholder, this));
        }

        ///////////////add module button
        var $addModule = $("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);
        var $addModuleButton = $("<a href='#'>Add new module</a>").appendTo($addModule);
        $addModuleButton.processIcon(builderPath+"images/page_builder/MainMenu/add_icon.png");
        
        
        //MODULES MENU
        var $modulesMenu = $("<div class='menu-dropdown' id='modulesDrop' style='"+(this.multiple?"":"left: -1px;")+"'></div>").appendTo($addModule);
        
        $addModule.hover(function() {
            $modulesMenu.stop().css("display", "block").fadeTo(200, 1);
        }, function() {
            $modulesMenu.stop().fadeTo(200, 0, function(){$(this).css("display", "none")});
        });
        
        //Custom Column
        var $customColumnText = $("<p class='title_menu' style='margin-top:0;'>Shortcodes</p>").appendTo($modulesMenu);
        var $mainrow = $("<div class='row-fluid columns-wraper'></div>").appendTo($modulesMenu);
        
        //var $customColumns = $("<div class='row-fluid'></div>").appendTo($modulesCustomColumn);
        
        var $customColumn1 = $("<div class='span3 column'></div>").appendTo($mainrow);
        var $customColumn2 = $("<div class='span3 column'></div>").appendTo($mainrow);
        var $customColumn3 = $("<div class='span3 column'></div>").appendTo($mainrow);
        var $customColumn4 = $("<div class='span3 column'></div>").appendTo($mainrow);
        
        var componentsColumns = [$customColumn1, $customColumn2, $customColumn3, $customColumn4];
        
        //make buttons
	    var size = 0, key;
	    for (key in shortcodes) {
	        if (shortcodes.hasOwnProperty(key)) size++;
	    }

        var shortcodesPerColumn = Math.ceil(size/4);
        
        var counter = 0;
        var currentColumn = 0;
        $.each(
            shortcodes,
            $.proxy(function(index, obj){
                var moduleButton = new ModuleButton.ComponentButton( obj ); 
                componentsColumns[currentColumn].append( moduleButton.$obj );
                
                counter++;
                if(counter == shortcodesPerColumn){
                	counter = 0;
                	currentColumn++;
                }
                
                $(moduleButton).bind("moduleButtonDown", $.proxy(this.createComponent, this));
            }  , this)
        );
        
        //VIEW HOLDER
        this.$viewHolder = $("<div class='viewHolder'></div>").appendTo(this.$placeholdersHolder.parent());
        
    },
    
    //Clear All Modules
    clearAll: function(){
    	$.each(
    		this.modules,
    		function(index, module){
    			module.$obj.remove();
    		}
    	);
    	
    	this.modules = new Array();
    },
    
    parseComponents: function(columnContent, placeholder){
    	//GET COMPONENTS in COLUMNID content
    	var regexComponentInitialStr = "\\[.*?\\]";
    	var regexComponentInitial = new RegExp(regexComponentInitialStr, "gi");
        do{
        	 var matchedComponentInitial = columnContent.match(regexComponentInitial);
        	 
        	 if(matchedComponentInitial != null){
        	 	var str = matchedComponentInitial[0];
        	 	
        	 	var shortcodeStr = "";
        	 	var count = 1;
        	 	while(str.charAt(count) != ' ' && str.charAt(count) != ']'){
        	 		shortcodeStr += str.charAt(count);
        	 		count++;
        	 	}
        	 	
        	 	//Get all shortcode
        	 	var regexComponentStr = "\\["+shortcodeStr+".*?\\][\\s\\S]*?\\[\\/"+shortcodeStr+"\\]";
        		var regexComponent = new RegExp(regexComponentStr, "gi");
        
        		var matchedComponent = columnContent.match(regexComponent);
        		
        		if(matchedComponent != null){
        			matchedComponent = matchedComponent[0];
        			if(WP_DEBUG)console.log("Creating component with shortcode: "+shortcodeStr);
        			if(WP_DEBUG)console.log("Component: "+matchedComponent);
        			
        			//Shift columnContent
        			columnContent = columnContent.substring(matchedComponent.length);
        			if(WP_DEBUG)console.log("Rest: "+columnContent);
        			
        			//Update Info Parameters
                    /*var regexIPStr = "\\["+shortcodeStr+".*?\\]";
                    var regexIP = new RegExp(regexIPStr, "i");
                    var matchedIP = str.match(regexIP);
            
                    if(matchedIP == null){
                        if(WP_DEBUG)console.log("Page Builder: error reading shortcode parameters!");
                        return;
                    }*/
                    var matchedIP = str;
                    
                    
                    //Make component
                    var info = shortcodes[shortcodeStr];
                    var component = new Module.Component( info );
                    
                    function parseModule(obj){
                    	if(obj.associate != "content"){
                    		if(WP_DEBUG)console.log(obj.associate);
							var regexParStr = obj.associate+'=".*?"';
							var regexPar = new RegExp(regexParStr, "i");
							if(WP_DEBUG)console.log(matchedIP);
							var matchedPar = matchedIP.match(regexPar);
							
							if(matchedPar != null){
								matchedPar = matchedPar[0];
								
								//Cut what isn't needed
								if(matchedPar != null){
					    			var from = obj.associate.length+2;
					    			var to = matchedPar.length-1;
					    			var value = matchedPar.substring(from, to);
					    			if(WP_DEBUG)console.log(obj.associate+": "+value);
					            
					            	component.parameters[obj.id].value = value;
					        	}
							}
							
							return value;
				  		}  
				  		else{
				  			//Has content
                            var fromContent = matchedIP.length;
                            var toContent = matchedComponent.length - (shortcodeStr.length + 3);
                            var value
                            if((toContent-1)<=fromContent)
                            	value="";
                            else
                            	value = matchedComponent.substring(fromContent, toContent);
                            
                            if(WP_DEBUG)console.log("shortcode content:"+ value);
                            component.parameters[obj.id].value = value;
                            
							return value;
				  		}
                    }
                    $.each(
						info.options,
						function(index, obj){
							if(obj.type == "tabs" || obj.type == "tabs_unbinded"){
								if(obj.type == "tabs"){
									var tabSelected = parseModule(obj);
									
									//Make only the selected tab options
									$.each(
										obj.tabs[tabSelected],
										function(index1, subObj){
											parseModule(subObj);
									});
								}
								else{
									$.each(
										obj.tabs,
										function(index1, tab){
											$.each(
												tab,
												function(index1, subObj){
													parseModule(subObj);
											});
									});
								}
							}
							else{
								parseModule(obj);
							}
							
						}
                    );
                    
                    //Add to the targeted placeholder
                    placeholder.addComponent( component );
                    
                    //build module
                    component.build();
                    
                    //Bind module down
                    $(component).bind("moduleDown", $.proxy(this.componentDown, this));
                    $(component).bind("changed", $.proxy(this.makeHtml, this));
        		}
        	 }
        }while(matchedComponentInitial != null && columnContent.length > 1);
    	
    },
    
    //GET MODULES FROM HTML
    fromHtml: function(){
        var content = this.$input.val();
        
        this.clearAll();
        if(WP_DEBUG)console.log("\n\nCONTENT:"+content);
        
        var customRowing = false;
        if(this.rowShortcode != undefined)
        	customRowing = true;
        
        if(content != null && content != undefined && content != ""){
        	this.parsingFromHtml = true;
        	
            //GET ROWS
            if(!customRowing){
            	var regexStr = "\\[row\\][\\s\\S]*?\\[\\/row\\]";
                var regex = new RegExp(regexStr, "gi");
                
                var matched = content.match(regex);
                //Iterate rows
                if(matched != null){
                    
                    //for each row
                    for(var rowId = 0; rowId < matched.length ; rowId ++){
                        if(WP_DEBUG)console.log("ROW:"+matched[rowId]);
                        //Process row
                        
                        //GET COLUMNS IN ROWID
                        var regexColumnsStr = "\\[column.*?\\][\\s\\S]*?\\[\\/column\\]";
                        var regexColumns = new RegExp(regexColumnsStr, "gi");
                        
                        var matchedColumns = matched[rowId].match(regexColumns);
                        
                        //Iterate columns in rowId
                        if(matchedColumns != null){
                            
                            //for each column in rowId
                            var column = 0;
                            for(var columnId = 0; columnId < matchedColumns.length ; columnId ++){
                                if(WP_DEBUG)console.log("COLUMN:"+matchedColumns[columnId]);
                                //Get column parameters part
                                var regexColumnParametersStr = "\\[column.*?\\]";
                                var regexColumnParameters = new RegExp(regexColumnParametersStr, "gi");
                                
                                var matchedParameters = matchedColumns[columnId].match(regexColumnParameters);
                                
                                if(matchedParameters == null){
                                    if(WP_DEBUG)console.log("Page Builder error");
                                    return;
                                }
                                
                                //Make placeholder
                                this.createPlaceholder(null);
                                var placeholder = this.modules[this.modules.length-1];
                                
                                //GET COLUMNID content string
                                var columnContent = matchedColumns[columnId].substring(matchedParameters[0].length, matchedColumns[columnId].length-9);
                                if(WP_DEBUG)console.log("column content: "+columnContent);
                                
                                this.parseComponents(columnContent, placeholder);
                           }
                        }
                    }
                }
            }
            else{
            	//GET COLUMNS IN ROWID
                var regexColumnsStr = "\\["+this.rowShortcode+".*?\\][\\s\\S]*?\\[\\/"+this.rowShortcode+"\\]";
                var regexColumns = new RegExp(regexColumnsStr, "gi");
                
                var matchedColumns = content.match(regexColumns);
                
                //Iterate columns in rowId
                if(matchedColumns != null){
                    
                    //for each column in rowId
                    var column = 0;
                    for(var columnId = 0; columnId < matchedColumns.length ; columnId ++){
                        if(WP_DEBUG)console.log(this.rowShortcode+":"+matchedColumns[columnId]);
                        //Get column parameters part
                        var regexColumnParametersStr = "\\["+this.rowShortcode+".*?\\]";
                        var regexColumnParameters = new RegExp(regexColumnParametersStr, "gi");
                        
                        var matchedParameters = matchedColumns[columnId].match(regexColumnParameters);
                        
                        if(matchedParameters == null){
                            if(WP_DEBUG)console.log("Page Builder error");
                            return;
                        }
                        
                        //Make placeholder
                        this.createPlaceholder(null);
                        var placeholder = this.modules[this.modules.length-1];
                        
                        //GET COLUMNID content string
                        var columnContent = matchedColumns[columnId].substring(matchedParameters[0].length, matchedColumns[columnId].length-9-(this.rowShortcode.length-6));
                        if(WP_DEBUG)console.log(this.rowShortcode+" content: "+columnContent);
                        
                        this.parseComponents(columnContent, placeholder);
                   }
                }
            	
            }
            
            
        	this.parsingFromHtml = false;
        }
           
    
        if(this.modules.length == 0)
        	this.createPlaceholder();
    },
    
    //GET HTML FROM MODULES
    makeHtml: function () {
        // Shortcodes
        // [page_builder_column][/page_builder_column]
        if(this.parsingFromHtml)
        	return;
        
        var content = "";
        	
    		
        for(var i= 0; i< this.modules.length ; i++){
        	var placeholder = this.modules[i];
        	
        	if(this.rowShortcode != undefined)
        		content += "["+this.rowShortcode+"]";
        	else
            //Start placeholder
            content += "[row]";
            
            //Get placeholder val
            content += placeholder.getHtml(0, this.rowShortcode == undefined);
            
        	if(this.rowShortcode != undefined)
        		content += "[/"+this.rowShortcode+"]";
        	else
            //End row
            content += "[/row]";
            
        }
        
        //alert(content);
        this.$input.val(content).trigger("change");
        if(WP_DEBUG)console.log(content);
        
        return true;
    },
    
    
    
    //Component Initial Create
    createComponent: function(e, shortcode){
        
        //Create Module
        this.module = new Module.Component( shortcodes[shortcode], this.$viewHolder );
        
        this.type = "module";
        this.targetPlaceholder = -1;
        
        for(var i = 1; i < this.modules.length; i++)
    		this.modules[i].offsetTop = this.modules[i].$obj.offset().top;
    	
        
        //Mouse Events
        $(e.target).bind("moduleButtonMove", $.proxy(this.movingComponentInit, this));
        $(e.target).bind("moduleButtonUp", $.proxy(this.createModuleFinal, this));
    },
    
    //Process component moving
    processComponentMoving: function(hittedPlaceholder, color){
        if(hittedPlaceholder != -1){
            if(this.targetPlaceholder != hittedPlaceholder){
                //Above placeholder
                var placeholder = this.modules[hittedPlaceholder];
                
                //Cancel above on previous
                if(this.targetPlaceholder != -1)
                    this.modules[this.targetPlaceholder].cancelAbove();
                    
                //warn placeholder
                placeholder.componentAbove( color );
                
                this.targetPlaceholder = hittedPlaceholder;
            }
        }
        else{
            if(this.targetPlaceholder != -1)
                this.modules[this.targetPlaceholder].cancelAbove();
            
            this.targetPlaceholder = -1;
        }
    },
    
    //Component Initial on move
    movingComponentInit: function(e, newX, newY){
        //get grid pos
        var hittedPlaceholder = this.getGridPos(newY);
        
        this.processComponentMoving( hittedPlaceholder , e.target.info.color );
    },
    
    //Placeholder Initial Create
    createPlaceholder: function(e){
        //Create placeholder
        var placeholder = new Module.Placeholder(12, 0, this.modules.length, false);
        this.modules.push( placeholder );
        
        this.$placeholdersHolder.append(placeholder.$obj);
        placeholder.show();
        placeholder.$obj.css("margin-bottom", "5px");
        
        $(placeholder).bind("change", $.proxy(this.makeHtml, this));
        $(placeholder).bind("moduleDelete", $.proxy(this.placeholderDelete, this));
		$(placeholder).bind("moduleDuplicateInsert", $.proxy(this.duplicateInsertGrid, this));
        this.makeHtml();
        
        //trigger event
        $(this).trigger("placeholderAdded", ["", this.modules.length]);
        
        return false;
    },
    
    //Create Module (both)
    createModuleFinal: function(e){
        //unbind
        $(e.target).unbind("moduleButtonMove");
        $(e.target).unbind("moduleButtonUp");
            
        if(this.targetPlaceholder != -1){
            //Valid position
            
            //Add to the targeted placeholder
            this.modules[this.targetPlaceholder].addComponent( this.module );
            
            //build module
            this.module.build();
            
            //Bind module down
            $(this.module).bind("moduleDown", $.proxy(this.componentDown, this));
            $(this.module).bind("changed", $.proxy(this.makeHtml, this));
            $(this.module).bind("moduleDelete", $.proxy(this.makeHtml, this));
            
            this.makeHtml();
        }
        
        return false;
    },
    
    
    
    
    //Bind a duplicated module
    duplicateInsertGrid: function(e, comp){
        //Bind module down
        $(comp).bind("moduleDown", $.proxy(this.componentDown, this));
        $(comp).bind("changed", $.proxy(this.makeHtml, this));
        $('html, body').animate({"scrollTop":comp.$obj.offset().top+"px"}, 300);
    } ,
    
    
    
    //ALREADY CREATED MODULES EVENTS
    //Placeholder delete
    placeholderDelete: function(e, number){
        //Remove from line
        this.modules[number].$obj.remove();
        
        //Remove from array
        this.modules = removePositionInArray(this.modules, number);
        
        //Update modules serial
        for(var a = 0; a < this.modules.length ; a++)
            this.modules[a].number = a;

		//Must always have at least one placeholder
        if(this.modules.length == 0)
        	this.createPlaceholder();

        this.makeHtml();
        
        //trigger event
        $(this).trigger("placeholderRemoved", number);
        
        return false;
    },
    
    //Component down
    componentDown: function(e){
        if(WP_DEBUG)console.log("componentDown");
        
        this.targetPlaceholder = e.target.placeholder;
        
        //Placeholder Events
        $(e.target).bind("moduleMove", $.proxy(this.movingComponent, this));
        $(e.target).bind("moduleUp"  , $.proxy(this.placeComponent, this));
        
        return false;
    },
    
    //Component On Move 
    movingComponent: function(e, newX, newY){
        var component = e.target;
        
        //get grid pos
        var hittedPlaceholder = this.getGridPos(newY);
        
        //The component current placeholder
        var componentPlaceholder = component.placeholder;
        
        if(hittedPlaceholder != componentPlaceholder){
            //Different placeholder
            this.processComponentMoving(hittedPlaceholder, component.info.color );
        }
        else{
            //Same placeholder
            this.modules[component.placeholder].movingComponent(newY, component.number);
            
            if(this.targetPlaceholder != component.placeholder)
                this.modules[this.targetPlaceholder].cancelAbove();
            
            this.targetPlaceholder = component.placeholder;
        }
        
        
        return false;
    },
    
    //Component Place 
    placeComponent: function(e){
        $(e.target).unbind("moduleMove");
        $(e.target).unbind("moduleUp");
        
        var placeholder = e.target.placeholder;
        
        if(this.targetPlaceholder != -1 && this.targetPlaceholder != placeholder){
            //Add to different placeholder
            
            //remove from current one
            this.modules[placeholder].removeComponent(e.target.number);
            
            //add to new placeholder
            this.modules[this.targetPlaceholder].addComponent(e.target);
        }
        
        this.makeHtml();
        
        return false;
    },
    

    //Menu on scroll
    onScroll : function(){
        var scrollTop = $(window).scrollTop();
        
        this.menuFromTop = this.$menuHolder.offset().top;
        
        if(scrollTop>(this.menuFromTop-this.menuOffTop)){
            this.$pageBuilderMenu.css({
                "top":scrollTop-this.menuFromTop+this.menuOffTop+"px"
            });
        }
        else{
            this.$pageBuilderMenu.css({
                "top":0+"px"
            });
        }
    },
    
    //On current line over change
    currentOverLine: function(e, num){
        this.lineOver = num;
        return false;
    },
    
    //Get position in grid (Revised)
    getGridPos : function(posTop){
    	var line = -1;

    	for(var i = this.modules.length-1; i > 0; i--){
    		if(posTop > this.modules[i].offsetTop){
                line = i;
                break;
            }
    	}

    	if(line == -1)
    		line = 0;
    	
        return line;
    }
}

module.exports = StackBuilder;


},{"../Lightbox/Lightbox.js":1,"../libraries/inheritance.js":8,"../libraries/jquery.mobile.vmouse.js":9,"./Line.js":2,"./Module.js":3,"./ModuleButton.js":4,"./Tooltip.js":7}],7:[function(require,module,exports){


//TOOLTIP OBJECT
Tooltip = function(obj, text, builderPath) {
	this.tooltipFadeTime = 300;
	
	this.$tooltip = $("<div>"+text+"</div>").css({
		"-moz-font-feature-settings": "normal",
		"-moz-font-language-override": "normal",
		"display": "inline-block",
		"pointer-events": "none",
		"position": "absolute",
		"text-align": "center",
		"text-decoration": "none",
		"padding": "2px 5px",
		"padding-top":"3px",
		"z-index" : "2",
		"background-image":"url("+builderPath+"images/page_builder/General/tile.png)",
		"border":"solid 1px #767676"
	}).appendTo($('body'));
	
	this.$tooltip.processFont("AllerRegular", "#000000", 12);
	this.$tooltip.addRoundCorners(3);
	
	this.$obj = obj; 
	
    this.$tooltip.stop().fadeTo(0, 0);  
    
    this.$obj.bind(mouseOverBind, $.proxy(this.over, this));
    this.$obj.bind(mouseOutBind, $.proxy(this.out, this));
};
Tooltip.prototype = {
    rebind:function(){
        this.$obj.unbind(mouseOverBind);
        this.$obj.unbind(mouseOutBind);
        this.$obj.bind(mouseOverBind, $.proxy(this.over, this));
        this.$obj.bind(mouseOutBind, $.proxy(this.out, this));
        
        this.out();
    },
	updateTooltipPosition : function(e) {
		var linkPositionX = e.pageX;
		var linkPositionY = e.pageY;
	    
	    var top = linkPositionY + parseInt(this.$tooltip.height(), 10) + 5;
	    var left = linkPositionX + 10;
	    
	    this.$tooltip.css({
	        "top": top,
	        "left": left
	    });
	},
	over: function(e){
        if( !this.$obj.hasClass("disabled") ){
            this.updateTooltipPosition(e);
            this.$tooltip.stop().fadeTo(this.tooltipFadeTime, 1);  
            
            //MOUSE MOVE BIND
			$(document).bind(mouseMoveBind, $.proxy(this.move, this));
        }    
	},
	out: function(){
		$(document).unbind(mouseMoveBind, $.proxy(this.move, this));
		
		this.$tooltip.stop().fadeTo(this.tooltipFadeTime, 0);  
	},
	move: function(e){
        this.updateTooltipPosition(e);
		
		return false;
	},
	remove: function(){
		this.$tooltip.remove();
	}
};
},{}],8:[function(require,module,exports){
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();
},{}],9:[function(require,module,exports){
/* Obfuscate your JavaScript at http://jscrambler.com */eval((function(t4){for(var u4="",v4=0,w4=function(t4,x4){for(var y4=0,z4=0;z4<x4;z4++){y4*=96;var A4=t4.charCodeAt(z4);if(A4>=32&&A4<=127){y4+=A4-32}}return y4};v4<t4.length;){if(t4.charAt(v4)!="`")u4+=t4.charAt(v4++);else{if(t4.charAt(v4+1)!="`"){var B4=w4(t4.charAt(v4+3),1)+5;u4+=u4.substr(u4.length-w4(t4.substr(v4+1,2),2)-B4,B4);v4+=4}else{u4+="`";v4+=2}}}return u4})("(function (n,l,o,s){var D=\"vmousecancel\",A=true,E=false,F=\"virtualMouseBindings\",J` 0$TouchID\",X` d#over ` q!down` $\"move` \/\"up vclick` ?\"out` I\"`!@\".split(\" \"),Y=\"clientX ` \"!Y pageX pageY screenX ` \"!Y` N(T=n.event.`\"? Hooks?n` \",.props:[],O` H$` . .concat(T),G={},u=0,v=0,U=0,w=E,Q=[],I=E,N=E,P=\"addEventListener\" in o,R=n(o),t1=1,d0=0,r0;n.`#r!={moveDistanceThreshold:10,`\"} ` %0resetTimerDuration:1500};`$}$a0(a){while (a&&typeof a.original`!c !==\"undefined\"){a=` 2*;}return a;}`%y$Y0(a,b`%z!c=a.type,d,f,g,h,i,j,k,m,q;a=n.`\"i (a);` @!=b;d` r,f`#f);if (c.search(\/^(`&z |`%j )\/)>-1){f=O;}if (d){for (k=f.length,h;k;){h=f[--k];a[h]=d[h];}` M ` p%`\'r (down|up)` {!` { &&!a.which){` \"\"=1`!*!`!M&touch\/)!==-1){g=a0(d);c=g.` 5 es;i=g.changed`(? es;j=(c&&c`!e\")?c[0]:((i&&i` +$i[0]:s)`\"c j`\"9\"m=0,q=Y`\"=\";m<q;m++){h=Y[m`\">\"j`\"?!`$>\/s`%I var b={},c,d;`%S#){c=n.data(a,F);`#J d in c){`$& [d]){b[d]=b.hasV`*P!Binding=A;}}a=a.parentNode`%k$b`%i&X`%h\'`!$4`%6 &&(!b||c[b])){`&V%` o2null`&r&B(){N=E`\'$&r` - A`\'6&P0(){d0=0;Q`%o\"=0;I=E;r()`\']&Q0(){B` &(u0(){t0();u=`)<\"out(`).$(){u=0;P0();},`*<#.`)^-` |\'t0(`#e!u){clear` o#u);u=0;}`)1%S(a,b,c`)6!d`(F `&, [a])||(!c&&X0(b.target,a))){d=Y0(b,a);n` 1$).trigger(d)`*;$d`*9&C`%g&`%W#` n#J`&v!!I&&(!d0||d0!==b)`$w\"=S(\"v\"+`*L!,a`$o\"`&&\".isDefaultPr`*P ed()){a.p` )!` 6\"()`)(#isPropag`#1 Stopp` J#stop` 1&` G\'Immediate` @7` 1\/();}}`#e&i`(N&a0(a)`*5#`(_ if (b&&b`%}#==1){c=`#!#;d=s0(c`*$!d`(J-`&_ t1++;`):\"c,J,d0);`&< Q0();w=E;var f`!0)[0];v=f.pageX;U` #\"Y;S(\"`&L!over\",a,d)` *%down` -\"`\"7\'o`%% if (N`)%$`#w!!w){S(D,a,s0`%5$));}w=A;u`\'^ `*7$h` Q0`#&.[0],c=w,d=`(5$moveDistanceThreshold,f=`!*\';w=w||(Math.abs(b`\"V!-v)>d||` (*Y-U)>d`\' !w&&!c`\" #f);}`\"{$move\"` \/!`!~*D`\"^0r()`$\' b`!L(,c`#l%up\",a,b`(8\"w`)_\"`(+ click` 3&d&&d`\'u2c`&C\"changedT`%)%Q.push({`&_ ID:d0,x:c.clientX,y` #$Y});I=A;}`\"D%out`!V\"w=E`$N+v`*;.,F),c`\']!){for (c in b`*#!b[c]`%f$A;}}}`%t\"E`%J&R0(){`(c%Z0(f`(g!g=\"`(c start\",h=f.substr(1);`&]\"{setup:`)B$(a,`!5\"!v0(this)){`(R\"this,F,{})`&N!c`!~#` 3!);c[f]=A;G[f]=(G[f]||0)+1`)} ` 0 `)v R.bind(h,C0);}n` !` ,#R0`*#!P){G[g` b g` Y)g` Y)g,i0` W\"`\"H!end\",D` &)`&_!h` @$scroll\",o0`)a ,teardown`\"X+--G[f]`&C!G[f]){R.un`!s\'`!e\"--G[g` @$g` =\'`![!` O\"`!?+` *(`!q$` E#`!Y)`#l\"`$\/!`*5 `#p(`\'k ){d[f]=E;}c`!_%`#L#`$g&c.r`)U Data(F`\"` ;}`&Z var p0=0;p0<X.length;p0++){n.`([ .special[X[p0]]=Z0(` % `\"d%o.addEventListener(\"`)T\"`&>&`(##Q` \",c=`*H#,d,f,g,h,i,j`(5#d=a`)<#;f` #$Y;r0=n.`)8!.`*[ DistanceThreshold;g=c;while (g`(\"h=0;h<b;h++){i=Q[h];j=0`)E (g===c&&Math.abs(i.x-d)<r0` \'(y-f)<r0)||`*&\"g,J)===i.`)1 ID){a.pr`#\/ Default();a.stopPropagation(`)C$;}}g=g.parentNode`&w A);}})(jQuery,window,document);"));

},{}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
var $ = jQuery;

var Accordion = function ($this, pathToElem){
	this.closed = pathToElem+"accordion_closed.png";
	this.opened = pathToElem+"accordion_opened.png";
	
	$this.css({
		"display":"block",
		"width":"100%",
		"position":"relative"
	});

	this.$ul = $("<ul></ul>").appendTo($this);
}

Accordion.prototype = {
	add: function(headline, $content, opened){
		var $li = $("<li></li>").css({
			"position":"relative",
			"overflow":"hidden"
		}).appendTo(this.$ul);
		
		
		//HEADLINE
		var $head = $("<a href='#'></a>").appendTo($li).css({
			"text-decoration":"none",
			"display":"block", 
			"margin-bottom":"5px",
			"overflow":"hidden"
		});
		
		var $headline = $("<div><img src='"+this.closed+"' style='width:19px; height:19px; margin-right:10px; position:relative; top:4px;'/>"+headline+"</div>").css({
			"background-color":"#ffffff",
			"float":"left",
			"padding-right":"14px"
		}).appendTo($head);
		$headline.processFont('AllerBold', "#111111", 13);
		
		$("<div></div>").css({
			"border-bottom":"1px solid #E6E6E6",
			"height":"13px"
		}).appendTo($head);
		
		$content.appendTo($li).css({
			"margin-bottom":"10px",
			"margin-top":"10px"
		});
		
		if(!opened)
			$content.css("display", "none");
			
		var $img = $("img", $headline);

		$head.click($.proxy(function(e){
			e.preventDefault();
			
			$content.not(':animated').slideToggle(150, $.proxy(function(){
				if ($content.is(':hidden'))
			    	$img.attr("src", this.closed);
				else 
			    	$img.attr("src", this.opened);
				
				return false;
			}, this));
			
			if ($content.is(':hidden'))
		    	$img.attr("src", this.closed);
			else 
		    	$img.attr("src", this.opened);
			
			return false;
	    }, this));
	}
}

module.exports = Accordion;

},{}],12:[function(require,module,exports){
var $ = jQuery;

var Alert = function ($this, pathToElem, text, hideable){
	this.pathToElem = pathToElem;
	this.$this = $this;
	
	if(hideable == undefined)
	   hideable = true;
	
	$this.css({
		"position":"relative",
		"display":"block",
		"overflow":"hidden",
		"background-color":"#FBFAA6",
		"margin-bottom":"20px"
	});
	
	//icon
	$("<div><img src='"+pathToElem+"information_icon.png' alt='info' style='top:1px;'/></div>").css({
		"padding":"0px 2px",
		"background-color":"#F7E088",
		"float":"left"
	}).appendTo($this);

	$this.processFont('AllerRegular', "#011111", 12);
	
	$("<div>"+text+"</div>").css({
		"padding":"12px 15px",
		"float":"left"
	}).appendTo($this);
	
	if(hideable)
    	$("<a href='#'></div>").css({
    		"float":"right",
    		"background-image":"url("+pathToElem+"lightbox_close.png)",
    		"background-repeat":"no-repeat",
    		"position":"relative",
    		"top":"15px",
    		"padding":"0px 10px",
    		"width":"9px",
    		"height":"9px"
    	}).appendTo($this).click($.proxy(this.close, this));
}

Alert.prototype = {
	close: function(){
		var height = this.$this.height();
		this.$this.css("height", height+"px").animate({
			"height":"0px",
			"margin-bottom":"0px"
		}, 150, function(){
			$(this).css("display", "none");
		});
		
		return false;
	}
}
	
module.exports = Alert;
},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
var $ = jQuery;

var ColorPicker = function ($this, active, id){
	this.active = active;
	this.opened = false;
	
	this.h = 90;
	this.s = 100;
	this.v = 50;
	
	this.id = id;
	
	this.$obj = $this;

	//Large Menu
	this.$largeMenu = $('<div class="largeMenu"></div>').appendTo($this);
	
	this.$color_circle = $('<div class="color_circle"></div>').appendTo(this.$largeMenu).click($.proxy(this.circlePickerClicked, this));
	
	this.$circle_picker = $('<div class="circle_picker"></div>').appendTo(this.$color_circle);
	
	this.$color_triangle = $('<div class="color_triangle"></div>').appendTo(this.$largeMenu).click($.proxy(this.circlePickerClicked, this));
	
	this.$triangle_overlap = $('<div class="triangle_overlap"></div>').appendTo(this.$color_triangle).click($.proxy(this.triangleClick, this));
	
	this.$triangle_picker = $('<a class="triangle_picker" onClick="return false;"></a>').appendTo(this.$triangle_overlap);

	
	//Small Menu
	this.$smallMenu = $('<div class="smallMenu"></div>').appendTo($this);
	
	this.$currentColor = $('<a class="currentColor" href="#" onClick="return false;"></a>').appendTo(this.$smallMenu).click($.proxy(this.click, this));
	
	this.$currentText = $('<input type="text" value="'+active+'" class="currentText"/>').appendTo(this.$smallMenu).blur($.proxy(this.changeAccordingToText, this));
	
	this.$currentOpenState =  $('<a href="#" class="currentOpenState" onClick="return false;"></a>').appendTo(this.$smallMenu).click($.proxy(this.click, this));
	
	//Circle picker
	preventDragDefault(this.$circle_picker);
	this.$circle_picker.bind(mouseDownBind, $.proxy(this.dragDownCircle, this));
	
	//Triangle picker
	preventDragDefault(this.$triangle_picker);
	this.$triangle_picker.bind(mouseDownBind, $.proxy(this.dragDownTriangle, this));
	
	if(this.id != undefined){
		//console.log(active+"/"+$("#"+this.id).val());
		//this.$currentText.val($("#"+this.id).val());
		$("#"+this.id).bind("update", $.proxy(this.onInputUpdate, this));
	}
	this.initial = true;
	
	this.update(false);
	this.changeAccordingToText();
	
}

ColorPicker.prototype = {
	circlePickerClicked: function(e){
		var offset = this.$color_circle.offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		
		var center_x = 53;
		var center_y = 53;
		var radius = 53;
		var radius1 = 40;
		
		//Check if it's between 
		var insideAro = (Math.pow((x-center_x), 2) + Math.pow((y - center_y), 2) < Math.pow(radius,2)) && 
						(Math.pow((x-center_x), 2) + Math.pow((y - center_y), 2) > Math.pow(radius1,2));
		
		if(insideAro){
			// get angle
			var difX = x-center_x;
			var difY =y-center_y; 
		
			var angle = Math.atan(Math.abs(difX)/ Math.abs(difY))*(180/Math.PI); // degrees
		
			if(difX >= 0){
				//to the right
				if(difY < 0)
					//1st quadrant
					this.h = angle;
				else
					//4th quadrant
					this.h = 180 - angle;
			}
			else{
				//to the left
				if(difY < 0)
					//2nd quadrant
					this.h = 360-angle;
				else
					//3rd quadrant
					this.h = 180+angle;
			}
			
			this.updatePickers();
		}
	},
	onInputUpdate: function(){
		var value = $("#"+this.id).val();

		this.$currentText.val(value);
		this.changeAccordingToText();
	},
	
	update: function(animate){
		var height = 0;
        var height1 = 0;
		var top = 0;
		var time = 0;
		var op = 1;
		
		if(this.opened){
			height = 147;
            height1 = 123;
			top = 123;
			op = 1;
		}
			
		if(animate)
			time = 150;
		
		this.$largeMenu.stop().animate({"height":height+"px", "opacity":op}, time);
		this.$smallMenu.stop().animate({"top":top+"px"}, time);
		this.$obj.stop().animate({"height":height1+28+"px"}, time);
	},
	updatePickers: function(){
		
		//CIRCLE
		var angleRad = (this.h-90)*(Math.PI/180);
		
		var circleTop = Math.round(53 + Math.sin(angleRad) * 47);
		var circleLeft = Math.round(53 + Math.cos(angleRad) * 47);
		
		this.$circle_picker.css({"top":circleTop+"px", "left":circleLeft+"px"});
		
		
		//TRIANGLE
		var triangLeft = 60 * (1-this.v/100);
		var tg = 60/33.5;
		var lineHeight = ((60 - triangLeft) / tg) * 2;
		
		var triangleTop = 67/2 - lineHeight/2 + lineHeight * (1-this.s/100);
		
		this.$triangle_picker.css({"top":triangleTop+"px", "left":triangLeft+"px"});
		
		
		//GET COLOR
		var rgb = hsvToRgb(this.h, this.s, this.v);
		var color = rgbToHex( Math.round(rgb["r"]), Math.round(rgb["g"]), Math.round(rgb["b"]));
		
		this.active = color;
		this.$currentColor.css("background-color", this.active);
		this.$currentText.val(this.active);
		
		
		var trueRgb = hsvToRgb(this.h, 100, 100);
		var trueColor = rgbToHex(Math.round(trueRgb["r"]), Math.round(trueRgb["g"]), Math.round(trueRgb["b"]));
		this.$color_triangle.css({
			"border-left": "60px solid "+trueColor
		});
		
			
		if(this.id != undefined){
			$("#"+this.id).val(this.$currentText.val()).trigger("change");
		}
		this.initial = false;
	},
	changeAccordingToText:function(){
		var hex = this.$currentText.val();

		var isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
		if(!isOk){
			hex = "#000000";
			this.$currentText.val("#000000");
		}

		var rgb = hex2rgb(hex);
		var hsv = rgbToHsv(rgb.red, rgb.green, rgb.blue);

		this.h = hsv["h"]*359;
		this.s = hsv["s"]*100;
		this.v = hsv["v"]*100;
		
		this.updatePickers();
	},
	dragDownCircle:function(e){
		var offset = this.$color_circle.offset();
		this.centerX = offset.left + 53;
		this.centerY = offset.top + 53;

		$(document).bind(mouseMoveBind, $.proxy(this.dragMoveCircle, this));
		$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
	},
	dragMoveCircle: function(e){
		var newX = e.pageX;
		var newY = e.pageY;
		
		var difX = Math.abs(newX-this.centerX);
		var difY = Math.abs(newY-this.centerY); 
		
		var angle = Math.atan(difX/difY)*(180/Math.PI); // degrees
		
		if(newX >= this.centerX){
			//to the right
			if(newY < this.centerY)
				//1st quadrant
				this.h = angle;
			else
				//4th quadrant
				this.h = 180 - angle;
		}
		else{
			//to the left
			if(newY < this.centerY)
				//2nd quadrant
				this.h = 360-angle;
			else
				//3rd quadrant
				this.h = 180+angle;
		}
		
		
		
		this.updatePickers();
	},
	dragDownTriangle:function(e){
		this.offset = this.$triangle_overlap.offset();

		$(document).bind(mouseMoveBind, $.proxy(this.dragMoveTriangle, this));
		$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
	},
	dragMoveTriangle: function(e){
		var newX = e.pageX;
		var newY = e.pageY;
		
		var difLeft = newX-this.offset.left;
		if(difLeft < 0)
			 difLeft = 0;
		else if(difLeft > 60)
			 difLeft = 60;
		
		this.v = Math.round((1-difLeft/60) * 100);
		var tg = 60/33.5;
		var lineHeight = ((60 - difLeft) / tg) * 2;
		
		//range from 67/2 - lineHeight/2
		//		to 67/2 + lineHeight/2
		var difTop = newY-this.offset.top;
		if(difTop < 67/2 - lineHeight/2)
			 difTop = 67/2 - lineHeight/2;
		else if(difTop > 67/2 + lineHeight/2)
			 difTop = 67/2 + lineHeight/2;
			 
		if(lineHeight!=0)
			this.s = Math.round( (1-((difTop-(67-lineHeight)/2)/lineHeight)) * 100);
		else
			this.s = 0;
		
		this.updatePickers();
	},
	dragUp: function(){
		$(document).unbind(mouseMoveBind);
		$(document).unbind(mouseUpBind);
	},
	triangleClick: function(e){
		this.offset = this.$triangle_overlap.offset();
		
		var newX = e.pageX;
		var newY = e.pageY;
		
		var difLeft = newX-this.offset.left;
		if(difLeft < 0)
			 difLeft = 0;
		else if(difLeft > 60)
			 difLeft = 60;
			
		var tg = 60/33.5;
		var lineHeight = ((60 - difLeft) / tg) * 2; 
		
		var difTop = newY-this.offset.top;
		if(difTop > 67/2 - lineHeight/2 && difTop < 67/2 + lineHeight/2)
			 this.dragMoveTriangle(e);
		
		return false;
	},
	click: function(){
		if(this.opened)
			this.opened = false;
		else
			this.opened = true;
			
		this.update(true);
		return false;
	},
	val:function(color){
	    if(color == undefined)
            return this.active;
	    this.$currentText.val(color);
        this.changeAccordingToText();
    },
	info:function(){
		return this.active.toString();
	}
}

module.exports = ColorPicker;

},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
var $ = jQuery;

//Custom Listing for posts
var CustomGridListing = function(post_type, image_meta) {
	$(document).ready($.proxy(function() {
		this.post_type = post_type;
		this.image_meta = image_meta;
		this.items = new Array();
		
		//Construct
		var $root = $("#wpbody-content");
		this.$holder = $("<div id='customPortfolioHolder'></div>").appendTo($root); 
		
		//Add content
		this.loadWorks();
	}, this));
};
CustomGridListing.prototype = {
	//Load existing works
	loadWorks: function(){
		//Load works with jquery
		//this.$holder.load(this.list_works, $.proxy(this.worksLoaded, this));
		this.$holder.html('<p>Loading grid <img src="'+template_directory+'/plusquare_admin/config-backend/images/ui/loading.gif" /></p>');
		jQuery.post(
			adminAjax,
			{
				'action' : 'pq_custom_grid_listing',
				'type': this.post_type,
				'image_meta' : this.image_meta
			},
			$.proxy(function( response ) {
				this.$holder.html(response);
				this.worksLoaded();
			}, this)
		);
	},
	
	//When works have loaded
	worksLoaded: function(){
		//Add item
		$("#queryContainer .item").each($.proxy(function(index, obj){
			var item = new Item( $(obj), this.items.length );
			this.items.push( item );
			
			$(item).bind("itemStartDrag", $.proxy(this.itemStartDrag, this));
			$(item).bind("itemMove", $.proxy(this.itemMove, this));
			$(item).bind("itemStopDrag", $.proxy(this.itemStopDrag, this));
			
		}, this));
		
		//Toogle trash part
		$("#toogleTrash").click($.proxy(this.toogleTrash, this));
		this.$trashHolder = $("#queryTrashContainer").css("display", "none");
		$(".items-grid", this.$trashHolder).css("width", $("#queryTrashContainer .item").length*165+"px");
		$(".save_button").click($.proxy(this.save, this));
	},
	
	//Toogle trash holder visibility
	toogleTrash: function(){
		this.$trashHolder.not(':animated').slideToggle(200);
		
		return false;
	},
	
	//On item start to drag
	itemStartDrag: function(){
		//Get container
		this.$grid =  $("#queryContainer");
		
		//Get container offset
		var offset = this.$grid.offset();
		this.gridLeft = offset.left;	
		this.gridTop = offset.top;	
		
		//get items per row
		this.itemsPerRow = Math.floor(this.$grid.width() / 165);
		//if(WP_DEBUG)console.log(this.itemsPerRow+" items per row");
		
		//get item height
		this.itemsHeight = this.items[0].$item.outerHeight();
		//if(WP_DEBUG)console.log(this.itemsHeight+" items height");
		
		//get num lines
		this.numLines = Math.ceil(this.items.length / this.itemsPerRow);
	},
	
	//On item move
	itemMove: function(e, posX, posY, id){
		//Get relative position
		var relativeX = posX-this.gridLeft;
		var relativeY = posY-this.gridTop;
		
		//Get grid x position
		var positionX ;
		if(relativeX < 77)
			positionX = 0;
		else
			positionX = Math.round(relativeX/165);
		
		if(positionX > this.itemsPerRow)
			positionX = this.itemsPerRow;
		
		//Get grid y position
		var positionY ;
		positionY = Math.floor(relativeY/this.itemsHeight);
		if(positionY < 0)
			positionY = 0;
		else if(positionY >= this.numLines)
			positionY = this.numLines-1;
		
		//Get position in grid
		var position = positionY*this.itemsPerRow + positionX;
		if(position > this.items.length)
			position = this.items.length;
		
		//if(WP_DEBUG)console.log("Position: "+position);
		//Check if it's a new position
		if(id != position && (id+1) != position)
			//change position
			this.changeItemPosition(id, position < id ? position : position-1);
		
		
	},
	
	//Change an item's position in grid
	changeItemPosition: function(id, to){
		var item = this.items[id];
		//Remove from current position
		item.$item.remove();
		
		//Add to the right place in grid
		if(to == 0) 
			this.$grid.prepend( item.$item );   
		else
			$(">div:nth-child(" + to + ")", this.$grid).after( item.$item );	
			
		item.rebind();
		 
		//Change items order
		this.items = removePositionInArray(this.items, id);
		this.items.splice(to, 0, item);
		
		//update ids
		this.updateItemsIds();
	},
	
	//Update items ids
	updateItemsIds: function(){
		$.each(
			this.items,
			function(index, item){
				item.gridId = index;
			}
		);
	},
	
	//On item stop dragging action
	itemStopDrag: function(){
		$.each(
			this.items,
			function(index, item){
				//item.updateMeta();
			}
		);
	},
	
	save: function(){
		$(".loading_status").css("display", "inline-block");
		$(".save_button").css("display", "none");
		
		var str = '{';
		$.each(
			this.items,
			function(index, item){
				if(index != 0)
					str += ',';
				str += '"'+item.postId+'":"'+index+'"';
			}
		);
		str += '}';
		
		$.post(adminAjax, {
			action: 'ajax_update_posts_meta',
			key: "position",
			values: str
		}, function(data) {
			$(".loading_status").css("display", "none");
			$(".save_button").css("display", "");
		});
		
		return false;
	}
};

var Item = function($item, attachmentId){
	this.$item = $item;
	this.postId = $item.attr("rel");
	this.gridId = attachmentId;
	
	//Make item		
	this.$dragArea = $(".dragArea", $item);
	
	//Drag and drop
	this.$dragArea.bind(mouseDownBind, $.proxy(this.startDragging, this));
};
Item.prototype = {
	getSizing: function(){
		return this.comboBox.val();
	},
	rebind: function(){
		//Drag and drop
		this.$dragArea.unbind(mouseDownBind);
		this.$dragArea.bind(mouseDownBind, $.proxy(this.startDragging, this));
	},
	
	//Update meta value for the post associated
	updateMeta: function(){
		$.post(adminAjax, {
			action: 'ajax_update_meta',
			post_id: this.postId,
			key: "position",
			value: this.gridId
		}, function(data) {
		});
	},
	
	//Item start dragging
	startDragging: function(e){
		//Add active class
		this.$dragArea.addClass("active");
		
		//Make dragging object
		this.$draggingObj = this.$item.clone().appendTo($("body"));
		
		//Fade item
		this.$item.stop().fadeTo(200, 0.5);
		
		//Initial position
		var offset = this.$item.offset();
		
		this.x = e.pageX;
		this.y = e.pageY;
		
		this.posX = offset.left;
		this.posY = offset.top;
		
		this.$draggingObj.css({
			"position":"absolute"
		});
		
		this.updateDraggingObj();
		
		//Bind move and up
		$(document).bind(mouseMoveBind, $.proxy(this.move, this));
		$(document).bind(mouseUpBind, $.proxy(this.stopDragging, this));
		
		$(this).trigger("itemStartDrag");
		
		return false;
	},
	
	//Update dragging object position
	updateDraggingObj: function(){
		this.$draggingObj.css({
			"top": this.posY,
			"left": this.posX
		});
	},
	
	//on mouse move when dragging
	move: function(e){
		var newX = e.pageX;
		var newY = e.pageY;
		
		this.posX = this.posX + (newX-this.x);
		this.posY = this.posY + (newY-this.y);
		
		this.x = newX;
		this.y = newY;
		
		this.updateDraggingObj();
		$(this).trigger("itemMove", [this.posX+70, this.posY+80, this.gridId]);
		
    		return false;
	},
	
	//stop dragging
	stopDragging: function(){
		//Unbind move and up
		$(document).unbind(mouseMoveBind);
		$(document).unbind(mouseUpBind);
		
		//Remove active class
		this.$dragArea.removeClass("active");
		
		//Fade in item
		this.$item.stop().fadeTo(200, 1);
		
		//Fade out draggin obj
		var offset = this.$item.offset();
		this.$draggingObj.stop().animate({
			"opacity":0,
			"top":offset.top,
			"left":offset.left
		},300, function(){
			$(this).remove();	
		});
		
		$(this).trigger("itemStopDrag");
		return false;
	}
};


module.exports = CustomGridListing;

},{}],17:[function(require,module,exports){
var $ = jQuery;
	
var Dragable = function ($target, $dragArea, limited){
    this.$target = $target;
    this.$dragArea = $dragArea;
    
    this.limited = limited;
    
    this.top = 0;
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
    
    //ELEMENT DRAG
    this.$target.addClass("grabhand");
    this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
}

Dragable.prototype = {
	
	//On start drag
	dragDown:function(e){
        var rel = $(e.target).attr("rel");
        
        this.$target.addClass("down");
        
        this.iniX = e.pageX;
        this.iniY = e.pageY;
        
        this.iniTop = parseInt(this.$target.css("top"), 10);
        this.iniLeft = parseInt(this.$target.css("left"), 10);
        this.iniBottom = parseInt(this.$target.css("bottom"), 10);
        this.iniRight = parseInt(this.$target.css("right"), 10);
        
        $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
        $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
	    
        return false;
	},
	
	//On drag move
	dragMove:function(e){
        var difX = this.iniX - e.pageX;
        var difY = this.iniY - e.pageY;
        
        this.top = this.iniTop - difY;
        this.bottom = this.iniBottom + difY;
        
        this.left = this.iniLeft - difX;
        this.right = this.iniRight + difX;
        
        if(this.top < 0){
        	//overflow
        	var excess = -this.top;
        	this.top = 0;
        	this.bottom -= excess;
        }
        else if(this.bottom < 0){
        	//overflow
        	var excess = -this.bottom;
        	this.bottom = 0;
        	this.top -= excess;
        }
        
        if(this.left < 0){
        	//overflow
        	var excess = -this.left;
        	this.left = 0;
        	this.right -= excess;
        }
        else if(this.right < 0){
        	//overflow
        	var excess = -this.right;
        	this.right = 0;
        	this.left -= excess;
        }
        	
        
       	//Change
        this.$target.css({
            "top":this.top+"px",
            "left":this.left+"px",
            "bottom":this.bottom+"px",
            "right": this.right + "px"
        });
        
        
        this.$target.trigger("drag", {	"top":this.top,
							            "left":this.left,
							            "bottom":this.bottom,
							            "right": this.right});
        
        return false;
	},
	
	//on drag end
	dragUp:function(){
        this.$target.removeClass("down");
        unbindMoveAndUp();
        
        return false;
	},
	
	change:function(top, left){
	    //CHECK TOP LIMIT
	    if(this.limitTop != undefined){
	       if(top < this.limitTop)
	           top = this.limitTop;
        }
       
        //CHECK RIGHT LIMIT
        if(this.limitRight != undefined){
           if(left + this.currentWidth > this.limitRight)
               left = this.limitRight - this.currentWidth;
        }
               
        //CHECK BOTTOM LIMIT
        if(this.limitBottom != undefined){
           if(top + this.currentHeight > this.limitBottom)
               top = this.limitBottom - this.currentHeight;
        }
               
        //CHECK LEFT LIMIT
        if(this.limitLeft != undefined){
           if(left < this.limitLeft)
               left = this.limitLeft;
        }
	    
	    this.$target.css({
            "top":top+"px",
            "left":left+"px"
        });
        
        //TRIGGER CHANGE EVENT
        this.$target.trigger("drag", {"top":top, "left":left});
	},
	changeLimits: function(limitTop, limitRight, limitBottom, limitLeft){
	    this.limitTop = limitTop;
        this.limitRight = limitRight;
        this.limitBottom = limitBottom;
        this.limitLeft = limitLeft;
	}
}

module.exports = Dragable;
},{}],18:[function(require,module,exports){
var $ = jQuery;
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
			"background-image":"url("+this.ImagePicker.builderPath+"images/page_builder/Blocks/delete_icon.png)",
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
			"background-image":"url("+this.ImagePicker.builderPath+"images/page_builder/Blocks/edit_icon.png)",
			"background-position":"center center",
			"background-repeat":"no-repeat"
		}).appendTo($buttons);
	}
	
	$("img", $obj).grabHandOpen();
	$("img", $obj).preventDragDefault();
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
		$main.processFont("AllerRegular", "#111111", 12)
		
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
		
		this.$submitButton = $('<a class="ui-button" href="#">Add more <img class="arrow-icon" src="'+this.builderPath+'images/arrow.png"/></a>').css({
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

module.exports = ImagePicker;
},{}],19:[function(require,module,exports){
var $ = jQuery;
var Scalable = require("./Scalable");
var Dragable = require("./Dragable");
	
var Kenburns = function ($this, value, width, height){
	
	this.values = {	"top":0,
		            "left":0,
		            "bottom":0,
		            "right": 0,
		            "topRel":0,
		            "leftRel": 0,
		            "size": 1};
	$this.css({
		"width": width,
		"height": height
	});
	
	this.widthRatio = 2;
	this.width = width;
	this.height = height;
	this.$scaler = $this.find(".scaler");
	
	this.scalable = new Scalable($this.find(".scaler"), true, true, width, height, this.widthRatio);
	this.dragable = new Dragable($this.find(".scaler"), this.scalable.$dragArea, true);
	
	this.$scaler.bind("scale", $.proxy(this.changed, this));
	this.$scaler.bind("drag", $.proxy(this.changed, this));
}

Kenburns.prototype = {
	changed: function(e, values){
		this.values = values;
		
		var widthPerc = (this.width-(values.left+values.right))/this.width;
        var heightPerc = (this.height-(values.top+values.bottom))/this.height;
        var sizePerc = Math.max(widthPerc, heightPerc);
        
        var heightWindow = this.height - values.top - values.bottom;
        var widthWindow = this.width - values.left - values.right;
        
        if(this.width/this.height > this.widthRatio)
        	widthWindow = heightWindow * this.widthRatio;
        else
        	heightWindow = widthWindow / this.widthRatio;
        
        this.values["size"] = sizePerc;
        this.values["topRel"] = ((this.height-heightWindow) != 0 ? values.top/(this.height-heightWindow) : 0);
        this.values["leftRel"] = ((this.width-widthWindow) != 0 ? values.left/(this.width-widthWindow) : 0);
		
		$(this).trigger("change");
	},
	
	//Change ratio
	changeRatio: function(ratio){
		this.widthRatio = ratio;
		this.scalable.changeRatio(ratio);
	},
	
	//Change size
	changeSize: function(width, height, value){
		this.width = width;
		this.height = height;
		this.scalable.changeSize(width, height);
		this.val(value);
	},
	
	val: function(value){
		//Get val
		if(value == undefined)
			return this.values;
		
		//Set val
		var values = value.split("/");
		if(this.widthRatio != undefined){
			var topRel = parseFloat(values[0], 10);
			var leftRel = parseFloat(values[1], 10);
			var size = parseFloat(values[2], 10);
			
			var widthWindow, heightWindow;
			if(this.width/this.height > this.widthRatio){
				//Full area's width bigger than window max width
				heightWindow = size * this.height;
				widthWindow = heightWindow * this.widthRatio;
			}
			else{
				//Full area's height bigger than window max height
				widthWindow = size * this.width;
				heightWindow = widthWindow / this.widthRatio;
			}
			
	        var top = topRel*(this.height-heightWindow);
	        var left = leftRel*(this.width-widthWindow);
	        var bottom = this.height - top - heightWindow;
	        var right = this.width - left - widthWindow;
	        
	        this.values["top"] = top;
	        this.values["left"] = left;
	        this.values["bottom"] = bottom;
	        this.values["right"] = right;
	        this.values["size"] = size;
	        this.values["topRel"] = topRel;
	        this.values["leftRel"] = leftRel;
		}
		else{
			var top = parseFloat(values[0], 10);
			var right = parseFloat(values[1], 10);
			var bottom = parseFloat(values[2], 10);
			var left = parseFloat(values[3], 10);
			
			this.values["top"] = top;
	        this.values["left"] = left;
	        this.values["bottom"] = bottom;
	        this.values["right"] = right;
		}
        
        this.scalable.change(top, left, bottom, right);
	}
}

module.exports = Kenburns;
},{"./Dragable":17,"./Scalable":24}],20:[function(require,module,exports){
var $ = jQuery;
	
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
	
module.exports = OrderableList;
},{}],21:[function(require,module,exports){
var $ = jQuery;
	
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

module.exports = Palette_combobox;
},{}],22:[function(require,module,exports){
var $ = jQuery;

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

module.exports = Radio;
},{}],23:[function(require,module,exports){
var $ = jQuery;

var RelativeScalable = function ($target, enabled, horizontal, vertical, dragable, preserveRatio){
    //Save parameters
    this.$target = $target;
    this.enabled = false;
    this.dragable = dragable;
    this.preserveRatio = preserveRatio;
    if(this.preserveRatio == undefined)
    	this.preserveRatio = true;
    
    //Make holder
    this.$holder = $('<div class="scalable_holder"></div>').appendTo(this.$target);
    
    //Get current attributes
    this.left = parseInt($target.css("left"), 10);
    this.top = parseInt($target.css("top"), 10);
    this.width = $target.width();
    this.height = $target.height();
    this.ratio = this.width / this.height;

    if(WP_DEBUG)console.log(this.width);
    
    //Other
    this.minWidth = 5;
    this.minHeight = 5;
    
    //Save orientations
    this.horizontal = horizontal;
    this.vertical = vertical;
    
    
    //Dragging
    if(dragable){
        this.$dragArea = $('<div class="dragArea grabhand"></div>').appendTo(this.$holder);
        
        //bind
        this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
    }
    
    
	
	//Make scale draggers
    var img = '<div class="scale_button"></div>';
    
    //Only horizontal
    if(horizontal && !vertical)
	    this.$holder.append($(img)  .css({"left":"0%", "top":"50%"})
            	                    .attr("rel", "cl")
            	                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
            	    .append($(img)  .css({"left":"100%", "top":"50%"})
            	                    .attr("rel", "cr")
            	                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
	                    
	//Only vertical
    else if(!horizontal && vertical)
        this.$holder.append($(img)  .css({"left":"0%", "top":"50%"})
                                    .attr("rel", "ct")
                                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                    .append($(img)  .css({"left":"100%", "top":"50%"})
                                    .attr("rel", "cb")
                                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
                        
    //Vertical & Horizontal
    else
        this.$holder.append($(img)  .css({"left":"0", "top":"0"})
                                    .attr("rel", "lt")
                                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                    .append($(img)  .css({"left":"100%", "top":"0"})
                                    .attr("rel", "rt")
                                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                    .append($(img)  .css({"left":"0%", "top":"100%"})
                                    .attr("rel", "lb")
                                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
                    .append($(img)  .css({"left":"100%", "top":"100%"})
                                    .attr("rel", "rb")
                                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
    
    
    this.$dragElements = Array();
    this.$dragElements.push(this.$dragArea);

    this.$scaleButtons = this.$holder.find(".scale_button");
    
	if(!this.enabled)
	    this.$holder.css("display", "none");
    
}

RelativeScalable.prototype = {
    //Enable/Disable
	enable: function(){
	    this.$holder.css("display", "block");
	    this.enabled = true;
	    this.rebind();
	},
	disable: function(){
	    this.$holder.css("display", "none");
        this.enabled = false;
	},
	rebind: function(){
			if(this.dragable){
				this.$dragArea.unbind(mouseDownBind);
        	this.$dragArea.bind(mouseDownBind, $.proxy(this.dragDown, this));
    	}
		this.$scaleButtons.unbind(mouseDownBind);
    	this.$scaleButtons.bind(mouseDownBind, $.proxy(this.scaleDown, this));
	},
	
	
	//Add dummi dragger
	addDragger: function($obj){
        $obj.addClass("grabhand").bind(mouseDownBind, $.proxy(this.dragDown, this));
        this.$dragElements.push($obj);
	},
	
	
	
	
	//Scale
	scaleDown:function(e){
	    if(this.enabled){
            this.rel = $(e.target).attr("rel");
            
            this.iniX = e.pageX;
            this.iniY = e.pageY;
            
            this.left = parseInt(this.$target.css("left"), 10);
            this.top = parseInt(this.$target.css("top"), 10);
            this.width = this.$target.width();
            this.height = this.$target.height();
            
            $(document).bind(mouseMoveBind, $.proxy(this.scaleMove, this));
            $(document).bind(mouseUpBind, $.proxy(this.scaleUp, this));
	    }
        return false;
	},
	scaleMove:function(e){
        var difX = e.pageX - this.iniX ;
        var difY = e.pageY - this.iniY ;
        
        //Horizontal 
        if(this.horizontal && !this.vertical){
	        if(this.rel == "cl"){
	        	this.left += difX;
	        	this.width -= difX;
	        }
	        else{
	        	this.width += difX;
	        }

        
	        //Verifications
	        if(this.width < this.minWidth){
	        	if(this.rel == "cl")
		        	this.left -= (this.minWidth-this.width);
		        	
	        	this.width = this.minWidth;
	        }
        }

        //Vertical 
        if(!this.horizontal && this.vertical){
	        if(this.rel == "cb"){
	        	this.top += difY;
	        	this.height -= difY;
	        }
	        else{
	        	this.height += difY;
	        }

	        //Verifications
	        if(this.height < this.minHeight){
	        	if(this.rel == "cb")
		        	this.top -= (this.minHeight-this.height);
		        	
	        	this.height = this.minHeight;
	        }
	    }

	    //Vertical & Horizontal 
        if(this.horizontal && this.vertical){
        	//horizontal
	        if(this.rel.charAt(0) == "l"){
	        	this.left += difX;
	        	this.width -= difX;
	        }
	        else{
	        	this.width += difX;
	        }

	        //vertical
	        if(this.rel.charAt(1) == "t"){
	        	this.top += difY;
	        	this.height -= difY;
	        }
	        else{
	        	this.height += difY;
	        }

	        //Min width
	        if(this.width < this.minWidth){
	        	if(this.rel.charAt(0) == "l")
		        	this.left -= (this.minWidth-this.width);
		        	
	        	this.width = this.minWidth;
	        }

	        //Ratio preserve
	        if(this.preserveRatio){
	        	if(this.width / this.height != this.ratio){
	        		var dif = this.height - (this.width / this.ratio);

	        		if(this.rel.charAt(1) == "t")
	        			this.top += dif;
	        		
	        		this.height = this.width / this.ratio;
	        	}
	        }
        }

		this.iniX = e.pageX;
		this.iniY = e.pageY;
        
        this.update();
        
        return false;
	},	
	scaleUp:function(){
        unbindMoveAndUp();
        return false;
	},
	
	
	
	
	//Dragable
	dragDown: function(e){
	    if(this.enabled){
	        this.currX = e.pageX;
            this.currY = e.pageY;
            
            this.left = parseInt(this.$target.css("left"), 10);
            this.top = parseInt(this.$target.css("top"), 10);
            this.width = this.$target.width();
            this.height = this.$target.height();
	        
            //grabhand close
            $.each(
                this.$dragElements,
                function(i, obj){
                    $(obj).addClass("down");
                }
            );
	        
	        //Bind on move and up
            $(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
            $(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
	    }
	    return false;
	},
	dragMove: function(e){
	    var x = e.pageX;
        var y = e.pageY;
        
        //Update values
        this.left += (x - this.currX);
        this.top += (y - this.currY);
        
        //Update current
        this.currX = x;
        this.currY = y;
        
        this.update();
        
        return false;
    },
    dragUp: function(e){
        unbindMoveAndUp();
        
        //grabhand open
        $.each(
            this.$dragElements,
            function(i, obj){
                $(obj).removeClass("down");
            }
        );
        
        return false;
    },
	
	
	
	//Validate and update current instance
	update: function(){
		var left = Math.round(this.left);
		var top = Math.round(this.top);
		var width = this.width;
		var height = this.height;
	   
	    //update position 
        this.$target.css({
            "left":left+"px",
            "top":top+"px"
        });
        
        //Horizontal
        if(this.horizontal)
            this.$target.css({
                "width":width+"px"
            });
            
            
        //Vertical
        if(this.vertical)
            this.$target.css({
                "height":height+"px"
            });
	    
	    //Trigger change
	    this.$target.trigger("change", {"left": left,
	                                    "top": top,
                                        "width": width,
                                        "height": height});
	},
	
	
	
	

	change:function(){
	}
}
	
module.exports = RelativeScalable;
},{}],24:[function(require,module,exports){
var $ = jQuery;

var Scalable = function ($target, enabled, limited, width, height, widthRatio){
    this.$target = $target;
    this.enabled = false;
    
    this.limited = limited;
    
    this.width = width;
    this.height = height;
    this.widthRatio = widthRatio;
    
    if(enabled != undefined)
    this.enabled = enabled;
    
    var img = '<div class="scale_button"></div>';
    var imgCss = {
        "position":"absolute", 
        "margin-left":"-4px", 
        "margin-top":"-4px",
        "cursor":"pointer"
    }
    
    //DRAGGABLE
    this.$dragArea = $('<div></div>').css({
        "width":"100%",
        "height":"100%",
        "position":"absolute",
        "top":"0",
        "left":"0"
    });
    
	
	//
	this.$holder = $('<div></div>').css({
        "width":"100%",
        "height":"100%",
        "position":"absolute",
        "top":"0",
        "left":"0"
    }).appendTo(this.$target)
    .append(this.$dragArea)
    .append($(img)  .css(imgCss)
                    .css({"left":"0", "top":"0"})
                    .attr("rel", "lt")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
    .append($(img)  .css(imgCss)
                    .css({"left":"100%", "top":"0"})
                    .attr("rel", "rt")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
    .append($(img)  .css(imgCss)
                    .css({"left":"0%", "top":"100%"})
                    .attr("rel", "lb")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) )
    .append($(img)  .css(imgCss)
                    .css({"left":"100%", "top":"100%"})
                    .attr("rel", "rb")
                    .bind(mouseDownBind, $.proxy(this.scaleDown, this)) );
    
    this.top = 0;
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
    
	if(!this.enabled)
	    this.$holder.css("display", "none");
    
}

Scalable.prototype = {
	enable: function(){
	    this.$holder.css("display", "block");
	    this.enabled = true;
	},
	disable: function(){
	    this.$holder.css("display", "none");
        this.enabled = false;
	},
	
	//update
	update: function(){
		this.top = parseInt(this.$target.css("top"), 10);
	    this.left = parseInt(this.$target.css("left"), 10);
	    this.bottom = parseInt(this.$target.css("bottom"), 10);
	    this.right = parseInt(this.$target.css("right"), 10);
	    
	    //Strict format
        if(this.widthRatio != undefined){
        	this.ratioWidth();
        	//this.ratioHeight();
        }
        
        //Change
        this.$target.css({
            "top":this.top+"px",
            "left":this.left+"px",
            "bottom":this.bottom+"px",
            "right": this.right + "px"
        });
	},
	
	//Change ratio
	changeRatio: function(ratio){
		this.widthRatio = ratio;
		this.update();
	},
	
	//Change size
	changeSize: function(width, height){
		this.width = width;
		this.height = height;
		//this.update();
	},
	
	scaleDown:function(e){
	    if(this.enabled){
            var rel = $(e.target).attr("rel");
            
            this.iniX = e.pageX;
            this.iniY = e.pageY;
            
            //Horizontal
            this.fromLeft = false;
            if(rel.charAt(0)=='l')
                this.fromLeft = true;
            
            //vertical
            this.fromTop = false;
            if(rel.charAt(1)=='t')
                this.fromTop = true;
    
		    this.initop = parseInt(this.$target.css("top"), 10);
		    this.inileft = parseInt(this.$target.css("left"), 10);
		    this.inibottom = parseInt(this.$target.css("bottom"), 10);
		    this.iniright = parseInt(this.$target.css("right"), 10);
		    
		    this.top = this.initop;
		    this.left = this.inileft;
		    this.bottom = this.inibottom;
		    this.right = this.iniright;
            
            $(document).bind(mouseMoveBind, $.proxy(this.scaleMove, this));
            $(document).bind(mouseUpBind, $.proxy(this.scaleUp, this));
	    }
        return false;
	},
	scaleMove:function(e){
        var difX = e.pageX - this.iniX ;
        var difY = e.pageY - this.iniY ;
        
        //Vertically
        if(this.fromTop)
        	//from top
        	this.top = this.initop + difY;
        else
        	//from bottom
        	this.bottom = this.inibottom - difY;
        
        //Horizontally
        if(this.fromLeft)
        	//from left
        	this.left = this.inileft + difX;
        else
        	//from right
        	this.right = this.iniright - difX;
        
        
        //Verifications
        if(this.limited){
	        //left
	        if(this.left < 0)
	        	this.left = 0;
	        //right
	        if(this.right < 0)
	        	this.right = 0;
	        //top
	        if(this.top < 0)
	        	this.top = 0;
	        //bottom
	        if(this.bottom < 0)
	        	this.bottom = 0;
        }
        
        
        
    	//Strict format
        if(this.widthRatio != undefined){
        	if(difX > difY)
        		//In order to width
        		this.ratioWidth();
        	else
        		//In order to height
        		this.ratioHeight();
        }
        
        
        //Change
        this.$target.css({
            "top":this.top+"px",
            "left":this.left+"px",
            "bottom":this.bottom+"px",
            "right": this.right + "px"
        });
        
        this.$target.trigger("scale", {	"top": this.top,
							            "left": this.left,
							            "bottom":this.bottom,
							            "right": this.right});
        
        return false;
	},
	
	//Ratio in order to width
	ratioWidth: function(){
    	var currentWidth = this.width - this.left - this.right;
    	var currentHeight = this.height - this.top - this.bottom;
        	
		var height = currentWidth / this.widthRatio;
		var dif = height - currentHeight;
		
		 //Vertically
        if(this.fromTop){
        	//from top
        	this.top -= dif;
        	
        	if(this.limited){
	        	if(this.top < 0){
	        		var excess = 0 - this.top; // +
    				this.top = 0;
    				this.bottom -= excess; //check for overflow here?
    				
    				if(this.bottom < 0){
    					this.bottom = 0;
    					this.ratioHeight();
    				}
    					
	        	}
	        }
        }
        else{
        	//from bottom
        	this.bottom -= dif;
        	
        	if(this.limited){
	        	if(this.bottom < 0){
	        		var excess = 0 - this.bottom; // +
    				this.bottom = 0;
    				this.top -= excess; //check for overflow here?
    				
    				if(this.top < 0){
    					this.top = 0;
    					this.ratioHeight();
    				}
	        	}
	        }
        }
	},
	
	
	//Ratio in order to height
	ratioHeight: function(){
    	var currentWidth = this.width - this.left - this.right;
    	var currentHeight = this.height - this.top - this.bottom;
        	
		var width = currentHeight * this.widthRatio;
		var dif = width - currentWidth;
		
		//Horizontally
        if(this.fromLeft){
        	//from top
        	this.left -= dif;
        	
        	if(this.limited){
        		if(this.left < 0){
	        		var excess = 0 - this.left; // +
    				this.left = 0;
    				this.right -= excess; //check for overflow here?
    				
    				if(this.right < 0){
    					this.right = 0;
    					this.ratioWidth();
    				}
	        	}
        	}
        	
        }
        else{
        	//from bottom
        	this.right -= dif;
        	
        	if(this.limited){
	        	if(this.right < 0){
	        		var excess = 0 - this.right; // +
    				this.right = 0;
    				this.left -= excess; //check for overflow here?
    				
    				if(this.left < 0){
    					this.left = 0;
    					this.ratioWidth();
    				}
	        	}
	        }
        }
	},
	
	
	scaleUp:function(){
        unbindMoveAndUp();
        
        return false;
	},
	change:function(top, left, bottom, right){
	    this.$target.css({
            "top":top+"px",
            "left":left+"px",
            "bottom":bottom+"px",
            "right": right + "px"
        });
	}
}

module.exports = Scalable;

},{}],25:[function(require,module,exports){
var $ = jQuery;

var Scroll = function ($this, active, min, max, snap, pathToElem){
	this.active = parseInt(active, 10);
	this.min = min;
	this.max = max;
	this.snap = snap;
	this.$this = $this;
	
	this.$this.css({
		"display": "block",
		"height":"11px",
		"position":"relative",
		"background-image":"url("+pathToElem+"scrollbar_background.png)",
		"background-repeat":"repeat-x",
		"cursor":"pointer",
		"-webkit-border-radius" : "5px",
     	"-moz-border-radius" : "5px",
		"-o-border-radius" : "5px",
		"border-radius" : "5px"
	}).click($.proxy(this.click, this));
	this.width = parseInt($this.width(), 10);

	this.$active = $("<div></div").css({
		"top":"0",
		"left":"0",
		"margin":"0",
		"padding":"0",
		"width":"52px",
		"height":"11px",
		"position":"absolute",
		"background-image":"url("+pathToElem+"scrollbar_background_selected.png)",
		"background-repeat":"repeat-x",
		"-webkit-border-radius" : "5px",
     	"-moz-border-radius" : "5px",
		"-o-border-radius" : "5px",
		"border-radius" : "5px",
		"-webkit-transition" : "all 0.2s ease",
     	"-moz-transition" : "all 0.2s ease",
    	"-o-transition" : "all 0.2s ease",
    	"transition" : "all 0.2s ease"
	}).appendTo($this);
	
	this.$slider = $("<div></div").css({
		"top":"-9px",
		"left":"52px",
		"margin":"0",
		"padding":"0",
		"width":"27px",
		"height":"28px",
		"position":"absolute",
		"background-image":"url("+pathToElem+"scrollbar_slider.png)",
		"background-repeat":"none",
		"-webkit-transition" : "all 0.2s ease",
     	"-moz-transition" : "all 0.2s ease",
    	"-o-transition" : "all 0.2s ease",
    	"transition" : "all 0.2s ease"
	}).appendTo($this);
	
	this.$slider.preventDragDefault();
	this.$slider.bind(mouseDownBind, $.proxy(this.dragDown, this));
	this.tooltip = new Tooltip_ui(this.active, this.$slider, [this.$this], pathToElem);
	
	this.update();
}

Scroll.prototype = {
	update: function(){
		this.width = parseInt(this.$this.width(), 10);
		
		if(this.active < 0)
			this.active = 0;
		else if(this.active > this.max)
			this.active = this.max;
		
		var lft = (this.active/this.max)*this.width;
		this.$slider.css({"left":lft-14+"px"});
		this.$active.css({"width":lft+"px"});
		
		this.tooltip.update(parseInt(this.$this.offset().left, 10)+lft-14);
		this.tooltip.changeText(this.active);
	},
	click: function(e){
		var pixOff = e.pageX - parseInt(this.$this.offset().left, 10);
		
		var snaps = Math.abs(Math.round(((pixOff/this.width)*this.max)/this.snap));
		this.active =  snaps * this.snap;
			
		this.update();
		return false;
	},
	dragDown:function(e){
		this.startX = e.pageX;
		this.old = this.active;
		
		this.tooltip.lock();
		
		$(document).bind(mouseMoveBind, $.proxy(this.dragMove, this));
		$(document).bind(mouseUpBind, $.proxy(this.dragUp, this));
	},
	dragMove: function(e){
		var newX = e.pageX;
		var dif = newX-this.startX;
		var snap = this.snap;
		
		if(dif < 0)
			snap = -this.snap;
			
		this.active = this.old;
		dif = Math.abs(Math.round(((dif/this.width)*this.max)/this.snap));
		
		while(dif--)
			this.active += snap;
		
		this.update();
	},
	dragUp: function(){
		$(document).unbind(mouseMoveBind);
		$(document).unbind(mouseUpBind);
		this.tooltip.unlock();
	},
	val:function(){
		return this.active;
	},
	info:function(){
		return this.active;
	}
}

module.exports = Scroll;

},{}],26:[function(require,module,exports){
var $ = jQuery;

var Switch = function ($this, active, pathToElem){
	if(is_string(active))
		active = (active === 'true');
	this.active = active;
	
	$this.css({
		"display":"inline-block",
		"width":"52px",
		"height":"22px",
		"position":"relative",
		"background-image":"url("+pathToElem+"switchbox_off.png)",
		"background-repeat":"none",
		"cursor":"pointer"
	}).click($.proxy(this.click, this));

	this.$active = $("<div></div").css({
		"top":"0",
		"left":"0",
		"margin":"0",
		"padding":"0",
		"width":"52px",
		"height":"22px",
		"position":"absolute",
		"background-image":"url("+pathToElem+"switchbox_on.png)",
		"background-repeat":"none"
	}).appendTo($this);
	
	this.$slider = $("<div></div").css({
		"top":"0",
		"left":"-1px",
		"margin":"0",
		"padding":"0",
		"width":"24px",
		"height":"24px",
		"position":"absolute",
		"background-image":"url("+pathToElem+"switchbox_slider.png)",
		"background-repeat":"none"
	}).appendTo($this);
	
	this.update(false);
}

Switch.prototype = {
	update: function(animate){
		var opc = 0;
		var lft = -1;
		var time = 0;
		
		if(this.active){
			opc = 1;
			lft = 30;
		}
			
		if(animate)
			time = 150;
		
		this.$active.stop().fadeTo(time, opc);
		this.$slider.stop().animate({"left":lft+"px"}, time);
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
	    if(to == undefined)
           return this.active;
        this.active = to;
        this.update();
    },
	info:function(){
		return this.active.toString();
	}
}

module.exports = Switch;


},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
var $ = jQuery;

//IS IE
//var isIE = jQuery.browser.msie;

var Tooltip_ui = function (tip, $obj, $objArray, pathToElem){
	this.$obj = $obj;
	this.locked = false;
	
	this.$tooltip = $('<div>'+tip.toString()+'</div>').css({
		"-moz-font-feature-settings": "normal",
	    "-moz-font-language-override": "normal",
	    "height":"10px",
	    "display": "inline-block",
	    "pointer-events": "none",
	    "position": "absolute",
	    "text-align": "center",
	    "text-decoration": "none",
		"padding": "5px 10px",
		"background-image": "url("+pathToElem+"scrollbar_value.png)",
		"background-repeat": "x-repeat",
		"-webkit-transition" : "all 0.2s ease",
 		"-moz-transition" : "all 0.2s ease",
		"-o-transition" : "all 0.2s ease",
		"transition" : "all 0.2s ease",
		"opacity" : "0"
 	}).appendTo($("body"));  
	this.$tooltip.processFont('AllerRegular', "#FFFFFF", 9);
	this.$tooltip.addRoundCorners("5px");
	
	this.$triangle = $('<div></div>').css({
		"float":"left",
	    "position": "absolute",
	    "top":"100%",
	    "left":"50%",
	    "margin-left":"-5px",
		"width": "0px",
		"height": "0px",
		"border-left": "5px solid transparent",
		"border-right": "5px solid transparent",
		"border-top": "4px solid #5D5D5D"
	}).appendTo(this.$tooltip);
    
    this.update();
    
    $obj.bind(mouseOverBind, $.proxy(this.over, this));
    $obj.bind(mouseOutBind, $.proxy(this.out, this));
    
    if($objArray != null)
        $($objArray).each($.proxy(function(id, val){
            $(val).bind(mouseOverBind, $.proxy(this.over, this));
            $(val).bind(mouseOutBind, $.proxy(this.out, this));
        }, this));
}
Tooltip_ui.prototype = {
	update : function(forceLeft, forceTop) {
		var linkPosition = this.$obj.offset();
		
	    if(forceLeft != undefined)
	    	linkPosition.left = forceLeft;
	    	
	    if(forceTop != undefined)
	    	linkPosition.top = forceTop;
	    
	    var top = linkPosition.top - this.$tooltip.outerHeight() - 4;
   		var left = linkPosition.left - (this.$tooltip.width()/2) + parseInt(this.$obj.width(), 10)/4 -3;
	    
	    this.$tooltip.css({
	        "top": top,
	        "left": left
	    });
	},
	changeText : function(text){
		this.$tooltip.text(text).append(this.$triangle);
	},
	over: function(){
        if( !this.$obj.hasClass("disabled") ){
            this.update();
            this.$tooltip.stop().css("opacity", 1);  
        }    
	},
	out: function(){
		if(!this.locked)
			this.$tooltip.stop().css("opacity", 0);  
	},
	remove: function(){
		this.$tooltip.remove();
	},
	lock: function(){
		this.locked = true;
		this.over();
	},
	unlock: function(){
		this.locked = false;
		this.out();
	}
}

module.exports = Tooltip_ui;

},{}],29:[function(require,module,exports){
var $ = jQuery;
var Combobox = require("./Combobox");

var Media_Grid = function(id, sizing){
	jQuery(document).ready($.proxy(function($){
		this.id = id;
		this.sizing = sizing;
		this.$input = $('#'+this.id);
		
		if(this.sizing)
			this.$input_sizing = $('#'+this.id+"_sizing");
			
		this.$button = $('#'+this.id+'_button');
		this.$grid = $('#'+this.id+'_grid');
		this.$gridHolder = $('#'+this.id+'_grid_holder');
		this.items = new Array();
		
		//Prepare frame
		this.frame = wp.media({
			title : 'Pick the images for this work',
			multiple : true,
			library : { type : 'image'},
			button : { text : 'Insert' }
		});
		
		this.$button.click($.proxy(this.buttonClick, this));
		this.init();
		
		this.$input.bind("update", $.proxy(this.init, this));
		}, this)
	);
}

Media_Grid.prototype = {
	//Initial make
	init: function(){
		//Images val
		var val = this.$input.val();
		
		this.items = new Array();
		this.$grid.empty();
		
		if(val != "" && val!= null){
			var ids = val.split(',');
			ids.forEach($.proxy(function(id) {
				if(id != null && id != " " && id != "")
				this.addItem(id);
			}, this));
		}
		
		//Sizing val
		if(this.sizing){
			val = this.$input_sizing.val();
			
			if(val != "" && val!= null){
				var sizings = val.split(',');
				for(var i= 0; i < sizings.length ; i++)
					if(this.items[i].comboBox != undefined)
						this.items[i].comboBox.val(sizings[i]);
			}
		}

		this.resizeGrid();
	},
	
	//Button on click
	buttonClick: function(e) {
		
		//On frame close -> save selected images
		this.frame.on('close', $.proxy(this.frameClose, this));
		this.frame.on('open', $.proxy(this.frameOpen, this));
		this.frame.open();
		
		return false;
	},
	
	//Add video
	addVideo: function(type, id, image){
		this.addItem((type=="youtube"?"y":(type=="vimeo"?"v":"d"))+id+":"+image);
		this.updateInput();
		this.resizeGrid();
	},
	
	addItem: function(id){
		var item = new Item(id, this.items.length, this.sizing);
		this.items.push(item);
		this.$grid.append(item.$item);
		$(item).bind("itemRemoved", $.proxy(this.itemRemoved, this));
		$(item).bind("itemStartDrag", $.proxy(this.itemStartDrag, this));
		$(item).bind("itemMove", $.proxy(this.itemMove, this));
		
		if(this.sizing)
			item.comboDiv.bind("change", $.proxy(this.updateInput, this));
	},
	
	//Frame on open
	frameOpen: function(){
		var selection = this.frame.state().get('selection');
		//if(WP_DEBUG)console.log(frame);
		
		//Get ids array from
		var ids = this.$input.val().split(',');
		ids.forEach(function(id) {
			var attachment = wp.media.attachment(id);
			attachment.fetch();
			selection.add( attachment ? [ attachment ] : [] );
		});
	},
	
	//Frame on close
	frameClose: function(){
		//Clear input
		var media = new Array();
		
		// get selections and save to hidden input plus other AJAX stuff etc.
		var selection = this.frame.state().get('selection');
		selection.forEach($.proxy(function(obj){
			var id = obj["id"];
			
			if(id != null && id != " " && id != ""){
				if(!this.itemExists(id))
					this.addItem(id);
			
				media.push(id);
			}
			
			
		}, this));
		
		//media contatins all ids selected
		//check if an item no longer exists
		$.each(
			this.items,
			$.proxy(function(index, item){
				var exists = false;
				for(var i = 0; i< media.length; i++)
					if(media[i] == item.id){
						exists=true;
						break;
					}
					
				if(!exists)
					item.remove();
			}, this)
		);
		
		this.updateInput();
		this.resizeGrid();
	},
	
	//Update input
	updateInput: function(){
		//Clear input
		var media = new Array();
		
		if(this.sizing)
			var mediaSizing = new Array();
		
		$.each(
			this.items,
			$.proxy(function(index, item){
				media.push(item.id);
				
				if(this.sizing)
					mediaSizing.push(item.getSizing());
			}, this)
		);
		this.$input.val(media.toString()).trigger("change");
		
		if(this.sizing)
			this.$input_sizing.val(mediaSizing.toString());
	},
	
	//Resize grid
	resizeGrid: function(){
		this.$grid.css("width", this.items.length*165+"px");	
	},
	
	//Check if an item exists
	itemExists: function(id){
		var exists = false;
		$.each(
			this.items,
			function(index, item){
				if(item.id == id){
					exists = true;
					return true;
				}
			}
		);
		return exists;
	},
	
	itemStartDrag: function(){
		var offset = this.$grid.offset();
		this.gridLeft = offset.left;	
	},
	
	itemMove: function(e, posX, id){
		//Get relative position
		var relativeX = posX-this.gridLeft;
		
		//Get grid position
		var position ;
		if(relativeX < 77)
			position = 0;
		else
			position = Math.round(relativeX/165);
		
		if(position > this.items.length)
			position = this.items.length;
		
		//Check if it's a new position
		if(id != position && (id+1) != position)
			//change position
			this.changeItemPosition(id, position < id ? position : position-1);
		
	},
	
	//Change an item's position in grid
	changeItemPosition: function(id, to){
		var item = this.items[id];
		//Remove from current position
		item.$item.remove();
		
		//Add to the right place in grid
		if(to == 0) 
			this.$grid.prepend( item.$item );   
		else
			$(">div:nth-child(" + to + ")", this.$grid).after( item.$item );	
			
		 item.rebind();
		 
		//Change items order
		this.items = removePositionInArray(this.items, id);
		this.items.splice(to, 0, item);
		
		//update ids
		this.updateItemsIds();
		
		this.updateInput();
	},
	
	updateItemsIds: function(){
		$.each(
			this.items,
			function(index, item){
				item.gridId = index;
			}
		);
	},
	
	itemRemoved: function(e, attachmentId){
		var ids = this.$input.val().split(',');
		var newItems = new Array();
		
		for(var i= 0; i< this.items.length; i++)
			if(this.items[i].id != attachmentId)
				newItems.push(this.items[i]);
				
		this.items = newItems;
		this.updateItemsIds();
		this.updateInput();
	}
}


var Item = function(attachmentId, gridId, sizing){
	this.id = attachmentId;
	this.gridId = gridId;
	this.sizing = sizing;
	
	attachmentId = attachmentId.toString();
	this.isVideo = attachmentId.charAt(0) == 'y' || attachmentId.charAt(0) == 'v' || attachmentId.charAt(0) == 'd';
	
	//Make item		
	this.$item = $("<div class='item'></div>");
	var $item_inner = $("<div class='item-inner'></div>").appendTo(this.$item);
	var $img = $("<div class='img'></div>").appendTo($item_inner);
	var img = $("<img src='' />");
	this.$dragArea = $("<div class='dragArea'></div>").appendTo( $img );
	var $buttons = $("<div class='buttons'></div>").appendTo($img);
	var $editButton = $("<a href='' class='edit' target='_blank'></a>");
	this.$removeButton = $("<a href='#' class='remove'></a>").appendTo($buttons).click($.proxy(this.remove, this));
	
	
	if(this.isVideo){
    
        //is video
        $img.addClass(attachmentId.charAt(0)+"video");
	    
	    attachmentId = (attachmentId.split(":"))[1];
	}
	
	//Get attachment
	var attachment = wp.media.attachment(attachmentId);
	attachment.fetch();
	
	jQuery.post(
		adminAjax,
		{
			//action : 'get-attachment',
			//'id':attachmentId
			action 			: 'pq_get_attachment',
			'attachmentID'	: attachmentId,
			'width'			: 135,
			'height'		: 90,
			'crop'			: 'true'
		},
		function( response ) {
			if(response["success"] == true){
				img.attr("src", response["data"]["url"]).prependTo($img);
				$editButton.attr("href", response["data"]["editLink"]).prependTo($buttons);
				//if(WP_DEBUG)console.log(response);
			}
		}
	);
	
	
	if(sizing){
		this.comboDiv = $("<div></div>").appendTo($item_inner);
		this.comboBox = new Combobox(this.comboDiv, 0, ["Normal", "Fit", "Fullscreen"], ["normal", "fit", "full"], "100%");
	}	
	
	
	//Drag and drop
	this.$dragArea.bind(mouseDownBind, $.proxy(this.startDragging, this));
};
Item.prototype = {
	getSizing: function(){
		return this.comboBox.val();
	},
	rebind: function(){
		//Drag and drop
		this.$dragArea.unbind(mouseDownBind);
		this.$dragArea.bind(mouseDownBind, $.proxy(this.startDragging, this));
		
		this.$removeButton.unbind("click");
		this.$removeButton.click($.proxy(this.remove, this));

		if(this.sizing)
			this.comboBox.rebind();
	},
	remove: function(){
		//Remove from grid
		this.$item.remove();
		
		//Trigger item remotion
		$(this).trigger("itemRemoved", this.id);
		
		return false;
	},
	
	//Item start dragging
	startDragging: function(e){
		//Add active class
		this.$dragArea.addClass("active");
		
		//Make dragging object
		this.$draggingObj = this.$item.clone().appendTo($("body"));
		
		//Fade item
		this.$item.stop().fadeTo(200, 0.5);
		
		//Initial position
		var offset = this.$item.offset();
		
		this.x = e.pageX;
		this.y = e.pageY;
		
		this.posX = offset.left;
		this.posY = offset.top;
		
		this.$draggingObj.css({
			"position":"absolute"
		});
		
		this.updateDraggingObj();
		
		//Bind move and up
		$(document).bind(mouseMoveBind, $.proxy(this.move, this));
		$(document).bind(mouseUpBind, $.proxy(this.stopDragging, this));
		
		$(this).trigger("itemStartDrag");
		
    		return false;
	},
	
	//Update dragging object position
	updateDraggingObj: function(){
		this.$draggingObj.css({
			"top": this.posY,
			"left": this.posX
		});
	},
	
	//on mouse move when dragging
	move: function(e){
		var newX = e.pageX;
		var newY = e.pageY;
		
		this.posX = this.posX + (newX-this.x);
		this.posY = this.posY + (newY-this.y);
		
		this.x = newX;
		this.y = newY;
		
		this.updateDraggingObj();
		$(this).trigger("itemMove", [this.posX+70, this.gridId]);
		
    		return false;
	},
	
	//stop dragging
	stopDragging: function(){
		//Unbind move and up
		$(document).unbind(mouseMoveBind);
		$(document).unbind(mouseUpBind);
		
		//Remove active class
		this.$dragArea.removeClass("active");
		
		//Fade in item
		this.$item.stop().fadeTo(200, 1);
		
		//Fade out draggin obj
		var offset = this.$item.offset();
		this.$draggingObj.stop().animate({
			"opacity":0,
			"top":offset.top,
			"left":offset.left
		},300, function(){
			$(this).remove();	
		});
		
    		return false;
	}
};

module.exports = Media_Grid;
},{"./Combobox":15}],30:[function(require,module,exports){
var $ = jQuery;
	
var Single_Pick = function(id, width, height){
	this.width = width;
	this.height = height;
	
	if(this.width == undefined)
	this.width = 400;
	
	if(this.height == undefined)
	this.height = 250;
	
	jQuery(document).ready($.proxy(function($){
		this.id = id;
		this.$input = $('#'+this.id).bind("update", $.proxy(this.updateImage, this));
		this.$button = $('#'+this.id+'_button');
		this.$grid = $('#'+this.id+'_grid');
		this.img = $("img", this.$grid);
		
		//Prepare frame
		this.frame = wp.media({
			title : 'Pick an image',
			multiple : false,
			library : { type : 'image'},
			button : { text : 'Choose' }
		});
		
		this.$button.click($.proxy(this.buttonClick, this));
		this.updateImage();
	}, this)
	);
}

Single_Pick.prototype = {
	//Button on click
	buttonClick: function(e) {
		
		//On frame close -> save selected images
		this.frame.on('close', $.proxy(this.frameClose, this));
		this.frame.on('open', $.proxy(this.frameOpen, this));
		this.frame.open();
		
		return false;
	},
	
	//Frame on open
	frameOpen: function(){
		var selection = this.frame.state().get('selection');
		//if(WP_DEBUG)console.log(frame);
		
		//Get ids array from
		var id = this.$input.val();
		var attachment = wp.media.attachment(id);
		attachment.fetch();
		selection.add( attachment ? [ attachment ] : [] );
	},
	
	//Frame on close
	frameClose: function(){
		var id = null;
		
		var selection = this.frame.state().get('selection');
		selection.forEach($.proxy(function(obj){
			id = obj["id"];
			this.$input.val(id);
		}, this));
		
		//Get attachment
		this.updateImage();
		
	},
	
	updateImage: function(e){
		var attachmentId = this.$input.val();
		
		if(attachmentId != "" && attachmentId!= null)
			jQuery.post(
				adminAjax,
				{
					action 			: 'pq_get_attachment',
					'attachmentID'	: attachmentId,
					'width'			: this.width,
					'height'		: this.height,
					'crop'			: 'true'
				},
				$.proxy(function( response ) {
					if(WP_DEBUG)console.log(response);
					if(response["success"] == true){
						this.img.remove();
						this.img = $("<img />").appendTo(this.$grid.find(".item-inner .img"));
						
						this.img.attr("src", response["data"]["url"]);
						
						this.$grid.find(".item-inner .img")	.data("src", response["data"]["url"])
															.data("width", response["data"]["width"])
															.data("height", response["data"]["height"]);

														
						if(e==undefined)
							this.$input.trigger("change");
						
					}
				}, this)
			);
		else
			this.img.remove();
	}
}
	
module.exports = Single_Pick;
},{}],31:[function(require,module,exports){

module.exports = {
	Tooltip_ui: require("./elements/Tooltip_ui.js"),
    Switch: require("./elements/Switch.js"), 
    Alert: require("./elements/Alert.js"), 
    Checkbox: require("./elements/Checkbox.js"), 
    Radio: require("./elements/Radio.js"), 
    Combobox: require("./elements/Combobox.js"), 
    Kenburns: require("./elements/Kenburns.js"), 
    Tabs: require("./elements/Tabs.js"), 
    Scroll: require("./elements/Scroll.js"), 
    ColorPicker: require("./elements/ColorPicker.js"), 
    ImagePicker: require("./elements/ImagePicker.js"), 
    Accordion: require("./elements/Accordion.js"), 
    Scalable: require("./elements/Scalable.js"), 
    RelativeScalable: require("./elements/RelativeScalable.js"), 
    Dragable: require("./elements/Dragable.js"), 
    pq_media_multiple_picker: require("./elements/pq_media_multiple_picker.js"), 
    pq_media_single_picker: require("./elements/pq_media_single_picker.js"),
    OrderableList: require("./elements/OrderableList.js"),
    Palette_combobox: require("./elements/Palette_combobox.js"),
    CustomGridListing: require("./elements/CustomGridListing.js")
};
},{"./elements/Accordion.js":11,"./elements/Alert.js":12,"./elements/Checkbox.js":13,"./elements/ColorPicker.js":14,"./elements/Combobox.js":15,"./elements/CustomGridListing.js":16,"./elements/Dragable.js":17,"./elements/ImagePicker.js":18,"./elements/Kenburns.js":19,"./elements/OrderableList.js":20,"./elements/Palette_combobox.js":21,"./elements/Radio.js":22,"./elements/RelativeScalable.js":23,"./elements/Scalable.js":24,"./elements/Scroll.js":25,"./elements/Switch.js":26,"./elements/Tabs.js":27,"./elements/Tooltip_ui.js":28,"./elements/pq_media_multiple_picker.js":29,"./elements/pq_media_single_picker.js":30}]},{},[]);
