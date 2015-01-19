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
	TU.getLocationManager ().init (30);

	function setTheme ()
	{
		var currTheme = Ti.App.Properties.getString ('currTheme');
		
		switch (currTheme)
		{
			case 'default':
				break;

			case 'blue':
				TU.UI.Theme.lightBackgroundColor = '#fff';
				TU.UI.Theme.mediumBackgroundColor = '#BBDEFB';
				TU.UI.Theme.darkBackgroundColor = '#1976D2';
				TU.UI.Theme.highlightColor = '#8BC34A';
                TU.UI.Theme.darkTextColor = '#212121';
                TU.UI.Theme.lightTextColor = '#fff';
				break;

			case 'red':
				TU.UI.Theme.lightBackgroundColor = '#fff';
                TU.UI.Theme.mediumBackgroundColor = '#FFCDD2';
				TU.UI.Theme.darkBackgroundColor = '#D32F2F';
				TU.UI.Theme.highlightColor = '#FF9800';
				TU.UI.Theme.darkTextColor = '#212121';
                TU.UI.Theme.lightTextColor = '#fff';
				break;
		}
	}
	
	// disable the drawer's "open by default" behavior
	Ti.App.Properties.setBool ("General.drawer_opened", true);
	 
	setTheme ();

	var wm, t, w;
	
	var mitems = [
	    { identifier: "TU.Device", caption: "TU.Device" },
        { identifier: "TU.Globals", caption: "TU.Globals" },
        { identifier: "TU.LocationManager", caption: "TU.LocationManager" },
        { identifier: "TU.UI", caption: "TU.UI" }
	];
	
	var main_view = Ti.UI.createView ({
	    backgroundColor: TU.UI.Theme.lightBackgroundColor
	});

    var l = Ti.UI.createLabel ({
        left: 10,
        right: 10,
        top: 10,
        text: "Welcome to the TitanUp demo application.  To see some of the capabilities of the library, select an option from the drawer menu on the left.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    main_view.add (l);

	wm = TU.UI.createDrawerMenuWM ({
            title: "TitanUp",
            backgroundColor: TU.UI.Theme.backgroundColor,
            main_view: main_view,
            menu_params: {
                background_color: TU.UI.Theme.darkBackgroundColor
            },
            ios_options: {
                bar_color: TU.UI.Theme.darkBackgroundColor, // ios-only
                bar_text_color: 'white'
            },
            menu_items: mitems
        });
	
    function on_menu_item_selected (e)
    {
        var v = null;
        switch (e.identifier)
        {
            case 'TU.Device':
                var DeviceDemoView = require ('/ui/DeviceDemoView');
                v = new DeviceDemoView ();
                break;

            case 'TU.Globals':
                var GlobalsDemoView = require ('/ui/GlobalsDemoView');
                v = new GlobalsDemoView ();
                break;

            case 'TU.LocationManager':
                // open the LocationDemoView in a new window; there are problems
                // with the Drawer Menu and Map views
                var LocationDemoView = require ('/ui/LocationDemoView');
                v = new LocationDemoView ();
                var w = Ti.UI.createWindow ();
                w.add (v);
                TU.UI.openWindow (w);
                v = null;
                break;

            case 'TU.UI': 
                var UIDemoView = require ('/ui/UIDemoView');
                v = new UIDemoView ();
                break;
        }
        if (v)
        {
            wm.replaceView (v);
        }
    }
	
	wm.addEventListener ('menu_item_selected', on_menu_item_selected);
	
	wm.open ();

})();