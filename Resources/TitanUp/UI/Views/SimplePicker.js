var TU = null;

/**
 * A class that makes a simple cross-platform picker.
 * 
 * Fires event: 'change' event object contains properties 'value', 'caption', and 'index'
 */

var _os = '';

function PickerPopup (bgcolor, highlight_bgcolor, color, highlight_color, values, selected_value)
{
	var _self = null;
    var _content_view = null;
	var _values = values;
	var _value = '';
	var _selidx = -1;
	
	var _tv_values = null;
    var _tv_rows = null;
	var _btn_cancel = null;

	var params = {
		backgroundColor: '#fff',
        width: '80%',
        height: '80%',
        borderRadius: 8
	};

    _content_view = Ti.UI.createView (params);

	_btn_cancel =  Ti.UI.createButton({
		title: 'Cancel',
		height: 40,
		bottom: 8
	});

    _btn_cancel.addEventListener('click', function (e) {
        _self.fireEvent ('cancel', {});
    });

    function build_tvr (v)
    {
        var tvrparams = null;

        // couple of interesting things going on here:
        // - android and ios have inconsistent names for the color of a row that is being touched
        // - android doesn't let you set the color of the text in a row that is being touched
        // - android doesn't implement TableViewRow.setColor()
        //
        // so for android, we will explicitly create a label to put in the row.  To indicate the
        // current selection, we can change the color of that label.  Note that we can't change
        // these colors out while the user is touching the row; touch events don't seem to fire
        // consistently.  So we just use that color to indicate the current selection before
        // and after touch events.  Hope this makes sense.

        if (_os === 'ios')
        {
            tvrparams = {
                title: v,
                color: color,
                font: TU.UI.Theme.fonts.medium,
                selectedBackgroundColor: highlight_bgcolor,  // note this property name is inconsistent with android
                selectedColor: highlight_color
            };

            return tvrparams;
        }


        if (_os !== 'android')
        {
            throw {
                message: 'Error: os not supported by SimplePicker'
            };
        }

        tvrparams = {
            backgroundSelectedColor: highlight_bgcolor  // note this property name is inconsistent with ios
        };

        var tvr = Ti.UI.createTableViewRow (tvrparams);

        var l = Ti.UI.createLabel ({
            left: 8,
            text: v,
            color: color,
            font: TU.UI.Theme.fonts.medium
        });

        tvr.add (l);

        tvr.label = l;

        return tvr;
    }

    var data = [];
	for (var i = 0; i < _values.length; i++)
	{
        var tvr = build_tvr (_values[i]);

		data.push (tvr);
	}

    var tvparams = {
        data: data,
        top: 8,
        left: 8,
        right: 8,
        bottom: 56,
        allowSelection: true,
        separatorColor: 'transparent',
        backgroundColor: bgcolor,
        minRowHeight: 48
    };

    _tv_values = Ti.UI.createTableView (tvparams);

    _tv_rows = _tv_values.getData ()[0].rows;

    _tv_values.addEventListener ('click', function (e) {
		_self.xsetValue (_values[e.index]);
        setTimeout (function () {
            _self.fireEvent ('done', { index: e.index, value: _value });
        }, 250);
	});

    if (typeof selected_value !== 'undefined')
    {
        setValue (selected_value);
    }

    _content_view.add (_tv_values);
    _content_view.add (_btn_cancel);

    _self = TU.UI.createModalView ({
        view: _content_view
    });

    _self.xsetValue = setValue;

    return _self;

    function setValue (value)
	{
        if (_selidx > -1)
        {
            _tv_rows[_selidx].setBackgroundColor ('transparent');

            if (_os === 'android')
            {
                _tv_rows[_selidx].label.setColor (color);
            }
            else
            {
                _tv_rows[_selidx].setColor (color);
            }
        }

	    for (var i = 0; i < _values.length; i++)
	    {
	        if (_values[i] == value)
	        {
	        	_selidx = i;
                _tv_rows[i].setBackgroundColor (highlight_bgcolor);

                if (_os === 'android')
                {
                    _tv_rows[i].label.setColor (highlight_color);
                }
                else
                {
                    _tv_rows[i].setColor (highlight_color);
                }
	            _tv_values.scrollToIndex (_selidx, { animated: false });
                break;
	        }
	    }

		_value = value;
	}
	
}


