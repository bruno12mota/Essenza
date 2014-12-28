
var $ = jQuery;

var $cover = $("#content-cover");
$cover.data("priority", false);

var Cover = {
	contentCoverIn: function(priority){
		if(!$cover.data("priority")){
			$cover.stop().css("display", "").fadeTo(600, 1, "easeOutExpo");
				
			if(priority === true)
				$cover.data("priority", true);
				
			return true;
		}
			
		return false;
	},
	contentLoadingIn: function(){
		$cover.addClass("loading");
		Cover.contentCoverIn();
	},

	contentCoverOut: function(priority){
		if( ((!$cover.data("priority") && !priority) || priority) ){

			//Not loading
			if(!$cover.hasClass("loading"))
				$cover.stop().fadeTo(600, 0, "easeOutExpo", function(){
					$(this).css("display", "none");	
				});
			
			$cover.data("priority", false);
			return true;
		}
		return false;
	},
	contentLoadingOut: function(){
		$cover.removeClass("loading");
		Cover.contentCoverOut();
	}
}

module.exports = Cover;