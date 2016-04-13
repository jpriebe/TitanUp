var TU = null;
var _curr_wm = null;

var _window_stack = [];

function UI ()
{
	
}


// provide a mechanism to throttle clicks on buttons, tableview rows, images, etc. that
// open windows; if you don't do this, and the user taps faster than the window is opened,
// you'll get multiple windows opened
//
// http://developer.appcelerator.com/question/117541/multiple-click-on-row-will-fire-event-multiple-times
UI.EventThrottle = function ()
{
	var _ignore_event = false;
	
	this.shouldFire = function ()
	{
		if (_ignore_event)
		{
			TU.Logger.debug ('[TU.UI.EventThrottle] ignoring event...');
			return false;
		}
		
		_ignore_event = true;
		return true;
	};
			
	this.setWindow = function (win)
	{
		win.addEventListener ('close', function (e) {
			_ignore_event = false;
		});
	};
	
	this.setTimeout = function (ms)
	{
		setTimeout (function () {
			_ignore_event = false;
		}, ms);
	};
	
};

UI.runRateAppAlert = function (params)
{
    var RateAppAlert = require ('/TitanUp/UI/RateAppAlert');
    RateAppAlert.TUInit (TU);

    RateAppAlert.run (params);
};

UI.createModalView = function (params)
{
    var ModalView = require ('/TitanUp/UI/Views/ModalView');
    ModalView.TUInit (TU);

    return new ModalView (params);
};

UI.createOAWindow = function (params)
{
    var OAWindow = require ('/TitanUp/UI/OAWindow');
    OAWindow.TUInit (TU);

    return new OAWindow (params);
};


UI.createSimplePicker = function (params)
{
	var SimplePicker = require ('/TitanUp/UI/Views/SimplePicker');
	SimplePicker.TUInit (TU);
	
	return new SimplePicker (params);
};

UI.createCircularProgressBar = function (params)
{
    var CircularProgressBar = require ('/TitanUp/UI/Views/CircularProgressBar');
    CircularProgressBar.TUInit (TU);

    return new CircularProgressBar (params);
};


UI.createSelectBar = function (params)
{
	var SelectBar = require ('/TitanUp/UI/Views/SelectBar');
	SelectBar.TUInit (TU);
	
	return new SelectBar (params);
};

UI.createGalleryView = function (params)
{
	var GalleryView = require ('/TitanUp/UI/Views/GalleryView');
	GalleryView.TUInit (TU);
	
	return new GalleryView (params);
};

UI.createTabView = function (params)
{
    var TabView = require ('/TitanUp/UI/Views/TabView');
    TabView.TUInit (TU);

    return new TabView (params);
};


UI.createTGWM = function ()
{
    var TGWM = require ('/TitanUp/UI/TGWM');
    TGWM.TUInit (TU);

    _curr_wm = TGWM;
    TU.Context.track (_curr_wm);

    return TGWM.createTabGroup ();
};

UI.createDrawerMenuWM = function (params)
{
    var DrawerMenuWM = require ('/TitanUp/UI/DrawerMenuWM');
    DrawerMenuWM.TUInit (TU);

    _curr_wm = new DrawerMenuWM (params);
    TU.Context.track (_curr_wm);

    return _curr_wm;
};

UI.createViewPager = function (params)
{
    var ViewPager = require ('/TitanUp/UI/Views/ViewPager');
    ViewPager.TUInit (TU);
    
    return new ViewPager (params);
};

UI.createTextField = function (params)
{
    var TextField = require ('/TitanUp/UI/Views/TextField');
    TextField.TUInit (TU);

    return new TextField (params);
};

UI.createRemoteImageView = function (params)
{
    var RemoteImageView = require ('/TitanUp/UI/Views/RemoteImageView');
    return new RemoteImageView (params);
};


UI.Theme = require ('/TitanUp/UI/Theme');
UI.Sizer = require ('/TitanUp/UI/Sizer');

/* View management */
UI.addView = function (child, parent)
{
    parent.add (child);

    child.fireEvent ('added', {
        child: child,
        parent: parent
    });
};

/**
 * Registers a callback function to be called before a window is closed.
 *
 * @param w
 * @param f
 */
UI.registerBeforeCloseCallback = function (w, f)
{
    if (typeof w.__beforeCloseCallbacks === 'undefined')
    {
        w.__beforeCloseCallbacks = [];
    }

    // have to do the push() call on a copy of the array, because of the way properties on proxy
    // objects work: http://developer.appcelerator.com/question/139825/arraypush-not-working-on-tiuiview-custom-property
    var tmp = w.__beforeCloseCallbacks;
    tmp.push (f);
    w.__beforeCloseCallbacks = tmp;
};


/**
 * Registers a callback function to be called before a view is removed from its parent
 * with TU.UI.removeView().
 *
 * @param v
 * @param f
 */
