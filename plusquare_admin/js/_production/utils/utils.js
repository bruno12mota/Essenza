var ismobile=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i),isIE=jQuery.browser.msie,mouseDownBind="mousedown",mouseMoveBind="mousemove",mouseUpBind="mouseup",mouseOverBind="mouseover",mouseOutBind="mouseout",clickBind="click";ismobile&&(mouseDownBind="vmousedown",mouseMoveBind="vmousemove",mouseUpBind="vmouseup",mouseOverBind="vmouseover",mouseOutBind="vmouseout",clickBind="vclick");var aTargets=["_blank","_self","_parent","_top"];
function parseParameter(a){return"true"==a||"false"==a?"true"==a?!0:!1:!0==a||!1==a?a:isNaN(a)?a:parseFloat(a,10)}var split;
split=split||function(a){var b=String.prototype.split,c=/()??/.exec("")[1]===a,d;d=function(e,d,k){if("[object RegExp]"!==Object.prototype.toString.call(d))return b.call(e,d,k);var g=[],l=(d.ignoreCase?"i":"")+(d.multiline?"m":"")+(d.extended?"x":"")+(d.sticky?"y":""),m=0;d=RegExp(d.source,l+"g");var n,h,p;e+="";c||(n=RegExp("^"+d.source+"$(?!\\s)",l));for(k=k===a?4294967295:k>>>0;h=d.exec(e);){l=h.index+h[0].length;if(l>m&&(g.push(e.slice(m,h.index)),!c&&1<h.length&&h[0].replace(n,function(){for(var b=
1;b<arguments.length-2;b++)arguments[b]===a&&(h[b]=a)}),1<h.length&&h.index<e.length&&Array.prototype.push.apply(g,h.slice(1)),p=h[0].length,m=l,g.length>=k))break;d.lastIndex===h.index&&d.lastIndex++}m===e.length?!p&&d.test("")||g.push(""):g.push(e.slice(m));return g.length>k?g.slice(0,k):g};String.prototype.split=function(a,b){return d(this,a,b)};return d}();
function stringToObject(a){if(null!=a&&void 0!=a){a=split(a,"; ");var b={};$.each(a,function(a,d){var e=split(d,/:(.+)?/);b[e[0]]=e[1]});return b}return{}}function getEaseOptions(){return["easeIn","easeOut","easeInOut"]}function getEaseTypeOptions(){return"linear swing jswing Quad Cubic Quart Quint Expo Sine Circ Elastic Back Bounce".split(" ")}jQuery.fn.extend({ensureLoad:function(a){return this.each(function(){this.complete?a.call(this):$(this).load(a)})}});
function getClearText(a){return a.replace(/<[^<|>]+?>/gi,"")}function unbindMoveAndUp(){$(document).unbind(mouseMoveBind);$(document).unbind(mouseUpBind)}function addIfDoesnExist(a,b){for(var c=0;c<b.length;c++)if(b[c]==a)return;b.push(a)}function is_string(a){return"string"==typeof a}jQuery.fn.swapWith=function(a){return this.each(function(){var b=$(a).clone(!0),c=$(this).clone(!0);$(a).replaceWith(c);$(this).replaceWith(b)})};
$.fn.rotate=function(a){$(this).css({transform:"rotate("+a+"deg)","-ms-transform":"rotate("+a+"deg)","-webkit-transform":"rotate("+a+"deg)","-o-transform":"rotate("+a+"deg)","-moz-transform":"rotate("+a+"deg)"})};function removePositionInArray(a,b){for(var c=[],d=0;d<a.length;d++)d!=b&&c.push(a[d]);return c}function addRoundCorners(a,b){a.css({"-webkit-border-radius":b,"-moz-border-radius":b,"-o-border-radius":b,"border-radius":b})}
$.fn.changeOpacity=function(a){$(this).css({"-ms-filter":"progid:DXImageTransform.Microsoft.Alpha(Opacity="+a+")",filter:"alpha(opacity="+a+")","-moz-opacity":a/100,"-khtml-opacity":a/100,opacity:a/100});return this};function addEaseAll(a,b,c,d){void 0==b&&(b=0.3);void 0==c&&(c="ease");void 0==d&&(d=["all"]);var e="",f=!0;$.each(d,function(a,d){f||(e+=", ");f=!1;e+=d+" "+b+"s "+c});$(this).css({transition:e,"-webkit-transition":e,"-moz-transition":e,"-o-transition":e})}
function componentToHex(a){a=a.toString(16);return 1==a.length?"0"+a:a}function rgbToHex(a,b,c){return"#"+componentToHex(a)+componentToHex(b)+componentToHex(c)}
function hsvToRgb(a,b,c){var d,e,f;a=Math.max(0,Math.min(360,a));b=Math.max(0,Math.min(100,b));c=Math.max(0,Math.min(100,c));b/=100;c/=100;if(0==b)return d=b=c,[Math.round(255*d),Math.round(255*b),Math.round(255*c)];a/=60;d=Math.floor(a);e=a-d;a=c*(1-b);f=c*(1-b*e);e=c*(1-b*(1-e));switch(d){case 0:d=c;b=e;c=a;break;case 1:d=f;b=c;c=a;break;case 2:d=a;b=c;c=e;break;case 3:d=a;b=f;break;case 4:d=e;b=a;break;default:d=c,b=a,c=f}return[Math.round(255*d),Math.round(255*b),Math.round(255*c)]}
function hex2rgb(a){"#"==a[0]&&(a=a.substr(1));if(3==a.length){var b=a;a="";for(var b=/^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(b).slice(1),c=0;3>c;c++)a+=b[c]+b[c]}a=/^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(a).slice(1);return{red:parseInt(a[0],16),green:parseInt(a[1],16),blue:parseInt(a[2],16)}}
function rgbToHsv(a,b,c){a/=255;b/=255;c/=255;var d=Math.max(a,b,c),e=Math.min(a,b,c),f,k=(d+e)/2,k=d;if(d==e)f=e=0;else{var g=d-e,e=0==g?0:g/k;switch(d){case a:f=(b-c)/g+(b<c?6:0);break;case b:f=(c-a)/g+2;break;case c:f=(a-b)/g+4}f/=6}return[360*f,100*e,100*k]}$.fn.resizeAndCenter=function(a,b){var c=$(this).height(),d=$(this).width(),e=c/b,f=c/e,e=d/e;e<a&&(e=d/a,f=c/e,e=d/e);$(this).css({position:"relative",height:f+"px",width:e+"px",top:Math.round(b/2-f/2)+"px",left:Math.round(a/2-e/2)+"px"})};
function processFont(a,b,c,d){a.css({"font-family":b,color:c,"font-size":d+"px"})}function processIcon(a,b){a.css({"background-image":"url("+b+")","background-repeat":"no-repeat","background-position":"15px 11px"})}function getFilter(a,b){var c=parseInt(255*parseFloat(b,10)).toString(16);return"progid:DXImageTransform.Microsoft.gradient(startColorstr=#"+c+a.substring(1,3)+a.substring(3,5)+a.substring(5,7)+",endColorstr=#"+c+a.substring(1,3)+a.substring(3,5)+a.substring(5,7)+")"}
function getRGBA(a,b){var c=hex2rgb(a);return"rgba("+c.red+", "+c.green+", "+c.blue+", "+b+")"}function preventDragDefault(a){isIE&&(a.get(0).onselectstart=function(){return!1});a.get(0).onmousedown=function(a){a.preventDefault()};a.click(function(a){return!1})}
$.fn.processColorAndPattern=function(a,b,c){var d=$(this);if("0"!=b&&0!=b){var e=getFilter(a,b);b=getRGBA(a,b);d.css({"background-color":a,filter:e,background:b})}else d.css({"background-color":"transparent",background:"transparent"});"none"!=c&&void 0!=c&&d.css({"background-image":"url("+c+")","background-repeat":"repeat"})};
