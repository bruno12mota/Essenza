var esza_portfolio_title_font_size_max=parseInt(directory.esza_portfolio_title_font_size_max,10),esza_portfolio_title_font_size_min=parseInt(directory.esza_portfolio_title_font_size_min,10);
define(["jquery","utils/utils","other/modernizr"],function(a){var k=function(){jQuery(document).ready(a.proxy(function(a){this.initiate()},this))};k.prototype={initiate:function(){var b=a("#portfolio .work.new");b.removeClass("new");if(!Modernizr.touch){var f;b.data("resized","false");var g=this.resizeDescription,b=a("#portfolio .work");b.each(function(){var c=a(this);c.find(".hitarea").hover(function(){c.addClass("over");var l=-20,m=-10;"false"==c.data("resized")&&g(c);b.addClass("inactive");c.removeClass("inactive");
0>parseInt(a(".description-wraper",c).css("left"))&&(l=20,m=10);a(".portfolio-wraper").hasClass("above_position")||(a(".description",c).stop().css("left",l+"px").animate({left:"0px"},800,"easeOutExpo"),a(".content",c).stop().css({left:m+"px"}),clearTimeout(f),f=setTimeout(a.proxy(function(){a(this).animate({left:"0px"},300,"easeOutExpo")},a(".content",c)),100))},function(){if(Modernizr.touch)return!1;c.removeClass("over");b.removeClass("inactive");clearTimeout(f)})});a(window).resize(function(){b.data("resized",
"false")})}},resizeDescription:function(b){b.data("resized","true");var f=25,g=esza_portfolio_title_font_size_max,c=esza_portfolio_title_font_size_min,l=a(".description .content h1",b),m=a(".description .content hr",b),k=a(".description .content p:first",b),n=a(".description .content p.category",b);l.css({"font-size":g+"px","line-height":g+3+"px"});m.css("display","");k.css("display","");n.css("display","");var h=a(".description",b).height(),e=a(".description .content",b),d=e.outerHeight(!0);if(d>
h){do if(e.css({margin:f+"px"}),d=e.outerHeight(!0),20<f)f-=5;else break;while(d>h)}d>h&&(n.css("display","none"),d=e.outerHeight(!0),d>h&&(n.css("display",""),k.css("display","none"),d=e.outerHeight(!0),d>h&&(n.css("display","none"),m.css("display","none"),d=e.outerHeight(!0))));if(d>h){do l.css({"font-size":g+"px","line-height":g+3+"px"}),d=e.outerHeight(!0),g-=1;while(d>h&&g>=c)}"center"==e.css("text-align")&&(b=a(".description",b),e.css("top",(b.height()-2*f)/2-e.outerHeight()/2-3),e.css("left",
"-1px"))}};return k});
