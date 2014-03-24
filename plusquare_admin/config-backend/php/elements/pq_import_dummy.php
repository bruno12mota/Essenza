<?php

class pq_import_dummy {
	function __construct(){
		$zip_archive_enabled = class_exists('ZipArchive');
		$curl_enabled = function_exists('curl_version');
		if($zip_archive_enabled && $curl_enabled){
			?>
			<div style="border-bottom: 1px solid #EEEEEE; padding-bottom: 15px;overflow: hidden;">
				<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/creative_thumb.jpg" width="300" height="223"/>
				<h1 style="padding-top: 35px;">Creative Demo</h1>
				<p>Showing most of Essenza's extensive list of beautiful features! The original design!</p>
				<a data-folder="creative" class="button button-primary button-large import_button dummy_btn" href="#" style="">Import Demo</a>
				<a data-folder="creative" class="button button-primary button-large import_button options_btn" href="#" style="">Import Options</a>
			</div>

			<div style="clear:both;border-bottom: 1px solid #EEEEEE; padding-bottom: 15px; padding-top: 15px;overflow: hidden;">
				<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/minimal_thumb.jpg" width="300" height="223"/>
				<h1 style="padding-top: 35px;">Minimal Demo</h1>
				<p>No submenus, no nonsense! Just a quick header and quick content!</p>
				<a data-folder="minimal" class="button button-primary button-large import_button dummy_btn" href="#" style="">Import Demo</a>
				<a data-folder="minimal" class="button button-primary button-large import_button options_btn" href="#" style="">Import Options</a>
			</div>

			<div style="clear:both;border-bottom: 1px solid #EEEEEE; padding-bottom: 15px; padding-top: 15px;overflow: hidden;">
				<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/corporate_thumb.jpg" width="300" height="223"/>
				<h1 style="padding-top: 35px;">Corporate Demo</h1>
				<p>Essenza V2 is live, and to show off all new features, we created this beautiful demo!</p>
				<a data-folder="corporate" class="button button-primary button-large import_button dummy_btn" href="#" style="">Import Demo</a>
				<a data-folder="corporate" class="button button-primary button-large import_button options_btn" href="#" style="">Import Options</a>
			</div>

			<div style="clear:both; padding-bottom: 15px; padding-top: 15px;overflow: hidden;">
				<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/personal_thumb.jpg" width="300" height="223"/>
				<h1 style="padding-top: 35px;">Personal Demo</h1>
				<p>A clean and crisp demo that does exactly what is needed: focus on your portfolio!</p>
				<a data-folder="personal" class="button button-primary button-large import_button dummy_btn" href="#" style="">Import Demo</a>
				<a data-folder="personal" class="button button-primary button-large import_button options_btn" href="#" style="">Import Options</a>
			</div>

			<div id="loading_dummy_cover" class="saving_cover" style="display: none;">
				<div>
			    	<div id="dummy_progress" class="ui_progress">
			    		<div class="progress"></div>
			    		<p><span id="loading_label"></span></p>
			    	</div>
			    	<div id="dummy_confirm">
						<div class="ui_alert">
				            <div class="ui_alert_text">Importing dummy content will remove every post, page, image, comment and option you have till now, your site will be a replica of the preview altough some images might have been switched because of licensing issues. <b>Make sure this is what you want, as it doesn't have undo</b>!</div>
				        </div>

				        <div style="clear:both;">
				        	<a id="confirm_continue" class="button button-primary button-large" href="#">Continue</a>
							<a id="confirm_cancel" class="button button-primary button-large" href="#">Cancel</a>
				        </div>
				    </div>
			    </div>
		    </div>

			<script type="text/javascript">
				//<img src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/ui/loading.gif" />
				require(["jquery"], function($) {

					$(document).ready(function(){
						var $cover = $("#loading_dummy_cover");
						var $holder = $cover.find(">div");
						var $loadingLabel = $("#loading_label");

						var $dummy_progress = $("#dummy_progress");
						var $dummy_confirm = $("#dummy_confirm");

						var $confirm_continue = $("#confirm_continue");
						var $confirm_cancel = $("#confirm_cancel");

						var folder = "";

						var $progressBar = $(".ui_progress .progress");
						var prog_inc = 0;
						var prog_total = 0;


						function updatePermalinks(){
							prog_inc = prog_inc+prog_total*100;
							prog_total = 0.05;
							$loadingLabel.text("Updating permalinks");

							jQuery.post(
								adminAjax,
								{
									'action' : 'pq_import_dummy_perma'
								},
								function( response ) {
									window.progressOptions(100);
									$cover.find("img").hide();
									$loadingLabel.text("Loaded successful (page will now refresh)!");
									location.reload();
								}
							);
						}

						function loadCss(){
							prog_inc = prog_inc+prog_total*100;
							prog_total = 0.05;
							$loadingLabel.text("Uploading css");

							jQuery.post(
								adminAjax,
								{
									'action' : 'pq_import_dummy_css',
									'folder'	: folder
								},
								function( response ) {
									window.progressOptions(100);
									//Load images
									updatePermalinks();
								}
							);
						}

						window.loadOptions = function(){
							prog_inc = prog_inc+prog_total*100;
							prog_total = 0.05;

							$dummy_progress.show();
							$dummy_confirm.hide();

							$loadingLabel.text("Loading Options");
							$cover.show();

							jQuery.post(
								adminAjax,
								{
									'action' : 'pq_import_options',
									'folder'	: folder
								},
								function( response ) {
									window.progressOptions(100);
									//Load images
									loadCss();
								}
							);
						}

						window.progressOptions = function(perc){
							$progressBar.css("width", prog_inc+perc*prog_total+"%");
						}

						function loadImages(){
							prog_inc = prog_inc+prog_total*100;
							prog_total = 0.80;
							$loadingLabel.text("Uploading media");

							console.log(adminAjax);

							$iframe = $("<iframe style='display:none;' src='../wp-content/themes/essenza/plusquare_admin/config-backend/php/import.php?folder="+folder+"'></iframe>").appendTo($holder);

						}

						function loadSql(){
							prog_inc = 0;
							prog_total = 0.05;

							$dummy_progress.show();
							$dummy_confirm.hide();

							$loadingLabel.text("Running sql");

							jQuery.post(
								adminAjax,
								{
									'action' : 'pq_import_dummy',
									'folder'	: folder
								},
								function( response ) {
									window.progressOptions(100);

									//Load images
									loadImages();
								}
							);

						}

						function cancel_import(){
							$cover.hide();

							$confirm_continue.unbind("click");
							$confirm_cancel.unbind("click");
						}

						function import_dummy_content(){

							$dummy_progress.hide();
							$dummy_confirm.show();

							$confirm_continue.click(loadSql);
							$confirm_cancel.click(cancel_import);

							$cover.show();
						}

						function import_options(){
							$dummy_progress = $("#dummy_progress");
							$dummy_confirm = $("#dummy_confirm");

							$confirm_continue.click(loadOptions);
							$confirm_cancel.click(cancel_import);
							
							$cover.show();
						}

						$(".import_button.dummy_btn").click(function(){
							folder = $(this).data("folder");

							import_dummy_content();

							return false;
						});

						$(".import_button.options_btn").click(function(){
							folder = $(this).data("folder");

							import_options();

							return false;
						});

					});

				});
			</script>
			<?php
		}
		else{
			if(!$zip_archive_enabled){
				?>
				<div class="ui_alert">
		            <div class="ui_alert_text">Your server doesn't support php ZipArchive library which is required to import demo content. Ask your web hosting company to enable it, or for steps for you to activate it.</div>
		        </div>
				<?php
			}
			
			if(!$curl_enabled){
				?>
				<div class="ui_alert">
		            <div class="ui_alert_text">Your server doesn't support php Curl library which is required to import demo content. Ask your web hosting company to enable it, or for steps for you to activate it.</div>
		        </div>
				<?php
			}
		}
	}
}