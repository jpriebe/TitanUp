var TU = require ('/TitanUp/TitanUp');


function UISizerDemoWindow ()
{
	var _self = null;
	
	_self = Ti.UI.createWindow ({
		title: 'TU.UI.Sizer',
		backgroundColor: TU.UI.Theme.backgroundColor	
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	var imgw = TU.UI.Sizer.getDimension (240);
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		borderRadius: margin,
		borderColor: TU.UI.Theme.textColor,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
	});
	
	var sv = Ti.UI.createScrollView ({
        layout: 'vertical',
	    top: margin,
	    left: margin,
	    right: margin,
	    bottom: margin
	})
	
	var l, iv;
	
	l = Ti.UI.createLabel ({
		left: 0,
		right: 0,
		top: 0,
		text: "TU.UI.Sizer converts dimensions into density-specific values; it preserves platform-specific units (dp on iOS, px on Android).  It can help you build apps that scale proportionally across different resolutions.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.small
	});

	sv.add (l);
	
    l = Ti.UI.createLabel ({
        left: 0,
        right: 0,
        top: margin,
        text: "The grid.png image is added to the project at 4 sizes: 180x180, 240x240, 360x360, and 480x480.  The runtime will select the best one based on the screen density.  TU.Sizer will allow the app to set the imageview to the right dimension to match the image.  The net result is that the overall grid should be about the same size on all platforms, while the spacing will be smaller on higher density devices.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.small
    });

    sv.add (l);

	iv = Ti.UI.createImageView ({
		height: imgw,
		width: imgw,
		top: margin,
		image: "/images/grid.png"
	});
	
	sv.add (iv);
		
	contentview.add (sv);
	_self.add (contentview);
	
	return _self;
}

module.exports = UISizerDemoWindow;
