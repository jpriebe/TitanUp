var TU = require ('/TitanUp/TitanUp');

var _numInstances = 0;

function CountingWindow ()
{
	var _self = null;
	
	_self = Ti.UI.createWindow ({
		title: 'TU.UI.EventThrottle',
		backgroundColor: TU.UI.Theme.backgroundColor	
	});
	
	_numInstances++;
	
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
	
	var l, btn;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "Instance number " + _numInstances,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold
	});
	
	contentview.add (l);
	
	_self.add (contentview);
	
	return _self;
}

module.exports = CountingWindow;
