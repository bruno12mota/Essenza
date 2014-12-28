<?php 

class pq_text_block_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare button picker
	*
	*	@author Plusquare
	*	@date 28-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		$savedTextBlocks = get_option("pq_saved_text_blocks");
		
		if($savedTextBlocks != FALSE){
			$savedTextBlocks = stripslashes($savedTextBlocks);
			$savedTextBlocksDecoded = json_decode($savedTextBlocks);
		}
		
		$options = array("Sizing", "Colors", "Font", "Text");
		$tabs = array(
			//Sizing
			array(
				//Horizontal Padding	
				array(
					"label" => "Horizontal Padding (px.)",
					"id" => $id."hor_pad",
					"type" => "pixels",
					"default" => "20",
					"help" => "Padding on the left and right of the text block (Padding is the distance between the content and the end of the text block)."
				),
				
				//Vertical Padding	
				array(
					"label" => "Vertical Padding (px.)",
					"id" => $id."ver_pad",
					"type" => "pixels",
					"default" => "10",
					"help" => "Padding on the top and bottom of the text block (Padding is the distance between the content and the end of the text block)."
				),
				
				//Border Width
				array(
					"label" => "Border Size (px.)",
					"id" => $id."border_size",
					"type" => "pixels",
					"default" => "0",
					"help" => "Size in pixels of the border of the text block."
				),
				
				//Round corners
				array(
					"label" => "Round Corners (px.)",
					"id" => $id."border_size",
					"type" => "pixels",
					"default" => "0",
					"help" => "Size in pixels for the corners of the text block (0 equals to flat corners)."
				)
			),
			
			//Colors
			array(
				//Background color
				array(
					"label" => "Background Color",
					"id" => $id."background_color",
					"type" => "color_palette_picker",
					"default" => "#000000",
					"help" => "Text block's background color."
				),
				
				//Border color
				array(
					"label" => "Border Color",
					"id" => $id."border_color",
					"type" => "color_palette_picker",
					"default" => "#000000",
					"help" => "Text block's border color."
				),
				
				//Background alpha
				array(
					"label" => "Background Alpha",
					"id" => $id."background_alpha",
					"type" => "percentage",
					"default" => "50",
					"help" => "Text block's background alpha(0-100)."
				)
			),
			
			//Font
			array(
				//Font family
				array(
					"label" => "Font Family",
					"id" => $id."font",
					"type" => "font_picker",
					"help" => "Choose the font to use for the text in this text block, you can manage your fonts on the template options panel."
				),
				
				//Font size
				array(
					"label" => "Font Size (px.)",
					"id" => $id."font_size",
					"type" => "pixels",
					"default" => "13",
					"help" => "Font size in pixels for this text block."
				),
			
				//Font color
				array(
					"label" => "Font Color",
					"id" => $id."font_color",
					"type" => "color_palette_picker",
					"default" => "#ffffff",
					"help" => "Text block's font color."
				)
			),
			
			//Text
			array(
				array(
					"label" => "Text",
					"id" => $id."text",
					"type" => "text",
					"default" => "Default text",
					"help" => "Text you want for this text block, you can include icon shortcodes on it."
				),
				array(
					"label" => "Text align",
					"id" => $id."text_align",
					"type" => "combobox",
					"options" => array("Left", "Center", "Right"),
					"values" => array("left", "center", "right"),
					"default" => "center",
					"help" => "The alignment you want the text to have."
				),
				array(
					"label" => "Text Line Height",
					"id" => $id."line_height",
					"type" => "pixels",
					"default" => "13",
					"help" => "The text line's height."
				)
			)
		);
		
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value="<?php echo $value; ?>" style="display:none;"/>
        
        <div class="button_picker" id ="<?php echo $this->id; ?>_button_picker">
        	<div class="option_help">Your current text block: </div>
        	<div>
        		<div class="button_holder" >
                	<div class="button_preview" id ="<?php echo $this->id; ?>_button">Example Text</div>
                </div>
                <a href="#" class="toogle_background">Toogle preview background color</a>
            </div>
        	<div>
            	<div class="option_help">Change the style of your text block by setting properties below. You can save the text block's style for later use or load a previously saved style:</div>
                
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
			jQuery(document).ready(function($){
				var Backend = require("./Backend.js");
				var Combobox = Backend.ui.Combobox;

				var $input = $("#<?php echo $id; ?>");
					
				var saveOptionPath = "<?php echo get_template_directory_uri() ?>/plusquare_admin/config-backend/php/save-option-ajax.php";
				var $saveInput = $("#<?php echo $id; ?>_save_style_name");
				var buttonsJson = <?php echo ($savedTextBlocks != FALSE ? $savedTextBlocks : '{"buttons":[]}'); ?>;
				var buttons = buttonsJson["buttons"];
				
				function addDefault(){
					buttons.push({"name": "default","field0": "20","field1": "10","field2": "0","field3": "0","field4": "#000000","field5": "#000000","field6": "50","field7": "Open_Sans:regular","field8": "13","field9": "#ffffff", "field10": "Button [i]icon-double-angle-right[/i]", "field11": "center", "field12": "13"});
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
					if($savedTextBlocks != FALSE){
						foreach($savedTextBlocksDecoded->buttons as $button){ 
							echo ",";
							echo "'".$button->name."'";
							$count++;
						} 
					}
				?>], [<?php 
					echo "'default'";
					if($savedTextBlocks != FALSE){
						foreach($savedTextBlocksDecoded->buttons as $button){ 
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
						$inputs.eq(i).val( button['field'+i] );
						$inputs.eq(i).trigger("update");
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
					
					if(button != undefined && button != null && button != "null"){
						//if(WP_DEBUG)console.log(button);
						changeByButton(button);
					}
				}
				$input.bind("update", initialValues);
			
			
				/// PREVIEW UPDATE //////////////////////////////
				function update(){
					var fontStr = $inputs.eq(7).val();
					var parts = fontStr.split(":");
					var font = parts[0];
					var weight = parts[1];
					var style = "normal";
					
					if(weight == "regular")
						weight = 400;
					else if(weight == "bold")
						weight = 800;
					else{
						var weightNum = parseInt(weight, 10) || false;
						if(weightNum !== false){
							if(weight.length > 3){
								// there is a style attached
								style = weight.substring(3);
							}

							weight = weightNum;
						}
						else{
							style = weight;
							weight = 400;
						}
					}
					
					font = font.replace("_", " ");
					
					var normalCSS = {
						//Padding
						"padding": $inputs.eq(1).val()+"px "+$inputs.eq(0).val()+"px",
						
						//Border
						"border": $inputs.eq(2).val()+"px solid "+$inputs.eq(5).val(),
						
						//Round Corners
						"-webkit-border-radius" : $inputs.eq(3).val()+"px",
						"-moz-border-radius" : $inputs.eq(3).val()+"px",
						"-o-border-radius" : $inputs.eq(3).val()+"px",
						"border-radius" : $inputs.eq(3).val()+"px",
						
						//Font
						"font-family": "'"+font+"'",
						"font-weight": weight,
						"font-size": $inputs.eq(8).val()+"px",
						"font-style": style,
						"color": $inputs.eq(9).val(),
						"line-height": "normal",
						"text-align": $inputs.eq(11).val(),
						"line-height": $inputs.eq(12).val()+"px"

					}						
						
					$button.css(normalCSS);
					$button.processColorAndPattern($inputs.eq(4).val(), parseFloat($inputs.eq(6).val(), 10)/100);

					$button.text($inputs.eq(10).val());

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
							"id": "pq_saved_text_blocks",
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
        </script>
        <?php
	}
}
