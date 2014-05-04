<?php 

class pq_rich_editor {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare media rich editor
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value, $rich = false){
		$this->id = $id;

		if(defined('DOING_AJAX') && DOING_AJAX){
			?>
			<textarea style="margin-bottom: 10px;max-width: 100%;min-height: 200px;width: 100%;" class="ui-textbox for-textarea" id="<?php echo $id; ?>" name="<?php echo $id; ?>"><?php echo $value; ?></textarea>
			<a href="#" class="button button-primary button-large" id="<?php echo $id; ?>_btn">Open rich editor</a>
			<p>Click on close fullscreen mode to save and close rich editor.</p>
			<script>
				jQuery(document).ready(function($){
					var time_interval; 
					var $editor_hold = $("#ajax_editor_holder");
					var $text_area = $("#<?php echo $id; ?>");

					function check_fullscreen_out(){
						var $d = $editor_hold.find(".mce-fullscreen");
						if($d.length == 0){
							clearInterval(time_interval);

							$text_area.val( tinymce.get('ajax_editor').getContent() );
							$editor_hold.hide();
						}
					}

					$("#<?php echo $id; ?>_btn").click(function(){
						//Open fullscreen ajax rich editor
						if(typeof(tinymce) !== "undefined" ){
							var editor = tinymce.get('ajax_editor');

							if(editor != null){
								$editor_hold.show();

								tinymce.execCommand('mceFocus',false,'ajax_editor');

								editor.setContent($text_area.val());
								editor.execCommand('mceFullScreen', false, null);

								time_interval = setInterval(check_fullscreen_out, 100);
							}
							
						}

						return false;
					});
				});
				
			</script>
			<?php
		}
		else{
			wp_editor( $value, $id, array(
				"media_buttons" => false,
				"teeny" => !$rich,
				"default_editor" => "tinymce"
			));
		}

	}
	
	
}