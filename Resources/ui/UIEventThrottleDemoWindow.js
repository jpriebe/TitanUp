var TU = require ('/TitanUp/TitanUp');

var CountingWindow = require ('/ui/CountingWindow');


function UIEventThrottleDemoWindow ()
{
	var _self = null;
	
	_self = Ti.UI.createWindow ({
		title: 'TU.UI.EventThrottle',
		backgroundColor: TU.UI.Theme.lightBackgroundColor	
	});
	
	var margin = 10;
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		layout: 'vertical'
	});
	
	var l, btn;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "Button clicks to open new windows can be double-triggered with a quick second tap before the window opens.  Titanium doesn't prevent that, but the EventThrottle can 'debounce' those events'.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
	});
	
	contentview.add (l);
	
	btn = Ti.UI.createButton ({
		left: margin,
		right: margin,
		top: margin,
		title: "Unthrottled"
	});

	btn.addEventListener ('click', function (e) {        
        var w = new CountingWindow ();
        TU.UI.openWindow (w);
	});
	
	contentview.add (btn);
	
	var et = new TU.UI.EventThrottle ();
	
	btn = Ti.UI.createButton ({
		left: margin,
		right: margin,
		top: margin,
		title: "Throttled"
	});
	
	btn.addEventListener ('click', function (e) {
        if (!et.shouldFire())
        {
            return;
        }
                
        var w = new CountingWindow ();
        et.setWindow (w);
        TU.UI.openWindow (w);
	});
	
	contentview.add (btn);
	
	_self.add (contentview);
	
	return _self;
}

module.exports = UIEventThrottleDemoWindow;
