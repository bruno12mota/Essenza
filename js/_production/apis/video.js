SocialVideosSerial = 0;

//Youtube
function onYouTubeIframeAPIReady() {
	jQuery(document).ready(function($){
		$("body").addClass("YouTubeLoaded").trigger("YouTubeLoaded");
	});
}
//Dailymotion
window.dmAsyncInit = function(){
	jQuery(document).ready(function($){
		$("body").addClass("DailymotionLoaded").trigger("DailymotionLoaded");
	});
}