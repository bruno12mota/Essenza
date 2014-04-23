define("jquery libraries/jquery.mobile.vmouse ./PageBuilder/ModuleButton ./PageBuilder/Module ./PageBuilder/Line ./PageBuilder/Tooltip utils/utils ui/ui-elements".split(" "),function(d,n,t,s,v){var u=[{name:"Text Block",column:0,color:"#b2d516",icon:"images/page_builder/Modules/module_textbox.png",shortcode:"text",info:"#0",content:0,parameters:[{id:"text",name:"Text",type:"editor",value:""},{id:"switch",name:"Switch",type:"switch",value:!1},{id:"checkbox",name:"Checkbox",type:"checkbox",value:!0},
{id:"combobox",name:"Combobox",type:"combobox",value:"1",options:["Option 1","Option 2","Option 3","Option 4"]}]},{name:"Image Gallery",column:0,color:"#04aedf",icon:"images/page_builder/Modules/module_image_gallery.png",info:"Holding <span>#0</span> images...",content:-1,shortcode:"gallery",parameters:[{id:"image",name:"Image Selector",type:"image",value:""}]},{name:"Line Divider",column:0,color:"#fce72a",icon:"images/page_builder/Modules/module_divider.png",content:-1,shortcode:"",parameters:[]},
{name:"Image Slider",column:0,color:"#fc59ac",icon:"images/page_builder/Modules/module_image_slider.png",info:"Holding <span>#0</span> slides...",content:0,shortcode:"slider",parameters:[{id:"slider",name:"Slider Editor",type:"slider",value:""}]},{name:"Accordion",column:0,color:"#14be44",icon:"images/page_builder/Modules/module_accordion.png",content:-1,shortcode:"",parameters:[]},{name:"Tabs & Tours",column:0,color:"#0177c1",icon:"images/page_builder/Modules/module_tabs_tours.png",content:-1,shortcode:"",
parameters:[]},{name:"Video Object",column:1,color:"#ff2500",icon:"images/page_builder/Modules/module_video_object.png",content:-1,shortcode:"",parameters:[]},{name:"Single Image",column:1,color:"#8b1cb8",icon:"images/page_builder/Modules/module_single_image.png",content:-1,shortcode:"",parameters:[]},{name:"Lightbox",column:1,color:"#ff9104",icon:"images/page_builder/Modules/module_lightbox.png",content:-1,shortcode:"",parameters:[]},{name:"MessageBox",column:1,color:"#f41e66",icon:"images/page_builder/Modules/module_message_box.png",
content:-1,shortcode:"",parameters:[]},{name:"Button",column:1,color:"#00fffb",icon:"images/page_builder/Modules/module_buttons.png",content:-1,shortcode:"",parameters:[]},{name:"List",column:1,color:"#9c6338",icon:"images/page_builder/Modules/module_list.png",content:-1,shortcode:"",parameters:[]},{name:"Togglebox",column:2,color:"#be9bf9",icon:"images/page_builder/Modules/module_togglebox.png",content:-1,shortcode:"",parameters:[]},{name:"Social Icons",column:2,color:"#969696",icon:"images/page_builder/Modules/module_social_icons.png",
content:-1,shortcode:"",parameters:[]},{name:"Twitter Widget",column:3,color:"#4bc6f0",icon:"images/page_builder/Modules/twitter_icon.png",content:-1,shortcode:"",parameters:[]},{name:"Facebook Like",column:3,color:"#395499",icon:"images/page_builder/Modules/facebook_icon.png",content:-1,shortcode:"",parameters:[]},{name:"Google+",column:3,color:"#c5351a",icon:"images/page_builder/Modules/google+_icon.png",content:-1,shortcode:"",parameters:[]},{name:"Pinterest Button",column:3,color:"#ac1e1c",icon:"images/page_builder/Modules/pinterest_icon.png",
content:-1,shortcode:"",parameters:[]},{name:"Tweetme Button",column:3,color:"#4bc6f0",icon:"images/page_builder/Modules/twitter_icon.png",content:-1,shortcode:"",parameters:[]},{name:"Flickr Gallery",column:3,color:"#e6306b",icon:"images/page_builder/Modules/flickr_icon.png",content:-1,shortcode:"",parameters:[]}];n=function(a,b){u=b;this.modules=[];this.lineNum=0;this.lines=[];this.lineOver=0;this.$pageBuilderTab=a;this.build();this.moduleDragging=-1;d(window).resize(d.proxy(this.onResize,this));
d("#post").submit(d.proxy(this.makeHtml,this));this.fromHtml();this.menuFromTop=this.$pageBuilderMenu.offset().top;this.menuOffTop=d("#wpbody").offset().top;d(window).scroll(d.proxy(this.onScroll,this))};n.prototype={build:function(){this.$pageBuilderMenu=d("<div class='menu'></div>").appendTo(this.$pageBuilderTab);this.$pageBuilderTab.bind("save",d.proxy(this.makeHtml,this));var a=d("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu),b=d("<a href='#'>Add new placeholder</a>").appendTo(a);
processIcon(b,builderPath+"images/page_builder/MainMenu/placeholder_icon.png");var b=d("<div class='menu-button'></div>").appendTo(this.$pageBuilderMenu),c=d("<a href='#'>Add new module</a>").appendTo(b);processIcon(c,builderPath+"images/page_builder/MainMenu/add_icon.png");c=d("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);c=d("<a href='#' class='right'>Load page</a>").appendTo(c);processIcon(c,builderPath+"images/page_builder/MainMenu/load_icon.png");c=d("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);
c=d("<a href='#' class='right'>Save page</a>").appendTo(c);processIcon(c,builderPath+"images/page_builder/MainMenu/save_icon.png");c=d("<div class='menu-button right'></div>").appendTo(this.$pageBuilderMenu);c=d("<a href='#'>Clear page</a>").appendTo(c).click(d.proxy(this.clearAll,this));processIcon(c,builderPath+"images/page_builder/MainMenu/delete_icon.png");var h=d("<div class='menu-dropdown' id='placeholderDrop'></div>").appendTo(a);a.hover(function(){h.stop().css("display","block").fadeTo(200,
1)},function(){h.stop().fadeTo(200,0,function(){d(this).css("display","none")})});var a=d("<div class='wraper'></div>").appendTo(h).append(d("<div class='info-small-pb'>Info</div>")).append(d("<div class='info-pb'>Drag and drop these placeholders on the canvas to create spaces in which you can later drag and drop modules.</div>")),e=d("<div class='row-fluid columns-wraper'></div>").appendTo(h),c=d("<div class='span6'></div>").appendTo(e),e=d("<div class='span6'></div>").appendTo(e),f=[c,e];d.each([{image:"images/page_builder/Placeholder/1-1.png",
column:0,label:"1",sizes:[12]},{image:"images/page_builder/Placeholder/1-2.png",column:0,label:"1/2",sizes:[6]},{image:"images/page_builder/Placeholder/1-2_1-2.png",column:0,label:"1/2 + 1/2",sizes:[6,6]},{image:"images/page_builder/Placeholder/1-3.png",column:0,label:"1-3",sizes:[4]},{image:"images/page_builder/Placeholder/1-3_1-3_1-3.png",column:0,label:"1-3 + 1-3 + 1-3",sizes:[4,4,4]},{image:"images/page_builder/Placeholder/1-3_2-3.png",column:1,label:"1/3 + 2/3",sizes:[4,8]},{image:"images/page_builder/Placeholder/2-3_1-3.png",
column:1,label:"2/3 + 1/3",sizes:[8,4]},{image:"images/page_builder/Placeholder/1-6.png",column:1,label:"1/6",sizes:[2]},{image:"images/page_builder/Placeholder/1-6_1-6_1-6_1-6_1-6_1-6.png",column:1,label:"1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6",sizes:[2,2,2,2,2,2]}],d.proxy(function(a,b){var c=new t.PlaceholderButton(builderPath+b.image,b.label,b.sizes);f[b.column].append(c.$obj);d(c).bind("moduleButtonDown",d.proxy(this.createPlaceholder,this))},this));var g=d("<div class='menu-dropdown' id='modulesDrop'></div>").appendTo(b);
b.hover(function(){g.stop().css("display","block").fadeTo(200,1)},function(){g.stop().fadeTo(200,0,function(){d(this).css("display","none")})});b=a.clone().appendTo(g);d("div.info-pb",b).text("Drag and drop these modules on the canvas. Modules can be placed directly on the canvas or within placeholders. Once placed, you can edit the modules by pressing the edit icon.");b=d("<div class='row-fluid columns-wraper'></div>").appendTo(g);a=d("<div class='span9'></div>").appendTo(b);b=d("<div class='span3'></div>").appendTo(b);
d("<p>Custom</p>").appendTo(a);e=d("<div class='row-fluid'></div>").appendTo(a);a=d("<div class='span4 column'></div>").appendTo(e);c=d("<div class='span4 column'></div>").appendTo(e);e=d("<div class='span4 column'></div>").appendTo(e);d("<p>Social</p>").appendTo(b);var b=d("<div class='span12 column'></div>").appendTo(b),k=[a,c,e,b];d.each(u,d.proxy(function(a,b){var c=new t.ComponentButton(b);k[b.column].append(c.$obj);d(c).bind("moduleButtonDown",d.proxy(this.createComponent,this))},this));this.$view=
d("<div class='view'></div>").appendTo(this.$pageBuilderTab);this.$viewHolder=d("<div class='viewHolder'></div>").appendTo(this.$view);this.$linesHolderOuter=d("<div class='linesHolder'></div>").appendTo(this.$viewHolder);this.$linesHolder=d("<div class='linesHolderInner'></div>").appendTo(this.$linesHolderOuter);this.$baseLine=d("<div class='lineBase'></div>").appendTo(this.$linesHolder);b=100*(1/6);for(a=0;7>a;a++)d("<div></div>").css({position:"absolute",width:"9px",height:"9px",left:-4-0.2*a+
"px","margin-left":b*a+"%","background-image":"url("+builderPath+"images/page_builder/General/grid_plus.png)","background-repeat":"no-repeat"}).appendTo(this.$baseLine);this.addLine();this.addLine();this.addLine()},fromHtml:function(){var a=d("#content").val().toString();WP_DEBUG&&console.log("CONTENT:"+a);if(null!=a&&void 0!=a){a=a.match(RegExp("\\[row\\][\\s\\S]*?\\[\\/row\\]","gi"));if(null!=a)for(var b=0;b<a.length;b++){WP_DEBUG&&console.log("ROW:"+a[b]);var c=a[b].match(RegExp("\\[column.*?\\][\\s\\S]*?\\[\\/column\\]",
"gi"));if(null!=c)for(var h=0,e=0;e<c.length;e++){WP_DEBUG&&console.log("COLUMN:"+c[e]);var f=c[e].match(RegExp("\\[column.*?\\]","gi"));if(null==f){WP_DEBUG&&console.log("Page Builder error");return}var g='size=".*?"',g=RegExp(g,"i"),k=f[0].match(g),k=k[0],g=6,l=k.length-1,k=parseInt(k.substring(g,l),10),g='offset=".*?"',g=RegExp(g,"i"),m=f[0].match(g),m=m[0],g=8,l=m.length-1,g=parseInt(m.substring(g,l),10),h=h+g;WP_DEBUG&&console.log("Size: "+k);WP_DEBUG&&console.log("Column: "+h);g=new s.Placeholder(k,
h,this.modules.length);this.lines[b].addModule(g);g.show();this.modules.push(g);d(g).bind("moduleDown",d.proxy(this.placeholderDown,this));d(g).bind("moduleDelete",d.proxy(this.placeholderDelete,this));h+=k;f=c[e].substring(f[0].length,c[e].length-9);WP_DEBUG&&console.log("column content: "+f);f=f.match(RegExp("\\[.*?\\][\\s\\S]*?\\[\\/.*?\\]","gi"));if(null!=f)for(k=0;k<f.length;k++){WP_DEBUG&&console.log("content: "+f[k]);for(var l=f[k],q="",m=1;" "!=l.charAt(m)&&"]"!=l.charAt(m);)q+=l.charAt(m),
m++;var n=null;d.each(u,function(a,b){b.shortcode==q&&(n=b)});if(null==n){WP_DEBUG&&console.log("Page builder: Couldn't find a shortcode!");break}else WP_DEBUG&&console.log("Creating component with shortcode: "+q);var p=t.copyInfo(n);p.type="module";var r=l.match(RegExp("\\["+q+".*?\\]","i"));if(null==r){WP_DEBUG&&console.log("Page Builder: error reading shortcode parameters!");return}r=r[0];d.each(p.parameters,function(a,b){var c=r.match(RegExp("\\s"+b.id+'=".*?"',"i"));null!=c&&(c=c[0],c=c.substring(b.id.length+
2,c.length-1),WP_DEBUG&&console.log("Value: "+c),p.parameters[a].value=c)});-1!=p.content&&(l=l.substring(r.length,l.length-(q.length+3)),WP_DEBUG&&console.log("shortcode content:"+l),p.parameters[p.content].value=l);l=new s.Component(p);g.addComponent(l);l.build();d(l).bind("moduleDown",d.proxy(this.componentDown,this))}}this.checkNumLines()}this.correctGrid()}},makeHtml:function(){for(var a="",b=0;b<this.lines.length;b++)if(!this.lines[b].isEmpty()){var a=a+"[row]",c=this.lines[b].getOrderedModules(),
h=0;d.each(c,d.proxy(function(b,c){var d=this.modules[c],k=0;h!=d.column&&(k=d.column-h);a+=d.getHtml(k);h+=d.column+d.size},this));a+="[/row]"}d("#content").val(a);WP_DEBUG&&console.log(a);return!0},createComponent:function(a,b){this.module=new s.Component(b);this.type="module";this.targetPlaceholder=-1;d(a.target).bind("moduleButtonMove",d.proxy(this.movingComponentInit,this));d(a.target).bind("moduleButtonUp",d.proxy(this.createModuleFinal,this))},processComponentMoving:function(a,b){if(-1!=a){if(this.targetPlaceholder!=
a){var c=this.modules[a];-1!=this.targetPlaceholder&&this.modules[this.targetPlaceholder].cancelAbove();c.componentAbove(b);this.targetPlaceholder=a}}else-1!=this.targetPlaceholder&&this.modules[this.targetPlaceholder].cancelAbove(),this.targetPlaceholder=-1},movingComponentInit:function(a,b,c){b=this.getGridPos(b,c);b=this.hittedPlaceholder(b.line,b.column);this.processComponentMoving(b,a.target.info.color)},getCenteredRelativeGridPosition:function(a,b,c){b=this.getGridPos(a,b);a=b.line;b=Math.round(b.column-
c/2);0>b&&(b=0);12<b+c&&(b=12-c);return{column:b,line:a}},movingPlaceholdersBlock:function(a){if(a!=this.currentLine){var b=this.lines[this.currentLine].popModules(),c=this.lines[a].popModules();this.lines[this.currentLine].pushModules(c,!1);this.lines[a].pushModules(b,!1)}this.currentLine=a},createPlaceholder:function(a,b,c,h,e){this.placeholders=[];this.combinedSize=0;this.sizes=b;this.size=c;for(c=this.getCenteredRelativeGridPosition(h,e,c).line;this.lines[c].isEmpty()&&0!=c;)c--;this.currentLine=
c;for(h=this.lines.length-1;h>c;h--)e=this.lines[h-1].popModules(),this.lines[h].pushModules(e,!1);for(h=0;h<b.length;h++)e=new s.Placeholder(b[h],0+this.combinedSize,this.modules.length),this.modules.push(e),this.placeholders.push(e),this.combinedSize+=b[h],this.lines[c].addModule(e);this.type="placeholder";d(a.target).bind("moduleButtonMove",d.proxy(this.movingPlaceholderInit,this));d(a.target).bind("moduleButtonUp",d.proxy(this.createModuleFinal,this));this.correctGrid()},movingPlaceholderInit:function(a,
b,c){for(a=this.getCenteredRelativeGridPosition(b,c,this.size).line;this.lines[a].isEmpty()&&0!=a;)a--;a!=this.currentLine&&(this.movingPlaceholdersBlock(a),this.correctGrid());return!1},createModuleFinal:function(a){d(a.target).unbind("moduleButtonMove");d(a.target).unbind("moduleButtonUp");if("module"==this.type)-1!=this.targetPlaceholder&&(this.modules[this.targetPlaceholder].addComponent(this.module),this.module.build(),d(this.module).bind("moduleDown",d.proxy(this.componentDown,this)));else for(a=
0;a<this.sizes.length;a++)this.placeholders[a].show(),this.placeholders[a].priority=0,d(this.placeholders[a]).bind("moduleDown",d.proxy(this.placeholderDown,this)),d(this.placeholders[a]).bind("moduleDelete",d.proxy(this.placeholderDelete,this)),d(this.placeholders[a]).bind("moduleResize",d.proxy(this.correctGrid,this));this.checkNumLines();this.correctGrid();return!1},placeholderDelete:function(a,b){this.lines[this.modules[b].line].removeModule(b);this.modules=removePositionInArray(this.modules,
b);for(var c=0;c<this.modules.length;c++)this.modules[c].number=c;this.correctGrid();this.checkNumLines()},placeholderDown:function(a,b,c,h){WP_DEBUG&&console.log("placeholderDown");this.currentLine=c;this.currentColumn=h;this.moduleDragging=b;this.modules[b].priority=2;d(a.target).bind("moduleMove",d.proxy(this.movingPlaceholder,this));d(a.target).bind("moduleUp",d.proxy(this.placePlaceholder,this));return!1},movingPlaceholder:function(a,b,c){b=this.getGridPos(b,c);a=b.line;b=b.column;c=this.modules[this.moduleDragging];
12<b+c.size&&(b=12-c.size);if(a!=this.currentLine||b!=this.currentColumn)a!=this.currentLine&&(this.lines[this.currentLine].removeModule(this.moduleDragging),this.lines[a].addModule(c)),b!=this.currentColumn&&(c.column=b),this.currentLine=a,this.currentColumn=b,this.correctGrid();return!1},placePlaceholder:function(a){d(a.target).unbind("moduleMove");d(a.target).unbind("moduleUp");this.correctGrid();this.modules[this.moduleDragging].priority=0;this.moduleDragging=-1;return!1},componentDown:function(a){WP_DEBUG&&
console.log("componentDown");this.targetPlaceholder=a.target.placeholder;d(a.target).bind("moduleMove",d.proxy(this.movingComponent,this));d(a.target).bind("moduleUp",d.proxy(this.placeComponent,this));return!1},movingComponent:function(a,b,c){a=a.target;b=this.getGridPos(b,c);b=this.hittedPlaceholder(b.line,b.column);b!=a.placeholder?this.processComponentMoving(b,a.info.color):(this.modules[a.placeholder].movingComponent(c,a.number),this.targetPlaceholder!=a.placeholder&&this.modules[this.targetPlaceholder].cancelAbove(),
this.targetPlaceholder=a.placeholder);return!1},placeComponent:function(a){d(a.target).unbind("moduleMove");d(a.target).unbind("moduleUp");var b=a.target.placeholder;-1!=this.targetPlaceholder&&this.targetPlaceholder!=b&&(this.modules[b].removeComponent(a.target.number),this.modules[this.targetPlaceholder].addComponent(a.target));return!1},checkIntersection:function(a){for(var b=0;b<this.modules.length;b++)if(this.modules[b].line==a)return!0;return!1},resolveIntersection:function(a){for(var b=0;b<
a;){if(this.lineEmpty(b)){for(var c=0;c<this.modules.length;c++)this.modules[c].line==a&&this.modules[c].changeLine(b);return}b++}b=a;this.checkIntersection(b+1)&&this.resolveIntersection(b+1);for(c=0;c<this.modules.length;c++)this.modules[c].line==b&&this.modules[c].changeLine(b+1)},hittedPlaceholder:function(a,b){for(var c=0;c<this.modules.length;c++)if(this.modules[c].line==a&&b>=this.modules[c].column&&b<this.modules[c].column+this.modules[c].size)return c;return-1},onScroll:function(){var a=
d(window).scrollTop();this.menuFromTop=this.$pageBuilderTab.offset().top;a>this.menuFromTop-this.menuOffTop?this.$pageBuilderMenu.css({top:a-this.menuFromTop+this.menuOffTop+"px"}):this.$pageBuilderMenu.css({top:"0px"})},clearAll:function(){for(var a=0;a<this.modules.length;a++)this.modules[a].$obj.fadeTo(300,0);this.modules=[];this.checkNumLines();return!1},currentOverLine:function(a,b){this.lineOver=b;return!1},addLine:function(){var a=new v.newLine(this.$linesHolder,this.lines.length,this.$baseLine);
d(a).bind("overThis",d.proxy(this.currentOverLine,this));this.lines.push(a)},removeLine:function(){},correctGrid:function(){d.each(this.lines,d.proxy(function(a,b){var c=b.organize();c&&0<c.length&&(0!=a&&this.lines[a-1].isEmpty()?(this.lines[a-1].pushModules(c),this.lines[a-1].organize()):this.lines[a+1].pushModules(c))},this));this.clearBlankLines();this.checkNumLines()},clearBlankLines:function(){for(var a=0;a<this.lines.length;a++)this.lines[a].isEmpty()&&this.pushAllTop(a+1)},pushAllTop:function(a){if(0!=
a)for(;a<this.lines.length;a++){var b=this.lines[a].popModules();this.lines[a-1].pushModules(b);this.lines[a-1].organize();this.lines[a].organize()}},checkNumLines:function(){var a=0;d.each(this.lines,function(b,c){c.isEmpty()&&a++});if(1>=a)this.addLine();else for(;2<a;)this.removeLine(),a--},getNumberEmptyLines:function(){for(var a=0,b=0;b<this.modules.length;b++)this.modules[b].line>a&&(a=this.modules[b].line);return gridLines.length-(a+1)},getGridPos:function(a,b){var c=this.$linesHolder.offset();
a-=c.left;c=this.$linesHolder.width();c=Math.round(12*(a/c));0>c?c=0:10<c&&(c=10);for(var d=this.lines.length-1,e=1;e<this.lines.length;e++)if(b<this.lines[e].getOffsetY()){d=e-1;break}return{column:c,line:d}},getPriorityRow:function(){var a=0,b=0,c=[];this.getModulesFromLine(a);var d=0,e=0;do{var f=this.getModulesHittingPos(b,a);if(0!=f.length){if(1==f.length)if(f[0]==this.moduleDragging)addIfDoesnExist(f[0],c);else{var g=this.modCollidesWithDrag(f[0]);if(-1==g)addIfDoesnExist(f[0],c);else{var k=
this.modules[f[0]].size;e>=k?(addIfDoesnExist(f[0],c),e-=k):(d>=k-g||addIfDoesnExist(this.moduleDragging,c),addIfDoesnExist(f[0],c))}}else for(;0!=f.length;){var g=this.getHighestPriority(f),l=f[g],f=removePositionInArray(f,g);l==this.moduleDragging&&0<f.length&&(g=this.getHighestPriority(f),k=this.modules[f[g]].size,e>=k?(addIfDoesnExist(f[g],c),f=removePositionInArray(f,g),e-=k):d>=k&&(addIfDoesnExist(f[g],c),f=removePositionInArray(f,g),d-=k));addIfDoesnExist(l,c)}d=0}else d++;b++;12==b&&(b=0,
a++,this.getModulesFromLine(a),e=d,d=0)}while(c.length!=this.modules.length);return c},getHighestPriority:function(a){for(var b=0;b<a.length;b++)if(a[b]==this.moduleDragging)return b;for(var c=20,d=-1,b=0;b<a.length;b++)this.modules[a[b]].column<c&&(c=this.modules[a[b]].column,d=b);return d},modCollidesWithDrag:function(a){if(-1==this.moduleDragging)return-1;var b=this.modules[this.moduleDragging];a=this.modules[a];return b.line==a.line&&b.column>=a.column&&b.column<a.column+a.size?b.column-a.column:
-1},getModulesFromLine:function(a){var b=[];d.each(this.modules,function(c,d){d.line==a&&b.push(d)});return b},getModulesHittingPos:function(a,b){var c=[];d.each(this.modules,function(d,e){e.line==b&&e.column==a&&c.push(d)});return c}};return n});
