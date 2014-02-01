(function(){
    
    //Create the button and add the functionality to it
    CKEDITOR.plugins.add("plusquareDropcap",{
        init:function(editor){
            var pluginName = 'plusquareDropcap';
		  
            CKEDITOR.dialog.add(pluginName, this.path + 'dialogs/pqDropcap.js');
		  editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
		  
		  //ON DOUBLE CLICK
		  editor.on( 'doubleclick', function( evt ){
            	var element = evt.data.element;
			 
			//Create element if doesn't exist
			if ( element && element.getName() == 'span' && (element.hasClass("dropcap") || element.hasClass("dropcap1") || element.hasClass("dropcap2")) && !element.data( 'cke-realelement' ) ){
				evt.data.dialog = 'plusquareDropcap';
				evt.cancel();
			}
		});
		  
		editor.ui.addButton("PlusquareDropcap",{
			label: "Dropcap",
			icon: this.path + "icon/dropcap_icon.png",
			command: pluginName
		});
        }
    });
    
    
    
})();