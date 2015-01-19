var TU = require ('/TitanUp/TitanUp');

function UIViewsSimplePickerDemoWindow ()
{
	var _sp1, _lEvent;
	
	var _self = Ti.UI.createWindow ({
		title: 'TU.UI.Views.SimplePicker',
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var margin = 10;
	var imgw = 240;
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});
	
	var l;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "TU.UI.Views.SimplePicker is an android/ios implementation of a dropdown list; it allows you to have a picker that doesnt take up half the screen on iOS.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
	});

	contentview.add (l);
	
	_sp1 = TU.UI.createSimplePicker ({
		left: margin,
		right: margin,
		top: margin,
		title: "Your Choice",
		values: ['foo', 'bar', 'baz'],
		parent: _self
	});
	
	_sp1.addEventListener ('TUchange', function (e) {
		_lEvent.text = "[TUchange] value: " + e.value;
	});
	
	contentview.add (_sp1);
	
	_lEvent = Ti.UI.createLabel ({
		top: margin,
		left: margin,
		text: "",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
	});
	
	contentview.add (_lEvent);
		
	_self.add (contentview);
	
	return _self;
}

module.exports = UIViewsSimplePickerDemoWindow;
