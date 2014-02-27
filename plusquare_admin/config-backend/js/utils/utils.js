$ = jQuery;

//IS MOBILE BOOLEAN
var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

//IS IE
var isIE = jQuery.browser.msie;

//MOUSE||TOUCH BINDINGS
var mouseDownBind = "mousedown";
var mouseMoveBind = "mousemove";
var mouseUpBind = "mouseup";
var mouseOverBind = "mouseover";
var mouseOutBind = "mouseout";
var clickBind = "click";

if (ismobile) {
	mouseDownBind = "vmousedown";
	mouseMoveBind = "vmousemove";
	mouseUpBind = "vmouseup";
	mouseOverBind = "vmouseover";
	mouseOutBind = "vmouseout";
	clickBind = "vclick";
}

var easeOptions = [
    "In",
    "Out",
    "InOut"
];
var typeOptions = [
    "linear",
    "swing",
    "jswing",
    "Quad",
    "Cubic",
    "Quart",
    "Quint",
    "Expo",
    "Sine",
    "Circ"
];

//Jquery extend ensure load for images (caching issue)
jQuery.fn.extend({
    ensureLoad: function(handler) {
        return this.each(function() {
            if(this.complete || this.readyState === 4) {
                handler.call(this);
            } 
            // Check if data URI images is supported, fire 'error' event if not
            else if ( this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0 ) {
                $(this).trigger('error');
                handler.call(this);
            }
            else {
                $(this).load(handler);

                if(isIE && this.src.indexOf("?") == -1)
                    this.src = this.src+ "?" + new Date().getTime();

            }
        });
    }
});


function parseParameter(val){
    //if it's a number
    if(!isNaN(val))
        return parseFloat(val, 10);
    
    //if it's a boolean
    if(val == "true" || val == "false")
        return (val == "true" ? true : false);
        
    return val;
}

function getTween(ease, type){
    if(type == "linear" || type == "swing" || type == "jswing")
        return type;
    return ease+type;
}

function getTransition(ease, type, duration){
    var tween = getTween(ease, type);
    
    var str = "all "+duration+"s ";
    switch(tween){
        case "linear" || "swing" || "jswing":
            return str+"cubic-bezier(0.250, 0.250, 0.750, 0.750)";
        case "easeInQuad":
            return str+"cubic-bezier(0.550, 0.085, 0.680, 0.530)";
        case "easeInCubic":
            return str+"cubic-bezier(0.550, 0.055, 0.675, 0.190)";
        case "easeInQuart":
            return str+"cubic-bezier(0.895, 0.030, 0.685, 0.220)";
        case "easeInQuint":
            return str+"cubic-bezier(0.755, 0.050, 0.855, 0.060)";
        case "easeInSine":
            return str+"cubic-bezier(0.470, 0.000, 0.745, 0.715)";
        case "easeInExpo":
            return str+"cubic-bezier(0.950, 0.050, 0.795, 0.035)";
        case "easeInCirc":
            return str+"cubic-bezier(0.600, 0.040, 0.980, 0.335)";
        case "easeOutQuad":
            return str+"cubic-bezier(0.250, 0.460, 0.450, 0.940)";
        case "easeOutCubic":
            return str+"cubic-bezier(0.215, 0.610, 0.355, 1.000)";
        case "easeOutQuart":
            return str+"cubic-bezier(0.165, 0.840, 0.440, 1.000)";
        case "easeOutQuint":
            return str+"cubic-bezier(0.230, 1.000, 0.320, 1.000)";
        case "easeOutSine":
            return str+"cubic-bezier(0.390, 0.575, 0.565, 1.000)";
        case "easeOutExpo":
            return str+"cubic-bezier(0.190, 1.000, 0.220, 1.000)";
        case "easeOutCirc":
            return str+"cubic-bezier(0.075, 0.820, 0.165, 1.000)";
        case "easeInOutQuad":
            return str+"cubic-bezier(0.455, 0.030, 0.515, 0.955)";
        case "easeInOutCubic":
            return str+"cubic-bezier(0.645, 0.045, 0.355, 1.000)";
        case "easeInOutQuart":
            return str+"cubic-bezier(0.770, 0.000, 0.175, 1.000)";
        case "easeInOutQuint":
            return str+"cubic-bezier(0.860, 0.000, 0.070, 1.000)";
        case "easeInOutSine":
            return str+"cubic-bezier(0.445, 0.050, 0.550, 0.950)";
        case "easeInOutExpo":
            return str+"cubic-bezier(1.000, 0.000, 0.000, 1.000)";
        case "easeInOutCirc":
            return str+"cubic-bezier(0.785, 0.135, 0.150, 0.860)";
    }
    
    return tween;
}

