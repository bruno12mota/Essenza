<?php 

class pq_media_single_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare media single picker
	*
	*	@author Plusquare
	*	@date 21-12-12
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $width, $height, $value){
		$this->id = $id;
		?>
          <div class="items-grid" id="<?php echo $this->id; ?>_grid">
               <div class="item" style="width:<?php echo ($width+20); ?>px; height: <?php echo ($height+20); ?>px;">
               	<div class="item-inner">
                    	<div class="img" style="width:<?php echo ($width); ?>px; height: <?php echo ($height); ?>px;">
                        	
                        </div>
                    </div>
               </div>
          </div>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value="<?php echo $value; ?>" style="display:none;"/>
		<a class="button button-primary button-large" id="<?php echo $this->id; ?>_button" href="#">Choose Image</a>
		<script type="text/javascript">
			jQuery(document).ready(function($){
				//Global variables
				adminAjax = "<?php echo get_site_url(); ?>/wp-admin/admin-ajax.php";
				
				//Make Single Pick
				require(["ui/elements/pq_media_single_picker"],
					function(Single_Pick) {
						new Single_Pick("<?php echo $this->id; ?>", <?php echo $width; ?>, <?php echo $height; ?>);
					}
				);
			});
		</script>
		<?php
	}
	
	
}