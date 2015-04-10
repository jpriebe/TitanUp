var TU = null;

// don't expose these -- internal use only
var _osname = '';
var _platformName = '';
var _dc = null;

// expose these
var _model = '';
var _defaultunit = '';
var _os = 'unknown';
var _workingWidth = 0;
var _workingHeight = 0;
var _density = '';
var _dpi = 0;
var _isTablet = false;
var _screensize = 0;

var _iphone_level = -1;
var _ipad_level = -1;

var _ios7plus = false;
var _android4plus = false;

var _has_google_play_services = false;

function Device () 
{
}


function initialize ()
{
    _defaultunit = Ti.App.Properties.getString ('ti.ui.defaultunit', 'system');
    _osname = Ti.Platform.osname;
    _platformName = Ti.Platform.name;
    _model = Ti.Platform.model;

    if (_platformName === 'iPhone OS')
    {
        _os = 'ios';

        var version = Ti.Platform.version.split(".");
        var major = parseInt(version[0],10);

        // Can only test this support on a 3.2+ device
        if (major >= 7)
        {
            _ios7plus = true;
        }

        var results = _model.match (/iphone(\d+),(\d+)/i);
        if (results)
        {
            _iphone_level = results[1];
        }

        results = _model.match (/ipad(\d+),(\d+)/i);
        if (results)
        {
            _ipad_level = results[1];
        }
    }
    else if (_platformName === "android")
    {
        _os = 'android';

        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0],10);

        // Can only test this support on a 3.2+ device
        if (major >= 4)
        {
            _android4plus = true;
        }
    }

    if (_defaultunit == 'system')
    {
        _defaultunit = Device.getNativeUnit ();
    }

    // normalize this one, it can be either 'dp' or 'dip'
    if (_defaultunit == 'dip')
    {
        _defaultunit = 'dp';
    }

    if (_defaultunit != 'dp')
    {
        TU.Logger.warn ("[TitanUp.Device] ti.ui.defaultunit is not set to 'dp'; it is highly recommended that you set it to 'dp' in your tiapp.xml");
    }

    _dc = Ti.Platform.displayCaps;
	_density = _dc.density;
	_dpi = _dc.dpi;

    var pw = Device.getPhysicalWidth();
    var ph = Device.getPhysicalHeight();
    _screensize = Math.sqrt (pw * pw + ph * ph);

	_isTablet = (_osname === 'ipad') 
		|| ((_os === 'android') && (_screensize >= 6.25));

    TU.Logger.debug ("[TitanUp.Device] os: " + _os);
    TU.Logger.debug ("[TitanUp.Device] density: " + _density);
    TU.Logger.debug ("[TitanUp.Device] dpi: " + _dpi);
    TU.Logger.debug ("[TitanUp.Device] displayWidth: " + Device.getDisplayWidth ());
    TU.Logger.debug ("[TitanUp.Device] displayHeight: " + Device.getDisplayHeight ());
    TU.Logger.debug ("[TitanUp.Device] screensize: " + _screensize);
    TU.Logger.debug ("[TitanUp.Device] isTablet: " + _isTablet);

    if (_os == 'android')
    {
        _has_google_play_services = true;

        // kindle fire devices do not have google_play_services
        if (Ti.Platform.getManufacturer ().match (/amazon/i))
        {
            _has_google_play_services = false;
        }
    }

	_workingWidth = Device.getDisplayWidth();
	_workingHeight = Device.getDisplayHeight();
}




/**
 * Gets the OS string (either 'ios' or 'android')
 * @return string
 */
Device.getOS = function ()
{
	return _os;
};

/**
 * Gets the model name of the device
 * @returns {string}
 */
Device.getModel = function ()
{
    return _model;
};

/**
 * Gets the major value of the iphone model number (e.g. iphone 6 is "7,2"; this function returns 7);
 * If device is not an iphone, returns -1.
 * @returns {number}
 */
Device.getIphoneLevel = function ()
{
    return _iphone_level;
};

/**
 * Gets the major value of the ipad model number (e.g. iphone 6 is "7,2"; this function returns 7);
 * If device is not an ipad, returns -1.
 * @returns {number}
 */
Device.getIpadLevel = function ()
{
    return _ipad_level;
};

/**
 * Gets a boolean indicating whether this is iOS 7 or up; this is relevant for layout of windows
 * @returns {boolean}
 */
Device.getiOS7Plus = function ()
{
    return _ios7plus;
};

/**
 * Gets a boolean indicating whether this is android 4 or up; this is relevant for layout of windows
 * @returns {boolean}
 */
Device.getAndroid4Plus = function ()
{
    return _android4plus;
};

/**
 * Gets a boolean indicating whether this device is known to have google play services; errs
 * on the side of assuming that all android devices have play services; only set to false for
 * known "offenders" like Kindle Fire.
 * @returns {boolean}
 */
