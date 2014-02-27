//Define jQuery
define('jquery', [], function() { return jQuery; });

//Options
esza_cover_menu = (directory.cover_menu === "true" || directory.cover_menu === true) ? true : false;

//Require
requirejs.config({
	baseUrl : directory.path,
    paths: {
        slider: 'slider',
        jquery: 'jquery',
        other: 'other',
        essenza: 'essenza',
        utils: 'utils'
    },
    deps: [
    //Jquery
	//"jquery",
	"jquery/jquery.easing.1.3",
	"jquery/jquery.mobile.vmouse",
	"jquery/jquery.mousewheel.min",
	
	//Essenza
	"essenza/menu",
	"essenza/Portfolio",
	"essenza/Shortcodes",
	"essenza/Info",
	"essenza/EasyBackground",
	"essenza/Lightbox",
	"essenza/DynamicLoading",
	"essenza/MusicPlayer",
	"essenza/Cover",
	
	//Slider
	"slider/Slider",
	
	//Other
	"other/bootstrap.min",
	"other/Dragable",
	"other/html5",
	"other/modernizr",
	"other/retina",
	"other/Transform",
	"other/vimeo",
	//"other/soundmanager2",
	
	//Utils
	"utils/utils"]
});

