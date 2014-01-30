jQuery(document).ready(function($){
	
	var $templateCustomizer = $("#template_customizer");
	var $contents = $templateCustomizer.find(".content");
	var $subButtons = $templateCustomizer.find(".tc_sub_button");
	
	function showContent(num){
		//Hide all
		$contents.css("display", "none");
		$subButtons.removeClass("active");
		
		//Update active
		$contents.eq(num).css("display", "block");
		$subButtons.eq(num).addClass("active");
	}
	
	$subButtons.click(function(){
		//Show the associated one
		var rel = parseInt($(this).attr("rel"), 10);
		showContent(rel);
		
		return false;
	});
	
	//Show initial one
	showContent(0);
	
	//Fonts unique processing
	/*$(".fonts_picker").bind("changeFonts", function(e, options, values){
		//Fonts have changed
		$("#esza_h1_font_combobox, #esza_h2_font_combobox, #esza_h3_font_combobox, #esza_h4_font_combobox, #esza_h5_font_combobox, #esza_h6_font_combobox, #esza_p_font_combobox, #esza_menu_font_combobox, #esza_submenu_font_combobox, #esza_footer_font, #esza_inline_quote_font_combobox, #esza_quote_font_combobox, #esza_twitter_quote_font_combobox, #esza_blog_font_combobox, #esza_mosaic_blog_font_combobox, #esza_portfolio_title_font_combobox, #esza_gallery_title_font_combobox, #esza_numeration_font_combobox, #esza_pag_font_combobox").trigger("changeOptions", [options, values]);
	})*/
	
	$("#save_button").click(function(){
		$("#tc_form").submit();
		return false;
	})
});