UI.registerBeforeRemoveCallback = function (v, f)
{
    if (typeof v.__beforeRemoveCallbacks === 'undefined')
    {
        v.__beforeRemoveCallbacks = [];
    }

	// have to do the push() call on a copy of the array, because of the way properties on proxy
	// objects work: http://developer.appcelerator.com/question/139825/arraypush-not-working-on-tiuiview-custom-property
    var tmp = v.__beforeRemoveCallbacks;
    tmp.push (f);
    v.__beforeRemoveCallbacks = tmp;
};

/**
 * Removes a child view from a parent.
 *
 * If the child registers one or more BeforeRemoveCallbacks, those functions will be called before
 * the view is removed.  This lets the child view cancel timeouts/intervals, remove event listeners,
 * cancel network requests, etc.
 *
 * If the parent is not specified, the onBeforeRemove method will get called, but obviously, the
 * removal will not actually happen.
 *
 * @param {Ti.UI.View} child
 * @param {Ti.UI.View} parent
 */
UI.removeView = function (child, parent)
{
    if (typeof child.__beforeRemoveCallbacks !== 'undefined')
    {
        var e = {
            child: child,
            parent: parent
        };

        for (var i = 0; i < child.__beforeRemoveCallbacks.length; i++)
        {
            var f = child.__beforeRemoveCallbacks[i];
            f(e);
        }
    }

    if (typeof parent === 'undefined')
    {
        return;
    }

    parent.remove (child);
};

/* Window management */

UI.getActiveWindow = function ()
{
    TU.Logger.debug ('[TitanUp.UI] getActiveWindow() - window_stack.length: ' + _window_stack.length);

    if (_window_stack.length == 0)
    {
        return null;
    }

    return _window_stack[_window_stack.length - 1];
};

UI.openWindow = function (w)
{
    _window_stack.push (w);
    TU.Logger.debug ('[TitanUp.UI] openWindow() - window_stack.length: ' + _window_stack.length);

    TU.Context.track (w);

    w.addEventListener ('close', function (e) {
        if (w === _window_stack[_window_stack.length - 1])
        {
            _window_stack.pop ();
            TU.Logger.info ('[TitanUp.UI] window closed; window.stack.length: ' + _window_stack.length);
        }
        else
        {
            TU.Logger.warn ('[TitanUp.UI] closed window that is not on top of stack...');
        }
    });

    if (_curr_wm == null)
    {
        w.open ();
        return;
    }

    if (TU.Device.getOS () === 'android')
    {
        w.addEventListener ('androidback', function (e) {
            // catch the back button to close the window; without this event listener,
            // we don't have as much control over the closing process
            TU.UI.closeWindow (w);
        });
    }

    _curr_wm.TUopenWindow (w);
};

UI.closeAllWindows = function (cb)
{
    function recursive_close ()
    {
        var w = UI.getActiveWindow ();
        w.addEventListener ('close', function () {
            if (_window_stack.length == 0)
            {
                if (typeof cb !== 'undefined')
                {
                    cb ();
                }
                return;
            }

            recursive_close ();
        });
        UI.closeWindow (w);
    }

    recursive_close ();
};

UI.closeWindow = function (w)
{
    TU.Logger.debug ('[TitanUp.UI] closeWindow()');

    if (typeof w.__beforeCloseCallbacks !== 'undefined')
    {
        var e = {
            window: w
        };

        for (var i = 0; i < w.__beforeCloseCallbacks.length; i++)
        {
            var f = w.__beforeCloseCallbacks[i];
            f(e);
        }
    }

    if (_curr_wm === null)
    {
        w.close ();
    }
    else
    {
        _curr_wm.TUcloseWindow (w);
    }
};

/* navbar management */

UI.hide_navbar = function ()
{
    var w = TU.UI.getActiveWindow ();

    if (w != null)
    {
        if (TU.Device.getOS () == 'ios')
        {
            if (typeof w.hideNavBar !== 'undefined')
            {
                w.hideNavBar ();
                return true;
            }
        }
        else if (TU.Device.getOS () == 'android')
        {
            if (typeof w.activity !== 'undefined' && typeof w.activity.actionBar !== 'undefined' && typeof w.activity.actionBar.hide !== 'undefined')
            {
                w.activity.actionBar.hide ();
                return true;
            }
        }
    }

    return false;
};

UI.show_navbar = function ()
{
    var w = TU.UI.getActiveWindow ();

    if (w != null)
    {
        if (TU.Device.getOS () == 'ios')
        {
            if (typeof w.showNavBar !== 'undefined')
            {
                w.showNavBar ();
                return true;
            }
        }
        else if (TU.Device.getOS () == 'android')
        {
            if (typeof w.activity !== 'undefined' && typeof w.activity.actionBar !== 'undefined' && typeof w.activity.actionBar.show !== 'undefined')
            {
                w.activity.actionBar.show ();
                return true;
            }
        }
    }

    return false;
};


/**
 * Gets the orientation of the user interface, regardless of the physical orientation
 * of the device.
 */
UI.getUIOrientation = function ()
{
    if (Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
    {
        return 'portrait';
    }
    else
    {
        return 'landscape';
    }
};

/* initialization */

UI.TUInit = function (tu)
{
	TU = tu;
	UI.Theme.TUInit (tu);
	UI.Sizer.TUInit (tu);
};


module.exports = UI;
