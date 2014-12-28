var $ = jQuery;
		    
//Holders
var $cover, $holder, $contentHolder, $content, description_holder, $close_area;

//Buttons
var leftButton, rightButton, descButton, closeButton;

//Other
var groups, description, descriptionOn, group, groupId, img, contentOriginalWidth, contentOriginalHeight, descriptionInterval;

var imgWidth, imgHeight, imgRatio, descriptionHeight, descriptionIteration, descriptionIterations;


//Construct lightbox
$(document).ready(function(){
	window.devicePixelRatio = window.devicePixelRatio || Math.round(window.screen.availWidth / document.documentElement.clientWidth);

    //Lightbox background cover
    $cover = $("<div class='lightbox_cover'></div>"); 

    //Loading clip
    $loadingclip = $('<div class="big-loading"><img src="'+template_directory+'/img/loaders/loader.png" alt="Be patient..." /></div>').appendTo($cover);  
    
    //Lightbox holder
    $holder = $("<div class='lightbox_holder'></div>");
    
    //Close holder
    $close_area = $("<div class='close_area'></div>").appendTo($holder);
    
    //Content holder
    $contentHolder = $("<div class='lightbox_content_holder'></div>").appendTo($holder);
    
    //Content
    $content = $("<div class='lightbox_content'></div>").appendTo($contentHolder);
    
    //Buttons
    leftButton = $("<a href='#' class='lightbox_button previous' onclick='return false;'></a>").appendTo($holder);
    rightButton = $("<a href='#' class='lightbox_button next' onclick='return false;'></a>").appendTo($holder);
    descButton = $("<a href='#' class='lightbox_button desc' onclick='return false;'></a>").appendTo($holder);
    closeButton = $("<a href='#' class='lightbox_button close' onclick='return false;'></a>").appendTo($holder);
    
    //Get lightbox objects
    //getElements();
});


//Gets all the lightbox elements
function getElements(){
	//get elements with class lightbox
	var $items = $(".lightbox");
	
	//Create groups
	groups = new Object();
	$items.each(function(index, item){
		var $item = $(item);
		
		//get group
		var rel = $item.attr("data-group");
		
		//If belongs to a group
		if(rel != undefined){
			if(!groups.hasOwnProperty(rel))
				//First element of this group
				groups[rel] = new Array();
			
			//Update id
			$item.attr("data-num", groups[rel].length);
			
			//Append to group
			var data = new Object();
			data.content = $item.attr("href");
			data.type = $item.attr("data-type");
			data.type = (data.type==undefined ? "image" : data.type);
			data.width = $item.data("width");
			data.height = $item.data("height");
			if($item.data("description") != undefined)
				data.description = $("body").find("#"+$item.data("description"));
			else
				data.description = $item.find(".description");

			groups[rel].push( data );
		}
	});
	
	//Click events
	$items.bind(clickBind, lightboxItemClicked);
}


//When a lightbox is clicked, open lightbox
function lightboxItemClicked(){
    var href = $(this).attr("href");
    var group = $(this).attr("data-group");
    var type = $(this).attr("data-type");
    var groupId = parseInt($(this).attr("data-num"), 10);
    var description;

    if($(this).data("description") != undefined)
		description = $("body").find("#"+$(this).data("description"));
	else
		description = $(this).find(".description");
    
    type = (type==undefined ? "image" : type);

    if(type == "image"){
		//Get content size
		contentOriginalWidth = parseInt($(this).data("width"), 10);
		contentOriginalHeight = parseInt($(this).data("height"), 10);
	}
    
    //open lightbox
    open(href, type, group, groupId, description.length > 0 ? description : false);
    
    return false;
}
	
