var TU = require ('/TitanUp/TitanUp');

function UIViewsDemoWindow ()
{
	var _self = null;
	var _tv_menu = null;
	
	
	_self = Ti.UI.createWindow ({
		title: 'TU.UI.Views',
		backgroundColor: TU.UI.Theme.backgroundColor	
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	var rowh = TU.UI.Sizer.getDimension (40);
	
	_tv_menu = Ti.UI.createTableView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		borderRadius: margin,
		borderColor: TU.UI.Theme.textColor,
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var rows = [
		{ title: "TU.UI.GalleryView" },
		{ title: "TU.UI.ManagedMapView"  },
		{ title: "TU.UI.SelectBar" },
		{ title: "TU.UI.SimplePicker" }
	];
	
	for (var i = 0; i < rows.length; i++)
	{
		rows[i].height = rowh;
		rows[i].color = TU.UI.Theme.textColor;
		rows[i].backgroundColor = TU.UI.Theme.lightBackgroundColor;
		rows[i].selectedBackgroundColor = TU.UI.Theme.highlightColor;
	}
	
	_tv_menu.setData (rows);
	
	_tv_menu.addEventListener ('click', function (e) {
		var win = null;
		switch (e.row.title)
		{
			case rows[0].title:
				var UIViewsGalleryViewDemoWindow = require ('/ui/UIViewsGalleryViewDemoWindow');
				win = new UIViewsGalleryViewDemoWindow ();
				break;
				
			case rows[1].title:
				var UIViewsManagedMapViewDemoWindow = require ('/ui/UIViewsManagedMapViewDemoWindow');
				win = new UIViewsManagedMapViewDemoWindow ();
				break;
				
			case rows[2].title:
				var UIViewsSelectBarDemoWindow = require ('/ui/UIViewsSelectBarDemoWindow');
				win = new UIViewsSelectBarDemoWindow ();
				break;
				
			case rows[3].title:
				var UIViewsSimplePickerDemoWindow = require ('/ui/UIViewsSimplePickerDemoWindow');
				win = new UIViewsSimplePickerDemoWindow ();
				break;

			case rows[4].title:
				var UIViewsDemoWindow = require ('/ui/UIViewsDemoWindow');
				win = new UIViewsDemoWindow ();
				break;
		}
		
		TU.UI.TGWM.openWindow (win);
	});
	
	_self.add (_tv_menu);
	
	return _self;
}

module.exports = UIViewsDemoWindow;
