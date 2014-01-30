define(["jquery"],function(d){var e=function(){this.elements=[];this.parameters={buttonsColor:0,backgroundType:"image",backgroundId:"",backgroundThumb:"",thumbnail:"",slideDuration:7,videoAutoplay:"false",useKenBurns:"false",kbDelay:0,kbDuration:4,kbStartTop:0.5,kbStartLeft:0.5,kbStartSize:1,kbEndTop:0.5,kbEndLeft:0.5,kbEndSize:1,vertical_snapping:"center",horizontal_snapping:"center"}};e.prototype={addElement:function(a){this.elements.push(a)},removeElements:function(){d.each(this.elements,function(a,
b){b.remove()})},removeElement:function(a){var b;for(b=0;b<this.elements.length;b++)if(this.elements[b].depth==a){this.elements.splice(b,1);break}for(a=b;a<this.elements.length;a++)this.elements[a].depth--},appendElements:function(){d.each(this.elements,function(a,b){b.created?b.appendElement():b.createElement(!1);b.updatePosition(!1)})},changeElementsPhase:function(a){d.each(this.elements,function(b,c){c.changeInstance(a)})},setMain:function(a){this.parameters.buttonsColor=a.buttonsColor},getMain:function(){var a=
{};a.buttonsColor=this.parameters.buttonsColor;return a},setBackground:function(a){this.parameters.backgroundType=a.type;this.parameters.backgroundId=a.id;this.parameters.backgroundThumb=a.thumb;this.parameters.thumbnail=a.thumbnail;this.parameters.videoAutoplay=a.videoAutoplay},getBackground:function(){var a={};a.type=this.parameters.backgroundType;a.id=this.parameters.backgroundId;a.thumb=this.parameters.backgroundThumb;a.thumbnail=this.parameters.thumbnail;a.videoAutoplay=this.parameters.videoAutoplay;
return a},setKenBurns:function(a){this.parameters.useKenBurns=a.use;this.parameters.kbDelay=parseFloat(a.delay,10);this.parameters.kbDuration=parseFloat(a.duration,10);this.parameters.kbStartTop=a.startTop;this.parameters.kbStartLeft=a.startLeft;this.parameters.kbStartSize=a.startSize;this.parameters.kbEndTop=a.endTop;this.parameters.kbEndLeft=a.endLeft;this.parameters.kbEndSize=a.endSize},getKenBurns:function(){var a={};a.use=this.parameters.useKenBurns;a.delay=this.parameters.kbDelay;a.duration=
this.parameters.kbDuration;a.startTop=this.parameters.kbStartTop;a.startLeft=this.parameters.kbStartLeft;a.startSize=this.parameters.kbStartSize;a.endTop=this.parameters.kbEndTop;a.endLeft=this.parameters.kbEndLeft;a.endSize=this.parameters.kbEndSize;return a},val:function(){var a="",a=a+"<div class='slide' rel='";d.each(this.parameters,d.proxy(function(b,c){a+=b+":"+c+"; "}));for(var a=a+"'>",a=a+"<div class='slide_elements'>",b=0;b<this.elements.length;b++)for(var c=0;c<this.elements.length;c++)if(this.elements[c].depth==
b){a+=this.elements[c].val();break}return a+="</div></div>"},setVal:function(a){var b=stringToObject(a.attr("rel"));d.each(this.parameters,d.proxy(function(a){b.hasOwnProperty(a)&&(this.parameters[a]=parseParameter(b[a]))},this));console.log(this.parameters)}};return e});
