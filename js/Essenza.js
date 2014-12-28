
esza_cover_menu = (directory.cover_menu === "true" || directory.cover_menu === true) ? true : false;

require("./essenza/Shortcodes.js");
require("./essenza/menu.js");

module.exports = {
	Portfolio: require("./essenza/Portfolio.js"),
	Masonry: require("./essenza/Masonry.js"),
	DynamicLoading: require("./essenza/DynamicLoading.js"),
	Lightbox: require("./essenza/Lightbox.js"),
	Info: require("./essenza/Info.js"),
	EasyBackground: require("./essenza/EasyBackground.js"),
	Cover: require("./essenza/Cover.js"),

	Slider: require("./slider/Slider.js"),

	Dragable: require("./other/Dragable.js")
};