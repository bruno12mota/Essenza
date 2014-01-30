<?php 

class pq_slide_element {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare slide element (for slider builder only)
	*
	*	@author Plusquare
	*	@date 15-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id){
		$this->id = $id;
		
		$animationOptions = array(
			//Animation Delay
			array(
				"label" => "Animation Delay (sec.)",
				"id" => $id."_delay",
				"type" => "text",
				"default" => "0",
				"help" => "Animation delay since it arrives at the previous position."
			),
			
			//Animation Duration
			array(
				"label" => "Animation Duration (sec.)",
				"id" => $id."_duration",
				"type" => "text",
				"default" => "1",
				"help" => "Animation duration from the previous to the next phase."
			),
			
			//Animation Tween Type
			array(
				"label" => "Tween Type",
				"id" => $id."_type",
				"type" => "combobox",
				"options" => array( "linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
				"values" => array("linear", "swing", "jswing", "Quad", "Cubic","Quart","Quint","Expo","Sine","Circ"),
				"default" => "Expo",
				"help" => "Animation tween type."
			),
			
			//Animation Tween Ease
			array(
				"label" => "Tween Ease",
				"id" => $id."_ease",
				"type" => "combobox",
				"options" => array( "Ease In", "Ease Out", "Ease In&Out" ),
				"values" => array( "easeIn", "easeOut", "easeInOut" ),
				"default" => "easeOut",
				"help" => "Animation tween ease."
			)
		);
		
		$stageOptions = array(
			//Left Position
			array(
				"label" => "Element Left Position",
				"id" => $id."_left",
				"type" => "pixels",
				"default" => "0",
				"help" => "Horizontal position of the selected element on stage."
			),
			
			//Top Position
			array(
				"label" => "Element Top Position",
				"id" => $id."_top",
				"type" => "pixels",
				"default" => "0",
				"help" => "Vertical position of the selected element on stage."
			),
			
			//Size
			array(
				"label" => "Element Size",
				"id" => $id."_size",
				"type" => "percentage",
				"default" => "100",
				"help" => "Image percentage size according to it's original size on the selected stage."
			),
			
			//Opacity
			array(
				"label" => "Element Opacity",
				"id" => $id."_opacity",
				"type" => "percentage",
				"default" => "100",
				"help" => "Element opacity in the current selected stage."
			),
			
			//Snap To Position
			array(
				"label" => "Snap To Position",
				"id" => $id."_snap_to",
				"type" => "snap_to",
				"help" => "Snap element to a position."
			)
		);
		
		?>
        <div id="<?php echo $id; ?>" class="slide_element_editor">
        	<div class="wraper">
            	<a href="#" class="phase small" rel="0">Start In</a>
            	<a href="#" class="phase big" rel="1">Set Animation</a>
            	<a href="#" class="phase small" rel="2">Start Out</a>
            	<a href="#" class="phase big" rel="3">Set Animation</a>
            	<a href="#" class="phase small" rel="4">Finish In</a>
            	<a href="#" class="phase big" rel="5">Set Animation</a>
            	<a href="#" class="phase small" rel="6">Finish Out</a>
            </div>
            <div class="slide_element_options">
           		<div class="animation">
                	<?php
					foreach ( $animationOptions as $option) {
						//Make option
						make_option($option);
					}
					?>
                </div>
           		<div class="stage">
                    
                    <div class="option_main_holder" style="overflow:hidden;">
                        <a href="#" class="ui-button left_part" id="element_match_previous" style="width: 253px;"><img class="arrow-icon-left" src="<?php echo get_template_directory_uri() ?>/plusquare_admin/UI_Elements/match_previous_icon.png"/>Match Previous Position</a>
                        <a href="#" class="ui-button right_part" id="element_match_following" style="width: 253px;">Match Following Position<img class="arrow-icon-right" src="<?php echo get_template_directory_uri() ?>/plusquare_admin/UI_Elements/match_next_icon.png"/></a>
                    </div>

                	<?php
					foreach ( $stageOptions as $option) {
						//Make option
						make_option($option);
					}
					?>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
			require(["jquery"],
				function($) {
					$(document).ready(function(){
						var $holder = $("#<?php echo $id; ?>");
						var $stage = $holder.find(".stage");
						var $animation = $holder.find(".animation");
						var $buttons = $holder.find(".phase");
						
						$buttons.click(function(e){
							var $button = $(e.target);
							
							if($button.hasClass("small")){
								//Stage
								$stage.css("display", "block");
								$animation.css("display", "none");
							}
							else{
								//animation
								$stage.css("display", "none");
								$animation.css("display", "block");
							}
							
							$buttons.removeClass("active");
							$button.addClass("active");
							
							$holder.trigger("changePhase", parseInt($button.attr("rel"), 10) );
							
							return false;
						});
						$buttons.eq(2).trigger("click");
					});
				}
			);
        </script>
        
        <?php
	}
	
	
}