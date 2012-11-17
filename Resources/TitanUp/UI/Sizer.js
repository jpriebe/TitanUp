var TU = null;

var _isIOS = false;
var _density = 'medium';
var _isTablet = false;

/**
 * A utility class to help build interfaces that are consistently sized across platforms.  Use the utility
 * functions getDimension() and getDimensionExact() to get dimension values that result in consistent
 * sizes. 
 * 
 * This library utilizes native units (dp for iOS, px for Android).  This means that we're more or
 * less dealing with physical pixels except in the case of retina display iOS, where we're treating
 * the retina iphone as if it were a 320x480 device.
 * 
 * Using native units has the advantage that you can just pass numeric values as the size and position
 * for your views; you don't need to add any modifiers like 'px' or 'dp'.  If we were to pick one unit
 * and utilize it across the board (e.g. pixels), we'd have to tack on 'px' to every dimension we ever
 * use.
 */
function Sizer ()
{
}

/**
 * Given a dimension that is tuned for medium-density displays, returns the appropriate
 * dimension for the current display density in the native units for the OS (dp for
 * iOS, px for Android)
 * 
 * Note: returns larger values on tablet displays.
 * 
 * @param int m
 * @return int
 */
Sizer.getDimension = function (m) 
{
	if (_isIOS)
	{
		//Ti.API.debug ("[TU.UI.Sizer] getDimensionExact (" + l + ", " + m + ", " + h + ", " + xh + "); iOS: return " + m + "dp");
		return m;
	}
	
	Ti.API.debug ("[TU.UI.Sizer] getDimensionExact (" + l + ", " + m + ", " + h + ", " + xh + "); density: " + _density);

	var l = parseInt (m * 0.75);
	var h = parseInt (m * 1.5);
	var xh = m * 2;
	
	var dimension = m;
	
	switch (_density)
	{
		case 'low':
			dimension = (_isTablet) ? m : l;			
			break;
			
		case 'medium':
			dimension = (_isTablet) ? h : m;			
			break;
			
		case 'high':
			dimension = (_isTablet) ? xh : h;			
			break;
		
		case 'xhigh':
			dimension = xh;		
			break;
	}
	
	return dimension;
	
};

/**
 * Similar to getDimension(), but the caller provides the exact dimensions for all display densities;
 * ideal for situations where you have images that are specific sizes and you want to make sure you
 * don't have any rounding issues.
 * 
 * Returns the appropriate dimension for the current display density in the appropriate units for
 * the OS (dp for iOS, px for Android)
 * 
 * Note: returns larger values on tablet displays.
 * 
 * @param int l
 * @param int m
 * @param int h
 * @param int xh
 * @return int
 */
Sizer.getDimensionExact = function (l, m, h, xh)
{
	if (_isIOS)
	{
		//Ti.API.debug ("[TU.UI.Sizer] getDimensionExact (" + l + ", " + m + ", " + h + ", " + xh + "); iOS: return " + m + "dp");
		return m;
	}
	
	// default to highest resolution available, just in case there's some density out there
	// even higher than xhigh
	var dimension = xh;
	
	//Ti.API.debug ("[TU.UI.Sizer] getDimensionExact (" + l + ", " + m + ", " + h + ", " + xh + "); density: " + _density);
	switch (_density)
	{
		case 'low':
			dimension = (_isTablet) ? m : l;			
			break;
			
		case 'medium':
			dimension = (_isTablet) ? h : m;			
			break;
			
		case 'high':
			dimension = (_isTablet) ? xh : h;			
			break;
		
		case 'xhigh':
			dimension = xh;		
			break;
	}
	
	return dimension;
}

function initialize ()
{
	_density = TU.Device.getDensity ();

	if (TU.Device.getOS () == 'ios')
	{
		_isIOS = true;
	}
	
	_isTablet = TU.Device.getIsTablet ();
}


Sizer.TUInit = function (tu)
{
	TU = tu;
	initialize ();
}



module.exports = Sizer;
