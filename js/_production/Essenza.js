
//Options
esza_cover_menu = (directory.cover_menu === "true" || directory.cover_menu === true) ? true : false;

//Require
var requirejs = {
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
	"jquery/jquery.masonry.min",
	
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
};

/*requirejs.config({
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    baseUrl : directory.path,
    paths: {
        slider: 'slider',
        jquery: 'jquery',
        other: 'other',
        essenza: 'essenza',
        utils: 'utils'
    }
});

requirejs([
	//Jquery
	"jquery",
	"jquery/jquery.easing.1.3",
	"jquery/jquery.mobile.vmouse",
	"jquery/jquery.mousewheel.min",
	"jquery/jquery.masonry.min",
	
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
	"utils/utils"
	], function(){

})*/
