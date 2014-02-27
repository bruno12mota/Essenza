<?php 

class pq_meta_box {
	
	var $meta_options;
	var $post_type = "post";
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare all purpose meta box 
	*
	*	@author Plusquare
	*	@date 19-12-12
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($meta_options, $post_type_option){

		//Save parameters
		$this->meta_options = $meta_options;
		$this->post_type_option = $post_type_option;
		
		//Add hooks
		add_action( 'admin_init', array($this, 'add_metabox'));
	}
	
	/*
	*  Add meta box
	*
	*  @description: Adds the metabox
	*  @created: 19/12/12
	*/
	
	function add_metabox() {
			
		//Hide editor
		add_action( 'admin_head-post-new.php', array($this, 'change_styles') );
		add_action( 'admin_head-post.php', array($this, 'change_styles') );

		add_meta_box( 'pq-metabox', 'Pq metabox' , array($this, 'make_metabox'), $this->post_type_option, 'normal', 'high' );
		add_action( 'save_post', array($this, 'save_metas'));
	}
	
	
	
	
	/*
	*  Change Styles
	*
	*  @description: Changes some css styles
	*  @created: 19/12/12
	*/
	
	function change_styles(){
		global $post_type;
		if(strcmp($post_type, $this->post_type_option) !== 0)
			return;
			
		//Media Uploader Scripts
		wp_enqueue_media();

		?>
        
		<style>
			#postdivrich, #postdivrich{display: none !important;}
			#pq-metabox h3, #pq-metabox .handlediv{display: none !important;}
			<?php if(strcmp($post_type, "sidebar") === 0) echo "#edit-slug-box, #minor-publishing{display:none}"; ?>
			#pq-metabox{
				background:transparent;
				border:none;
			}
        </style>
		
		<?php
	}
	
	
	
	
	
	/*
	*  Makes the metabox
	*
	*  @description: Makes the metabox that will hold all the options
	*  @created: 19/12/12
	*/
	
	function make_metabox() {
		global $post;
		
		foreach ( $this->meta_options as $option) {
			//Make option
			make_option($option);
		}
	}
	
	
	function save_meta($option){
		global $post;	
		
		if($option["type"] != NULL && $option["type"] != "page_builder" ){
			$value = $_POST[$option["id"]];
			
			if($option["type"] == "media_picker"){
				$value = $_POST[$option["id"]."_sizing"];
				update_post_meta( $post->ID, $option["id"]."_sizing", $value );
			}
		
			//Tabs
			if($option["type"] == "tabs"){
				$tab = $option["tabs"][ $value ];
				
				if($tab["id"] != NULL || $tab["label"] != NULL){
					//only one option
					$this->save_meta($tab);
				}
				else{
					//Multiple options
					foreach($tab as $tabOption)
						$this->save_meta($tabOption);
				}
			}

			if($option["type"] == "tabs_unbinded"){
				$tabs = $option["tabs"];
				foreach($tabs as $tab){
					foreach($tab as $tabOption){
						$this->save_meta($tabOption);
					}
				}
			}
			else{
				update_post_meta( $post->ID, $option["id"], $value );
			}
		}
	}
	
	/**
	 * Process the custom metabox fields
	 */
	function save_metas($post_id) {	
		global $post_type;
		
		if(strcmp($post_type, $this->post_type_option) !== 0)
			return;
		
		// Is the user allowed to edit the post or page?
		if ( !current_user_can( 'edit_post', $post_id ))
			return $post_id;
		
		if( $_POST ) {
			//Go through tabs
			foreach ( $this->meta_options as $option) 
				$this->save_meta($option);
		}
	}
}