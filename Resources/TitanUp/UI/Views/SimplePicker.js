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

    var _rowheight = 48;

	var _sv = null;
    var _rows = null;
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

    function build_row (i)
    {
        // a couple of things about TableViews and TableViewRows make them unsuitable for use here,
        // so we are rolling our own "poor man's tableview"
        // - android and ios have inconsistent names for the color of a row that is being touched
        // - android doesn't let you set the color of the text in a row that is being touched
        // - android doesn't implement TableViewRow.setColor()

        var row = Ti.UI.createView ({
            top: 0,
            left: 0,
            right: 0,
            height: _rowheight,
            backgroundColor: bgcolor
        });

        var l = Ti.UI.createLabel ({
            left: 8,
            text: _values[i],
            color: color,
            font: TU.UI.Theme.fonts.medium
        });

        row.add (l);

        row.label = l;
        row.index = i;

        row.addEventListener ('touchstart', function (e) {
            row.setBackgroundColor (highlight_bgcolor);
            row.label.setColor (highlight_color);
        });

        row.addEventListener ('touchcancel', function (e) {
            row.setBackgroundColor (bgcolor);
            row.label.setColor (color);
        });

        row.addEventListener ('touchend', function (e) {
            row.setBackgroundColor (bgcolor);
            row.label.setColor (color);
        });

        row.addEventListener ('click', function (e) {
            var v = _values[row.index];
            _value = v;
            _self.fireEvent ('done', { index: row.index, value: v });
        });

        return row;
    }

    _sv = Ti.UI.createScrollView ({
        top: 8,
        left: 8,
        right: 8,
        bottom: 56,
        backgroundColor: bgcolor,
        layout: 'vertical'
    });

    _rows = [];
	for (var i = 0; i < _values.length; i++)
	{
        var row = build_row (i);
        _rows.push (row);

        _sv.add (row);
	}

    _content_view.add (_sv);
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
            _rows[_selidx].setBackgroundColor ('transparent');
            _rows[_selidx].label.setColor (color);
        }

	    for (var i = 0; i < _values.length; i++)
	    {
	        if (_values[i] === value)
	        {
	        	_selidx = i;
                _rows[i].setBackgroundColor (highlight_bgcolor);
                _rows[i].label.setColor (highlight_color);

                var scrollheight = _rowheight * (_selidx - 2);
                if (scrollheight < 0)
                {
                    scrollheight = 0;
                }

                if ((_rowheight * (_selidx + 3)) <= (TU.Device.getDisplayHeight() * 0.8)) {
                  scrollheight = 0;
                }

                if (_os === 'android')
                {
                    // https://jira.appcelerator.org/browse/TIMOB-17954
                    // scrollTo needs units in px
                    scrollheight = TU.UI.Sizer.dpToPx(scrollheight);
                    _sv.scrollTo (0, scrollheight);
                }
                if (_os === 'ios')
                {
                    _sv.setContentOffset ({ x: 0, y: scrollheight },  { animated:false } );
                }
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
		if (k === 'values')
		{
			_values = params[k];
			continue;
		}

        if (k === 'parent')
        {
            _parent = params[k];
            continue;
        }

        if (k === 'highlight_color')
        {
            _highlight_color = params[k];
            continue;
        }

        if (k === 'highlight_bgcolor')
        {
            _highlight_bgcolor = params[k];
            continue;
        }

		newparams[k] = params[k];
	}

    if ((_parent === null)
        || ((_parent.getLayout () !== 'composite') && (typeof _parent.getLayout () !== 'undefined')))
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

    var btn = Ti.UI.createLabel (btnparams);

    _self.add (_label);
    _self.add (btn);

    _self.addEventListener ('click', function (e) {
        if (_ppopup !== null)
        {
            _parent.add (_ppopup);
            _ppopup.xsetValue (_value);
            return;
        }

        _ppopup = new PickerPopup (newparams.backgroundColor, _highlight_bgcolor, newparams.color, _highlight_color, _values, _value);

        _ppopup.addEventListener ('cancel', function (e) {
            _parent.remove (_ppopup);
        });

        _ppopup.addEventListener ('done', function (e) {
            _parent.remove (_ppopup);

            if (e.value === _value)
            {
                return;
            }

            _value = e.value;
            _label.text = _value;

            _self.fireEvent ('change', e);
        });

        _parent.add (_ppopup);
        _ppopup.xsetValue (_value);
    });

	_self.xgetValue = function ()
	{
		return _value;
	};
	
	_self.xsetValue = function (value)
	{
		for (var i = 0; i < _values.length; i++)
		{
			if (_values[i] === value)
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
