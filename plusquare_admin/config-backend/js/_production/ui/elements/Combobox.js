define(["jquery"],function(c){var h=function(a,b,d,g,f){if("string"==typeof b){for(var e=0;e<g.length;e++)if(g[e]==b){b=e;break}isNaN(b)&&(b=0)}"string"==typeof b&&(b=0);this.active=parseInt(b,10);this.opened=!1;this.values=g;this.options=[];this.$combobox=a;void 0!=f&&a.css({width:f,"min-width":f});if(void 0==d)c(".combobox-option",a).each(c.proxy(function(a,b){this.options.push(c(b));c(b).attr("rel",a)},this)),this.hasOptions=!0;else for(e=0;e<d.length;e++)b=c('<div class="combobox-option">'+d[e]+
"</div>").appendTo(a),b.attr("rel",e),this.options.push(b),this.hasOptions=!0;a.addClass("ui-combobox");this.$options=c(".combobox-option",a).remove();this.$holder=c("<div class='combobox-holder'></div>").appendTo(a);this.$selectedText=c("<div class='selected-text'></div>").appendTo(this.$holder);this.$optionsHolder=c("<div class='combobox-options-holder'></div>").appendTo(this.$holder);this.$options.appendTo(this.$optionsHolder);this.rebind();this.hasOptions?this.update(!1):(a.stop().fadeTo(200,
0.7),this.$selectedText.text("no options"));a.bind("changeOptions",c.proxy(this.changeOptions,this))};h.prototype={rebind:function(){this.$holder.click(c.proxy(this.click,this)).hover(c.proxy(this.interruptClose,this),c.proxy(this.closeDelay,this));for(var a=this,b=this.$combobox,d=0;d<this.options.length;d++)this.options[d].click(function(){a.active=parseInt(c(this).attr("rel"));a.update(!0);c(a).trigger("change");b.trigger("change")})},changeOptions:function(a,b,d,g){this.options=[];this.values=
d;for(a=0;a<b.length;a++)d=c('<div class="combobox-option">'+b[a]+"</div>").appendTo(this.$combobox),d.attr("rel",a),this.options.push(d);this.$options.remove();this.$options=c(".combobox-option",this.$combobox).remove();this.$options.appendTo(this.$optionsHolder);var f=this;for(a=0;a<this.options.length;a++)this.options[a].click(function(){f.active=parseInt(c(this).attr("rel"));f.update(!0);c(f).trigger("change");f.$combobox.trigger("change")});void 0!=g?this.val(g):this.update(!1)},update:function(a){var b=
0;a&&(b=150);this.$selectedText.fadeTo(b,0,c.proxy(function(){if(0>this.active||this.active>=this.options.length)this.active=0;this.$selectedText.html(this.options[this.active].html()).fadeTo(b,1)},this));c(this).trigger("change")},open:function(){this.$holder.css({height:28+parseInt(this.$optionsHolder.height(),10)+"px"}).addClass("opened");this.opened=!0},close:function(){this.$holder.css({height:"28px"}).removeClass("opened");this.opened=!1},closeDelay:function(){this.timer=setTimeout(c.proxy(this.close,
this),300)},interruptClose:function(){clearTimeout(this.timer)},click:function(){this.opened?this.close():this.open();return!1},val:function(a){if(void 0==a)return this.values[this.active];for(var b=0;b<this.values.length;b++)if(this.values[b]==a){this.active=b;this.update();break}},info:function(){return this.options[this.active]}};return h});
