<?php 

class pq_checkbox {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare checkbox
	*
	*	@author Plusquare
	*	@date 02-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value, $values){
		$this->id = $id;
		
		?>
        <input type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>
        <div id="<?php echo $id; ?>_checkbox" class="ui-checkbox"></div>
        
        <script type="text/javascript">
        	//Make checkbox
			require(["elements/Checkbox"],
				function(Checkbox) {
					var checkbox = new Checkbox($("#<?php echo $id; ?>_checkbox"), "<?php echo $value; ?>", ["<?php echo $values[0]; ?>", "<?php echo $values[1]; ?>"]);
					var $input = $("#<?php echo $id; ?>");
					var onChange = function(){
						var value = checkbox.val();
						$input.val(value).trigger("change");
					};
					onChange();
					$(checkbox).bind("change", onChange);
					
					
					function onUpdate(){
						var value = $input.val();
						checkbox.val(value);
					}
					$input.bind("update", onUpdate);
				}
			);
		</script>
        <?php
	}
	
	
}