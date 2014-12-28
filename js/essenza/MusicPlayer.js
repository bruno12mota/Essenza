var $ = jQuery;
			
var SlidingText = function($holder){
	this.position = 0;
	this.time = 1000;
	
	this.$holder = $holder;
	this.$slide = $holder.find(".sliding_text");
		
	this.$holder.bind(mouseOverBind, $.proxy(this.startTween, this));
	this.$holder.bind(mouseOutBind, $.proxy(this.stopTween, this));
}
SlidingText.prototype = {
	startTween: function(){
		this.overplus = this.$slide.width() - this.$holder.width();
		this.time = 50*this.overplus;
		
		if(this.overplus > 0)
			this.tweenLeft();
	},
	tweenLeft: function(){
		this.$slide.stop().animate({"left":-this.overplus+"px"}, this.time, $.proxy(this.tweenRight, this));
	},
	tweenRight: function(){
		this.$slide.stop().animate({"left":0+"px"}, this.time, $.proxy(this.tweenLeft, this));
	},
	stopTween: function(){
		this.$slide.stop().animate({"left":"0px"}, 500);
	}
}

var MusicPlayer = function($player, url){
	jQuery(document).ready(	$.proxy(function ($){
		//Save variables
		this.defaultVolume = 70;
		this.url = url;
		this.$player = $player;
		
		//Play&Pause button
		this.$tooglePlay = this.$player.find(".tooglePlay");
		
		//Volume
		this.$bar1 = this.$player.find(".volume_bar1");
		this.$bar2 = this.$player.find(".volume_bar2");
		this.$toogleMute = this.$player.find(".toogleMute");
		this.$volActiveBar = this.$player.find(".volume_bar_holder .active_bar");
		this.$volBar = this.$player.find(".volume_bar_holder");
		
		//progress bars
		this.$streamBar = this.$player.find(".stream_bar");
		this.$progressBar = this.$player.find(".progress_bars .active_bar");
		this.$progressBars = this.$player.find(".progress_bars");
		
		//progress labels
		this.$durationLabel = this.$player.find(".duration");
		this.$currentLabel = this.$player.find(".current_position");
		
		//Bind events
		this.$toogleMute.click($.proxy(this.toogleMute, this));
		this.$tooglePlay.click($.proxy(this.tooglePlay, this));
		this.$volBar.bind(mouseDownBind, $.proxy(this.volumeBarDown, this));
		this.$streamBar.click($.proxy(this.progressBarClick, this));
		this.$progressBar.click($.proxy(this.progressBarClick, this));
		
		this.$rightComp=this.$player.find(".component.right");
		
        $(window).resize($.proxy(this.window_resize_timeout, this));

		//Listen for window resize
		$player.bind("playerResize", $.proxy(this.windowResized, this));
        $player.bind("playerResize", $.proxy(this.window_resize_timeout, this));
		
		this.windowResized();
		
		new SlidingText(this.$player.find(".song_artist"));
		new SlidingText(this.$player.find(".song_title"));
		
		//Listen for sound manager ready state
		soundManager.onready($.proxy(this.createSound, this));
    }, this));
}

