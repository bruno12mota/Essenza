define(["jquery"],function(){var c=function(b,a,d){this.$target=b;this.$dragArea=a;this.limited=d;this.bottom=this.right=this.left=this.top=0;this.$target.addClass("grabhand");this.$dragArea.bind(mouseDownBind,$.proxy(this.dragDown,this))};c.prototype={dragDown:function(b){$(b.target).attr("rel");this.$target.addClass("down");this.iniX=b.pageX;this.iniY=b.pageY;this.iniTop=parseInt(this.$target.css("top"),10);this.iniLeft=parseInt(this.$target.css("left"),10);this.iniBottom=parseInt(this.$target.css("bottom"),
10);this.iniRight=parseInt(this.$target.css("right"),10);$(document).bind(mouseMoveBind,$.proxy(this.dragMove,this));$(document).bind(mouseUpBind,$.proxy(this.dragUp,this));return!1},dragMove:function(b){var a=this.iniX-b.pageX;b=this.iniY-b.pageY;this.top=this.iniTop-b;this.bottom=this.iniBottom+b;this.left=this.iniLeft-a;this.right=this.iniRight+a;0>this.top?(a=-this.top,this.top=0,this.bottom-=a):0>this.bottom&&(a=-this.bottom,this.bottom=0,this.top-=a);0>this.left?(a=-this.left,this.left=0,this.right-=
a):0>this.right&&(a=-this.right,this.right=0,this.left-=a);this.$target.css({top:this.top+"px",left:this.left+"px",bottom:this.bottom+"px",right:this.right+"px"});this.$target.trigger("drag",{top:this.top,left:this.left,bottom:this.bottom,right:this.right});return!1},dragUp:function(){this.$target.removeClass("down");unbindMoveAndUp();return!1},change:function(b,a){void 0!=this.limitTop&&b<this.limitTop&&(b=this.limitTop);void 0!=this.limitRight&&a+this.currentWidth>this.limitRight&&(a=this.limitRight-
this.currentWidth);void 0!=this.limitBottom&&b+this.currentHeight>this.limitBottom&&(b=this.limitBottom-this.currentHeight);void 0!=this.limitLeft&&a<this.limitLeft&&(a=this.limitLeft);this.$target.css({top:b+"px",left:a+"px"});this.$target.trigger("drag",{top:b,left:a})},changeLimits:function(b,a,d,c){this.limitTop=b;this.limitRight=a;this.limitBottom=d;this.limitLeft=c}};return c});
