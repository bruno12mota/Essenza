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
        	//Make checkbox
			require(["jquery", "elements/ColorPicker"],
				function($, ColorPicker) {
					$(document).ready(function(){
						var colorPicker = new ColorPicker($("#<?php echo $id; ?>_color_picker"), "<?php echo $value; ?>", "<?php echo $id; ?>");
					});
				}
			);
		</script>
        <?php
	}
	
	
}