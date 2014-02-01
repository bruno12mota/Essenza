<?php 

class pq_snap_to {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare snap to option
	*
	*	@author Plusquare
	*	@date 16-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		?>
        <input class="ui-textbox for-text" type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;" />
        <div class="snapTo"  id="<?php echo $id; ?>_snap_to">
            <a href="#" rel="lt">LT</a>
            <a href="#" rel="ct">CT</a>
            <a href="#" rel="rt">RT</a>
            <a href="#" rel="lc">LC</a>
            <a href="#" rel="cc">CC</a>
            <a href="#" rel="rc">RC</a>
            <a href="#" rel="lb">LB</a>
            <a href="#" rel="cb">CB</a>
            <a href="#" rel="rb">RB</a>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery"],
				function($) {
					$(document).ready(function(){
						var $holder = $("#<?php echo $id; ?>_snap_to");
						var $input = $("#<?php echo $id; ?>");
						
						$holder.find("a").click(function(){
							$input.val($(this).attr("rel")).trigger("change");
							
							return false;
						});
					});
				}
			);
        </script>
        
        <?php
	}
	
	
}