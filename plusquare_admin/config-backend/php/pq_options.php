<?php

		
//elements
foreach (glob(get_theme_root()."/essenza/plusquare_admin/config-backend/php/elements/*.php") as $filename)
{
    include_once $filename;
}





/*
*  Makes an option
*
*  @description: Makes the fields for an option with label and help
*  @created: 19/12/12
*/

function make_option($option, $typeOption = "post_meta", $init_value = NULL){
    
    $hidden = isset($option["hidden"]) ? "display: none;" : "";
    $type = isset($option["type"]) ? $option["type"] : "";
    
    ?>
	<div id="<?php echo $option["id"]; ?>_option_main_holder" class="option_main_holder">
    <?php

    //LABEL
    if(isset($option["label"])){


        ?>
        <h2 class="option_label" style="<?php echo $hidden; ?>">
            <?php echo $option["label"]; ?>
            <?php
                if($type == "color_palette"){
                    ?>
                    <a href="#" id="add_new_color_to_palette">Add new color</a>
                    <?php
                }
                else if($type == "text_formats"){
                    ?>
                    <a href="#" id="add_new_style_to_palette">Add new style</a>
                    <?php
                }
                else if($type == "contact_form_builder"){
                    ?>
                    <a href="#" id="add_new_contact_field">Add new field</a>
                    <?php
                }
            ?>
        </h2>
        <?php
    }
    
    
    //Open option holder
    
    //OPTION
	
    ?>
    <div class="option_holder" style=" <?php echo ($type=='page_builder' || $type=='sidebar_builder' || $type=='contact_form_builder' || $type=='tabs_unbinded')  ? 'overflow:visible;' : ''; ?><?php echo $hidden; ?>">
    
    <?php
    //INFO
    if(isset($option["info"])){
        ?>
        <div class="ui_info">
            <div class="ui_info_text">
                <?php echo $option["info"]; ?>
            </div>
        </div>
        <?php
    }
	
	//ALERT
    if(isset($option["alert"])){
        ?>
        <div class="ui_alert">
            <div class="ui_alert_text">
                <?php echo $option["alert"]; ?>
            </div>
        </div>
        <?php
    }
    
    ?>
    <div class="meta_option<?php echo (($type == "page_builder" || $type == "import_dummy" || $type == "pages_posts_picker" || $type == "orderable_list" || $type == "color_palette" || $type == "contact_form_builder" || $type == "contact_form_picker" || $type == "button_picker" || $type == "tabbing_builder" || $type == "accordion_builder" || $type == "sidebar_picker" || $type == "slide_element" || $type == "text_block_picker" || $type == "tabs" || $type == "ken_burns" || $type == "rich_editor" || $type == "slider_builder" || $type == "tabs_unbinded" || $type == "media_picker" || $type == "google_fonts_picker") ? "_full" : ""); ?>">
    <?php
    
    $value = "";
    if($type == ""){
        $value = "";
    }
    else if($typeOption == "option"){
		$value = get_option($option["id"], isset($option["default"]) ? $option["default"] : "");
	}
	else if($typeOption == "post_meta"){
    	global $post;

        if(isset($post))
    	   $value = get_post_meta( $post->ID, $option["id"], true );
	}
	else{
		//By parameter
		$value = $init_value;
	}
    
		

    if( $value === FALSE || $value === NULL || $value === ""){
        $value = isset($option["default"]) ? $option["default"] : "";
    }
    
    
    //Text input types
    if($type == "percentage"){
        new pq_text($option["id"], $value);
        ?>
        <div class="ui-label noMin">(%)</div>
        <?php
    }
    else if($type == "pixels"){
        new pq_text($option["id"], $value);
		?>
        <div class="ui-label noMin">(px)</div>
        <?php
	}
    else if($type == "text" || $type == "url")
        new pq_text($option["id"], $value);
    
    //Text area
    else if($type == "text_area")
        new pq_text_area($option["id"], $value);
    
    //Rich text editor
    else if($type == "text_editor")
        new pq_rich_editor($option["id"], $value);
    
    //Rich text editor
    else if($type == "rich_editor")
        new pq_rich_editor($option["id"], $value, true);
		
    //Input file
    else if($type == "file")
        new pq_file($option["id"], $value);
    
    //Media picker type
    else if($type == "media_picker"){
		if(isset($option["sizing"]))
        	$sizing = get_post_meta( $post->ID, $option["id"]."_sizing", true );
		else
			$sizing = false;
        new pq_media_multiple_picker($option["id"], $value, $sizing, isset($option["media_type"])?$option["media_type"]:"image");
    }
    
    //Media picker type
    else if($type == "media_single_picker")
        new pq_media_single_picker($option["id"], $option["width"], $option["height"], $value);
    
	//Video picker
	else if($type == "video_picker")
        new pq_video_picker($option["id"], $value);
		
	//Slider picker
	else if($type == "slider_picker")
        new pq_slider_picker($option["id"], $value);
		
	//Sound picker
	else if($type == "sound_picker")
        new pq_sound_picker($option["id"], $value);
		
	else if($type == "category_picker")
		new pq_category_picker($option["id"], $value, $option["taxonomy"]);
	
    //Page builder
    else if($type == "page_builder")
        new pq_page_builder($option["id"]);
        
    //Slider builder
    else if($type == "slider_builder")
        new pq_slider_builder($option["id"]);
        
    //Combobox
    else if($type == "combobox")
        new pq_combobox($option["id"], $option["options"], $option["values"], $value);
		
    //Checkbox
    else if($type == "checkbox"){
        if(!isset($option["values"]))
            $option["values"] = array("false", "true");
        new pq_checkbox($option["id"], $value, $option["values"]);
    }
		
    //Color Picker
    else if($type == "color_picker"){
        new pq_color_picker($option["id"], $value);
    }
    else if($type == "color_palette"){
        new pq_color_palette($option["id"], $value);
    }
    else if($type == "color_palette_picker"){
        new pq_color_palette_picker($option["id"], $value);
    }
		
    //Button Picker
    else if($type == "button_picker")
        new pq_button_picker($option["id"], $value, array_key_exists("link" , $option) ? $option["link"] : true);
		
    //Slider Picker
    else if($type == "sidebar_picker")
        new pq_sidebar_picker($option["id"], $value);
        
    //Slider Builder
    else if($type == "sidebar_builder")
        new pq_sidebar_builder($option["id"], $value);
		
    //Text Block Picker
    else if($type == "text_block_picker")
        new pq_text_block_picker($option["id"], $value);
		
	//Tabs builder
	else if($type == "tabbing_builder")
        new pq_tabbing_builder($option["id"], $value);
		
	//Accordion builder
	else if($type == "accordion_builder")
        new pq_accordion_builder($option["id"], $value);
		
	//Contact form builder
	else if($type == "contact_form_builder")
        new pq_contact_form_builder($option["id"], $value);
        
    //Contact form picker
    else if($type == "contact_form_picker")
        new pq_contact_form_picker($option["id"], $value);
		
    //Kenburns
    else if($type == "ken_burns")
        new pq_ken_burns($option["id"], $value, isset($option["noRatio"]) ? $option["noRatio"] : false);
        
	//Tabs
    else if($type == "tabs")
        new pq_tabs($option["id"], $option["options"], $option["values"], $option["tabs"], $value, $typeOption);
        
	//Tabs
    else if($type == "tabs_unbinded")
        new pq_tabs_unbinded($option["id"], $option["options"], $option["tabs"], $typeOption);
		
    //Google fonts picker
	else if($type == "google_fonts_picker")
		new pq_fonts_picker($option["id"], $value);
		
	else if($type == "font_picker")
        new pq_font_picker($option["id"], $value);
		
	else if($type == "slide_element")
		new pq_slide_element($option["id"]);
		
	else if($type == "snap_to")
		new pq_snap_to($option["id"], $value);
        
    else if($type == "orderable_list")
        new pq_orderable_list($option["id"], $value);

    else if($type == "import_dummy")
        new pq_import_dummy();

    else if($type == "frontpage_picker")
        new pq_frontpage_picker($option["id"], $value);

    else if($type == "pages_posts_picker")
        new pq_pages_posts_picker($option["id"], $value);
	
    ?>
    </div>
    <?php
    
    
    
    //HELP
    if(isset($option["help"]) && $option["help"] != NULL){
        ?>
        <div class="option_help">
            <?php echo $option["help"]; ?>
        </div>
        <?php
    }
    
    //Close option holder
    ?>
    </div>
    </div>
    <?php
}