function SimplePicker (params)
{
	var _self = null;
	var _label = null;
	var _values = [];
	var _value = "";
	var _ppopup = null;
    var _parent = null; // this is the parent view to which we attach the popup
    var _highlight_bgcolor = TU.UI.Theme.highlightColor;
    var _highlight_color = TU.UI.Theme.lightTextColor;
	
	var newparams = {};
	
	for (var k in params)
	{
		if (k == 'values')
		{
			_values = params[k];
			continue;
		}

        if (k == 'parent')
        {
            _parent = params[k];
            continue;
        }

        if (k == 'highlight_color')
        {
            _highlight_color = params[k];
            continue;
        }

        if (k == 'highlight_bgcolor')
        {
            _highlight_bgcolor = params[k];
            continue;
        }

		newparams[k] = params[k];
	}

    if ((_parent == null)
        || ((_parent.getLayout () != 'composite') && (typeof _parent.getLayout () !== 'undefined')))
    {
        throw {
            message: 'Error: you must specify a parent view in params.parent, and the parent view must have a layout of "composite"'
        };
    }

	if (_values.length > 0)
	{
		_value = _values[0];
	}

    if (typeof newparams.height === 'undefined')
    {
        newparams.height = 35;
    }
    if (typeof newparams.borderColor === 'undefined')
    {
        newparams.borderColor = TU.UI.Theme.mediumBackgroundColor;
    }
    if (typeof newparams.borderRadius === 'undefined')
    {
        newparams.borderRadius = 5;
    }
    if (typeof newparams.backgroundColor === 'undefined')
    {
        newparams.backgroundColor = TU.UI.Theme.lightBackgroundColor;
    }
    if (typeof newparams.font === 'undefined')
    {
        newparams.font = TU.UI.Theme.fonts.medium;
    }
    if (typeof newparams.color === 'undefined')
    {
        newparams.color = TU.UI.Theme.darkTextColor;
    }

    newparams.text = _value;

    _self = Ti.UI.createView (newparams);

    var labelparams = {
        left: 10,
        color: newparams.color,
        font: newparams.font,
        text: _value
    };

    _label = Ti.UI.createLabel (labelparams);

    var btnparams = {
        right: 10,
        color: newparams.color,
        font: newparams.font,
        text: "▼"
    };

    btn = Ti.UI.createLabel (btnparams);

    _self.add (_label);
    _self.add (btn);

    _self.addEventListener ('click', function (e) {
        if (_ppopup != null)
        {
            _ppopup.xsetValue (_value);
            _parent.add (_ppopup);
            return;
        }

        _ppopup = new PickerPopup (newparams.backgroundColor, _highlight_bgcolor, newparams.color, _highlight_color, _values, _value);

        _ppopup.addEventListener ('cancel', function (e) {
            _parent.remove (_ppopup);
        });

        _ppopup.addEventListener ('done', function (e) {
            _parent.remove (_ppopup);

            if (e.value == _value)
            {
                return;
            }

            _value = e.value;
            _label.text = _value;

            _self.fireEvent ('change', e);
        });

        _parent.add (_ppopup);
    });

	_self.xgetValue = function ()
	{
		return _value;
	};
	
	_self.xsetValue = function (value)
	{
		for (var i = 0; i < _values.length; i++)
		{
			if (_values[i] == value)
			{
				_value = value;
    			_label.text = _value;
			}
		}
	};
	
	return _self;
}


SimplePicker.TUInit = function (tu)
{
	TU = tu;

    _os = TU.Device.getOS();
};


module.exports = SimplePicker;
