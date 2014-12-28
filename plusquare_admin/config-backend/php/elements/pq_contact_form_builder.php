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
			jQuery(document).ready(function($){
				var Backend = require("./Backend.js");
				var Lightbox = Backend.Lightbox;
				var OrderableList = Backend.ui.OrderableList;

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
							add_item(item["type"], item["label"], item["required"], item["combobox"]);
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
				function add_item(type, label, required, combobox){
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
							"required": required,
							"combobox": combobox
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
					var combobox = $("#pq_field_option_combobox").val();

					add_item(type, label, required, combobox);

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
					var combobox = $("#pq_field_option_combobox").val();

					//Change on array
					current_items[editing_id]["type"] = type;
					current_items[editing_id]["label"] = label;
					current_items[editing_id]["required"] = required;
					current_items[editing_id]["combobox"] = combobox;

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
			                'label': current_items[id]["label"],
			                'combobox': current_items[id]["combobox"]
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
			});
        </script>
        
		<?php
	}
}