Tooltip=function(a,b,c){this.tooltipFadeTime=300;this.$tooltip=$("<div>"+b+"</div>").css({"-moz-font-feature-settings":"normal","-moz-font-language-override":"normal",display:"inline-block","pointer-events":"none",position:"absolute","text-align":"center","text-decoration":"none",padding:"2px 5px","padding-top":"3px","z-index":"2","background-image":"url("+c+"images/page_builder/General/tile.png)",border:"solid 1px #767676"}).appendTo($("body"));this.$tooltip.processFont("AllerRegular","#000000",
12);this.$tooltip.addRoundCorners(3);this.$obj=a;this.$tooltip.stop().fadeTo(0,0);this.$obj.bind(mouseOverBind,$.proxy(this.over,this));this.$obj.bind(mouseOutBind,$.proxy(this.out,this))};
Tooltip.prototype={rebind:function(){this.$obj.unbind(mouseOverBind);this.$obj.unbind(mouseOutBind);this.$obj.bind(mouseOverBind,$.proxy(this.over,this));this.$obj.bind(mouseOutBind,$.proxy(this.out,this));this.out()},updateTooltipPosition:function(a){var b=a.pageX;a=a.pageY+parseInt(this.$tooltip.height(),10)+5;this.$tooltip.css({top:a,left:b+10})},over:function(a){this.$obj.hasClass("disabled")||(this.updateTooltipPosition(a),this.$tooltip.stop().fadeTo(this.tooltipFadeTime,1),$(document).bind(mouseMoveBind,
$.proxy(this.move,this)))},out:function(){$(document).unbind(mouseMoveBind,$.proxy(this.move,this));this.$tooltip.stop().fadeTo(this.tooltipFadeTime,0)},move:function(a){this.updateTooltipPosition(a);return!1},remove:function(){this.$tooltip.remove()}};
