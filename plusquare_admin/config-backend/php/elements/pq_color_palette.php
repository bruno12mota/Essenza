<?php 

class pq_color_palette {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare color palette
	*
	*	@author Plusquare
	*	@date 03-02-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		//Get unslashed value
		$unslashed_value = get_magic_quotes_gpc() ? stripslashes($value) : $value;

		//Check if empty
		$unslashed_value = $unslashed_value === "" || $unslashed_value === FALSE ? "[]" : $unslashed_value;

		if(WP_DEBUG)fb::log($unslashed_value);
		?>
        <input type="text" value="" id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>


        <div id="<?php echo $id; ?>_orderable_list" class="orderable_list">

        </div>
        
        <script type="text/javascript">
        	//Make checkbox
			require(["jquery", "ui/elements/OrderableList", "Lightbox/Lightbox"],
				function($, OrderableList, Lightbox) {
					$(document).ready(function(){
						//input 
						var $input = $("#<?php echo $id; ?>");

						//Current Value
						var current_items = <?php echo $unslashed_value; ?>;

						//Lightbox for the add/edit
						var lightbox = false;

						//Current Editing Element
						var editing_id = -1;

						//Make orderable list
						var orderable_list = new OrderableList("<?php echo $this->id; ?>_orderable_list", false);

						//Bind for edit button clicks
						$orderable_list = $("#<?php echo $this->id; ?>_orderable_list");
						$orderable_list.bind("edit_color", edit_item);
						$orderable_list.bind("itemRemoved", remove_item);

						//other
						var initial = true;


						//Make initial building
						var initial_call = function(){
							$.each(
								current_items,
								function(index, item){
									add_item(item["color"], item["title"]);
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
						function add_item(color, title){
							var $item = $(	'<div class="color" style="width:20px; height: 20px; background-color: '+color+'; margin-top: 15px;"></div>'+
						        			'<p class="title">'+title+'</p>'+
						        			'<a href="#" data-event="edit_color" onclick="return false;">Edit color</a>');
							orderable_list.addItem(null, $item, current_items.length);


							//Update value if not initial set
							if(!initial){
								current_items.push({
									"title": title,
									"color": color
								});
								update_value();
							}
						}


						//ADD New Item
						function add_new_item(){
							//Get variables
							var title = get_verified_title( $("#pq_color_option_title").val() );
							var color = $("#pq_color_option_color").val();

							add_item(color, title);

							//Close lightbox
							if(lightbox !== false)
        						lightbox.closeEdit();
						}


						//Verifies and input color title
						function get_verified_title(title){
							//If no title was provided
							if(title == ""){
								title = "Color "+(current_items.length+1);
							}

							//Check if title already exists
							var equal = false;
							var str = title;
							var number = 1;
							do{
								equal = false;
								for(var i = 0; i< current_items.length; i++){
									if(i != editing_id && current_items[i]["title"] === str){
										str = title + " ("+number+")";
										equal = true;
										number++;
										break;
									}
								}
							}while(equal);
							
							return str;
						}


						function change_item(){
							//Get variables
							var title = get_verified_title( $("#pq_color_option_title").val() );
							var color = $("#pq_color_option_color").val();

							//Change on array
							current_items[editing_id]["title"] = title;
							current_items[editing_id]["color"] = color;

							//Change on list item
							orderable_list.changeTitle(null, editing_id, title);
							orderable_list.items[editing_id].find(".color").css("background-color", color);

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

							lightbox = new Lightbox("Edit Color", "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", change_item);

							//Make options
					        jQuery.post(
					            adminAjax,
					            {
					                'action' : 'pq_get_color_options'
					            },
					            $.proxy(function( response ) {
					                lightbox.addContent(response);

					                $("#pq_color_option_title").val( current_items[id]["title"] );
					                $("#pq_color_option_color").val( current_items[id]["color"] ).trigger("update");

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
						function add_new_color(){
							lightbox = new Lightbox("New Color", "<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/", add_new_item);

							//Make options
					        jQuery.post(
					            adminAjax,
					            {
					                'action' : 'pq_get_color_options'
					            },
					            $.proxy(function( response ) {
					                lightbox.addContent(response);
					            }, this)
					        );

							return false;
						}
						$("#add_new_color_to_palette").click(add_new_color);
					});
				}
			);
		</script>
        <?php
	}
	
	
}