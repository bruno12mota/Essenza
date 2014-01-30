define(["jquery","elements/Combobox"],function(b,k){var f=function(a,c){jQuery(document).ready(b.proxy(function(b){this.id=a;this.sizing=c;this.$input=b("#"+this.id);this.sizing&&(this.$input_sizing=b("#"+this.id+"_sizing"));this.$button=b("#"+this.id+"_button");this.$grid=b("#"+this.id+"_grid");this.$gridHolder=b("#"+this.id+"_grid_holder");this.items=[];this.frame=wp.media({title:"Pick the images for this work",multiple:!0,library:{type:"image"},button:{text:"Insert"}});this.$button.click(b.proxy(this.buttonClick,
this));this.init();this.$input.bind("update",b.proxy(this.init,this))},this))};f.prototype={init:function(){var a=this.$input.val();this.items=[];this.$grid.empty();""!=a&&null!=a&&a.split(",").forEach(b.proxy(function(a){null!=a&&(" "!=a&&""!=a)&&this.addItem(a)},this));if(this.sizing&&(a=this.$input_sizing.val(),""!=a&&null!=a))for(var a=a.split(","),c=0;c<a.length;c++)void 0!=this.items[c].comboBox&&this.items[c].comboBox.val(a[c])},buttonClick:function(a){this.frame.on("close",b.proxy(this.frameClose,
this));this.frame.on("open",b.proxy(this.frameOpen,this));this.frame.open();return!1},addVideo:function(a,c,b){this.addItem(("youtube"==a?"y":"vimeo"==a?"v":"d")+c+":"+b);this.updateInput();this.resizeGrid()},addItem:function(a){a=new h(a,this.items.length,this.sizing);this.items.push(a);this.$grid.append(a.$item);b(a).bind("itemRemoved",b.proxy(this.itemRemoved,this));b(a).bind("itemStartDrag",b.proxy(this.itemStartDrag,this));b(a).bind("itemMove",b.proxy(this.itemMove,this));this.sizing&&a.comboDiv.bind("change",
b.proxy(this.updateInput,this))},frameOpen:function(){var a=this.frame.state().get("selection");this.$input.val().split(",").forEach(function(b){b=wp.media.attachment(b);b.fetch();a.add(b?[b]:[])})},frameClose:function(){var a=[];this.frame.state().get("selection").forEach(b.proxy(function(b){b=b.id;null!=b&&(" "!=b&&""!=b)&&(this.itemExists(b)||this.addItem(b),a.push(b))},this));b.each(this.items,b.proxy(function(b,d){for(var e=!1,g=0;g<a.length;g++)if(a[g]==d.id){e=!0;break}e||d.remove()},this));
this.updateInput();this.resizeGrid()},updateInput:function(){var a=[];if(this.sizing)var c=[];b.each(this.items,b.proxy(function(b,e){a.push(e.id);this.sizing&&c.push(e.getSizing())},this));this.$input.val(a.toString()).trigger("change");this.sizing&&this.$input_sizing.val(c.toString())},resizeGrid:function(){this.$grid.css("width",165*this.items.length+"px")},itemExists:function(a){var c=!1;b.each(this.items,function(b,e){if(e.id==a)return c=!0});return c},itemStartDrag:function(){this.gridLeft=
this.$grid.offset().left},itemMove:function(a,b,d){a=b-this.gridLeft;a=77>a?0:Math.round(a/165);a>this.items.length&&(a=this.items.length);d!=a&&d+1!=a&&this.changeItemPosition(d,a<d?a:a-1)},changeItemPosition:function(a,c){var d=this.items[a];d.$item.remove();0==c?this.$grid.prepend(d.$item):b(">div:nth-child("+c+")",this.$grid).after(d.$item);d.rebind();this.items=removePositionInArray(this.items,a);this.items.splice(c,0,d);this.updateItemsIds();this.updateInput()},updateItemsIds:function(){b.each(this.items,
function(a,b){b.gridId=a})},itemRemoved:function(a,b){this.$input.val().split(",");for(var d=[],e=0;e<this.items.length;e++)this.items[e].id!=b&&d.push(this.items[e]);this.items=d;this.updateItemsIds();this.updateInput()}};var h=function(a,c,d){this.id=a;this.gridId=c;this.sizing=d;a=a.toString();this.isVideo="y"==a.charAt(0)||"v"==a.charAt(0)||"d"==a.charAt(0);this.$item=b("<div class='item'></div>");c=b("<div class='item-inner'></div>").appendTo(this.$item);var e=b("<div class='img'></div>").appendTo(c),
g=b("<img src='' />");this.$dragArea=b("<div class='dragArea'></div>").appendTo(e);var f=b("<div class='buttons'></div>").appendTo(e),h=b("<a href='' class='edit' target='_blank'></a>");this.$removeButton=b("<a href='#' class='remove'></a>").appendTo(f).click(b.proxy(this.remove,this));this.isVideo&&(e.addClass(a.charAt(0)+"video"),a=a.split(":")[1]);wp.media.attachment(a).fetch();jQuery.post(adminAjax,{action:"pq_get_attachment",attachmentID:a,width:135,height:90,crop:"true"},function(a){!0==a.success&&
(g.attr("src",a.data.url).prependTo(e),h.attr("href",a.data.editLink).prependTo(f))});d&&(this.comboDiv=b("<div></div>").appendTo(c),this.comboBox=new k(this.comboDiv,0,["Normal","Fit","Fullscreen"],["normal","fit","full"],"100%"));this.$dragArea.bind(mouseDownBind,b.proxy(this.startDragging,this))};h.prototype={getSizing:function(){return this.comboBox.val()},rebind:function(){this.$dragArea.unbind(mouseDownBind);this.$dragArea.bind(mouseDownBind,b.proxy(this.startDragging,this));this.$removeButton.unbind("click");
this.$removeButton.click(b.proxy(this.remove,this));this.sizing&&this.comboBox.rebind()},remove:function(){this.$item.remove();b(this).trigger("itemRemoved",this.id);return!1},startDragging:function(a){this.$dragArea.addClass("active");this.$draggingObj=this.$item.clone().appendTo(b("body"));this.$item.stop().fadeTo(200,0.5);var c=this.$item.offset();this.x=a.pageX;this.y=a.pageY;this.posX=c.left;this.posY=c.top;this.$draggingObj.css({position:"absolute"});this.updateDraggingObj();b(document).bind(mouseMoveBind,
b.proxy(this.move,this));b(document).bind(mouseUpBind,b.proxy(this.stopDragging,this));b(this).trigger("itemStartDrag");return!1},updateDraggingObj:function(){this.$draggingObj.css({top:this.posY,left:this.posX})},move:function(a){var c=a.pageX;a=a.pageY;this.posX+=c-this.x;this.posY+=a-this.y;this.x=c;this.y=a;this.updateDraggingObj();b(this).trigger("itemMove",[this.posX+70,this.gridId]);return!1},stopDragging:function(){b(document).unbind(mouseMoveBind);b(document).unbind(mouseUpBind);this.$dragArea.removeClass("active");
this.$item.stop().fadeTo(200,1);var a=this.$item.offset();this.$draggingObj.stop().animate({opacity:0,top:a.top,left:a.left},300,function(){b(this).remove()});return!1}};return f});
