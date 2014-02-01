<?php 

class pq_text_area {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare text area
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		?>
        <textarea class="ui-textbox for-textarea" id="<?php echo $id; ?>" name="<?php echo $id; ?>"><?php echo $value; ?></textarea>
        <?php
	}
}