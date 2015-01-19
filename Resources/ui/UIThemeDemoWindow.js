var TU = require ('/TitanUp/TitanUp');

function UIThemeDemoWindow ()
{
	var _self = Ti.UI.createWindow ({
		title: 'TU.UI.Theme',
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var margin = 10;
	
	var themes = ['default', 'blue', 'red'];

	// make sure width is divisible by the number of themes; this has to do with buggy rounding in
	// percentage-based widths (SelectBar uses percentage-based widths to
	// size its buttons on android)
	var ctlwidth = parseInt (TU.Device.getDisplayWidth () - 4 * margin);
    ctlwidth = ctlwidth - (ctlwidth % themes.length);
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});
	
	var l, iv;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "TU.UI.Theme provides a standardized place to define colors and fonts used in your application; all it really does is bring a little structure to this process.  This demo allows you to change the theme of the app -- there's no magic here, you have to restart to see the changes, but as you can see it makes the process fairly clean.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
	});

	contentview.add (l);
	
	var _currTheme = Ti.App.Properties.getString ('currTheme');
	
	if (_currTheme == '')
	{
		_currTheme == 'default';
	}

	var _sbTheme = TU.UI.createSelectBar ({
		left: margin,
		top: margin,
		width: ctlwidth,
		labels: themes,
        allow_deselect: false
	});

	for (var i = 0; i < themes.length; i++)
	{
		if (_currTheme == themes[i])
		{
			_sbTheme.xsetSelectedIndex (i);
			break;
		}
	}
	
	_sbTheme.addEventListener ('TUchange', function (e) {
		var idx = _sbTheme.xgetSelectedIndex ();
		
		Ti.App.Properties.setString ('currTheme', themes[idx]);

		alert ("Restart app to see new theme");		
	});
	
	contentview.add (_sbTheme);
	
	
	_self.add (contentview);
	
	
	return _self;
}

module.exports = UIThemeDemoWindow;
