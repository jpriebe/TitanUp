/**
 * Generic class to manage geolocation:
 *  - handles cross-platform issues for iOS and Android
 *  - call LocationManager.get_coords() to get coordinates; will return null if not initialized yet; 
 *    otherwise, returns the same data structure you get on a location callback
 *  - once the desired accuracy is obtained, sleeps for 60 seconds before taking another reading
 *  - does not stop readings while app is paused, so it could leave the GPS on and firing events
 *    while app is paused; turns out that when the app is TabGroup-based, it is nearly impossible
 *    to track the pause/resume events 
 */

var TU = null;

var _coords = null;
var _desired_accuracy = 100;
var _listener_active = false;
var _first_callback_complete = false;
var _app_paused = false;
var _timeout = null;

var _update_callbacks = [];


function LocationManager ()
{
}


function add_listener ()
{
    if (_listener_active)
    {
        return;
    }

    TU.Logger.debug ("[TitanUp.LocationManager] adding location callback...");
    Ti.Geolocation.addEventListener('location', callback);
    _listener_active = true;
}

function remove_listener ()
{
    if (!_listener_active)
    {
        return;
    }

    TU.Logger.debug ("[TitanUp.LocationManager] removing location callback...");
    Ti.Geolocation.removeEventListener('location', callback);
    _listener_active = false;
}

LocationManager.compute_distance = function (lat1, lon1, lat2, lon2)
{
    var R = 6371; // km
    var deg_to_rad_const = Math.PI / 180;
    var φ1 = lat1 * deg_to_rad_const;
    var φ2 = lat2 * deg_to_rad_const;
    var Δφ = (lat2-lat1) * deg_to_rad_const;
    var Δλ = (lon2-lon1) * deg_to_rad_const;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
        + Math.cos(φ1) * Math.cos(φ2)
        * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
};

function check_update_callbacks ()
{
    for (var i = 0; i < _update_callbacks.length; i++)
    {
        var o = _update_callbacks[i];

        if (o.last_loc == null)
        {
            TU.Logger.debug ('[LocationManager] got first update; calling callback');
            o.last_loc = JSON.parse (JSON.stringify (_coords));
            o.function ();
            continue;
        }

        var dist = LocationManager.compute_distance (o.last_loc.latitude, o.last_loc.longitude, _coords.latitude, _coords.longitude);
        if (dist >= o.distance)
        {
            TU.Logger.debug ('[LocationManager] moved ' + dist + ' km since last update; calling callback');
            o.last_loc = JSON.parse (JSON.stringify (_coords));
            o.function ();
            continue;
        }
    }
}

function callback (e)
{
    if (!e.success || e.error)
    {
        TU.Logger.error("[TitanUp.LocationManager]  Error: " + JSON.stringify (e.error));
    }
    else
    {
        _coords = e.coords;
        TU.Logger.info("[TitanUp.LocationManager]"
            + " lat,lon: " + e.coords.latitude + ", " + e.coords.longitude
            + "; accuracy: " + e.coords.accuracy
            + "; timestamp: " + e.coords.timestamp);

        check_update_callbacks ();

        if (e.coords.accuracy <= _desired_accuracy)
        {
            // save this for later
            Ti.App.Properties.setObject ('Location.last_coords', _coords);

            remove_listener ();
            // put the geolocation subsystem to sleep for a minute
            TU.Logger.debug ("[TitanUp.LocationManager] sleeping the geolocation for 60 seconds...");

            if (_timeout == null)
            {
                _timeout = setTimeout (function () {
                    _timeout = null;
                    add_listener ();
                }, 60000);
            }

            return;
        }
    }

    // the first time we are in this callback, it's a result of getCurrentPosition.  Once
    // we're in here, we want to activate a true event listener
    if (!_first_callback_complete)
    {
        add_listener ();
        _first_callback_complete = true;
    }
}




function _init ()
{
    if (!Ti.Geolocation.locationServicesEnabled)
    {
        return;
    }

    _coords = Ti.App.Properties.getObject ('Location.last_coords', null);

    if (TU.Device.getOS () == 'ios')
    {
        if (_desired_accuracy < 10)
        {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        }
        else if (_desired_accuracy < 100)
        {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
        }
        else if (_desired_accuracy < 1000)
        {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HUNDRED_METERS;
        }
        else if (_desired_accuracy < 3000)
        {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_KILOMETER;
        }
        else
        {
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_LOW;
        }

        Ti.Geolocation.distanceFilter = 10;
        Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    }
    else
    {
        // use simple mode on Android and mobile web
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    }

    // note that these don't work on android without help from something like
    // bencoding.android.tools or our TitanUp/Context tracking
    Ti.App.addEventListener('resumed', function () {
        TU.Logger.debug ("[TitanUp.LocationManager] event: resumed");
        _app_paused = false;
        add_listener ();
    });

    Ti.App.addEventListener('paused', function () {
        TU.Logger.debug ("[TitanUp.LocationManager] event: paused");
        _app_paused = true;
        if (_timeout != null)
        {
            clearTimeout (_timeout);
            _timeout = null;
        }
        remove_listener ();
    });

    Ti.Geolocation.purpose = 'Determine Current Location';

    // call once for a quick position update -- might be cached, but at least
    // you'll have something quick in case the user access location-dependent
    // content.
    Ti.Geolocation.getCurrentPosition (callback);
}


LocationManager.TUInit = function (tu)
{
	TU = tu;
};


/**
 * Returns the current coordinates object
 */
LocationManager.getCoords = function ()
{
    return _coords;
};

/**
 * Initializes the LocationManager so you can start getting location data
 */
LocationManager.init = function (desired_accuracy)
{
    if (typeof desired_accuracy !== 'undefined')
    {
        _desired_accuracy = desired_accuracy;
    }

    _init ();
};

/**
 * Registers a callback to be triggered when the device moves more than a specified amount
 * from its current position
 * @param f function to be called
 * @param distance distance in km
 */
LocationManager.addUpdateCallback = function (f, distance)
{
    var o = {
        function: f,
        distance: distance
    };

    if (_coords == null)
    {
        o.last_loc = null;
    }
    else
    {
        o.last_loc = JSON.parse (JSON.stringify (_coords));
    }

    _update_callbacks.push (o);
};


module.exports = LocationManager;
