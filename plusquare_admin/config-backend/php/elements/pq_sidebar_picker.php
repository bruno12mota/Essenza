<?php 

class pq_sidebar_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare sidebar picker
	*
	*	@author Plusquare
	*	@date 11-03-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		global $essenza_shortcodes_options;
		//delete_option("pq_saved_sidebars");
		$savedSidebars = get_option("pq_saved_sidebars");
		
		if($savedSidebars != FALSE){
			$savedSidebars = get_magic_quotes_gpc() ? stripslashes($savedSidebars) : $savedSidebars;
			$savedSidebarsDecoded = json_decode( $savedSidebars );
		}
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value="<?php echo htmlentities($value); ?>" style="display:none;"/>
        
        <div class="sidebar_picker" id ="<?php echo $this->id; ?>_sidebar_picker">
        	<div class="option_help">Your current sidebar: </div>
        	<div class="page_builder">
            	<div class="menu_holder"></div>
        		<div class="placeholders_holder" >
                </div>
            </div>
        	<div>
            	<div class="option_help">Drag Components into the Placeholder, once placed you can drag it to change it's position. You can save the sidebar for later use or load a previously saved one:</div>
                
                <div class="wraper">
                	<div class="option_help">Load sidebar: </div>
               		<div id="<?php echo $id; ?>_combobox"></div>
                </div>
                
                <div class="wraper">
                	<div class="option_help">Save sidebar: </div>
                    <input type="text" value="" class="ui-textbox" id="<?php echo $id; ?>_save_style_name"/>
                    <a href="#" class="ui-button save_style_btn">Save</a>
                </div>
                
                <div class="wraper">
                	<a href="#" class="delete_style_btn">Delete current saved sidebar</a>
                	<div class="saving_text loading-gif option_help" style="display: none;">Saving</div>
                </div>
            </div>
        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "StackBuilder", "elements/Combobox", "utils/utils"],
				function($, StackBuilder, Combobox) {
					$(document).ready(function(){
					
						var saveOptionPath = "<?php echo get_template_directory_uri() ?>/plusquare_admin/php/save-option-ajax.php";
						var $saveInput = $("#<?php echo $id; ?>_save_style_name");

						var sidebarsJson = <?php echo ($savedSidebars != FALSE ? $savedSidebars : '{"sidebars":[]}'); ?>;
						var sidebars = sidebarsJson["sidebars"];
					
						var $sidebarsPicker = $("#<?php echo $this->id; ?>_sidebar_picker");
						var $button = $("#<?php echo $this->id; ?>_button");
						
						var $saving = $sidebarsPicker.find(".saving_text");
						var $deleteBtn = $sidebarsPicker.find(".delete_style_btn");
						
						var $input = $("#<?php echo $this->id; ?>");
						
						function addDefault(){
							sidebars.push({"name": "empty", "value": ""});
						}
						addDefault();
						
						//Make stack builder
						var stackBuilder = new StackBuilder($input, $sidebarsPicker.find(".placeholders_holder"), $sidebarsPicker.find(".menu_holder"), false, "<?php echo get_template_directory_uri(); ?>/plusquare_admin/", <?php echo stripslashes (json_encode($essenza_shortcodes_options)); ?>);
						
						
						
						//Make comboBox/////////////////////////////////
						<?php
							$str = "'empty'";
							if($savedSidebars != FALSE){
								$count = 0;
								foreach($savedSidebarsDecoded->sidebars as $sidebar){ 
									$str .= ",";
									$str .= "'".$sidebar->name."'";
									$count++;
								} 
							}
						?>
						var comboBox = new Combobox($("#<?php echo $id; ?>_combobox"), 0, [<?php echo $str; ?>], [<?php echo $str; ?>]);


						//initial combobox value
						var val = $input.val();
						if(val != '[row][column size="12" offset="0"] [/column][/row]')
							for(var i = 0; i < sidebars.length; i++)
								if(sidebars[i].value == val){
									comboBox.val(sidebars[i].name);
									$saveInput.val(sidebars[i].name);
								}
						
						
						//Get sidebar by name
						function getSidebarByName(name){
							for(var i = 0; i < sidebars.length; i++){
								if(	sidebars[i]["name"] == name)
									return sidebars[i];
							}
						}
						
						//On combobox change
						var onChange = function(){
							var value = comboBox.val();
							
							if(sidebars.length > 0){
								var sidebar = getSidebarByName(value);
								
								//Change according to combobox
								$input.val( sidebar['value'] );
							}
							
							update();
							$saveInput.val(value);
						};
						//onChange();
						$(comboBox).bind("change", onChange);
						
						
						//Update from current input value
						function update(){
							stackBuilder.fromHtml();
						}
						
						
						
						//Remove sidebar
						$deleteBtn.click(function(){
							var current = comboBox.val();
							
							if(current != "empty" && !$saving.is(":visible")){
								//delete
								var value = new Object();
								value["sidebars"] = new Array();
								
								$.each(
									sidebars,
									function(index, sidebar){
										if(sidebar["name"] != "empty" && sidebar["name"] != current)
											value["sidebars"].push(sidebar);
									}
								);
								
								//Save
								save(value, "empty");
								
							}
							
							return false;
						});
						
						
						//SAVE SIDEBAR
						function save(value, newValue){
							$saving.css("display", "inline");
							$.ajax({
								url: saveOptionPath,
								data: {
									"id": "pq_saved_sidebars",
									"value": JSON.stringify(value)
								},
								success: function(data){
									$saving.css("display", "none");
									sidebars = value["sidebars"];
									addDefault();
									
									var names = new Array();
									$.each(
										sidebars,
										function(index, sidebar){
											names.push(sidebar["name"]);
										}
									);
									
									comboBox.changeOptions(null, names, names, newValue);
									onChange();
								}
							});
						}
						
						function getSidebarObj(name){
							var value = new Object();
							
							value["name"] = name;
							value["value"] = $input.val();
							
							return value;	
						}
						
						
						$sidebarsPicker.find("a.save_style_btn").click(function(){
							var name = $saveInput.val();
							
							if(name == "" || name == undefined || name == null || name == "empty" || $saving.is(":visible")){
								//name not valid
								return false;
							}
							
							var value = new Object();
							value["sidebars"] = new Array();
							
							//GET VALUE
							var overwriten = false;
							$.each(
								sidebars,
								function(index, sidebar){
									if(sidebar["name"] != "empty"){
										if(sidebar["name"] == name){
											//Override	
											overwriten = true;
											var val = getSidebarObj(name);
											value["sidebars"].push(val);
										}
										else
											value["sidebars"].push(sidebar);
									}
								}
							);
							
							if(!overwriten){
								var val = getSidebarObj(name);
								value["sidebars"].push(val);
							}
							
							//Debug
							console.log(value);
							
							//save
							save(value, name);
							
							return false;
						});
						
					});
				}
			);
        </script>
        
		<?php
	}
}