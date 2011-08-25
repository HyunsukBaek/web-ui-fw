/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */

(function($, window, undefined) {
	$.widget("mobile.progressbar", $.mobile.widget, {
		options: { 
			value		: 0,
			max			: 100,
			duration	: 20000,
		},
				
		data: {
			uuid		: 0,
			bar         : 0,
			box			: 0
		},		
		
		_value: function() {
			return  (this.options.value);
		},
		
		_refreshValue: function(now) {
			this.options.value = parseInt(now);
			console.log("value = " + parseInt(this._value()));
		},
		
		
		startProgress: function(value) {
			var obj = this;
			this.data.bar.animate({
				    width: '100%'
				  	}, {
					    duration :this.options.duration,
					    specialEasing : {
					    width: 'linear',
					   }, 
						complete: function() {
					   		//alert("animation completed : value is: " + parseInt(obj._value()));
					   		// callback function here		
					  },
					  step : function( now, fx ) {
					  	  obj._refreshValue(now);
					  },
			  	   }
			  	 );
		},		
		
		_create: function() {
			var container = this.element;
			var obj = this;
			
			/* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            var myUUID = this.data.uuid;
            
            container.attr("id", "ui-progressbar-container" + this.data.uuid);
            
            console.log("creating ui-progressbar-container with id " + this.data.uuid);  
			
			var upperProgressBarContainer = $.createUpperProgressBarContainer();
			upperProgressBarContainer.attr("id", "ui-upper-progressbar-container");
			
			$('<div/>', {
				id: 'text1',
				text: 'TextText',								
			}).appendTo(upperProgressBarContainer);
			
			$('<div/>', {
				id: 'progressbar',
														
			}).appendTo(upperProgressBarContainer);			
			
				
			$('<span/>', {
				id: 'text2',
				text: 'Text',								
			}).appendTo(upperProgressBarContainer);
			
			$('<span/>', {
				id: 'text3',
				text: 'TextTextTextText',								
			}).appendTo(upperProgressBarContainer);			
			
			
			var cancelContainer = $("<div/>", {
				id: "cancel-container"
			});
			
			$('<div/>', {
				id: 'cancel-button',
				text: 'Cancel',
				'data-role': 'button',
				'data-inline': true,			
			}).appendTo(cancelContainer);
			
			
			container.append(upperProgressBarContainer);
			container.append(cancelContainer);	
			
			
			this.data.box = $('<div/>', {
					id: 'boxImgId',					
				}).appendTo(progressbar);
							
			this.data.bar = $('<div/>', {
					id: 'barImgId',					
				}).appendTo(progressbar);			
							
			
							
			cancelContainer.find('#cancel-button').click(function() {
				//alert("cancel button clicked");
				if (obj.data.bar.is(':animated')) {
					obj.data.bar.stop();
				};
				obj.options.value =  parseInt(parseInt(obj.data.bar.css('width')) / parseInt(obj.data.box.css('width')) * 100 );
				alert("value=" + obj.options.value);
			}); // end of click		
			
			/* caller of the progress bar widget should start the progressbar using startProgress */
			obj.startProgress();	
						
		},			
	}); /* End of widget */
	
	var now = new Date();
    $($.mobile.progressbar.prototype.data.uuid = now.getTime());
	
})(jQuery, this);