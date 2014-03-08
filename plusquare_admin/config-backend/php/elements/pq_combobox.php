<?php 

class pq_combobox {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare combobox option picker
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $options, $values, $value){
		$this->id = $id;
		
		if( !in_array($value, $values) ){
			$value = "";
		}

		?>
        <input class="ui-textbox for-text" type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;" />
        <div id="<?php echo $id; ?>_combobox"></div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "elements/Combobox"],
				function($, Combobox) {
					var comboBox = new Combobox($("#<?php echo $id; ?>_combobox"), <?php echo (($value == "" || $value == NULL) ? 0 : "'".$value."'"); ?>, [<?php
						$count = 0; 
						foreach($options as $option){ 
							if($count != 0)
								echo ",";
							echo "'".plusquare_single_quotes_html($option)."'";
							$count++;
						} 
					?>], [<?php 
						$count = 0; 
						foreach($values as $value){ 
							if($count != 0)
								echo ",";
							echo "'".$value."'";
							$count++;
						} ?>]);
					
					var onChange = function(){
						var value = comboBox.val();
						$("#<?php echo $id; ?>").val(value);
						$("#<?php echo $id; ?>").trigger("change");
						
						//Check for trigger visibility rows
						$(".<?php echo $id; ?>").each(function(){
							var $row = $(this);
							var rel = $row.attr("rel");
							
							if(rel == value)
								$row.css("display", "inline");
							else
								$row.css("display", "none");
						});
					};
					onChange();
					$(comboBox).bind("change", onChange);
					
					$("#<?php echo $id; ?>").bind("update", function(){
						var val = $("#<?php echo $id; ?>").val();

						if(val == ""){
							$("#<?php echo $id; ?>").val("<?php echo isset($values[0]) ? $values[0] : ''; ?>");
							val = "<?php echo isset($values[0]) ? $values[0] : ''; ?>";
						}

						comboBox.val(val);
					});					
					comboBox.val($("#<?php echo $id; ?>").val());
				}
			);
        </script>
        
        <?php
	}
	
	
}