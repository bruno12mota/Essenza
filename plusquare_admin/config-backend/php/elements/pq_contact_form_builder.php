<?php 

class pq_contact_form_builder {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare form builder
	*
	*	@author Plusquare
	*	@date 18-03-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		?>
		<input id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>" type="text" value="<?php echo $value; ?>" style="display:none;"/>
        
        <div class="button_picker form_builder" id ="<?php echo $this->id; ?>_form_builder">
        	<div class="option_help">Your form fields: </div>
        	<div>
        		<div class="fields_main" >
                	<div class="fields_holder"></div>
                	<a href="#" class="add_field">Add contact field</a>
                </div>
            </div>
        	<div>
            	<div class="option_help">Change the options of the current selected contact field:</div>
                
                <div class="wraper" style="margin-top: 20px;">
                	<div class="option_help" style="width: 80px;">Field type: </div>
               		<div id="<?php echo $id; ?>_combobox"></div>
                </div>
                
                <div class="wraper">
                	<div class="option_help" style="width: 80px;">Label: </div>
                    <input type="text" value="" class="ui-textbox" id="<?php echo $id; ?>_label"/>
                </div>
                
                <div class="wraper">
                	<div class="option_help" style="width: 80px;">Required: </div>
               		<div id="<?php echo $id; ?>_checkbox" class="ui-checkbox" style="float: left;"></div>
                </div>
                <div class="wraper">
                	<a href="#" class="delete_style_btn" onclick="return false;">Delete current contact field</a>
                	<a href="#" class="field_up_button field_button" onclick="return false;"></a>
                	<a href="#" class="field_down_button field_button" onclick="return false;"></a>
                </div>
            </div>
        </div>
        
