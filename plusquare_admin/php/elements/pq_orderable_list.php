<?php 

class pq_orderable_list {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare orderable list
	*
	*	@author Plusquare
	*	@date 30-06-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		?>
        <!--<input class="ui-textbox" type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>-->

        <div id="<?php echo $id; ?>_orderable_list" class="orderable_list">
        	<!-- 
            <div class="item">
        		<div class="dynamic_part">
        			<span class="image" style="width: 11px; background-image: url(<?php echo get_template_directory_uri(); ?>/plusquare_admin/UI_Elements/slider_builder/text_element.png);"></span>
        			<p class="title">Text Element</p>
        			<a href="#" onclick="return false;">Edit animation</a>
        			<a href="#" onclick="return false;">Edit properties</a>
        		</div> 

    			<div class="fix_part">
    				<a class="depth_up" href="#" onclick="return false;"></a>
        			<a class="remove_element" href="#" onclick="return false;"></a>
        			<a class="depth_down" href="#" onclick="return false;"></a>
    			</div>
    		</div>
            -->
        </div>
        
		<script type="text/javascript">
            //Make Single Pick
            require(["jquery", "elements/OrderableList"], function($, OrderableList) {
			     $(document).ready(function($){
					new OrderableList("<?php echo $this->id; ?>_orderable_list");

                    $("#<?php echo $this->id; ?>_orderable_list").addClass("ready").trigger("bindsReady");
				});
			});
		</script>
        <?php

	}
	
	
}