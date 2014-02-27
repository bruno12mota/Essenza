<?php 

class pq_pages_posts_picker{
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare page/post picker
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		?>
        <input type="text" value="" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>

        <div class="pp_picker_filter">
        	<a href="#" data-type="page">Pages</a>
        	<a href="#" data-type="slider">Sliders</a>
        	<a href="#" data-type="post">Blog Posts</a>
        	<a href="#" data-type="portfolio">Portfolio Works</a>
        </div>
        <div class="pp_picker_loading">Loading Posts <img src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/ui/loading.gif" /></div>
        <div class="pp_picker_list"></div>


        <script type="text/javascript">
        	//Make checkbox
			require(["jquery"],
				function($) {
					$(document).ready(function(){
						//Input
						var $input = $("#<?php echo $id; ?>"); 

						//List holder
						var $list = $(".pp_picker_list");

						//Loading
						var $loading = $(".pp_picker_loading");

						//Filter buttons
						var $filter = $(".pp_picker_filter");
						var $buttons = $(".pp_picker_filter a");

						//Filter button clicked
						$buttons.click(function(){
							var post_type = $(this).attr("data-type");

							load_list(post_type);

							return false;
						});

						//Load new list
						function load_list(post_type){
							$buttons.removeClass("active");
							$filter.find("a[data-type='"+post_type+"']").addClass("active");

							$loading.show();
							$list.hide();

							//Asyn load
							jQuery.post(
					            adminAjax,
					            {
					                'action' : 'pq_get_pages_posts_list',
					                'post_type' : post_type
					            },
					            $.proxy(function( response ) {

					            	//Add list to holder
					                $list.html( response );

									$loading.hide();
									$list.show();

									$list.find("a").click(list_item_clicked);

					            }, this)
					        );
						}

						load_list("page");


						//List item clicked
						function list_item_clicked(){
							var $link = $(this);

							$list.find("a").removeClass("active");
							$link.addClass("active");

							$input.val( $link.attr("data-id") );

							return false;
						}
					});
				}
			);
		</script>



        <?php
	}
	
	
}