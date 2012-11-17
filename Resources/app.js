/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

var TU = require ('/TitanUp/TitanUp');

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

(function() {
	var MenuWindow = require ('/ui/MenuWindow');

	function setTheme ()
	{
		var currTheme = Ti.App.Properties.getString ('currTheme');
		
		switch (currTheme)
		{
			case 'default':
				break;

			case 'blue':
				TU.UI.Theme.backgroundColor = '#449BE8';
				TU.UI.Theme.lightBackgroundColor = '#C6FFFE';
				TU.UI.Theme.darkBackgroundColor = '#5860FF';
				TU.UI.Theme.highlightColor = '#F754FF';
				TU.UI.Theme.textColor = '#6F0BE8';
				break;

			case 'red':
				TU.UI.Theme.backgroundColor = '#BA3D49';
				TU.UI.Theme.lightBackgroundColor = '#F1E6D4';
				TU.UI.Theme.darkBackgroundColor = '#791F33';
				TU.UI.Theme.highlightColor = '#B0AEAB';
				TU.UI.Theme.textColor = '#66605F';
				break;
		}
	}
	
	setTheme ();

	var tg, t, w;

	tg = TU.UI.TGWM.createTabGroup ();
	
	w = new MenuWindow ();
	
	t = Ti.UI.createTab ({
		title: 'Menu',
		window: w
	});
	

	tg.addTab (t);
	
	w = Ti.UI.createWindow ({
		title: "Tab 2",
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	var l1 = Ti.UI.createLabel ({
		text: "This tab window exists for the TGWM demo.",
		color: TU.UI.Theme.textColor
	});
	w.add (l1);
	
	t = Ti.UI.createTab ({
		title: 'Tab 2',
		window: w
	});
	

	tg.addTab (t);
		
	tg.open ();
})();