MusicPlayer.prototype = {
	window_resize_timeout: function(){
		clearTimeout(this.resize_timeout);
        this.resize_timeout = setTimeout($.proxy(this.windowResized, this), 200);
	},

	//On window resize
	windowResized: function(){
		var width = this.$player.width();

		this.$player.removeClass("stage1 stage2 stage3");
		
		if(width < 450)
			this.$player.addClass("stage1");
		
		if(width < 390)
			this.$player.addClass("stage2");
		
		if(width < 330)
			this.$player.addClass("stage3");
	},
	
	
	//When progress bar is clicked
	progressBarClick: function(e){
		if(this.sound.playState === 1){
			//Is buffering or playing
			var barsPosition, streamWidth;

			if(this.$player.hasClass("stage3")){
				barsPosition = this.$progressBars.eq(1).offset().left;
				streamWidth = this.$streamBar.eq(1).width();
			}
			else{
				barsPosition = this.$progressBars.eq(0).offset().left;
				streamWidth = this.$streamBar.eq(0).width();
			}

			var position = e.pageX;
			
			var percStream = (position-barsPosition)/streamWidth;
			var goTo = percStream * this.sound.duration;
			
			//Set music position
			this.sound.setPosition(goTo);
		}
		
		return false;
	},
	
	//Change volume according to bar position
	volumeBarChange: function(position){
		var volumeBarWidth = 50;
		
		if(position < 0)
			position = 0;
		else if(position > 50)
			position = 50;
		
		var perc = Math.round((position / 50) * 100);
		
		//Set sound volume
		this.sound.setVolume(perc);
		
		if(this.sound.muted && this.sound.volume > 0)
			this.sound.unmute();
		else if(!this.sound.muted && this.sound.volume == 0)
			this.sound.mute();
		
		//update graphicss
		this.changeVolume(false);
	},
	
	//When volume bar has been clicked (Mouse down)
	volumeBarDown: function(e){
		this.barPosition = this.$volBar.offset().left;
		this.currentPosition = e.pageX;
		
		this.volumeBarChange(this.currentPosition - this.barPosition);
		
		$(document).bind(mouseMoveBind, $.proxy(this.volumeBarMove, this));
		$(document).bind(mouseUpBind, $.proxy(this.mouseUp, this));
		
		return false;
	},
	
	//On mouse move when changing volume
	volumeBarMove: function(e){
		this.currentPosition = e.pageX;
		
		//Update bar
		this.volumeBarChange(this.currentPosition - this.barPosition);
		
		return false;
	},
	
	//On mouse up
	mouseUp: function(){
		unbindMoveAndUp();
		
		return false;
	},
	
	//Finished sound
	stoppedSound: function(){
		this.changePlayingStatus();
	},
	
	//While loading sound (update stream bar)
	whileloading: function(){
		var percentage = this.sound.bytesLoaded / this.sound.bytesTotal;
				
		this.$streamBar.css("width", percentage*100+"%");
		
		var secondsPassed = Math.round(this.sound.duration/1000);
		var minutesPassed = 0;
		if(secondsPassed >= 60){
			minutesPassed = Math.floor(secondsPassed/60);
			secondsPassed = secondsPassed - minutesPassed*60;
		}
		
		this.$durationLabel.text(
			(minutesPassed < 10 ? "0"+minutesPassed : minutesPassed) + ":" + 
			(secondsPassed < 10 ? "0"+secondsPassed : secondsPassed));
	},
	
	
	//While playing sound (update progress bar and labels)
	whileplaying: function(){
		var percentage;
				
		if(this.sound.loaded)
			percentage = this.sound.position / this.sound.duration;
		else
			percentage = this.sound.position / this.sound.durationEstimate;
		this.$progressBar.css("width", percentage*100+"%");
		
		var secondsPassed = Math.round(this.sound.position/1000);
		var minutesPassed = 0;
		if(secondsPassed >= 60){
			minutesPassed = Math.floor(secondsPassed/60);
			secondsPassed = secondsPassed - minutesPassed*60;
		}
		
		this.$currentLabel.text(
			(minutesPassed < 10 ? "0"+minutesPassed : minutesPassed) + ":" + 
			(secondsPassed < 10 ? "0"+secondsPassed : secondsPassed));



		if(!this.$player.is(":visible")) 
			this.sound.destruct();
	},
	
	
	//Create sound manager instance
	createSound: function(){
		var uniqueId = "id"+Math.floor( Math.random()*99999 );
		this.$player.attr("id", uniqueId);
		this.sound = soundManager.createSound({
			id: uniqueId,
			url: this.url,
			autoLoad: false,
			autoPlay: false,
			onfinish: $.proxy(this.stoppedSound, this),
			
			//Stream Bar
			whileloading: $.proxy(this.whileloading, this),
			
			//Progress Bar
			whileplaying: $.proxy(this.whileplaying, this),
			
			//Initial volume
			volume: this.defaultVolume
		});
		this.changePlayingStatus();
		this.changeVolume();
    },
    
    //Change volume
    changeVolume: function (animate){
		var vol = this.sound.muted ? 0 : this.sound.volume; //0-100
		
		var time = 200;
		if(animate === false)
			time = 1;
		
		//Change sound bars opacity
		if(vol == 0)
			//Muted
			this.$toogleMute.addClass("muted");
		else{
			//Not muted
			this.$toogleMute.removeClass("muted");
			if(vol < 50){
				// < 50
				this.$bar1.stop().fadeTo(time, vol/50);
				this.$bar2.stop().fadeTo(time, 0);
			}
			else{
				// >= 50
				this.$bar1.stop().fadeTo(time, 1);
				this.$bar2.stop().fadeTo(time, (vol-50)/50);
			}
		}
		
		//change bars size
		this.$volActiveBar.stop().animate({"width": vol+"%"}, time);
	},
	
	//Toogle mute state
	toogleMute: function(){
		//toogle sound mute
		this.sound.toggleMute();
		
		if(!this.sound.muted && this.sound.volume == 0)
			this.sound.setVolume(this.defaultVolume);
		
		//update volume graphics
		this.changeVolume();
		
		return false;
	},
	
	
	//Toogle play state
	tooglePlay: function(){
		//toogle sound mute
		this.sound.togglePause();
		
		//update play graphics
		this.changePlayingStatus();
		
		return false;
	},
	
	//On playing status change
	changePlayingStatus: function(){
		if(this.sound.paused || this.sound.playState === 0){
			//its paused (show play graphic)
			this.$tooglePlay.removeClass("playing");
		}
		else{
			//Playing, show pause graphic
			this.$tooglePlay.addClass("playing");
		}
		
	}
}
    
module.exports = MusicPlayer;
