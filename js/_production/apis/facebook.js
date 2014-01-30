

var plusquare_facebook_vars = vars;
window.fbAsyncInit = function() {
	// init the FB JS SDK
	FB.init({
		appId      : plusquare_facebook_vars.app_id,                        // App ID from the app dashboard
		channelUrl : plusquare_facebook_vars.channel, // Channel File for x-domain communication
		status     : true,                                 // Check Facebook Login status
		xfbml      : true                                  // Look for social plugins on the page
	});

	jQuery(document).ready(function($){
		$("body").addClass("FacebookLoaded").trigger("FacebookLoaded");
	});
};

function refreshFacebookButtons(){
	if(FB != undefined)
		FB.XFBML.parse();
}

// Load the SDK asynchronously
(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/all.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));