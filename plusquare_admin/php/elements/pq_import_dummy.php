<?php

class pq_import_dummy {
	function __construct(){
		?>
		<div id="dummy_options_demos" style="display:inline-block;">
			<a id="import_dummy_creative" data-folder="creative" class="ui-button" href="#" style="margin: 5px;display:block;">Import Creative Demo</a>
			<a id="import_dummy_minimal" data-folder="minimal" class="ui-button" href="#" style="margin: 5px;display:block;">Import Minimal Demo</a>
			<a id="import_dummy_corporate" data-folder="corporate" class="ui-button" href="#" style="margin: 5px;display:block;">Import Corporate Demo</a>
			<a id="import_dummy_personal" data-folder="personal" class="ui-button" href="#" style="margin: 5px;display:block;">Import Personal Demo</a>
		</div>

		<div id="dummy_options" style="display:inline-block;">
			<a id="import_dummy_creative_options" data-folder="creative" class="ui-button" href="#" style="margin: 5px;display:block;">Import Creative Options</a>
			<a id="import_dummy_minimal_options" data-folder="minimal" class="ui-button" href="#" style="margin: 5px;display:block;">Import Minimal Options</a>
			<a id="import_dummy_corporate_options" data-folder="corporate" class="ui-button" href="#" style="margin: 5px;display:block;">Import Corporate Options</a>
			<a id="import_dummy_personal_options" data-folder="personal" class="ui-button" href="#" style="margin: 5px;display:block;">Import Personal Options</a>
		</div>

		<div id="dummy_confirm" style="display:none;">
			<div class="ui_alert">
	            <div class="ui_alert_text">Importing dummy content will remove every post, page, image, comment and option you have till now, your site will be a replica of the preview altough some images might have been switched because of licensing issues. <b>Make sure this is what you want, as it doesn't have undo</b>!</div>
	        </div>

	        <div style="clear:both;">
	        	<a id="confirm_continue" class="ui-button" href="#">Continue</a>
				<a id="confirm_cancel" class="ui-button" href="#">Cancel</a>
	        </div>
	    </div>

		<div id="loading_dummy_cover" class="saving_cover" style="display: none;">
	    	<div>
	    		<p><span id="loading_label"></span> <img src="<?php echo get_template_directory_uri(); ?>/plusquare_admin/UI_Elements/loading.gif" /></p>
	    	</div>
	    </div>

		<script type="text/javascript">
			require(["jquery"], function($) {

				$(document).ready(function(){
					var $cover = $("#loading_dummy_cover");
					var $loadingLabel = $("#loading_label");

					var $dummy_options_demos = $("#dummy_options_demos");
					var $dummy_options = $("#dummy_options");
					var $dummy_confirm = $("#dummy_confirm");

					var $confirm_continue = $("#confirm_continue");
					var $confirm_cancel = $("#confirm_cancel");

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

					function loadImages(){
						$loadingLabel.text("Uploading media");

						jQuery.post(
							adminAjax,
							{
								'action' : 'pq_import_dummy_images',
								'folder'	: folder
							},
							function( response ) {
								//Load images
								loadOptions();
							}
						);
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