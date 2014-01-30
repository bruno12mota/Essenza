<?php 

class pq_video_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare media video picker
	*
	*	@author Plusquare
	*	@date 21-12-12
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		?>
        
        <div id="<?php echo $this->id; ?>_holder" class="video_picker">
        	<a href="#" rel="youtube" class="video_option youtube"></a>
            <a href="#" rel="vimeo" class="video_option vimeo"></a>
            <a href="#" rel="dailymotion" class="video_option dailymotion"></a>
        </div>
        
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value="<?php echo $value; ?>" style="display:none;"/>
		
		
		<script type="text/javascript">
			jQuery(document).ready(function($){
				var $videoPicker = $("#<?php echo $this->id; ?>_holder");
				var $input = $("#<?php echo $id; ?>");
				$input.val("<?php echo $value; ?>");
				
				//On type change
				var onChange = function(){
					var value = $input.val();
					
					//Remove all actives
					$videoPicker.find("a").removeClass("active");
					
					//update active
					$videoPicker.find("a[rel="+value+"]").addClass("active");
				};
				onChange();
				$input.bind("update", onChange);
				
				
				$videoPicker.find("a").click(function(){
					//update input value
					$input.val($(this).attr("rel"));
					$input.trigger("change");
					
					onChange();
					
					return false;
				});
			});
        </script>
		<?php
	}
	
	
}