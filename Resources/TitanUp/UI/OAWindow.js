var TU = null;

/**
 * Orientation-aware window - use this in an app that has a mix of windows that are locked to one orientation
 * and windows that support multiple orientations.
 *
 * In such an app, you may have a window that is locked to portrait, but if the phone is physically in
 * landscape mode, calls to isPortrat(), isLandscape(), and platform width and height may be unreliable.
 *
 * This window has mechanisms that help you render your content appropriately.
 *
 * @param params
 * @constructor
 */
function OAWindow (params)
{
    var _self;
    var _layoutCallback = null;

    var _supportedOrientations = 'all';

    var _layout_timeout = null;
    var _hideNavBarInLandscape = false;

    var _last_orientation = '';
    var _last_landscape_height = -1;
    var _last_portrait_height = -1;

    var _start_time = -1;

    _process_params ();
    _init ();

    return _self;

    function _process_params ()
    {
        if (typeof params === 'undefined')
        {
            params = {};
        }

        var config = {};

        if (typeof params.config !== 'undefined')
        {
            config = params.config;
            delete params.config;
        }

        if (typeof config.layoutCallback !== 'undefined')
        {
            _layoutCallback = config.layoutCallback;
        }

        if (typeof config.hideNavBarInLandscape !== 'undefined')
        {
            _hideNavBarInLandscape = config.hideNavBarInLandscape;
        }

        if (typeof params.orientationModes !== 'undefined')
        {
            var portrait_supported = false;
            var landscape_supported = false;

            for (var i = 0; i < params.orientationModes.length; i++)
            {
                var m = params.orientationModes[i];

                switch (m)
                {
                    case Ti.UI.PORTRAIT:
                    case Ti.UI.UPSIDE_PORTRAIT:
                        portrait_supported = true;
                        break;

                    case Ti.UI.LANDSCAPE_LEFT:
                    case Ti.UI.LANDSCAPE_RIGHT:
                        landscape_supported = true;
                        break;
                }
            }
            if (landscape_supported)
            {
                if (!portrait_supported)
                {
                    _supportedOrientations = 'landscape';
                }
            }
            else if (portrait_supported)
            {
                if (!landscape_supported)
                {
                    _supportedOrientations = 'portrait';
                }
            }
        }
    }


    function call_layout_callback ()
    {
        if (_layoutCallback !== null)
        {
            TU.Logger.debug ("[OAWindow] calling layout callback");
            _start_time = -1;
            _layoutCallback (_self);
        }
        _self.removeEventListener ('postlayout', onpostlayout);
    }

    function checklayout ()
    {
        var expected_orientation = _supportedOrientations;
        if (expected_orientation === 'all')
        {
            expected_orientation = TU.UI.getUIOrientation();
        }

        TU.Logger.debug ("[OAWindow] checklayout(); supported orientations: " + _supportedOrientations + "; expected orientation: " + expected_orientation);
        TU.Logger.debug ("[OAWindow] is landscape: " + (Ti.Gesture.isLandscape () ? 'true' : 'false'));
        TU.Logger.debug ("[OAWindow] is portrait:  " + (Ti.Gesture.isPortrait () ? 'true' : 'false'));
        TU.Logger.debug ("[OAWindow] display size: " + TU.Device.getDisplayWidth () + ' x ' + TU.Device.getDisplayHeight ());
        TU.Logger.debug ("[OAWindow] rect:         " + _self.rect.width + ' x ' + _self.rect.height);

        if (expected_orientation == 'portrait')
        {
            _last_orientation = 'portrait';
            _last_landscape_height = -1;
            if (_self.rect.width < _self.rect.height)
            {
                if (_hideNavBarInLandscape)
                {
                    if (_last_portrait_height > -1)
                    {
                        TU.Logger.debug ("[OAWindow] nav bar was shown; waiting for height < " + _last_portrait_height);
                        if (_self.rect.height < _last_portrait_height)
                        {
                            _last_portrait_height = -1;
                            call_layout_callback ();
                            return;
                        }
                    }
                    else
                    {
                        _last_portrait_height = _self.rect.height;
                        TU.Logger.debug ("[OAWindow] showing nav bar; current height: " + _last_portrait_height);
                        TU.UI.show_navbar ();
                    }

                }
                call_layout_callback ();
                return;
            }
        }
        else if (expected_orientation == 'landscape')
        {
            _last_orientation = 'landscape';
            _last_portrait_height = -1;
            if (_self.rect.width > _self.rect.height)
            {
                if (_hideNavBarInLandscape)
                {
                    if (_last_landscape_height > -1)
                    {
                        TU.Logger.debug ("[OAWindow] nav bar was hidden; waiting for height > " + _last_landscape_height);
                        if (_self.rect.height > _last_landscape_height)
                        {
                            _last_landscape_height = -1;
                            call_layout_callback ();
                            return;
                        }
                    }
                    else
                    {
                        _last_landscape_height = _self.rect.height;
                        TU.Logger.debug ("[OAWindow] hiding nav bar; current height: " + _last_landscape_height);
                        TU.UI.hide_navbar ();
                    }
                }
                else
                {
                    call_layout_callback ();
                    return;
                }
            }
        }

        if (_start_time == -1)
        {
            _start_time = Date.now ();
        }

        var elapsed = Date.now () - _start_time;
        if (elapsed > 5000)
        {
            TU.Logger.warn ("[OAWindow] never got a layout rect that matched expected orientation...");
            _layout_timeout = null;
            return;
        }

        TU.Logger.debug ("[OAWindow] layout rect didn't match up with expected orientation; waiting...");
        _layout_timeout = setTimeout (checklayout, 100);
    }

    function onpostlayout ()
    {
        if ((_self.rect.width == 0) || (_self.rect.height == 0))
        {
            // bogus postlayout fired...
            return;
        }

        TU.Logger.debug ("[OAWindow] onpostlayout()");

        if (_layout_timeout != null)
        {
            clearTimeout (_layout_timeout);
            _layout_timeout = null;
        }
        checklayout();
    }

    function onorientationchange (e)
    {
        // ignore these orientation changes; under most circumstances, we don't need them.
        switch (e.orientation)
        {
            case Ti.UI.FACE_DOWN:
            case Ti.UI.FACE_UP:
            case Ti.UI.UNKNOWN:
                return;
                break;

            case Ti.UI.PORTRAIT:
            case Ti.UI.UPSIDE_PORTRAIT:
                if (_last_orientation == 'portrait')
                {
                    return;
                }
                break;

            case Ti.UI.LANDSCAPE_LEFT:
            case Ti.UI.LANDSCAPE_RIGHT:
                if (_last_orientation == 'landscape')
                {
                    return;
                }
                break;
        }

        if (!_hideNavBarInLandscape)
        {
            // ios bug -- navbar doesn't always resize properly on orientation change; make
            // it show up by hiding, then showing the navbar
            // https://jira.appcelerator.org/browse/TIMOB-4183
            if ((TU.Device.getOS () == 'ios') && (_supportedOrientations == 'all'))
            {
                TU.Logger.debug ("[OAWindow] bouncing navbar...");
                TU.UI.hide_navbar ();
                TU.UI.show_navbar ();
            }
        }

        TU.Logger.debug ("[OAWindow] onorientationchange; calling onpostlayout...");
        onpostlayout ();
        _self.fireEvent ('orientationchange', e);
    }

    function _init ()
    {
        _self = Ti.UI.createWindow (params);

        if (_supportedOrientations == 'all')
        {
            Ti.Gesture.addEventListener ('orientationchange', onorientationchange);

            _self.addEventListener ('close', function (e) {
                Ti.Gesture.removeEventListener ('orientationchange', onorientationchange);
            });
        }

        _self.addEventListener ('postlayout', onpostlayout);
    }
}

OAWindow.TUInit = function (tu)
{
    TU = tu;
};


module.exports = OAWindow;