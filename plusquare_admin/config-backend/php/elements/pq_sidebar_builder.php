<?php 

class pq_sidebar_builder {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare sidebar builder
	*
	*	@author Plusquare
	*	@date 11-03-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;

		global $essenza_shortcodes_options;

		?>

        <div id="ajax_editor_holder" style="display:none;">
        	<?php 
        	wp_editor( "", "ajax_editor", array(
				"media_buttons" => false,
				"default_editor" => "tinymce"
			));
			?>
        </div>
        
		<div class="sidebar_picker" id ="<?php echo $this->id; ?>_sidebar_picker" style="min-height: 500px;">
        	<div class="option_help"></div>
        	<div class="page_builder">
            	<div class="menu_holder"></div>
        		<div class="placeholders_holder">
                </div>
            </div>
        	<div>
            	<div class="option_help"><?php _e("Drag Components into the Placeholder, once placed you can drag it to change it's position. You can save the sidebar for later use or load a previously saved one"); ?>:</div>
            </div>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "PageBuilder/StackBuilder", "utils/utils"],
				function($, StackBuilder) {
					$(document).ready(function(){

						var $sidebarsPicker = $("#<?php echo $this->id; ?>_sidebar_picker");
						
						//Make stack builder
						var stackBuilder = new StackBuilder(
							$("#content"), 
							$sidebarsPicker.find(".placeholders_holder"), 
							$sidebarsPicker.find(".menu_holder"), false, 
							"<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", 
							<?php echo stripslashes (json_encode($essenza_shortcodes_options)); ?>);

						
					});
				}
			);
        </script>
		<?php
	}
}