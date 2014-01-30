define(["jquery", 
        "libraries/jquery.mobile.vmouse", 
        "./PageBuilder/ModuleButton", 
        "./PageBuilder/Module" , 
        "./PageBuilder/Line",
        "./PageBuilder/Tooltip",
        "utils/utils", 
        "ui-elements"], function($, Vmouse, ModuleButton, Module, Line) {
    
    //Shortcodes info
    var shortcodes = [
        {name:"Text Block", column:0, color:"#b2d516", icon:"images/Modules/module_textbox.png", shortcode:"text", info:"#0" ,content:0, parameters:[
                {id:"text", name:"Text", type:"editor", value:""},
                {id:"switch", name:"Switch", type:"switch", value: false},
                {id:"checkbox", name:"Checkbox", type:"checkbox", value: true},
                {id:"combobox", name:"Combobox", type:"combobox", value: "1", options: ["Option 1", "Option 2", "Option 3", "Option 4"]}
        ]},
        
        {name:"Image Gallery", column:0, color:"#04aedf", icon:"images/Modules/module_image_gallery.png", info:"Holding <span>#0</span> images...", content:-1, shortcode:"gallery", parameters:[
                {id:"image", name:"Image Selector", type:"image", value:""}
        ]},
        {name:"Line Divider", column:0, color:"#fce72a", icon:"images/Modules/module_divider.png", content:-1, shortcode:"", parameters:[]},
        {name:"Image Slider", column:0, color:"#fc59ac", icon:"images/Modules/module_image_slider.png", info:"Holding <span>#0</span> slides...", content:0, shortcode:"slider", parameters:[
                {id:"slider", name:"Slider Editor", type:"slider", value:""}
        ]},
        {name:"Accordion", column:0, color:"#14be44", icon:"images/Modules/module_accordion.png", content:-1, shortcode:"", parameters:[]},
        {name:"Tabs & Tours", column:0, color:"#0177c1", icon:"images/Modules/module_tabs_tours.png", content:-1, shortcode:"", parameters:[]},
        {name:"Video Object", column:1, color:"#ff2500", icon:"images/Modules/module_video_object.png", content:-1, shortcode:"", parameters:[]},
        {name:"Single Image", column:1, color:"#8b1cb8", icon:"images/Modules/module_single_image.png", content:-1, shortcode:"", parameters:[]},
        {name:"Lightbox", column:1, color:"#ff9104", icon:"images/Modules/module_lightbox.png", content:-1, shortcode:"", parameters:[]},
        {name:"MessageBox", column:1, color:"#f41e66", icon:"images/Modules/module_message_box.png", content:-1, shortcode:"", parameters:[]},
        {name:"Button", column:1, color:"#00fffb", icon:"images/Modules/module_buttons.png", content:-1, shortcode:"", parameters:[]},
        {name:"List", column:1, color:"#9c6338", icon:"images/Modules/module_list.png", content:-1, shortcode:"", parameters:[]},
        {name:"Togglebox", column:2, color:"#be9bf9", icon:"images/Modules/module_togglebox.png", content:-1, shortcode:"", parameters:[]},
        {name:"Social Icons", column:2, color:"#969696", icon:"images/Modules/module_social_icons.png", content:-1, shortcode:"", parameters:[]},
        {name:"Twitter Widget", column:3, color:"#4bc6f0", icon:"images/Modules/twitter_icon.png", content:-1, shortcode:"", parameters:[]},
        {name:"Facebook Like", column:3, color:"#395499", icon:"images/Modules/facebook_icon.png", content:-1, shortcode:"", parameters:[]},
        {name:"Google+", column:3, color:"#c5351a", icon:"images/Modules/google+_icon.png", content:-1, shortcode:"", parameters:[]},
        {name:"Pinterest Button", column:3, color:"#ac1e1c", icon:"images/Modules/pinterest_icon.png", content:-1, shortcode:"", parameters:[]},
        {name:"Tweetme Button", column:3, color:"#4bc6f0", icon:"images/Modules/twitter_icon.png", content:-1, shortcode:"", parameters:[]},
        {name:"Flickr Gallery", column:3, color:"#e6306b", icon:"images/Modules/flickr_icon.png", content:-1, shortcode:"", parameters:[]}
    ];
    
    
    //Variables
    var modulesMovementSpeed = 400;
    var modulesSizeSpeed = 400;
    
    
    var PageBuilder = function($tab, _shortcodes){
    	shortcodes = _shortcodes;
    	
        //Modules
        this.modules = new Array();
        this.lineNum = 0;
        
        //Lines
        this.lines = new Array();
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
            processIcon($addPlaceholderButton, builderPath+"images/MainMenu/placeholder_icon.png");
    
            ///////////////add module button
            var $addModule = $("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);
            var $addModuleButton = $("<a href='#'>Add new module</a>").appendTo($addModule);
            processIcon($addModuleButton, builderPath+"images/MainMenu/add_icon.png");
    
            ///////////////load page button
            var $loadModule = $("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);
            var $loadPageButton = $("<a href='#' class='right'>Load page</a>").appendTo($loadModule);
            processIcon($loadPageButton, builderPath+"images/MainMenu/load_icon.png");
    
            ///////////////load page button
            var $saveModule = $("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);
            var $savePageButton = $("<a href='#' class='right'>Save page</a>").appendTo($saveModule);
            processIcon($savePageButton, builderPath+"images/MainMenu/save_icon.png");
    
            ///////////////clear page button
            var $clearModule = $("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);
            var $clearPageButton = $("<a href='#'>Clear page</a>").appendTo($clearModule).click($.proxy(this.clearAll, this));
            processIcon($clearPageButton, builderPath+"images/MainMenu/delete_icon.png");
            
            
            //PLACEHOLDER MENU
            var $placeholderMenu = $("<div class='menu-dropdown' id='placeholderDrop'></div>").appendTo($addPlaceholder);
            
            $addPlaceholder.hover(function() {
                $placeholderMenu.stop().css("display", "block").fadeTo(200, 1);
            }, function() {
                $placeholderMenu.stop().fadeTo(200, 0, function(){$(this).css("display", "none")});
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
                {image: "images/Placeholder/1-1.png",                       column:0,   label:"1"   ,                               sizes:[12]},
                {image: "images/Placeholder/1-2.png",                       column:0,   label:"1/2" ,                               sizes:[6]},
                {image: "images/Placeholder/1-2_1-2.png",                   column:0,   label:"1/2 + 1/2" ,                         sizes:[6, 6]},
                {image: "images/Placeholder/1-3.png",                       column:0,   label:"1-3" ,                               sizes:[4]},
                {image: "images/Placeholder/1-3_1-3_1-3.png",               column:0,   label:"1-3 + 1-3 + 1-3" ,                   sizes:[4, 4, 4]},
                {image: "images/Placeholder/1-3_2-3.png",                   column:1,   label:"1/3 + 2/3" ,                         sizes:[4, 8]},
                {image: "images/Placeholder/2-3_1-3.png",                   column:1,   label:"2/3 + 1/3" ,                         sizes:[8, 4]},
                {image: "images/Placeholder/1-6.png",                       column:1,   label:"1/6" ,                               sizes:[2]},
                {image: "images/Placeholder/1-6_1-6_1-6_1-6_1-6_1-6.png",   column:1,   label:"1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6" , sizes:[2, 2, 2, 2, 2, 2]}
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
            
            
            //MODULES MENU
            var $modulesMenu = $("<div class='menu-dropdown' id='modulesDrop'></div>").appendTo($addModule);
            
            $addModule.hover(function() {
                $modulesMenu.stop().css("display", "block").fadeTo(200, 1);
            }, function() {
                $modulesMenu.stop().fadeTo(200, 0, function(){$(this).css("display", "none")});
            });
            
            var $modulesHideable = $placeHolderHideable.clone().appendTo($modulesMenu);
            $('div.info-pb', $modulesHideable).text("Drag and drop these modules on the canvas. Modules can be placed directly on the canvas or within placeholders. Once placed, you can edit the modules by pressing the edit icon.");
            
            var $mainrow = $("<div class='row-fluid columns-wraper'></div>").appendTo($modulesMenu);
            
            //Custom & Social Columns
            var $modulesCustomColumn = $("<div class='span9'></div>").appendTo($mainrow);
            var $modulesSocialColumn = $("<div class='span3'></div>").appendTo($mainrow);
            
            
            //Custom Column
            var $customColumnText = $("<p>Custom</p>").appendTo($modulesCustomColumn);
            
            var $customColumns = $("<div class='row-fluid'></div>").appendTo($modulesCustomColumn);
            
            var $customColumn1 = $("<div class='span4 column'></div>").appendTo($customColumns);
            var $customColumn2 = $("<div class='span4 column'></div>").appendTo($customColumns);
            var $customColumn3 = $("<div class='span4 column'></div>").appendTo($customColumns);
            
            
            //Social Column
            var $socialColumnText = $("<p>Social</p>").appendTo($modulesSocialColumn);
            var $customColumn4 = $("<div class='span12 column'></div>").appendTo($modulesSocialColumn);
            
            var componentsColumns = [$customColumn1, $customColumn2, $customColumn3, $customColumn4];
            
            //make buttons
            $.each(
                shortcodes,
                $.proxy(function(index, obj){
                    var moduleButton = new ModuleButton.ComponentButton( obj ); 
                    componentsColumns[obj.column].append( moduleButton.$obj );
                    
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
                    "background-image" : "url("+builderPath+"images/General/grid_plus.png)",
                    "background-repeat":"no-repeat"
                }).appendTo(this.$baseLine);
            this.addLine();
            this.addLine();
            this.addLine();
        },
        
        
        //GET MODULES FROM HTML
        fromHtml: function(){
            var content = $("#content").val().toString();
            
            console.log("CONTENT:"+content);
            
            if(content != null && content != undefined){
                //GET ROWS
                var regexStr = "\\[row\\][\\s\\S]*?\\[\\/row\\]";
                var regex = new RegExp(regexStr, "gi");
                
                var matched = content.match(regex);
                
                //Iterate rows
                if(matched != null){
                    
                    //for each row
                    for(var rowId = 0; rowId < matched.length ; rowId ++){
                        console.log("ROW:"+matched[rowId]);
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
                                console.log("COLUMN:"+matchedColumns[columnId]);
                                //Get column parameters part
                                var regexColumnParametersStr = "\\[column.*?\\]";
                                var regexColumnParameters = new RegExp(regexColumnParametersStr, "gi");
                                
                                var matchedParameters = matchedColumns[columnId].match(regexColumnParameters);
                                
                                if(matchedParameters == null){
                                    console.log("Page Builder error");
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
                                
                                console.log("Size: "+size);
                                console.log("Column: "+column);
                                
                                //Make placeholder
                                var placeholder = new Module.Placeholder(size, column, this.modules.length);
                                this.lines[rowId].addModule(placeholder);
                                placeholder.show();
                                this.modules.push(placeholder);
                                $(placeholder).bind("moduleDown", $.proxy(this.placeholderDown, this));
                                $(placeholder).bind("moduleDelete", $.proxy(this.placeholderDelete, this));
                                
                                column += size;
                                
                                //GET COLUMNID content string
                                var columnContent = matchedColumns[columnId].substring(matchedParameters[0].length, matchedColumns[columnId].length-9);
                                console.log("column content: "+columnContent);
                                
                                //GET COMPONENTS in COLUMNID content
                                var regexComponentsStr = "\\[.*?\\][\\s\\S]*?\\[\\/.*?\\]";
                                var regexComponents = new RegExp(regexComponentsStr, "gi");
                                
                                var matchedComponents = columnContent.match(regexComponents);
                                
                                //Iterate columns in rowId
                                if(matchedComponents != null){
                                    for(var componentId = 0; componentId < matchedComponents.length ; componentId ++){
                                        console.log("content: "+matchedComponents[componentId]);
                                        var str = matchedComponents[componentId];
                                        
                                        //Get shortcode name
                                        var shortcodeStr = "";
                                        var count = 1;
                                        while(str.charAt(count) != ' ' && str.charAt(count) != ']'){
                                            shortcodeStr += str.charAt(count);
                                            count ++;
                                        }
                                        
                                        //Which shortcode
                                        var shortcode = null;
                                        $.each(
                                            shortcodes,
                                            function(index, obj){
                                                if(obj.shortcode == shortcodeStr){
                                                    shortcode = obj;
                                                    return ;
                                                }
                                            }
                                        );
                                        
                                        if(shortcode == null){
                                            console.log("Page builder: Couldn't find a shortcode!");
                                            break;
                                        }
                                        else
                                            console.log("Creating component with shortcode: "+shortcodeStr);
                                        
                                        //Info
                                        var infoCopy = ModuleButton.copyInfo( shortcode );
                                        infoCopy.type = "module";
                                        
                                        //Update Info Parameters
                                        var regexIPStr = "\\["+shortcodeStr+".*?\\]";
                                        var regexIP = new RegExp(regexIPStr, "i");
                                        var matchedIP = str.match(regexIP);
                                
                                        if(matchedIP == null){
                                            console.log("Page Builder: error reading shortcode parameters!");
                                            return;
                                        }
                                        matchedIP = matchedIP[0];
                                        
                                        $.each(
                                          infoCopy.parameters,
                                          function(index, obj){
                                                var regexParStr = "\\s"+obj.id+'=".*?"';
                                                var regexPar = new RegExp(regexParStr, "i");
                                                
                                                var matchedPar = matchedIP.match(regexPar);
                                                if(matchedPar != null){
                                                    matchedPar = matchedPar[0];
                                    
                                                    var from = obj.id.length+2;
                                                    var to = matchedPar.length-1;
                                                    var value = matchedPar.substring(from, to);
                                                    console.log("Value: "+value);
                                                    
                                                    infoCopy.parameters[index].value = value;
                                                }
                                          }  
                                        );
                                        
                                        //content
                                        if(infoCopy.content != -1){
                                            //Has content
                                            var fromContent = matchedIP.length;
                                            var toContent = str.length - (shortcodeStr.length + 3);
                                            var value = str.substring(fromContent, toContent);
                                            
                                            console.log("shortcode content:"+ value);
                                            infoCopy.parameters[infoCopy.content].value = value;
                                        }
                                        
                                        
                                        //Make component
                                        var component = new Module.Component( infoCopy );
                                        
                                        //Add to the targeted placeholder
                                        placeholder.addComponent( component );
                                        
                                        //build module
                                        component.build();
                                        
                                        //Bind module down
                                        $(component).bind("moduleDown", $.proxy(this.componentDown, this));
                                    }
                                }
                            }
                        }
                                
                        this.checkNumLines();
                                
                    }
                }
                
                this.correctGrid();
            }
                
        },
        
        //GET HTML FROM MODULES
        makeHtml: function () {
            // Shortcodes
            // [page_builder_column][/page_builder_column]
            
            var content = "";
            
            for(var i= 0; i< this.lines.length ; i++){
                if(!this.lines[i].isEmpty()){
                    //Start row
                    content += "[row]";
                    
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
                            shouldBe += module.column + module.size;
                        }, this)
                    )
                    
                    //End row
                    content += "[/row]";
                }
            }
            
            $("#content").val(content);
            console.log(content);
            
            return true;
        },
        
        
        
        //Component Initial Create
        createComponent: function(e, info){
            
            //Create Module
            this.module = new Module.Component(info);
            
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
        
        //Moving the initial placeholders block
        movingPlaceholdersBlock: function(line){
            if(line != this.currentLine){
                //Pop moving placeholders
                var mods = this.lines[this.currentLine].popModules();
                
                //Pop line where the placeholder is going
                var beforeMods = this.lines[line].popModules();
                
                //Transfer
                this.lines[this.currentLine].pushModules(beforeMods, false);
                this.lines[line].pushModules(mods, false);
            }
            this.currentLine = line;
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
            var column = 0;
            
            while(this.lines[line].isEmpty() && line != 0)
                line--;
            
            this.currentLine = line;
            
            //Push modules bot
            for(var i= this.lines.length-1; i>line ; i--){
                var mods = this.lines[i-1].popModules();
                this.lines[i].pushModules(mods, false);
            }
            
            for(var i=0 ; i< sizes.length ; i++){
                //Create placeholder
                var placeholder = new Module.Placeholder(sizes[i], column+this.combinedSize, this.modules.length);
                
                this.modules.push( placeholder );
                this.placeholders.push( placeholder );
                this.combinedSize += sizes[i];
                
                //Add to line
                this.lines[line].addModule(placeholder);
            }
            
            this.type = "placeholder";
            
            //Mouse Events
            $(e.target).bind("moduleButtonMove", $.proxy(this.movingPlaceholderInit, this));
            $(e.target).bind("moduleButtonUp", $.proxy(this.createModuleFinal, this));
            
            this.correctGrid();
        },
        
        //Placeholder Initial on move
        movingPlaceholderInit: function(e, newX, newY){
            //
            var gridPos = this.getCenteredRelativeGridPosition(newX, newY, this.size);
            var line = gridPos.line;
            
            while(this.lines[line].isEmpty() && line != 0)
                line--;
                
            //If something has changed
            if(line != this.currentLine){
                this.movingPlaceholdersBlock(line);
                
                this.correctGrid();
            }
            
            return false;
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
                
            }
            else{
                for(var i=0 ; i<this.sizes.length ; i++){
                    this.placeholders[i].show();
                    this.placeholders[i].priority = 0;

                    $(this.placeholders[i]).bind("moduleDown", $.proxy(this.placeholderDown, this));
                    $(this.placeholders[i]).bind("moduleDelete", $.proxy(this.placeholderDelete, this));
                    $(this.placeholders[i]).bind("moduleResize", $.proxy(this.correctGrid, this));
                }
            }
            
            this.checkNumLines();
            this.correctGrid();
            
            return false;
        },
        
        
        
        //ALREADY CREATED MODULES EVENTS
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
            console.log("placeholderDown");
            this.currentLine = line;
            this.currentColumn = column;
            
            this.moduleDragging = number;
            this.modules[ number ].priority = 2; 
            
            //Placeholder Events
            $(e.target).bind("moduleMove", $.proxy(this.movingPlaceholder, this));
            $(e.target).bind("moduleUp"  , $.proxy(this.placePlaceholder, this));
            
            return false;
        },
        
        //Placeholder On Move 
        movingPlaceholder: function(e, newX, newY){
            var gridPos = this.getGridPos(newX, newY);
            var line = gridPos.line;
            var column = gridPos.column;
            
            var placeholder = this.modules[this.moduleDragging];
                
            if(column + placeholder.size > 12)
                column = 12-placeholder.size;
                
            //If something has changed
            if(line != this.currentLine || column != this.currentColumn){
                if(line != this.currentLine){
                    //Change line
                    
                    //remove from current line
                    this.lines[this.currentLine].removeModule( this.moduleDragging );
                    
                    //add to new line
                    this.lines[line].addModule( placeholder );
                }
                if(column != this.currentColumn){
                    //Change column
                    placeholder.column = column;
                }
                
                this.currentLine = line;
                this.currentColumn = column;
                
                this.correctGrid();
            }
            
            return false;
        },
        
        //Placeholder Place 
        placePlaceholder: function(e){
            $(e.target).unbind("moduleMove");
            $(e.target).unbind("moduleUp");
            
            this.correctGrid();
            this.modules[ this.moduleDragging ].priority = 0; 
            this.moduleDragging = -1;  
            
            return false;
        },
       
        //Placeholder start drag
        componentDown: function(e){
            console.log("componentDown");
            
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
            var gridPos = this.getGridPos(newX, newY);
            var line = gridPos["line"];
            var column = gridPos["column"];
            
            //check if above placeholder 
            var hittedPlaceholder = this.hittedPlaceholder(line, column);
            
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
       
        
        
        /////////////////////////////////////////////////////////////////
        //GRID FUNCTIONS
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
                if(this.lineEmpty(lineTemp)){
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
                if(this.modules[i].line == line && (column >= this.modules[i].column  && column < this.modules[i].column + this.modules[i].size  ))
                    return i;
            return -1;
        },

        //Menu on scroll
        onScroll : function(){
            var scrollTop = $(window).scrollTop();
            
	        this.menuFromTop = this.$pageBuilderTab.offset().top;
            
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
        
        //Clear all modules
        clearAll: function (){
            for(var i = 0; i< this.modules.length ; i++){
                this.modules[i].$obj.fadeTo(300, 0);
            }
            this.modules = new Array();
            this.checkNumLines();
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
            
            $(line).bind("overThis", $.proxy(this.currentOverLine, this));
            
            this.lines.push(line);
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
