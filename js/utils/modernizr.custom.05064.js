window.Modernizr=function(p,l,y){function e(a,b){return typeof a===b}function C(a,b){for(var w in a){var f=a[w];if(!~(""+f).indexOf("-")&&D[f]!==y)return"pfx"==b?f:!0}return!1}function n(a,b,w){var f=a.charAt(0).toUpperCase()+a.slice(1),c=(a+" "+E.join(f+" ")+f).split(" ");if(e(b,"string")||e(b,"undefined"))b=C(c,b);else a:{c=(a+" "+F.join(f+" ")+f).split(" "),a=c;for(var d in a)if(f=b[a[d]],f!==y){b=!1===w?a[d]:e(f,"function")?f.bind(w||b):f;break a}b=!1}return b}var c={},h=l.documentElement,d=l.createElement("modernizr"),
D=d.style,E=["Webkit","Moz","O","ms"],F=["webkit","moz","o","ms"],d={};p=[];var z=p.slice,q,H=function(a,b,c,f){var d,G,e,s,m=l.createElement("div"),r=l.body,k=r||l.createElement("body");if(parseInt(c,10))for(;c--;)e=l.createElement("div"),e.id=f?f[c]:"modernizr"+(c+1),m.appendChild(e);return d=['&#173;<style id="smodernizr">',a,"</style>"].join(""),m.id="modernizr",(r?m:k).innerHTML+=d,k.appendChild(m),r||(k.style.background="",k.style.overflow="hidden",s=h.style.overflow,h.style.overflow="hidden",
h.appendChild(k)),G=b(m,a),r?m.parentNode.removeChild(m):(k.parentNode.removeChild(k),h.style.overflow=s),!!G},A={}.hasOwnProperty,x;e(A,"undefined")||e(A.call,"undefined")?x=function(a,b){return b in a&&e(a.constructor.prototype[b],"undefined")}:x=function(a,b){return A.call(a,b)};Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=z.call(arguments,1),f=function(){if(this instanceof f){var d=function(){};d.prototype=b.prototype;
var d=new d,e=b.apply(d,c.concat(z.call(arguments)));return Object(e)===e?e:d}return b.apply(a,c.concat(z.call(arguments)))};return f});d.canvas=function(){var a=l.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")};d.canvastext=function(){return!!c.canvas&&!!e(l.createElement("canvas").getContext("2d").fillText,"function")};d.csstransforms=function(){return!!n("transform")};d.csstransforms3d=function(){var a=!!n("perspective");return a&&"webkitPerspective"in h.style&&H("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",
function(b,c){a=9===b.offsetLeft&&3===b.offsetHeight}),a};d.csstransitions=function(){return n("transition")};for(var B in d)x(d,B)&&(q=B.toLowerCase(),c[q]=d[B](),p.push((c[q]?"":"no-")+q));c.addTest=function(a,b){if("object"==typeof a)for(var d in a)x(a,d)&&c.addTest(d,a[d]);else{a=a.toLowerCase();if(c[a]!==y)return c;b="function"==typeof b?b():b;h.className+=" "+(b?"":"no-")+a;c[a]=b}return c};D.cssText="";return d=null,function(a,b){function c(){var a=v.elements;return"string"==typeof a?a.split(" "):
a}function d(a){var b=q[a[p]];return b||(b={},n++,a[p]=n,q[n]=b),b}function e(a,c,g){c||(c=b);if(t)return c.createElement(a);g||(g=d(c));var u;return g.cache[a]?u=g.cache[a].cloneNode():r.test(a)?u=(g.cache[a]=g.createElem(a)).cloneNode():u=g.createElem(a),u.canHaveChildren&&!m.test(a)?g.frag.appendChild(u):u}function l(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag());a.createElement=function(c){return v.shivMethods?e(c,a,b):b.createElem(c)};
a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+c().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(v,b.frag)}function h(a){a||(a=b);var c=d(a);if(v.shivCSS&&!k&&!c.hasCSS){var g,e=a;g=e.createElement("p");e=e.getElementsByTagName("head")[0]||e.documentElement;g=(g.innerHTML="x<style>article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}</style>",
e.insertBefore(g.lastChild,e.firstChild));c.hasCSS=!!g}return t||l(a,c),a}var s=a.html5||{},m=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,k,p="_html5shiv",n=0,q={},t;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>";k="hidden"in a;var c;if(!(c=1==a.childNodes.length)){b.createElement("a");var d=b.createDocumentFragment();c="undefined"==typeof d.cloneNode||
"undefined"==typeof d.createDocumentFragment||"undefined"==typeof d.createElement}t=c}catch(e){t=k=!0}})();var v={elements:s.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:!1!==s.shivCSS,supportsUnknownElements:t,shivMethods:!1!==s.shivMethods,type:"default",shivDocument:h,createElement:e,createDocumentFragment:function(a,e){a||(a=b);if(t)return a.createDocumentFragment();
e=e||d(a);for(var g=e.frag.cloneNode(),h=0,k=c(),l=k.length;h<l;h++)g.createElement(k[h]);return g}};a.html5=v;h(b)}(this,l),c._version="2.6.2",c._prefixes=" -webkit- -moz- -o- -ms- ".split(" "),c._domPrefixes=F,c._cssomPrefixes=E,c.testProp=function(a){return C([a])},c.testAllProps=n,c.testStyles=H,h.className=h.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(" js "+p.join(" ")),c}(this,this.document);
