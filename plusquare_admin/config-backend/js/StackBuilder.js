define(["jquery", 
        "libraries/jquery.mobile.vmouse", 
        "./PageBuilder/ModuleButton", 
        "./PageBuilder/Module" , 
        "./PageBuilder/Tooltip",
        "utils/utils", 
        "ui-elements"], function($, Vmouse, ModuleButton, Module) {
    
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
    
    return StackBuilder;
});
