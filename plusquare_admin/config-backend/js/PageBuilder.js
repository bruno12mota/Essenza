define(["jquery", 
        "libraries/jquery.mobile.vmouse", 
        "Lightbox/Lightbox", 
        "./PageBuilder/ModuleButton", 
        "./PageBuilder/Module" , 
        "./PageBuilder/Line",
        "./PageBuilder/Tooltip",
        "utils/utils", 
        "ui-elements"], function($, Vmouse, Lightbox, ModuleButton, Module, Line) {
    
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
    
    return PageBuilder;
});
