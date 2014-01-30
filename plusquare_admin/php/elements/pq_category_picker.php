<?php 

class pq_category_picker {
	
	function __construct($id, $value, $taxonomy){
		$this->id = $id;
		
		//list terms in a given taxonomy using wp_list_categories  (also useful as a widget)
		$orderby = 'name';
		$show_count = 0;
		$pad_counts = 0;
		$hierarchical = 1;
		
		$args = array(
		  'orderby' => $orderby,
		  'show_count' => $show_count,
		  'pad_counts' => $pad_counts,
		  'hierarchical' => $hierarchical,
		  'hide_empty'  => 0,
		  'taxonomy' => $taxonomy
		);
		
		$categories = get_categories($args);
		
		$checkboxesStr = "#checkbox_all_".$taxonomy;
		$count = 0;
		
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value='<?php echo $value; ?>' style="display:none;"/>
        <?php
		
		//fb::log($categories);
		echo "<div id='".$this->id."_holder'  class='category_picker'>";
		
		//All option
		?>
		<div class="category">
            <div id="checkbox_all_<?php echo $taxonomy;?>" class="ui-checkbox" data-id="all" data-parent="0" data-slug="all"></div>
            <p><b>All (Present and Future added categories)</b></p>
        </div>
        <?php
		
		
		foreach($categories as $category){
			$checkbox_id = "checkbox_".$taxonomy."_".$category->term_id;
			$parent = $category->parent == 0;
			$currentParent = !$parent ? $currentParent : $category->term_id;
			fb::log($checkbox_id);
			if($parent || $category->parent == $currentParent){
				?>
				<div class="category <?php echo $parent?"":" sub"; ?>">
					<?php
					if(!$parent){
						echo '<div class="sub-divider"></div>';
					}
					?>
					<div id="<?php echo $checkbox_id; ?>" class="ui-checkbox" data-id="<?php echo $category->term_id; ?>" data-parent="<?php echo $parent ? 0 : $currentParent; ?>" data-slug="<?php echo $category->slug; ?>"></div>
					<p><?php echo $category->cat_name; ?> (<?php echo $category->count; ?>)</p>
				</div>
				<?php
				
				$checkboxesStr .= ", ";
				$checkboxesStr .= "#".$checkbox_id;
				$count++;
			}
		}
		echo "</div>";
		
		
		?>
		<script>
			require(["jquery", "elements/Checkbox"],
				function($, Checkbox) {
					$(document).ready(function(){
						var $input = $("#<?php echo $this->id; ?>");
						var $holder = $("#<?php echo $this->id; ?>_holder");
						var $checkboxes = $("<?php echo $checkboxesStr; ?>");
						var checkboxes = new Object();
						
						function updateInput(){
							var str = "";
							var count = 0;
							
							if(checkboxes["all"]["checkbox"].active){
								$input.val("all");
								return;
							}
								
							$.each(
								checkboxes,
								function(index, main_category){
									//Active main category (all active)
									if(main_category["checkbox"].active){
										var slug = main_category["checkbox"].$checkbox.data("id");
										
										if(count != 0)
											str += ",";
										str += slug;
										count++;
									}
									
									//Main category not active (Check subs)
									else{
										$.each(
											main_category["subs"],
											function(index, sub){
												if(sub.active){
													var slug = sub.$checkbox.data("id");
													
													if(count != 0)
														str += ",";
													str += slug;
													count++;
												}
											}
										);
									}
								}
							);
							$input.val(str);
						}
						
						function changeAll(value){
							$.each(
								checkboxes,
								function(index, main){
									main["checkbox"].val(value);
									$.each(
										main["subs"],
										function(index, sub){
											sub.val(value);
										}
									);
								}
							);
						}
						
						function initialValue(){
							var val = $input.val();
							
							if(val == "all"){
								changeAll("true");
							}
							else{
								var ids = val.split(",");
								$.each(
									ids,
									function(index, id){
										if(checkboxes.hasOwnProperty(id)){
											//Is parent
											checkboxes[id]["checkbox"].val("true");	
											$.each(
												checkboxes[id]["subs"],
												function(index, sub){
													sub.val("true");
											});
										}
										else{
											//Is sub
											$.each(
												checkboxes,
												function(i, checkbox){
													//Iterate subs		
													$.each(
														checkbox["subs"],
														function(index, sub){
															if(index == id){
																sub.val("true");	
																return;
															}
													});
											});
										}
									}
								);
							}
							updateInput();
						}
						
						function onChange(){
							var $checkbox = this.$checkbox;
							
							var parent = $checkbox.data("parent");
							var id = $checkbox.data("id");
							var activeVal = this.active?"true":"false";
							
							//All Selected
							if(id == "all"){
								if(this.active){
									//active all	
									changeAll("true");
								}
							}
							//clicked a parent category
							else if(parent == "0"){
								if(!this.active){
									checkboxes["all"]["checkbox"].val("false");
								}
								//Make all sub items the same
								$.each(
									checkboxes[id]["subs"],
									function(index, sub){
										sub.val(activeVal);
									}
								);
							}
							
							//Clicked a sub item
							else{
								//If unchecked
								if(!this.active){
									checkboxes[parent]["checkbox"].val("false");
									checkboxes["all"]["checkbox"].val("false");
								}
								
								//If checked
								else{
									//Check if all are checked
									var allChecked = true;
									$.each(
										checkboxes[parent]["subs"],
										function(index, sub){
											if(!sub.active)
												allChecked = false;
										}
									);
									if(allChecked)
										checkboxes[parent]["checkbox"].val("true");
								}
							}
							updateInput();
						};
						
						$checkboxes.each(function(index, _checkbox){
							var $checkbox = $(_checkbox);
							var checkbox = new Checkbox($checkbox, "false", ["false", "true"]);
							
							var parent = $checkbox.data("parent");
							var id = $checkbox.data("id");
							
							if(parent == 0)
								checkboxes[ id ] = {"checkbox": checkbox, "subs": new Object()};
							else
								checkboxes[ parent ]["subs"][id] = checkbox;
							
							$(checkbox).bind("change", onChange);
						});
						console.log(checkboxes);
						initialValue();
					});
				}
			);
		</script>
        <?php
	}
}