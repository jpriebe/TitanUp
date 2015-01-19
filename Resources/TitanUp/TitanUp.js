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