        <?php
			make_option(array(
				"id" => $this->id."_button_builder",
				"label" => "Submit Button",
				"type" => "button_picker",
				"link" => false
			));
		?>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "elements/Combobox", "elements/Checkbox", "utils/utils"],
				function($, Combobox, Checkbox) {
					$(document).ready(function(){
						var $input = $("#<?php echo $id; ?>");
					
						var $formBuilder = $("#<?php echo $this->id; ?>_form_builder");
						var $fields_holder = $formBuilder.find(".fields_holder");
						var $buttonBuilder = $("#<?php echo $this->id; ?>_button_builder");
						
						var $label = $("#<?php echo $this->id; ?>_label");
						//var $error = $("#<?php echo $this->id; ?>_error");
						
						//buttons
						var $fieldUp = $formBuilder.find(".field_up_button");
						var $fieldDown = $formBuilder.find(".field_down_button");
						var $deleteBtn = $formBuilder.find(".delete_style_btn");
						
						var fields = new Array();
						var currentField = 0;
						
						
						//Make comboBox/////////////////////////////////
						var type = new Combobox($("#<?php echo $id; ?>_combobox"), "text", ["Text", "Name", "Email", "Subject", "Textarea"], ["text", "name", "email", "subject", "textarea"]);
						
						//Make checkbox/////////////////////////////////
						var required = new Checkbox($("#<?php echo $id; ?>_checkbox"), "true", ["false", "true"]);
						
						
						//Save current field
						function saveField(){
							fields[currentField]["label"] = $label.val();
							fields[currentField]["field"].text(fields[currentField]["label"]);
							//fields[currentField]["error"] = $error.val();
							fields[currentField]["required"] = required.val();
							fields[currentField]["type"] = type.val();
							
							var inputValue = "";
							$.each(
								fields,
								function(index, fieldObj){
									inputValue += "[contact_field ";
									
									//Attr
									inputValue += 'type="'+fieldObj.type+'" ';
									inputValue += 'required="'+fieldObj.required+'" ';
									//inputValue += 'error="'+fieldObj.error+'"';
									
									//Content
									inputValue += "]"+fieldObj.label;
									
									inputValue += "[/contact_field]";
								}
							);
							
							//Add submit button
							inputValue += "[button text='submit']"+$buttonBuilder.val()+"[/button]";
							
							//Set main input value
							$input.val(inputValue);
						}
						$label.bind("change blur keyup", saveField);
						//$error.bind("change blur", saveField);
						$(required).bind("change", saveField);
						$(type).bind("change", saveField);
						$buttonBuilder.bind("change", saveField);
						
						
						
						//Change current field
						function changeField(number){
							var obj = fields[number];
							
							currentField = number;
							
							//Update fields
							$label.val(obj["label"]);
							//$error.val(obj["error"]);
							required.val(obj["required"]);
							type.val(obj["type"]);
							
							$fields_holder.find("*").removeClass("active");
							fields[number]["field"].addClass("active");
							
							//buttons
							if(number == 0)
								$fieldUp.addClass("disabled");
							else
								$fieldUp.removeClass("disabled");
							
							
							if(number == fields.length-1)
								$fieldDown.addClass("disabled");
							else
								$fieldDown.removeClass("disabled");
								
							
							saveField();
						}
						
						function moveFieldTo(position){
							var fieldObj = fields[currentField];
							var $field = fieldObj["field"];
							$field.remove();
							
							//remove from fields array
							fields.splice(currentField, 1);
							
							if(position === 0) 
								$fields_holder.prepend( $field );   
							else
								$(">a:nth-child(" + position + ")", $fields_holder).after( $field );
								
							//Add in ne position
							fields.splice(position, 0, fieldObj);
							
							//Field bind click
							$field.click(fieldClicked);
							
							//Update indexes
							$.each(
								fields,
								function(index, field){
									field["field"].attr("rel", index);
								}
							);
							
							changeField(position);
						}
						
						//Field Up
						$fieldUp.click(function(){
							if(currentField > 0){
								moveFieldTo(currentField-1);
							}
							return false;
						});
						
						//Field Down
						$fieldDown.click(function(){
							if(currentField < fields.length-1){
								moveFieldTo(currentField+1);
							}
							return false;
						});
						
						//Delete current
						$deleteBtn.click(function(){
							if(fields.length > 1){
								var fieldObj = fields[currentField];
								var $field = fieldObj["field"];
								$field.remove();
								
								//remove from fields array
								fields.splice(currentField, 1);
								
								//Update indexes
								$.each(
									fields,
									function(index, field){
										field["field"].attr("rel", index);
									}
								);
								
								if(currentField >= fields.length)
									 currentField = fields.length-1;
									 
								changeField(currentField);
							}
							
							return false;
						});
						
						
						//Add a new empty field
						function addNewField(){
							var newField = $('<a href="#" onclick="return false;" rel="'+fields.length+'">Label</a>').click(fieldClicked);
							$fields_holder.append(newField);
							
							fields.push({"field":newField, "type":"text", "required":"true", "label":"Label"});
							
							changeField(fields.length-1);
							
							return false;
						}
						
						function removeAll(){
							$fields_holder.empty();
							fields = new Array();
						}
						
						function initialValue(){
							var mainValue = $input.val();
							//tab
							var regexComponent = new RegExp("\\[contact_field.*?\\][\\s\\S]*?\\[\\/contact_field\\]", "gi");
							var matchedContactFields = mainValue.match(regexComponent);
							
							removeAll();
							if(matchedContactFields != null){
								$.each(
									matchedContactFields,
									function(ind, contactField){
										//get attributes		
										var regexFieldParameters = new RegExp("\\[contact_field.*?\\]", "gi");
                                		var matchedParametersStr = contactField.match(regexFieldParameters);
										
										if(matchedParametersStr == null){
											if(WP_DEBUG)console.log("Contact builder error");
											return;
										}
										matchedParametersStr = matchedParametersStr[0];
										
										
										//Type
										var regexPar = new RegExp('type=".*?"', "i");
										var typeStr = matchedParametersStr.match(regexPar);
										typeStr = typeStr[0];
										typeStr = typeStr.substring(6, typeStr.length-1);
										
										//Required
										regexPar = new RegExp('required=".*?"', "i");
										var requiredStr = matchedParametersStr.match(regexPar);
										requiredStr = requiredStr[0];
										requiredStr = requiredStr.substring(10, requiredStr.length-1);
										
										//Content
										var content = contactField.substring(matchedParametersStr.length, contactField.length-16);
										
										
										//Create field
										var newField = $('<a href="#" onclick="return false;" rel="'+fields.length+'">'+content+'</a>').click(fieldClicked);
										$fields_holder.append(newField);
										
										fields.push({"field":newField, "type":typeStr, "required":requiredStr, "label":content});
									}
								);
										
								changeField(0);
							}
							
							var regexButton = new RegExp("\\[button.*?\\][\\s\\S]*?\\[\\/button\\]", "gi");
							var matchedButton = mainValue.match(regexButton);
							
							if(matchedButton != null){
								matchedButton = matchedButton[0];	
								var regexButtonParameters = new RegExp("\\[button.*?\\]", "gi");
                                var matchedParametersStr = matchedButton.match(regexButtonParameters);
								matchedParametersStr = matchedParametersStr[0];
								
								var content = matchedButton.substring(matchedParametersStr.length, matchedButton.length-9);
								
								$buttonBuilder.val(content);
								$buttonBuilder.trigger("update");
							}
							
							if(fields.length == 0)
								addNewField();
						}
						$input.bind("update", initialValue);
						initialValue();
						$formBuilder.find(".add_field").click(addNewField);
						
						
						//Field Click
						function fieldClicked(){
							var rel = parseInt($(this).attr("rel"), 10);
							
							changeField(rel);
						}
					});
					
					/////////////////////////////////////////////////
				}
			);
        </script>
        
		<?php
	}
}