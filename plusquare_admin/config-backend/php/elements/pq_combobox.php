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
			require(["jquery", "ui/elements/Combobox"],
				function($, Combobox) {
					$(document).ready(function(){
						var $input = $("#<?php echo $id; ?>");

						var comboBox = new Combobox($("#<?php echo $id; ?>_combobox"), $input.val(), [<?php
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
							$input.val(value);
							$input.trigger("change");
							
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
						
						$input.bind("update", function(){
							var val = $("#<?php echo $id; ?>").val();

							if(val == ""){
								$("#<?php echo $id; ?>").val("<?php echo isset($values[0]) ? $values[0] : ''; ?>");
								val = "<?php echo isset($values[0]) ? $values[0] : ''; ?>";
							}

							comboBox.val(val);
						});					
					});
					
				}
			);
        </script>
        
        <?php
	}
	
	
}