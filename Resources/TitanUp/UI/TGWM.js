var TU = null;
var _tabgroup = null;

/**
 * A tabgroup window manager -- handles opening/closing windows correctly based on platform;
 * also fires synthetic 'tabactive' event when a tab window is made active.
 */
function TGWM ()
{
	
}


/**
 * Creates a TabGroup, keeping a reference to it for future use in opening/closing windows.
 * Also watches the tabgroup for changes between tabs, firing a synthetic event 'tabactive'
 * on the newly active tab
 * @return Ti.UI.TabGroup
 */
TGWM.createTabGroup = function ()
{
    _tabgroup = Titanium.UI.createTabGroup({
        navBarHidden: false
    });

    // for Android 4.x and up, with the actionbar, manage the title of the
    // action bar as the user changes tabs
    if ((TU.Device.getOS() == 'android')
       && (Ti.Platform.Android.API_LEVEL >= 11)) {
        
        _tabgroup.addEventListener('open', function(e) {
            _tabgroup.activity.actionBar.title = Ti.App.name;
        });
    }
    
	_tabgroup.addEventListener ('focus', function (e) {
		if (e.previousIndex != e.index)
		{
			//TU.Logger.debug ('[TU.UI.TGWM] active tab changed from tab ' + e.previousIndex + ' to tab ' + e.index);
			if ((e.previousIndex >= 0) && (e.previousTab != null))
			{
				e.previousTab.getWindow ().fireEvent ('tabinactive', e);
			}
			e.tab.getWindow ().fireEvent ('tabactive', e);
		}
	});
	
	return _tabgroup;
};

/**
 * Opens a window in an appropriate way based on whether a tabgroup is active
 * and based on the os platform
 * @param Ti.UI.Window w
 */
TGWM.TUopenWindow = function (w)
{
	if (_tabgroup != null)
	{
		var currentTab = _tabgroup.getActiveTab ();
		var currentWin = currentTab.getWindow ();
		
		w.containingTab = currentTab;

		if (TU.Device.getOS () == 'android')
		{
			// android has an annoying habit of setting the tab's window to the newly
			// opened window (and it stays that way, even when the window is closed);
			// so we're going to override it
			w.addEventListener('open', function() {
			    _tabgroup.getActiveTab().setWindow (currentWin);
			});
		}
		
		_tabgroup.getActiveTab().open (w);
		return;
	}
	
	w.open ();
};

/**
 * Closes a window in an appropriate way; if a TabGroup is active and we're on iOS, closes
 * it through the TabGroup; otherwise, closes it directly.
 * @param Ti.UI.Window w
 */
TGWM.TUcloseWindow = function (w)
{
	if (_tabgroup != null)
	{
		if (TU.Device.getOS () == 'ios')
		{
			if (typeof w.containingTab != 'undefined')
			{
				w.containingTab.close (w);
			}
			else
			{
				_tabgroup.getActiveTab().close (w);				
			}
		}
		else
		{
			w.close ();
		}
		
		return;
	}
	
	w.close ();
};


TGWM.closeOnTabInactive = function (win)
{
	var mytabwin = TGWM.getActiveTab ().getWindow ();

	var onTabInactive = function (e)
	{
		mytabwin.removeEventListener ('tabinactive', onTabInactive);
		TGWM.closeWindow (win);
	};
	
	if (mytabwin)
	{
		mytabwin.addEventListener ('tabinactive', onTabInactive);
	}
};



TGWM.getActiveTab = function ()
{
	return _tabgroup.getActiveTab();	
};


TGWM.TUInit = function (tu)
{
	TU = tu;
    TU.UI.TGWM = TGWM;
};


module.exports = TGWM;
