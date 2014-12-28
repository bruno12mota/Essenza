<?php 

class pq_tabbing_builder {
	
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
		
		global $plusquare_shortcodes_options;
		
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value='<?php echo $value; ?>' style="display:none;"/>
        
		<input id="<?php echo $this->id; ?>_tabs" type="text" value='<?php echo $value; ?>' style="display:none;"/>
        
        <div class="sidebar_picker" id="<?php echo $this->id; ?>_holder">
        	<div class="option_help">Your current tabs: </div>
        	<div class="page_builder">
            	<div class="menu_holder"></div>
        		<div class="placeholders_holder" >
                </div>
            </div>
        	<div>
            	<div class="option_help">Each text area correspondes to a tab's title in the respective order.</div>
                <div class="titles_holder">
                	<!-- Titles input go here -->
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
			jQuery(document).ready(function($){
				var Backend = require("./Backend.js");
				var StackBuilder = Backend.StackBuilder;
				var Combobox = Backend.ui.Combobox;

				var $holder = $("#<?php echo $this->id; ?>_holder");
				
				var $mainInput = $("#<?php echo $this->id; ?>");
				var $input = $("#<?php echo $this->id; ?>_tabs");
				
				var titleInputs = new Array();
				var $titles_holder = $holder.find(".titles_holder");
				
				var regexComponent = new RegExp("\\[tab.{0,1}?\\][\\s\\S]*\\[\\/tab.{0,1}?\\]", "gi");
				var matchedComponents = $mainInput.val().match(regexComponent);
				if(matchedComponents != null){
					$input.val( matchedComponents[0] );
				}
				
				//Make stack builder
				var stackBuilder = new StackBuilder($input, $holder.find(".placeholders_holder"), $holder.find(".menu_holder"), true, "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", <?php echo json_encode($plusquare_shortcodes_options); ?>, "tab");
				
				function onUpdate(){
					var mainValue = $mainInput.val();

					//tab
					var regexComponent = new RegExp("\\[tab.{0,1}?\\][\\s\\S]*?\\[\\/tab.{0,1}?\\]", "gi");
					var matchedComponents = mainValue.match(regexComponent);
					
					//tab_title
					var regexTitle = new RegExp("\\[tab_title.{0,1}?\\][\\s\\S]*?\\[\\/tab_title.{0,1}?\\]", "gi");
					var matchedTitles = mainValue.match(regexTitle);
					
					if(matchedComponents != null){
						var contentInput = "";
						removeAllTitles();
						$.each(
							matchedComponents,
							function(ind, matchedComponent){
								//get title		
								var title = "";
								if(matchedTitles[ind] != null){
									title = matchedTitles[ind];
									title = title.substring(11, title.length - 12);
								}
								addNewInput(null, title, ind+1);
								
								//get content
								contentInput += matchedComponent;
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
						
					
					var $newinput = $('<input type="text" value="'+text+'" style="max-width:98%; min-width:99%; display:block; margin-bottom:10px;"/>');
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
					var str = "[tabs_titles]";
					
					//Make titles
					$.each(
						titleInputs,
						function(index, titleInput){
							str += '[tab_title]'+titleInput.val()+'[/tab_title]';
						}
					);
					
					//end titles
					str += "[/tabs_titles]";
					
					str += "[tabs_holder]";
					str += $input.val();
					str += "[/tabs_holder]";
					
					$mainInput.val(str);
				}
				$input.bind("change", updateMainVal);
			});
        </script>
        
		<?php
	}
}