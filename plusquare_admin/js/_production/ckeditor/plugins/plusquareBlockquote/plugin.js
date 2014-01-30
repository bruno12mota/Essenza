(function(){
   
    //Code to execute when the toolbar button is pressed
    var commands = {
        exec:function(editor){
          var theSelectedText = editor.getSelection().getNative();
          
          editor.insertHtml("<span class='blockquote'><i class='esza-quote'>&nbsp;</i><span>"+theSelectedText+"</span></span>");
        }
    }
    
    //Create the button and add the functionality to it
    CKEDITOR.plugins.add("plusquareBlockquote",{
        init:function(editor){
            var pluginName = 'plusquareBlockquote';
		  
            CKEDITOR.dialog.add(pluginName, this.path + 'dialogs/pqBlockquote.js');
		  editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
		  
		  //ON DOUBLE CLICK
		  editor.on( 'doubleclick', function( evt ){
            	var element = evt.data.element;
			//Get element
			if ( element ){
				element = element.getAscendant( 'span', true );
				
				if(element){
					while(!element.hasClass("blockquote")){
						element = element.getAscendant( 'span', false );
						
						if(!element)
							break;
					}
				}
			}
				
			 
			//Create element if doesn't exist
			if ( element && element.getName() == 'span' && element.hasClass("blockquote") && !element.data( 'cke-realelement' ) ){
				evt.data.dialog = 'plusquareBlockquote';
				evt.cancel();
			}
		});
		  
		editor.ui.addButton("PlusquareBlockquote",{
			label: "Blockquote",
			icon: this.path + "icon/blockquote.png",
			command: pluginName
		});
        }
    });
    
    
    
})();