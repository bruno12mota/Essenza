define(["jquery",
		"./SliderEditorSlide",
		"./SliderEditorElement",
		"ui/ui-elements",
		"ui/elements/OrderableList"], function($, Slide, SlideElement, Elements) {


	var SliderEditor = function ($this, builderPath, mainOptionsIds, id){
		this.$this = $($this);
		this.builderPath = builderPath;
		builderPathGlobal = builderPath;
		this.iniValue = $("#content").val();
		this.mainOptionsIds = mainOptionsIds;
		//alert(this.iniValue);
		this.id=id;
		
		//this.active = new Array();
		//this.active = active.split(",");
		
		this.slides = new Array();
		this.slides.push(new Slide());
		this.currentSlide = 0;
		
		this.init();
	}
	
	SliderEditor.prototype = {
	    //IMAGES LOADED
		init:function(){
				
				
			/*
			 * 
			 * SLIDER MANAGER PART
			 * 
			 */
				
			var $slideManager = this.$this;
			
			this.$sliderHolder = $slideManager.find('.sliderHolder');
			this.$background = this.$sliderHolder.find('>.background');
			this.$tracer = $slideManager.find('.tracer');
			this.$elements = $slideManager.find('.elements');
			this.$loadingBackground = $slideManager.find('.loading');
			this.loadingImage = false;
			this.elementIsSelected = false;
			
			
			//
			//CURRENT SLIDER MENU
			//
			var $menu = $slideManager.find('.menu_top');
			
			//previous button
			this.$previousSlide = $menu.find('.changeSlide.previous').click($.proxy(this.previousSlide, this));
			
			//current slide info text
			this.$currentSlideInfo = $menu.find('.info span');
			
			//next button
			this.$nextSlide = $menu.find('.changeSlide.next').click($.proxy(this.nextSlide, this));
			
			//Add new slide button
			$menu.find('.menu_btn.add_new').click($.proxy(this.newSlide, this));
			
			//Remove slide button
			$menu.find('.menu_btn.remove_slide').click($.proxy(this.removeSlide, this));
			
			//Live preview button
			/*var $livePreview = $menu.find('.livePreview').click(function(){
				$("#publish").trigger("click");
				return false;
			});*/
			
			
			this.$contents = $slideManager.find(".content");
			this.$subButtons = $slideManager.find(".tc_sub_button");
			this.$subButtons.eq(1).addClass("inactive");
			this.$subButtons.eq(2).addClass("inactive");
			this.currentTab = 0;
			
			this.$subButtons.click($.proxy(function(e){
				var $button = $(e.target);
				if(!$button.hasClass("inactive")){
					//Show the associated one
					this.currentTab =  parseInt($button.attr("rel"), 10);
					this.updateTab();
				}
				
				return false;
			}, this));
			
			//Show initial one
			this.updateTab();
			
			
			
			
			
			///////////////////////////////////////////////////////////////////
			//Slide Settings Tab////////////////////////////////////////////
			
			//Slide's duration
			this.$durationInput = $('#duration_input').blur($.proxy(this.changeSlideDuration, this));
			
			//Slider background type
			this.backgroundType = $("#slide_media_type");
			this.backgroundType.bind("change", $.proxy(this.backgroundTypeChanged, this));
			
			//Slider background image
			this.imageBackground = $("#slide_image_id");
			this.imageBackground.bind("change", $.proxy(this.backgroundChanged, this));
			
			//Slider video type
			this.videoBackgroundType = $("#slide_video_type");
			this.videoBackgroundType.bind("change", $.proxy(this.backgroundTypeChanged, this));
			
			//Slider video id
			this.videoIdInput = $("#slide_video_id");
			this.videoThumbInput = $("#slide_video_image").bind("change", $.proxy(this.videoThumbChanged, this));

			//Slider video autoplay
			this.videoAutoplayInput = $("#slide_video_autoplay");

			//slider color
			this.backgroundSlideColor = $("#slide_background_color");
			this.backgroundSlideColor.bind("change", $.proxy(this.backgroundColorChanged, this));

			//Slide thumbnail
			this.slideThumbnail = $("#slide_thumbnail_id");
			
			
			///////////////////////////////////////////////////////////////////
			
			
			
			
			///////////////////////////////////////////////////////////////////
			//Slide Elements Tab/////////////////////////////////////////////////////

			//Overview
			this.$elementsOverviewHolder = $("#slider_elements_overview_option_main_holder");

			//Animation Holder
			this.$propertiesAnimationHolder = $("#slide_element_tabs_unb_option_main_holder").hide();

			//Common
			this.$elementVerticalSnapping = $("#vertical_snapping");
			this.$elementHorizontalSnapping = $("#horizontal_snapping");
			this.$elementMinScale = $("#min_scale");
			this.$elementMaxScale = $("#max_scale");
			

			//Text properties holder
			this.$textPropertiesHolder = $("#slide_text_properties_option_main_holder").hide();

			//Button properties holder
			this.$buttonPropertiesHolder = $("#slide_button_properties_option_main_holder").hide();


			//Add element button
			this.$elementsOverviewHolder.find(">.option_label").append($("<a href='#' onclick='return false;'>Add element</a>").click($.proxy(this.openElementLightbox, this)));
			
			//Add back button
			this.$propertiesAnimationHolder.find(">.option_label").append($("<a href='#' class='back' onclick='return false;'>Back to Overview</a>").click($.proxy(this.backToOverview, this)));
			


			//Slider elements overview
			this.$elementsList = $("#slider_elements_overview_orderable_list")
	    							.bind("itemChanged", $.proxy(this.elementsOrderChanged, this))
	    							.bind("itemRemoved", $.proxy(this.elementListRemoved, this))
	    							.bind("properties", $.proxy(this.elementProperties, this))
	    							.bind("animation", $.proxy(this.elementAnimation, this));
			
			this.$elements.bind("elementSelected", $.proxy(this.elementSelected, this));
			
			var SEPid = "#slider_element_animation";
			this.$phasing = $(SEPid).bind("changePhase", $.proxy(this.changedElementPhase, this));
			
			//positioning
			this.$elementTop = $(SEPid+"_top").bind("blur", $.proxy(this.changedElementProperty, this));
			this.$elementLeft = $(SEPid+"_left").bind("blur", $.proxy(this.changedElementProperty, this));
			this.$elementSize = $(SEPid+"_size").bind("blur", $.proxy(this.changedElementProperty, this));
			this.$elementSizeHolder = $(SEPid+"_size_option_main_holder");
			this.$elementOpacity = $(SEPid+"_opacity").bind("blur", $.proxy(this.changedElementProperty, this));
			this.$elementSnap = $(SEPid+"_snap_to").bind("change", $.proxy(this.snapElementTo, this));
			
			//animation
			this.$elementDelay = $(SEPid+"_delay").bind("blur", $.proxy(this.changedElementAnimProperty, this));
			this.$elementDuration = $(SEPid+"_duration").bind("blur", $.proxy(this.changedElementAnimProperty, this));
			this.$elementType = $(SEPid+"_type").bind("change", $.proxy(this.changedElementAnimProperty, this));
			this.$elementEase = $(SEPid+"_ease").bind("change", $.proxy(this.changedElementAnimProperty, this));
			
			//match previous and following buttons
			this.$elementMatchPrevious = $("#element_match_previous").bind("click", $.proxy(this.matchPrevious, this));
			this.$elementMatchFollowing = $("#element_match_following").bind("click", $.proxy(this.matchFollowing, this));
			
			//other
			this.$elementAlignmentSnap = $(SEPid+"_alignment").bind("change", $.proxy(this.snapElementAlignmentTo, this));
			this.$elementText = $(SEPid+"_text").bind("blur change", $.proxy(this.changeElementText, this));
			this.$elementTextHolder = $(SEPid+"_text_option_main_holder");
			$("#element_remove_btn").click( $.proxy(this.removeCurrentElement, this) );
			
			this.currentPhase = 2;
			
			///////////////////////////////////////////////////////////////////
			
			
			
			
			
			///////////////////////////////////////////////////////////////////
			//Position & Kenburns Tab////////////////////////////////////////////
			
			//Initial position
			this.kenBurnsInitial = $("#slide_background_position");
			this.kenBurnsInitial.bind("change", $.proxy(this.kenBurnsInitialChange, this));
			
			
			//Final position
			this.kenBurnsFinal = $("#slide_background_end_position");
			
			//Use ken burns
			this.useKenBurns = $("#slide_use_ken_burns");
			
			//Ken burns duration
			this.kenBurnsDuration = $("#slide_ken_burns_duration");

			//background_vertical_snapping
			this.background_vertical_snapping = $("#background_vertical_snapping");
			
			//background_horizontal_snapping
			this.background_horizontal_snapping = $("#background_horizontal_snapping");
			///////////////////////////////////////////////////////////////////
			
			
			
			///////////////////////////////////////////////////////////////////
			//Slider Configuration////////////////////////////////////////////
	    	this.$slidesList = $("#slides_overview_orderable_list")
	    							.bind("itemChanged", $.proxy(this.slidesOrderChanged, this))
	    							.bind("itemRemoved", $.proxy(this.slideListRemoved, this))
	    							.bind("properties", $.proxy(this.goToSlideProperties, this));
			
			this.sliderRelHeight = $("#height");
			this.sliderRelHeight.bind("blur", $.proxy(this.changeHeight, this));
			
			///////////////////////////////////////////////////////////////////
			
			
			/*
			//PARSE CURRENT VAL
			*/
			this.initialValues();
			
			
			this.changeHeight();
			
			//Add trigger when submitting post
			$("#post").submit( $.proxy(this.makeHtml, this) );
		},
		
		
		
		/*--------------------------------------------------------------------------------------
		 *
		 * TABS HANDLING
		 * 
		 *--------------------------------------------------------------------------------------*/
		
		//Update current tab
		updateTab: function(){
			//Hide all
			this.$contents.css("display", "none");
			this.$subButtons.removeClass("active");
			
			//Update active
			this.$contents.eq(this.currentTab).css("display", "block");
			this.$subButtons.eq(this.currentTab).addClass("active");
		},
		
		//changes tab to
		changeTab: function(to){
			this.currentTab = 0;
			this.updateTab();
		},
		
		//Update showing tabs
		updateShowingTabs: function(){
			var imageActive = this.slides[ this.currentSlide ].parameters.backgroundType == "image" && this.$background.find("img").length > 0;
			var colorActive = this.slides[ this.currentSlide ].parameters.backgroundType == "color";
				
			//Ken burns
			if(imageActive)
				this.$subButtons.eq(2).removeClass("inactive");
			else
				this.$subButtons.eq(2).addClass("inactive");
			
			//Elements
			if(imageActive || colorActive)
				this.$subButtons.eq(1).removeClass("inactive");		
			else
				this.$subButtons.eq(1).addClass("inactive");	
			
				
			//Change tab if it's on ken burns' one
			if(!imageActive && this.currentTab == 2)
				this.changeTab(0);

			//Change tab if it's on elements' one
			if(!imageActive && !colorActive && this.currentTab == 1)
				this.changeTab(0);
		},
		
		
		
		/*--------------------------------------------------------------------------------------
		 *
		 * ELEMENTS HANDLING
		 * 
		 *--------------------------------------------------------------------------------------*/
		
		//Closes New Element Lightbox
		closeElementLightbox: function(){
			this.$newElementLightboxCover.stop().fadeTo(300, 0, function(){$(this).hide();});
			this.$newElementLightbox.stop().fadeTo(300, 0, function(){$(this).hide();});

			return false;
		},

		//Submit New Element Lightbox
		submitElementLightbox: function(){
			var type = this.$newElementLightbox.find("#new_slide_element").val();

			//text  element
			if(type == "text")
				this.addTextBlock($("#slide_text_picker_button").clone(true));
			
			//image  element
			else if(type == "image")
				this.addImage($("#slide_element_id").val());
			
			//button  element
			else if(type == "button")
				this.addButton($("#slide_button_picker_button").clone(true));
			
			
			this.closeElementLightbox();

			return false;
		},

		//New Element Lightbox
		openElementLightbox: function(){

			if(this.$newElementLightbox == undefined){
				var body = $("body");

				//Cover
				this.$newElementLightboxCover = $('<div id="new_element_cover" class="pq_lightbox_cover" style="display: none;"></div>').appendTo(body);

				this.$newElementLightbox = $('<div id="new_element_box" class="pq_lightbox" style="display: none;"></div>').appendTo(body);
				this.$newElementLightbox.append($('<div class="pq_lightbox_header">Add New Element <a class="close_btn" href="#"></a></div><div class="lightbox_content"><div class="loading">Loading</div></div><div class="pq_lightbox_submit_menu"><a class="ui-button lightbox_submit" href="#">Add Element</a><a class="ui-button close" href="#">Exit</a></div>'));
				
				var $content = this.$newElementLightbox.find(".lightbox_content");

				this.$newElementLightbox.find(".close_btn, .close").click($.proxy(this.closeElementLightbox, this));
				this.$newElementLightbox.find(".lightbox_submit").click($.proxy(this.submitElementLightbox, this));

				jQuery.post(
					adminAjax,
					{
						'action' : 'pq_get_add_element'
					},
					$.proxy(function( response ) {
						$content.html(response);
					}, this)
				);
			}
			
    		var fromTop = $(window).scrollTop();
			this.$newElementLightboxCover.stop().show().fadeTo(500, 0.6);
			this.$newElementLightbox.css("top", (40+fromTop)+"px").stop().show().fadeTo(500, 1);


			return false;
		},

		//Update tracer position
		updateTracer: function(){
			if(!this.elementIsSelected)
				return false;
			
            var values = this.selectedElement.getInstance(this.currentPhase/2);
			var width = values.x ;
			var height = values.y ;
			
			this.$tracer.css({
				"width": width+"px",
				"height": height+"px"
			});
		},
		
		//When an element is selectedd
		elementSelected: function(e, element){

			this.selectedElement = element;
			this.elementIsSelected = true;
			this.editingElement = element;
			
			//Listen for unselect
			this.$elements.bind("elementUnselect", $.proxy(this.elementUnselected, this));
			
			//update tabs showing
			this.updateShowingTabs();
			this.$subButtons.eq(1).trigger("click");
			
			//Listen for position change
			$(element).bind("changePos", $.proxy(this.changeByElement, this));
			
			//Show tracer
			this.$tracer.css("display", "inline");
			this.updateTracer();


			//Overview
			this.$elementsOverviewHolder.hide();

			//Properties Holder
			this.$propertiesAnimationHolder.show();

			//Common
			this.$elementVerticalSnapping.val( element.parameters.vertical_snapping );
			this.$elementHorizontalSnapping.val( element.parameters.horizontal_snapping );
			this.$elementMinScale.val( element.parameters.min_scale );
			this.$elementMaxScale.val( element.parameters.max_scale );

			this.$elementVerticalSnapping.trigger("update");
			this.$elementHorizontalSnapping.trigger("update");

			this.$elementVerticalSnapping.bind("change", $.proxy(this.updateElementCommons, this));
			this.$elementHorizontalSnapping.bind("change", $.proxy(this.updateElementCommons, this));
			this.$elementMinScale.bind("change", $.proxy(this.updateElementCommons, this));
			this.$elementMaxScale.bind("change", $.proxy(this.updateElementCommons, this));

			
			if(this.selectedElement.type == "text"){
				//Set value 
				var $val = $("#slide_text_properties");
				$val.val(element.$content.attr("data-values"));
				$val.trigger("update");

				this.$buttonPropertiesHolder.hide();
				this.$textPropertiesHolder.show();

				this.targetCloner = $("#slide_text_properties_button");
				$val.bind("change", $.proxy(this.updateElementProperties, this));
			}
			else if(this.selectedElement.type == "button"){
				var $val = $("#slide_button_properties");
				$val.val(element.$content.attr("data-values"));
				$val.trigger("update");

				this.$textPropertiesHolder.hide();
				this.$buttonPropertiesHolder.show();

				this.targetCloner = $("#slide_button_properties_button");
				$val.bind("change", $.proxy(this.updateElementProperties, this));
			}

			if(this.selectedElement.type == "image"){
				this.$elementTextHolder.css("display", "none");
				this.$elementSizeHolder.css("display", "block");

				this.$textPropertiesHolder.hide();
				this.$buttonPropertiesHolder.hide();
			}
			else{
				this.$elementTextHolder.css("display", "block");
				this.$elementText.val(this.selectedElement.$content.text());
				
				this.$elementSizeHolder.css("display", "none");
			}
			
			//change values by element
			this.changeByElement();

			this.updateElementsView();
		},
		
		//When an element is unselected
		elementUnselected: function(){
			if(!this.elementIsSelected)
				return false;

			this.changedElementPhase(null, 2);
				
			this.elementIsSelected = false;
			this.selectedElement.unselectElem();

			//update tabs showing
			this.updateShowingTabs();
			
			//Hide tracer
			this.$tracer.css("display", "none");
			
			//Change to normal instance
			this.$phasing.find(".phase").eq(2).trigger("click");
			
			//Unbind unselect
			this.$elements.unbind("elementUnselect", this);

			$("#slide_button_properties, #slide_text_properties").unbind("change");

			this.updateElementsView();
		},
		
		//On element drag (Update position inputs)
		changeByElement: function(){
			if(!this.elementIsSelected)
				return;
			
			if(this.currentPhase % 2 == 0){
				//position phase
				var values = this.selectedElement.getInstance(this.currentPhase/2);
				
				this.$elementTop.val(values.y);
				this.$elementLeft.val(values.x);
				this.$elementOpacity.val(values.opacity);
				
				if(this.selectedElement.type == "image"){
					this.$elementSize.val(values.size);
				}
				
				this.updateTracer();
			}
			else{
				//animation phase
				var values = this.selectedElement.getAnimationInstance( Math.floor(this.currentPhase/2) );
				
				this.$elementDelay.val(values.delay);
				this.$elementDuration.val(values.duration);
				this.$elementType.val(values.type);
				this.$elementEase.val(values.ease);

				this.$elementType.trigger("update");
				this.$elementEase.trigger("update");
			}
		},

		//Add element to elements List
		addElementToList: function(element){
			if(this.$elementsList.hasClass("ready"))
 				this.$elementsList.trigger("addItem", [$('<span class="image" style="width: 13px; background-image: url('+builderPathGlobal+'/images/slider_builder/'+element.type+'_element.png);"></span><p class="title">'+(element.type == "image" ? element.type+' Element' : '&#34;'+element.$content.text()+'&#34; '+element.type+' Element')+'</p><a href="#" data-event="animation" onclick="return false;">Edit animation</a><a href="#" data-event="properties" onclick="return false;">Edit properties</a>'), this.slides[this.currentSlide].elements.length - element.depth - 1]);
 			else
 				this.$elementsList.bind("bindsReady", $.proxy(function(){
 					this.$elementsList.trigger("addItem", [$('<span class="image" style="width: 13px; background-image: url('+builderPathGlobal+'/images/slider_builder/'+element.type+'_element.png);"></span><p class="title">'+(element.type == "image" ? element.type+' Element' : '&#34;'+element.$content.text()+'&#34; '+element.type+' Element')+'</p><a href="#" data-event="animation" onclick="return false;">Edit animation</a><a href="#" data-event="properties" onclick="return false;">Edit properties</a>'), this.slides[this.currentSlide].elements.length - element.depth - 1]);
				}, this));
		},
		
		//Add Text Block Element
		addTextBlock: function($object){
			//Create slide element
			var element = new SlideElement.TextElement(this.slides[ this.currentSlide ].elements.length, this.$elements, $object);
			
			//Save element to slide
			this.slides[ this.currentSlide ].addElement(element);

			this.addElementToList(element);
			
			return false;
		},
		
		//Add Button Element
		addButton: function($object){
			//Create slide element
			var element = new SlideElement.ButtonElement(this.slides[ this.currentSlide ].elements.length, this.$elements, $object);
			
			//Save element to slide
			this.slides[ this.currentSlide ].addElement(element);
			this.addElementToList(element);
			
			return false;
		},
		
		//Load attachments
		loadAttachment: function(attachmentId){
			jQuery.post(
				adminAjax,
				{
					'action' : 'get-attachment',
					'id': attachmentId
				},
				$.proxy(function( response ) {
					if(response["success"] == true){
						
						var $object = $("<img src='"+response["data"]["url"]+"' alt='Image element'/>");
						var width = response["data"]["width"];
						var height = response["data"]["height"];
	
						//Create slide element
						var element = new SlideElement.ImageElement(this.slides[ this.currentSlide ].elements.length, this.$elements, $object, width, height);
	
						//Save element to slide
						this.slides[ this.currentSlide ].addElement(element);
						this.addElementToList(element);
					}
				}, this)
			);
		},
		
		//Add Images Elements
		addImage: function(val){
			if(val != ""){
				//Load attachments
				this.loadAttachment( val );
			}
		},

		//Get element of the current slide by depth
		getElementByDepth: function(depth){
			var elements = this.slides[this.currentSlide].elements;
			for(var i = 0; i < elements.length ; i++)
				if(elements[i].depth == depth)
					return elements[i];

			return null;
		},

		//Elements depth change on list
		elementsOrderChanged: function(e, from, to){
			var end = this.slides[this.currentSlide].elements.length-1;
			var depthFrom = end - from;
			var depthTo = end - to;
			var fromElement = this.getElementByDepth(depthFrom);
			var toElement = this.getElementByDepth(depthTo);
			fromElement.setDepth(depthTo);
			toElement.setDepth(depthFrom);
		},

		//Element removed on the list
		elementListRemoved: function(e, id){
			var end = this.slides[this.currentSlide].elements.length-1;
			var depth = end - id;
			this.getElementByDepth(depth).deleteElement(false);
			this.slides[this.currentSlide].removeElement(depth);
		},

		//Element edit properties
		elementProperties: function(e, id){
			var end = this.slides[this.currentSlide].elements.length-1;
			var depth = end - id;
			var element = this.getElementByDepth(depth);
			this.editingElement = element;

			$("#slide_element_tabs_unb_tabs").trigger("change", [0]);

			//Select element in question
			element.selectElement();
		},

		updateElementProperties: function(){
			if(WP_DEBUG)console.log("Update Props");
			this.editingElement.updateInsideContent(this.targetCloner.clone(true));

			return false;
		},

		updateElementCommons: function(){
			//update values
			this.editingElement.parameters.vertical_snapping = this.$elementVerticalSnapping.val();
			this.editingElement.parameters.horizontal_snapping = this.$elementHorizontalSnapping.val();
			this.editingElement.parameters.min_scale = this.$elementMinScale.val();
			this.editingElement.parameters.max_scale = this.$elementMaxScale.val();
		},

		//Element edit animation
		elementAnimation: function(e, id){
			var end = this.slides[this.currentSlide].elements.length-1;
			var depth = end - id;
			var element = this.getElementByDepth(depth);
			this.editingElement = element;

			$("#slide_element_tabs_unb_tabs").trigger("change", [1]);

			//Select element in question
			element.selectElement();
		},

		//Back to the Elements Overview
		backToOverview: function(){
			//Overview
			this.elementUnselected();
		},

		updateElementsView: function(){

			if(this.elementIsSelected){
				//Overview
				this.$elementsOverviewHolder.hide();

				//Animation Holder
				this.$propertiesAnimationHolder.show();
			}
			else{
				//Overview
				this.$elementsOverviewHolder.show();

				//Animation Holder
				this.$propertiesAnimationHolder.hide();
			}
		},
		
		
		
		
		
		/*--------------------------------------------------------------------------------------
		 *
		 * ELEMENTS PROPERTIES HANDLING
		 * 
		 *--------------------------------------------------------------------------------------*/
		
		//Remove element
		removeCurrentElement: function(){
			if(!this.elementIsSelected)
				return false;
				
			this.selectedElement.deleteElement();
			this.elementUnselected();
			
			return false;
		},
		
		//match previous phase
		matchPrevious: function(){
			if(!this.elementIsSelected)
				return false;
			
			this.selectedElement.matchPrevious();
			return false;
		},
		
		//match following phase
		matchFollowing: function(){
			if(!this.elementIsSelected)
				return false;
				
			this.selectedElement.matchFollowing();
			return false;
		},
		
		//Changed Element Position&Alpha property
		changedElementProperty: function(){
			if(!this.elementIsSelected)
				return false;
				
			var top = this.$elementTop.val();
			var left = this.$elementLeft.val();
			var opacity = this.$elementOpacity.val();
			var size = this.$elementSize.val();
			
			var options = {
				"x": left,
				"y": top,
				"opacity": opacity,
				"size": size
			}

			this.selectedElement.setInstance( Math.round(this.currentPhase/2), options);
		},
		
		//Changed Element Animation property
		changedElementAnimProperty: function(){
			if(!this.elementIsSelected)
				return false;
				
			var delay = this.$elementDelay.val();
			var duration = this.$elementDuration.val();
			var type = this.$elementType.val();
			var ease = this.$elementEase.val();
			
			var options = {
				"delay": delay,
				"duration": duration,
				"type": type,
				"ease": ease
			}

			this.selectedElement.setAnimationInstance( Math.floor(this.currentPhase/2), options);
		},
		
		//Snap element to a position
		snapElementTo: function(){
			if(!this.elementIsSelected)
				return false;
				
			this.selectedElement.snapTo( this.$elementSnap.val() );
		},
		
		//When animation phase is changed
		changedElementPhase: function(e, phase){
			if(!this.elementIsSelected)
				return false;
				
			//save phase
			this.currentPhase = phase;
			
			this.$elementMatchPrevious.removeClass("disabled");
			this.$elementMatchFollowing.removeClass("disabled");
			
			if(phase == 0)
				this.$elementMatchPrevious.addClass("disabled");
			
			if(phase == 6)
				this.$elementMatchFollowing.addClass("disabled");
			
			//change phase on current element
			this.slides[ this.currentSlide ].changeElementsPhase( Math.round(this.currentPhase/2) + 1 );
			//this.selectedElement.changeInstance( Math.round(this.currentPhase/2) + 1);
			
			//change values by element
			this.changeByElement();
		},
		
		//On Element Text Change
		changeElementText: function(){
			if(!this.elementIsSelected)
				return false;
				
			if(this.selectedElement.type == "text" || this.selectedElement.type == "button"){
				var text = this.$elementText.val();
				this.selectedElement.setSpecificValues(text);
			}
		},
		
		
		
		
		
		
		
		
		
		
		//On slider relative height change
		changeHeight: function(){
			var heightRel = parseInt(this.sliderRelHeight.val(), 10);
			
			var width = 900;
			var height = width*(heightRel/100);
			
			this.height = height;
			
			this.$sliderHolder.css({
	            "height": height+"px"
	        });
	        
	        var widthRatio = width/height;
	        this.kenBurnsInitial.trigger("ratioChange", widthRatio);
	        this.kenBurnsFinal.trigger("ratioChange", widthRatio);

			var elementsWidth = this.$elements.width();
			var elementsHeight = this.$elements.height();
			var elements = this.slides[this.currentSlide].elements;
	        for(var i = 0; i< elements.length; i++){
	        	elements[i].elementsWidth = elementsWidth;
				elements[i].elementsHeight = elementsHeight;
	        	elements[i].updatePosition(false);
	        }

		},
		
		
		//On initial position change in ken burns tab
		kenBurnsInitialChange:function(){
			//Change background position
			var value = this.kenBurnsInitial.val();
			
			if(value != undefined && value != ""){
				var values = value.split('/'); // top/left/size
				//if(WP_DEBUG)console.log(values);
				
				var width = 900/values[2];
				
				var ratio = this.currentImageWidth / this.currentImageHeight;
				var height = width / ratio;
				
				var excessVertical = this.height - height;
				var excessHorizontal = 900 - width;
				var top = parseFloat(values[0], 10)*excessVertical;
				var left = parseFloat(values[1], 10)*excessHorizontal;
				
				this.$background.find("img").css({
					"position": "absolute",
					"width": width+"px",
					"height": height+"px",
					"top": top+"px",
					"left": left+"px"
				});
			}
		},
		
		
		
		
		
		/*--------------------------------------------------------------------------------------
		 *
		 * BACKGROUND CHANGES
		 * 
		 *--------------------------------------------------------------------------------------*/
		
		//Background Type Changed
		backgroundTypeChanged: function(){
			var type = this.backgroundType.val();
			if(WP_DEBUG)console.log("background type change");
				
			this.$background.removeClass("youtube")
							.removeClass("vimeo")
							.removeClass("dailymotion");
					

			//Image type			
			if(type == "image"){
				this.$background.css("background-color", "");
				
				//Change background type
				this.slides[ this.currentSlide ].parameters.backgroundType = "image";
				this.updateShowingTabs();	

				this.backgroundChanged();
			}


			//Color type
			else if(type == "color"){
				var color = this.backgroundSlideColor.val();
				
				//Change background type
				this.slides[ this.currentSlide ].parameters.backgroundType = "color";
				this.updateShowingTabs();	

				this.$background.find("img").css("display", "none");
				this.$background.css("background-color", color);

				this.loadingImage = false;
				this.$loadingBackground.stop().fadeTo(200, 0, function(){$(this).hide();});
				
				this.$slidesList.trigger("changeImage", [this.currentSlide, builderPathGlobal+'/images/slider_builder/colored_slide.png']);
			}


			//Video type
			else{
				var videoType = this.videoBackgroundType.val();
				this.$background.find("img").css("display", "none");
				this.$background.css("background-color", "");
				this.$background.addClass(videoType);
				
				//Change background type
				this.slides[ this.currentSlide ].parameters.backgroundType = videoType;
				this.updateShowingTabs();
				
				this.$slidesList.trigger("changeImage", [this.currentSlide, builderPathGlobal+'/images/slider_builder/video_slide.png']);
			}
		},

		//Background color changed
		backgroundColorChanged: function(){
			var color = this.backgroundSlideColor.val();
			this.$background.css("background-color", color);
		},

		videoThumbChanged: function(){

			//update thumbnail if empty
			if(this.slideThumbnail.val() == "")
				this.slideThumbnail.val( this.videoThumbInput.val() ).trigger("update");

		},
		
		//Background Image Changed
		backgroundChanged: function(){
			var attachmentId = this.imageBackground.val();
			if(WP_DEBUG)console.log("backgroundChanged");
			
			if(attachmentId != "" && attachmentId != null && attachmentId != "undefined"){
				this.loadingImage = true;
				this.$loadingBackground.stop().show().fadeTo(200, 1);
				var slideNum = this.currentSlide;

				//update thumbnail if empty
				if(this.slideThumbnail.val() == "")
					this.slideThumbnail.val(attachmentId).trigger("update");


				jQuery.post(
					adminAjax,
					{
						action : 'get-attachment',
						'id':attachmentId
					},
					$.proxy(function( response ) {
						if(response["success"] == true && slideNum == this.currentSlide){
							
							this.currentImageWidth = response["data"]["width"];
							this.currentImageHeight = response["data"]["height"];
							
							//Load success
							var $newBackground = this.getBackground("image", response["data"]["url"], this.currentImageWidth, this.currentImageHeight, attachmentId);
							this.$background.html($newBackground);
							
							this.kenBurnsInitial.trigger("changeImage", [response["data"]["url"], response["data"]["width"], response["data"]["height"]]);
							this.kenBurnsFinal.trigger("changeImage", [response["data"]["url"], response["data"]["width"], response["data"]["height"]]);
							
							this.$subButtons.eq(1).removeClass("inactive");
							this.$subButtons.eq(2).removeClass("inactive");

							if(response["data"]["sizes"]["thumbnail"] != undefined)
								this.$slidesList.trigger("changeImage", [this.currentSlide, response["data"]["sizes"]["thumbnail"]["url"]]);
							else
								this.$slidesList.trigger("changeImage", [this.currentSlide, response["data"]["sizes"]["full"]["url"]]);

						}
						
						if(slideNum == this.currentSlide){
							this.loadingImage = false;
							this.$loadingBackground.stop().fadeTo(200, 0, function(){$(this).hide();});
						}
					}, this)
				);
			}
			else{
				this.$slidesList.trigger("changeImage", [this.currentSlide, builderPathGlobal+'/images/slider_builder/no_slide.png']);
				this.$background.html("");
			}
			
		},
		
		//Get Background jquery dom object according to type
		getBackground: function(type, background, width, height, id){
	        
		    if(background == "" || background == null)
		       return "";
		       
		    if(type == "image"){
		    	var maxWidth = 900;
		    	var maxHeight = this.height;
		    	
	            //Case width overflows
				if(width > maxWidth){
					var ratio = width / maxWidth;
					width /= ratio;
					height /= ratio;
				}
				
				//Case height still overflows
				if(height < maxHeight){
					var ratio = height / maxHeight;
					width /= ratio;
					height /= ratio;
				}
				
		        //IMAGE
		        var $image = $('<img src="'+background+'" alt="background image" width="'+width+'" height="'+height+'" rel="'+id+'" />');
	            
	            return $image;
		    }
		    else{
		        //VIDEO
		        var $video= "";
		        
	            if(type == "vimeo")
	                $video = $('<iframe src="http://player.vimeo.com/video/'+background+'" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
	            else if(type == "youtube")
	                $video = $('<iframe src="http://www.youtube.com/embed/'+background+'?rel=0&autohide=1&showinfo=0&wmode=opaque" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
	            else if(type == "dailymotion")
	                $video = $('<iframe src="http://www.dailymotion.com/embed/video/'+background+'" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
	                
	            return $video;
		    }
		},
		
		
		
		
		
		
		
		
		/*--------------------------------------------------------------------------------------
		 *
		 * SLIDE CHANGE 
		 * 
		 *--------------------------------------------------------------------------------------*/

		//Slide has switched place
		slidesOrderChanged: function(e, from, to){
			if(this.currentSlide == from)
				this.currentSlide = to;
			else if(this.currentSlide == to)
				this.currentSlide = from;

			var newSlides = new Array();
			for(var i = 0; i < this.slides.length; i++){
				//Get in position i
				if(i == from)
					newSlides.push(this.slides[to]);
				else if(i == to)
					newSlides.push(this.slides[from]);
				else
					newSlides.push(this.slides[i]);

				//Change title
				this.$slidesList.trigger("changeTitle", [i, "Slide "+(i+1)+(this.currentSlide==i ? " (selected)":"")]);
			}

			this.slides = newSlides;
			this.updateMenu();
		},

		//On Slide removed in ordered list
		slideListRemoved: function(e, id){
			this.slides = removePositionInArray(this.slides, id);
			
			if(this.slides.length == 0)
				this.slides.push(new Slide());
			
			this.updateSlide();

			return false;
		},

		reTitleSlides: function(){
			for(var i = 0; i < this.slides.length; i++)
				this.$slidesList.trigger("changeTitle", [i, "Slide "+(i+1)+(this.currentSlide==i ? " (selected)":"")]);
		},
		
		//UPDATE TOP MENU
		updateMenu: function(){
			this.$currentSlideInfo.text( this.currentSlide+1+"/"+this.slides.length);
			this.$durationInput.val(this.slides[this.currentSlide].parameters.slideDuration.toString());
			
			//previous slide
			if(this.currentSlide == 0)
				this.$previousSlide.removeClass("active");
			else
				this.$previousSlide.addClass("active");
			
			//next slide
			if(this.currentSlide >= this.slides.length-1)
				this.$nextSlide.removeClass("active");
			else
				this.$nextSlide.addClass("active");
		},
		
		//UPDATE CURRENT SLIDE SHOWING
		updateSlide: function(){
			if(WP_DEBUG)console.log("UpdateSlide");
			if(this.currentSlide<0)
				this.currentSlide = 0;
			else if(this.currentSlide >= this.slides.length)
				this.currentSlide = this.slides.length-1;
			
			if(this.elementIsSelected)
				this.selectedElement.unselectElem();
			
			//Get slide background
			var backgroundObj = this.slides[ this.currentSlide ].getBackground();
			this.$background.html("");
			
			//if(WP_DEBUG)console.log(backgroundObj);
			//update background
			if(backgroundObj.type == "image"){
				if(backgroundObj.id != undefined)
					this.imageBackground.val(backgroundObj.id).trigger("update");

				this.backgroundType.val( "image" ).trigger("update");
			}
			else if(backgroundObj.type == "color"){
				this.backgroundSlideColor.val(backgroundObj.id);
				this.backgroundSlideColor.trigger("update");
				this.backgroundType.val( backgroundObj.type ).trigger("update");
			}
			else{
				this.videoIdInput.val(backgroundObj.id);
				this.videoBackgroundType.val(backgroundObj.type);this.videoBackgroundType.trigger("update");
				this.videoThumbInput.val(backgroundObj.thumb);this.videoThumbInput.trigger("update");
				this.backgroundType.val( "video" ).trigger("update");
				this.videoAutoplayInput.val(backgroundObj.videoAutoplay).trigger("update");
			}

			this.slideThumbnail.val( backgroundObj.thumbnail );
			this.slideThumbnail.trigger("update");

			this.backgroundTypeChanged();
			
			//KENBURNS
			var kenBurnsValues = this.slides[ this.currentSlide ].getKenBurns();

			//Check if binds are ready
			if(this.kenBurnsInitial.hasClass("ready"))
				this.kenBurnsInitial.val( kenBurnsValues["startTop"]+"/"+kenBurnsValues["startLeft"]+"/"+kenBurnsValues["startSize"] ).trigger("update");
			else
				this.kenBurnsInitial.bind("bindsReady", $.proxy(function(){
					this.kenBurnsInitial.val( kenBurnsValues["startTop"]+"/"+kenBurnsValues["startLeft"]+"/"+kenBurnsValues["startSize"] ).trigger("update");
				}, this));

			if(this.kenBurnsFinal.hasClass("ready"))
				this.kenBurnsFinal.val( kenBurnsValues["endTop"]+"/"+kenBurnsValues["endLeft"]+"/"+kenBurnsValues["endSize"] ).trigger("update");
			else
				this.kenBurnsFinal.bind("bindsReady", $.proxy(function(){
					this.kenBurnsFinal.val( kenBurnsValues["endTop"]+"/"+kenBurnsValues["endLeft"]+"/"+kenBurnsValues["endSize"] ).trigger("update");
				}, this));

			this.useKenBurns.val( kenBurnsValues["use"] ).trigger("update");
			this.kenBurnsDuration.val( kenBurnsValues["duration"] );


			//background_vertical_snapping
			this.background_vertical_snapping.val( this.slides[ this.currentSlide ].parameters.vertical_snapping ).trigger("update");
			
			//background_horizontal_snapping
			this.background_horizontal_snapping.val( this.slides[ this.currentSlide ].parameters.horizontal_snapping ).trigger("update");

			
			//ELEMENTS
			this.slides[ this.currentSlide ].appendElements();

			//add to list
			var slide = this.slides[ this.currentSlide ];
			for(var i = slide.elements.length-1; i>=0 ; i--){
				var element;
				//Get element with depth = i
				for(var a = 0; a< slide.elements.length ; a++){
					if(slide.elements[a].depth == i){
						element = slide.elements[a];
						break;
					}
				}

				this.addElementToList(element);
			}
			
			
			//Duration
			this.$durationInput.val( this.slides[ this.currentSlide ].parameters.slideDuration );
				
			//Update showing tab
			this.updateShowingTabs();
				
			//Update Menu
			this.updateMenu();

			this.reTitleSlides();
		},
		
		//Save Current Slide
		saveSlide: function(){
			
			//Duration
			this.slides[ this.currentSlide ].parameters.slideDuration = this.$durationInput.val();
			
			//BACKGROUND
			var type = this.backgroundType.val();
			var videoType = this.videoBackgroundType.val();
			this.slides[ this.currentSlide ].setBackground({
				"type": type == "video" ? videoType : type,
				"id": type == "video" ? this.videoIdInput.val() : ( type == "image" ? this.imageBackground.val() : this.backgroundSlideColor.val()) ,
				"thumb": type == "video" ? this.videoThumbInput.val() : "",
				"thumbnail": this.slideThumbnail.val(),
				"videoAutoplay": this.videoAutoplayInput.val()
			});
			
			//KEN BURNS
			var initial = this.kenBurnsInitial.val().split('/');
			var finalKen = this.kenBurnsFinal.val().split('/');
			var useKen = this.useKenBurns.val();
			var duration = this.kenBurnsDuration.val();
			this.slides[ this.currentSlide ].setKenBurns({
				"use": useKen,
		        "delay": 0,
		        "duration": duration,
		        "startTop": initial[0],
		        "startLeft": initial[1],
		        "startSize": initial[2],
		        "endTop": finalKen[0],
		        "endLeft": finalKen[1],
		        "endSize": finalKen[2]
			});


			//background_vertical_snapping
			this.slides[ this.currentSlide ].parameters.vertical_snapping = this.background_vertical_snapping.val();
			
			//background_horizontal_snapping
			this.slides[ this.currentSlide ].parameters.horizontal_snapping = this.background_horizontal_snapping.val();
			
			this.elementUnselected();
			
			
			//ELEMENTS
			this.$elementsList.trigger("reset");
			this.slides[ this.currentSlide ].removeElements();
			
		},

		//change slide
		goToSlideProperties: function(e, id){
			if(id != this.currentSlide){
				this.saveSlide();
				this.currentSlide = id;
				this.updateSlide();
			}

			this.changeTab(0);
		},

		//Add slide to ordered list
	    addSlideToList: function(){
	    	var $toAdd = $('<span class="image" style="background-size:36px 24px; width: 36px; background-image: url('+builderPathGlobal+'/images/slider_builder/no_slide.png);"></span><p class="title">Slide '+this.slides.length+'</p><a href="#" data-event="properties" onclick="return false;">Edit properties</a>');
 			
	    	if(this.$slidesList.hasClass("ready"))
 				this.$slidesList.trigger("addItem", [$toAdd]);
 			else
 				this.$slidesList.bind("bindsReady", $.proxy(function(){
 					this.$slidesList.trigger("addItem", [$toAdd]);
 				}, this));
	    },
		
		//MAKES NEW SLIDE
		newSlide: function(){
			//if(!this.loadingImage){
				this.saveSlide();
				this.slides.push(new Slide());
				this.currentSlide = this.slides.length-1;
				
				this.addSlideToList();
				
				this.updateSlide();
				
				this.currentTab = 0;
				this.updateTab();
			//}


			
			return false;
		},
		
		//REMOVES A SLIDE
		removeSlide: function(){
			this.slides = removePositionInArray(this.slides, this.currentSlide);

			this.$slidesList.trigger("removeItem", [this.currentSlide]);
			
			if(this.slides.length == 0)
				this.slides.push(new Slide());
			
			this.updateSlide();

			return false;
		},
		
		//NEXT SLIDE
		nextSlide: function(){
			if(/*!this.loadingImage && */this.currentSlide < this.slides.length-1){
				this.saveSlide();
				this.currentSlide++;
				this.updateSlide();
			}
			return false;
		},
		
	    //PREVIOUS SLIDE
		previousSlide: function(){
			if(/*!this.loadingImage && */this.currentSlide > 0){
				this.saveSlide();
				this.currentSlide--;
				this.updateSlide();
			}
			return false;
		},
		
		
		
		
		
		
		//CHANGE CURRENT SLIDE DURATION
		changeSlideDuration:function(){
			var to = parseFloat(this.$durationInput.val(), 10);
			
			this.slides[this.currentSlide].slideDuration = to;
		},
		
		//GET SLIDER INFO
		info: function(){
			return this.slides.length;
		},
		
		//MAKE HTML
		makeHtml: function(){
			this.saveSlide();
            $("#content").val(this.val());
		},
		
	    //GET SLIDER VAL
	    val: function(){
	        var val = "";
	        
	        //ypos1:50%; 
	        val += "<div id='slider_"+this.id+"' class='slider' rel='";
	        
	        $.each(
	        	this.mainOptionsIds,
	        	function(index, id){
	        		//value
	        		var value = $("#"+id).val();
	        		
	        		val += id + ":" + value + "; ";
	        	}
	        );
	        
	        val += "'><div class='slides'>";
	        
	        for(var i = 0; i < this.slides.length; i++){
	            val += this.slides[i].val();
	        }
	        
	        val += "</div></div>";
	        
	        //alert(val);
	        return val;
	    },
	    
	    //PARSE INITIAL VALUES
	    initialValues: function(){
	        if(this.iniValue != undefined && this.iniValue != ""){
	            //this.val
	            //alert(this.iniValue);
	            var $slider = $(this.iniValue);
	            
	            //SLIDER
	            var sliderRel = stringToObject($slider.attr("rel"));
	            
	            $.each(
		        	this.mainOptionsIds,
		        	function(index, id){
		        		var $inp = $("#"+id);
		        		$inp.val(sliderRel[id]);
		        		$inp.trigger("update").trigger("change");
		        	}
		        );
	            
	            //SLIDES
	            var $slides = $(".slide", $slider);
	            var len = $slides.length;
	            
	            if(len > 0){
	                this.slides = removePositionInArray(this.slides, 0);
	                $slides.each(
	                    $.proxy(function(slideIndex, slideDom){
	                    	var $slide = $(slideDom);
	                    	
	                    	//Make slide
	                        var slide = new Slide();
	                        slide.setVal($slide);
	                        this.slides.push(slide);

	                       	this.addSlideToList();

	                       	var backgroundObj = slide.getBackground();
	                       	if(backgroundObj.type == "image"){
	                       		if(backgroundObj.id != undefined && backgroundObj.id != "")
									jQuery.post(
										adminAjax,
										{
											action : 'get-attachment',
											'id':backgroundObj.id
										},
										$.proxy(function( response ) {

											if(response["data"]["sizes"]["thumbnail"] != undefined)
												this.$slidesList.trigger("changeImage", [slideIndex, response["data"]["sizes"]["thumbnail"]["url"]]);
											else
												this.$slidesList.trigger("changeImage", [slideIndex, response["data"]["sizes"]["full"]["url"]]);
										}, this)
									);
	                       	}
	                       	else
								this.$slidesList.trigger("changeImage", [slideIndex, builderPathGlobal+'/images/slider_builder/video_slide.png']);
	                       	
	                       	
	                        
	                        //Make slide elements
					        var $elements = $slide.find(".slide_elements >*");
					        $elements.each(
					            $.proxy(function(index, element){
					            	var $elementHolder = $(element);
                                    var $element = $elementHolder.find(">*");
					            	
					            	//alert($element.attr("rel"));
					            	var properties = jQuery.parseJSON( $elementHolder.attr("rel") );
					            	if(properties.type == "image"){
					            		//Image element
					            		var element = new SlideElement.ImageElement(slide.elements.length, this.$elements, $element.clone(), properties.iniWidth, properties.iniHeight, (slideIndex===0), properties);
										
										//Save element to slide
										slide.addElement(element);
					            	}
					            	else if(properties.type == "button"){
					            		//Button element
										var element = new SlideElement.ButtonElement(slide.elements.length, this.$elements, $element.clone(), (slideIndex===0), properties);
										
										//Save element to slide
										slide.addElement(element);
					            	}
					            	else{
					            		//Text element
										var element = new SlideElement.TextElement(slide.elements.length, this.$elements, $element.clone(), (slideIndex===0), properties);
										
										//Save element to slide
										slide.addElement(element);
					            	}
					            		
					            	
					            }, this)
					        );
	                    }, this)
	                );
	                this.updateSlide();
	            }
	            else					
	            	//Update Menu
					this.updateMenu();
	        }
	        else
				//Update Menu
				this.updateMenu();
	    }
	};
	
	return SliderEditor;
                    	
});
