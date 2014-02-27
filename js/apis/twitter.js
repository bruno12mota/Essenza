window.twttr = (function (d,s,id) {
	var t, js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
	js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
	return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
}(document, "script", "twitter-wjs"));

function refreshTweetButtons(){
	if(window.twttr == undefined)
		return;

	if(window.twttr.widgets != undefined)
		window.twttr.widgets.load();
	else
		window.twttr.ready(function (twttr) {
			window.twttr.widgets.load();
		});
}

jQuery(document).ready(function($){
	$("body").addClass("TwitterLoaded").trigger("TwitterLoaded");
});