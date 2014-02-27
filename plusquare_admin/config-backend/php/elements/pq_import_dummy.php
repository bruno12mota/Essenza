<?php

class pq_import_dummy {
	function __construct(){
		?>
		<div style="border-bottom: 1px solid #EEEEEE; padding-bottom: 15px;overflow: hidden;">
			<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/creative_thumb.jpg" width="300" height="223"/>
			<h1 style="padding-top: 35px;">Creative Demo</h1>
			<p>Showing most of Essenza's extensive list of beautiful features! The original design!</p>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Demo</a>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Options</a>
		</div>

		<div style="clear:both;border-bottom: 1px solid #EEEEEE; padding-bottom: 15px; padding-top: 15px;overflow: hidden;">
			<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/minimal_thumb.jpg" width="300" height="223"/>
			<h1 style="padding-top: 35px;">Minimal Demo</h1>
			<p>No submenus, no nonsense! Just a quick header and quick content!</p>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Demo</a>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Options</a>
		</div>

		<div style="clear:both;border-bottom: 1px solid #EEEEEE; padding-bottom: 15px; padding-top: 15px;overflow: hidden;">
			<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/corporate_thumb.jpg" width="300" height="223"/>
			<h1 style="padding-top: 35px;">Corporate Demo</h1>
			<p>Essenza V2 is live, and to show off all new features, we created this beautiful demo!</p>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Demo</a>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Options</a>
		</div>

		<div style="clear:both; padding-bottom: 15px; padding-top: 15px;overflow: hidden;">
			<img style="float:left; margin-right: 20px;" src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/template_customizer/personal_thumb.jpg" width="300" height="223"/>
			<h1 style="padding-top: 35px;">Personal Demo</h1>
			<p>A clean and crisp demo that does exactly what is needed: focus on your portfolio!</p>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Demo</a>
			<a data-folder="creative" class="button button-primary button-large import_button" href="#" style="">Import Options</a>
		</div>

		<div id="dummy_confirm" style="display:none;">
			<div class="ui_alert">
	            <div class="ui_alert_text">Importing dummy content will remove every post, page, image, comment and option you have till now, your site will be a replica of the preview altough some images might have been switched because of licensing issues. <b>Make sure this is what you want, as it doesn't have undo</b>!</div>
	        </div>

	        <div style="clear:both;">
	        	<a id="confirm_continue" class="button button-primary button-large" href="#">Continue</a>
				<a id="confirm_cancel" class="button button-primary button-large" href="#">Cancel</a>
	        </div>
	    </div>

		<div id="loading_dummy_cover" class="saving_cover" style="display: none;">
	    	<div>
	    		<p><span id="loading_label"></span> <img src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/config-backend/images/ui/loading.gif" /></p>
	    	</div>
	    </div>

		<script type="text/javascript">
			require(["jquery"], function($) {

				$(document).ready(function(){
					var $cover = $("#loading_dummy_cover");
					var $holder = $cover.find(">div");
					var $loadingLabel = $("#loading_label");

					var $dummy_options_demos = $("#dummy_options_demos");
					var $dummy_options = $("#dummy_options");
					var $dummy_confirm = $("#dummy_confirm");

					var $confirm_continue = $("#confirm_continue");
					var $confirm_cancel = $("#confirm_cancel");

					var $buttons = $(".import_button");

					var folder = "";

					function updatePermalinks(){
						$loadingLabel.text("Updating permalinks");

						jQuery.post(
							adminAjax,
							{
								'action' : 'pq_import_dummy_perma'
							},
							function( response ) {
								$cover.find("img").hide();
								$loadingLabel.text("Loaded successful (page will now refresh)!");
								location.reload();
							}
						);
					}

					function loadCss(){
						$loadingLabel.text("Uploading css");

						jQuery.post(
							adminAjax,
							{
								'action' : 'pq_import_dummy_css',
								'folder'	: folder
							},
							function( response ) {
								//Load images
								updatePermalinks();
							}
						);
					}

					function loadOptions(){
						$loadingLabel.text("Loading Options");
						$cover.show();

						jQuery.post(
							adminAjax,
							{
								'action' : 'pq_import_options',
								'folder'	: folder
							},
							function( response ) {
								//Load images
								loadCss();
							}
						);
					}

					function calculateAndUpdateProgress(evt){
					    console.log("Download in progress");

					    if (evt.lengthComputable) {
					    	console.log("Progress: "+evt.lengthComputable);
					    }
					}

					function onDownloadComplete(blobData){
					    	console.log("Download Complete");
					}

					function loadImages(){
						$cover.show();
						$loadingLabel.text("Uploading media");

						console.log(adminAjax);

						$iframe = $("<iframe src='../wp-content/themes/essenza/plusquare_admin/config-backend/php/import.php'></iframe>").appendTo($holder);

						/*$iframe.load(adminAjax, {
								'action' : 'pq_import_dummy_images',
								'folder'	: folder
						});
						$iframe.post(
							adminAjax,
							{
								'action' : 'pq_import_dummy_images',
								'folder'	: folder
							},
							function( response ) {
								//Load images
								//loadOptions();
							}
						);*/
					}

					function loadSql(){
						$loadingLabel.text("Running sql (this will update the database values)");
						$cover.show();

						jQuery.post(
							adminAjax,
							{
								'action' : 'pq_import_dummy',
								'folder'	: folder
							},
							function( response ) {
								//Load images
								loadImages();
							}
						);
					}

					function cancel_import(){
						$dummy_options.show();
						$dummy_options_demos.show();
						$dummy_confirm.hide();

						$confirm_continue.unbind("click");
						$confirm_cancel.unbind("click");
					}

					function import_dummy_content(){

						$dummy_options.hide();
						$dummy_options_demos.hide();
						$dummy_confirm.show();

						$confirm_continue.click(loadSql);
						$confirm_cancel.click(cancel_import);
						
					}

					function import_options(){

						$dummy_options.hide();
						$dummy_options_demos.hide();
						$dummy_confirm.show();

						$confirm_continue.click(loadOptions);
						$confirm_cancel.click(cancel_import);
						
					}

					$buttons.click(function(){
						folder = $(this).data("folder");

						loadImages();

						return false;
					});

					//Light
					$("#dummy_options_demos a").click(function(){
						folder = $(this).data("folder");
						import_dummy_content();

						return false;
					});

					//Dark
					$("#dummy_options a").click(function(){
						folder = $(this).data("folder");
						import_options();

						return false;
					});

				});

			});
		</script>

		<?php
	}
}