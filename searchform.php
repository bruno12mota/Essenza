<form method="get" id="searchform" action="<?php echo home_url( '/' ); ?>" style="position:relative; margin:0;">
	<label for="search" style="margin-top: 5px; margin-bottom: 9px;"><?php echo get_option("esza_trans_searching_for" , "What are you searching for?"); ?></label>
    <div style="position: relative; padding-right: 80px;">
    	<div style="position: relative;">
        	<input class="big" type="text" id="search" name="s" value="" style="width: 100%; "/>
        </div>
		<a href="#" class="big_submit_button" onclick="return false;"></a>
    </div>
</form>
<script>
	jQuery(document).ready(function(){
		$("#searchform").find(".big_submit_button").click(function(){
			$("#searchform").submit();
			return false;
		});
	});
</script>