<?php 

class pq_color_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare color picker
	*
	*	@author Plusquare
	*	@date 03-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		?>
        <input type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>
        <div id="<?php echo $id; ?>_color_picker" class="ui_color_picker"></div>
        
        <script type="text/javascript">
			jQuery(document).ready(function($){
				var Backend = require("./Backend.js");
				var ColorPicker = Backend.ui.ColorPicker;

				var colorPicker = new ColorPicker($("#<?php echo $id; ?>_color_picker"), $("#<?php echo $id; ?>").val(), "<?php echo $id; ?>");
			});
		</script>
        <?php
	}
	
	
}