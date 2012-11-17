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
var _retry_timeout = null;
var _desired_accuracy = 100;
var _listener_active = false;
var _initialized = false;
var _first_callback = false;
var _geo_sleeping = false;

function LocationManager ()
{
	function add_listener ()
	{
		if (_geo_sleeping)
		{
			return;
		}
		
		if (!_listener_active)
		{
			Ti.API.debug ("[LocationManager] " + (new Date()) + " adding location callback...");
			Ti.Geolocation.addEventListener('location', callback);
			_listener_active = true;
		}
	}

	function remove_listener ()
	{
		if (_listener_active)
		{
			Ti.API.debug ("[LocationManager] " + (new Date()) + " removing location callback...");
			Ti.Geolocation.removeEventListener('location', callback);
			_listener_active = false;
		}
	}
	
	function callback (e)
	{
	    if (!e.success || e.error) 
	    {
	        Ti.API.error("[LocationManager] " + (new Date()) + " Error: " + JSON.stringify (e.error));
	    } 
	    else 
	    {
	    	_coords = e.coords;
	    	Ti.API.info("[LocationManager] " + (new Date()) + " lat,lon: " + e.coords.latitude + ", " + e.coords.longitude 
	    		+ "; accuracy: " + e.coords.accuracy 
	    		+ "; timestamp: " + e.coords.timestamp);
	        Ti.API.info(e.coords);
		    if (e.coords.accuracy <= _desired_accuracy)
		    {
		    	// put the geolocation subsystem to sleep for a minute
		    	Ti.API.debug ("[LocationManager] " + (new Date()) + " sleeping the geolocation for 60 seconds...");
		    	_geo_sleeping = true;
		    	remove_listener ();
		    	setTimeout (function () {
		    		_geo_sleeping = false;
		    		add_listener ();
		    	}, 60000);
		    	return;
		    }
	    }
	    
	    // the first time we are in this callback, it's a result of getCurrentPosition.  Once
	    // we're in here, we want to activate a true event listener
	    if (!_first_callback)
	    {
   			add_listener ();
		    _first_callback = true;
	    }	    
	}
	
	/**
	 * Returns the current coordinates object
	 */
	this.getCoords = function ()
	{
		return _coords;
	};

	
	function _init ()
	{
		if (Ti.Geolocation.locationServicesEnabled) 
		{
			if (TU.Device.getOS () == 'ios')
			{
				// Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST
			    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HUNDRED_METERS;
			    Ti.Geolocation.distanceFilter = 10;
			    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
			}
			else
			{
				// use simple mode on Android and mobile web
				Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
				
				/* 
				 * Ideally, we'd use event listeners on the pause and resume events to stop and
				 * start the geolocation event listener. 
				 * 
				 * But in a tabgroup based UI, we don't get pause/resume events when the app
				 * is backgrounded and foregrounded.  :-(
				 *
				if (TU.Device.getOS () == 'android')
				{

					Ti.API.debug ("[LocationManager] " + (new Date()) + " adding android lifecycle listeners...")
				    
				    var activity = Ti.Android.currentActivity;
				    if (activity)
				    {
					    activity.addEventListener('destroy', function (e) {
					    	Ti.API.debug ("[LocationManager] " + (new Date()) + " event: destroy");
					    	_app_sleeping = true;
					    	remove_listener ();
					    });
					    activity.addEventListener('pause', function (e) {
					    	Ti.API.debug ("[LocationManager] " + (new Date()) + " event: pause");
					    	_app_sleeping = true;
					    	remove_listener ();
					    });
					    activity.addEventListener('start', function (e) {
					    	Ti.API.debug ("[LocationManager] " + (new Date()) + " event: start");
					    	_app_sleeping = false;
					    	add_listener ();
					    });
					    activity.addEventListener('resume', function (e) {
					    	Ti.API.debug ("[LocationManager] " + (new Date()) + " event: resume");
					    	_app_sleeping = false;
					    	add_listener ();
				    	});
				    }
				}
			    */
				
			}
			
			Ti.Geolocation.purpose = 'Determine Current Location';
						
			// call once for a quick position update -- might be cached, but at least
			// you'll have something quick in case the user access location-dependent
			// content.
			Ti.Geolocation.getCurrentPosition (callback);
			_initialized = true;
		} 
		else 
		{
		    alert('Please enable location services');
		}
		
	};
	
	if (!_initialized)
	{
		_init ();
	}
	
}


LocationManager.TUInit = function (tu)
{
	TU = tu;
};


module.exports = LocationManager;
