<?php 

class pq_tabs {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare tabs option picker
	*
	*	@author Plusquare
	*	@date 28-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $options, $values, $tabs, $value, $typeOption){
		$this->id = $id;
		
		//include_once("../pq_options.php");
		
		?>
        <input class="ui-textbox for-text" type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;" />
        <div id="<?php echo $id; ?>_tabs" class="ui_tabs">
        	<div class="ui_tabs_menu">
            	<?php
				foreach($options as $option){ 
					?>
                    <a href="#"><?php echo $option; ?></a>
                    <?php
				} 
				?>
            </div>
            <div class="ui_tabs">
           		<?php
				foreach($tabs as $tab){ 
					?>
                    <div class="ui_tab">
                    <?php
					if(isset($tab["id"]) || isset($tab["label"]))
						//only one option
						make_option($tab, $typeOption);
					else
						//Multiple options
						foreach($tab as $option){
							make_option($option, $typeOption);
						}
					?>
                    </div>
                    <?php
				} 
				?>
            </div>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "ui/elements/Tabs"],
				function($, Tabs) {
					var tabs = new Tabs(
						//id
						$("#<?php echo $id; ?>_tabs"), 
						
						//options
						<?php echo (($value == "" || $value == NULL) ? 0 : "'".$value."'"); ?>, [<?php
						$count = 0; 
						foreach($options as $option){ 
							if($count != 0)
								echo ",";
							echo "'".$option."'";
							$count++;
						} 
						?>], 
						
						//values
						[<?php 
						$count = 0; 
						foreach($values as $value){ 
							if($count != 0)
								echo ",";
							echo "'".$value."'";
							$count++;
						} ?>]);
					
					var $input = $("#<?php echo $id; ?>");
					var ignoreOnce = false;
					
					//On Change
					var onChange = function(){
						if(ignoreOnce){
							ignoreOnce = false;
							return;
						}

						var value = tabs.val();
						$input.val(value).trigger("change");
					};
					onChange();
					$(tabs).bind("change", onChange);
					
					//On Update
					var onUpdate = function(){
						ignoreOnce = true;
						tabs.val($input.val());
					};
					$input.bind("update", onUpdate);
				}
			);
        </script>
        
        <?php
	}
	
	
}