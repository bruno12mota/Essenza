var esza_url = directory["esza_url"];
var esza_disable_ajax = directory["esza_disable_ajax"];

define(["jquery", "utils/utils"], function($) {
    var popped = false;
    var loadingPage = false;

    var customVars = false;
    var $holder_load;
    var $afterThis_load;
    var idAction_load;

    var backs = [document.URL];

	function changeContent(data){
		var to = 0;
		if(customVars){
			$holder_load.remove();
	        $(data).insertAfter($afterThis_load);
	        to = (idAction_load=="comments" ? $("#comments_replace_content_wraper").offset().top-80 : 0);
		}
		else{
			//Remove current page
	    	$('#page-wraper').remove();
	    	$('#page-wraper-full').remove();
	    	
	    	//New page loaded
	        $(data).insertAfter($("#header"));
		}
        
        //Remove loading state
    	if($("body").hasClass("runtime_javascript_ready") )
    		plusquare_runtime_javascript(true, customVars, to);

    	customVars = false;
		loadingPage = false;
	}
	
	var dynamicLoadingButton = function($obj, $holder, $afterThis, idAction){
		this.href = $obj.attr('href');

		if(this.href == undefined)
			return

		if(this.href.indexOf(esza_url) == -1 || this.href.indexOf(".pdf") != -1 || esza_disable_ajax == "true")
			return;

		$obj.addClass("dynamic_binded");

		this.$holder = $holder;
		this.$afterThis = $afterThis;
		this.idAction = idAction;
		$obj.removeClass("dynamic_loading");

		if(this.idAction == undefined && this.href.indexOf("rel=ajax") > -1){
			this.href = this.href.replace("&rel=ajax","");
			this.href = this.href.replace("?rel=ajax","");
			$obj.attr('href', this.href); 
		}
		else if(this.idAction != undefined){
			this.href = this.href.replace("&rel=ajax","");
			this.href = this.href.replace("?rel=ajax","");
			this.href = this.href.replace("&rel="+this.idAction, "");
			this.href = this.href.replace("?rel="+this.idAction,"");
			$obj.attr('href', this.href); 
		}

		$obj.bind(clickBind, $.proxy(this.onClick, this) );

	}

	var loadUrlDynamic = function(pageurl){
		loadingPage = true;
        popped = true;

        //Add loading state
        contentLoadingIn();

        //get the link location that was clicked
        if(pageurl.indexOf("rel=") === -1){
			var action = customVars ? idAction_load : "ajax";
	        var loadUrl = pageurl+'?rel='+action;

	        var regexStr = ".*?\\?(.+\\=.+)+";
	        var regex = new RegExp(regexStr, "gi");
	        var matched = pageurl.match(regex);

	        var regStr = "\\#.+";
	        var regx = new RegExp(regStr, "gi");
	        var match = pageurl.match(regx);

	        if(match != null){
	        	var hash = match[0];
				pageurl = pageurl.substring(0, pageurl.length-hash.length);
			}

	        if(matched != null)
	            loadUrl = pageurl+'&rel='+action;
	        else
				loadUrl = pageurl+'?rel='+action;

			if(match != null)
				loadUrl += match[0];
		}
		else{
			var loadUrl = pageurl;
			pageurl = pageurl.replace("&rel=ajax","");
			pageurl = pageurl.replace("?rel=ajax","");
			if(idAction_load != undefined){
				pageurl = pageurl.replace("&rel="+idAction_load,"");
				pageurl = pageurl.replace("?rel="+idAction_load,"");
			}
		}
		
		  
        //Load new page
        $.ajax({url:loadUrl ,success: changeContent});
        
    
        //to change the browser URL to the given link location
        if(pageurl!=window.location){
        	if ( window.history.pushState != undefined )
            	window.history.pushState({path:pageurl},'',pageurl);
        }
        backs.push(pageurl);
	}

	dynamicLoadingButton.prototype = {
		onClick:function(e){
			e.preventDefault();
	        /*
	        if uncomment the above line, html5 nonsupported browers won't change the url but will display the ajax content;
	        if commented, html5 nonsupported browers will reload the page to the specified link.
	        */
	       
	       	if(!loadingPage){

		    	if(this.idAction != undefined){
		    		$holder_load = this.$holder;
		    		$afterThis_load = this.$afterThis;
		    		idAction_load = this.idAction;
		    		customVars = true;
		    	}
		    	else{
		    		customVars = false;
		    	}

				loadUrlDynamic(this.href);
			}
	    
	        return false;
		}
		
	}
	
	//For menu links
	$(document).ready(function(){
		$("#menu a").each(function(){
			new dynamicLoadingButton($(this));
		});

		$("#menu_mobile a").each(function(){
			new dynamicLoadingButton($(this));
		});


		$("#searchform").submit(function(e){
			var search = $(this).find("#search").val();

			if(search == ""){
				e.preventDefault();
				return false;
			}

			var href= $(this).attr("action");
			
		    $("#search_info").trigger("close");

			var url = href+"?s="+search;
			var load = url+'&rel=ajax';

			loadUrlDynamic(url, load);

			return false;
		});
		
	    /* the below code is to override back button to get the ajax content without page reload*/
	    $(window).bind('popstate', function(e) {
	    	if(!popped){
	    		popped = true;
	    		return;
	    	}

	    	if(backs.length == 1){
	    		return true;
	    	}

        	backs.pop();
	    	var to = backs[backs.length-1];

        	if(backs.length > 0)
        		backs.pop();
	    	
	        //load page
			loadUrlDynamic(to);

	    });
	});
	
    
    return dynamicLoadingButton;
});