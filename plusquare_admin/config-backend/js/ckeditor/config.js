/*
 Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.editorConfig=function(a){a.toolbar="MyToolbar,Simple";a.extraPlugins="plusquareBlockquote,plusquareDropcap";a.disableObjectResizing=!0;a.jqueryOverrideVal=!0;a.toolbar_MyToolbar=[{name:"source",items:["Source","-","Maximize","ShowBlocks"]},{name:"clipboard",items:"Cut Copy Paste PasteText - Undo Redo".split(" ")},{name:"styles",items:["Styles","Format",,"FontSize"]},{name:"basicstyles",items:["Bold","Italic","Strike","-","RemoveFormat"]},{name:"paragraph",items:["NumberedList","BulletedList"]},
{name:"align",items:["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"]},{name:"links",items:["Link","Unlink","Anchor"]},{name:"colors",items:["TextColor","BGColor"]},{name:"shortcodes",items:["PlusquareBlockquote","PlusquareDropcap"]}];a.toolbar_Simple=[{name:"clipboard",items:"Cut Copy PasteText - Undo Redo".split(" ")},{name:"styles",items:["FontSize"]},{name:"basicstyles",items:["Bold","Italic","Strike","-","RemoveFormat"]},{name:"lists",items:["NumberedList","BulletedList"]},{name:"align",
items:["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"]},{name:"links",items:["Link","Unlink","Anchor"]},{name:"colors",items:["TextColor","BGColor"]}]};
