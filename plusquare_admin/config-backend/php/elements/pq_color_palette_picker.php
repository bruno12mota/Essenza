<?php 

class pq_color_palette_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare combobox color palette picker
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		global $pq_shortname;

		$options_str = get_option($pq_shortname."_color_palette");
		$options = get_magic_quotes_gpc() ? stripslashes($options_str) : $options_str;

		//Check if empty
		$options = $options === "" || $options === FALSE ? "[]" : $options;

		$value = $value == "" || $value == NULL ? 0 : $value;
		if(WP_DEBUG)fb::log("COLOR: ".$value);
		
		?>
        <div class="palette_combobox" id="<?php echo $id; ?>_palette_combobox">	
        	<div class="color"></div>
        	<input type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>"/>
        	<a href="#" onclick="return false;"><i class="fa-chevron-up"></i></a>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "ui/elements/Palette_combobox"],
				function($, Palette_combobox) {
					$(document).ready(function(){
						var combobox = new Palette_combobox("<?php echo $id; ?>", $("#<?php echo $id; ?>").val(), <?php echo $options; ?>);
					});
				}
			);
        </script>
        
        <?php
	}
	
	
}