define(["jquery"],function(b){var c=function(a,d,c,e){this.pathToElem=d;this.$this=a;void 0==e&&(e=!0);a.css({position:"relative",display:"block",overflow:"hidden","background-color":"#FBFAA6","margin-bottom":"20px"});b("<div><img src='"+d+"information_icon.png' alt='info' style='top:1px;'/></div>").css({padding:"0px 2px","background-color":"#F7E088","float":"left"}).appendTo(a);a.processFont("AllerRegular","#011111",12);b("<div>"+c+"</div>").css({padding:"12px 15px","float":"left"}).appendTo(a);
e&&b("<a href='#'></div>").css({"float":"right","background-image":"url("+d+"lightbox_close.png)","background-repeat":"no-repeat",position:"relative",top:"15px",padding:"0px 10px",width:"9px",height:"9px"}).appendTo(a).click(b.proxy(this.close,this))};c.prototype={close:function(){var a=this.$this.height();this.$this.css("height",a+"px").animate({height:"0px","margin-bottom":"0px"},150,function(){b(this).css("display","none")});return!1}};return c});