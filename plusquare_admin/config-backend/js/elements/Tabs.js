define(["jquery"],function(){var d=function(b,a,d,e){if(isNaN(a)){for(var c=0;c<e.length;c++)if(e[c]==a){a=c;break}isNaN(a)&&(a=0)}this.active=parseInt(a,10);this.values=e;this.options=d;this.tabs=$(">.ui_tabs >.ui_tab",b);this.tabsButtons=$(">.ui_tabs_menu >a",b).each(function(a){$(this).attr("rel",a)}).click($.proxy(this.click,this));this.update()};d.prototype={update:function(){this.tabsButtons.each($.proxy(function(b,a){this.active==b?$(a).addClass("active"):$(a).removeClass("active")},this));
this.tabs.each($.proxy(function(b,a){this.active==b?$(a).addClass("active"):$(a).removeClass("active")},this));$(this).trigger("change")},click:function(b){b=$(b.target).attr("rel");this.active=parseInt(b,10);this.update();return!1},val:function(b){if(void 0==b)return this.values[this.active];for(var a=0;a<this.values.length;a++)if(this.values[a]==b){this.active=a;this.update();break}}};return d});