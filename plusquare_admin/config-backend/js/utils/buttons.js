﻿function buttonsClass(classButton, normal, over, width, height, tweenTime) {
	var $ = jQuery;
	var $button = $(classButton);
	
	//NEXT OVER
	var $span = $('<span class="hover"></span>');
	$button.append($span);
	
	$button.css("background-image", "url("+normal+")");
	$span.css("background-image", "url("+over+")");
		
	$button.css({
			"background-image":"url("+normal+")",
			"background-repeat":"no-repeat",
			"background-position":"center",
			"width":width+"px",
			"overflow":"hidden",
			"height":height+"px"
		});	
	$span.css({
			"background-image":"url("+over+")",
			"background-repeat":"no-repeat",
			"background-position":"center",
			"width":width+"px",
			"height":height+"px",
			"position":"absolute",
			"overflow":"hidden",
			"top":0,
			"left":0
		});
		
	fnFixPng($button);
	fnFixPng($span);
	$span.css('opacity', 0);
	
	$button.hover(function () { 
		if(!$button.hasClass('disabled'))
			$span.stop().fadeTo(tweenTime, 1);   
	}, function () {  
		if(!$button.hasClass('active'))
			$span.stop().fadeTo(tweenTime, 0); 
	});  
	
};

