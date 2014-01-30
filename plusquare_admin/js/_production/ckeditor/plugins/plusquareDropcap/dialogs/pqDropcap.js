( function(){
	
	var plusquareDropcapDialog = function(editor){
		return {
			title : "Edit Dropcap",
			minWidth : 350,
			minHeight : 130,
			buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
			onOk: function(){
				var element = this.element;
				    
				if ( this.insertMode )
					editor.insertElement( element );
				this.commitContent( element );
          	},
			onLoad: function(){
				
    		},
			onShow: function(){ //onShow function for the dialog definition
				var 	sel = editor.getSelection(),
					element = sel.getStartElement();
				
				//Get element
				if ( element ){
					element = element.getAscendant( 'span', true );
				}
				
				 
				//Create element if doesn't exist
				if ( !element || element.getName() != 'span' || (!element.hasClass("dropcap") && !element.hasClass("dropcap1") && !element.hasClass("dropcap2")) || element.data( 'cke-realelement' ) ){
					/*var p = sel.getStartElement();
					if(p)
						p = element.getAscendant( 'p', true );
					
					if(!p){
						//Create paragraph
						p = editor.document.createElement( 'p' );
						editor.insertElement( p );
					}*/
					var text = sel.getSelectedText();
					
					element = editor.document.createElement( 'span' );
					element.setAttribute("class", "dropcap");
					
					element.setHtml(text);
					//element.unselectable();
					
					this.insertMode = true;
				}
				else
					this.insertMode = false;
					
				
				this.element = element;
				this.setupContent( this.element );
				
			},
			onHide: function(){
				
			},
			onCancel: function(){
				
			},
			resizable: CKEDITOR.DIALOG_RESIZE_NONE, // CKEDITOR.DIALOG_RESIZE_NONE, CKEDITOR.DIALOG_RESIZE_WIDTH, CKEDITOR.DIALOG_RESIZE_HEIGHT or CKEDITOR.DIALOG_RESIZE_BOTH
			contents: [{
				id: 'DropcapTab',  /* not CSS ID attribute! */
				label: 'Dropcap Tab',
				elements:[{
					type : 'vbox',
					widths : [ '100px', '100px', '100px' ],
					children :[
						{
							type:'text',
							id : 'text',
							label:'Dropcap character',
							labelLayout:'vertical',
							validate : CKEDITOR.dialog.validate.notEmpty("Dropcap must have 1 and only 1 character!"),
							setup: function(element){
								var text = element.getText() ;
								this.setValue(text);
							},
							commit : function( element ){
								element.setText( this.getValue() );
							}
						},
						{
							type : 'radio',
							id : 'type',
							label : 'Dropcap style',
							items : [ [ 'Round', ' ' ], [ 'Simple', '1' ], [ 'Square', '2' ] ] ,
							'default' : ' ',
							commit : function( element ){
								element.setAttribute("class", "dropcap"+this.getValue());
							}
						}
						
					]
				}]
		    }]
		}
	}
	
	CKEDITOR.dialog.add('plusquareDropcap', function(editor) {
		return plusquareDropcapDialog(editor);
	});
		
})();