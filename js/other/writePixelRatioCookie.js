function setCookie(cname,cvalue,exdays)
{
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

window.devicePixelRatio = window.devicePixelRatio || Math.round(window.screen.availWidth / document.documentElement.clientWidth);
setCookie("pixel_ratio", window.devicePixelRatio, 300);