require(["jquery","jquery/jquery.easing.1.3"],function(t){jQuery(document).ready(function(a){function h(){var a=!0;d.is(":visible")||(d.css("display","block"),a=!1);var b=k;k&&(g.show(),350>g.width()&&(g.hide(),b=!1));e.removeClass("center");c.removeClass("center");c.show();b||(l&&!m?e.addClass("center"):!l&&m?c.addClass("center"):(b=d.width(),c.width()+e.width()>b&&(e.addClass("center"),c.hide())));a||d.css("display","")}var g=a("#footer_twitter"),q=a("#footer_twitter").find(".tweets"),r=a("#footer_twitter").find(".tweets_holder"),
s=q.find(".tweet_small").length,f=0;setInterval(function(){f++;f>=s&&(f=0);r.stop().animate({top:-40*f},500,"easeOutExpo")},4E3);var n=a(".big-loading"),b=0,p=function(){n=a(".big-loading");b+=15;360<=b&&(b=0);n.css({transform:"rotate("+b+"deg)","-ms-transform":"rotate("+b+"deg)","-moz-transform":"rotate("+b+"deg)","-webkit-transform":"rotate("+b+"deg)","-o-transform":"rotate("+b+"deg)"});setTimeout(p,40)};setTimeout(p,40);var e=a("#footer .social_icons"),c=a("#footer .copyright_text"),d=a("#footer"),
k=0<a("#footer_twitter").length,l=0<a(".social_icons a").length,m=0<a("#footer_optional_text").length;a(window).resize(h);h()})});