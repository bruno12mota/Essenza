requirejs.config({
    paths: {
        libraries: 'libraries',
        ui: 'ui',
        utils: 'utils',
        SliderBuilder: 'SliderBuilder',
        Lightbox: 'Lightbox'
    }
});

requirejs([	
	//Jquery
	"jquery",  
	
	//UI Elements
	"ui-elements",
	"ui/Accordion",
	"ui/FontPicker",
	
	//Other 
	"libraries/inheritance", 
	"utils/utils",
	
	//Page builder
	"PageBuilder",
	"StackBuilder",
	
	//Slider builder
	"SliderBuilder/SliderEditor",

	//Lightbox
	"Lightbox/Lightbox"
]);
        