function preventDragDefault(a){
    isIE&&(a.get(0).onselectstart=function(){return!1});
    a.get(0).onmousedown=function(a){a.preventDefault()};
    a.click(function(a){return!1});
}

jQuery.fn.preventDragDefault = function (){
    isIE&&($(this).get(0).onselectstart=function(){return!1});
    $(this).get(0).onmousedown=function(a){a.preventDefault()};
    $(this).click(function(a){return!1});
}


function getClearText( strSrc ) {
	return  strSrc.replace( /<[^<|>]+?>/gi,'' );
}

function unbindMoveAndUp() {
	$(document).unbind(mouseMoveBind);
	$(document).unbind(mouseUpBind);
}

function addIfDoesnExist(val, array){
	for(var i = 0; i < array.length ; i++)
		if(array[i] == val)
			return;
	
	array.push(val);
}

function is_string(input){
    return typeof(input)=='string';
  }


var split;
// Avoid running twice; that would break the `nativeSplit` reference
split = split || function (undef) {

    var nativeSplit = String.prototype.split,
        compliantExecNpcg = /()??/.exec("")[1] === undef, // NPCG: nonparticipating capturing group
        self;

    self = function (str, separator, limit) {
        // If `separator` is not a regex, use `nativeSplit`
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
            return nativeSplit.call(str, separator, limit);
        }
        var output = [],
            flags = (separator.ignoreCase ? "i" : "") +
                    (separator.multiline  ? "m" : "") +
                    (separator.extended   ? "x" : "") + // Proposed for ES6
                    (separator.sticky     ? "y" : ""), // Firefox 3+
            lastLastIndex = 0,
            // Make `global` and avoid `lastIndex` issues by working with a copy
            separator = new RegExp(separator.source, flags + "g"),
            separator2, match, lastIndex, lastLength;
        str += ""; // Type-convert
        if (!compliantExecNpcg) {
            // Doesn't need flags gy, but they don't hurt
            separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
        }
        /* Values for `limit`, per the spec:
         * If undefined: 4294967295 // Math.pow(2, 32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
         * If negative number: 4294967296 - Math.floor(Math.abs(limit))
         * If other: Type-convert, then use the above rules
         */
        limit = limit === undef ?
            -1 >>> 0 : // Math.pow(2, 32) - 1
            limit >>> 0; // ToUint32(limit)
        while (match = separator.exec(str)) {
            // `separator.lastIndex` is not reliable cross-browser
            lastIndex = match.index + match[0].length;
            if (lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                    match[0].replace(separator2, function () {
                        for (var i = 1; i < arguments.length - 2; i++) {
                            if (arguments[i] === undef) {
                                match[i] = undef;
                            }
                        }
                    });
                }
                if (match.length > 1 && match.index < str.length) {
                    Array.prototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                    break;
                }
            }
            if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
            }
        }
        if (lastLastIndex === str.length) {
            if (lastLength || !separator.test("")) {
                output.push("");
            }
        } else {
            output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
    };

    // For convenience
    String.prototype.split = function (separator, limit) {
        return self(this, separator, limit);
    };

    return self;

}();