//Open lightbox
function open(content, type, _group, _groupId, description){
	//get body
	var body = $("body");
	
	//initially
	descriptionOn = false;
	
	//Save group
	group = _group;
	groupId = _groupId;
	
	//Append cover and fade in
	$cover.appendTo(body).stop().fadeTo(0, 0).fadeTo(250, 0.85, "easeOutExpo");
	
	//Append holder and fade in
	$holder.appendTo(body).stop().fadeTo(0, 0).fadeTo(250, 1, "easeOutExpo");
	
	//Fade out content
	$content.stop().fadeTo(0, 0);
	
	//Load content
	loadContent(content, type, description);
	
	//Update buttons
	updateButtons();
	
	//Binds
	$close_area.unbind(clickBind).bind(clickBind, close);
	closeButton.unbind(clickBind).bind(clickBind, close);
	leftButton.unbind(clickBind).bind(clickBind, previous);
	rightButton.unbind(clickBind).bind(clickBind, next);
	descButton.unbind(clickBind).bind(clickBind, toogleDescription);
	$(document).keypress(keyPressed);
}
	
	
//Load content
function loadContent(content, _type, _description){
	if(_description != false)
		description = _description.clone().addClass("description").show();
	else
		description = false;
	
	type = _type;

	$cover.addClass("loading");
	
	//Image type
	if(type == "image"){
		//Get available space
		var availableWidth = $(window).width();
		var availableHeight = $(window).height() ;
		var imageWidth = 0;
		
		if(!(availableWidth <= 700 || availableHeight <= 500)){
			availableWidth *= 0.8;
			availableHeight *= 0.9;
		}

		/*if(!isNaN(contentOriginalWidth)){
			var minWidth = availableWidth;
			var minHeight = availableHeight;

			//Resize image
			if(contentOriginalWidth > availableWidth || contentOriginalHeight > availableHeight){
				var ratio = contentOriginalHeight / availableHeight;
				
				minWidth = contentOriginalWidth / ratio;
				minHeight = contentOriginalHeight / ratio;
				
				if(minWidth > availableWidth){
					ratio = contentOriginalWidth / availableWidth;
					
					minWidth = contentOriginalWidth / ratio;
					minHeight = contentOriginalHeight / ratio;
				}
			}
			availableWidth = minWidth;
			availableHeight = minHeight;

			var imageRatio = contentOriginalWidth / contentOriginalHeight;
	        var windowRatio = availableWidth / availableHeight;

	        if(windowRatio >= imageRatio)
	        	imageWidth = Math.round(availableWidth);
	        else
        		imageWidth = Math.round(availableHeight * imageRatio);
	        

	        //Accomodate phones resolutions
	        if(windowRatio < 1 && imageWidth < availableHeight)
	        	imageWidth = Math.round(availableHeight);

			//Normalize
        	if(imageWidth > contentOriginalWidth)
	    		imageWidth = contentOriginalWidth;

	    	contentOriginalWidth = imageWidth;
	    	contentOriginalHeight = imageWidth / imageRatio;
		}
		else
			imageWidth = availableWidth;


		//Retina 
		imageWidth *= window.devicePixelRatio;*/
		
		//Load attachment
        jQuery.post(
			adminAjax,
			{
				'action' : 'pq_get_resized',
				'url': content,
				'retina' : window.devicePixelRatio>1  ? 'true' : 'false',
				'width': availableWidth,
				'height': availableHeight,
				'crop': "false",
				"snap": "true",
				"adjust": "true",
				"frontend": "true"
			},
			$.proxy(function( response ) {
				if(response["success"] == true){
					if(WP_DEBUG)console.log(response);
					img = $("<img />").attr('src', response["data"]["url"])
	                     .load(contentLoaded);

	                contentOriginalWidth = parseInt(response["data"]["width"], 10);
	    			contentOriginalHeight = parseInt(response["data"]["height"], 10);
				}
			})
		);

		
	}
	
	//Video
	else if(type == "video"){
		img = $('<iframe src="'+content+'" width="500" height="500" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
		contentLoaded();
	}
	
	//Sound / Music
	else if(type == "sound" || type == "soundcloud")
		img = $('<div></div>').load(content, contentLoaded);
	
}
	
	
//After content has successfully loaded
function contentLoaded(){
	if(type == "image"){
		//Get content size
		if(isNaN(contentOriginalWidth) || isNaN(contentOriginalHeight)){
			contentOriginalWidth = img.get(0).width;
			contentOriginalHeight = img.get(0).height;
		}
	}
	else if(type == "video"){
		contentOriginalWidth = 1000;
		contentOriginalHeight = 620;
	}
	else if(type == "sound" || type == "soundcloud"){
		contentOriginalWidth = 700;
		contentOriginalHeight = 100;
	}
	
	//First resize
	onResize();
	
	//Append content
	$content.append(img).stop().fadeTo(300, 1, "easeOutExpo");
	
	//Run shortcodes for music player
    if(type == "sound" || type == "soundcloud")
	    runShortcodes();
	
	//Append description
	if(description){
		if(description !== false)
		 description_holder = $("<div class='description_holder'></div>").append(description);
		
		if(!descriptionOn)
			description_holder.hide();
		else
			description_holder.show();

		$content.append(description_holder);
		
	}
	$cover.removeClass("loading");
	
	//Resize event
	$(window).unbind("resize", onResize);
	$(window).resize(onResize);
	onResize();
}
	
	
//Toogle image description
function toogleDescription(){
	//Update description on
	descriptionOn = descriptionOn ? false : true;
	
	if(descriptionOn){
		description_holder.stop().fadeTo(1, 0).show();
		onResize();
		description_holder.fadeTo(300, 1);
	}
	else
		description_holder.stop().fadeTo(300, 0, function(){$(this).hide();});
	
}
	
	
//Change to the new image
function loadNew(){
	//Remove old content
	removeContent();
	
	//Get new content
	var content = groups[group][groupId].content;
	var description = groups[group][groupId].description;
	var type = groups[group][groupId].type;

    if(type == "image"){
		//Get content size
		contentOriginalWidth = groups[group][groupId].width;
		contentOriginalHeight = groups[group][groupId].height;
	}

	//Load it
	loadContent(content, type, description.length > 0 ? description : false);
	
	//Upadte buttons
	updateButtons();
}
	
//Go to the nth image in the current group
function goTo(to){
	groupId = to;
	
	$content.stop().fadeTo(200, 0, "easeOutExpo", loadNew);
}
	
//Go to next image
function next(){
	var groupSize = groups[group].length;
	if(groupId < groupSize-1)
		goTo(groupId+1);
		
	return false;
}
	
//Go to previous image
function previous(){
	if(groupId > 0)
		goTo(groupId-1);
		
	return false;
}

//On keyboard key press
function keyPressed(event){
	if ( event.keyCode  == 37 ) {
		//left
		previous();
	}
	else if ( event.keyCode  == 39 ) {
		//right
		next();
	}
}
	
//Update buttons according to group position
function updateButtons(){
	if(description === false)
		descButton.css("display", "none");
	else
		descButton.css("display", "inline");
	
	if(group == undefined){
		//No previous and next buttons
		leftButton.css("display", "none");
		rightButton.css("display", "none");
	}
	else{
		//Is from a group
		var groupSize = groups[group].length;

		leftButton.css("display", "");
		rightButton.css("display", "");
		
		//Left button
		if(groupId <= 0)
			leftButton.addClass("disabled");
		else
			leftButton.removeClass("disabled");
			
		//Right button
		if(groupId >= groupSize-1)
			rightButton.addClass("disabled");
		else
			rightButton.removeClass("disabled");
	}
}
	
	
//When window is resized
function onResize(){
	//Get available space
	var availableWidth = $(window).width() ;
	var availableHeight = $(window).height() ;
	
	if(!(availableWidth <= 700 || availableHeight <= 500)){
		availableWidth *= 0.8;
		availableHeight *= 0.9;
	}
	else{
		availableWidth -= 20;
		availableHeight -= 20;
	}

	
	//Final sizes
	var width = contentOriginalWidth;
	var height = contentOriginalHeight;
	
	//Resize image
	if(width > availableWidth || height > availableHeight){
		var ratio = contentOriginalHeight / availableHeight;
		
		width = contentOriginalWidth / ratio;
		height = contentOriginalHeight / ratio;
		
		if(width > availableWidth){
			ratio = contentOriginalWidth / availableWidth;
			
			width = contentOriginalWidth / ratio;
			height = contentOriginalHeight / ratio;
		}
	}
	
	//Update image size
	if(type == "sound" || type == "soundcloud"){
		img.css({
			"width": width+"px",
			"height": "auto"
		});
		height = img.height();
	}
	else
		img.css({
			"width": width+"px",
			"height": height+"px"
		});
	
	//Update content position
	var fromTop = -height/2;
	$content.css({
		"top": fromTop + "px",
		"left": -width/2 + "px"
	});

	//description height
	if(description != false){
		var descriptionHeight = description.height();
		description.css("margin-top", (height/2-descriptionHeight/2)+"px");
	}
}
	
	
//Remove current content
function removeContent(){
	$content.empty();
}
	
//Close lightbox
function close(){
	//Remove binds
	$close_area.unbind(clickBind);
	closeButton.unbind(clickBind);
	leftButton.unbind(clickBind);
	rightButton.unbind(clickBind);
	descButton.unbind(clickBind);
	$(document).unbind("keypress", keyPressed);

	//Remove cover
	$cover.stop().fadeTo(250, 0, "easeOutExpo", function(){$(this).remove();});
	
	//Remove holder
	$holder.stop().fadeTo(250, 0, "easeOutExpo", function(){$(this).remove();});
	
	//Remove content
	setTimeout(removeContent, 250);
	
	return false;
}

module.exports = {
	getElements: getElements, 
	open: open
};
