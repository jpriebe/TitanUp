var TU = require ('/TitanUp/TitanUp');

function UIViewsGalleryViewDemoWindow ()
{
	var _self = Ti.UI.createWindow ({
		title: 'TU.UI.Views.GalleryView',
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	var imgw = TU.UI.Sizer.getDimension (240);
	
	var images = [
		{
   			headline: 'Barack Obama at UNC-CH',
 			renditions: [
       			{
					width: 120,
					height: 90,
					url: 'http://wwwcache.wral.com/asset/news/local/2012/04/25/11020841/11020841-1335347760-120x90.jpg'
				},
				{
				    width: 640,
				    height: 480,
				    url: 'http://wwwcache.wral.com/asset/news/local/2012/04/25/11020841/11020841-1335347760-640x480.jpg'
				}
			]
		},
		{
   			headline: 'Tar Heel Nation',
 			renditions: [
       			{
					width: 120,
					height: 90,
					url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2012/02/29/10796821/10796821-1330708109-120x90.jpg'
				},
				{
				    width: 640,
				    height: 480,
				    url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2012/02/29/10796821/10796821-1330708109-640x480.jpg'
				}
			]
		},
		{
   			headline: 'Tyler Hansbrough Dunk',
 			renditions: [
       			{
					width: 180,
					height: 135,
					url: 'http://wwwcache.wralsportsfan.com/asset/2008/03/24/2619315/2619315-1206366712-180x135.jpg'
				},
				{
				    width: 645,
				    height: 483,
				    url: 'http://wwwcache.wralsportsfan.com/asset/2008/03/24/2619315/2619315-1206366712-645x483.jpg'
				}
			]
		},
		{
   			headline: 'Harrison Barnes',
 			renditions: [
       			{
					width: 78,
					height: 135,
					url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2012/03/09/10836365/_jtr4701-78x135.jpg'
				},
				{
				    width: 262,
				    height: 450,
				    url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2012/03/09/10836365/_jtr4701-262x450.jpg'
				}
			]
		},
		{
   			headline: 'John Henson Dunk',
 			renditions: [
       			{
					width: 120,
					height: 90,
					url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2011/03/20/9299190/9299190-1302121528-120x90.jpg'
				},
				{
				    width: 640,
				    height: 480,
				    url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2011/03/20/9299190/9299190-1302121528-640x480.jpg'
				}
			]
		},
		{
   			headline: 'Ty Lawson',
 			renditions: [
       			{
					width: 120,
					height: 90,
					url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2009/03/21/4788622/4788622-1245789984-120x90.jpg'
				},
				{
				    width: 640,
				    height: 480,
				    url: 'http://wwwcache.wralsportsfan.com/asset/colleges/unc/2009/03/21/4788622/4788622-1245789984-640x480.jpg'
				}
			]
		}
	];
	
	// repeat the images to show a nice full gallery...
	var newimages = [];
	for (var i = 0; i < 10; i++)
	{
		for (var j = 0; j < images.length; j++)
		{
			newimages.push (images[j]);
		}
	}
	images = newimages;
	
	
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
		text: "TU.UI.Views.GalleryView is an android/ios image gallery; it is designed to run full-screen.  It can also accept an ad view that is added to the thumbnail view and the full image views.",
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.small
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
	        images: images,
	        backgroundColor: '#000',
	        borderColor: '#fff',
	        left: 0,
	        right: 0,
	        top: 0,
	        bottom: 0
	    });
	    
	    win.add (gv);
	    
	    TU.UI.TGWM.openWindow (win);
	});
	
	_self.add (contentview);
	
	return _self;
}

module.exports = UIViewsGalleryViewDemoWindow;
