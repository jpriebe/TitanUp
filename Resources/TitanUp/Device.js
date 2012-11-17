// don't expose these -- internal use only
var _osname = '';
var _platformName = '';
var _dc = null;

// expose these
var _os = 'unknown';
var _displayWidth = 0;
var _displayHeight = 0;
var _workingWidth = 0;
var _workingHeight = 0;
var _density = '';
var _dpi = 0;
var _isTablet = false;
var _physicalWidth = 0;
var _physicalHeight = 0;
var _screensize = 0;

function Device () 
{
}


function initialize ()
{
    _osname = Ti.Platform.osname;
    _platformName = Ti.Platform.name;
    if (_platformName=== 'iPhone OS')
    {
        _os = 'ios';
    }
    else if (_platformName === "android")
    {
        _os = 'android';
    }
    
    _dc = Ti.Platform.displayCaps;
	_density = _dc.density;
	_dpi = _dc.dpi;


    function computePhysicalDimensions ()
    {
        var densityFactor = 1;

        if (Device.getNativeUnit() == 'dip')
        {
            densityFactor = Device.getLogicalDensityFactor ();
        }
        
        _physicalWidth = _displayWidth / _dpi * densityFactor;
        _physicalHeight = _displayHeight / _dpi * densityFactor;

        Ti.API.debug ('[TU.Device] _physicalWidth: ' + _physicalWidth);
        Ti.API.debug ('[TU.Device] _physicalHeight: ' + _physicalHeight);
    }

    function setDisplayDimensions ()
    {
		_displayWidth = _dc.platformWidth;
		_displayHeight = _dc.platformHeight;
		
        Ti.API.debug ('[TU.Device] _displayWidth: ' + _displayWidth);
        Ti.API.debug ('[TU.Device] _displayHeight: ' + _displayHeight);

		computePhysicalDimensions ();
    }
    
	
	Ti.Gesture.addEventListener('orientationchange', function(e) {
		setDisplayDimensions ();
	});

	setDisplayDimensions ();
	
	
	_screensize = Math.sqrt (_physicalWidth * _physicalWidth + _physicalHeight * _physicalHeight);

	_isTablet = (_osname === 'ipad') 
		|| ((_osname === 'android') && (_screensize >= 6.25));
		
	Ti.API.debug ('[TU.Device] _screensize: ' + _screensize);
	Ti.API.debug ('[TU.Device] _isTablet: ' + (_isTablet) ? 'true' : 'false');
	
	_workingWidth = _displayWidth;
	_workingHeight = _displayHeight;
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
 * Gets the display width in native units
 * @return int
 */
Device.getDisplayWidth = function ()
{
	return _displayWidth;
};

/**
 * Gets the display height in native units
 * @return int
 */
Device.getDisplayHeight = function ()
{
	return _displayHeight;
};

/**
 * Gets the screen density ('low', 'medium', 'high', or 'xhigh')
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
 * Gets the native display units used on the platform; either 'dip' or 'px'
 * @return string
 */
Device.getNativeUnit = function ()
{
    if (_os == 'ios')
    {
        return 'dip';
    }
    
    return 'px';
}

/**
 * Gets the logical density factor (ratio of pixels to dips)
 * @return float
 */
Device.getLogicalDensityFactor = function ()
{
    if (_os == 'android')
    {
        return _dc.logicalDensityFactor;
    }
    
    if (_os == 'ios')
    {
        // iOS reports platformWidth and platformHeight in dips, but dpi in px,
        // so we have to compensate for high-density iOS devices; otherwise, we
        // would get physical sizes like 1" x 1.5"
        //
        // Device        Retina       non-Retina
        // iphone        320dpi       160dpi
        // ipad          260dpi       130dpi
        if (((_osname == 'ipad') && (_dpi == 260))
            || (_dpi == 320))
        {
            return 2;
        }
    }
    
    return 1;
}


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
 * @return float
 */
Device.getPhysicalWidth = function ()
{
	return _physicalWidth;
};

/**
 * Gets the physical height of the screen in inches
 * @return float
 */
Device.getPhysicalHeight = function ()
{
	return _physicalHeight;
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
}


initialize ();

module.exports = Device;