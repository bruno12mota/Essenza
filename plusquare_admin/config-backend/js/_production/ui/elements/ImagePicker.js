define(["jquery"],function(b){var f=function(a,c,d,e){this.url=b("img",a).attr("src");this.id=b("img",a).attr("ref");this.$obj=a;this.ImagePicker=c;if(this.selected=d)this.pos=e,this.rightToLiner=!1,this.updatePos(!1),c=b("<div></div>").css({height:"23",position:"absolute","background-color":"#FFFFFF",top:"67px",left:"39px",overflow:"hidden"}).appendTo(this.$obj),b("<a href='#'></a>").css({width:"25",height:"23",position:"relative","float":"right","background-image":"url("+this.ImagePicker.builderPath+
"images/page_builder/Blocks/delete_icon.png)","background-position":"center center","background-repeat":"no-repeat"}).appendTo(c).click(b.proxy(this.remove,this)),b("<div></div>").css({width:"1",height:"15",position:"relative","float":"right","background-color":"#E1E1E1",top:"4px"}).appendTo(c),b("<a href='media.php?attachment_id="+this.id+"&action=edit' target='_blank'></a>").css({width:"25",height:"23",position:"relative","float":"right","background-image":"url("+this.ImagePicker.builderPath+"images/page_builder/Blocks/edit_icon.png)",
"background-position":"center center","background-repeat":"no-repeat"}).appendTo(c);b("img",a).grabHandOpen();b("img",a).preventDragDefault();b("img",a).bind(mouseDownBind,b.proxy(this.dragDown,this))};f.prototype={updatePos:function(a){var c=10+100*this.pos;this.rightToLiner&&(c+=13);a?this.$obj.animate({left:c+"px"},200).fadeTo(150,1):this.$obj.css({left:c+"px"})},changePos:function(a,c){if(a!=this.pos||this.rightToLiner!=c)this.pos=a,this.rightToLiner=c,this.updatePos(!0)},remove:function(){this.$obj.stop().fadeTo(150,
0,function(){b(this).remove()});this.ImagePicker.removeSelected(this.pos);return!1},dragDown:function(a){var c=a.pageX;a=a.pageY;var d=this.$obj.offset();this.currentX=c;this.currentY=a;this.objIniX=d.left;this.objIniY=d.top;this.$obj.fadeTo(150,0.5);this.$clone=this.$obj.clone().appendTo(b("body")).css({position:"absolute",top:d.top+"px",left:d.left+"px","z-index":"101"}).fadeTo(0,0.4);this.$clone.grabHandClose();this.ImagePicker.draggingPos(c,a);b(document).bind(mouseMoveBind,b.proxy(this.dragMove,
this));b(document).bind(mouseUpBind,b.proxy(this.dragUp,this));return!1},dragMove:function(a){var c=a.pageX;a=a.pageY;this.$clone.css({top:this.objIniY+(a-this.currentY)+"px",left:this.objIniX+(c-this.currentX)+"px"});this.ImagePicker.draggingPos(c,a);return!1},dragUp:function(){unbindMoveAndUp();this.selected?(this.$obj.fadeTo(150,0),this.ImagePicker.changeSelected(this.pos)):(this.$obj.fadeTo(150,1),this.ImagePicker.addSelected(this.url,this.id));this.$clone.fadeTo(200,0,function(){b(this).remove()});
return!1}};var k=function(a,c,d){this.$this=a;this.builderPath=d;this.active=[];this.active=c.split(",");a.load("../wp-content/themes/twentyeleven/page_builder/php/images_display.php",b.proxy(this.loaded,this))};k.prototype={loaded:function(){var a=this.$this;b(".imagepicker_main",a).css({border:"solid 1px #e6e6e6",display:"block",position:"relative"}).processFont("AllerRegular","#111111",12);b(".imagepicker_text",a).css({padding:"10px 10px"});b(".imagepicker_text span",a).css({color:"#58AEB8"});
b(".imagepicker_text span.imagepicker_greyish",a).css({color:"#999999"});this.$hidable=b(".imagepicker_available_hidable",a).css({overflow:"hidden",height:"0px"});this.$availableText=b("div.imagepicker_available_text",a);this.$currentSelectedSpan=b("div.imagepicker_text span.imagepicker_sel",a);this.$selected_box=b(".imagepicker_selected_box",a).css({border:"solid 1px #cccccc","background-color":"#e6e6e6",height:"110px",margin:"0px 4px 4px 4px",overflow:"auto","overflow-y":"hidden","-ms-overflow-y":"hidden"});
this.$selecteds=b(".imagepicker_selected",a).css({height:"90px",margin:"10px 0px",overflow:"hidden",position:"relative"});this.$available_box=b(".imagepicker_available_box",a).css({border:"solid 1px #cccccc","background-color":"#fff",height:"110px",margin:"0px 4px 4px 4px",overflow:"auto","overflow-y":"hidden","-ms-overflow-y":"hidden"});this.$availables=b(".imagepicker_availables",a).css({height:"90px",margin:"10px 0px",overflow:"hidden"});b(".imagepicker_image img",a).load(function(){b(this).resizeAndCenter(90,
90)});b(".imagepicker_image",a).css({width:"90px",height:"90px",overflow:"hidden","float":"left","margin-left":"10px"});var c=this;c.availables=[];b(".imagepicker_image",a).each(function(){c.availables.push(new f(b(this),c,!1))});this.selectedImages=[];this.$liner=b("<div id='imagepicker_line'></div>").css({width:"3px",height:"90px","background-color":"#7CBAC9",position:"absolute"}).appendTo(this.$selecteds).fadeTo(0,0);this.linerOn=!1;this.$submitButton=b('<a class="ui-button" href="#">Add more <img class="arrow-icon" src="'+
this.builderPath+'images/arrow.png"/></a>').css({position:"relative","float":"right","margin-top":"10px"}).appendTo(this.$this).click(b.proxy(this.toogleAddMore,this));this.opened=!1;this.resize();b(window).resize(b.proxy(this.resize,this));if(0!=this.active.length){for(var d=a=0;d<this.active.length;d++){for(var e=this.active[d],h=-1,g=0;g<this.availables.length;g++)if(this.availables[g].url==e){h=this.availables[g].id;break}-1!=h&&(e=this.getNewImage(e,h),e.appendTo(this.$selecteds),this.selectedImages.push(new f(e,
this,!0,a++)))}this.updateSelected();this.resize()}},toogleAddMore:function(){if(this.opened)this.opened=!1,this.$hidable.animate({height:"0px"},200);else{this.opened=!0;var a=this.$available_box.height()+this.$availableText.height()+20+6;this.$availables.width()>this.$available_box.width()&&(a+=15);this.$hidable.animate({height:a+"px"},200)}return!1},draggingPos:function(a,c){var d=this.$selected_box.offset();if(c>d.top&&c<d.top+110)if(0==this.selectedImages.length)this.linerOn||this.$liner.css({left:"10px"}).stop().fadeTo(150,
1),this.linerOn=!0,this.linerPos=0;else{for(var d=this.$selecteds.offset(),d=a-d.left,e=0;0<d;)d-=100,e++;e>this.selectedImages.length&&(e=this.selectedImages.length);this.linerOn&&this.linerPos==e||(this.linerPos=e,this.$liner.stop().fadeTo(150,0,b.proxy(function(){this.$liner.css({left:10+100*this.linerPos+"px"}).fadeTo(150,1)},this)));this.linerOn=!0;this.arrangeGrid()}else this.linerOn&&(this.$liner.stop().fadeTo(150,0),this.linerOn=!1,this.arrangeGrid())},arrangeGrid:function(){for(var a=0;a<
this.selectedImages.length;a++)this.selectedImages[a].changePos(this.selectedImages[a].pos,this.linerOn&&this.linerPos<=this.selectedImages[a].pos)},getNewImage:function(a,c){var d=b('<div class="imagepicker_image"></div>').css({width:"90px",height:"90px",overflow:"hidden",position:"absolute",top:"0px",left:"0px"});b('<img src="'+a+'" alt="image" ref="'+c+'"/>').appendTo(d).load(function(){b(this).resizeAndCenter(90,90)});return d},addSelected:function(a,c){if(this.linerOn){var d=this.getNewImage(a,
c);d.appendTo(this.$selecteds);for(var b=0;b<this.selectedImages.length;b++)this.selectedImages[b].pos>=this.linerPos&&this.selectedImages[b].pos++;this.selectedImages.push(new f(d,this,!0,this.linerPos));this.$liner.stop().fadeTo(150,0);this.linerOn=!1;this.arrangeGrid();this.updateSelected();this.resize()}},getByPos:function(a){for(var c=0;c<this.selectedImages.length;c++)if(this.selectedImages[c].pos==a)return c;return-1},getById:function(a){for(var c=0;c<this.selectedImages.length;c++)if(this.selectedImages[c].id==
a)return c;return-1},removeSelected:function(a){a=this.getByPos(a);if(-1!=a){for(var c=this.selectedImages[a].pos,b=0;b<this.selectedImages.length;b++)this.selectedImages[b].pos>c&&(this.selectedImages[b].pos--,this.selectedImages[b].updatePos(!0));this.selectedImages=removePositionInArray(this.selectedImages,a);this.updateSelected()}},changeSelected:function(a){a=this.getByPos(a);var b=this.selectedImages[a].pos;if(-1!=a){this.$liner.stop().fadeTo(150,0);this.linerOn=!1;var d=this.linerPos;b>=this.selectedImages.length&&
(b=this.selectedImages.length-1);if(b==d)this.selectedImages[a].$obj.stop().fadeTo(150,1),this.arrangeGrid();else{if(b>d)for(var e=0;e<this.selectedImages.length;e++)this.selectedImages[e].pos>=d&&this.selectedImages[e].pos<b&&this.selectedImages[e].pos++;else for(0!=d&&d--,e=0;e<this.selectedImages.length;e++)this.selectedImages[e].pos>b&&this.selectedImages[e].pos<=d&&this.selectedImages[e].pos--;this.selectedImages[a].pos=d;for(e=0;e<this.selectedImages.length;e++)this.selectedImages[e].rightToLiner=
!1,this.selectedImages[e].updatePos(!0)}}},updateSelected:function(){this.$selecteds.css("width",100*this.selectedImages.length+23+"px");this.$currentSelectedSpan.text("("+this.selectedImages.length+")")},val:function(){for(var a=[],b=0;b<this.selectedImages.length;b++)for(var d=0;d<this.selectedImages.length;d++)if(this.selectedImages[d].pos==b){a.push(this.selectedImages[d].url);break}return a.toString()},resize:function(){this.$availables.width()>this.$available_box.width()?this.$available_box.css("padding-bottom",
"15px"):this.$available_box.css("padding-bottom","0px");this.$selecteds.width()>this.$selected_box.width()?this.$selected_box.css("padding-bottom","15px"):this.$selected_box.css("padding-bottom","0px")},info:function(){return this.selectedImages.length.toString()}};return k});
