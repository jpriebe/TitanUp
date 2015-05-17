var TU = null;
var _self = null;

/**
 * A tabgroup window manager -- handles opening/closing windows correctly based on platform;
 * also fires synthetic 'tabactive' event when a tab window is made active.
 */
function TGWM ()
{
    _self = Ti.UI.createTabGroup({
        navBarHidden: false
    });

    // for Android 4.x and up, with the actionbar, manage the title of the
    // action bar as the user changes tabs
    if ((TU.Device.getOS() == 'android')
       && (Ti.Platform.Android.API_LEVEL >= 11)) {
        
        _self.addEventListener('open', function(e) {
            _self.activity.actionBar.title = Ti.App.name;
        });
    }
    
    _self.addEventListener ('focus', function (e) {
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
    
    _self.TUopenWindow = function (w)
    {
        if (_self != null)
        {
            var currentTab = _self.getActiveTab ();
            var currentWin = currentTab.getWindow ();
            
            w.containingTab = currentTab;
    
            if (TU.Device.getOS () == 'android')
            {
                // android has an annoying habit of setting the tab's window to the newly
                // opened window (and it stays that way, even when the window is closed);
                // so we're going to override it
                w.addEventListener('open', function() {
                    _self.getActiveTab().setWindow (currentWin);
                });
            }
            
            _self.getActiveTab().open (w);
            return;
        }
        
        w.open ();
    };
    
    _self.TUcloseWindow = function (w)
    {
        if (_self != null)
        {
            if (TU.Device.getOS () == 'ios')
            {
                if (typeof w.containingTab != 'undefined')
                {
                    w.containingTab.close (w);
                }
                else
                {
                    _self.getActiveTab().close (w);             
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

    _self.closeOnTabInactive = function (win)
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
    
    
    return _self;
}


TGWM.TUInit = function (tu)
{
    TU = tu;
};
 

module.exports = TGWM;
