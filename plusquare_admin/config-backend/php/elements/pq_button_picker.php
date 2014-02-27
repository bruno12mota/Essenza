<?php 

class pq_button_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare button picker
	*
	*	@author Plusquare
	*	@date 28-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value, $useLink){
		$this->id = $id;
		
		$savedButtons = get_option("pq_saved_buttons");
		
		if($savedButtons != FALSE){
			$savedButtons = stripslashes($savedButtons);
			$savedButtonsDecoded = json_decode($savedButtons);
		}
		
		$options = array("Sizing", "Colors", "Font", "Tween", "Text");
		$tabs = array(
			
			//Sizing
			array(
				//Horizontal Padding	
				array(
					"label" => "Horizontal Padding (px.)",
					"id" => $id."hor_pad",
					"type" => "pixels",
					"default" => "20",
					"help" => "Padding on the left and right of the button (Padding is the distance between the content and the end of the button)."
				),
				
				//Vertical Padding	
				array(
					"label" => "Vertical Padding (px.)",
					"id" => $id."ver_pad",
					"type" => "pixels",
					"default" => "10",
					"help" => "Padding on the top and bottom of the button (Padding is the distance between the content and the end of the button)."
				),
				
				//Border Width
				array(
					"label" => "Border Size (px.)",
					"id" => $id."border_size",
					"type" => "pixels",
					"default" => "0",
					"help" => "Size in pixels of the border of the button."
				),
				
				//Round corners
				array(
					"label" => "Round Corners (px.)",
					"id" => $id."border_size",
					"type" => "pixels",
					"default" => "0",
					"help" => "Size in pixels for the corners of the button (0 equals to flat corners)."
				)
			),
			
			//Colors
			array(
				//Background color
				array(
					"label" => "Background Color",
					"id" => $id."background_color",
					"type" => "color_picker",
					"default" => "#FA5654",
					"help" => "Button's normal instance background color."
				),
				
				//Background over color
				array(
					"label" => "Background Over Color",
					"id" => $id."background_over_color",
					"type" => "color_picker",
					"default" => "#222222",
					"help" => "Button's on mouse over instance background color."
				),
				
				//Border color
				array(
					"label" => "Border Color",
					"id" => $id."border_color",
					"type" => "color_picker",
					"default" => "#FA5654",
					"help" => "Button's normal instance border color."
				),
				
				//Border over color
				array(
					"label" => "Border Over Color",
					"id" => $id."border_over_color",
					"type" => "color_picker",
					"default" => "#222222",
					"help" => "Button's on mouse over instance border color."
				),
				
				//Background alpha
				array(
					"label" => "Background Alpha",
					"id" => $id."background_alpha",
					"type" => "percentage",
					"default" => "100",
					"help" => "Text block's normal instance background alpha(0-100)."
				),
				
				//Background alpha
				array(
					"label" => "Background Over Alpha",
					"id" => $id."background_over_alpha",
					"type" => "percentage",
					"default" => "100",
					"help" => "Text block's over instance background alpha(0-100)."
				)
			),
			
			//Font
			array(
				//Font family
				array(
					"label" => "Font Family",
					"id" => $id."font",
					"type" => "font_picker",
					"help" => "Choose the font to use for the text in this button, you can manage your fonts on the template options panel."
				),
				
				//Font size
				array(
					"label" => "Font Size (px.)",
					"id" => $id."font_size",
					"type" => "pixels",
					"default" => "13",
					"help" => "Font size in pixels for this button."
				),
			
				//Font color
				array(
					"label" => "Font Color",
					"id" => $id."font_color",
					"type" => "color_picker",
					"default" => "#ffffff",
					"help" => "Button's normal instance font color."
				),
				
				//Font over color
				array(
					"label" => "Font Over Color",
					"id" => $id."font_over_color",
					"type" => "color_picker",
					"default" => "#ffffff",
					"help" => "Button's on mouse over instance font color."
				)
			),
			
			//Tween
			array(
				//Tween duration
				array(
					"label" => "Tween Duration (sec.)",
					"id" => $id."tween_duration",
					"type" => "text",
					"default" => "0.2",
					"help" => "Tween duration in seconds between normal and on over instances."
				),
				
				//Tween type
				array(
					"label" => "Tween Type",
					"id" => $id."tween_type",
					"type" => "combobox",
					"options" => array("Linear", "Ease", "Ease In", "Ease Out", "Ease In&Out"),
					"values" => array("linear", "ease", "ease-in", "ease-out", "ease-in-out"),
					"default" => "ease-out",
					"help" => "Tween type for the transition between normal and on over instances."
				)
			),
			
			//Text
			array(
				array(
					"label" => "Button's Text",
					"id" => $id."text",
					"type" => "text",
					"default" => "Button [i]icon-double-angle-right[/i]",
					"help" => "Text you want for this button, you can include icon shortcodes on it."
				),
				array(
					"label" => "Text align",
					"id" => $id."text_align",
					"type" => "combobox",
					"options" => array("Left", "Center", "Right"),
					"values" => array("left", "center", "right"),
					"default" => "center",
					"help" => "The alignment you the button's text to have."
				)
			)

			
		);

		if($useLink){
			$tabs[] =  array(
							array(
								"label" => "Button Link",
								"id" => $id."link",
								"type" => "text",
								"default" => "#"
							),
							array(
								"label" => "Button Link Target",
								"id" => $id."button_target",
								"type" => "combobox",
								"options" => array("Same Tab", "New Tab"),
								"values" => array("_self", "_blank"),
								"default" => "_self",
								"help" => "Where you want the link to open."
							),
							array(
								"label" => "Button On Click (Javascript)",
								"id" => $id."onclick",
								"type" => "text",
								"default" => "",
								"info" => "Add a 'return false;' at the end of your code if you want to prevent the default action.",
								"alert" => "This is an advanced feature you don't have to put anything here if you want just a simple link button"
							)
						);

			$options[]= "Link";
		}
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value='<?php echo $value; ?>' style="display:none;"/>
        
        <div class="button_picker" id ="<?php echo $this->id; ?>_button_picker">
        	<div class="option_help">Your current button: </div>
        	<div>
        		<div class="button_holder" >
                	<a href="#" class="button_preview" id ="<?php echo $this->id; ?>_button">Example Text</a>
                </div>
                <a href="#" class="toogle_background">Toggle preview background color</a>
            </div>
        	<div>
            	<div class="option_help">Change the style of your button by setting properties below. You can save the button's style for later use or load a previously saved style:</div>
                
                <div class="wraper">
                	<div class="option_help">Load style: </div>
               		<div id="<?php echo $id; ?>_combobox"></div>
                </div>
                
                <div class="wraper">
                	<div class="option_help">Save style: </div>
                    <input type="text" value="" class="ui-textbox" id="<?php echo $id; ?>_save_style_name"/>
                    <a href="#" class="ui-button save_style_btn">Save</a>
                </div>
                
                <div class="wraper">
                	<a href="#" class="delete_style_btn">Delete current saved style</a>
                	<div class="saving_text loading-gif option_help" style="display: none;">Saving</div>
                </div>
            </div>
        </div>
        
        <?php
			new pq_tabs_unbinded($this->id."tabs_unb", $options, $tabs, "none");
		?>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "elements/Combobox", "utils/utils", "elements/ColorPicker"],
				function($, Combobox) {
					$(document).ready(function(){
						var $input = $("#<?php echo $id; ?>");
					
						var saveOptionPath = "<?php echo get_template_directory_uri(); ?>/plusquare_admin/php/save-option-ajax.php";
						var $saveInput = $("#<?php echo $id; ?>_save_style_name");
						var buttonsJson = <?php echo ($savedButtons != FALSE ? $savedButtons : '{"buttons":[]}'); ?>;
						var buttons = buttonsJson["buttons"];
						
						function addDefault(){
							buttons.push({"name": "default","field0": "20","field1": "10","field2": "0","field3": "0","field4": "#fa5654","field5": "#222222","field6": "#fa5654","field7": "#222222","field8": "100","field9": "100","field10": "Open_Sans:regular","field11": "13","field12": "#ffffff","field13": "#ffffff","field14": "0.2","field15": "ease-out","field16": "Button [i]icon-double-angle-right[/i]","field17": "center", "field18": "#", "field19": "_self", "field20": ""});
						}
						addDefault();
					
						var $buttonPicker = $("#<?php echo $this->id; ?>_button_picker");
						var $button = $("#<?php echo $this->id; ?>_button");
						
						var $saving = $buttonPicker.find(".saving_text");
						var $deleteBtn = $buttonPicker.find(".delete_style_btn");
						
						
						var $inputs = $("<?php
							$count = 0;
							foreach($tabs as $tab){
								foreach($tab as $option){
									if($count != 0)
										echo ",";
									echo "#".$option["id"]." ";
									$count++;
								}
							}
						?>");
						var numInputs = $inputs.length;
						
						
						//Make comboBox/////////////////////////////////
						var comboBox = new Combobox($("#<?php echo $id; ?>_combobox"), 0, [<?php
							echo "'default'";
							if($savedButtons != FALSE){
								foreach($savedButtonsDecoded->buttons as $button){ 
									echo ",";
									echo "'".$button->name."'";
									$count++;
								} 
							}
						?>], [<?php 
							echo "'default'";
							if($savedButtons != FALSE){
								foreach($savedButtonsDecoded->buttons as $button){ 
									echo ",";
									echo "'".$button->name."'";
									$count++;
								}
							}
						?>]);
						
						function getButtonByName(name){
							for(var i = 0; i < buttons.length; i++){
								if(	buttons[i]["name"] == name)
									return buttons[i];
							}
						}
						
						var changeByButton = function(button){
							//Change according to combobox
							for(var i = 0; i< numInputs; i++){
								if(WP_DEBUG)console.log(button['field'+i]);
								$inputs.eq(i).val( button['field'+i] );
								$inputs.eq(i).trigger("update");
								if(WP_DEBUG)console.log($inputs.eq(i).val());
							}
							
							update();
						}
						
						var onChange = function(){
							var value = comboBox.val();
							
							if(buttons.length > 0){
								var button = getButtonByName(value);
								
								changeByButton(button);
							}
							
							$saveInput.val(value);
						};
						$(comboBox).bind("change", onChange);
						////////////////////////////////////////////////////////////////
					
					
						function initialValues(){
							var value = $input.val();
							if(value == undefined || value == ""){
								update();
								value = $input.val();
							}
								
							
							var button = jQuery.parseJSON($input.val());
							if(WP_DEBUG)console.log(button);
							
							if(button != undefined && button != null && button != "null"){
								//if(WP_DEBUG)console.log(button);
								changeByButton(button);
							}
						}
						$input.bind("update", initialValues);
					
						/// PREVIEW UPDATE //////////////////////////////
						function update(){
							var overCSS = {
								//Border
								"border-color": $inputs.eq(7).val(),
								
								//Font
								"color": $inputs.eq(13).val()
							}
							
							var fontStr = $inputs.eq(10).val();
							var parts = fontStr.split(":");
							var font = parts[0];
							var weight = parts[1];
							
							if(weight == "regular")
								weight = 400;
							else if(weight == "bold")
								weight = 800;
							
							font = font.replace("_", " ");
							
							var normalCSS = {
								//Padding
								"padding": $inputs.eq(1).val()+"px "+$inputs.eq(0).val()+"px",
								
								//Border
								"border": $inputs.eq(2).val()+"px solid "+$inputs.eq(6).val(),
								
								//Round Corners
								"-webkit-border-radius" : $inputs.eq(3).val()+"px",
								"-moz-border-radius" : $inputs.eq(3).val()+"px",
								"-o-border-radius" : $inputs.eq(3).val()+"px",
								"border-radius" : $inputs.eq(3).val()+"px",
								
								//Font
								"font-family": "'"+font+"'",
								"font-weight": weight,
								"font-size": $inputs.eq(11).val()+"px",
								"color": $inputs.eq(12).val(),
								"line-height": "normal",
								"text-align": $inputs.eq(17).val()
							}
							
							$button.css(normalCSS);
							$button.processColorAndPattern($inputs.eq(4).val(), parseFloat($inputs.eq(8).val(), 10)/100.0);
							$button.addEaseAll($inputs.eq(14).val(), $inputs.eq(15).val(), ["border-color", "color", "background-color"]);
							$button.text($inputs.eq(16).val());
							
							$button.unbind("hover");
							$button.hover(
								function () {
									//Over
									$button.css(overCSS);
									$button.processColorAndPattern($inputs.eq(5).val(), parseFloat($inputs.eq(9).val(), 10)/100.0);
								},
								function () {
									//Out
									$button.css(normalCSS);
									$button.processColorAndPattern($inputs.eq(4).val(), parseFloat($inputs.eq(8).val(), 10)/100.0);
								}
							);

							$button.attr("data-background", $inputs.eq(4).val());
							$button.attr("data-background_alpha", $inputs.eq(8).val());
							$button.attr("data-background_over", $inputs.eq(5).val());
							$button.attr("data-background_alpha_over", $inputs.eq(9).val());
							
							$button.attr("data-color", $inputs.eq(12).val());
							$button.attr("data-color_over", $inputs.eq(13).val());
							$button.attr("data-border", $inputs.eq(6).val());
							$button.attr("data-border_over", $inputs.eq(7).val());
							$button.attr("data-tween_time", $inputs.eq(14).val());
							$button.attr("data-tween", $inputs.eq(15).val());

							//link
							$button.attr("href", $inputs.eq(18).val());
							$button.attr("target", $inputs.eq(19).val());
							$button.attr("onclick", $inputs.eq(20).val());
							
							//Parse values
							var value = new Object();
							for(var i = 0; i< numInputs; i++)
								value["field"+i] = $inputs.eq(i).val();

							var json = JSON.stringify(value);
							$input.val( json ).trigger("change");
							$button.attr("data-values", json);
						}
						



						if($input.val().length > 0)
							initialValues();
						else
							update();

						//update();
						$inputs.bind("change blur", update);
						
						
						
						//Remove style
						$deleteBtn.click(function(){
							var current = comboBox.val();
							
							if(current != "default" && !$saving.is(":visible")){
								//delete
								var value = new Object();
								value["buttons"] = new Array();
								
								$.each(
									buttons,
									function(index, button){
										if(button["name"] != "default" && button["name"] != current)
											value["buttons"].push(button);
									}
								);
								
								save(value, "default");
								
							}
							
							return false;
						});
						
						
						//SAVE STYLE
						function save(value, newValue){
							$saving.css("display", "inline");
							$.ajax({
								url: saveOptionPath,
								data: {
									"id": "pq_saved_buttons",
									"value": JSON.stringify(value)
								},
								success: function(data){
									$saving.css("display", "none");
									buttons = value["buttons"];
									addDefault();
									
									var names = new Array();
									$.each(
										buttons,
										function(index, button){
											names.push(button["name"]);
										}
									);
									
									comboBox.changeOptions(null, names, names, newValue);
									onChange();
								}
							});
						}
						
						function getButtonObj(name){
							var value = new Object();
							
							value["name"] = name;
							
							//Parse values
							for(var i = 0; i< numInputs; i++)
								value["field"+i] = $inputs.eq(i).val();
							
							return value;	
						}
						
						$buttonPicker.find("a.save_style_btn").click(function(){
							var name = $saveInput.val();
							
							if(name == "" || name == undefined || name == null || name == "default" || $saving.is(":visible")){
								//name not valid
								return false;
							}
							
							var value = new Object();
							value["buttons"] = new Array();
							
							//GET VALUE
							var overwriten = false;
							$.each(
								buttons,
								function(index, button){
									if(button["name"] != "default"){
										if(button["name"] == name){
											//Override	
											overwriten = true;
											var val = getButtonObj(name);
											value["buttons"].push(val);
										}
										else
											value["buttons"].push(button);
									}
								}
							);
							
							if(!overwriten){
								var val = getButtonObj(name);
								value["buttons"].push(val);
							}
							
							//Debug
							if(WP_DEBUG)console.log(value);

							//save
							save(value, name);
							
							return false;
						});
						
						
						
						
						
						//TOOGLE BACKGROUND
						var toogled = true;
						$buttonPicker.find("a.toogle_background").click(function(){
							if(toogled){
								$buttonPicker.find(".button_holder").css("background-color", "#222222");
								toogled = false;
							}
							else{
								$buttonPicker.find(".button_holder").css("background-color", "#ffffff");
								toogled = true;
							}
							
							return false;
						});
					});
					
					/////////////////////////////////////////////////
				}
			);
        </script>
        
		<?php
	}
}