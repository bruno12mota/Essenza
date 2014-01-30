define(["jquery","./KenBurns","./Element","utils/utils","jquery/jquery.easing.1.3"],function(b,g,h){var f=function(a,b,c,d,k,l){this.$slide=a;this.to=this.current=100;this.ease=b;this.supportTransitions=!0;this.state="off";this.id=c;this.thumbLoaded=!1;this.isFullscreen=d;this.originalRatio=k;this.thumbnailOptions=l;isNaN(this.originalRatio)&&(this.originalRatio=0.6);this.loadedSlide=!1;this.parameters={sizing:"full",buttonsColor:0,backgroundType:"image",backgroundId:"",backgroundThumb:"none",videoAutoplay:!1,
thumbnail:"",slideDuration:10,useKenBurns:!0,kbDelay:0,kbDuration:10,kbStartTop:0,kbStartLeft:0,kbStartSize:1,kbEndTop:1,kbEndLeft:1,kbEndSize:1,vertical_snapping:"none",horizontal_snapping:"none"};this.parseParameters();this.isVideo="image"!=this.parameters.backgroundType&&"color"!=this.parameters.backgroundType;this.build()};f.prototype={parseParameters:function(){var a=this.$slide.attr("rel"),a=stringToObject(a);b.each(a,b.proxy(function(a,b){this.parameters.hasOwnProperty(a)&&(this.parameters[a]=
b,this.parameters[a]=parseParameter(this.parameters[a]))},this))},build:function(){var a={position:"absolute",top:"0",left:"0"};this.width=this.$slide.width();this.height=this.$slide.height();this.$elements=b(".slide_elements",this.$slide);this.elements=[];b(">*",this.$elements).each(b.proxy(function(d,c){b(c).css(a);this.elements.push(new h(b(c),900,900*this.originalRatio))},this));this.$background=b("<div></div>").prependTo(this.$slide);if("color"!=this.parameters.backgroundType){this.$image=b("<img style='max-width:none;' alt='Slide background image'/>");
var e="image"==this.parameters.backgroundType?this.parameters.backgroundId:this.parameters.backgroundThumb,c=1<window.devicePixelRatio,d=1;"full"==this.parameters.sizing&&(d=this.parameters.kbStartSize,this.parameters.useKenBurns&&this.parameters.kbEndSize<d&&(d=this.parameters.kbEndSize),d=1/d);jQuery.post(adminAjax,{action:"pq_get_attachment",attachmentID:e,retina:c?"true":"false",width:Math.ceil(this.width*d),height:Math.ceil(this.height*d),crop:"false",snap:"true"},b.proxy(function(a){!0==a.success&&
(this.originalWidth=a.data.width,this.originalHeight=a.data.height,a=a.data.url,"full"==this.parameters.sizing&&(this.kenBurns=new g(this.$image,this.$slide.width(),this.$slide.height(),this.originalWidth,this.originalHeight,this.parameters,this.originalRatio,this.isFullscreen)),this.$image.attr("src",a).appendTo(this.$background).css({position:"absolute","image-rendering":"optimizeQuality"}).setTransformOrigin(0,0).load(b.proxy(this.backgroundLoadComplete,this)),""!=this.parameters.thumbnail&&this.loadThumbnail())},
this))}else this.$background.css({"background-color":this.parameters.backgroundId,position:"absolute",top:"0",left:"0",bottom:"0",right:"0"}),this.backgroundLoadComplete(),""!=this.parameters.thumbnail&&this.loadThumbnail()},loadThumbnail:function(){this.thumbnailOptions.useThumbnails&&jQuery.post(adminAjax,{action:"pq_get_attachment",attachmentID:this.parameters.thumbnail,retina:1<window.devicePixelRatio?"true":"false",width:this.thumbnailOptions.thumbWidth,height:this.thumbnailOptions.thumbHeight,
crop:"true"},b.proxy(function(a){!0==a.success&&(a=a.data.url,b(this).trigger("thumbnailInfoLoaded",[a,this.id]),this.thumbLoaded=!0,this.thumbInfo=a)},this))},checkLoadedThumb:function(){this.thumbLoaded&&b(this).trigger("thumbnailInfoLoaded",[this.thumbInfo,this.id])},updateSize:function(){"color"!=this.parameters.backgroundType&&"full"!=this.parameters.sizing&&this.$image.resizeAndCenter(this.width,this.height,this.originalWidth,this.originalHeight,this.parameters.sizing)},backgroundLoadComplete:function(){var a=
this.$elements.find("img").length,e=0;0==a?this.loadComplete():this.$elements.find("img").ensureLoad(b.proxy(function(){e++;e==a&&this.loadComplete()},this))},loadComplete:function(){this.loadedSlide=!0;this.resize(this.width,this.height);b(this).trigger("loaded")},animateIn:function(){"image"==this.parameters.backgroundType&&void 0!=this.kenBurns&&this.kenBurns.start();for(var a=0;a<this.elements.length;a++)this.elements[a].animateIn()},animateOut:function(){"image"==this.parameters.backgroundType&&
void 0!=this.kenBurns&&this.kenBurns.stop();for(var a=0;a<this.elements.length;a++)this.elements[a].animateOut()},resize:function(a,b){this.width=a;this.height=b;if(this.loadedSlide){this.updateSize();for(var c=0;c<this.elements.length;c++)this.elements[c].resize(this.width,this.height);void 0!=this.kenBurns&&this.kenBurns.resize(this.width,this.height)}}};return f});
