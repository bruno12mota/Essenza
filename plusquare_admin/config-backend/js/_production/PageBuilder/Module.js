define(["jquery","Lightbox/Lightbox","libraries/jquery.mobile.vmouse","ui-elements","libraries/inheritance"],function(a,m){var f=Class.extend({updateDraggingPos:function(){var b=(this.currentTopTo-this.currentTop)/2;this.currentLeft+=(this.currentLeftTo-this.currentLeft)/2;this.currentTop+=b;this.$objectDragging.css({left:this.currentLeft,top:this.currentTop});this.draggingTimeout=setTimeout(a.proxy(this.updateDraggingPos,this),30);return!1},dragMove:function(b){var c=b.pageX;b=b.pageY;this.currentLeftTo+=
c-this.currentX;this.currentTopTo+=b-this.currentY;this.currentX=c;this.currentY=b;"module"==this.type?a(this).trigger("moduleMove",[c,b]):a(this).trigger("moduleMove",[c-this.leftDown,b]);return!1}}),n=f.extend({init:function(b,c){this.shortcode=b.shortcode;this.$viewHolder=c;this.parameters={};a.each(b.options,a.proxy(function(b,c){"tabs"==c.type||"tabs_unbinded"==c.type?"tabs"==c.type?(this.parameters[c.id]={associate:c.associate,value:void 0!=c["default"]?c["default"]:"",tabs:!0},a.each(c.tabs,
a.proxy(function(b,c){a.each(c,a.proxy(function(a,c){this.parameters[c.id]={associate:c.associate,value:void 0!=c["default"]?c["default"]:"",tab:b}},this))},this))):a.each(c.tabs,a.proxy(function(b,c){a.each(c,a.proxy(function(a,b){this.parameters[b.id]={associate:b.associate,value:void 0!=b["default"]?b["default"]:""}},this))},this)):this.parameters[c.id]={associate:c.associate,value:void 0!=c["default"]?c["default"]:""}},this));this.info=b;this.built=!1;this.type="module";this.$obj=a("<div class='module'></div>").stop().css("margin-top",
"8px").fadeTo(0,0);this.$obj1=a("<div class='componentModule'></div>").css({"border-color":this.info.color}).appendTo(this.$obj)},build:function(){this.$head=a("<div class='headArea'>"+this.info.name+"<img src='"+builderPath+this.info.icon+"' alt='module icon'/></div>").css({color:this.info.color}).appendTo(this.$obj1);this.$info=a("<div class='infoArea'>Click 'edit' to change...</div>").appendTo(this.$obj1);this.$menuHolder=a("<div class='menuArea'></div>").appendTo(this.$obj1);var b=a("<a href='#' class='smallicon delete-icon'></a>").appendTo(this.$menuHolder).click(a.proxy(this.remove,
this));this.deleteTooltip=new Tooltip(b,"Delete Module",builderPath);b=a("<a href='#' class='smallicon duplicate-icon'></a>").appendTo(this.$menuHolder).click(a.proxy(this.duplicate,this));this.duplicateTooltip=new Tooltip(b,"Duplicate Module",builderPath);b=a("<a href='#' class='smallicon edit-icon'></a>").appendTo(this.$menuHolder).click(a.proxy(this.edit,this));this.editTooltip=new Tooltip(b,"Edit Module",builderPath);this.$head.preventDragDefault();this.$head.addClass("grabhand");this.$head.bind(mouseDownBind,
a.proxy(this.dragDown,this));this.$obj.css({"background-color":"#fff"});this.$obj.stop(!0,!0).fadeTo(300,1);this.built=!0},rebind:function(){if(this.built){this.$head.addClass("grabhand");this.$head.unbind(mouseDownBind);this.$head.bind(mouseDownBind,a.proxy(this.dragDown,this));var b=a(".delete-icon",this.$obj);b.unbind("click");b.click(a.proxy(this.remove,this));b=a(".duplicate-icon",this.$obj);b.unbind("click");b.click(a.proxy(this.duplicate,this));b=a(".edit-icon",this.$obj);b.unbind("click");
b.click(a.proxy(this.edit,this));this.$obj.fadeTo(0,1)}},dragDown:function(b){this.$head.addClass("down");this.currentX=b.pageX;this.currentY=b.pageY;b=void 0==this.$viewHolder?a("#page_builder .viewHolder"):this.$viewHolder;var c=this.$obj.offset(),d=b.offset();this.currentLeft=c.left-d.left;this.currentTop=c.top-d.top;this.currentLeftTo=this.currentLeft;this.currentTopTo=this.currentTop;this.$objectDragging=this.$obj.clone();this.$objectDragging.css({position:"absolute",width:this.$obj.width()+
"px",left:this.currentLeftTo+"px",top:this.currentTopTo+"px"}).appendTo(b);this.$objectDragging.css("z-index",3);this.$obj.stop().fadeTo(200,0.2);this.draggingTimeout=setTimeout(a.proxy(this.updateDraggingPos,this),30);a(document).bind(mouseMoveBind,a.proxy(this.dragMove,this));a(document).bind(mouseUpBind,a.proxy(this.dragUp,this));a(this).trigger("moduleDown",[this.placeholder])},dragUp:function(){unbindMoveAndUp();clearTimeout(this.draggingTimeout);this.$obj.fadeTo(200,1);this.$objectDragging.stop().fadeTo(200,
0,function(){a(this).remove()});a(this).trigger("moduleUp");this.$head.removeClass("down");this.rebind();return!1},removeTooltips:function(){this.deleteTooltip.remove();this.duplicateTooltip.remove();this.editTooltip.remove()},remove:function(){this.$obj.stop(!0,!0).fadeTo(200,0,a.proxy(function(){this.removeTooltips()},this));a(this).trigger("moduleDelete");return!1},duplicate:function(){var b=new n(this.info,this.$viewHolder);a.each(this.parameters,a.proxy(function(a,d){b.parameters[a].value=d.value}));
a(this).trigger("moduleDuplicate",b);return!1},edit:function(){this.edit_lightbox=new m("Edit "+this.info.name,builderPath,a.proxy(this.saveEdit,this));jQuery.post(adminAjax,{action:"pq_get_shortcode_options",shortcode:this.shortcode},a.proxy(function(b){this.edit_lightbox.addContent(b);a.each(this.parameters,function(b,d){a("#"+b).val(d.value).trigger("update")})},this));return!1},saveEdit:function(){a.each(this.parameters,function(b,c){c.value=a("#"+b).val();"content"!=c.associate&&(c.value=c.value.toString().replace(/"/g,
"&quote;"),c.value=c.value.toString().replace(/(\r\n|\n|\r)/gm,""));"\n"==c.value[c.value.length-1]&&(c.value=c.value.substring(0,c.value.length-1))});this.edit_lightbox.closeEdit();a("#page_builder_tab").trigger("save");a(this).trigger("changed");return!1}}),p=f.extend({init:function(b,c,d,e){this.number=d;this.built=!1;this.priority=3;this.components=[];this.type="placeholder";this.resizable=void 0==e?!0:e;this.options={use_paddings:"false",padding:"",content_align:"left"};this.$obj=a("<div class='module' style='position:absolute;'></div>");
this.$obj1=a("<div class='placeholderModule' style='height:100%;'></div>").appendTo(this.$obj);this.$overObj=a("<div class='placeholder-inner'></div>").appendTo(this.$obj1).fadeTo(0,0);this.$dragArea=a("<div class='headDragArea'></div>");this.$head=a("<div class='headArea'></div>").appendTo(this.$overObj).append(this.$dragArea).append("<div>Placeholder</div>");this.$deleteButton=a("<a href='#' class='smallicon delete-icon'></a>").appendTo(this.$head).click(a.proxy(this.remove,this));this.deleteTooltip=
new Tooltip(this.$deleteButton,"Delete Module",builderPath);this.$componentsHolder=a("<div class='componentsHolder'></div>").appendTo(this.$overObj);this.$dropArea=a("<div class='dropArea'>Drop a module in here</div>").appendTo(this.$overObj);this.$dropAreaAlert=a("<div class='dropAreaAlert'></div>").appendTo(this.$dropArea);this.$menuHolder=a("<div class='menuArea'></div>").appendTo(this.$overObj);this.resizable&&(this.$settingsButton=a("<a href='#' class='smallicon settings-icon' alt='Placeholder Settings' style='float: left;'></a>").appendTo(this.$menuHolder).click(a.proxy(this.edit,
this)),this.$plusButton=a("<a href='#' class='smallicon plus-icon' alt='Increase module width'></a>").appendTo(this.$menuHolder).click(a.proxy(this.increaseWidth,this)),this.$sizeText=a("<div class='size_text'>1/1</div>").appendTo(this.$menuHolder),this.$minusButton=a("<a href='#' class='smallicon decrease-icon' alt='Decrease module width'></a>").appendTo(this.$menuHolder).click(a.proxy(this.decreaseWidth,this)),this.settingsTooltip=new Tooltip(this.$settingsButton,"Placeholder Settings",builderPath),
this.minusTooltip=new Tooltip(this.$minusButton,"Decrease Width",builderPath),this.plusTooltip=new Tooltip(this.$plusButton,"Increase Width",builderPath));this.$head.preventDragDefault();this.line=-1;this.column=c;this.size=b;this.offset=0;this.update(!1)},show:function(){this.$obj.css({position:"",left:"",top:"",height:""});this.$obj1.css("width","");this.$obj1.css("height","");this.$overObj.stop().fadeTo(400,1)},rebind:function(){this.$head.addClass("grabhand");this.$head.addClass("grabhand");this.$dragArea.unbind(mouseDownBind);
this.$dragArea.bind(mouseDownBind,a.proxy(this.dragDown,this));this.resizable&&(this.$settingsButton.unbind("click"),this.$plusButton.unbind("click"),this.$minusButton.unbind("click"),this.$deleteButton.unbind("click"),this.$settingsButton.click(a.proxy(this.edit,this)),this.$plusButton.click(a.proxy(this.increaseWidth,this)),this.$minusButton.click(a.proxy(this.decreaseWidth,this)),this.$deleteButton.click(a.proxy(this.remove,this)),this.settingsTooltip.rebind(),this.minusTooltip.rebind(),this.plusTooltip.rebind());
a.each(this.components,function(a,c){c.rebind()})},getHtml:function(b,c){var d="";void 0==c&&(c=!0);c&&(d+='[column size="'+this.size+'" offset="'+b+'" content_align="'+this.options.content_align+'" use_paddings="'+this.options.use_paddings+'" padding="'+this.options.padding+'"] ');for(var e=0;e<this.components.length;e++){var g=this.getComponent(e),d=d+("["+g.shortcode+" "),h=!1,k="",l=null;a.each(g.parameters,function(a,b){b.hasOwnProperty("tab")||(l=null);null!=l?b.tab==l&&("content"!=b.associate?
d+=b.associate+'="'+b.value+'" ':(h=!0,k=b.value)):(b.hasOwnProperty("tabs")&&(l=b.value),"content"!=b.associate?d+=b.associate+'="'+b.value+'" ':(h=!0,k=b.value))});d+="]";h&&(d+=k);d+="[/"+g.info.shortcode+"]"}c&&(d+="[/column]");return d},componentAbove:function(a){this.$dropArea.css("border-color",a);this.$dropAreaAlert.css("border","4px solid "+a);this.$dropAreaAlert.addClass("active")},cancelAbove:function(){this.$dropArea.css("border-color","");this.$dropAreaAlert.css("border","0px");this.$dropAreaAlert.removeClass("active")},
addComponent:function(b){this.cancelAbove();b.number=this.components.length;b.position=this.components.length;b.placeholder=this.number;this.$componentsHolder.append(b.$obj);this.components.push(b);b.rebind();a(b).bind("moduleDelete",a.proxy(this.removeComponentEvent,this));a(b).bind("moduleDuplicate",a.proxy(this.duplicateComponentEvent,this));this.organizeComponents()},duplicateComponentEvent:function(b,c){this.addComponent(c);a(this).trigger("moduleDuplicateInsert",c);c.build()},removeFromGrid:function(b){var c=
b.position;b.$obj.remove();a.each(this.components,function(a,b){b.position>c&&b.position--})},removeComponent:function(b){var c=this.components[b];a(c).unbind("moduleDelete");a(c).unbind("moduleDuplicate");this.removeFromGrid(c);this.components=removePositionInArray(this.components,b);a.each(this.components,function(a,b){b.number=a});this.organizeComponents();a(this).trigger("change")},removeComponentEvent:function(a){this.removeComponent(a.target.number)},movingComponent:function(a,c){if(c>=this.components.length)WP_DEBUG&&
console.log("error moving component");else{for(var d=this.$componentsHolder.offset(),d=a-d.top,e=this.components[c].position,g=this.components.length-1,h=0,k=0,l=0;l<this.components.length;l++){var f=this.getComponent(k),h=h+(f.$obj.height()+8);if(d<h){g=k;break}k++}g!=e&&(this.moveComponentTo(this.components[c],g),this.organizeComponents())}},getComponent:function(a){for(var c=0;c<this.components.length;c++)if(this.components[c].position==a)return this.components[c];return null},organizeComponents:function(){},
moveComponentTo:function(b,c){this.removeFromGrid(b);0===c?this.$componentsHolder.prepend(b.$obj):a(">div:nth-child("+c+")",this.$componentsHolder).after(b.$obj);a.each(this.components,function(a,b){b.position>=c&&b.position++});b.position=c},update:function(b){if(!0!==this.removing){void 0==b&&(b=!0);var c=100*(this.size/12)-0.1,d=100*(this.offset/12)+0.05,e=this.opacity;this.$obj.stop().css({"margin-left":d+"%"});b?this.$obj.animate({width:c+"%",opacity:e},400,a.proxy(this.organizeComponents,this)):
this.$obj.stop().css({width:c+"%",opacity:e});this.updateSizeText()}},changeOffset:function(a){a!=this.offset&&(this.offset=a,this.update(!0))},dragDown:function(b){this.$head.addClass("down");this.currentX=b.pageX;this.currentY=b.pageY;b=a("#page_builder .linesHolder");var c=b.offset(),d=this.$obj.offset();this.leftDown=this.currentX-d.left;this.currentLeft=d.left-c.left;this.currentTop=d.top-c.top;this.currentLeftTo=this.currentLeft;this.currentTopTo=this.currentTop;a(document).bind(mouseMoveBind,
a.proxy(this.dragMove,this));a(document).bind(mouseUpBind,a.proxy(this.dragUp,this));this.$objectDragging=this.$obj.clone();this.$objectDragging.css({"z-index":3,position:"absolute","margin-left":"0",opacity:"0.5","transform-origin":this.currentX-d.left+"px "+(this.currentY-d.top)+"px"}).appendTo(b);this.$objectDragging.height();this.$objectDragging.addClass("dragger");this.opacity=0.3;this.update();this.updateDraggingPos();this.draggingTimeout=setTimeout(a.proxy(this.updateDraggingPos,this),30);
a(this).trigger("moduleDown",[this.number,this.line,this.column]);return!1},dragUp:function(){unbindMoveAndUp();clearTimeout(this.draggingTimeout);this.opacity=1;this.update();this.$objectDragging.stop().fadeTo(200,0,a.proxy(function(){this.$objectDragging.remove()},this));a(this).trigger("moduleUp");this.$head.removeClass("down");return!1},updateSizeText:function(){if(this.resizable){12==this.size?this.$plusButton.css("background-image","url("+builderPath+"images/page_builder/Blocks/increase_width_disabled.png)"):
this.$plusButton.css("background-image","url("+builderPath+"images/page_builder/Blocks/increase_width_enabled.png)");2==this.size?this.$minusButton.css("background-image","url("+builderPath+"images/page_builder/Blocks/decrease_width_disabled.png)"):this.$minusButton.css("background-image","url("+builderPath+"images/page_builder/Blocks/decrease_width_enabled.png)");var a=this.size+"/12";switch(this.size){case 2:a="1/6";break;case 3:a="1/4";break;case 4:a="4/12";break;case 6:a="1/2";break;case 8:a=
"2/3";break;case 9:a="3/4";break;case 10:a="5/6";break;case 12:a="1/1"}this.$sizeText.text(a)}},decreaseWidth:function(){2<this.size&&this.size--;this.update(!0);a(this).trigger("moduleResize");return!1},increaseWidth:function(){12>this.size&&this.size++;this.update(!0);a(this).trigger("moduleResize");return!1},removeTooltips:function(){this.resizable&&(this.minusTooltip.remove(),this.plusTooltip.remove());this.deleteTooltip.remove()},remove:function(){this.removing=!0;this.$obj.stop(!0,!0).fadeTo(200,
0,a.proxy(function(){this.$obj.remove();this.removeTooltips();a(this).trigger("moduleDelete",[this.number])},this));return!1},removeQuick:function(){this.removing=!0;this.removeTooltips();this.$obj.remove()},edit:function(){this.edit_lightbox=new m("Edit Placeholder",builderPath,a.proxy(this.saveEdit,this));jQuery.post(adminAjax,{action:"pq_get_shortcode_options",shortcode:"column"},a.proxy(function(b){this.edit_lightbox.addContent(b);a("#colum_content_alignment").val(this.options.content_align).trigger("update");
""!=this.options.padding&&(a("#column_use_paddings").val(this.options.use_paddings).trigger("update"),b=this.options.padding.split(" "),a("#colum_top_padding").val(parseInt(b[0],10)),a("#colum_right_padding").val(parseInt(b[1],10)),a("#colum_bottom_padding").val(parseInt(b[2],10)),a("#colum_left_padding").val(parseInt(b[3],10)))},this));return!1},saveEdit:function(){this.options.content_align=a("#colum_content_alignment").val();this.options.use_paddings=a("#column_use_paddings").val();this.options.padding=
a("#colum_top_padding").val()+"px "+a("#colum_right_padding").val()+"px "+a("#colum_bottom_padding").val()+"px "+a("#colum_left_padding").val()+"px";this.edit_lightbox.closeEdit();return!1}}),f=f.extend({init:function(b,c){this.number=c;this.resizable=!1;this.priority=0;this.type="pagebreak";this.$obj=a("<div class='module'></div>");this.$obj1=a("<div class='pagebreakModule'></div>").appendTo(this.$obj);this.$overObj=a("<div class='pagebreakModule-inner'>From this point below content will be in a new page!</div>").appendTo(this.$obj1);
this.$deleteButton=a("<a href='#' class='smallicon delete-icon'></a>").appendTo(this.$overObj).click(a.proxy(this.remove,this));this.$obj.preventDragDefault();this.line=b;this.column=0;this.size=12;this.offset=0;this.opacity=1;this.update(!1)},rebind:function(){this.$obj.addClass("grabhand");this.$obj.unbind(mouseDownBind);this.$obj.bind(mouseDownBind,a.proxy(this.dragDown,this));this.$deleteButton.unbind("click");this.$deleteButton.click(a.proxy(this.remove,this))},getHtml:function(a,c){return"\x3c!--nextpage--\x3e"},
changeOffset:function(){},update:function(b){if(!0!==this.removing){void 0==b&&(b=!0);var c=100*(this.size/12)-0.1,d=100*(this.offset/12)+0.05,e=this.opacity;this.$obj.stop().css({"margin-left":d+"%"});b?this.$obj.animate({width:c+"%",opacity:e},400,a.proxy(this.organizeComponents,this)):this.$obj.stop().css({width:c+"%",opacity:e})}},dragDown:function(b){if(a(b.target).hasClass("delete-icon"))return!0;this.$obj.addClass("down");this.currentX=b.pageX;this.currentY=b.pageY;b=a("#page_builder .linesHolder");
var c=b.offset(),d=this.$obj.offset();this.leftDown=this.currentX-d.left;this.currentLeft=d.left-c.left;this.currentTop=d.top-c.top;this.currentLeftTo=this.currentLeft;this.currentTopTo=this.currentTop;a(document).bind(mouseMoveBind,a.proxy(this.dragMove,this));a(document).bind(mouseUpBind,a.proxy(this.dragUp,this));this.$objectDragging=this.$obj.clone();this.$objectDragging.css({"z-index":3,position:"absolute","margin-left":"0"}).appendTo(b);this.opacity=0.3;this.update();this.updateDraggingPos();
this.draggingTimeout=setTimeout(a.proxy(this.updateDraggingPos,this),30);a(this).trigger("moduleDown",[this.number,this.line,this.column]);return!1},dragUp:function(){unbindMoveAndUp();clearTimeout(this.draggingTimeout);this.opacity=1;this.update();this.$objectDragging.stop().fadeTo(200,0,a.proxy(function(){this.$objectDragging.remove()},this));a(this).trigger("moduleUp");this.$obj.removeClass("down");return!1},remove:function(){this.removing=!0;this.$obj.stop(!0,!0).fadeTo(200,0,a.proxy(function(){this.$obj.remove();
a(this).trigger("moduleDelete",[this.number])},this));return!1}});return{Component:n,Placeholder:p,Pagebreak:f}});
