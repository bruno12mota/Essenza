<?php 

class pq_text {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare text field
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		?>
        <input class="ui-textbox for-text" type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>"/>
        <?php
	}
	
	
}