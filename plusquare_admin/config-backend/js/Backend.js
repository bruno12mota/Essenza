//Define jQuery
define('jquery', [], function() { return jQuery; });

requirejs.config({
    baseUrl : directory.path,
    deps: [
	    //Jquery
		"jquery",  
		
		//UI Elements
		"ui/ui-elements",
		"ui/Accordion",
		"ui/FontPicker",
		
		//Other 
		"libraries/inheritance", 
		"utils/utils",
		
		//Page builder
		"PageBuilder/PageBuilder",
		"PageBuilder/StackBuilder",
		
		//Slider builder
		"SliderBuilder/SliderEditor",

		//Lightbox
		"Lightbox/Lightbox"]
});
        