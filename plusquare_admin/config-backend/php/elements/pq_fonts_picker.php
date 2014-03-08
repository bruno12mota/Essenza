<?php 

class pq_fonts_picker {
	
	var $id;
	
	/*--------------------------------------------------------------------------------------
	*
	*	Plusquare slider picker
	*
	*	@author Plusquare
	*	@date 28-01-13
	* 
	*-------------------------------------------------------------------------------------*/
		
	function __construct($id, $value){
		$this->id = $id;
		
		global $pq_shortname;
		$googleId = get_option($pq_shortname."_google_id");
		
		if($googleId == FALSE){
			echo "<div class='ui_alert'><div class='ui_alert_text'>An error occured loading google app options! Before managing your fonts you need to set up your application, go to 'Apis Settings'>'Google Fonts&Maps api' and follow the indications to do so.</div></div>";
			return;
		}
		
		$url = 'https://www.googleapis.com/webfonts/v1/webfonts?key='.$googleId;
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_REFERER, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		$JSON = curl_exec_follow($ch);
		curl_close($ch);
		
		// You can decode it to process it in PHP
		$data = json_decode($JSON);
		
		if($data == NULL || $data == FALSE){
			echo "<div class='ui_alert'><div class='ui_alert_text'>An error occured loading google app options! Check if the api id you entered at 'Apis Settings'>'Google Fonts&Maps api' is correct. Also make sure you're connected to the internet or this will fail to load as well.</div></div>";
			return;
		}
		else if(isset($data->error)){
			echo "<div class='ui_alert'><div class='ui_alert_text'>You haven't configured your google app correctly, make sure you have checked google fonts in your app for example.</div></div>";
			return;
		}
		
		?>
        <input class="ui-textbox for-text" type="text" value='<?php echo $value; ?>' id="<?php echo $id; ?>" name="<?php echo $id; ?>" style="display:none;"/>
        <div class="fonts_picker" id="<?php echo $id; ?>_picker">
        	<div class="panel">
            	<div class="panel-inner">
            	
		<?php
		
		//Loop fonts
		foreach($data->items as $item){
		?>
        <div class="font grabhand" rel="<?php echo str_replace(" ", "_", $item->family); ?>">
        	<div class="font_title"><a href="#"></a><?php echo $item->family; ?></div>
            <?php 
			$numVariants = count($item->variants);
			if($numVariants > 1){
				?>
				<a class="expand" href="#"></a>
				<?php
			}
			?>
        	<div class="font_formats" rel="<?php echo $item->variants[0]; ?>">
				<?php 
				
				if($numVariants > 1)
					echo count($item->variants)." formats"; 
				else
					echo $item->variants[0];
				?>
            </div>
            
			<?php 
            if($numVariants > 1){
				?>
				<div class="formats_holder">
					<?php
					foreach($item->variants as $variant){
						?>
						<a href="#" class="format selected" rel="<?php echo $variant; ?>"><?php echo $variant; ?></a>
						<?php
					}
					?>
				</div>
				<?php 
			}
            ?>
        </div>
        <?php
		}
		
		?>
        		</div>
        	</div>
            <div class="panel">
            	<div class="panel-inner">
            
        		</div>
            </div>
        </div>
        <script>
			jQuery(document).ready(function ($){
			
				//FontPicker
				require(["ui/FontPicker"],
					function(FontPicker){
						new FontPicker("<?php echo $id; ?>", <?php echo ($value === FALSE || $value === "" ? '{"items":[]}' : $value); ?>);
					}
				);
			
			});
		</script>
		<?php
	}
	
	
}