define(["jquery","utils/utils"],function(a){var m=function(g,b,c,d,h,l){a(document).ready(a.proxy(function(a){this.$holder=g;this.$loading_more=a(".loading_more");this.objects_query=b;this.postID=l;this.$fullDiv=a(".easyBackground");this.itemsShown=0;this.maxWidth=c;this.minColumns=d;this.loadingFurnace=!1;this.hasMore=this.firstFurnace=!0;this.currentNumber=0;var p=this.$holder.width();this.number=7*this.getNumberColumns(p);this.offset=0;this.ajaxFunction=h;this.loadFurnace();a(window).resize(a.proxy(this.window_resize_timeout,
this))},this))};m.prototype={loadFurnace:function(){if(!this.loadingFurnace&&this.hasMore&&0!=this.$holder.length){this.firstFurnace||this.$loading_more.show();var g="number="+this.number+"&offset="+this.offset+"&action="+this.ajaxFunction+"&postId="+this.postID+"&maxWidth="+this.maxWidth;this.loadingFurnace=!0;this.offset+=this.number;console.log("Trying to load "+this.number+" items");a.post(adminAjax,g,a.proxy(function(b,c){var d=a(b);this.$holder.append(d);d=this.$holder.find(this.objects_query).length-
this.currentNumber;this.currentNumber+=d;d<this.number&&(this.hasMore=!1);d=a(this.objects_query).css({position:"absolute"});this.items=[];d.each(a.proxy(function(d,b){var c=a(b);this.items.push(c)},this));this.ensureLoad();a(this).trigger("added")},this))}},ensureLoad:function(){var g=this.$holder.find("img, .slider"),b=g.length,c=0;0<b?g.ensureLoad(a.proxy(function(){c++;console.log("loaded "+c+"/"+b);c==b&&this.allElementsAreLoaded()},this)):this.allElementsAreLoaded()},allElementsAreLoaded:function(){this.loadingFurnace=
!1;this.resize();this.$holder.find(".slider").trigger("resizeSlider");this.resize();this.window_resize_timeout();this.$loading_more.hide();this.showItem();this.firstFurnace&&(this.firstFurnace=!1,a(window).unbind("scroll",a.proxy(this.onGridScroll,this)),a(window).scroll(a.proxy(this.onGridScroll,this)));a(this).trigger("furnaceLoaded")},onGridScroll:function(){this.hasMore&&a(window).scrollTop()>a(document).height()-a(window).height()-500&&this.loadFurnace()},showItem:function(){clearTimeout(this.showItemsTimeout);
this.items[this.itemsShown++].addClass("appear");this.itemsShown<this.items.length&&(this.showItemsTimeout=setTimeout(a.proxy(this.showItem,this),60))},windowResized:function(){void 0!=this.items&&0<this.items.length&&this.resize()},window_resize_timeout:function(){clearTimeout(this.resize_timeout);this.resize_timeout=setTimeout(a.proxy(this.windowResized,this),200)},getNumberColumns:function(a){for(var b=0,c=this.maxWidth+1;c>this.maxWidth;)b++,c=a/b;b<this.minColumns&&(b=this.minColumns);return b},
changedCategory:function(a){this.resize(!1===a?!1:!0)},resize:function(g){if(!this.loadingFurnace){var b=this.$fullDiv.height(),c=!1;b<this.$holder.height()&&(c=!0);var d=this.$holder.width(),h=this.getNumberColumns(d),l=Math.ceil(d/h);this.number=7*h;for(var e=[],d=h;d--;)e[d]=0;var p=0;a.each(this.items,a.proxy(function(a,b){if(b.is(":visible")){b.css({width:l+"px"});for(var d=Math.floor(b.height())-1,c=p++;c>=h;)c-=h;for(var k=e[c],f=0,n=0;f<h;)e[f]>n&&(n=e[f]),f++;for(var f=0,m=d/2;f<h;)n-e[f]>
m&&(k=e[f],c=f,m=n-e[f]),f++;g?b.stop().animate({left:l*c+"px",top:k+"px"},500,"easeOutExpo"):b.css({left:l*c+"px",top:k+"px"});c==h-1?b.addClass("last"):b.removeClass("last");e[c]+=d}},this));for(var k=0,d=0;d<e.length;d++)e[d]>k&&(k=e[d]);this.$holder.css("height",k+"px");b>=k&&c?(c=a(window).scrollTop(),this.$holder.css("height",b-1+"px"),this.resize(g),a(window).scrollTop(c)):(b<k&&!c&&this.resize(g),a(this).trigger("gridResize"),this.$holder.find(".social_video").trigger("gridResize"),this.$holder.find(".music_player").trigger("playerResize"))}}};
return m});
