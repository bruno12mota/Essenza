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
        <div id="<?php echo $id; ?>_orderable_list" class="orderable_list">

        </div>
        
        <script type="text/javascript">
        	//Make Combobox
			require(["jquery", "elements/OrderableList", "Lightbox/Lightbox"],
				function($, OrderableList, Lightbox) {
					$(document).ready(function(){
						var $input = $("#content");

						//Text
						//Name
						//Email
						//subject
						//textarea
						//-----checkbox
						//-----combobox

						var content = $("#content").val();

						//Current Value
						var current_items = [];

						if(content != ""){
							if(WP_DEBUG) console.log(content);
							current_items = $.parseJSON( content );
						}
					
						//Lightbox for the add/edit
						var lightbox = false;

						//Current Editing Element
						var editing_id = -1;

						//Make orderable list
						var orderable_list = new OrderableList("<?php echo $this->id; ?>_orderable_list");

						//Bind for edit button clicks
						$orderable_list = $("#<?php echo $this->id; ?>_orderable_list");
						$orderable_list.bind("edit_field", edit_item);
						$orderable_list.bind("itemRemoved", remove_item);
						$orderable_list.bind("itemChanged", switch_items);



						//other
						var initial = true;


						//Make initial building
						var initial_call = function(){
							$.each(
								current_items,
								function(index, item){
									add_item(item["type"], item["label"], item["required"]);
								}
							);

							initial = false;
							update_value();
						}
						initial_call();


						//Update input value
						function update_value(){
							$input.val( JSON.stringify(current_items) );
						}


						//Add Item Function
						function add_item(type, label, required){
							var icon = get_icon_by_type(type);

							var $item = $(	'<i class="'+icon+'" style="line-height: 50px; font-size: 16px; text-align: center; width: 20px;"></i>'+
						        			'<p class="title">'+label+'</p>'+
						        			'<a href="#" data-event="edit_field" onclick="return false;">Edit field</a>');
							orderable_list.addItem(null, $item, current_items.length);


							//Update value if not initial set
							if(!initial){
								current_items.push({
									"type": type,
									"label": label,
									"required": required
								});
								update_value();
							}
						}

						function get_icon_by_type(type){
							var icon = "";
							if(type == "text"){
								icon = "fa-font";
							}
							else if(type == "name"){
								icon = "fa-male";
							}
							else if(type == "email"){
								icon = "fa-envelope";
							}
							else if(type == "subject"){
								icon = "fa-info-circle";
							}
							else if(type == "textarea"){
								icon = "fa-align-left";
							}
							else if(type == "checkbox"){
								icon = "fa-check-square-o";
							}
							else if(type == "combobox"){
								icon = "fa-list";
							}

							return icon;
						}


						//ADD New Item
						function add_new_item(){
							//Get variables
							var type = $("#pq_field_option_type").val();
							var label = $("#pq_field_option_label").val();
							var required = $("#pq_field_option_required").val();

							add_item(type, label, required);

							//Close lightbox
							if(lightbox !== false)
        						lightbox.closeEdit();
						}


						//Switched 2 items position
						function switch_items(e, from, to){
							current_items[from] = current_items.splice(to, 1, current_items[from])[0];

							//Update input value
							update_value();
						}

						//On item Changed
						function change_item(){
							//Get variables
							var type = $("#pq_field_option_type").val();
							var label = $("#pq_field_option_label").val();
							var required = $("#pq_field_option_required").val();

							//Change on array
							current_items[editing_id]["type"] = type;
							current_items[editing_id]["label"] = label;
							current_items[editing_id]["required"] = required;

							//Change on list item
							orderable_list.changeTitle(null, editing_id, label);
							orderable_list.items[editing_id].find("i").attr("class", "").addClass( get_icon_by_type(type) );

							editing_id = -1;

							//Update input value
							update_value();

							//Close lightbox
							if(lightbox !== false)
        						lightbox.closeEdit();
						}



						//Edit Color
						function edit_item(e, id){
							editing_id = id;

							lightbox = new Lightbox("Edit Field", "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", change_item);

							//Make options
					        jQuery.post(
					            adminAjax,
					            {
					                'action' : 'pq_get_contact_field_options',
					                'type' : current_items[id]["type"],
					                'required': current_items[id]["required"],
					                'label': current_items[id]["label"]
					            },
					            $.proxy(function( response ) {
					                lightbox.addContent(response);
					            }, this)
					        );

							return false;
						}


						//Remove item
						function remove_item(e, id){
							current_items.splice(id, 1);

							//Update input value
							update_value();
						}




						//Add new color
						function add_new_field(){
							lightbox = new Lightbox("New Field", "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", add_new_item);

							//Make options
					        jQuery.post(
					            adminAjax,
					            {
					                'action' : 'pq_get_contact_field_options'
					            },
					            $.proxy(function( response ) {
					                lightbox.addContent(response);
					            }, this)
					        );

							return false;
						}
						$("#add_new_contact_field").click(add_new_field);







						/*var $formBuilder = $("#<?php echo $this->id; ?>_form_builder");
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
						}*/
					});
					
					/////////////////////////////////////////////////
				}
			);
        </script>
        
		<?php
	}
}