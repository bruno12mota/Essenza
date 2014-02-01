define(["jquery",
		"ckeditor/ckeditor"], function($){
	var Editor = function($this, iniContent, pathToElem){
	    var backgroundColor = "#111111";
	    
		var $textArea = $('<textarea name="content" cols="50" rows="15" id="ui_textarea" name="ui_textarea">'+iniContent+'</textarea>').appendTo($this);
							
		CKEDITOR.replace( 'ui_textarea' ,{
		    	resize_maxWidth : 870,
	         	resize_minWidth : 870,
			toolbar : 'MyToolbar'
		});
		CKEDITOR.config.contentsCss = pathToElem+'text_styles.css' ;
		
		//Background color
		CKEDITOR.on('instanceReady', function(e) {
	        // First time
	        e.editor.document.getBody().setStyle('background-color', backgroundColor);
	        e.editor.document.getBody().setStyle('padding', "20px");
	        // in case the user switches to source and back
	        e.editor.on('contentDom', function() {
	            e.editor.document.getBody().setStyle('background-color', backgroundColor);
	            e.editor.document.getBody().setStyle('padding', "20px");
	        });
	    });
	    
	    /*
	     * http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Styles
	     * CKEDITOR.stylesSet.add( 'default', [
	     *      // Block Styles
	     *      { name : 'Blockquote'   , element : 'span', attributes: {'class': 'blockquote'}},
	     * ]);
	    */
	};
	
	Editor.prototype = {
		val: function(html){
		    if(html == undefined)
	            return CKEDITOR.instances.ui_textarea.getData();
	            
	        CKEDITOR.instances.ui_textarea.setData(html);
	    },
		info:function(){
			var editor_data = CKEDITOR.instances.ui_textarea.getData();
			
			return getClearText(editor_data).substring(0, 100)+"...";
		},
		blur:function(fun){
		    CKEDITOR.instances.ui_textarea.on('blur', fun);
		}
	};
	
	return Editor;
});