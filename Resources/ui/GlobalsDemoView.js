var TU = require ('/TitanUp/TitanUp');

function GlobalsDemoView ()
{
	var _self = null;
	var _tf_var1 = null;
	var _tf_var2 = null;
	var _tf_var3 = null;
	
	var _var1 = (typeof TU.Globals.var1 == 'undefined') ? '' : TU.Globals.var1;
	var _var2 = (typeof TU.Globals.var2 == 'undefined') ? '' : TU.Globals.var2;
	var _var3 = (typeof TU.Globals.var3 == 'undefined') ? '' : TU.Globals.var3;
	
	_self = Ti.UI.createView ({
	    top: 0,
	    left: 0,
	    right: 0,
	    bottom: 0,
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var margin = 10;
	var tabstop = 80;
	var tfheight = 40;
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});

	_self.add (contentview);
		
	var v, l;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "Values are saved as they are entered; select another menu option and return to this page, and the values should be reinstated.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold
    });
    
    v.add (l);
    
    _tf_var1 = TU.UI.createTextField ({
        paddingLeft: 4,
        paddingRight: 4,
        height: tfheight,
        backgroundColor: TU.UI.Theme.mediumBackgroundColor,
    	left: tabstop,
    	color: TU.UI.Theme.darkTextColor,
    	right: 0,
    	value: _var1,
		height: tfheight
    });
    
    if (typeof _tf_var1.wrapper !== 'undefined')
    {
        v.add (_tf_var1.wrapper);
    }
    else
    {
        v.add (_tf_var1);
    }

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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold
    });
    
    v.add (l);
    
    _tf_var2 = TU.UI.createTextField ({
        paddingLeft: 4,
        paddingRight: 4,
        height: tfheight,
        backgroundColor: TU.UI.Theme.mediumBackgroundColor,
        left: tabstop,
        color: TU.UI.Theme.darkTextColor,
    	right: 0,
    	value: _var2,
		height: tfheight
    });
    
    if (typeof _tf_var2.wrapper !== 'undefined')
    {
        v.add (_tf_var2.wrapper);
    }
    else
    {
        v.add (_tf_var2);
    }
    
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold
    });
    
    v.add (l);
    
    _tf_var3 = Ti.UI.createTextField ({
        paddingLeft: 4,
        paddingRight: 4,
        height: tfheight,
        backgroundColor: TU.UI.Theme.mediumBackgroundColor,
    	left: tabstop,
        color: TU.UI.Theme.darkTextColor,
    	right: 0,
    	value: _var3,
		height: tfheight
    });
    
    if (typeof _tf_var3.wrapper !== 'undefined')
    {
        v.add (_tf_var3.wrapper);
    }
    else
    {
        v.add (_tf_var3);
    }
    
	contentview.add (v);
	
	function save_values () {
		TU.Globals.var1 = _tf_var1.value;
		TU.Globals.var2 = _tf_var2.value;
		TU.Globals.var3 = _tf_var3.value;
	}
	
	_tf_var1.addEventListener ('change', save_values);
    _tf_var2.addEventListener ('change', save_values);
    _tf_var3.addEventListener ('change', save_values);
	
	return _self;
}

module.exports = GlobalsDemoView;
