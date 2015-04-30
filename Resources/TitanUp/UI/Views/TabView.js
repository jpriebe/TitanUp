var TU = null;

function TabView (params)
{
    var _self = null;

    var _tab_bar = null;
    var _tabs = [];
    var _panels = [];
    var _content_views = [];

    var _current_panel_idx = -1;
    
    var _tab_labels = [];
    var _tab_height = 40;
    var _tab_border_radius = 0;
    var _tab_spacing = 10;
    var _tab_panel_spacing = 10;
    var _horizontal_margin = 10;
    var _tab_font = TU.UI.Theme.fonts.mediumBold;
    var _tab_color = TU.UI.Theme.lightTextColor;
    var _tab_color_active = TU.UI.Theme.lightTextColor;
    var _tab_color_selected = TU.UI.Theme.lightTextColor;
    var _tab_background_color = TU.UI.Theme.darkBackgroundColor;
    var _tab_background_color_active = TU.UI.Theme.darkBackgroundColor;
    var _tab_background_color_selected = TU.UI.Theme.darkBackgroundColor;

    var _width = 0;
    var _tab_width = 0;

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

        if (typeof config.tab_labels === 'undefined')
        {
            throw ({ message: 'Must specify tab_labels in config.'});
        }
        _tab_labels = config.tab_labels;

        if (typeof config.tab_height !== 'undefined')
        {
            _tab_height = config.tab_height;
        }

        if (typeof config.tab_border_radius !== 'undefined')
        {
            _tab_border_radius = config.tab_border_radius;
        }

        if (typeof config.tab_spacing !== 'undefined')
        {
            _tab_spacing = config.tab_spacing;
        }

        if (typeof config.tab_panel_spacing !== 'undefined')
        {
            _tab_panel_spacing = config.tab_panel_spacing;
        }

        if (typeof config.horizontal_margin !== 'undefined')
        {
            _horizontal_margin = config.horizontal_margin;
        }

        if (typeof config.tab_font !== 'undefined')
        {
            _tab_font = config.tab_font;
        }

        if (typeof config.tab_color !== 'undefined')
        {
            _tab_color = config.tab_color;
        }

        if (typeof config.tab_color_active !== 'undefined')
        {
            _tab_color_active = config.tab_color_active;
        }
        
        if (typeof config.tab_color_selected !== 'undefined')
        {
            _tab_color_selected = config.tab_color_selected;
        }

        if (typeof config.tab_background_color !== 'undefined')
        {
            _tab_background_color = config.tab_background_color;
        }

        if (typeof config.tab_background_color_active !== 'undefined')
        {
            _tab_background_color_active = config.tab_background_color_active;
        }
        
        if (typeof config.tab_background_color_selected !== 'undefined')
        {
            _tab_background_color_selected = config.tab_background_color_selected;
        }
    }

    function _init ()
    {
        if (typeof params.width === 'undefined')
        {
            _width = TU.Device.getDisplayWidth ();
            params.width = _width;
        }

        _self = Ti.UI.createView (params);

        _tab_width = parseInt ((_width - (_tab_labels.length - 1) * _tab_spacing - 2 * _horizontal_margin) / _tab_labels.length);

        _tab_bar = Ti.UI.createView ({
            left: _horizontal_margin,
            right: _horizontal_margin,
            top: 0,
            height: _tab_height,
            layout: 'horizontal'
        });

        _tabs = [];
        _panels = [];

        for (var i = 0; i < _tab_labels.length; i++)
        {
            var tab = Ti.UI.createView ({
                width: _tab_width,
                height: _tab_height,
                left: (i == 0) ? 0 : _tab_spacing,
                backgroundColor: _tab_background_color,
                borderRadius: _tab_border_radius
            });

            var l = Ti.UI.createLabel ({
                font: _tab_font,
                color: _tab_color,
                text: _tab_labels[i]
            });

            tab.label = l;
            tab.add (l);

            tab.idx = i;

            function addEventListeners (t)
            {
                tab.addEventListener('touchstart', function (e) {
                    t.label.setColor (_tab_color_active);
                    t.setBackgroundColor (_tab_background_color_active);
                });

                tab.addEventListener('touchend', function (e) {
                    select_tab (t.idx);
                });

                tab.addEventListener('touchcancel', function (e) {
                    t.label.setColor (_tab_color);
                    t.setBackgroundColor (_tab_background_color);
                });
            }

            addEventListeners (tab);

            _tabs.push (tab);
            _tab_bar.add (tab);

            var panel = Ti.UI.createView ({
                top: 0,
                left: _horizontal_margin,
                right: _horizontal_margin,
                bottom: 0
            });

            _panels.push (panel);

            _content_views.push (null);
        }

        _self.add (_tab_bar);

        var panel_view = Ti.UI.createView ({
            top: _tab_height + _tab_panel_spacing,
            left: 0,
            right: 0,
            bottom: 0
        });

        for (var i = 0; i < _panels.length; i++)
        {
            _panels[i].setVisible (false);
            panel_view.add (_panels[i]);
        }

        _self.add (panel_view);

        TU.UI.registerBeforeRemoveCallback(_self, onBeforeRemove);

        setTimeout (function () {
            // do this in a timeout so that the view can be created and an event listener added
            // before we select the first tab...
            select_tab (0);
        }, 10);

        _self.get_tab = function (idx) {
            if ((idx < 0) || (idx > _panels.length - 1))
            {
                return;
            }

            return _panels[idx];
        };

        _self.add_content_view = function (idx, v) {
            TU.Logger.debug ("[TabView] set_content_view (" + idx + ")");
            if ((idx < 0) || (idx > _content_views.length - 1))
            {
                TU.Logger.debug ("[TabView] set_content_view (" + idx + ")");
                return;
            }

            if (_content_views[idx] !== null)
            {
                TU.UI.removeView (_content_views[idx], _panels[idx]);
                _content_views[idx] = null;
            }

            _panels[idx].add (v);
            _content_views[idx] = v;
        };
    }

    function onBeforeRemove (e)
    {
        for (var i = 0; i < _content_views.length; i++)
        {
            var v = _content_views[i];
            if (v === null)
            {
                continue;
            }

            var p = _panels[i];
            if (p === null)
            {
                // shouldn't happen
                continue;
            }

            TU.UI.removeView (v, p);
        }
    }

    function select_tab (idx)
    {
        _tabs[idx].setBackgroundColor (_tab_background_color_selected);
        _tabs[idx].label.setColor (_tab_color_selected);

        if (idx === _current_panel_idx)
        {
            return;
        }

        _panels[idx].setVisible (true);

        if (_current_panel_idx >= 0)
        {
            _tabs[_current_panel_idx].setBackgroundColor (_tab_background_color);
            _tabs[_current_panel_idx].label.setColor (_tab_color);

            _panels[_current_panel_idx].setVisible (false);
            _panels[_current_panel_idx].fireEvent ('tabDeselected', { panel: _panels[_current_panel_idx] });
        }

        _self.fireEvent ('tabSelected', {
            index: idx,
            panel: _panels[idx]
        });

        _current_panel_idx = idx;
    }
}

TabView.TUInit = function (tu)
{
    TU = tu;
};

module.exports = TabView;