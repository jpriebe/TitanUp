/**
 * Allows you to safely use the Map.View across both iphone and android; manages a single
 * instance of the Map.View.  Handles adding/removing the Map.View from views as needed.  
 * 
 * Note that to use this, you'll need to:
 *   - use ManagedMapView.addToView(foo) instead of foo.add ()
 *   - call addToView() every time you need to show the map view; if the MMV is already
 *     added to your view, nothing will happen
 */

var _instance = null;
var _current_parent = null;
var _click_callback = null;


function ManagedMapView ()
{
	if (_instance != null)
	{
		return _instance;
	}
	
	_instance = Titanium.Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    animate: true,
	    regionFit: true,
	    userLocation: true,
	    visible: false
	});
	
	/**
	 * Handle clicks appropriately for both iOS and android
	 */
	_instance.addEventListener('click',function(e) {
		
		if (e.clicksource == null || e.clicksource == 'pin'
			|| e.annotation == null)
		{
			return;
		}
		
		if (_click_callback != null)
		{
			_click_callback (e);
		}
	});
	
	/**
	 * Simplest way to use the ManagedMapView; give it the view you want to add the map to,
	 * along with its parent window.  It will wait until the window is open to add the
	 * MapView (since it's unreliable if added before open event) to the view; it will also remove the
	 * MapView from the view when the window is closed.
	 * 
	 * This is ideal for popup windows that will use the MapView and then be closed.  You can
	 * also use it with a window that is part of a TabGroup, but in that case, you may have to
	 * make use of the addToView() function directly when the user tabs to your window.
	 * 
	 * Params:
	 *   view: the view to add the MapView to
	 *   win:  the window containing the view
	 *   click_callback: a callback to make when a click on an annotation is fired
	 *   added_callback: a callback to make when the view is added
	 *   removed_callback: a callback to make when the view is removed
	 */
	_instance.manage = function (view, win, click_callback, added_callback, removed_callback)
	{
		Ti.API.debug ('[ManagedMapView.addToView] managing MapView for window "' + win.title + '"...');
		
		win.addEventListener ('open', function (e) {
			_instance.addToView (view, click_callback);
			
			if (added_callback)
			{
				added_callback ();
			}
		});
		
		win.addEventListener ('close', function (e) {
			_instance.removeFromView (view);

			if (removed_callback)
			{
				removed_callback ();
			}
		});
	}
	
	/**
	 * Adds the ManagedMapView to a view, making sure to remove it from the previous view, if there
	 * was one.  click_callback is a callback function which will be called when the user clicks
	 * on an annontation in the map (note that the underlying mapview may trigger click events
	 * for all sorts of clicks, not just clicks on annotations, but we're only going to call the
	 * click_callback when the user clicks on an annotation).
	 */
	_instance.addToView = function (view, click_callback)
	{
		Ti.API.debug ('[ManagedMapView.addToView] entering...');

		if (view == _current_parent)
		{
			return;
		}
		
		if (_current_parent != null)
		{
			_instance.removeFromView (_current_parent);
		}
		
		Ti.API.debug ('[ManagedMapView.addToView] adding instance to view "' + view.title + '"...');

		view.add (_instance);
		_current_parent = view;
		_click_callback = click_callback;
	}
	
	_instance.removeFromView = function (view)
	{
		Ti.API.debug ('[ManagedMapView.removeFromView] entering...');
		if (view != _current_parent)
		{
			return;
		}
		
		Ti.API.debug ('[ManagedMapView.removeFromView] removing instance from view "' + view.title + '"...');

		_current_parent = null;
		_click_callback = null;
		view.remove (_instance);
	}
	
	return _instance;	
}


module.exports = ManagedMapView;