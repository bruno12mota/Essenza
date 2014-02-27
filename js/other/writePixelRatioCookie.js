writeCookie();
function writeCookie(){
	the_cookie = document.cookie;
	if( the_cookie ){
		window.devicePixelRatio = window.devicePixelRatio || Math.round(window.screen.availWidth / document.documentElement.clientWidth);
		the_cookie = "pixel_ratio="+window.devicePixelRatio+";"+the_cookie;
		document.cookie = the_cookie;
		location = vars.php_self;
	}
}