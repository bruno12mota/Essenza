define(["jquery", "libraries/jquery.mobile.vmouse", "ui-elements", "libraries/inheritance"], function($) {


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
        processFont(this.$obj, "AllerRegular", "#fff", 12);
        
        this.$toDrag = $("<div></div>").append(this.$obj.clone().css({"border":"none"})).css({
            "width":"130px",
            "height":"29px",
            "background-image":"url("+builderPath+"images/Modules/drag_background.png)",
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
        
        
        preventDragDefault(this.$obj);
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
            "background-image":"url("+builderPath+"images/Placeholder/drag_background.png)",
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
        
        
        preventDragDefault(this.$obj);
        //MOUSE DOWN BIND
        this.$obj.bind(mouseDownBind, $.proxy(this.mouseDown, this));
        
    }
});

  return {	"ComponentButton": ComponentButton,
        	"PlaceholderButton": PlaceholderButton};

});