function stringToObject(string){
    if(string != null && string != undefined){
        var properties = split(string, '; ');
        var obj = {};
        
        $.each(properties,
            function(index, property) {
                var tup = split(property, /:(.+)?/);
                   
                obj[tup[0]] = tup[1];
                //alert("FROM: "+property+"     TUP0: "+tup[0]+"    TUP1: "+tup[1]+"    TUPL: "+tup.length);
        });
        
        return obj;
    }
    return {};
}


jQuery.fn.swapWith = function(to) {
    return this.each(function() {
        var copy_to = $(to).clone(true);
        var copy_from = $(this).clone(true);
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};

function removePositionInArray(array, num){
	var newArray = new Array();
	
	for(var i = 0; i<array.length ; i++)
		if(i != num)
			newArray.push(array[i]);
	
	return newArray;
}

jQuery.fn.addRoundCorners = function(value){
    $(this).css({    "-webkit-border-radius" : value,
                "-moz-border-radius" : value,
                "-o-border-radius" : value,
                "border-radius" : value
            });
}

jQuery.fn.setTransformOrigin = function(val1, val2){
    $(this).css({    
        "transform-origin" : val1+"% "+val2+"%",
        "-ms-transform-origin" : val1+"% "+val2+"%",
        "-webkit-transform-origin" : val1+"% "+val2+"%",
        "-moz-transform-origin" : val1+"% "+val2+"%",
        "-o-transform-origin" : val1+"% "+val2+"%"
    });
    return this;
}

jQuery.fn.setTransform = function(val){
    $(this).css({    
        "transform" : val,
        "-ms-transform" : val,
        "-webkit-transform" : val,
        "-moz-transform" : val,
        "-o-transform" : val
    });
    return this;
}

jQuery.fn.setTransition = function(val){
    $(this).css({    
        "-webkit-transition" : val,
        "-moz-transition" : val,
        "-ms-transition" : val,
        "-o-transition" : val,
        "transition" : val
    });
    return this;
}

jQuery.fn.setIETransform = function(transform){
    var M11 = 1;
    var M12 = 0;
    var M21 = 0;
    var M22 = 1;
    
    var Dx = 0;
    var Dy = 0;
    
    if(transform.scale != undefined){
        //scale
        M11*=transform.scale;
        M22*=transform.scale;
    }
    if(transform.translateX != undefined)
        //translate x
        Dx=transform.translateX;
    if(transform.translateY != undefined)
        //translate y
        Dy=transform.translateY;
    
    $(this).css({    
        'filter': 'progid:DXImageTransform.Microsoft.Matrix(FilterType="nearest neighbor",M11='+M11+',M12='+M12+',M21='+M21+',M22='+M22+',Dx='+Dx+',Dy='+Dy+')'
    });
    return this;
}

jQuery.fn.changeOpacity = function (value){
    //if(WP_DEBUG)console.log(value);
    //if(WP_DEBUG)console.log(value/100.0);
    $(this).css({  /* IE 8 */
                  "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity="+value+")",
                
                  /* IE 5-7 */
                  "filter": "alpha(opacity="+value+")",
                
                  /* Netscape */
                  "-moz-opacity": value/100.0,
                
                  /* Safari 1.x */
                  "-khtml-opacity": value/100.0,
                
                  /* Good browsers */
                  "opacity": value/100.0
            });
    return this;
}

function getFilter(color, alpha){
    var color_alpha = parseInt((parseFloat(alpha, 10)*255)).toString(16);
    var filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr=#"+color_alpha+color.substring(1, 3)+color.substring(3, 5)+color.substring(5, 7)+
                                ",endColorstr=#"+color_alpha+color.substring(1, 3)+color.substring(3, 5)+color.substring(5, 7)+")";
    
    return filter;
};

function getRGBA(color, alpha){
	var rgb = hex2rgb(color);
    var rgba = "rgba("+rgb.red+", "+rgb.green+", "+rgb.blue+", "+alpha+")";
    return rgba;
};

jQuery.fn.processColorAndPattern = function(color, alpha, pattern){
    var object = $(this);
    //  color attributes
    if(alpha != "0" && alpha != 0){
        var filter = getFilter(color, alpha);
        var rgba = getRGBA(color, alpha);
        
        object.css({    "background-color" : color,
                    "filter" : filter,
                    "background" : rgba
                });
        
    }
    else{
        object.css({    
            "background-color" : "transparent",
            "background" : "transparent" });
    }
    //  pattern attributes
    if(pattern != "none" && pattern != undefined)
        object.css({    "background-image" : "url("+pattern+")",
                    "background-repeat" : "repeat"
                  });
}

jQuery.fn.addEaseAll = function(time, type, properties){
    
    if(type == undefined)
        type = "ease";
    if(properties == undefined)
    	properties = ["all"];
    	
    var transitionStr = "";
    var first = true;
    $.each(
    	properties,
    	function(index, value){
    		if(!first)
    			transitionStr+= ", ";
    		first = false;
    		transitionStr += value+" "+time+"s "+type;
    	}
    )
	$(this).css({    
        "transition" : transitionStr,
		"-webkit-transition" : transitionStr,
        "-moz-transition" : transitionStr,
        "-o-transition" : transitionStr
    });
}

jQuery.fn.removeEaseAll = function(){
    $(this).css({    
        "transition" : "none",
        "-webkit-transition" : "none",
        "-moz-transition" : "none",
        "-o-transition" : "none"
    });
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
	
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
			
		case 1:
			r = q;
			g = v;
			b = p;
			break;
			
		case 2:
			r = p;
			g = v;
			b = t;
			break;
			
		case 3:
			r = p;
			g = q;
			b = v;
			break;
			
		case 4:
			r = t;
			g = p;
			b = v;
			break;
			
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hex2rgb(hex) {
  if(hex.length<3)
    return {
        red:   0,
        green: 0,
        blue:  0
      };
  if (hex.charAt(0)=="#") hex=hex.substr(1);
  if (hex.length==3) {
    var temp=hex; hex='';
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
  }
  var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
  return {
    red:   parseInt(triplets[0],16),
    green: parseInt(triplets[1],16),
    blue:  parseInt(triplets[2],16)
  }
}

function rgbToHsv (r,g,b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h*359, s*100, l*100];
}

jQuery.fn.resizeAndCenter = function(w, h, ow, oh, sizing){
    var width = $(this).width();
	var height = $(this).height();
	
	if(sizing == undefined)
		sizing = "normal";
	
	if(ow != undefined)
	   width = ow;
    if(oh != undefined)
       height = oh;
	
	var newH = oh, newW = ow;
	
	//Check if normal has to go for fit
	if( sizing == "normal" && (ow>w || oh>h))
		sizing = "fit";
	
	
	//Same for FULL and FIT sizing method
	if(sizing == "full" || sizing == "fit"){
		var ratio = height / h;
		
		newH = height/ratio;
		newW = width/ratio;
	}
	
	//Full Sizing method
	if(sizing == "full"){
		if(newW < w){
			ratio = width / w;
			newH = height/ratio;
			newW = width/ratio;
		}
	}
	
	//Fit Sizing method
	if(sizing == "fit"){
		if(newW > w){
			ratio = width / w;
			newH = height/ratio;
			newW = width/ratio;
		}
	}
	
	$(this).css({
		//"position":"relative",
		"height":newH+"px",
		"width":newW+"px",
		"top": Math.round(h/2-newH/2) + "px",
		"left": Math.round(w/2-newW/2) + "px"
	});
	
	return this;
}

jQuery.fn.processFont = function(font, color, size) {
	$(this).css({
		"font-family" : font,
		"color" : color,
		"font-size" : size + "px"
	});
}

jQuery.fn.processIcon = function(image) {
	$(this).css({
		"background-image" : "url(" + image + ")",
		"background-repeat" : "no-repeat",
		"background-position" : "15px 11px"
	});
}