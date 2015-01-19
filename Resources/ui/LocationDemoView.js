var moment = require ('/util/moment');
var TU = require ('/TitanUp/TitanUp');
var Map = require('ti.map');

function LocationDemoView ()
{
	var _lm = null;
	
	var _self = Ti.UI.createView ({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var margin = 10;
	var imgw = 240;
	var y = 5;
	var labelh = 25;
	var tabstop = 90;

	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});
	
	var l, iv;
	var v;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "LocationManager uses ios/android best practices for reading location and managing battery.  If this is not working, make sure you've entered your Google Maps API key into tiapp.xml.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
	});

	contentview.add (l);

	v = Ti.UI.createView ({
		left: margin,
		right: margin,
		height: labelh,
		top: margin
	});
	
	l = Ti.UI.createLabel ({
		text: 'Lat,Lon:',
		color: TU.UI.Theme.darkTextColor,
		font: TU.UI.Theme.fonts.mediumBold,
		top: 0,
		left: 0
	});
	
	v.add (l);
			
	var _l_lat_lon = Ti.UI.createLabel ({
		text: '',
		top: 0,
		left: tabstop,
		right: 0,
		color: TU.UI.Theme.darkTextColor,
		font: TU.UI.Theme.fonts.medium
	});
	
	v.add (_l_lat_lon);
	
	contentview.add (v);
	
	y += TU.UI.Sizer.getDimension (30);
		
	v = Ti.UI.createView ({
		left: margin,
		right: margin,		
		height: labelh,
		top: 0
	});
	
	l = Ti.UI.createLabel ({
		text: 'Time:',
		color: TU.UI.Theme.darkTextColor,
		font: TU.UI.Theme.fonts.mediumBold,
		top: 0,
		left: 0
	});
	
	v.add (l);
		
	
	_l_timestamp = Ti.UI.createLabel ({
		text: '',
		top: 0,
		left: tabstop,
		right: 0,
		color: TU.UI.Theme.darkTextColor,
		font: TU.UI.Theme.fonts.medium
	});
	
	v.add (_l_timestamp);

	contentview.add (v);
	
	v = Ti.UI.createView ({
		left: margin,
		right: margin,
		height: labelh,
		top: 0,
	});
	
	l = Ti.UI.createLabel ({
		text: 'Accuracy:',
		color: TU.UI.Theme.darkTextColor,
		font: TU.UI.Theme.fonts.mediumBold,
		top: 0,
		left: 0
	});
	
	v.add (l);
	
	_l_accuracy = Ti.UI.createLabel ({
		text: '',
		top: 0,
		left: tabstop,
		right: 0,
		color: TU.UI.Theme.darkTextColor,
		font: TU.UI.Theme.fonts.medium
	});
	
	v.add (_l_accuracy);
	
	contentview.add (v);
	
    var _mv_location = Map.createView({
        top: margin,
        left: 0,
        right: 0,
        bottom: 0,
        mapType: Map.NORMAL_TYPE,
        userLocation:true
    });
    
    contentview.add (_mv_location);

	_mv_location.show ();

	_self.add (contentview);
	
	var _old_coords = null;
	
	function update ()
	{
		var _coords = _lm.getCoords ();
		
		if (_old_coords != null)
		{
			if ((_coords.latitude == _old_coords.latitude)
				&& (_coords.longitude == _old_coords.longitude)
				&& (_coords.timestamp == _old_coords.timestamp))
				{
					return;
				}
		}
		_old_coords = _coords;
		
		var lat = 'n/a';
		if (_coords)
		{
			lat = '' + _coords.latitude.toFixed (5) + ', ' + _coords.longitude.toFixed (5);
		}
		
		_l_lat_lon.text = lat;

		var timestr = 'n/a';
		if (_coords)
		{
			timestr = moment(_coords.timestamp).format ('YYYY-MM-DD HH:mm:ss	');
		}
		
		_l_timestamp.text = timestr;		
		
		var accuracy = 'n/a';
		if (_coords)
		{
			accuracy = '' + parseInt (_coords.accuracy) + ' meters';
		}
		
		_l_accuracy.text = accuracy;
		
		var annotations = [];
		var region = {
		    	latitude: 35.7795,
		    	longitude: -78.6389, 
		        latitudeDelta: 0.01, 
		        longitudeDelta: 0.01
		   };
		
		if (_coords)
		{
			region.latitude = _coords.latitude;
			region.longitude = _coords.longitude;
			
			var a = Map.createAnnotation({
				latitude: _coords.latitude,
				longitude: _coords.longitude,
				title: "My Location",
				animate: true,
				pincolor: Map.ANNOTATION_GREEN,
			});
			
			annotations.push (a);
		}
		
		_mv_location.setLocation (region);
		_mv_location.removeAllAnnotations ();
		_mv_location.addAnnotations (annotations);
	
	}
	
	_lm = TU.getLocationManager ();
	
	var _interval = setInterval (update, 5000);

	_self.addEventListener ('close', function (e) {
		clearInterval (_interval);
	});
	
	return _self;
}

module.exports = LocationDemoView;
