define(["jquery","essenza/MusicPlayer","jquery/jquery.easing.1.3","utils/utils"],function(b,n){function l(){b(".blog_gallery").each(function(){var a=b(this),c=a.find(">a");if(0!=c.length){var d=a.width(),h=parseInt(a.attr("data-width"),10),a=parseInt(a.attr("data-height"),10),g=Math.floor(d/h);d-g*h>g&&(d=Math.floor(d/(g+1))-1,c.css({width:d+"px",height:Math.round(d/(h/a))+"px"}))}})}var A=function(a){jQuery(document).ready(b.proxy(function(c){this.current=-1;this.$contents=c(".tabs-content",a);this.$titles=
c(".tabs-titles",a);this.tabs=[];c(".tab",this.$contents).each(c.proxy(function(a,b){this.tabs.push(new s(c(b)))},this));this.links=[];c(">a",this.$titles).each(c.proxy(function(a,b){var g=c(b);g.attr("rel",a);g.click(c.proxy(this.tabClick,this));this.links.push(g)},this));this.changeTab(0)},this))};A.prototype={tabClick:function(a){a=parseInt(b(a.target).attr("rel"),10);this.changeTab(a);return!1},changeTab:function(a){-1!=this.current&&(this.tabs[this.current].close(),this.links[this.current].removeClass("active"));
var b=this.tabs[a].open();this.links[a].addClass("active");this.current=a;this.$contents.animate({height:b},150)}};var s=function(a){this.$tab=a;this.$tab.fadeTo(0,0);this.$tab.css({display:"none",opacity:0})};s.prototype={open:function(){this.$tab.stop().css("display","block").delay(150).fadeTo(150,1);return this.$tab.height()},close:function(){this.$tab.stop().fadeTo(150,0,function(){b(this).css("display","none")})}};var C=function(a){this.multiple=a.attr("data-multiple");this.elements=[];b("li",
a).each(b.proxy(function(a,d){this.elements.push(new B(b(d),a,b.proxy(this.changeTab,this)))},this))};C.prototype={changeTab:function(a){if("false"==this.multiple)for(var b=0;b<this.elements.length;b++)b!=a&&this.elements[b].close()}};var B=function(a,c,d){this.opened=!1;this.number=c;this.onOpen=d;this.iconNormal="fa-angle-down";this.iconActive="fa-angle-up";this.$head=b(">a",a);this.$content=b(">.content",a);this.$icon=b(">i",a);this.opened||this.$content.css("display","none");this.$head.click(b.proxy(this.toogle,
this))};B.prototype={close:function(){this.$content.is(":hidden")||this.$content.slideToggle(150,b.proxy(this.onHidingChange,this))},toogle:function(a){a.preventDefault();if(this.$content.is(":hidden"))this.onOpen(this.number);this.$content.not(":animated").slideToggle(150,b.proxy(this.onHidingChange,this));this.$icon.fadeTo(150,0);return!1},onHidingChange:function(){this.$content.is(":hidden")?(this.$head.removeClass("active"),this.$icon.removeClass(this.iconActive).addClass(this.iconNormal).fadeTo(150,
1)):(this.$head.addClass("active"),this.$icon.removeClass(this.iconNormal).addClass(this.iconActive).fadeTo(150,1));return!1}};var D=function(a){this.values=["Unchecked","Checked"];this.active=0;this.$checkbox=a;a.click(b.proxy(this.click,this));this.$active=this.$checkbox.find(".checkbox_inner");this.$input=this.$checkbox.find("input");this.update(!1)};D.prototype={update:function(a){var b=0,d=0;this.active&&(b=1);a&&(d=150);this.$active.fadeTo(d,b);this.$input.val(this.values[!0==this.active?1:
0])},click:function(){this.active=this.active?!1:!0;b(this).trigger("change");this.update(!0);return!1},val:function(a){if(void 0==a)return this.active?this.values[1]:this.values[0];this.active=a===this.values[1];this.update()},info:function(){return this.active.toString()}};var E=function(a){this.active=0;this.opened=!1;this.values=[];this.options=[];this.$combobox=a;this.$input=this.$combobox.find("input");a.css({width:150,"min-width":150});b(".combobox-option",a).each(b.proxy(function(a,d){var h=
b(d);this.options.push(h);h.attr("rel",a);this.hasOptions=!0;this.values.push(h.text())},this));this.$holder=this.$combobox.find(".combobox-holder");this.$selectedText=this.$combobox.find(".selected-text");this.$optionsHolder=this.$combobox.find(".combobox-options-holder");this.$closed_status=this.$combobox.find(".closed-status");this.$opened_status=this.$combobox.find(".opened-status");this.rebind();this.hasOptions?this.update(!1):(a.stop().fadeTo(200,0.7),this.$selectedText.text("no options"));
a.bind("changeOptions",b.proxy(this.changeOptions,this))};E.prototype={rebind:function(){this.$holder.click(b.proxy(this.click,this)).hover(b.proxy(this.interruptClose,this),b.proxy(this.closeDelay,this));for(var a=this,c=this.$combobox,d=0;d<this.options.length;d++)this.options[d].click(function(){a.active=parseInt(b(this).attr("rel"));a.update(!0);b(a).trigger("change");c.trigger("change")})},changeOptions:function(a,c,d,h){this.options=[];this.values=d;for(a=0;a<c.length;a++)d=b('<div class="combobox-option">'+
c[a]+"</div>").appendTo(this.$combobox),d.attr("rel",a),this.options.push(d);this.$options.remove();this.$options=b(".combobox-option",this.$combobox).remove();this.$options.appendTo(this.$optionsHolder);var g=this;for(a=0;a<this.options.length;a++)this.options[a].click(function(){g.active=parseInt(b(this).attr("rel"));g.update(!0);b(g).trigger("change");g.$combobox.trigger("change")});void 0!=h?this.val(h):this.update(!1)},update:function(a){var c=0;a&&(c=150);if(0>this.active||this.active>=this.options.length)this.active=
0;this.$selectedText.fadeTo(c,0,b.proxy(function(){this.$selectedText.html(this.options[this.active].html()).fadeTo(c,1)},this));this.$input.val(this.options[this.active].html());b(this).trigger("change")},open:function(){this.$holder.css({height:28+parseInt(this.$optionsHolder.height(),10)+"px"}).addClass("opened");this.$closed_status.hide();this.$opened_status.show();this.opened=!0},close:function(){this.$holder.css({height:"28px"}).removeClass("opened");this.$closed_status.show();this.$opened_status.hide();
this.opened=!1},closeDelay:function(){ismobile||(this.timer=setTimeout(b.proxy(this.close,this),300))},interruptClose:function(){ismobile||clearTimeout(this.timer)},click:function(){this.opened?this.close():this.open();return!1},val:function(a){if(void 0==a)return this.values[this.active];for(var b=0;b<this.values.length;b++)if(this.values[b]==a){this.active=b;this.update();break}},info:function(){return this.options[this.active]}};b(window).resize(function(){setTimeout(l,200)});var F=function(a,
b){var d=a.offset(),h=d.top,g=d.left,m=a.height(),e=a.width(),f="top",d="left";b.pageY>h+m/2?(f="bottom",verticalValue=h+m-b.pageY):verticalValue=b.pageY-h;b.pageX>g+e/2?(d="right",horizontalValue=g+e-b.pageX):horizontalValue=b.pageX-g;h=f;verticalValue>horizontalValue&&(h=d);return h},H=function(){function a(){p=c.width();t=c.height();if(p<u){c.css("height",Math.round(p/l));var b=p/u;g.setTransition("none");k.setTransform("scale("+b+", "+b+")")}else c.css("height",G),g.setTransition("none"),k.setTransform("scale(1, 1)");
g.height();g.setTransition(getTransition(x,y,z))}var c=b(this),d=parseFloat(c.data("shade_opacity"),10)/100,h=parseFloat(c.data("shade_over_opacity"),10)/100,g=c.find(">*"),m=c.find("div:first-child"),e=c.find(".ib_shader").css({display:"block",opacity:d}),f=c.find(".ib_over_image").css({display:"block",opacity:"0"}),k=c.find(".ib_over_text").css({display:"block",opacity:"0"}),u=parseFloat(c.data("width"),10),G=parseFloat(c.data("height"),10),l=u/G,r=c.data("transition"),x=c.data("transition_ease"),
y=c.data("transition_type"),z=c.data("transition_duration");g.setTransition(getTransition(x,y,z));var q=parseFloat(c.data("transition_ini_scale"),10)/100,v=c.data("transition_ini_rotation"),w=parseFloat(c.data("transition_scale"),10)/100,n=c.data("transition_rotation");"transformation"==r&&(f.setTransform("rotate("+v+"deg) scale("+q+", "+q+")"),m.setTransform("rotate("+v+"deg) scale("+q+", "+q+")"));var p,t;a();var s;b(window).resize(function(){clearTimeout(s);s=setTimeout(a,200)});b("html").hasClass("no-touch")&&
(c.unbind("hover"),c.hover(function(b){c.hasClass("disabled")||("mouse"==r||"mouseIn"==r?(g.setTransition("none"),g.height(),b=F(c,b),f.css("opacity","1"),"top"==b?f.css({top:-t+"px",left:"0px"}):"bottom"==b?f.css({top:t+"px",left:"0px"}):"left"==b?f.css({left:-p+"px",top:"0px"}):"right"==b&&f.css({left:p+"px",top:"0px"}),g.height(),g.setTransition(getTransition(x,y,z)),f.css({top:"0px",left:"0px"})):f.css("opacity","1"),"transformation"==r&&(f.setTransform("rotate("+n+"deg) scale("+w+", "+w+")"),
m.setTransform("rotate("+n+"deg) scale("+w+", "+w+")")),e.css("opacity",h),e.height(),k.css("opacity",1),k.height())},function(b){c.hasClass("disabled")||("mouse"==r?(b=F(c,b),f.css("opacity","1"),"top"==b?f.css("top",-t+"px"):"bottom"==b?f.css("top",t+"px"):"left"==b?f.css("left",-p+"px"):"right"==b&&f.css("left",p+"px")):f.css("opacity","0"),"transformation"==r&&(f.setTransform("rotate("+v+"deg) scale("+q+", "+q+")"),m.setTransform("rotate("+v+"deg) scale("+q+", "+q+")")),e.css("opacity",d),e.height(),
k.css("opacity",0),k.height())}))};newPqButton=function(){var a=b(this),c=a.data("background"),d=parseFloat(a.data("background_alpha"),10)/100,h=a.data("background_over"),g=parseFloat(a.data("background_alpha_over"),10)/100,m=a.data("color"),e=a.data("color_over"),f=a.data("border"),k={"border-color":a.data("border_over"),color:e},u={"border-color":f,color:m},m=a.data("tween_time"),e=a.data("tween");a.processColorAndPattern(c,d);a.addEaseAll(m,e,["border-color","color","background-color"]);a.unbind("hover");
a.hover(function(){a.hasClass("disabled")||(a.css(k),a.processColorAndPattern(h,g))},function(){a.hasClass("disabled")||(a.css(u),a.processColorAndPattern(c,d))})};return runShortcodes=function(){b(document).ready(function(){b(".single_tweet_stat").each(function(){var a=b(this),c=a.attr("data-status");b.post(adminAjax,{action:"pq_get_twitter_single_stat",frontend:!0,tweetStatus:c},function(c){a.html(c);b(document).trigger("resize_grid")})});b(".twitter_feed_short").each(function(){var a=b(this),c=
a.attr("data-user"),d=a.attr("data-number");b.post(adminAjax,{action:"pq_get_twitter_short_feed",frontend:!0,user:c,number:d},function(b){a.html(b)})});b(".behance_gallery").each(function(){var a=b(this),c=a.attr("data-id"),d=a.attr("data-type"),e=a.attr("data-number"),f=a.attr("data-width"),k=a.attr("data-height");b.post(adminAjax,{action:"pq_get_behance",frontend:!0,id:c,type:d,number:e,width:f,height:k},function(b){a.html(b);l()})});b(".dribbble_gallery").each(function(){var a=b(this),c=a.attr("data-id"),
d=a.attr("data-number"),e=a.attr("data-width"),f=a.attr("data-height");b.post(adminAjax,{action:"pq_get_dribbble",frontend:!0,id:c,number:d,width:e,height:f},function(b){a.html(b);l()})});b(".flickr_gallery").each(function(){var a=b(this),c=a.attr("data-id"),d=a.attr("data-type"),e=a.attr("data-number"),f=a.attr("data-width"),k=a.attr("data-height");b.post(adminAjax,{action:"pq_get_flickr",frontend:!0,id:c,type:d,number:e,width:f,height:k},function(b){a.html(b);l()})});var a=b(".with_sidebar");if(0<
a.length){var c=a.height();a.find(".content_wraper").height();var d=a.find(".sidebar .row-fluid").height();d>c&&a.find(".content_wraper").height(d+"px")}b(".social_video").each(function(){function a(){e.height(Math.round(e.parent().width()*f))}function c(){$close_btn=e.find(".close_button").unbind("click");e.find("iframe, .close_button").remove();e.find("a, div, img").show()}function d(){var a=e.data("src"),a=b('<iframe src="'+a+'" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'),
h=b('<a class="close_button" onclick="return false;" href="#"><div class="close_ico inside_icon"></div></a>').click(c);e.find("a, div, img").hide();e.append(a);e.append(h)}var e=b(this),f=parseFloat(e.data("height"),10)/100;a();var k;b(window).resize(function(){clearTimeout(k);k=setTimeout(a,200)});e.bind("gridResize",a);void 0!=e.data("src")&&e.find(".tooglePlayVideo").click(d)});b(".form_shortcode").each(function(){var a=b(this);a.find(".button").click(function(){a.submit();return!1});a.submit(function(){if(!a.hasClass("busy")){var c=
a.find(".on_error"),d=!0;a.find("input, textarea").each(function(a,e){$input=b(e);var h=$input.attr("type");if("hidden"!=h){var l=$input.attr("data-required"),n=$input.val();"true"==l&&""==n?(c.slideDown(250),d=!1):"true"!=l&&("false"!=l||"email"!=h||""==n)||("email"!=h||RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i).test(n))||
(c.slideDown(250),d=!1)}});if(d){a.addClass("busy");c.is(":hidden")||c.slideUp(250);var e=a.serialize(),e=e+"&action=pq_send_email&frontend=true";a.find(".button").fadeTo(300,0.4).trigger("mouseout").addClass("disabled");b.post(adminAjax,e,function(b,c){"1"!=b&&1!=b||"success"!=c?a.find(".on_error").slideDown(250):(a.find(".on_success").slideDown(250),a.find("input, textarea").val(""));a.removeClass("busy");a.find(".button").fadeTo(300,1).removeClass("disabled")})}}return!1})});b(".tabs").each(function(){new A(b(this))});
b(".checkbox").each(function(){new D(b(this))});b(".combobox").each(function(){new E(b(this))});b(".accordion").each(function(){new C(b(this))});l();b(".pq_button").each(newPqButton);b(".image_button").each(H);b(".music_player").each(function(){var a=b(this),c=a.data("url");"sound"==a.data("type")?new n(a,c):b.getJSON("http://api.soundcloud.com/resolve?url="+c+"&format=json&consumer_key=6c786345f5161898f1e1380802ce9226&callback=?",function(b){WP_DEBUG&&console.log(b);b=b.stream_url;-1==b.indexOf("secret_token")?
b+="?":b+="&";new n(a,b+"consumer_key=6c786345f5161898f1e1380802ce9226")})})})}});
