var TU = require ('/TitanUp/TitanUp');

function UIViewsGalleryViewDemoWindow ()
{
	var _self = Ti.UI.createWindow ({
		title: 'TU.UI.Views.GalleryView',
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var margin = 10;
	var imgw = 240;
	
	var images = [];
	
	for (var i = 0; i < 10; i++)
	{
		var i1 = i + 1;
		
		var img = {
			headline: 'City picture ' + i1 + ' (courtesy of lorempixel.com)',
			renditions: [
       			{
					width: 240,
					height: 180,
					url: 'http://lorempixel.com/240/180/city/' + i1
				},
				{
				    width: 640,
				    height: 480,
				    url: 'http://lorempixel.com/640/480/city/' + i1
				}
			]
		};
		images.push (img);
	}
	
	var contentview = Ti.UI.createView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});
	
	var l, iv;
	
	l = Ti.UI.createLabel ({
		left: margin,
		right: margin,
		top: margin,
		text: "TU.UI.Views.GalleryView is an android/ios image gallery; it is designed to run full-screen.  It can also accept an ad view that is added to the thumbnail view and the full image views.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
	});

	contentview.add (l);
	
	var button = Ti.UI.createButton ({
		width: "50%",
		top: margin,
		title: "Open Gallery"
	});
	
	contentview.add (button);
	
	button.addEventListener ('click', function (e) {
		var win = Ti.UI.createWindow ({
			title: "GalleryView"
		});

		var gv = TU.UI.createGalleryView ({
	        backgroundColor: '#000',
	        borderColor: '#fff',
	        left: 0,
	        right: 0,
	        top: 0,
	        bottom: 0,
	        config: {
                images: images
	        }
	    });
	    
	    win.add (gv);
	    
	    TU.UI.openWindow (win);
	});
	
	_self.add (contentview);
	
	return _self;
}

module.exports = UIViewsGalleryViewDemoWindow;
