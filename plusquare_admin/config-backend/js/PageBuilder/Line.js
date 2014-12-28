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
