define(["jquery","essenza/Cover"],function(a){var c=function(b,d){this.$obj=b;this.shown=d;a(document).ready(a.proxy(this.initiate,this))};c.prototype={initiate:function(){this.$container=this.$obj.find(".container");a(".close_btn",this.$obj).click(a.proxy(this.close,this));this.$obj.find(".click_area").click(a.proxy(this.close,this));this.shown?this.open():this.$obj.fadeTo(0,0).css("display","none");this.$obj.bind("open",a.proxy(this.open,this));this.$obj.bind("close",a.proxy(this.close,this))},
toogle:function(){this.shown?this.close():this.open()},close:function(){this.$obj.stop().fadeTo(200,0,function(){a(this).css("display","none")});contentCoverOut(!0);a(window).unbind("resize",a.proxy(this.resize,this));a("#page-wraper").css({height:"",overflow:""});a("#page-wraper-full").css({height:"",overflow:""});return!1},open:function(){contentCoverIn(!0)&&(this.$obj.css("display",""),this.resize(),this.$obj.stop().fadeTo(200,1),a(window).resize(a.proxy(this.resize,this)))},resize:function(){this.$obj.removeClass("mobile");
var b=this.$container.height(),d=a(".easyBackground").height(),c=d/2-b/2-30;console.log(b);console.log(d);console.log(a(".easyBackground").length);0>c?(this.$obj.addClass("mobile"),this.$container.css({top:""}),a("#page-wraper").css({height:b+"px",overflow:"hidden"}),a("#page-wraper-full").css({height:b+"px",overflow:"hidden"})):(this.$container.css({top:c+"px"}),a("#page-wraper").css({height:"",overflow:""}),a("#page-wraper-full").css({height:"",overflow:""}))}};return c});
