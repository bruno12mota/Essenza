<?php 

class pq_ken_burns {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare combobox option picker
	*
	*	@author Plusquare
	*	@date 10-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value, $noRatio){
		$this->id = $id;
		
		?>
        <input type="text" value="<?php echo $value; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;" />
        <div class="kenburns_holder">
            <div id="<?php echo $id; ?>_kenburns" class="kenburns">
                <div class="background"></div>
                <div class="background_cover"></div>
                <div class="scaler">
                    <div class="selected_part">
                    	<div class="imageHolder"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery",
					"elements/Kenburns"],
				function($, Kenburns) {
					$(document).ready(function(){
						var kenburns = new Kenburns($("#<?php echo $id; ?>_kenburns"), <?php echo (($value == "" || $value == NULL) ? 0 : "'".$value."'"); ?>, 200, 200);
						var noRatio = <?php echo $noRatio===TRUE?"true":"false" ?>;
						if(noRatio)
							kenburns.changeRatio(undefined);
						
						var $imageHolder = $("#<?php echo $id; ?>_kenburns .imageHolder");
						var $input = $("#<?php echo $id; ?>");
						var onChange = function(e){
							var values = kenburns.val();
							
							//Position
							var left = values.left;
							var top = values.top;
							
							$imageHolder.css({
								"top": -top-1 + "px",
								"left": -left-1 + "px"
							});
							
							//Size
							var size = values.size;
							
							//Set input value
							// top/left/width/height
							var value;
							if(noRatio){
								//No ratio	
								value = values.top+"/"+values.right+"/"+values.bottom+"/"+values.left;
							}
							else{
								//Ratio	
								left = values.leftRel;
								top = values.topRel;
								value = top+"/"+left+"/"+size+"/";
							}
							$input.val(value).trigger("change");
							
						};
						onChange();
						$(kenburns).bind("change", onChange);
						
						
						//UPDATE
						var onUpdate = function(e){
							var value = $input.val();
							kenburns.val(value);
							onChange();
						};
						$input.bind("update", onUpdate);
						
						
						//RATIO CHANGE
						$input.bind("ratioChange", function(e, ratio){
							kenburns.changeRatio(ratio);
							onUpdate();
						});
						
						
						
						//CHANGE IMAGE 
						var $background = $("#<?php echo $id; ?>_kenburns .background");
						var $imageHolder = $("#<?php echo $id; ?>_kenburns .imageHolder");
						$("#<?php echo $id; ?>").bind("changeImage", function(e, url, width, height){
							var maxWidth = 500;
							var maxHeight = 300;
							
							//Case width overflows
							if(width > maxWidth){
								var ratio = width / maxWidth;
								width /= ratio;
								height /= ratio;
							}
							
							//Case height still overflows
							if(height > maxHeight){
								var ratio = height / maxHeight;
								width /= ratio;
								height /= ratio;
							}
							
							//
							$("#<?php echo $id; ?>_kenburns").css({
								"width": width+"px",
								"height": height+"px"
							});
							$background.empty()
									   .append("<img src='"+url+"' alt='image' width='"+width+"' height='"+height+"' />");
							$imageHolder.empty()
										.append("<img src='"+url+"' alt='image' width='"+width+"' height='"+height+"' />");
							
							var value = $input.val();
							kenburns.changeSize(width, height, value);
							onChange();
							
							return false;
						});

						$input.addClass("ready").trigger("bindsReady");
					});
				}
			);
        </script>
        
        <?php
	}
	
	
}