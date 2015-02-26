var TU = null;

function RateAppAlert () {

}

/**
 * params:
 * 
 * {
 *     title:        title of alert dialog; default: 'Please rate this app'
 *     message:      message to display in dialog; default: 'Would you take a moment to rate this app?'
 *     buttonNames:  an array with 3 strings for the 3 buttons; default: ['Rate', 'Remind Me Later', 'Never']
 *     firstcount:   number of times app is used before first showing an alert; default: 5
 *     remindcount:  number of times app is used before displaying alert if user chooses "remind me later"; default: 10
 *     iosStoreId:   the ID of the app in the iTunes app store (required if running on ios)
 *     callback:     optional callback function; when user selects option from the dialog, callback function
 *                   is called, and an action string ('rate', 'remind', or 'never') is passed to it
 * }
 * 
 * 
 * @param params
 * @constructor
 */
RateAppAlert.run = function (params)
{
    if (typeof params === 'undefined')
    {
        params = {};
    }
    if (typeof params.title === 'undefined')
    {
        params.title = 'Please rate this app';
    }
    if (typeof params.message === 'undefined')
    {
        params.message = 'Would you take a moment to rate this app?';
    }
    if ((typeof params.buttonNames === 'undefined') 
    	|| (typeof params.buttonNames.length === 'undefined')
    	|| (params.buttonNames.length !== 3))
    {
        params.buttonNames = ['Rate', 'Remind Me Later', 'Never'];
    }
    if (typeof params.firstcount === 'undefined')
    {
        params.firstcount = 5;
    }
    if (typeof params.remindcount === 'undefined')
    {
        params.remindcount = 10;
    }

    if (TU.Device.getOS() == 'ios')
    {
        if (typeof params.iosStoreId === 'undefined')
        {
            throw {
                message: 'Error: you must specify params.iosStoreId'
            };
        }
    }

    var alreadyrated = Ti.App.Properties.getBool ('TitanUp.RateAppAlert.alreadyrated', false);
    if (alreadyrated)
    {
        TU.Logger.info ("[TU.RateAppAlert] user has already rated app");
        return;
    }

    var nevershow = Ti.App.Properties.getBool ('TitanUp.RateAppAlert.nevershow', false);
    if (nevershow)
    {
        TU.Logger.info ("[TU.RateAppAlert] user has opted to never rate app");
        return;
    }

    var showcount = Ti.App.Properties.getInt ('TitanUp.RateAppAlert.showcount', 0);
    var appusecount = Ti.App.Properties.getInt('TitanUp.RateAppAlert.appusecount', 0);

    appusecount++;
    Ti.App.Properties.setInt ('TitanUp.RateAppAlert.appusecount', appusecount);
    TU.Logger.info ("[TU.RateAppAlert] appusecount = " + appusecount);

    if (showcount == 0)
    {
        if (appusecount < params.firstcount)
        {
            TU.Logger.info ("[TU.RateAppAlert] alert has never been shown; waiting until appusecount = " + params.firstcount + " to show");
            return;
        }
    }
    else if (showcount > 0)
    {
        if (appusecount < params.remindcount)
        {
            TU.Logger.info ("[TU.RateAppAlert] alert has been shown previously; waiting until appusecount = " + params.remindcount + " to show reminder");
            return;
        }
    }

    var dlg = Ti.UI.createAlertDialog ({
        title: params.title,
        message: params.message,
        buttonNames: params.buttonNames,
        cancel: 2
    });

    dlg.addEventListener ('click', function (evt)
    {
        var action = '';
        TU.Logger.info ("[TU.RateAppAlert] user chose '" + params.buttonNames[evt.index] + "'");

        switch (evt.index)
        {
            case 0:
                // OK
                action = 'rate';
                Ti.App.Properties.setBool ('TitanUp.RateAppAlert.alreadyrated', true);

                var url = '';
                if (TU.Device.getOS() == 'android')
                {
                    url ='market://details?id=' + Ti.App.getId ();
                }
                else
                {
                    url = 'itms://itunes.apple.com/us/app/apple-store/id' + params.iosStoreId + '?mt=8';
                }

                TU.Logger.info ("[TU.RateAppAlert] opening URL " + url);
                Ti.Platform.openURL (url);
                break;

            case 1:
                // "Remind Me Later"
                action = 'remind';
                Ti.App.Properties.setInt ('TitanUp.RateAppAlert.appusecount', 0);
                break;

            case 2:
                // "Never"
                action = 'never';
                Ti.App.Properties.setBool ('TitanUp.RateAppAlert.nevershow', true);
                break;
        }

        if (typeof params.callback !== 'undefined')
        {
            params.callback (action);
        }
    });

    showcount++;
    Ti.App.Properties.setInt ('TitanUp.RateAppAlert.showcount', showcount);

    TU.Logger.info ("[TU.RateAppAlert] showing alert dialog (showcount = " + showcount + ")");
    dlg.show ();
};

RateAppAlert.TUInit = function (tu)
{
    TU = tu;
};

module.exports = RateAppAlert;