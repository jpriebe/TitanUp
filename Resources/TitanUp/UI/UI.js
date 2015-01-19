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
    RemoteImageView.TUInit (TU);

    return new RemoteImageView (params);
};


UI.Theme = require ('/TitanUp/UI/Theme');
UI.Sizer = require ('/TitanUp/UI/Sizer');

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
        if (w == _window_stack[_window_stack.length - 1])
        {
            _window_stack.pop ();
            TU.Logger.warn ('[TitanUp.UI] window closed; window.stack.length: ' + _window_stack.length);
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

    _curr_wm.TUopenWindow (w);
};

UI.closeWindow = function (w)
{
    TU.Logger.debug ('[TitanUp.UI] closeWindow()');

    if (_curr_wm == null)
    {
        w.close ();
    }
    else
    {
        _curr_wm.TUcloseWindow (w);
    }
};

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

UI.TUInit = function (tu)
{
	TU = tu;
	UI.Theme.TUInit (tu);
	UI.Sizer.TUInit (tu);
};


module.exports = UI;
