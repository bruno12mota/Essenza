define(["jquery","essenza/MusicPlayer"],function(c,l){function r(){c(".blog_gallery").each(function(){var a=c(this),b=a.width(),g=a.find(">a"),e=parseInt(a.attr("data-width"),10),a=parseInt(a.attr("data-height"),10),h=Math.floor(b/e);b-h*e>h&&(b=Math.floor(b/(h+1))-1,g.css({width:b+"px",height:Math.round(b/(e/a))+"px"}))})}var A=function(a){jQuery(document).ready(c.proxy(function(b){this.current=-1;this.$contents=b(".tabs-content",a);this.$titles=b(".tabs-titles",a);this.tabs=[];b(".tab",this.$contents).each(b.proxy(function(a,
e){this.tabs.push(new z(b(e)))},this));this.links=[];b(">a",this.$titles).each(b.proxy(function(a,e){var c=b(e);c.attr("rel",a);c.click(b.proxy(this.tabClick,this));this.links.push(c)},this));this.changeTab(0)},this))};A.prototype={tabClick:function(a){a=parseInt(c(a.target).attr("rel"),10);this.changeTab(a);return!1},changeTab:function(a){-1!=this.current&&(this.tabs[this.current].close(),this.links[this.current].removeClass("active"));var b=this.tabs[a].open();this.links[a].addClass("active");this.current=
a;this.$contents.animate({height:b},150)}};var z=function(a){this.$tab=a;this.$tab.fadeTo(0,0);this.$tab.css({display:"none",opacity:0})};z.prototype={open:function(){this.$tab.stop().css("display","block").delay(150).fadeTo(150,1);return this.$tab.height()},close:function(){this.$tab.stop().fadeTo(150,0,function(){c(this).css("display","none")})}};var C=function(a){this.multiple=a.attr("data-multiple");this.elements=[];c("li",a).each(c.proxy(function(a,g){this.elements.push(new B(c(g),a,c.proxy(this.changeTab,
this)))},this))};C.prototype={changeTab:function(a){if("false"==this.multiple)for(var b=0;b<this.elements.length;b++)b!=a&&this.elements[b].close()}};var B=function(a,b,g){this.opened=!1;this.number=b;this.onOpen=g;this.iconNormal="fa-angle-down";this.iconActive="fa-angle-up";this.$head=c(">a",a);this.$content=c(">.content",a);this.$icon=c(">i",a);this.opened||this.$content.css("display","none");this.$head.click(c.proxy(this.toogle,this))};B.prototype={close:function(){this.$content.is(":hidden")||
this.$content.slideToggle(150,c.proxy(this.onHidingChange,this))},toogle:function(a){a.preventDefault();if(this.$content.is(":hidden"))this.onOpen(this.number);this.$content.not(":animated").slideToggle(150,c.proxy(this.onHidingChange,this));this.$icon.fadeTo(150,0);return!1},onHidingChange:function(){this.$content.is(":hidden")?(this.$head.removeClass("active"),this.$icon.removeClass(this.iconActive).addClass(this.iconNormal).fadeTo(150,1)):(this.$head.addClass("active"),this.$icon.removeClass(this.iconNormal).addClass(this.iconActive).fadeTo(150,
1));return!1}};c(window).resize(function(){setTimeout(r,200)});var D=function(a,b){var c=a.offset(),e=c.top,h=c.left,k=a.height(),d=a.width(),f="top",c="left";b.pageY>e+k/2?(f="bottom",verticalValue=e+k-b.pageY):verticalValue=b.pageY-e;b.pageX>h+d/2?(c="right",horizontalValue=h+d-b.pageX):horizontalValue=b.pageX-h;e=f;verticalValue>horizontalValue&&(e=c);return e},G=function(){function a(){m=b.width();s=b.height();if(m<t){b.css("height",Math.round(m/F));var a=m/t;h.setTransition("none");p.setTransform("scale("+
a+", "+a+")")}else b.css("height",E),h.setTransition("none"),p.setTransform("scale(1, 1)");h.height();h.setTransition(getTransition(w,x,y))}var b=c(this),g=parseFloat(b.data("shade_opacity"),10)/100,e=parseFloat(b.data("shade_over_opacity"),10)/100,h=b.find(">*"),k=b.find("div:first-child"),d=b.find(".ib_shader").css({display:"block",opacity:g}),f=b.find(".ib_over_image").css({display:"block",opacity:"0"}),p=b.find(".ib_over_text").css({display:"block",opacity:"0"}),t=parseFloat(b.data("width"),10),
E=parseFloat(b.data("height"),10),F=t/E,q=b.data("transition"),w=b.data("transition_ease"),x=b.data("transition_type"),y=b.data("transition_duration");h.setTransition(getTransition(w,x,y));var n=parseFloat(b.data("transition_ini_scale"),10)/100,u=b.data("transition_ini_rotation"),v=parseFloat(b.data("transition_scale"),10)/100,l=b.data("transition_rotation");"transformation"==q&&(f.setTransform("rotate("+u+"deg) scale("+n+", "+n+")"),k.setTransform("rotate("+u+"deg) scale("+n+", "+n+")"));var m,s;
a();var r;c(window).resize(function(){clearTimeout(r);r=setTimeout(a,200)});c("html").hasClass("no-touch")&&(b.unbind("hover"),b.hover(function(a){b.hasClass("disabled")||("mouse"==q||"mouseIn"==q?(h.setTransition("none"),h.height(),a=D(b,a),f.css("opacity","1"),"top"==a?f.css({top:-s+"px",left:"0px"}):"bottom"==a?f.css({top:s+"px",left:"0px"}):"left"==a?f.css({left:-m+"px",top:"0px"}):"right"==a&&f.css({left:m+"px",top:"0px"}),h.height(),h.setTransition(getTransition(w,x,y)),f.css({top:"0px",left:"0px"})):
f.css("opacity","1"),"transformation"==q&&(f.setTransform("rotate("+l+"deg) scale("+v+", "+v+")"),k.setTransform("rotate("+l+"deg) scale("+v+", "+v+")")),d.css("opacity",e),p.css("opacity",1))},function(a){b.hasClass("disabled")||("mouse"==q?(a=D(b,a),f.css("opacity","1"),"top"==a?f.css("top",-s+"px"):"bottom"==a?f.css("top",s+"px"):"left"==a?f.css("left",-m+"px"):"right"==a&&f.css("left",m+"px")):f.css("opacity","0"),"transformation"==q&&(f.setTransform("rotate("+u+"deg) scale("+n+", "+n+")"),k.setTransform("rotate("+
u+"deg) scale("+n+", "+n+")")),d.css("opacity",g),p.css("opacity",0))}))};newPqButton=function(){var a=c(this),b=a.data("background"),g=parseFloat(a.data("background_alpha"),10)/100,e=a.data("background_over"),h=parseFloat(a.data("background_alpha_over"),10)/100,k=a.data("color"),d=a.data("color_over"),f=a.data("border"),p={"border-color":a.data("border_over"),color:d},t={"border-color":f,color:k},k=a.data("tween_time"),d=a.data("tween");a.processColorAndPattern(b,g);a.addEaseAll(k,d,["border-color",
"color","background-color"]);a.unbind("hover");a.hover(function(){a.hasClass("disabled")||(a.css(p),a.processColorAndPattern(e,h))},function(){a.hasClass("disabled")||(a.css(t),a.processColorAndPattern(b,g))})};return runShortcodes=function(){var a=c(".with_sidebar");if(0<a.length){var b=a.height();a.find(".content_wraper").height();var g=a.find(".sidebar .row-fluid").height();g>b&&a.find(".content_wraper").height(g+"px")}c(".social_video").each(function(){function a(){d.height(Math.round(d.parent().width()*
f))}function b(){$close_btn=d.find(".close_button").unbind("click");d.find("iframe, .close_button").remove();d.find("a, div, img").show()}function k(){var a=d.data("src"),a=c('<iframe src="'+a+'" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'),e=c('<a class="close_button" onclick="return false;" href="#"><div class="close_ico inside_icon"></div></a>').click(b);d.find("a, div, img").hide();d.append(a);d.append(e)}var d=c(this),f=parseFloat(d.data("height"),
10)/100;a();var g;c(window).resize(function(){clearTimeout(g);g=setTimeout(a,200)});d.bind("gridResize",a);void 0!=d.data("src")&&d.find(".tooglePlayVideo").click(k)});c(".form_shortcode").each(function(){var a=c(this);a.find(".button").click(function(){a.submit();return!1});a.submit(function(){if(!a.hasClass("busy")){var b=a.find(".on_error"),k=!0;a.find("input, textarea").each(function(a,d){$input=c(d);var e=$input.attr("type");if("hidden"!=e){var g=$input.attr("data-required"),l=$input.val();"true"==
g&&""==l?(b.slideDown(250),k=!1):"true"!=g&&("false"!=g||"email"!=e||""==l)||("email"!=e||RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i).test(l))||
(b.slideDown(250),k=!1)}});if(k){a.addClass("busy");b.is(":hidden")||b.slideUp(250);var d=a.serialize(),d=d+"&action=pq_send_email";a.find(".button").fadeTo(300,0.4).trigger("mouseout").addClass("disabled");c.post(adminAjax,d,function(b,c){"1"!=b&&1!=b||"success"!=c?a.find(".on_error").slideDown(250):a.find(".on_success").slideDown(250);a.removeClass("busy");a.find(".button").fadeTo(300,1).removeClass("disabled")})}}return!1})});c(".tabs").each(function(){new A(c(this))});c(".accordion").each(function(){new C(c(this))});
r();c(".pq_button").each(newPqButton);c(".image_button").each(G);c(".music_player").each(function(){var a=c(this),b=a.data("url");"sound"==a.data("type")?new l(a,b):c.getJSON("http://api.soundcloud.com/resolve?url="+b+"&format=json&consumer_key=6c786345f5161898f1e1380802ce9226&callback=?",function(b){console.log(b);b=b.stream_url;-1==b.indexOf("secret_token")?b+="?":b+="&";new l(a,b+"consumer_key=6c786345f5161898f1e1380802ce9226")})})}});