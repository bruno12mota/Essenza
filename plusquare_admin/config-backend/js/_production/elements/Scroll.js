define(["jquery"],function(b){var d=function(a,e,d,f,g,c){this.active=parseInt(e,10);this.min=d;this.max=f;this.snap=g;this.$this=a;this.$this.css({display:"block",height:"11px",position:"relative","background-image":"url("+c+"scrollbar_background.png)","background-repeat":"repeat-x",cursor:"pointer","-webkit-border-radius":"5px","-moz-border-radius":"5px","-o-border-radius":"5px","border-radius":"5px"}).click(b.proxy(this.click,this));this.width=parseInt(a.width(),10);this.$active=b("<div></div").css({top:"0",
left:"0",margin:"0",padding:"0",width:"52px",height:"11px",position:"absolute","background-image":"url("+c+"scrollbar_background_selected.png)","background-repeat":"repeat-x","-webkit-border-radius":"5px","-moz-border-radius":"5px","-o-border-radius":"5px","border-radius":"5px","-webkit-transition":"all 0.2s ease","-moz-transition":"all 0.2s ease","-o-transition":"all 0.2s ease",transition:"all 0.2s ease"}).appendTo(a);this.$slider=b("<div></div").css({top:"-9px",left:"52px",margin:"0",padding:"0",
width:"27px",height:"28px",position:"absolute","background-image":"url("+c+"scrollbar_slider.png)","background-repeat":"none","-webkit-transition":"all 0.2s ease","-moz-transition":"all 0.2s ease","-o-transition":"all 0.2s ease",transition:"all 0.2s ease"}).appendTo(a);this.$slider.preventDragDefault();this.$slider.bind(mouseDownBind,b.proxy(this.dragDown,this));this.tooltip=new Tooltip_ui(this.active,this.$slider,[this.$this],c);this.update()};d.prototype={update:function(){this.width=parseInt(this.$this.width(),
10);0>this.active?this.active=0:this.active>this.max&&(this.active=this.max);var a=this.active/this.max*this.width;this.$slider.css({left:a-14+"px"});this.$active.css({width:a+"px"});this.tooltip.update(parseInt(this.$this.offset().left,10)+a-14);this.tooltip.changeText(this.active)},click:function(a){a=a.pageX-parseInt(this.$this.offset().left,10);this.active=Math.abs(Math.round(a/this.width*this.max/this.snap))*this.snap;this.update();return!1},dragDown:function(a){this.startX=a.pageX;this.old=
this.active;this.tooltip.lock();b(document).bind(mouseMoveBind,b.proxy(this.dragMove,this));b(document).bind(mouseUpBind,b.proxy(this.dragUp,this))},dragMove:function(a){a=a.pageX-this.startX;var b=this.snap;0>a&&(b=-this.snap);this.active=this.old;for(a=Math.abs(Math.round(a/this.width*this.max/this.snap));a--;)this.active+=b;this.update()},dragUp:function(){b(document).unbind(mouseMoveBind);b(document).unbind(mouseUpBind);this.tooltip.unlock()},val:function(){return this.active},info:function(){return this.active}};
return d});