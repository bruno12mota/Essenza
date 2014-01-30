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

    	global $pq_shortname;
		$pagesColor = get_option($pq_shortname."_pages_color");

		?>
        <textarea class="ui-textbox" id="<?php echo $id; ?>" name="<?php echo $id; ?>"><?php echo $value; ?></textarea>
        
		<script type="text/javascript">
			//Make ckeditor instance
        	require(["ckeditor/ckeditor",
					"ckeditor/jquery_adapter"],
        		function(){
        			var backgroundColor = "#111111";
					var hEd = CKEDITOR.instances['<?php echo $id; ?>'];
					if (hEd) {
						CKEDITOR.remove(hEd);
					}
					CKEDITOR.replace( "<?php echo $id; ?>" ,{
						resize_maxWidth : 700,
						resize_minWidth : 700,
						toolbar : '<?php if($rich) echo "MyToolbar"; else echo "Simple"; ?>'
					});
					CKEDITOR.config.contentsCss = ['<?php echo get_template_directory_uri(); ?>/css/text_styles.css', '<?php echo get_google_fonts_link(); ?>'] ;

					CKEDITOR.config.stylesSet = <?php echo get_google_fonts_list(); ?>;

					//Background color
					CKEDITOR.on('instanceReady', function(e) {

						// First time
						e.editor.document.getBody().setStyle('background-color', "<?php echo $pagesColor == FALSE ? "#111111" : $pagesColor; ?>");
						e.editor.document.getBody().setStyle('padding', "20px");
						// in case the user switches to source and back
						e.editor.on('contentDom', function() {
							e.editor.document.getBody().setStyle('background-color', "<?php echo $pagesColor == FALSE ? "#111111" : $pagesColor; ?>");
							e.editor.document.getBody().setStyle('padding', "20px");
        				});
       				});
					hEd = CKEDITOR.instances['<?php echo $id; ?>'];
					$("#<?php echo $id; ?>").data( 'ckeditorInstance', hEd );
        		}
        	);
        </script>
        <?php
	}
	
	
}