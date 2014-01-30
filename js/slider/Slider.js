define("jquery ./Slide ./Element ./KenBurns jquery/jquery.easing.1.3 jquery/jquery.mobile.vmouse utils/utils utils/knob utils/modernizr.custom.05064".split(" "),function(a,h,g,k){g=function(b,c){this.inParameters=b;window.devicePixelRatio=window.devicePixelRatio||Math.round(window.screen.availWidth/document.documentElement.clientWidth);c?this.initiate():a(document).ready(a.proxy(this.initiate,this))};g.prototype={initiate:function(){this.firstSlide=!0;this.ease=7;this.height=this.width=500;this.autoplayTime=
7E3;this.autoPlayRate=35;this.dragging=this.overButtonsHolder=!1;this.currentSlide=this.current=this.dragOffset=0;this.oldSlide=-1;this.hasLoaded=!1;this.parameters={height:30,keyboard:!0,backgroundColor:"transparent",slider_transition_duration:1,slider_transition_type:"Expo",slider_transition_ease:"easeOut",slider_transition_starting:0,buttonsHide:!0,buttonsHideDelay:1.2,buttonsHideSpeed:3,mouseDragging:!0,handCursor:!0,autoplay:!0,pauseOnOver:!0,showArrows:!0,leftArrowVA:"center",leftArrowVO:0,
rightArrowVA:"center",rightArrowVO:0,leftArrowHA:"left",leftArrowHO:20,rightArrowHA:"right",rightArrowHO:-20,showButtons:!0,buttonsVA:"bottom",buttonsVO:0,buttonsHA:"center",buttonsHO:0,showPlayPauseButton:!0,PlayPauseVA:"bottom",PlayPauseVO:0,PlayPauseHA:"right",PlayPauseHO:0,showCloseButton:!1,closeVA:"bottom",closeVO:0,closeHA:"right",closeHO:0,closeLink:"#",useThumbnails:!1,thumbsPosition:"bottom",thumbsActiveCenter:"false",thumbsScrollSpeed:3,thumbWidth:70,thumbHeight:50,thumbRound:3,thumbVerMargin:0,
thumbHorMargin:0,thumbOverOpc:80,thumbActiveOpc:100,thumbDeactiveOpc:50,thumbsBackground:!0,thumbsBackgroundOpc:50,thumbsBackgroundColor:"#000000"};this.parseParameters(this.inParameters);this.transitionString=getTransition(this.parameters.slider_transition_ease,this.parameters.slider_transition_type,this.parameters.slider_transition_duration);this.parameters.slider_transition_starting=parseInt(this.parameters.slider_transition_starting,10);this.build();this.parameters.mouseDragging&&1<this.slides.length&&
this.buildDragArea();1>=this.slides.length&&(this.parameters.showButtons=!1,this.parameters.useThumbnails=!1,this.parameters.showArrows=!1,this.parameters.showPlayPauseButton=!1);this.parameters.showButtons&&!this.parameters.useThumbnails?this.buildButtons():this.parameters.useThumbnails&&(this.parameters.showButtons=!1,this.buildThumbnails());this.parameters.showArrows&&this.buildArrows();this.parameters.showPlayPauseButton&&this.buildPlayPause();this.parameters.keyboard&&this.addKeyboardInteraction();
this.buildPlayVideo();this.parameters.showCloseButton&&this.buildCloseButton();this.$buttonsHolder=this.$root.find(">.buttons , >.arrow_button, >.tooglePlay");this.$root.hover(a.proxy(this.mouseOverSlider,this),a.proxy(this.mouseOutSlider,this));this.updateSize();this.$root.bind("resizeSlider",a.proxy(this.updateSize,this));a(window).resize(a.proxy(this.window_resize_timeout,this));this.loadedSlides=0;this.loadSlides()},loadSlides:function(){this.slides[this.loadedSlides].loadedSlide?this.slideLoaded():
a(this.slides[this.loadedSlides]).bind("loaded",a.proxy(function(){a(this.slides[this.loadedSlides]).unbind("loaded");this.slideLoaded()},this))},slideLoaded:function(){0==this.loadedSlides&&(this.updateSlide(),this.updateSize());this.updateSlide();this.parameters.showButtons&&!this.parameters.useThumbnails?this.buttons[this.loadedSlides].show().fadeTo(500,1):this.parameters.useThumbnails&&(a(this.slides[this.loadedSlides]).bind("thumbnailInfoLoaded",a.proxy(this.addThumbnail,this)),this.slides[this.loadedSlides].checkLoadedThumb());
this.loadedSlides++;console.log("Loaded slide: "+this.loadedSlides+"/"+this.slides.length);this.loadedSlides<this.slides.length&&this.loadSlides()},mouseOverSlider:function(){this.parameters.buttonsHide&&!this.firstSlide?this.$buttonsHolder.stop(!0,!1).fadeTo(1E3*this.parameters.buttonsHideSpeed,1):this.parameters.buttonsHide&&(this.overButtonsHolder=!0)},mouseOutSlider:function(){this.parameters.buttonsHide&&!this.firstSlide?this.$buttonsHolder.stop(!0,!1).delay(1E3*this.parameters.buttonsHideDelay).fadeTo(1E3*
this.parameters.buttonsHideSpeed,0):this.parameters.buttonsHide&&(this.overButtonsHolder=!1)},parseParameters:function(b){this.$root=a(b.holder);isNaN(b.ease)||(this.ease=parseInt(b.ease,10));b.hasOwnProperty("background_color")&&this.$root.css("background-color",b.background_color);b=this.$root.attr("rel");this.$root.removeAttr("rel");var c=stringToObject(b);a.each(this.parameters,a.proxy(function(b,a){c.hasOwnProperty(b)&&(this.parameters[b]=parseParameter(c[b]))},this));this.originalRatio=this.parameters.height/
100;a.each(this.inParameters,a.proxy(function(b,a){this.parameters.hasOwnProperty(b)&&(this.parameters[b]=parseParameter(a))},this));ismobile&&this.parameters.buttonsHide&&(this.parameters.buttonsHide=!1)},build:function(){this.slides=[];var b=isNaN(this.parameters.height);this.$root.css("background-color",this.parameters.backgroundColor);this.$slides_holder=this.$root.find(".slides");this.$slides=a(">div",this.$root);var c=this.$slides.length;this.$slides_holder.css("width",100*c+"%");a(".slide",
this.$root).each(a.proxy(function(d,e){var f=a(e),f=new h(f,this.ease,this.slides.length,b,this.originalRatio,{useThumbnails:"true"===this.parameters.useThumbnails||!0===this.parameters.useThumbnails?!0:!1,thumbWidth:this.parameters.thumbWidth,thumbHeight:this.parameters.thumbHeight});f.$slide.css("left",100/c*d+"%");this.slides.push(f)},this));this.numSlides=this.slides.length},getPercentageFromOption:function(b){return"top"==b||"left"==b?"0%":"center"==b?"50%":"100%"},buildDragArea:function(){this.parameters.handCursor&&
this.$slides_holder.addClass("grabhand");this.$slides_holder.bind(mouseDownBind,a.proxy(this.startDragging,this))},startDragging:function(b){if(a(b.target).is("a"))return!0;this.dragging=!0;this.$slides_holder.addClass("down");this.dragInitialX=b.pageX;this.dragInitialY=b.pageY;this.difference=0;this.easeTemp=this.ease;this.ease=1;Modernizr.csstransitions?this.$slides_holder.setTransition("none"):clearInterval(this.interval);a(document).bind(mouseMoveBind,a.proxy(this.onDrag,this));a(document).bind(mouseUpBind,
a.proxy(this.stopDragging,this));return!1},onDrag:function(b){this.difference=b.pageX-this.dragInitialX;0>=this.currentSlide&&0<this.difference&&(this.difference/=3);this.currentSlide>=this.slides.length-1&&0>this.difference&&(this.difference/=3);this.dragOffset=100*(this.difference/this.width);this.animateInc();return!1},stopDragging:function(){this.$slides_holder.removeClass("down");this.dragging=!1;unbindMoveAndUp();this.dragOffset=0;this.ease=this.easeTemp;0>=this.difference&&this.currentSlide<
this.slides.length-1?this.nextSlide():0<this.difference&&0<this.currentSlide?this.previousSlide():this.animateInc(!0);return!1},buildButtons:function(){var b=this.getPercentageFromOption(this.parameters.buttonsVA),c=("top"==this.parameters.buttonsVA?0:"center"==this.parameters.buttonsVA?-7.5:-15)+this.parameters.buttonsVO,d=this.parameters.buttonsHO;this.$buttons=a("<div class='buttons'></div>").css({position:"absolute",width:"100%",top:b,left:0,"margin-top":c,"margin-left":d,"text-align":"center"==
this.parameters.buttonsHA?"center":""}).appendTo(this.$root);b="left"==this.parameters.buttonsHA?"left":"center"==this.parameters.buttonsHA?"none":"right";this.buttons=[];for(c=0;c<this.slides.length;c++)d=a("<a href='#' alt='slider go to button' onclick='return false;' style='display:none; opacity: 0;'></a>").css({width:15,height:15,"float":b,"margin-right":(c<this.slides.length?5:0)+"px"}).attr("rel",c).appendTo(this.$buttons).bind(clickBind,a.proxy(this.goToClick,this)),a("<div></div>").attr("rel",
c).appendTo(d),d.hover(this.buttonOver,this.buttonOut),this.buttons.push(d)},buildCloseButton:function(){var b=this.getPercentageFromOption(this.parameters.closeVA),c=this.getPercentageFromOption(this.parameters.closeHA),d=("top"==this.parameters.closeVA?0:"center"==this.parameters.closeVA?-15:-30)+this.parameters.closeVO,e=("left"==this.parameters.closeHA?0:"center"==this.parameters.closeHA?-15:-30)+this.parameters.closeHO;a('<a class="close_button dynamic_loading" href="'+this.parameters.closeLink+
'"><div class="inside_icon close_ico"></div></a>').css({position:"absolute",top:b,left:c,"margin-top":d,"margin-left":e,width:30,height:30}).appendTo(this.$root)},buildThumbnails:function(){this.$thumbnails=a("<div class='slider_thumbnails'></div>").appendTo(this.$root);switch(this.parameters.thumbsPosition){case "top":this.$thumbnails.css({top:0,width:"100%",height:this.parameters.thumbHeight+2*this.parameters.thumbVerMargin+"px"});break;case "bottom":this.$thumbnails.css({bottom:0,width:"100%",
height:this.parameters.thumbHeight+2*this.parameters.thumbVerMargin+"px"});break;case "right":this.$thumbnails.css({height:"100%",right:0,width:this.parameters.thumbWidth+2*this.parameters.thumbHorMargin+"px"});break;case "left":this.$thumbnails.css({height:"100%",left:0,width:this.parameters.thumbWidth+2*this.parameters.thumbHorMargin+"px"})}this.parameters.thumbsBackground&&this.$thumbnails.processColorAndPattern(this.parameters.thumbsBackgroundColor,parseFloat(this.parameters.thumbsBackgroundOpc,
10)/100);this.parameters.thumbDeactiveOpc/=100;this.parameters.thumbActiveOpc/=100;this.parameters.thumbOverOpc/=100;this.$thumbnailsHolder=a("<div class='thumbnailsHolder'></div>").appendTo(this.$thumbnails);this.parameters.thumbsActiveCenter?"top"==this.parameters.thumbsPosition||"bottom"==this.parameters.thumbsPosition?this.$thumbnailsHolder.css({left:"50%","margin-left":-this.parameters.thumbWidth/2+"px"}):this.$thumbnailsHolder.css({top:"50%","margin-top":-this.parameters.thumbHeight/2+"px"}):
(this.thumbnailsCurrent=this.thumbnailsTo=0,this.thumbnailsIsOver=!1,Modernizr.touch||this.$thumbnails.hover(a.proxy(this.thumbnailsOver,this),a.proxy(this.thumbnailsOut,this)),this.thumbnailsInterval=setInterval(a.proxy(this.thumbnailsUpdate,this),30));var b="top"==this.parameters.thumbsPosition||"bottom"==this.parameters.thumbsPosition;this.thumbnails=[];for(var c=0;c<this.slides.length;c++){var d=a("<a href='#' rel='"+c+"' class='slider_thumbnail'></a>").css({width:this.parameters.thumbWidth+"px",
height:this.parameters.thumbHeight+"px",overflow:"hidden",left:b?this.parameters.thumbHorMargin+(this.parameters.thumbHorMargin+this.parameters.thumbWidth)*c+"px":"auto",top:b?"auto":this.parameters.thumbVerMargin+(this.parameters.thumbVerMargin+this.parameters.thumbHeight)*c+"px",margin:(b?this.parameters.thumbVerMargin:0)+"px "+(b?0:this.parameters.thumbHorMargin)+"px"});this.thumbnails.push(d);this.$thumbnailsHolder.append(d);d.fadeTo(400,this.parameters.thumbDeactiveOpc);d.hover(a.proxy(this.thumbnailOver,
this),a.proxy(this.thumbnailOut,this)).bind(clickBind,a.proxy(this.thumbnailClick,this))}},thumbnailsUpdate:function(){this.thumbnailsCurrent+=(this.thumbnailsTo-this.thumbnailsCurrent)/(0==this.parameters.thumbsScrollSpeed?1:this.parameters.thumbsScrollSpeed);"top"==this.parameters.thumbsPosition||"bottom"==this.parameters.thumbsPosition?this.$thumbnailsHolder.css({left:this.thumbnailsCurrent+"px"}):this.$thumbnailsHolder.css({top:this.thumbnailsCurrent+"px"})},thumbnailsToNormalPos:function(){if(!this.thumbnailsIsOver){if("top"==
this.parameters.thumbsPosition||"bottom"==this.parameters.thumbsPosition){var b=(this.parameters.thumbWidth+this.parameters.thumbHorMargin)*(this.currentSlide+1),a=this.width/2+this.parameters.thumbWidth/2;this.thumbnailsTo=a<b?a-b:0;b=this.width-((this.parameters.thumbWidth+this.parameters.thumbHorMargin)*this.slides.length+this.parameters.thumbHorMargin)}else b=(this.parameters.thumbHeight+this.parameters.thumbVerMargin)*(this.currentSlide+1),a=this.height/2+this.parameters.thumbHeight/2,this.thumbnailsTo=
a<b?a-b:0,b=this.height-((this.parameters.thumbHeight+this.parameters.thumbVerMargin)*this.slides.length+this.parameters.thumbVerMargin);this.thumbnailsTo<b&&(this.thumbnailsTo=b)}},thumbnailsOver:function(){this.thumbnailsIsOver=!0;a(window).bind(mouseMoveBind,a.proxy(this.thumbnailsMove,this))},thumbnailsOut:function(){this.thumbnailsIsOver=!1;a(window).unbind(mouseMoveBind,a.proxy(this.thumbnailsMove,this));this.thumbnailsToNormalPos()},thumbnailsMove:function(b){var a=this.$thumbnails.offset();
if("top"==this.parameters.thumbsPosition||"bottom"==this.parameters.thumbsPosition){a=a.left;b=b.pageX-a;var a=(this.parameters.thumbWidth+this.parameters.thumbHorMargin)*this.thumbnails.length+this.parameters.thumbHorMargin,d=this.$thumbnails.width()}else b=b.pageY,a=a.top,b-=a,a=(this.parameters.thumbHeight+this.parameters.thumbVerMargin)*this.thumbnails.length+this.parameters.thumbVerMargin,d=this.$thumbnails.height();this.thumbnailsTo=-Math.round((a-d)*(b/d))},addThumbnail:function(b,c,d){var e=
this.parameters.thumbWidth,f=this.parameters.thumbHeight;this.thumbnails[d].append(a("<img alt='Slide thumbnail'/>").attr("src",c).load(function(){a(this).resizeAndCenter(e,f,void 0,void 0,"full")}).css("opacity",0).fadeTo(500,1))},thumbnailOver:function(b){b=a(b.target);b=b.hasClass("slider_thumbnail")?b:b.parent();b.hasClass("active")||b.stop().fadeTo(400,this.parameters.thumbOverOpc)},thumbnailOut:function(b){b=a(b.target);b=b.hasClass("slider_thumbnail")?b:b.parent();b.hasClass("active")||b.stop().fadeTo(400,
this.parameters.thumbDeactiveOpc)},thumbnailClick:function(b){b=a(b.target);b=b.hasClass("slider_thumbnail")?b:b.parent();b.hasClass("active")||(this.currentSlide=parseInt(b.attr("rel"),10),this.updateSlide());return!1},buildArrows:function(){var b=this.getPercentageFromOption(this.parameters.leftArrowVA),c=this.getPercentageFromOption(this.parameters.leftArrowHA),d=("top"==this.parameters.leftArrowVA?0:"center"==this.parameters.leftArrowVA?-15:-30)+this.parameters.leftArrowVO,e=("left"==this.parameters.leftArrowHA?
0:"center"==this.parameters.leftArrowHA?-15:-30)+this.parameters.leftArrowHO;this.$leftArrow=a("<a class='arrow_button' href='#' onclick='return false;'><div class='inside_icon arrow_left'></div></a>").css({position:"absolute",top:b,left:c,"margin-top":d,"margin-left":e,width:30,height:30}).appendTo(this.$root).bind(clickBind,a.proxy(this.previousSlide,this));b=this.getPercentageFromOption(this.parameters.rightArrowVA);c=this.getPercentageFromOption(this.parameters.rightArrowHA);d=("top"==this.parameters.rightArrowVA?
0:"center"==this.parameters.rightArrowVA?-15:-30)+this.parameters.rightArrowVO;e=("left"==this.parameters.rightArrowHA?0:"center"==this.parameters.rightArrowHA?-15:-30)+this.parameters.rightArrowHO;this.$rightArrow=a("<a class='arrow_button' href='#' onclick='return false;'><div class='inside_icon arrow_right'></div></a>").css({position:"absolute",top:b,left:c,"margin-top":d,"margin-left":e,width:30,height:30}).appendTo(this.$root).bind(clickBind,a.proxy(this.nextSlide,this))},buildPlayVideo:function(){this.$playVideo=
a("<a class='tooglePlayVideo' href='#' onclick='return false;'><i class='esza-play'></i></a>").appendTo(this.$root).css("display","none").bind(clickBind,a.proxy(this.playVideo,this));this.$videoHolder=a("<div class='videoHolder'></div>").appendTo(this.$root).css({display:"none",opacity:"0"});a("<a class='close_button' href='#' onclick='return false;'><div class='close_ico inside_icon'></div></a>").appendTo(this.$videoHolder).bind(clickBind,a.proxy(this.closeVideo,this))},playVideo:function(){this.$videoHolder.css("display",
"").fadeTo(150,1);this.playerId="";var b=this.slides[this.currentSlide].parameters.backgroundType,c=this.slides[this.currentSlide].parameters.backgroundId;this.backgroundId=c;jQuery.post(adminAjax,{action:"pq_get_video",id:c,type:b},a.proxy(function(b){a('<iframe src="'+b+'&autoplay=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>').prependTo(this.$videoHolder)},this));this.pauseAutoplay();a(this).trigger("video_play");return!1},closeVideo:function(){this.$videoHolder.fadeTo(200,
0,function(){a(this).css("display","none");a(this).find("iframe").remove()});this.resumeAutoplay();a(this).trigger("video_close")},buildPlayPause:function(){var b=this.getPercentageFromOption(this.parameters.PlayPauseVA),c=this.getPercentageFromOption(this.parameters.PlayPauseHA),d=("top"==this.parameters.PlayPauseVA?0:"center"==this.parameters.PlayPauseVA?-12:-24)+this.parameters.PlayPauseVO,e=("left"==this.parameters.PlayPauseHA?0:"center"==this.parameters.PlayPauseHA?-12:-24)+this.parameters.PlayPauseHO;
this.$tooglePlay=a("<a class='tooglePlay' href='#' onclick='return false;'><div class='inside_icon'></div></a>").css({position:"absolute",top:b,left:c,"margin-top":d,"margin-left":e,width:24,height:24}).appendTo(this.$root).bind(clickBind,a.proxy(this.toogleAutoplay,this));Modernizr.canvas&&(this.$knob=a("<div></div>").css({position:"absolute",top:0,left:0}).appendTo(this.$tooglePlay),this.$knob.knob({readOnly:"true","displayInput ":"false","displayPrevious ":"false",width:24,thickness:0.21,fgColor:"#ffffff",
bgColor:"transparent"}))},addKeyboardInteraction:function(){a(document).keypress(a.proxy(this.keyPressed,this))},keyPressed:function(b){37==b.keyCode?this.previousSlide():39==b.keyCode&&this.nextSlide()},updateSize:function(b,c,d){var e=isNaN(this.parameters.height);this.width=parseFloat(this.$root.width(),10);void 0!=c&&(this.parameters.height=c,e=d);this.height=e?this.parameters.height:Math.round(parseFloat(this.parameters.height,10)/100*this.width);this.$root.css("height",this.height);c=this.height;
e&&(c=this.$root.height());for(e=0;e<this.slides.length;e++)this.slides[e].resize(this.width,c);b&&(clearTimeout(this.sizeTimeout),this.sizeTimeout=setTimeout(a.proxy(function(){this.updateSize(!1)},this),50));this.height=c},window_resize_timeout:function(){clearTimeout(this.resize_timeout);this.resize_timeout=setTimeout(a.proxy(this.updateSize,this),200)},resetAutoplay:function(){this.currentTime=0;clearInterval(this.autoplayTimer);this.autoplayTimer=setInterval(a.proxy(this.fireAutoplay,this),this.autoPlayRate)},
fireAutoplay:function(){this.currentTime+=this.autoPlayRate;this.currentTime>=this.autoplayTime&&(this.currentTime=0,this.nextSlide());this.knobUpdate(100*(this.currentTime/this.autoplayTime))},knobUpdate:function(b){this.parameters.showPlayPauseButton&&Modernizr.canvas&&this.$knob.val(b).trigger("change")},animateInc:function(b){var a=-100*this.currentSlide+this.dragOffset,d=-100*this.oldSlide;!0!==b&&(!this.dragging&&0<this.parameters.slider_transition_starting&&Math.abs(this.current-d)<this.parameters.slider_transition_starting)&&
(Modernizr.csstransitions&&this.$slides_holder.setTransition("none"),this.$slides_holder.css("left",(d>a?d-this.parameters.slider_transition_starting:d+this.parameters.slider_transition_starting)+"%"),this.$slides_holder.height());Modernizr.csstransitions&&!this.dragging?(this.$slides_holder.setTransition(this.transitionString),this.$slides_holder.css("left",a+"%")):this.dragging?this.$slides_holder.css("left",a+"%"):this.$slides_holder.stop().animate({left:a+"%"},1E3*this.parameters.slider_transition_duration,
getTween(this.parameters.slider_transition_ease,this.parameters.slider_transition_type));this.current=a},updateSlide:function(){this.currentSlide!=this.oldSlide&&(0>this.currentSlide&&(this.currentSlide=this.numSlides-1),this.currentSlide>=this.numSlides&&(this.currentSlide=0),this.slides[this.currentSlide].animateIn(),this.firstSlide&&(!this.parameters.buttonsHide||this.parameters.buttonsHide&&this.overButtonsHolder)&&this.$buttonsHolder.stop(!0,!1).fadeTo(400,1),this.firstSlide?(this.$slides_holder.fadeTo(400,
1),this.hasLoaded=!0,a(this).trigger("sliderLoaded"),this.$root.trigger("load"),this.$root.get(0).complete=!0):this.animateInc(),this.firstSlide=!1,-1!=this.oldSlide&&this.slides[this.oldSlide].animateOut(),this.parameters.showButtons?(a.each(this.buttons,a.proxy(function(b,c){c.removeClass("active");a.proxy(this.buttonOut,c)()},this)),this.buttons[this.currentSlide].addClass("active"),a.proxy(this.buttonOver,this.buttons[this.currentSlide])()):this.parameters.useThumbnails&&(-1!=this.oldSlide&&(this.thumbnails[this.oldSlide].removeClass("active"),
this.thumbnails[this.oldSlide].stop().fadeTo(400,this.parameters.thumbDeactiveOpc)),this.thumbnails[this.currentSlide].addClass("active"),this.thumbnails[this.currentSlide].stop().fadeTo(400,this.parameters.thumbActiveOpc),this.parameters.thumbsActiveCenter?"top"==this.parameters.thumbsPosition||"bottom"==this.parameters.thumbsPosition?this.$thumbnailsHolder.animate({"margin-left":-this.parameters.thumbWidth/2-(this.parameters.thumbWidth+this.parameters.thumbHorMargin)*this.currentSlide+"px"},300,
"easeOutExpo"):this.$thumbnailsHolder.animate({"margin-top":-this.parameters.thumbHeight/2-(this.parameters.thumbHeight+this.parameters.thumbVerMargin)*this.currentSlide+"px"},300,"easeOutExpo"):this.thumbnailsToNormalPos()),this.slides[this.currentSlide].isVideo?(this.$playVideo.css("display",""),this.slides[this.currentSlide].parameters.videoAutoplay&&this.playVideo()):this.$playVideo.css("display","none"),this.oldSlide=this.currentSlide,this.autoplayTime=1E3*this.slides[this.currentSlide].parameters.slideDuration,
this.parameters.autoplay?this.resetAutoplay():(this.currentTime=0,this.knobUpdate(0)),a(this).trigger("changeSlide",[this.currentSlide]))},nextSlide:function(){1<this.slides.length&&(this.currentSlide++,this.updateSlide());return!1},previousSlide:function(){1<this.slides.length&&(this.currentSlide--,this.updateSlide());return!1},pauseAutoplay:function(){this.parameters.autoplay&&(clearInterval(this.autoplayTimer),this.parameters.autoplay=!1,this.parameters.showPlayPauseButton&&this.$tooglePlay.addClass("paused"))},
resumeAutoplay:function(){this.parameters.autoplay||(this.autoplayTimer=setInterval(a.proxy(this.fireAutoplay,this),this.autoPlayRate),this.parameters.autoplay=!0,this.parameters.showPlayPauseButton&&this.$tooglePlay.removeClass("paused"))},toogleAutoplay:function(){this.parameters.autoplay?this.pauseAutoplay():this.resumeAutoplay();return!1},goToClick:function(b){1<this.slides.length&&(b=a(b.target),this.currentSlide=parseInt(b.attr("rel"),10),this.updateSlide());return!1},buttonOver:function(){a("div",
a(this)).stop().fadeTo(200,1)},buttonOut:function(){a(this).hasClass("active")||a("div",a(this)).stop().fadeTo(200,0)}};return g});