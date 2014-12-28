<?php 

class pq_combobox_options {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare combobox options
	*
	*	@author Plusquare
	*	@date 11-03-14
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		?>
		<input id="<?php echo $id; ?>" style="display:none"/>

		<div style="margin-bottom:20px;">
			<input id="<?php echo $id; ?>_new" class="ui-textbox for-text" type="text" style="height: 30px; margin-right: 15px;"/>
			<a id="<?php echo $id; ?>_new_button" href="#" onclick="return false;" class="button button-primary button-large">Add new option</a>
		</div>

        <div id="<?php echo $id; ?>_orderable_list" class="orderable_list">

        </div>
        
        <script type="text/javascript">
			jQuery(document).ready(function($){
				var Backend = require("./Backend.js");
				var OrderableList = Backend.ui.OrderableList;

				var $input = $("#<?php echo $id; ?>");
				var content = '<?php echo $value; ?>';

				var $new_input = $("#<?php echo $id; ?>_new");

				//Current Value
				var current_items = [];

				if(content != ""){
					if(WP_DEBUG) console.log(content);
					current_items = $.parseJSON( content );
				}

				//Current Editing Element
				var editing_id = -1;

				//Make orderable list
				var orderable_list = new OrderableList("<?php echo $this->id; ?>_orderable_list");

				//Bind for edit button clicks
				$orderable_list = $("#<?php echo $this->id; ?>_orderable_list");
				$orderable_list.bind("itemRemoved", remove_item);
				$orderable_list.bind("itemChanged", switch_items);


				//other
				var initial = true;


				//Make initial building
				var initial_call = function(){
					$.each(
						current_items,
						function(index, item){
							add_item(item);
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
				function add_item(label){
					var $item = $(	'<p class="title">'+label+'</p>' );
					orderable_list.addItem(null, $item, current_items.length);


					//Update value if not initial set
					if(!initial){
						current_items.push(label);
						update_value();
					}
				}


				//ADD New Item
				function add_new_item(){
					//Get variables
					var label = $new_input.val();

					if(label != ""){
						label = label.replace("'", "&#39;");
						label = label.replace('"', "&#34;");
						add_item(label);
						$new_input.val("");
					}
				}
				$("#<?php echo $id; ?>_new_button").click(add_new_item);


				//Switched 2 items position
				function switch_items(e, from, to){
					current_items[from] = current_items.splice(to, 1, current_items[from])[0];

					//Update input value
					update_value();
				}


				//Remove item
				function remove_item(e, id){
					current_items.splice(id, 1);

					//Update input value
					update_value();
				}


			});
        </script>
        
		<?php
	}
}