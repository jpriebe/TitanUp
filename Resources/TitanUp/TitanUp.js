/**
 * TitanUp library for Titanium Mobile development
 * 
 * To use it, put this in your app.js (in the global scope):
 * 
 * var TU = require ('/TitanUp/TitanUp');
 */

var start = new Date().getTime();

var _version = '2.0.0';

var LocationManager = null;

function TitanUp ()
{

}

TitanUp.getVersion = function ()
{
    return _version;
};

TitanUp.Logger = require ('/TitanUp/Logger');
TitanUp.Logger.debug ('[TitanUp] initializing...');

TitanUp.Device = require ('/TitanUp/Device');
TitanUp.Device.TUInit (TitanUp);

TitanUp.Context = require ('/TitanUp/Context');
TitanUp.Context.TUInit (TitanUp);

TitanUp.UI = require ('/TitanUp/UI/UI');
TitanUp.UI.TUInit (TitanUp);

// Having spaces in the Titanium app name is not good; bugs in Titanium have caused
// debugging to stop working if you use spaces.
// So if you want to have spaces in the app name as displayed on the device and within
// the app itself, you don't put spaces in the <name> elements in tiapp.xml.
// Instead, you override the name in i18n/en/app.xml.
//
// *Unfortunately* Ti.App.getName() doesn't honor the appname from the i18n/en/app.xml;
// on android, we have a workaround -- we can find it in the i18n strings table under
// "app_name".  But this doesn't work on iOS, and I can't find anywhere else that we
// can access it.
//
// So for a cross-platform solution, you should specify a property in tiapp.xml
// called tu-app-display-name.  TitanUp will *try* to automatically determine the app
// name, but the tu-app-display-name property is the authoritative source if it is found.
var _i18n_appname = L('app_name', '*');
var _ti_appname = Ti.App.getName ();

var _appname = (_i18n_appname === '*') ? _ti_appname : _i18n_appname;

_appname = Ti.App.Properties.getString ('tu-app-display-name', _appname);

TitanUp.getAppName = function ()
{
    return _appname;
};


TitanUp.getLocationManager = function ()
{
    if (LocationManager == null)
    {
        LocationManager = require ('/TitanUp/LocationManager');
        LocationManager.TUInit (TitanUp);
    }

    return LocationManager;
};

TitanUp.Globals = {};

var elapsed = new Date().getTime() - start;
TitanUp.Logger.debug ("[TitanUp] load time: " + elapsed + " ms");

module.exports = TitanUp;

