( function(){
	
	var plusquareBlockquoteDialog = function(editor){
		return {
			title : "Edit Blockquote",
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
				var theSelectedText = this.getParentEditor().getSelection().getNative();
    		},
			onShow: function(){ //onShow function for the dialog definition
				var 	sel = editor.getSelection(),
					element = sel.getStartElement();
				
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
				if ( !element || element.getName() != 'span' || !element.hasClass("blockquote") || element.data( 'cke-realelement' ) ){
					var text = sel.getNative();
					
					element = editor.document.createElement( 'span' );
					element.setAttribute("class", "blockquote");
					
					element.setHtml("<i class='esza-quote'>&nbsp;</i><span class='blockquote_content'>"+text+"</span>");
					//element.unselectable();
					//element.getChild(0).unselectable();
					//element.getChild(1).unselectable();
					element.setStyle( "width", "50%" );
					
					console.log(text);
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
				id: 'BlockquoteTab',  /* not CSS ID attribute! */
				label: 'Blockquote Tab',
				elements:[{
					type : 'vbox',
					widths : [ '100px', '100px', '100px' ],
					children :[
						{
							type:'text',
							id : 'text',
							label:'Blockquote text',
							labelLayout:'vertical',
							validate : CKEDITOR.dialog.validate.notEmpty("Blockquote text can't be null"),
							setup: function(element){
								var content = element.getChild(1);
								
								var text = content.getText() ;
								this.setValue(text);
							},
							commit : function( element ){
								var content = element.getChild(1);
								content.setText( this.getValue() );
							}
						},
						{
							type:'select',
							id : 'float',
							label : 'Float',
							labelLayout:'vertical',
							items : 
							[
								[ 'Align Left', 'left' ],
								[ 'Align Right', 'right' ]
							],
							setup: function(element){
								if(element.hasClass("right"))
									//set right
									this.setValue("right");
								else
									//set left
									this.setValue("left");
							},
							commit : function( element ){
								var value = this.getValue();
								element.setAttribute("class", "blockquote");
								
								if(value == "right")
									element.addClass("right")
							}
						},
						{
							type:'text',
							id : 'width',
							label:'Width (%)',
							labelLayout:'vertical',
							validate : CKEDITOR.dialog.validate.regex(/^([0-9]|[1-9][0-9]|100)$/, "Blockquote width must be between 0 and 100!"),
							setup: function(element){
								var width = element.getStyle("width");
								width = width.substring(0, width.length-1);
								
								this.setValue(width);
							},
							commit : function( element ){
								element.setStyle( "width", this.getValue()+"%" );
							}
						}
					]
				}]
		    }]
		}
	}
	
	CKEDITOR.dialog.add('plusquareBlockquote', function(editor) {
		return plusquareBlockquoteDialog(editor);
	});
		
})();