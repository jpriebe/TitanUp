/**
 * TitanUp library for Titanium Mobile development
 * 
 * Provides a number of very common features:
 *   - OS detection (iOS vs android)
 *   - display dimensions (including working area sans tabs and title bars)
 *   - tablet/nontablet
 *   - TabGroup window management
 *   - a sane place to store global variables if required
 *   - LocationManager; a cross-platform location service that is fairly battery-conservative
 *   - some additional UI controls:
 *      - ImageButton
 *      - SelectBar
 *      - SimplePicker
 *      - ManagedMapView
 *      - GalleryView
 *  
 * To use it, put this in your app.js (in the global scope):
 * 
 * var TU = require ('/TitanUp/TitanUp');
 */

var start = new Date().getTime();

_version = '0.1.0';

function TitanUp ()
{

}

TitanUp.getVersion = function ()
{
    return _version;
}

Ti.API.debug ('[TitanUp] initializing...');

TitanUp.Device = require ('/TitanUp/Device');

TitanUp.UI = require ('/TitanUp/UI/UI');
TitanUp.UI.TUInit (TitanUp);

TitanUp.LocationManager = require ('/TitanUp/LocationManager');
TitanUp.LocationManager.TUInit (TitanUp);

TitanUp.Globals = {};

var elapsed = new Date().getTime() - start;
Ti.API.debug ("[TitanUp] load time: " + elapsed + " ms");

module.exports = TitanUp;