Device.getHasGooglePlayServices = function ()
{
    return _has_google_play_services;
};

/**
 * Sets a boolean indicating whether this device is known to have google play services; errs
 * on the side of assuming that all android devices have play services; only set to false for
 * known "offenders".
 */
Device.setHasGooglePlayServices = function (has_play_service)
{
    _has_google_play_services = has_play_service;
};

/**
 * Gets the default unit ('cm', 'dp', 'in', 'mm', 'px'); note that if tiapp.xml specifies 'system',
 * TitanUp will expand that to the appropriate platform-specific unit ('dp' for ios, 'px' for android)
 * @return string
 */
Device.getDefaultUnit = function ()
{
    return _defaultunit;
};

/**
 * Gets the display width in native units
 * @return int
 */
Device.getDisplayWidth = function ()
{
    var densityFactor = Device.getLogicalDensityFactor ();

    if (Device.getNativeUnit () == 'dp')
    {
        if (_defaultunit == 'dp')
        {
            return _dc.platformWidth;
        }

        return parseInt (_dc.platformWidth * densityFactor);
    }
    else if (Device.getNativeUnit () == 'px')
    {
        if (_defaultunit == 'dp')
        {
            return parseInt (_dc.platformWidth / densityFactor);
        }
        return _dc.platformWidth;
    }
};

/**
 * Gets the display height in native units
 * @return int
 */
Device.getDisplayHeight = function ()
{
    var densityFactor = Device.getLogicalDensityFactor ();

    if (Device.getNativeUnit () == 'dp')
    {
        if (_defaultunit == 'dp')
        {
            return _dc.platformHeight;
        }
        return parseInt (_dc.platformHeight * densityFactor);
    }
    else if (Device.getNativeUnit () == 'px')
    {
        if (_defaultunit == 'dp')
        {
            return parseInt (_dc.platformHeight / densityFactor);
        }
        return _dc.platformHeight;
    }
};


/**
 * Gets the screen density ('low', 'medium', 'high', 'xhigh', or 'xxhigh')
 * @return string
 */
Device.getDensity = function ()
{
	return _density;
};

/**
 * Gets the device DPI
 * @return int
 */
Device.getDpi = function ()
{
	return _dpi;
};

/**
 * Gets the native display units used on the platform; either 'dp' or 'px'
 * @return string
 */
Device.getNativeUnit = function ()
{
    if (_os == 'ios')
    {
        return 'dp';
    }
    
    return 'px';
};

/**
 * Gets the logical density factor (ratio of pixels to dps)
 * @return float
 */
Device.getLogicalDensityFactor = function ()
{
    if (_os == 'android')
    {
        return _dc.logicalDensityFactor;
    }

    // logical density factor not supported on iOS, so we can roll our own
    if (_os == 'ios')
    {
        switch (_density)
        {
            case 'medium':
                return 1;
                break;

            case 'high':
                return 2;
                break;

            case 'xhigh':
                return 3;
                break;
        }
    }
    
    return 1;
};


/**
 * True if the device is a tablet (either an ipad or an android of screen size > 6.25 inches)
 * @return bool
 */
Device.getIsTablet = function ()
{
	return _isTablet;
};

/**
 * Gets the physical width of the screen in inches
 * @return number
 */
Device.getPhysicalWidth = function ()
{
    var densityFactor = Device.getLogicalDensityFactor ();
    return Device.getDisplayWidth () / _dpi * densityFactor;
};

/**
 * Gets the physical height of the screen in inches
 * @return number
 */
Device.getPhysicalHeight = function ()
{
    var densityFactor = Device.getLogicalDensityFactor ();
    return Device.getDisplayHeight () / _dpi * densityFactor;
};

/**
 * Gets the diagonal screensize in inches
 * @return float
 */
Device.getScreensize = function ()
{
	return _screensize;
};

/**
 * Gets the actual working width of the application in native units, minus navbars and tabs;
 * note that this library does not actually compute this working width and height; you must
 * capture it from within a postlayout event on your application's first window, and then call
 * setWorkingDimensions() to save the width and height for future reference.
 * @return int
 */
Device.getWorkingWidth = function ()
{
	return _workingWidth;
};

/**
 * Gets the actual working height of the application in native units, minus navbars and tabs;
 * note that this library does not actually compute this working width and height; you must
 * capture it from within a postlayout event on your application's first window, and then call
 * setWorkingDimensions() to save the width and height for future reference.
 * @return int
 */
Device.getWorkingHeight = function ()
{
	return _workingHeight;
};

/**
 * Set the working area of the application in native units; call this from within a postlayout
 * event listener in your application's first window.
 * @param int workingWidth
 * @param int workingHeight
 */
Device.setWorkingDimensions = function (workingWidth, workingHeight)
{
	_workingWidth = workingWidth;
	_workingHeight = workingHeight;
};

Device.TUInit = function (tu)
{
    TU = tu;
    initialize ();
};

module.exports = Device;