var TU = null;

var _defaultunit = 'dp';     // we will check this from Ti SDK, but you *are* using dp, right???  :-P
var _density = 'medium';     // density string, adjusted to make ios and android densities equivalent
var _ldf = 1;                // logical density factor (relative to 160 dpi); calculated based on density string, not physical screen resolution
var _isTablet = false;

/**
 * A utility class to help build interfaces that are consistently sized across platforms.  Use the utility
 * functions getDimension() and getDimensionExact() to get dimension values that result in consistent
 * sizes.
 */
function Sizer ()
{
}

/**
 * Given a value in pixels, converts it to dp
 * @param px
 * @returns int
 */
Sizer.pxToDp = function  (px)
{
    return parseInt (px / _ldf);
};

/**
 * Given a value in dp, converts it to px
 * @param dp
 * @returns int
 */
Sizer.dpToPx = function  (dp)
{
    return parseInt (dp * _ldf);
};

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
Sizer.getDimension = function (dp)
{
    if (_defaultunit === 'dp')
    {
        return dp;
    }

    return Sizer.dpToPx (dp);
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
 * @param int xxh
 * @param int xxxh
 * @return int
 */
Sizer.getDimensionExact = function (l, m, h, xh, xxh, xxxh)
{
    if (_defaultunit === 'dp')
    {
        //TU.Logger.debug ("[TU.UI.Sizer] getDimensionExact (" + l + ", " + m + ", " + h + ", " + xh + "); defaultunit == dp: return " + m + "dp");
        return m;
    }
    
    // default to highest resolution available, just in case there's some density out there
    // even higher than xhigh
    var dimension = xh;
    
    //TU.Logger.debug ("[TU.UI.Sizer] getDimensionExact (" + l + ", " + m + ", " + h + ", " + xh + "); density: " + _density);
    switch (_density)
    {
        case 'low':
            dimension = l;          
            break;
            
        case 'medium':
            dimension = m;          
            break;
            
        case 'high':
            dimension = h;          
            break;
        
        case 'xhigh':
            dimension = xh;     
            break;

        case 'xxhigh':
            dimension = xxh;     
            break;

        case 'xxxhigh':
            dimension = xxxh;
            break;
    }
    
    return dimension;
};

function initialize ()
{
    _density = TU.Device.getDensity ();

    _ldf = TU.Device.getLogicalDensityFactor();

    _defaultunit = TU.Device.getDefaultUnit ();

    _isTablet = TU.Device.getIsTablet ();
}


Sizer.TUInit = function (tu)
{
    TU = tu;
    initialize ();
};



module.exports = Sizer;
