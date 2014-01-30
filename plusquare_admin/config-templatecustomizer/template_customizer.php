<?php


/*
 *     Options
 */
require_once( get_template_directory() . '/plusquare_admin/config-templatecustomizer/php/options.php' );


/*
 *     Options
 */
require_once( get_template_directory() . '/plusquare_admin/config-templatecustomizer/php/less-process.php' );





//ADD MENU OPTION
add_action('admin_menu','plusquare_template_customizer');
function plusquare_template_customizer () {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( 'You do not have sufficient permissions to access this page.'  );
	}
	add_menu_page('Essenza Customizer', 'Essenza', 'manage_options', 'template_customizer', 'plusquare_template_customizer_init');
	
	//call register settings function
	add_action( 'admin_init', 'register_essenza_settings' );
}




/*
 *     Fired When Theme is Activated
 */
add_action("after_switch_theme", "plusquare_on_theme_activation", 10 ,  2);
function plusquare_on_theme_activation($oldname, $oldtheme=false) {
	global $plusquare_template_options;
	foreach($plusquare_template_options as $mainTab) {
		foreach ($mainTab['tabs'] as $tab) {
			//iterate tab options
			foreach ($tab['options'] as $option) {
				if($option["type"] == "tabs_unbinded"){
					foreach($option["tabs"] as $tabUnb){
						foreach($tabUnb as $tabUnbTab){
							$option = get_option($tabUnbTab["id"]);
							if($option === FALSE){
								add_option( $tabUnbTab["id"], $tabUnbTab["default"], '', (isset($tabUnbTab["less_var"]) && $tabUnbTab["less_var"] != true) ? "yes" : "no");
							}
						}
					}
				}
				else{
					$option = get_option($option["id"]);
					if($option === FALSE){
						add_option( $option["id"], $option["default"], '', (isset($option["less_var"]) && $option["less_var"] != true) ? "yes" : "no");
					}
				}
			}
		}
	}
}



/*
 *     Register Settings to be saved when saving page
 */
function register_essenza_settings(){
	global $plusquare_template_options;
	
	foreach($plusquare_template_options as $mainTab) {
		foreach ($mainTab['tabs'] as $tab) {
			//iterate tab options
			foreach ($tab['options'] as $option) {
				if($option["type"] == "tabs_unbinded"){
					foreach($option["tabs"] as $tabUnb){
						foreach($tabUnb as $tabUnbTab){
							register_setting( 'template_customizer_group', $tabUnbTab["id"] );
						}
					}
				}
				else{
					register_setting( 'template_customizer_group', $option["id"] );
				}
			}
		}
	}	
}



//HEADER
add_action('admin_head-toplevel_page_template_customizer', 'plusquare_template_customizer_header' );
function plusquare_template_customizer_header(){ 
	
	//Media Uploader Scripts
	wp_enqueue_media();
	
	echo '<link href="'.get_template_directory_uri().'/plusquare_admin/css/fonts/stylesheet.css" rel="stylesheet" type="text/css" />';
	echo '<link href="'.get_template_directory_uri().'/plusquare_admin/css/tc_styles.css" rel="stylesheet" type="text/css" />';
	echo '<link href="'.get_template_directory_uri().'/plusquare_admin/css/meta_options.css" rel="stylesheet" type="text/css" />';
	
	?>
	<script data-main="<?php echo get_template_directory_uri(); ?>/plusquare_admin/js/MetaBox" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/js/require-jquery.js"></script>
    <script src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/js/TemplateCustomizer.js"></script>
    <?php
}



