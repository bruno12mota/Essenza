jQuery(document).ready(function(b){function e(a){f.css("display","none");c.removeClass("active");f.eq(a).css("display","block");c.eq(a).addClass("active");g.removeClass("active");c.eq(a).parent().parent().parent().find(".tc_button").addClass("active")}var d=b("#template_customizer"),f=d.find(".content"),c=d.find(".tc_sub_button"),g=d.find(".tc_button");c.click(function(){var a=b(this),a=parseInt(a.attr("rel"),10);e(a);return!1});e(0);b("#save_button").click(function(){b("#tc_form").submit();return!1})});