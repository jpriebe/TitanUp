var TU = require ('/TitanUp/TitanUp');

function UIViewsManagedMapViewDemoWindow (mapindex)
{
	var _self = Ti.UI.createWindow ({
		title: 'TU.UI.Views.ManagedMapView',
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	
	var _annData = [
		{ 
			title: "New York, NY",
			latitude: 40.714353,
			longitude: -74.005973
		},
		{ 
			title: "Chicago, IL",
			latitude: 41.878114,
			longitude: -87.629798
		},
		{ 
			title: "St. Louis, MO",
			latitude: 38.627002,
			longitude: -90.199404
		},
		{ 
			title: "Raleigh, NC",
			latitude: 35.772096,
			longitude: -78.638614
		}
	];
	
	if (typeof mapindex !== 'undefined')
	{
		_annData = [ _annData[mapindex] ];
	}
	
	var margin = TU.UI.Sizer.getDimension (10);
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		borderRadius: margin,
		borderColor: TU.UI.Theme.textColor,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});
	
	var l, iv;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "TU.UI.Views.ManagedMapView provides a clean and easy way to attach MapViews to multiple views in a way that is safe for both iOS and android.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.small
	});

	contentview.add (l);
	
	var contentview2 = Ti.UI.createView ({
		top: margin,
		height: Ti.UI.FILL
	});
	
	// no parameters passed to the managed map view -- it's really not "yours"; you'll have to set
	// some properties after creation...	
	var mapview = TU.UI.createManagedMapView ();
	
	// here's where we set the parameters...
	mapview.setTop (0);
	mapview.setBottom (0);
	
	var annotations = [];
	var latTotal = 0;
	var lonTotal = 0;
	var latMax = -999;
	var latMin = 999;
	var lonMax = -999;
	var lonMin = 999;
	for (var i = 0; i < _annData.length; i++)
	{
		latTotal += _annData[i].latitude;
		lonTotal += _annData[i].longitude;
		
		if (_annData[i].latitude > latMax)
		{
			latMax = _annData[i].latitude;
		}
		if (_annData[i].latitude < latMin)
		{
			latMin = _annData[i].latitude;
		}
		if (_annData[i].longitude > lonMax)
		{
			lonMax = _annData[i].longitude;
		}
		if (_annData[i].longitude < lonMin)
		{
			lonMin = _annData[i].longitude;
		}
		
		a = Ti.Map.createAnnotation(_annData[i]);
		a.idx = i;
		annotations.push (a);
	}
	
	var latAvg = latTotal / _annData.length;
	var lonAvg = lonTotal / _annData.length;
	
	var latDelta = (latAvg - latMin > latMax - latAvg)
					? (latAvg - latMin)
					: (latMax - latAvg);
	var lonDelta = (lonAvg - lonMin > lonMax - lonAvg)
					? (lonAvg - lonMin)
					: (lonMax - lonAvg);
					
	if (latDelta < 0.5)
	{
		latDelta = 0.5;
	}
	if (lonDelta < 0.5)
	{
		lonDelta = 0.5;
	}
	
    var region = {
            latitude: latAvg,
            longitude: lonAvg,
            latitudeDelta: latDelta * 2.2,
            longitudeDelta: lonDelta * 2.2
    };
	
	var addedCallback = function ()
	{
		mapview.setLocation (region);
		mapview.removeAllAnnotations ();
		mapview.addAnnotations (annotations);
		mapview.show ();
	}
	
	var clickCallback = function (e)
	{
		var win = new UIViewsManagedMapViewDemoWindow (e.annotation.idx);
		TU.UI.TGWM.openWindow (win);
		
		win.addEventListener ('close', function (e) {
			// this complexity is here because we're going to return to our map after opening and closing another window
			// that contains the map.  If you only ever have one window open at a time with a map, you don't need to worry
			// about this sort of thing...
			mapview.addToView (contentview2, clickCallback);
			addedCallback ();
		});
	}
		
	mapview.manage (contentview2, _self, clickCallback, addedCallback);
	
	contentview.add (contentview2);
		
	_self.add (contentview);
	
	return _self;
}


module.exports = UIViewsManagedMapViewDemoWindow;