//CONTENT
function plusquare_template_customizer_init(){
	//register_essenza_settings();
	include_once(get_template_directory() . '/plusquare_admin/php/pq_options.php');
	

	/*Check for update*/
	$updated = isset($_GET["settings-updated"]);
    if($updated === TRUE){
		update_option( "show_on_front", "page" );

		/*Update css*/
		require get_template_directory() . '/plusquare_admin/scripts/lessc.inc.php';
		$less = new lessc;
		
		try {
			//Get variables
			$vars = getLessVariables();
			fb::log("Parsing Css!");
    		$less->setFormatter("compressed");
			$less->setVariables($vars);
			$less->compileFile(dirname(realpath(__FILE__))."/../../css/main.less", dirname(realpath(__FILE__))."/../../css/main.css");
			$less->compileFile(dirname(realpath(__FILE__))."/../../css/components/text_styles/text_styles.less", dirname(realpath(__FILE__))."/../../css/text_styles.css");
		} catch (exception $e) {
		  	fb::log("fatal error compiling less: " . $e->getMessage());
		}
	}
	?>

	<!-- HTML CODE	-->
    <form id="tc_form" method="post" action="options.php">
		<?php settings_fields( 'template_customizer_group' ); ?>
        <div id="template_customizer">
         
            <!-- HEADER -->
            <div class="header">
                <img src="<?php echo get_template_directory_uri() ?>/plusquare_admin/images/logo_white.png"/>
              </div>
              
              
            <!-- INFO & SAVE -->
              <div class="info_save">
                <p>This page allows you to configure Essenza in an easy way. Click below to change any of the template's properties!</p>
                <a href="#" id="save_button">SAVE CHANGES <img src="<?php echo get_template_directory_uri() ?>/plusquare_admin/images/arrow.png"/></a>
              </div>
              
              <!-- WRAPER -->
              <div class="customizer_tabs_wraper">
                <!-- MENU -->
                <div class="menu">
                    <ul>
                        <?php
                            global $plusquare_template_options;
                            $count = 0;
                            foreach($plusquare_template_options as $mainTab) {
                                    echo '<li><a href="#" class="tc_button" onclick="return false;"><img src="'.$mainTab['icon'].'"/>'.$mainTab['name'].'</a>';
                                
                                //sub buttons
                                echo '<ul style="display:none;">';
                                foreach ($mainTab['tabs'] as $tab) {
                                    //tab
                                    echo '<li><a href="#" class="tc_sub_button" onclick="return false;" rel="'.$count.'">'.$tab['name'].'</a></li>';
                                    $count++;
                                }
                                echo '</ul>';
                            }
                        ?>
                    </ul>
                </div>
                   
                <!-- CONTENT -->
                <div class="contents">
                    <?php
                        global $plusquare_template_options;
                        foreach($plusquare_template_options as $mainTab) {
                            foreach ($mainTab['tabs'] as $tab) {
                                ?>
                                <div class="content" style="display: none;">
                                <?php
                                //iterate tab options
                                foreach ($tab['options'] as $option) {
                                    make_option($option, "option");
                                }
                                ?>
                                </div>
                                <?php
                            }
                        }
                    ?>
                </div>
              </div>
         </div>
    </form>
    <div id="saving_cover_tc" class="saving_cover" style="display: none;">
    	<div>
    		<p>Saving options <img src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/UI_Elements/loading.gif" /></p>
    	</div>
    </div>
    <script>
		require(["jquery"], function($){
			$(document).ready(function(){
				document.title = 'Template Customizer';

				//Tabs handling
				var $template_customizer = $("#template_customizer");
				
				$template_customizer.find(".menu >ul >li").each(function(index, $li){
					$li = $($li);
					var $button = $li.find(".tc_button");
					var $list = $li.find("ul");
					$button.click(function(){
						$list.slideToggle(200);
					});
				});
				
				
				
				
				var obj = {
					"esza_headlines_color": [
						"esza_h1_font_color",
						"esza_h2_font_color",
						"esza_h3_font_color",
						"esza_h4_font_color",
						"esza_h5_font_color",
						"esza_h6_font_color"
					],
					
					"esza_highlight_color":[
						"esza_span_font_color",
						"esza_a_font_color_over",
						"esza_blog_type_background_color",
						"esza_gallery_type_background_color",
						"esza_quote_block_background_color",
						"esza_form_fields_border_over_color",
						"esza_comment_author_color"
					],
					
					"esza_highlight_contrast_color":[
						"esza_blog_type_color",
						"esza_quote_block_text_color",
						"esza_tweet_block_text_color"
					],
					
					"esza_highlight_secondary_contrast_color":[
						"esza_quote_block_author_color",
						"esza_tweet_block_author_color"
					],
					
					"esza_dropcaps_background_color":[
						"esza_dropcap1_background_color",
						"esza_dropcap3_background_color"
					],
					
					"esza_dropcaps_font_color":[
						"esza_dropcap1_font_color",
						"esza_dropcap2_font_color",
						"esza_dropcap3_font_color"
					]
				};
				
				$.each(
					obj,
					function(index, arr){
						$("#"+index).bind("change", function(){
							var valueGer = $("#"+index).val();
							$.each(
								arr,
								function(index, value){
									$("#"+value).val(valueGer).trigger("update");
								}
							);
						});
					}
				);

				//FORM SUBMIT
				var $form = $("#tc_form");
				var $cover = $("#saving_cover_tc");
				$form.submit(function(){
					$cover.show();

					var objSend = $form.serialize();
					$.post( "options.php", objSend, function(data, textStatus){

						$cover.hide();
					});

					return false;
				});
			});
		});
	</script>

	<?php
}
