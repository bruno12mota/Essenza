define(["jquery", "essenza/DynamicLoading", "jquery/jquery.easing.1.3"], function($, dynamicLoadingButton) {

	$(document).ready(function(){
		var $cover = $("#content-cover");
		$cover.data("priority", false);
		
		contentCoverIn = function(priority){
			if(!$cover.data("priority")){
				$cover.stop().css("display", "").fadeTo(600, 1, "easeOutExpo");
					
				if(priority === true)
					$cover.data("priority", true);
					
				return true;
			}
				
			return false;
		};
		contentLoadingIn = function(){
			$cover.addClass("loading");
			contentCoverIn();
		};

		contentCoverOut = function(priority){
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
		};
		contentLoadingOut = function(){
			$cover.removeClass("loading");
			contentCoverOut();

			$(".dynamic_loading").each(function(){
				new dynamicLoadingButton($(this));
			});
		};
	});
	
});