<?php 

class pq_frontpage_picker {
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare Front page picker
	*
	*	@author Plusquare
	*	@date 23-02-14
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){

		//Get options
		$page_on_front = $value;

		//Echo
		$echo = "";

		//No page selected
		if($page_on_front == FALSE){
			$string = "No page or post selected yet! Press the button below to choose one.";
		}
		else{
			$string = "Selected: ".get_the_title($page_on_front);
		}

		//Selected Post/page
		$echo .= '<p class="fp_text">'.$string.'</p>';

		//Clear
		$echo .= '<div class="clear"></div>';

		//Button
		$echo .= '<a href="#" id="choose_page" class="button button-primary button-large">Choose</a>';

		echo $echo;
		?>
        <input type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>
        
        <script type="text/javascript">
        	//Make checkbox
			require(["jquery", "Lightbox/Lightbox"],
				function($, Lightbox) {
					$(document).ready(function(){
						//Lightbox
						var lightbox = false;

						//Input
						var $input = $("#<?php echo $id; ?>"); 

						//Text
						var $fp_text = $(".fp_text");

						//Vars
						var id, title;

						//Choose page button on click
						$("#choose_page").click(function(){
							//Create lightbox
							lightbox = new Lightbox("Choose Page/Post", "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", change_selected);

							//Make list
					        jQuery.post(
					            adminAjax,
					            {
					                'action' : 'pq_get_pages_posts'
					            },
					            $.proxy(function( response ) {
					                lightbox.addContent(response);
					            }, this)
					        );

							return false;
						});

						//When a new page or post is selected in the lightbox
						function change_selected(){
							id = $("#pq_pages_posts_picker").val();

							if(id != ""){
								title = $(".pp_picker_list").find("a[data-id='"+id+"']").html();

								//input
								$input.val( id );

								//Change current text
								$fp_text.html("Selected: "+title);
							}

							//Close lightbox
							if(lightbox !== false)
        						lightbox.closeEdit();
						}
					});
				}
			);
		</script>
        <?php
	}
	
	
}