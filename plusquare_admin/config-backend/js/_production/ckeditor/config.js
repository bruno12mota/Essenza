/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	
	config.toolbar = 'MyToolbar,Simple';
	
	//My plugins
	config.extraPlugins = 'plusquareBlockquote,plusquareDropcap'; 
	
	config.disableObjectResizing = true;
	config.jqueryOverrideVal = true;
	
	//http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Toolbar
	//http://docs.cksource.com/Talk:CKEditor_3.x/Developers_Guide	 
	config.toolbar_MyToolbar =
	[
		{ name: 'source', items : [ 'Source','-','Maximize', 'ShowBlocks'] },
		{ name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','-','Undo','Redo' ] },
		{ name: 'styles', items : [ 'Styles','Format', /*'Font'*/,'FontSize' ] },
		{ name: 'basicstyles', items : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
		{ name: 'paragraph', items : [ 'NumberedList','BulletedList'] },
		{ name: 'align', items : [ 'JustifyLeft','JustifyCenter','JustifyRight', 'JustifyBlock' ] },
		{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] },
		{ name: 'shortcodes', items : [ 'PlusquareBlockquote' , 'PlusquareDropcap' ] }
	];
	//CKEDITOR.getUrl( window.CKEDITOR_BASEPATH + '../../../its on theme url')
	
	config.toolbar_Simple =
	[
		{ name: 'clipboard', items : [ 'Cut','Copy','PasteText','-','Undo','Redo' ] },
		{ name: 'styles', items : [ 'FontSize' ] },
		{ name: 'basicstyles', items : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
		{ name: 'lists', items : [ 'NumberedList','BulletedList'] },
		{ name: 'align', items : [ 'JustifyLeft','JustifyCenter','JustifyRight', 'JustifyBlock' ] },
		{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] }
	];
};
