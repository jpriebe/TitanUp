var TU = require ('/TitanUp/TitanUp');

function UITGWMDemoWindow ()
{
	var _self = Ti.UI.createWindow ({
		title: 'TU.UI.TGWM',
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		borderRadius: margin,
		borderColor: TU.UI.Theme.textColor,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});
	
	var l, iv;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "TU.UI.TGWM provides a mechanism to open and close windows within a TabGroup in a safe, cross-platform way.  It also provides the tabactive and tabinactive events when tabs are switched.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.small
	});

	contentview.add (l);
		
	if (TU.Device.getOS () == 'android')
	{
		var btn1 = Ti.UI.createButton ({
			title: "Open win",
			left: margin,
			right: margin,
			top: margin
		});
		
		btn1.addEventListener ('click', function (e) {
			var w = Ti.UI.createWindow ({
				title: "New Window",
				backgroundColor: TU.UI.Theme.backgroundColor
			});
			var l1 = Ti.UI.createLabel ({
				text: "Use 'back' to close this window.",
				color: TU.UI.Theme.textColor
			});
			w.add (l1);
			TU.UI.TGWM.openWindow (w);
		});
		
		contentview.add (btn1);
	}
	if (TU.Device.getOS () == 'ios')
	{
		var btn1 = Ti.UI.createButton ({
			title: "Open win, stay open",
			left: margin,
			right: margin,
			top: margin
		});
		
		btn1.addEventListener ('click', function (e) {
			var w = Ti.UI.createWindow ({
				title: "Stay open",
				backgroundColor: TU.UI.Theme.backgroundColor
			});
			var l1 = Ti.UI.createLabel ({
				text: "This window will stay open when you switch to Tab 2 and return; use 'back' to close it.",
				color: TU.UI.Theme.textColor
			});
			w.add (l1);
			TU.UI.TGWM.openWindow (w);
		});
		
		contentview.add (btn1);
	
		var btn2 = Ti.UI.createButton ({
			title: "Open win, auto-close",
			left: margin,
			right: margin,
			top: margin
		});
		
		btn2.addEventListener ('click', function (e) {
			var w = Ti.UI.createWindow ({
				title: "Auto-close",
				backgroundColor: TU.UI.Theme.backgroundColor
			});
			var l1 = Ti.UI.createLabel ({
				text: "This window will close automatically when you switch to Tab 2 and return; you can also use 'back' to close it.",
				color: TU.UI.Theme.textColor
			});
			w.add (l1);
			TU.UI.TGWM.openWindow (w);
			TU.UI.TGWM.closeOnTabInactive (w);
		});	
		
		contentview.add (btn2);
	}

	
	var btn3 = Ti.UI.createButton ({
		title: "Register for tab events",
		left: margin,
		right: margin,
		top: margin
	});
	
	var onTabActive = function (e)
	{
		var t = TU.UI.TGWM.getActiveTab ();
		//Ti.API.info ("tab active: " + t.title);
		alert ("tab active: " + t.title);
	}
	
	var onTabInactive = function (e)
	{
		var t = TU.UI.TGWM.getActiveTab ();
		//Ti.API.info ("tab inactive; active tab: " + t.title);
		alert ("tab inactive; active tab: " + t.title);
	}
	
	_self.addEventListener ('tabactive', onTabActive);
	_self.addEventListener ('tabinactive', onTabInactive);

    var _registered = false;
	btn3.addEventListener ('click', function (e) {
		// note that you have to listen to these events on the *first* window in the 
		// tab's stack of windows (the one that was originally attached to the tab)
		var t = TU.UI.TGWM.getActiveTab ();
		var tw = t.getWindow();
		if (!_registered)
		{
			tw.addEventListener ('tabactive', onTabActive);
			tw.addEventListener ('tabinactive', onTabInactive);
			
			alert ("You will now receive active/inactive events when you switch tabs.");
			
			btn3.title = "De-register for tab events";
			_registered = true;
		}
		else
		{
			tw.removeEventListener ('tabactive', onTabActive);
			tw.removeEventListener ('tabinactive', onTabInactive);
			
			alert ("Tab events de-registered.");

			btn3.title = "Register for tab events";
			_registered = false;
		}
	});	
	
	contentview.add (btn3);
	
	_self.add (contentview);
		
	return _self;
}

module.exports = UITGWMDemoWindow;
