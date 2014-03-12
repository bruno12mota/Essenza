define(["jquery","utils/utils"],function(b){var e=function(a,c,d){this.active=c;this.opened=!1;this.h=90;this.s=100;this.v=50;this.id=d;this.$obj=a;this.$largeMenu=b('<div class="largeMenu"></div>').appendTo(a);this.$color_circle=b('<div class="color_circle"></div>').appendTo(this.$largeMenu).click(b.proxy(this.circlePickerClicked,this));this.$circle_picker=b('<div class="circle_picker"></div>').appendTo(this.$color_circle);this.$color_triangle=b('<div class="color_triangle"></div>').appendTo(this.$largeMenu).click(b.proxy(this.circlePickerClicked,
this));this.$triangle_overlap=b('<div class="triangle_overlap"></div>').appendTo(this.$color_triangle).click(b.proxy(this.triangleClick,this));this.$triangle_picker=b('<a class="triangle_picker" onClick="return false;"></a>').appendTo(this.$triangle_overlap);this.$smallMenu=b('<div class="smallMenu"></div>').appendTo(a);this.$currentColor=b('<a class="currentColor" href="#" onClick="return false;"></a>').appendTo(this.$smallMenu).click(b.proxy(this.click,this));this.$currentText=b('<input type="text" value="'+
c+'" class="currentText"/>').appendTo(this.$smallMenu).blur(b.proxy(this.changeAccordingToText,this));this.$currentOpenState=b('<a href="#" class="currentOpenState" onClick="return false;"></a>').appendTo(this.$smallMenu).click(b.proxy(this.click,this));preventDragDefault(this.$circle_picker);this.$circle_picker.bind(mouseDownBind,b.proxy(this.dragDownCircle,this));preventDragDefault(this.$triangle_picker);this.$triangle_picker.bind(mouseDownBind,b.proxy(this.dragDownTriangle,this));void 0!=this.id&&
b("#"+this.id).bind("update",b.proxy(this.onInputUpdate,this));this.initial=!0;this.update(!1);this.changeAccordingToText()};e.prototype={circlePickerClicked:function(a){var c=this.$color_circle.offset(),b=a.pageX-c.left;a=a.pageY-c.top;Math.pow(b-53,2)+Math.pow(a-53,2)<Math.pow(53,2)&&Math.pow(b-53,2)+Math.pow(a-53,2)>Math.pow(40,2)&&(b-=53,a-=53,c=Math.atan(Math.abs(b)/Math.abs(a))*(180/Math.PI),this.h=0<=b?0>a?c:180-c:0>a?360-c:180+c,this.updatePickers())},onInputUpdate:function(){var a=b("#"+
this.id).val();this.$currentText.val(a);this.changeAccordingToText()},update:function(a){var c=0,b=0,g=0,f=0,e=1;this.opened&&(c=147,g=b=123,e=1);a&&(f=150);this.$largeMenu.stop().animate({height:c+"px",opacity:e},f);this.$smallMenu.stop().animate({top:g+"px"},f);this.$obj.stop().animate({height:b+28+"px"},f)},updatePickers:function(){var a=(this.h-90)*(Math.PI/180),c=Math.round(53+47*Math.sin(a)),a=Math.round(53+47*Math.cos(a));this.$circle_picker.css({top:c+"px",left:a+"px"});c=60*(1-this.v/100);
a=2*((60-c)/(60/33.5));this.$triangle_picker.css({top:33.5-a/2+a*(1-this.s/100)+"px",left:c+"px"});c=hsvToRgb(this.h,this.s,this.v);this.active=rgbToHex(c[0],c[1],c[2]);this.$currentColor.css("background-color",this.active);this.$currentText.val(this.active);c=hsvToRgb(this.h,100,100);c=rgbToHex(c[0],c[1],c[2]);this.$color_triangle.css({"border-left":"60px solid "+c});void 0!=this.id&&b("#"+this.id).val(this.$currentText.val()).trigger("change");this.initial=!1},changeAccordingToText:function(){var a=
this.$currentText.val();/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)||(a="#000000",this.$currentText.val("#000000"));a=hex2rgb(a);a=rgbToHsv(a.red,a.green,a.blue);this.h=Math.round(10*a[0])/10;this.s=Math.round(10*a[1])/10;this.v=Math.round(10*a[2])/10;this.updatePickers()},dragDownCircle:function(a){a=this.$color_circle.offset();this.centerX=a.left+53;this.centerY=a.top+53;b(document).bind(mouseMoveBind,b.proxy(this.dragMoveCircle,this));b(document).bind(mouseUpBind,b.proxy(this.dragUp,this))},dragMoveCircle:function(a){var c=
a.pageX;a=a.pageY;var b=Math.abs(c-this.centerX),e=Math.abs(a-this.centerY),b=Math.atan(b/e)*(180/Math.PI);this.h=c>=this.centerX?a<this.centerY?b:180-b:a<this.centerY?360-b:180+b;this.updatePickers()},dragDownTriangle:function(a){this.offset=this.$triangle_overlap.offset();b(document).bind(mouseMoveBind,b.proxy(this.dragMoveTriangle,this));b(document).bind(mouseUpBind,b.proxy(this.dragUp,this))},dragMoveTriangle:function(a){var b=a.pageY;a=a.pageX-this.offset.left;0>a?a=0:60<a&&(a=60);this.v=Math.round(100*
(1-a/60));a=2*((60-a)/(60/33.5));b-=this.offset.top;b<33.5-a/2?b=33.5-a/2:b>33.5+a/2&&(b=33.5+a/2);this.s=0!=a?Math.round(100*(1-(b-(67-a)/2)/a)):0;this.updatePickers()},dragUp:function(){b(document).unbind(mouseMoveBind);b(document).unbind(mouseUpBind)},triangleClick:function(a){this.offset=this.$triangle_overlap.offset();var b=a.pageY,d=a.pageX-this.offset.left;0>d?d=0:60<d&&(d=60);d=2*((60-d)/(60/33.5));b-=this.offset.top;b>33.5-d/2&&b<33.5+d/2&&this.dragMoveTriangle(a);return!1},click:function(){this.opened=
this.opened?!1:!0;this.update(!0);return!1},val:function(a){if(void 0==a)return this.active;this.$currentText.val(a);this.changeAccordingToText()},info:function(){return this.active.toString()}};return e});
