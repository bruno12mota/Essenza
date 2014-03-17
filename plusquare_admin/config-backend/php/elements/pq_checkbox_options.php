<?php 

class pq_checkbox_options {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare checkbox
	*
	*	@author Plusquare
	*	@date 02-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value, $options){
		$this->id = $id;

		if($value == ""){
			$value = "{}";
		}
		
		?>
        <input type="text" value="" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>

        <?php
        $output = '<div id="'.$id.'_holder" class="category_picker">';
        foreach($options as $key => $option){
        	$output .= 	'<div class="category">';
        	$output .= 		'<div class="ui-checkbox" data-value="'.$key.'"></div>';
        	$output .= 		'<p><b>'.$option.'</b></p>';
        	$output .= 	'</div>';

            
        }
        $output .= '</div>';

    	echo $output;
        ?>
        
        <script type="text/javascript">
        	//Make checkbox
			require(["jquery", "elements/Checkbox"],
				function($, Checkbox) {
					var $checkboxes = $("#<?php echo $id; ?>_holder .ui-checkbox");
					var $input = $("#<?php echo $id; ?>");
					var values = <?php echo $value; ?>;

					function onChange(){
						var $checkbox = this.$checkbox;
							
						var id = $checkbox.attr("data-value");
						var activeVal = this.active?"true":"false";

						values[id] = activeVal;

						change_input();
					}

					function change_input(){
						$input.val( JSON.stringify(values) );
					}
					
					$checkboxes.each(function(index, _checkbox){
						var $checkbox = $(_checkbox);
						var checkbox = new Checkbox($checkbox, "false", ["false", "true"]);

						var id = $checkbox.attr("data-value");

						if(values.hasOwnProperty(id)){
							checkbox.val( values[id] );
						}
						else{
							values[id] = "false";
						}

						$(checkbox).bind("change", onChange);
					});

					change_input();
				}
			);
		</script>
        <?php
	}
	
	
}