jQuery(document).ready(function ($){
    
    var REFRESH_RATE = 30; //in miliseconds
    
    TweenTransform = function($elem, obj, objFinal, duration){
        this.reverse = false;
        this.numIterations = Math.round(duration/REFRESH_RATE);
        this.$elem = $elem;
        
        this.properties = {
            "translateX":0,
            "translateY":0,
            "scale":1
        };
        
        $.each(
            obj,
            $.proxy(
                function(index, value){
                    if(this.properties.hasOwnProperty(index))
                        this.properties[index] = parseFloat(value, 10);
                }
            ,this)
        );
        
        var propertiesFinal = {
            "translateX":0,
            "translateY":0,
            "scale":1
        };
        
        $.each(
            objFinal,
            $.proxy(
                function(index, value){
                    if(properties.hasOwnProperty(index))
                        propertiesFinal[index] = parseFloat(value, 10);
                }
            ,this)
        );
        
        this.scaleIt = (propertiesFinal.scale - this.properties.scale)/this.numIterations;
        this.transXIt = (propertiesFinal.translateX - this.properties.translateX)/this.numIterations;
        this.transYIt = (propertiesFinal.translateY - this.properties.translateY)/this.numIterations;
        
        this.currentScale = this.properties.scale;
        this.currentTransX = this.properties.translateX;
        this.currentTransY = this.properties.translateY;
        
        this.transform();
    };
    
    TweenTransform.prototype = {
        refresh: function(){
            this.numIteration = 0;
            
            clearInterval(this.interval);
            this.transform();
            
            return this;
        },
        
        start: function(){
            clearInterval(this.interval);
            this.interval = setInterval($.proxy(this.iteration, this), REFRESH_RATE);
            
            return this;
        },
        
        //STOP TRANFORMATION
        stop: function(){
            clearInterval(this.interval);
        },
        
        iteration:function(){
            this.currentScale = this.properties.scale + this.scaleIt * this.numIteration;
            this.currentTransX = this.properties.translateX + this.transXIt * this.numIteration;
            this.currentTransY = this.properties.translateY + this.transYIt * this.numIteration;
                    
            this.transform();
            
            if(this.reverse){
                if(this.numIteration-- <= 0)
                    clearInterval(this.interval);
            }
            else{
                if(this.numIteration++ >= this.numIterations)
                    clearInterval(this.interval);
            }
            
        },
        
        transform: function(){
            if(Modernizr.csstransforms)
                this.$elem.setTransform("scale("+this.currentScale+") rotate(0.01deg) translate("+this.currentTransX+"px,"+this.currentTransY+"px)");
            else
                this.$elem.setIETransform({"scale":this.currentScale, "translateX":this.currentTransX, "currentTransY":this.currentTransY});
        }
    };
    
});