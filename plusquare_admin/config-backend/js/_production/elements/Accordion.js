define(["jquery"], function($){
	var Accordion = function ($this, pathToElem){
		this.closed = pathToElem+"accordion_closed.png";
		this.opened = pathToElem+"accordion_opened.png";
		
		$this.css({
			"display":"block",
			"width":"100%",
			"position":"relative"
		});
	
		this.$ul = $("<ul></ul>").appendTo($this);
	}
	
	Accordion.prototype = {
		add: function(headline, $content, opened){
			var $li = $("<li></li>").css({
				"position":"relative",
				"overflow":"hidden"
			}).appendTo(this.$ul);
			
			
			//HEADLINE
			var $head = $("<a href='#'></a>").appendTo($li).css({
				"text-decoration":"none",
				"display":"block", 
				"margin-bottom":"5px",
				"overflow":"hidden"
			});
			
			var $headline = $("<div><img src='"+this.closed+"' style='width:19px; height:19px; margin-right:10px; position:relative; top:4px;'/>"+headline+"</div>").css({
				"background-color":"#ffffff",
				"float":"left",
				"padding-right":"14px"
			}).appendTo($head);
			processFont($headline, 'AllerBold', "#111111", 13);
			
			$("<div></div>").css({
				"border-bottom":"1px solid #E6E6E6",
				"height":"13px"
			}).appendTo($head);
			
			$content.appendTo($li).css({
				"margin-bottom":"10px",
				"margin-top":"10px"
			});
			
			if(!opened)
				$content.css("display", "none");
				
			var $img = $("img", $headline);
	
			$head.click($.proxy(function(e){
				e.preventDefault();
				
				$content.not(':animated').slideToggle(150, $.proxy(function(){
					if ($content.is(':hidden'))
				    	$img.attr("src", this.closed);
					else 
				    	$img.attr("src", this.opened);
					
					return false;
				}, this));
				
				if ($content.is(':hidden'))
			    	$img.attr("src", this.closed);
				else 
			    	$img.attr("src", this.opened);
				
				return false;
		    }, this));
		}
	}
	
	return Accordion;
});
