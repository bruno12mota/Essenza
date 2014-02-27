<?php 

class pq_tabs_unbinded {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare unbinded tabs
	*
	*	@author Plusquare
	*	@date 03-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $options, $tabs, $typeOption){
		$this->id = $id;
		
		//include_once("../pq_options.php");
		
		?>
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
			require(["jquery","elements/Tabs"],
				function($, Tabs) {
					var tabs = new Tabs(
						//id
						$("#<?php echo $id; ?>_tabs"), 
						
						//options
						0, [<?php
						$count = 0; 
						foreach($options as $option){ 
							if($count != 0)
								echo ",";
							echo "'".$option."'";
							$count++;
						} 
						?>], [<?php
						$count = 0; 
						foreach($options as $option){ 
							if($count != 0)
								echo ",";
							echo "'".$count."'";
							$count++;
						}
						?>]);

					$("#<?php echo $id; ?>_tabs").bind("change", function(e, to){
						tabs.val(to);
					});
				}
			);
        </script>
        
        <?php
	}
	
	
}