var TU = null;

var _defaultunit = '';
var _density = 'medium';
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
    var dp = px;
    switch (_density)
    {
        case 'low':
            dp = parseInt (px / 0.75);
            break;

        case 'medium':
            dp = px;
            break;

        case 'high':
            dp = parseInt (px / 1.5);
            break;

        case 'xhigh':
            dp = parseInt (px / 2);
            break;

        case 'xxhigh':
            dp = parseInt (px / 3);
            break;

        case 'xxxhigh':
            dp = parseInt (px / 4);
            break;
    }

    return dp;
};

/**
 * Given a value in dp, converts it to px
 * @param dp
 * @returns int
 */
Sizer.dpToPx = function  (dp)
{
    var px = dp;
    switch (_density)
    {
        case 'low':
            px = parseInt (dp * 0.75);
            break;

        case 'medium':
            px = dp;
            break;

        case 'high':
            px = parseInt (dp * 1.5);
            break;

        case 'xhigh':
            px = parseInt (dp * 2);
            break;

        case 'xxhigh':
            px = parseInt (dp * 3);
            break;

        case 'xxxhigh':
            px = parseInt (dp * 4);
            break;
    }

    return px;
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
Sizer.getDimension = function (m) 
{
    if (_defaultunit == 'dp')
    {
        return m;
    }

    var l = parseInt (m * 0.75);
    var h = parseInt (m * 1.5);
    var xh = m * 2;
    var xxh = m * 3;

    return Sizer.getDimensionExact (l, m, h, xh, xxh);
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
    if (_defaultunit == 'dp')
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

    _defaultunit = TU.Device.getDefaultUnit ();

    _isTablet = TU.Device.getIsTablet ();
}


Sizer.TUInit = function (tu)
{
    TU = tu;
    initialize ();
};



module.exports = Sizer;
