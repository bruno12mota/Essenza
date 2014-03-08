<?php


/*
*  Create new pq meta box with the options set
*  @created: 18/11/13
*
*/
if(is_admin()){
	$contact_meta_options = array(
		array(
			"label" => "Contact Form Options",
			"type" => "tabs_unbinded",
			"id" => "contact_form_options",
			"options" => array("General", "Fields", "Submit Button"),
			"tabs" => array(
				
				//General
				array(
					array(
						"label" => "Email To",
						"id" => "contact_form_to",
						"type" => "text",
						"default" => get_bloginfo('admin_email'),
						"help" => "Email to where the emails are sent to!",
						"alert" => "Emails might go to your spam box on some mail services!"
					),
					array(
						"label" => "Email Title",
						"id" => "contact_form_title",
						"type" => "text",
						"default" => "Email from one of my site's user",
						"info" => "You can add a subject field on the form to let the users put a subject for each email!",
						"help" => "The title that each email will have when arriving you email box by default"
					),
					array(
						"label" => "Labels Positioning",
						"id" => "contact_form_labels_position",
						"type" => "combobox",
						"options" => array("Left", "Top"),
						"values" => array("left", "top"),
						"default" => "left",
						"help" => "The position of the fields' labels. On the left of the input field or over the top."
					),
					array(
						"label" => "On Success Text",
						"id" => "contact_form_success",
						"type" => "text",
						"default" => "Message sent! Thanks for contacting us!",
						"help" => "Text to display when message has been sent successfuly"
					),
					array(
						"label" => "On Error Text",
						"id" => "contact_form_error",
						"type" => "text",
						"default" => "One or more fields are invalid!",
						"help" => "Text to display when message has NOT been sent successfuly"
					)
				),

				//Fields
				array(
					array(
						"label" => "Contact Form Builder",
				        "id" => "contact_form_builder_id",
						"type" => "contact_form_builder",
						"info" => "Add fields to this contact form by clicking on the 'Add new field' button above, you can then drag and edit the fields"
					)
				),

				//Submit button
				array(
					array(
						"label" => "Submit Button Margin",
						"id" => "contact_form_button_margin",
						"type" => "text",
						"default" => "0px",
						"info" => "Margin in css format (-top-px -right-px -bottom-px -left-px  OR  -vertical-px -horizontal-px  OR  -all-px)"
					),
					array(
						"label" => "Submit Button Align",
						"id" => "contact_form_button_align",
						"type" => "combobox",
						"options" => array("Left", "Center", "Right"),
						"values" => array("left", "center", "right"),
						"default" => "left"
					),
					array(
						"id" => "submit_button",
						"label" => "Submit Button",
						"type" => "button_picker",
						"link" => false
					)
				)
			)
		)
	);
	new pq_meta_box($contact_meta_options, "contact_form");
}