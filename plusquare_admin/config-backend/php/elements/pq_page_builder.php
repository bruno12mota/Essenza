<?php 

class pq_page_builder {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare text field
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id){
		$this->id = $id;
		
		global $essenza_shortcodes_options;

		//Saved pages
		$saved_pages = get_option("esza_saved_pages_builder");
		$saved_pages = $saved_pages === FALSE || $saved_pages === null || $saved_pages === "" ? '{}' : str_replace("\n", "", $saved_pages);
		?>
        <div id="<?php echo $id; ?>">
        	<div class="page_builder" id='page_builder'>
            </div>
        </div>
        
        <!-- Add page builder dynamically -->
        <script type="text/javascript">
            require(["jquery", "PageBuilder"],
                function($, PageBuilder) {
                	//Saved pages
                	var saved_pages = <?php echo $saved_pages; ?>;
                	if(saved_pages == null)
                		saved_pages = new Object();
                	if(WP_DEBUG)console.log("saved_pages");
                	if(WP_DEBUG)console.log(saved_pages);

                	//Shortcodes options
                	var shortcodes_options = <?php echo stripslashes(json_encode($essenza_shortcodes_options)); ?>;

                    new PageBuilder($("#page_builder"), "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", shortcodes_options, saved_pages);   	
                }
            );
        </script>
        <?php
	}
	
	
}

