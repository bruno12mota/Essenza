<?php 

class pq_file {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare file input
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		?>
        <input id="<?php echo $id; ?>" class="upload-url" type="text" name="<?php echo $id; ?>" value="<?php echo $value; ?>" />
        <input id="<?php echo $id; ?>_upload_button" class="st_upload_button" type="button" name="upload_button" value="Upload" />
        <?php
		
		/*Media Uploader Scripts
		wp_enqueue_script('media-upload');
		wp_enqueue_script('thickbox');
		wp_register_script('my-upload', get_bloginfo( 'stylesheet_directory' ) . '/js/uploader.js', array('jquery','media-upload','thickbox'));
		wp_enqueue_script('my-upload');*/

	}
	
	
}