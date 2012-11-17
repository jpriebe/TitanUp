var TU = require ('/TitanUp/TitanUp');

function GlobalsDemoWindow ()
{
	var _self = null;
	var _tf_var1 = null;
	var _tf_var2 = null;
	var _tf_var3 = null;
	
	var _var1 = (typeof TU.Globals.var1 == 'undefined') ? '' : TU.Globals.var1;
	var _var2 = (typeof TU.Globals.var2 == 'undefined') ? '' : TU.Globals.var2;
	var _var3 = (typeof TU.Globals.var3 == 'undefined') ? '' : TU.Globals.var3;
	
	_self = Ti.UI.createWindow ({
		title: 'TU.Globals',
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	var tabstop = TU.UI.Sizer.getDimension (80);
	var tfheight = TU.UI.Sizer.getDimension (32);
	
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

	_self.add (contentview);
		
	var v, l;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "Values are saved when this window is closed; open another instance of this window, and the values are available via TU.Globals.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.small
	});
	
	contentview.add (l);
	
	v = Ti.UI.createView ({
		left: margin,
		right: margin,
		top: margin,
		height: tfheight
	});
	
	l = Ti.UI.createLabel ({
		left: 0,
        text: 'var1:',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold
    });
    
    v.add (l);
    
    _tf_var1 = Ti.UI.createTextField ({
    	left: tabstop,
    	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    	right: 0,
    	value: _var1,
		height: tfheight
    });
    
    v.add (_tf_var1);

	contentview.add (v);
	
	v = Ti.UI.createView ({
		left: margin,
		right: margin,
		top: margin,
		height: tfheight
	});
	
	l = Ti.UI.createLabel ({
		left: 0,
        text: 'var2:',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold
    });
    
    v.add (l);
    
    _tf_var2 = Ti.UI.createTextField ({
    	left: tabstop,
    	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    	right: 0,
    	value: _var2,
		height: tfheight
    });
    
    v.add (_tf_var2);

	contentview.add (v);
	
	v = Ti.UI.createView ({
		left: margin,
		right: margin,
		top: margin,
		height: tfheight
	});
	
	l = Ti.UI.createLabel ({
		left: 0,
        text: 'var3:',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold
    });
    
    v.add (l);
    
    _tf_var3 = Ti.UI.createTextField ({
    	left: tabstop,
    	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    	right: 0,
    	value: _var3,
		height: tfheight
    });
    
    v.add (_tf_var3);

	contentview.add (v);
	
	_self.addEventListener ('close', function (e) {
		TU.Globals.var1 = _tf_var1.value;
		TU.Globals.var2 = _tf_var2.value;
		TU.Globals.var3 = _tf_var3.value;
	});
	
	return _self;
}

module.exports = GlobalsDemoWindow;
