<?php 

class pq_media_multiple_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare media multiple picker
	*
	*	@author Plusquare
	*	@date 20-12-12
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value, $value_sizing, $media_type){
		$this->id = $id;

		if(WP_DEBUG)fb::log("MP: ".$value);
		if(WP_DEBUG)fb::log("MP: ".$value_sizing);
		 
		?>
        <div class="items-grid-holder" id="<?php echo $this->id; ?>_grid_holder">
            <div class="items-grid" id="<?php echo $this->id; ?>_grid">
            </div>
        </div>
        
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" style="display:none;" value="<?php echo $value; ?>"/>
			        
        <?php
		if($value_sizing !== false){
			?>
			<input id="<?php echo $this->id; ?>_sizing" name="<?php echo $this->id; ?>_sizing" type="text" style="display:none;" value="<?php echo $value_sizing; ?>"/>
			<?php
		}
		?>

		<a class="button button-primary button-large" id="<?php echo $this->id; ?>_button" href="#" onclick="return false;">Add Images</a>
        
        <?php
		if($media_type != "image"){
			?>
			<a class="button button-primary button-large" id="<?php echo $this->id; ?>_button_other" href="#" onclick="return false;">Add Other Content</a>
            <div id="<?php echo $this->id; ?>_add_other" class="sub-options-holder" style="display:none;">
            	<?php 
				//Video Picker
				make_option(array(
					"label" => "Video Type",
					"id" => $this->id."_video",
					"type" => "video_picker",
					"default" => "youtube"
				)); 
				
				//Video Id
				make_option(array(
					"label" => "Video Id",
					"id" => $this->id."_video_id",
					"type" => "text",
					"default" => ""
				)); 
				
				//Video Image
				make_option(array(
					"label" => "Video Image",
					"id" => $this->id."_video_image",
					"type" => "media_single_picker",
					"default" => "",
					"width" => 200,
					"height" => 200,
					"info" => "Image will be used for the slide itself and for the thumbnail of the slider!"
				)); 
				?>
                <a class="button button-primary button-large add_video" href="#" onclick="return false;" style="margin-top:20px;">Add video</a>
                <a class="button button-primary button-large cancel_add_video" href="#" onclick="return false;" style="margin-top:20px;">Cancel</a>
            </div>
			<?php
		}
		?>
        
		<script type="text/javascript">
			jQuery(document).ready(function($){
				//Global variables
				adminAjax = "<?php echo get_site_url(); ?>/wp-admin/admin-ajax.php";
				
				//Make Media Grid
				require(["ui/elements/pq_media_multiple_picker"],
					function(Media_Grid) {
						var grid = new Media_Grid("<?php echo $this->id; ?>", <?php echo ($value_sizing === false ?  "false" : "true"); ?>);
						
						//Add other content
						var $addOtherContent = $("#<?php echo $this->id; ?>_add_other");
						var $videoInput = $("#<?php echo $this->id; ?>_video");
						var $videoIdInput = $("#<?php echo $this->id; ?>_video_id");
						var $videoImageInput = $("#<?php echo $this->id; ?>_video_image");
						$("#<?php echo $this->id; ?>_button_other").click(function(){
							//Toogle add other content
							$addOtherContent.slideToggle(300);
						});
						
						$addOtherContent.find(".add_video").click(function(){
							//Add video
							grid.addVideo($videoInput.val(), $videoIdInput.val(), $videoImageInput.val());
							$videoIdInput.val("");
							$videoImageInput.val("").trigger("update");
						});
						$addOtherContent.find(".cancel_add_video").click(function(){
							//Cancel button
							$addOtherContent.slideUp(300);
						});
					}
				);
				
			});
          </script>
		<?php
	}
	
	
}