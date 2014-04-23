define("jquery libraries/jquery.mobile.vmouse Lightbox/Lightbox ./ModuleButton ./Module ./Line ./Tooltip utils/utils ui/ui-elements".split(" "),function(b,z,w,D,s,E){var x;z=function(a,c,e,f){x=e;this.saved_pages=f;builderPath=c;$body=b("body");this.modules=[];this.lineNum=0;this.lines=[];this.linesSnaps=[];this.bottomSnaps=[];this.lineOver=0;this.$pageBuilderTab=a;this.build();this.moduleDragging=-1;b(window).resize(b.proxy(this.onResize,this));b("#post").submit(b.proxy(this.makeHtml,this));this.fromHtml();
this.menuFromTop=this.$pageBuilderMenu.offset().top;this.menuOffTop=b("#wpbody").offset().top;b(window).scroll(b.proxy(this.onScroll,this))};z.prototype={build:function(){this.$pageBuilderMenu=b("<div class='menu'></div>").appendTo(this.$pageBuilderTab);this.$pageBuilderTab.bind("save",b.proxy(this.makeHtml,this));var a=b("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);b("<a href='#'>Add new placeholder</a>").appendTo(a).processIcon(builderPath+"images/page_builder/MainMenu/placeholder_icon.png");
var c=b("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu);b("<a href='#'>Add new module</a>").appendTo(c).processIcon(builderPath+"images/page_builder/MainMenu/add_icon.png");var e=b("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu),e=b("<a href='#'>Add Pagebreak</a>").appendTo(e);e.processIcon(builderPath+"images/page_builder/MainMenu/add_icon.png");var f=b("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);b("<a href='#'>Load page</a>").appendTo(f).processIcon(builderPath+
"images/page_builder/MainMenu/load_icon.png");var d=b("<div class='menu-button right' style='position:relative;'></div>").appendTo(this.$pageBuilderMenu);b("<a href='#'>Save page</a>").appendTo(d).processIcon(builderPath+"images/page_builder/MainMenu/save_icon.png");var g=b("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);b("<a href='#'>Clear page</a>").appendTo(g).click(b.proxy(this.clearAllClick,this)).processIcon(builderPath+"images/page_builder/MainMenu/delete_icon.png");
var l=this.$loadModuleMenu=b("<div class='menu-dropdown' id='loadDrop'></div>").appendTo(f);f.hover(function(){l.stop().css("display","block").fadeTo(150,1)},function(){l.stop().fadeTo(150,0,function(){b(this).css("display","none")})});this.number_saved_pages=0;b.each(this.saved_pages,b.proxy(function(a,c){this.add_new_page_template_button(a)},this));0==this.number_saved_pages&&this.$loadModuleMenu.html("<p>No saved pages to load!</p>");var h=b("<div class='menu-dropdown' id='saveDrop'></div>").appendTo(d);
this.save_input=b("<input type='text'/>").appendTo(h);b('<a href="#" onclick="return false;">Save</a>').appendTo(h).click(b.proxy(this.save_page,this));var p=this.save_input;d.hover(function(){p.unbind("blur");h.stop().css("display","block").fadeTo(150,1)},function(){p.is(":focus")?p.bind("blur",function(){h.stop().fadeTo(150,0,function(){b(this).css("display","none")})}):h.stop().fadeTo(150,0,function(){b(this).css("display","none")})});var r=b("<div class='menu-dropdown' id='placeholderDrop' style='left: -1px;'></div>").appendTo(a);
a.hover(function(){r.stop().css("display","block").fadeTo(150,1)},function(){r.stop().fadeTo(150,0,function(){b(this).css("display","none")})});var a=b("<div class='wraper'></div>").appendTo(r).append(b("<div class='info-small-pb'>Info</div>")).append(b("<div class='info-pb'>Drag and drop these placeholders on the canvas to create spaces in which you can later drag and drop modules.</div>")),d=b("<div class='row-fluid columns-wraper'></div>").appendTo(r),f=b("<div class='span6'></div>").appendTo(d),
d=b("<div class='span6'></div>").appendTo(d),m=[f,d];b.each([{image:"images/page_builder/Placeholder/1-1.png",column:0,label:"1",sizes:[12]},{image:"images/page_builder/Placeholder/1-2.png",column:0,label:"1/2",sizes:[6]},{image:"images/page_builder/Placeholder/1-2_1-2.png",column:0,label:"1/2 + 1/2",sizes:[6,6]},{image:"images/page_builder/Placeholder/1-3.png",column:0,label:"1-3",sizes:[4]},{image:"images/page_builder/Placeholder/1-3_1-3_1-3.png",column:0,label:"1-3 + 1-3 + 1-3",sizes:[4,4,4]},
{image:"images/page_builder/Placeholder/1-3_2-3.png",column:1,label:"1/3 + 2/3",sizes:[4,8]},{image:"images/page_builder/Placeholder/2-3_1-3.png",column:1,label:"2/3 + 1/3",sizes:[8,4]},{image:"images/page_builder/Placeholder/1-6.png",column:1,label:"1/6",sizes:[2]},{image:"images/page_builder/Placeholder/1-6_1-6_1-6_1-6_1-6_1-6.png",column:1,label:"1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6",sizes:[2,2,2,2,2,2]}],b.proxy(function(a,c){var e=new D.PlaceholderButton(builderPath+c.image,c.label,c.sizes);m[c.column].append(e.$obj);
b(e).bind("moduleButtonDown",b.proxy(this.createPlaceholder,this))},this));e.click(b.proxy(this.createPageBreak,this));var n=b("<div class='menu-dropdown' id='modulesDrop'></div>").appendTo(c);c.hover(function(){n.stop().css("display","block").fadeTo(150,1)},function(){n.stop().fadeTo(150,0,function(){b(this).css("display","none")})});c=a.clone().appendTo(n);b("div.info-pb",c).text("Drag and drop these modules within placeholders. Once placed, you can edit the modules by pressing the edit icon and drag an drop them to different locations.");
b("<p class='title_menu'>Shortcodes</p>").appendTo(n);var f=b("<div class='row-fluid columns-wraper'></div>").appendTo(n),c=b("<div class='span3 column'></div>").appendTo(f),e=b("<div class='span3 column'></div>").appendTo(f),a=b("<div class='span3 column'></div>").appendTo(f),f=b("<div class='span3 column'></div>").appendTo(f),k=[c,e,a,f],c=0,y;for(y in x)x.hasOwnProperty(y)&&c++;var q=Math.ceil(c/4),s=0,t=0;b.each(x,b.proxy(function(a,c){var e=new D.ComponentButton(c);k[t].append(e.$obj);s++;s==
q&&(s=0,t++);b(e).bind("moduleButtonDown",b.proxy(this.createComponent,this))},this));this.$view=b("<div class='view'></div>").appendTo(this.$pageBuilderTab);this.$viewHolder=b("<div class='viewHolder'></div>").appendTo(this.$view);this.$linesHolderOuter=b("<div class='linesHolder'></div>").appendTo(this.$viewHolder);this.$linesHolder=b("<div class='linesHolderInner'></div>").appendTo(this.$linesHolderOuter);this.$baseLine=b("<div class='lineBase'></div>").appendTo(this.$linesHolder);y=100*(1/6);
for(c=0;7>c;c++)b("<div></div>").css({position:"absolute",width:"9px",height:"9px",left:-4-0.2*c+"px","margin-left":y*c+"%","background-image":"url("+builderPath+"images/page_builder/General/grid_plus.png)","background-repeat":"no-repeat"}).appendTo(this.$baseLine);this.addLine();this.addLine();this.addLine();this.$top_snap=b("<a href='#' class='snap_button to_top' data-snap='top'></a>").appendTo(this.$view).click(this.snap_click);this.$bottom_snap=b("<a href='#' class='snap_button to_bottom' data-snap='bottom'></a>").appendTo(this.$view).click(this.snap_click);
new Tooltip(this.$top_snap,"Snap first row to the top",builderPath);new Tooltip(this.$bottom_snap,"Snap last row with content to the bottom",builderPath)},fromHtml:function(){var a=b("#content").val().toString();WP_DEBUG&&console.log("CONTENT:"+a+"\n\n");var c="(";b.each("raw text text_box text_header quote message_box accordion tabs image blog_gallery slider socialVideo music_player divider text_divider vertical_space contact_form button image_button actionbox display-posts google_maps flickr behance pinterest dribbble instagram facebook_like google_plus twitter_button tweet_feed tweet".split(" "),
function(a,b){0!=a&&(c+="|");c+=b});c+=")";if(null!=a&&void 0!=a&&""!=a){var e=a.match(RegExp("(\\[row.*?\\][\\s\\S]*?\\[\\/row\\]|\\<\\!\\-\\-nextpage\\-\\-\\>)","gi"));if(null!=e){for(a=0;a<e.length;a++)if(WP_DEBUG&&console.log("ROW: "+e[a]+"\n\n"),"\x3c!--nextpage--\x3e"==e[a])WP_DEBUG&&console.log("Found line break!\n\n"),this.createPageBreak();else{var f=e[a].match(/snaps=".*?"/i);if(null!=f)var f=f[0],d=7,g=f.length-1,l=f.substring(d,g);var h=e[a].match(RegExp("\\[column.*?\\][\\s\\S]*?\\[\\/column\\]",
"gi"));if(null!=h)for(var p=0,r=0;r<h.length;r++){WP_DEBUG&&console.log("COLUMN: "+h[r]+"\n");var m=h[r].match(RegExp("\\[column.*?\\]","gi"));if(null==m){WP_DEBUG&&console.log("Page Builder error");return}var d='size=".*?"',d=RegExp(d,"i"),n=m[0].match(d),n=n[0],d=6,g=n.length-1,n=parseInt(n.substring(d,g),10),d='offset=".*?"',d=RegExp(d,"i"),k=m[0].match(d),k=k[0],d=8,g=k.length-1,d=parseInt(k.substring(d,g),10),p=p+d;WP_DEBUG&&console.log("----------------size: "+n);WP_DEBUG&&console.log("----------------offset: "+
d);WP_DEBUG&&console.log("----------------column: "+p);d=/content_align=".*?"/i;k=m[0].match(d);if(null!=k)var k=k[0],d=15,g=k.length-1,y=k.substring(d,g);var d=/use_paddings=".*?"/i,q=m[0].match(d);if(null!=q)var q=q[0],d=14,g=q.length-1,w=q.substring(d,g);var d=/padding=".*?"/i,t=m[0].match(d);if(null!=t)var t=t[0],d=9,g=t.length-1,z=t.substring(d,g);d=new s.Placeholder(n,p,this.modules.length);this.lines[a].addModule(d);d.show();d.priority=0;this.modules.push(d);b(d).bind("moduleDown",b.proxy(this.placeholderDown,
this));b(d).bind("moduleDelete",b.proxy(this.placeholderDelete,this));b(d).bind("moduleResize",b.proxy(this.correctGrid,this));b(d).bind("moduleDuplicateInsert",b.proxy(this.duplicateInsertGrid,this));null!=q&&(d.options.use_paddings=w,d.options.padding=z);null!=k&&(d.options.content_align=y);p+=n;m=h[r].substring(m[0].length,h[r].length-9);WP_DEBUG&&console.log("----------------content: "+m);n=RegExp("\\["+c+"{1}[\\s\\S]*?\\]","gi");do if(g=m.match(n),null!=g){for(var k=g[0],u="",q=1;" "!=k.charAt(q)&&
"]"!=k.charAt(q);)u+=k.charAt(q),q++;WP_DEBUG&&console.log("----------------shortcode: "+u);var v=m.match(RegExp("\\["+u+"[\\s\\S]*?\\][\\s\\S]*?\\[\\/"+u+"\\]","gi"));if(null!=v){v=v[0];WP_DEBUG&&console.log("--------------------------------shortcode component: "+v);var m=m.substring(v.length),C=k,k=x[u],A=new s.Component(k),B=function(a){if("content"!=a.associate){WP_DEBUG&&console.log(a.associate);var c=RegExp("\\s"+a.associate+'="[\\s\\S]*?"',"i");WP_DEBUG&&console.log(C);c=C.match(c);if(null!=
c&&(c=c[0],null!=c)){var b=c.substring(a.associate.length+3,c.length-1);WP_DEBUG&&console.log(a.associate+": "+b);b=b.toString().replace(/(&quote;)/g,'"');A.parameters[a.id].value=b}}else b=C.length,c=v.length-(u.length+3),b=c<=b?"":v.substring(b,c),WP_DEBUG&&console.log("--------------------------------shortcode content:"+b),A.parameters[a.id].value=b;return b};b.each(k.options,function(a,c){if("tabs"==c.type||"tabs_unbinded"==c.type)if("tabs"==c.type){var e=B(c);b.each(c.tabs[e],function(a,c){B(c)})}else b.each(c.tabs,
function(a,c){b.each(c,function(a,c){B(c)})});else B(c)});d.addComponent(A);A.build();b(A).bind("moduleDown",b.proxy(this.componentDown,this))}}while(null!=g&&1<m.length)}this.checkNumLines();null!=f&&(0==a&&"t"==l.charAt(0)?this.$top_snap.addClass("active"):0==a&&this.$top_snap.removeClass("active"),"l"==l.charAt(1)?this.linesSnaps[a].eq(0).addClass("active"):this.linesSnaps[a].eq(0).removeClass("active"),"r"==l.charAt(2)?this.linesSnaps[a].eq(1).addClass("active"):this.linesSnaps[a].eq(1).removeClass("active"),
"b"==l.charAt(3)&&a==e.length-1?this.$bottom_snap.addClass("active"):"b"==l.charAt(3)?this.bottomSnaps[a].addClass("active"):(this.bottomSnaps[a].removeClass("active"),this.$bottom_snap.removeClass("active")))}this.correctGrid()}else b("#content").val('[row snaps="0000"][column size="12" offset="0" content_align="left" use_paddings="false" padding=""] [raw ]'+a+"[/raw][/column][/row]"),this.fromHtml()}},makeHtml:function(){for(var a="",c=0;c<this.lines.length;c++){var e=this.lines[c];if(!e.isEmpty()){(e=
1==e.modules.length&&"pagebreak"==e.modules[0].type)||(a+='[row snaps="');var f="",f=0==c&&this.$top_snap.hasClass("active")?f+"t":f+"0",f=this.linesSnaps[c].eq(0).hasClass("active")&&this.linesSnaps[c].eq(0).is(":visible")?f+"l":f+"0",f=this.linesSnaps[c].eq(1).hasClass("active")&&this.linesSnaps[c].eq(1).is(":visible")?f+"r":f+"0",f=c<this.lines.length&&this.lines[c+1].isEmpty()&&this.$bottom_snap.hasClass("active")||c<this.lines.length&&!this.lines[c+1].isEmpty()&&this.bottomSnaps[c].hasClass("active")?
f+"b":f+"0",a=a+(f+'"]'),f=this.lines[c].getOrderedModules(),d=0;b.each(f,b.proxy(function(c,b){var e=this.modules[b],f=0;d!=e.column&&(f=e.column-d);a+=e.getHtml(f);d=e.column+e.size},this));e||(a+="[/row]")}}b("#content").val(a);WP_DEBUG&&console.log(a);return!0},save_page:function(){var a=this.save_input.val();this.confirm_lightbox=new w("Confirm Save",builderPath,b.proxy(this.save_confirmed,this),500,"No","Yes, I'm sure!");this.saved_pages.hasOwnProperty(a)?this.confirm_lightbox.addContent("<p>Are you sure you want to save this page and <strong>replace</strong> the existing "+
a+" page template?</p>"):this.confirm_lightbox.addContent("<p>Are you sure you want to save this page template as "+a+"?</p>");return!1},save_confirmed:function(){this.confirm_lightbox.switchLoading("Saving Template");title=this.save_input.val();this.makeHtml();jQuery.post(adminAjax,{action:"pq_save_page_template",title:title,content:b("#content").val()},b.proxy(function(a){this.saved_pages.hasOwnProperty(title)||this.add_new_page_template_button(title);this.saved_pages[title]=b("#content").val();
this.confirm_lightbox.closeEdit()},this))},add_new_page_template_button:function(a){0==this.number_saved_pages&&this.$loadModuleMenu.html("");b('<div href="#" data-rel="'+a+'" onclick="return false;">'+a+'<a class="remove_saved" href="#"></a></div>').appendTo(this.$loadModuleMenu).click(b.proxy(this.load_page,this));this.number_saved_pages++},load_page:function(a){a=b(a.target);a.hasClass("remove_saved")?(this.to_remove_title=a=a.parent().attr("data-rel"),this.confirm_lightbox=new w("Confirm Saved Page Remove",
builderPath,b.proxy(this.template_remove_confirmed,this),500,"No","Yes, I'm sure!"),this.confirm_lightbox.addContent("<p>Are you sure you want to <strong>remove</strong> the "+a+" page template?</p>")):(this.to_load_title=a=a.attr("data-rel"),this.confirm_lightbox=new w("Confirm Load",builderPath,b.proxy(this.load_confirmed,this),500,"No","Yes, I'm sure!"),this.confirm_lightbox.addContent("<p>Are you sure you want to load "+a+" page template? <strong>This will erase everything you have on your page now!</strong></p>"));
return!1},load_confirmed:function(){this.confirm_lightbox.closeEdit();this.clearAll();b("#content").val(this.saved_pages[this.to_load_title]);this.fromHtml()},template_remove_confirmed:function(){this.confirm_lightbox.switchLoading("Removing Template");jQuery.post(adminAjax,{action:"pq_remove_page_template",title:this.to_remove_title},b.proxy(function(a){this.$loadModuleMenu.find('div[data-rel="'+this.to_remove_title+'"]').remove();this.confirm_lightbox.closeEdit();this.number_saved_pages--;0==this.number_saved_pages&&
this.$loadModuleMenu.html("<p>No saved pages to load!</p>")},this))},getCenteredRelativeGridPosition:function(a,c,b){c=this.getGridPos(a,c);a=c.line;c=Math.round(c.column-b/2);0>c&&(c=0);12<c+b&&(c=12-b);return{column:c,line:a}},createModuleFinal:function(a){b(a.target).unbind("moduleButtonMove");b(a.target).unbind("moduleButtonUp");if("module"==this.type)-1!=this.targetPlaceholder&&(this.modules[this.targetPlaceholder].addComponent(this.module),this.module.build(),b(this.module).bind("moduleDown",
b.proxy(this.componentDown,this))),this.checkNumLines(),this.correctGrid();else{for(a=0;a<this.sizes.length;a++)this.placeholders[a].show(),this.lines[this.currentLine].addModule(this.placeholders[a]),b(this.placeholders[a]).bind("moduleDown",b.proxy(this.placeholderDown,this)),b(this.placeholders[a]).bind("moduleDelete",b.proxy(this.placeholderDelete,this)),b(this.placeholders[a]).bind("moduleResize",b.proxy(this.correctGrid,this)),b(this.placeholders[a]).bind("moduleDuplicateInsert",b.proxy(this.duplicateInsertGrid,
this));this.checkNumLines();this.correctGrid();for(a=0;a<this.sizes.length;a++)this.placeholders[a].priority=0}return!1},createComponent:function(a,c){this.module=new s.Component(x[c]);this.type="module";this.targetPlaceholder=-1;b(a.target).bind("moduleButtonMove",b.proxy(this.movingComponentInit,this));b(a.target).bind("moduleButtonUp",b.proxy(this.createModuleFinal,this))},processComponentMoving:function(a,c){if(-1!=a){if(this.targetPlaceholder!=a){var b=this.modules[a];-1!=this.targetPlaceholder&&
this.modules[this.targetPlaceholder].cancelAbove();b.componentAbove(c);this.targetPlaceholder=a}}else-1!=this.targetPlaceholder&&this.modules[this.targetPlaceholder].cancelAbove(),this.targetPlaceholder=-1},movingComponentInit:function(a,c,b){c=this.getGridPos(c,b);c=this.hittedPlaceholder(c.line,c.column);this.processComponentMoving(c,a.target.info.color)},duplicateInsertGrid:function(a,c){b(c).bind("moduleDown",b.proxy(this.componentDown,this));b("html, body").animate({scrollTop:c.$obj.offset().top+
"px"},300)},componentDown:function(a,c){WP_DEBUG&&console.log("componentDown");this.targetPlaceholder=c;b(a.target).bind("moduleMove",b.proxy(this.movingComponent,this));b(a.target).bind("moduleUp",b.proxy(this.placeComponent,this));return!1},movingComponent:function(a,c,b){a=a.target;c=this.getGridPos(c,b);c=this.hittedPlaceholder(c.line,c.column);var f=a.placeholder;-1!=c&&c!=f?this.processComponentMoving(c,a.info.color):(this.modules[a.placeholder].movingComponent(b,a.number),this.targetPlaceholder!=
a.placeholder&&this.modules[this.targetPlaceholder].cancelAbove(),this.targetPlaceholder=a.placeholder);return!1},placeComponent:function(a){b(a.target).unbind("moduleMove");b(a.target).unbind("moduleUp");var c=a.target.placeholder;-1!=this.targetPlaceholder&&this.targetPlaceholder!=c&&(this.modules[c].removeComponent(a.target.number),this.modules[this.targetPlaceholder].addComponent(a.target));return!1},movingPlaceholdersBlock:function(a,c){if(a!=this.currentLine||c!=this.currentColumn){this.currentColumn=
c;this.currentLine=a;for(var b=0;b<this.sizes.length;b++)this.$spotlight=this.placeholders[b].$obj,this.updateSpotlight(),this.placeholders[b].column=this.currentColumn,this.currentColumn+=this.sizes[b]}},createPlaceholder:function(a,c,e,f,d){this.placeholders=[];this.combinedSize=0;this.sizes=c;this.size=e;f=this.getCenteredRelativeGridPosition(f,d,e);e=f.line;for(f=f.column;this.lines[e].isEmpty()&&0!=e;)e--;this.currentColumn=this.currentLine=-1;for(d=0;d<c.length;d++)this.combinedSize+=c[d];12<
f+this.combinedSize&&(f=12-this.combinedSize);for(d=this.combinedSize=0;d<c.length;d++){var g=new s.Placeholder(c[d],f+this.combinedSize,this.modules.length);this.modules.push(g);this.placeholders.push(g);this.combinedSize+=c[d];g.$obj.appendTo(this.$viewHolder);g.$obj1.css("width",Math.round(this.$linesHolder.width()*(c[d]/12)-14)+"px")}this.type="placeholder";b(a.target).bind("moduleButtonMove",b.proxy(this.movingPlaceholderInit,this));b(a.target).bind("moduleButtonUp",b.proxy(this.createModuleFinal,
this));this.movingPlaceholdersBlock(e,f)},movingPlaceholderInit:function(a,c,b){c=this.getCenteredRelativeGridPosition(c,b,this.size);a=c.line;for(c=c.column;0<a&&this.lines[a-1].isEmpty();)a--;12<c+this.combinedSize&&(c=12-this.combinedSize);this.movingPlaceholdersBlock(a,c);return!1},placeholderDelete:function(a,c){this.lines[this.modules[c].line].removeModule(c);this.modules=removePositionInArray(this.modules,c);for(var b=0;b<this.modules.length;b++)this.modules[b].number=b;this.correctGrid();
this.checkNumLines()},placeholderDown:function(a,c,e,f){WP_DEBUG&&console.log("placeholderDown");this.initialLine=e;this.initialColumn=f;this.currentLine=e;this.currentColumn=f;this.moduleDragging=c;this.modules[c].priority=2;this.$spotlight=b("<div class='placeholderModule' style='position:absolute;'></div>").css("width",this.modules[c].$obj.width()-14).appendTo(this.$viewHolder);this.updateSpotlight();b(a.target).bind("moduleMove",b.proxy(this.movingPlaceholder,this));b(a.target).bind("moduleUp",
b.proxy(this.placePlaceholder,this));return!1},updateSpotlight:function(){var a=this.lines[this.currentLine].getOffsetY()-this.$viewHolder.offset().top,c=15+this.$viewHolder.width()/12*this.currentColumn,b=this.lines[this.currentLine].holder.height()-3;this.$spotlight.css({top:a+"px",left:c+"px",height:b+"px"})},movingPlaceholder:function(a,c,b){c=this.getGridPos(c,b);a=c.line;c=c.column;b=this.modules[this.moduleDragging];for(12<c+b.size&&(c=12-b.size);0<a&&(this.lines[a-1].isEmpty()||this.lines[a].isEmpty()&&
this.lines[a-1].hasOnly(b));)a--;if(a!=this.currentLine||c!=this.currentColumn)this.currentLine=a,this.currentColumn=c,this.updateSpotlight(),b.column=this.currentColumn;return!1},placePlaceholder:function(a){b(a.target).unbind("moduleMove");b(a.target).unbind("moduleUp");a=this.modules[this.moduleDragging];this.currentLine!=this.initialLine&&(this.lines[this.initialLine].removeModule(this.moduleDragging),this.lines[this.currentLine].addModule(a));this.currentColumn!=this.initialColumn&&(a.column=
this.currentColumn);this.$spotlight.remove();this.correctGrid();this.modules[this.moduleDragging].priority=0;this.moduleDragging=-1;return!1},createPageBreak:function(){for(var a=this.lines.length;this.lines[a-1].isEmpty()&&0!=a-1;)a--;var c=new s.Pagebreak(a,this.modules.length);this.modules.push(c);this.lines[a].addModule(c);b(c).bind("moduleDown",b.proxy(this.placeholderDown,this));b(c).bind("moduleDelete",b.proxy(this.placeholderDelete,this));this.checkNumLines();this.correctGrid();return!1},
checkIntersection:function(a){for(var c=0;c<this.modules.length;c++)if(this.modules[c].line==a)return!0;return!1},resolveIntersection:function(a){for(var c=0;c<a;){if(this.lines[c].isEmpty()){for(var b=0;b<this.modules.length;b++)this.modules[b].line==a&&this.modules[b].changeLine(c);return}c++}c=a;this.checkIntersection(c+1)&&this.resolveIntersection(c+1);for(b=0;b<this.modules.length;b++)this.modules[b].line==c&&this.modules[b].changeLine(c+1)},hittedPlaceholder:function(a,c){for(var b=0;b<this.modules.length;b++)if("placeholder"==
this.modules[b].type&&this.modules[b].line==a&&c>=this.modules[b].column&&c<this.modules[b].column+this.modules[b].size)return b;return-1},onScroll:function(){var a=b(window).scrollTop();this.menuFromTop=this.$pageBuilderTab.offset().top;var c=this.menuFromTop+this.$pageBuilderTab.height()-this.menuFromTop;a-this.menuFromTop+this.menuOffTop<c&&(a>this.menuFromTop-this.menuOffTop?this.$pageBuilderMenu.css({top:a-this.menuFromTop+this.menuOffTop+"px"}):this.$pageBuilderMenu.css({top:"0px"}))},clearAllClick:function(){this.clear_all_lightbox=
new w("Confirm Clear All",builderPath,b.proxy(this.clearAll,this),500,"No","Yes, I'm sure!");this.clear_all_lightbox.addContent("<p>Are you sure you want to clear all modules and placeholders on this page? This action doesn't have undo!</p>");return!1},clearAll:function(){for(var a=0;a<this.modules.length;a++)this.modules[a].removeQuick();this.modules=[];for(a=0;a<this.lines.length;a++)this.lines[a].modules=[];this.correctGrid();this.checkNumLines();void 0!==this.clear_all_lightbox&&(this.clear_all_lightbox.closeEdit(),
this.clear_all_lightbox=void 0);return!1},currentOverLine:function(a,c){this.lineOver=c;return!1},addLine:function(){var a=new E.newLine(this.$linesHolder,this.lines.length,this.$baseLine),c=b("<a href='#' class='snap_button to_left' data-snap='"+this.lines.length+"'></a>").appendTo(this.$view).click(this.snap_click),e=b("<a href='#' class='snap_button to_right' data-snap='"+this.lines.length+"'></a>").appendTo(this.$view).click(this.snap_click);new Tooltip(c,"Snap row to the left",builderPath);new Tooltip(e,
"Snap row to the right",builderPath);var f=b("<a href='#' class='snap_button vertical' data-snap='"+this.lines.length+"'></a>").appendTo(a.baseline).click(this.snap_click);new Tooltip(f,"No margin between these 2 rows",builderPath);b(a).bind("overThis",b.proxy(this.currentOverLine,this));this.lines.push(a);this.linesSnaps.push(c.add(e));this.bottomSnaps.push(f);this.correctGrid()},snap_click:function(){var a=b(this);a.hasClass("active")?a.removeClass("active"):a.addClass("active");return!1},removeLine:function(){},
correctGrid:function(){b.each(this.lines,b.proxy(function(a,c){var b=c.organize();b&&0<b.length&&(0!=a&&this.lines[a-1].isEmpty()?(this.lines[a-1].pushModules(b),this.lines[a-1].organize()):this.lines[a+1].pushModules(b));b=c.getOffsetY()-this.$view.offset().top+c.holder.height()/2-13;this.linesSnaps[a].css("top",b+"px");a==this.lines.length-1||c.isEmpty()||this.lines[a+1].isEmpty()?this.bottomSnaps[a].hide():this.bottomSnaps[a].show();c.isEmpty()?this.linesSnaps[a].hide():(0==c.getModulesInColumn(0).length?
this.linesSnaps[a].eq(0).hide():this.linesSnaps[a].eq(0).show(),c.hasColumnInEnd()?this.linesSnaps[a].eq(1).show():this.linesSnaps[a].eq(1).hide())},this));this.clearBlankLines();this.checkNumLines()},clearBlankLines:function(){for(var a=0;a<this.lines.length;a++)this.lines[a].isEmpty()&&this.pushAllTop(a+1)},pushAllTop:function(a){if(0!=a)for(;a<this.lines.length;a++){var c=this.lines[a].popModules();this.lines[a-1].pushModules(c);this.lines[a-1].organize();this.lines[a].organize()}},checkNumLines:function(){var a=
0;b.each(this.lines,function(c,b){b.isEmpty()&&a++});if(1>=a)this.addLine();else for(;2<a;)this.removeLine(),a--},getNumberEmptyLines:function(){for(var a=0,b=0;b<this.modules.length;b++)this.modules[b].line>a&&(a=this.modules[b].line);return gridLines.length-(a+1)},getGridPos:function(a,b){var e=this.$linesHolder.offset();a-=e.left;e=this.$linesHolder.width();e=Math.round(12*(a/e));0>e?e=0:10<e&&(e=10);for(var f=this.lines.length-1,d=1;d<this.lines.length;d++)if(b<this.lines[d].getOffsetY()){f=d-
1;break}return{column:e,line:f}},getPriorityRow:function(){var a=0,b=0,e=[];this.getModulesFromLine(a);var f=0,d=0;do{var g=this.getModulesHittingPos(b,a);if(0!=g.length){if(1==g.length)if(g[0]==this.moduleDragging)addIfDoesnExist(g[0],e);else{var l=this.modCollidesWithDrag(g[0]);if(-1==l)addIfDoesnExist(g[0],e);else{var h=this.modules[g[0]].size;d>=h?(addIfDoesnExist(g[0],e),d-=h):(f>=h-l||addIfDoesnExist(this.moduleDragging,e),addIfDoesnExist(g[0],e))}}else for(;0!=g.length;){var l=this.getHighestPriority(g),
p=g[l],g=removePositionInArray(g,l);p==this.moduleDragging&&0<g.length&&(l=this.getHighestPriority(g),h=this.modules[g[l]].size,d>=h?(addIfDoesnExist(g[l],e),g=removePositionInArray(g,l),d-=h):f>=h&&(addIfDoesnExist(g[l],e),g=removePositionInArray(g,l),f-=h));addIfDoesnExist(p,e)}f=0}else f++;b++;12==b&&(b=0,a++,this.getModulesFromLine(a),d=f,f=0)}while(e.length!=this.modules.length);return e},getHighestPriority:function(a){for(var b=0;b<a.length;b++)if(a[b]==this.moduleDragging)return b;for(var e=
20,f=-1,b=0;b<a.length;b++)this.modules[a[b]].column<e&&(e=this.modules[a[b]].column,f=b);return f},modCollidesWithDrag:function(a){if(-1==this.moduleDragging)return-1;var b=this.modules[this.moduleDragging];a=this.modules[a];return b.line==a.line&&b.column>=a.column&&b.column<a.column+a.size?b.column-a.column:-1},getModulesFromLine:function(a){var c=[];b.each(this.modules,function(b,f){f.line==a&&c.push(f)});return c},getModulesHittingPos:function(a,c){var e=[];b.each(this.modules,function(b,d){d.line==
c&&d.column==a&&e.push(b)});return e}};return z});