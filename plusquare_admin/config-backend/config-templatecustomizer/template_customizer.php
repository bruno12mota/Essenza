<?php


/*
 *     Options
 */
require_once( 'php/options.php' );


/*
 *     Options
 */
require_once( 'php/less-process.php' );





//ADD MENU OPTION
add_action('admin_menu','plusquare_template_customizer');
function plusquare_template_customizer () {
	if ( current_user_can( 'manage_options' ) )  {
		add_menu_page('Essenza Customizer', 'Essenza', 'manage_options', 'template_customizer', 'plusquare_template_customizer_init');
		
		//call register settings function
		add_action( 'admin_init', 'register_essenza_settings' );
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



//CONTENT
function plusquare_template_customizer_init(){
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( 'You do not have sufficient permissions to access this page.'  );
	}

	/*Check for update*/
	$updated = isset($_GET["settings-updated"]);
    if($updated === TRUE){
		update_option( "show_on_front", "page" );

		/*Update css*/
		require_once( get_template_directory() . '/plusquare_admin/config-backend/scripts/lessc.inc.php' );
		$less = new lessc;
		
		try {
			chmod (dirname(realpath(__FILE__))."/../../../css", 0777);
			chmod (dirname(realpath(__FILE__))."/../../../css/main.css", 0777);
			chmod (dirname(realpath(__FILE__))."/../../../css/text_styles.css", 0777);
			
			//Get variables
			$vars = getLessVariables();
			if(WP_DEBUG)fb::log("Parsing Css!");

			$filename = dirname(realpath(__FILE__))."/../../../css/main.css";

    		$less->setFormatter("compressed");
			$less->setVariables($vars);
			$less->compileFile(dirname(realpath(__FILE__))."/../../../css/main.less", $filename);
			$less->compileFile(dirname(realpath(__FILE__))."/../../../css/components/text_styles/text_styles.less", dirname(realpath(__FILE__))."/../../../css/text_styles.css");
		} catch (exception $e) {
		  	if(WP_DEBUG)fb::log("fatal error compiling less: " . $e->getMessage());
		}
	}
	?>

	<!-- HTML CODE	-->
    <form id="tc_form" method="post" action="options.php">
		<?php settings_fields( 'template_customizer_group' ); ?>
        <div id="template_customizer">
         
            <!-- HEADER -->
            <div class="header">
            	<div class="shadow"></div>
            	<h1>Template Customizer</h1>
            	<div class="logo"></div>
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
				                    echo '<li><a href="#" class="tc_button" onclick="return false;"><i class="'.$mainTab['icon'].'"></i>'.$mainTab['name'].'</a>';
				                
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
					<div class="menu_back"><div></div></div>
				    <?php
				        global $plusquare_template_options;
				        foreach($plusquare_template_options as $mainTab) {
				        	if(isset($mainTab['tabs'])){
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
				        }
				    ?>
				</div>

				<div class="postboxs_holder">
				<div class="postbox ">
					<h3 class="hndle" style="line-height: 25px;">
						<span>Publish</span>
					</h3>
					<div class="inside">
						<div>
							<input id="publish" class="button button-primary button-large" type="submit" accesskey="p" value="Save Changes" name="publish">
						</div>
						<div class="clear"></div>
					</div>
				</div>
				<div class="postbox ">
					<h3 class="hndle" style="line-height: 25px;">
						<span>Useful Links</span>
					</h3>
					<div class="inside">
						<div>
							<a href="http://plusquare.ticksy.com" target="_blank" style="margin-bottom:5px;"><img src="<?php echo get_template_directory_uri() ?>/plusquare_admin/config-backend/images/template_customizer/side_banner_1.png"/></a>
							<a href="http://plusquare.pt/faq/essenza" target="_blank" style="margin-bottom:5px;"><img src="<?php echo get_template_directory_uri() ?>/plusquare_admin/config-backend/images/template_customizer/side_banner_2.png"/></a>
							<a href="http://plusquare.pt/changelog/essenza" target="_blank"><img src="<?php echo get_template_directory_uri() ?>/plusquare_admin/config-backend/images/template_customizer/side_banner_3.png"/></a>
						</div>
						<div class="clear"></div>
					</div>
				</div>
			</div>
		</div>
	</form>
	
	<div id="saving_cover_tc" class="saving_cover options_save" style="display: none;">
		<div>
			<p>Saving options <img src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/ui/loading.gif" /></p>
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
