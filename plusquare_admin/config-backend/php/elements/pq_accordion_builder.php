<?php 

class pq_accordion_builder {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare tabbing builder
	*
	*	@author Plusquare
	*	@date 12-03-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		global $essenza_shortcodes_options;
		
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value='<?php echo $value; ?>' style="display:none;"/>
        
		<input id="<?php echo $this->id; ?>_tabs" type="text" value='' style="display:none;"/>
        
        <div class="sidebar_picker" id="<?php echo $this->id; ?>_holder">
        	<div class="option_help">Your current accordion items: </div>
        	<div class="page_builder">
            	<div class="menu_holder"></div>
        		<div class="placeholders_holder" >
                </div>
            </div>
        	<div>
            	<div class="option_help">Each text area correspondes to an accordion's item title in the respective order.</div>
                <div class="titles_holder">
                	<!-- Titles input go here -->
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "PageBuilder/StackBuilder", "ui/elements/Combobox", "utils/utils"],
				function($, StackBuilder, Combobox) {
					$(document).ready(function(){
						var $holder = $("#<?php echo $this->id; ?>_holder");
						
						var $mainInput = $("#<?php echo $this->id; ?>");
						var $input = $("#<?php echo $this->id; ?>_tabs");
						
						var titleInputs = new Array();
						var $titles_holder = $holder.find(".titles_holder");
						
						
						//Make stack builder
						var stackBuilder = new StackBuilder($input, $holder.find(".placeholders_holder"), $holder.find(".menu_holder"), true, "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", <?php echo json_encode($essenza_shortcodes_options); ?>, "accordion_item_content");
						
						function onUpdate(){
							var mainValue = $mainInput.val();
							
							//accordion_item
							var regexComponent = new RegExp("\\[accordion_item\\][\\s\\S]*?\\[\\/accordion_item\\]", "gi");
							var matchedComponents = mainValue.match(regexComponent);
							
							//accordion_item_title
							var regexTitle = new RegExp("\\[accordion_item_title\\][\\s\\S]*?\\[\\/accordion_item_title\\]", "gi");
							var matchedTitles = mainValue.match(regexTitle);
							
							//accordion_item_title
							var regexContent = new RegExp("\\[accordion_item_content.{0,1}?\\][\\s\\S]*?\\[\\/accordion_item_content.{0,1}?\\]", "gi");
							var contentInput = "";
						
							
							if(matchedComponents != null){
								removeAllTitles();
								$.each(
									matchedComponents,
									function(ind, matchedComponent){
										//get title		
										var title = "";
										if(matchedTitles[ind] != null){
											title = matchedTitles[ind];
											title = title.substring(22, title.length - 23);
										}
										addNewInput(null, title ,ind+1);
										
										//get content
										var item_content = matchedComponent.match(regexContent);
										item_content = item_content[0];
										contentInput += item_content;
									}
								);
								
								$input.val(contentInput);
								stackBuilder.fromHtml();
							}

							if($titles_holder.find("*").length == 0){
								addNewInput();
							}
						}
						onUpdate();
						$mainInput.bind("update", onUpdate);
						
						function addNewInput(e, text, number){
							if(text == undefined)
								text = "";
							
							if(number != undefined && number <= titleInputs.length)
								return;
							
							var $newinput = $('<textarea style="max-width:98%; min-width:99%; display:block; margin-bottom:10px;">'+text+'</textarea>');
							$titles_holder.append( $newinput );
							$newinput.bind("change blur", updateMainVal);
							
							//add to array
							titleInputs.push( $newinput );
						}
						
						//New placeholder added
						$(stackBuilder).bind("placeholderAdded", addNewInput);
						
						function removeAllTitles(){
							$titles_holder.find("*").remove();
							titleInputs = new Array();
						}
						
						//Placeholder removed
						$(stackBuilder).bind("placeholderRemoved", function(e, number){
							var $inputRemove = titleInputs[number];
							$inputRemove.remove();
							
            				titleInputs = removePositionInArray(titleInputs, number);
						});
						
						function updateMainVal(){
							//Make titles
							var accordionItemsStr = $input.val();
									
							var regexComponentStr = "\\[accordion_item_content.{0,1}?\\][\\s\\S]*?\\[\\/accordion_item_content.{0,1}?\\]";
							var regexComponent = new RegExp(regexComponentStr, "gi");
							var matchedComponents = accordionItemsStr.match(regexComponent);
							var len = matchedComponents.length;
							
							var str = "";
							$.each(
								titleInputs,
								function(index, titleInput){
									if(len > index){
										//Start item
										str += "[accordion_item]";
										
										//title
										str += '[accordion_item_title]'+titleInput.val()+'[/accordion_item_title]';
										
										//content
										var matchedComponent = matchedComponents[index];
											
										str += matchedComponent;
										
										//Close item
										str += "[/accordion_item]";
									}
								}
							);
							
							$mainInput.val(str);
						}
						
						$input.bind("change", updateMainVal);
					});
				}
			);
        </script>
        
		<?php
	}
}