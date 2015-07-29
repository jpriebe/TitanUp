var TU = null;

/**
 * Provides a cross-platform "tabbed bar" selection view
 */
function SelectBar (params)
{
    var _self = null;
	var _button_bar = null;
    var _buttons = [];

    var _current_idx = -1;
    var _selected_button = null;

    var _allow_deselect = true;
    var _enabled = true;

	var _labels = [];
    var _values = [];
	
	var _button_border_radius = 0;
	var _button_spacing = -1;
	var _horizontal_margin = 0;

	var _font = TU.UI.Theme.fonts.medium;
	var _color = TU.UI.Theme.darkTextColor;
	var _color_active = TU.UI.Theme.lightTextColor;
	var _color_selected = TU.UI.Theme.lightTextColor;
	var _color_selected_active = TU.UI.Theme.lightTextColor;
	var _background_color = TU.UI.Theme.lightBackgroundColor;
	var _background_color_active = TU.UI.Theme.mediumBackgroundColor;
	var _background_color_selected = TU.UI.Theme.darkBackgroundColor;
	var _background_color_selected_active = TU.UI.Theme.mediumBackgroundColor;
    var _border_color = TU.UI.Theme.darkBackgroundColor;
    var _border_color_active = TU.UI.Theme.mediumBackgroundColor;
    var _border_color_selected = TU.UI.Theme.darkBackgroundColor;
    var _border_color_selected_active = TU.UI.Theme.mediumBackgroundColor;

	var _width = 0;
	var _button_width = 0;

	_process_params ();
    _init ();

    return _self;

	function _process_params ()
	{
		if (typeof params === 'undefined')
		{
			params = {};
		}
		else
		{
			params = JSON.parse (JSON.stringify (params));
		}

		var config;

		if (typeof params.config !== 'undefined')
		{
			config = params.config;
			delete params.config;
		}
		else
		{
			throw ({ message: 'Must specify config property in initialization parameters.'});
		}

		if (typeof config.labels === 'undefined')
		{
			throw ({ message: 'Must specify labels in config.'});
		}
		_labels = config.labels;

		if (typeof config.values === 'undefined')
		{
            _values = JSON.parse (JSON.stringify (_labels));
		}
        else
        {
            _values = config.values;
        }

		if (_values.length !== _labels.length)
		{
			throw ({ message: 'Labels array and values array must have the same length.'});
		}

        if (typeof config.allow_deselect !== 'undefined')
        {
            _allow_deselect = config.allow_deselect;
        }

        if (typeof config.button_border_radius !== 'undefined')
		{
			_button_border_radius = config.button_border_radius;
		}

		if (typeof config.button_spacing !== 'undefined')
		{
			_button_spacing = config.button_spacing;
		}

		if (typeof config.horizontal_margin !== 'undefined')
		{
			_horizontal_margin = config.horizontal_margin;
		}

		if (typeof config.font !== 'undefined')
		{
			_font = config.font;
		}

		if (typeof config.color !== 'undefined')
		{
			_color = config.color;
		}

		if (typeof config.color_active !== 'undefined')
		{
			_color_active = config.color_active;
		}

		if (typeof config.color_selected !== 'undefined')
		{
			_color_selected = config.color_selected;
		}

		if (typeof config.color_selected_active !== 'undefined')
		{
			_color_selected_active = config.color_selected_active;
		}
		else
		{
			_color_selected_active = _color_active;
		}

		if (typeof config.background_color !== 'undefined')
		{
			_background_color = config.background_color;
		}

		if (typeof config.background_color_active !== 'undefined')
		{
			_background_color_active = config.background_color_active;
		}

		if (typeof config.background_color_selected !== 'undefined')
		{
			_background_color_selected = config.background_color_selected;
		}

		if (typeof config.background_color_selected_active !== 'undefined')
		{
			_background_color_selected_active = config.background_color_selected_active;
		}
		else
		{
			_background_color_selected_active = _background_color_active;
		}

        if (typeof config.border_color !== 'undefined')
        {
            _border_color = config.border_color;
        }

        if (typeof config.border_color_active !== 'undefined')
        {
            _border_color_active = config.border_color_active;
        }

        if (typeof config.border_color_selected !== 'undefined')
        {
            _border_color_selected = config.border_color_selected;
        }

        if (typeof config.border_color_selected_active !== 'undefined')
        {
            _border_color_selected_active = config.border_color_selected_active;
        }
        else
        {
            _border_color_selected_active = _border_color_active;
        }
	}


    function _init ()
    {
		if (typeof params.width === 'undefined')
		{
			// fixme -- this assumes that the tab bar is being added to a full-width view
			_width = TU.Device.getDisplayWidth ();
			params.width = _width;
		}
        else
        {
            _width = params.width;
        }

		_self = Ti.UI.createView (params);

		_button_width = parseInt ((_width - (_labels.length - 1) * _button_spacing - 2 * _horizontal_margin) / _labels.length);

		_button_bar = Ti.UI.createView ({
			left: _horizontal_margin,
			right: _horizontal_margin,
			top: 0,
            bottom: 0,
			layout: 'horizontal'
		});

		_buttons = [];

		for (var i = 0; i < _labels.length; i++)
		{
			var button = Ti.UI.createView ({
                top: 0,
                bottom: 0,
				width: _button_width,
				left: (i == 0) ? 0 : _button_spacing,
				backgroundColor: _background_color,
                borderColor: _border_color,
                borderWidth: 1,
				borderRadius: _button_border_radius
			});

			var l = Ti.UI.createLabel ({
				font: _font,
				color: _color,
				text: _labels[i]
			});

			button.label = l;
			button.add (l);

			button.idx = i;

			function addEventListeners (b)
			{
				button.addEventListener('touchstart', function (e) {
					b.inactive_color = b.label.getColor ();
					b.inactive_background_color = b.getBackgroundColor ();
					b.inactive_border_color = b.getBorderColor ();

					if (b === _selected_button)
					{
						b.label.setColor (_color_selected_active);
						b.setBackgroundColor (_background_color_selected_active);
						b.setBorderColor (_border_color_selected_active);
					}
					else
					{
						b.label.setColor (_color_active);
						b.setBackgroundColor (_background_color_active);
						b.setBorderColor (_border_color_active);
					}
				});

				button.addEventListener('touchend', function (e) {
                    if (b.idx === _current_idx)
                    {
                        if (_allow_deselect)
                        {
                            deselect_button ();
                        }
                        else
                        {
                            b.label.setColor (b.inactive_color);
                            b.setBackgroundColor (b.inactive_background_color);
                            b.setBorderColor (b.inactive_border_color);
                        }
                    }
                    else
                    {
                        select_button (b.idx);
                    }
				});

				button.addEventListener('touchcancel', function (e) {
					b.label.setColor (b.inactive_color);
					b.setBackgroundColor (b.inactive_background_color);
					b.setBorderColor (b.inactive_border_color);
				});
			}

			addEventListeners (button);

			_buttons.push (button);
			_button_bar.add (button);
		}

		_self.add (_button_bar);

        _self.xgetSelectedIndex = xgetSelectedIndex;
        _self.xsetSelectedIndex = xsetSelectedIndex;
        _self.xsetEnabled = xsetEnabled;
    }

    function deselect_button ()
    {
        if (_current_idx === -1)
        {
            // nothing to do if we don't already have a selected button...
            return;
        }

        _buttons[_current_idx].label.setColor (_color);
        _buttons[_current_idx].setBackgroundColor (_background_color);
        _buttons[_current_idx].setBorderColor (_border_color);

        _current_idx = -1;
        _selected_button = null;

        _self.fireEvent ('change', {
            index: -1,
            value: null,
            label: null
        });
    }


    function select_button(idx)
    {
        _buttons[idx].label.setColor (_color_selected);
        _buttons[idx].setBackgroundColor (_background_color_selected);
        _buttons[idx].setBorderColor (_border_color_selected);

        if (idx === _current_idx)
        {
            return;
        }

        if (_current_idx >= 0)
        {
            _buttons[_current_idx].label.setColor (_color);
            _buttons[_current_idx].setBackgroundColor (_background_color);
            _buttons[_current_idx].setBorderColor (_border_color);
        }

        _current_idx = idx;
        _selected_button = _buttons[idx];

        _self.fireEvent ('change', {
            index: idx,
            value: _values[idx],
            label: _labels[idx]
        });
    }
    

    function xgetSelectedIndex ()
	{
		return _current_idx;
	}
		
	function xsetSelectedIndex (idx)
	{
		if (idx < -1)
		{
			return;
		}
		if (idx > _labels.length - 1)
		{
			return;
		}

        select_button (idx);
	}
	
	function xsetEnabled (enabled)
	{
        _self.setTouchEnabled (enabled);
	}
	
	return _self;
}


SelectBar.TUInit = function (tu)
{
	TU = tu;
};


module.exports = SelectBar;
