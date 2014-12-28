var $ = jQuery;

$(document).ready(function($){
	
	var $templateCustomizer = $("#template_customizer");
	var $contents = $templateCustomizer.find(".content");
	var $subButtons = $templateCustomizer.find(".tc_sub_button");

	var $main_buttons = $templateCustomizer.find(".tc_button");

	
	function showContent(num){
		//Hide all
		$contents.css("display", "none");
		$subButtons.removeClass("active");
		
		//Update active
		$contents.eq(num).css("display", "block");
		$subButtons.eq(num).addClass("active");

		$main_buttons.removeClass("active");
		$subButtons.eq(num).parent().parent().parent().find(".tc_button").addClass("active");
	}
	
	$subButtons.click(function(){
		var $this = $(this);

		//Show the associated one
		var rel = parseInt($this.attr("rel"), 10);
		showContent(rel);
		
		return false;
	});
	
	//Show initial one
	showContent(0);

	
	$("#save_button").click(function(){
		$("#tc_form").submit();
		return false;
	})
});
