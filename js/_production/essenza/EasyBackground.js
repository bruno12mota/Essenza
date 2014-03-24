define(["jquery","jquery/jquery.easing.1.3","utils/utils"],function(e){var k=function(a){this.parameters={background_color:"none",background_pattern:"none",autoplay:!1,autoplayTime:4E3,images_sizing:"fill",images:[],animationIn:{},animationOut:{},extraCss:{}};e.each(a,e.proxy(function(b,a){this.parameters.hasOwnProperty(b)&&(this.parameters[b]=a)},this));this.images=[];this.loadedImages=this.numImages=this.current=0;this.$background=e(".easyBackground");0==this.$background.length&&(this.$background=
e('<div class="easyBackground"></div>'),e("body").append(this.$background));var c={"background-color":this.parameters.background_color};e.each(this.parameters.extraCss,function(b,a){c[b]=a});this.$background.css(c);this.$content=e('<div class="background-content"></div>');this.$pattern=e('<div class="background-content"></div>');void 0!=this.parameters.background_pattern&&"none"!=this.parameters.background_pattern&&this.$pattern.css({"background-image":"url("+this.parameters.background_pattern+")"});
this.$background.append(this.$content);e(window).resize(e.proxy(this.onResize,this));0<this.parameters.images.length&&this.loadImage(0)};k.prototype={loadImage:function(a){this.loadingImage=e("<img alt='background image'/>").attr("src",this.parameters.images[a]).css({"max-width":"none"});this.loadingImage.ensureLoad(e.proxy(this.imageLoaded,this))},imageLoaded:function(){this.loadingImage=this.loadingImage.get(0);var a=e("<div><div>");a.css({position:"absolute",top:0,bottom:0,right:0,left:0});var c=
{};c.img=this.loadingImage;c.width=this.loadingImage.naturalWidth;c.height=this.loadingImage.naturalHeight;c.holder=a;e.isArray(this.parameters.images_sizing)?c.sizing=this.parameters.images_sizing[this.loadedImages]:c.sizing=this.parameters.images_sizing;this.images.push(c);"repeat"==c.sizing?a.css({width:"100%",height:"100%","background-image":"url("+this.parameters.images[num]+")","background-repeat":"repeat"}):a.append(this.loadingImage);this.onResize();this.loadedImages++;1==this.loadedImages&&
(this.imageIn(),this.$content.fadeTo(200,1),this.onResize());this.parameters.images.length>this.loadedImages&&this.loadImage(this.loadedImages)},tweenIn:function(a,c){var b=this.parameters.animationIn.attribute[c],d=this.parameters.animationIn.easing[c],f=1E3*parseFloat(this.parameters.animationIn.time[c],10);"x"==b?a.animate({left:0},{queue:!1,duration:f,easing:d}):"y"==b?a.animate({top:0},{queue:!1,duration:f,easing:d}):"alpha"==b&&a.animate({opacity:1},{queue:!1,duration:f,easing:d});c++;c<this.parameters.animationIn.attribute.length&&
this.tweenIn(a,c)},tweenOut:function(a,c){var b=this.parameters.animationOut.attribute[c],d=this.parameters.animationOut.value[c],f=this.parameters.animationOut.easing[c],e=1E3*parseFloat(this.parameters.animationOut.time[c],10);if("x"==b){var g=this.$background.width();a.animate({left:"right"==d?g+"px":"left"==d?-g+"px":d},{queue:!1,duration:e,easing:f})}else"y"==b?(b=this.$background.height(),a.animate({top:"top"==d?-b+"px":"bottom"==d?g+"px":d},{queue:!1,duration:e,easing:f})):"alpha"==b&&a.animate({opacity:parseFloat(d,
10)},{queue:!1,duration:e,easing:f});c++;c<this.parameters.animationOut.attribute.length&&this.tweenOut(a,c)},imageIn:function(){var a=this.$background.width(),c=this.$background.height(),b=e('<div class="background_holder"><div>');b.css({position:"absolute",overflow:"hidden",width:"100%",height:"100%"});b.append(this.images[this.current].holder);b.append(this.$pattern);this.$content.append(b);for(var d=0;d<this.parameters.animationIn.attribute.length;d++){var f=this.parameters.animationIn.attribute[d],
h=this.parameters.animationIn.value[d];"x"==f?(f="right"==h?a+"px":"left"==h?-a+"px":h,b.css("left",f)):"y"==f?(f="top"==h?-c+"px":"bottom"==h?a+"px":h,b.css("top",f)):"alpha"==f&&b.css("opacity",parseFloat(h,10))}0<this.parameters.animationIn.attribute.length&&(a=1E3*parseFloat(this.parameters.animationIn.delay,10),setTimeout(e.proxy(function(){b.stop();this.tweenIn(b,0)},this),a));1<this.parameters.images.length&&this.parameters.autoplay&&(clearTimeout(this.autoplayTimer),this.autoplayTimer=setTimeout(e.proxy(this.next,
this),this.parameters.autoplayTime))},imageOut:function(){var a=e("div.background_out",this.$content).stop(),c=1E3*parseFloat(this.parameters.animationOut.delay,10);0<this.parameters.animationOut.attribute.length&&setTimeout(e.proxy(function(){this.tweenOut(a,0)},this),c);for(var b=0,d=0;d<this.parameters.animationOut.attribute.length;d++){var f=1E3*parseFloat(this.parameters.animationOut.time[d],10)+c;f>b&&(b=f)}c=1E3*parseFloat(this.parameters.animationIn.delay,10);for(d=0;d<this.parameters.animationIn.attribute.length;d++)f=
1E3*parseFloat(this.parameters.animationIn.time[d],10)+c,f>b&&(b=f);a.removeClass("background_out");setTimeout(function(){a.remove()},b)},reset:function(){this.images=[];this.loadedImages=this.numImages=this.current=this.numImages=0;clearTimeout(this.autoplayTimer)},changeImage:function(){e("div.background_holder",this.$content).addClass("background_out");this.imageOut();this.imageIn()},next:function(){this.current<this.loadedImages-1?this.current++:this.current=0;this.changeImage()},changeTo:function(a){0<=
a&&a<this.loadedImages&&(this.current=a,this.changeImage())},previous:function(){0<this.current?this.current--:this.current=this.loadedImages-1;this.changeImage()},toogleAutoplay:function(){this.parameters.autoplay?(clearTimeout(this.autoplayTimer),this.parameters.autoplay=!1):(this.autoplayTimer=setTimeout(e.proxy(this.next,this),this.parameters.autoplayTime),this.parameters.autoplay=!0);return this.parameters.autoplay},changeImages:function(a){this.$content.stop().fadeTo(200,0,e.proxy(function(){this.$content.empty();
this.reset();this.parameters.images=a;0<this.parameters.images.length&&this.loadImage(0)},this))},changeColor:function(a){this.$background.css("background-color",a)},onResize:function(){var a=this.$background.width(),c=this.$background.height();console.log(this.$background.width());for(var b=0;b<this.images.length;b++)if(console.log(this.images[b].width),"repeat"!=this.images[b].sizing){var d=this.images[b].img;if("fill"==this.images[b].sizing||"adjust"==this.images[b].sizing){var f=this.images[b].width,
e=this.images[b].height,g=f/a;"fill"==this.images[b].sizing&&g>e/c&&(g=e/c);"adjust"==this.images[b].sizing&&g<e/c&&(g=e/c);d.width=Math.ceil(f/g);d.height=Math.ceil(e/g)}else"stretch"==this.images[b].sizing&&(d.width=a,d.height=c);f=Math.round(c/2-d.height/2);d=Math.round(a/2-d.width/2);this.images[b].holder.css({left:(0<d?0:d)+"px",top:(0<f?0:f)+"px"})}}};return k});
