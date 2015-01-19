var TU = require ('/TitanUp/TitanUp');

function UIViewsDemoWindow ()
{
	var _self = null;
	var _tv_menu = null;
	
	
	_self = Ti.UI.createWindow ({
		title: 'TU.UI.Views',
		backgroundColor: TU.UI.Theme.lightBackgroundColor	
	});
	
	var margin = 10;
	var rowh = 60;
	
	_tv_menu = Ti.UI.createTableView ({
		top: margin,
		left: margin,
		right: margin,
		bottom: margin,
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var rows = [
		{ title: "TU.UI.GalleryView" },
		{ title: "TU.UI.SelectBar" },
		{ title: "TU.UI.SimplePicker" },
        { title: "TU.UI.ViewPager" },
        { title: "TU.UI.ModalView" },
        { title: "TU.UI.TextField" },
        { title: "TU.UI.RemoteImageView" }
	];
	
	for (var i = 0; i < rows.length; i++)
	{
		rows[i].height = rowh;
		rows[i].color = TU.UI.Theme.darkTextColor;
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
				var UIViewsSelectBarDemoWindow = require ('/ui/UIViewsSelectBarDemoWindow');
				win = new UIViewsSelectBarDemoWindow ();
				break;
				
			case rows[2].title:
				var UIViewsSimplePickerDemoWindow = require ('/ui/UIViewsSimplePickerDemoWindow');
				win = new UIViewsSimplePickerDemoWindow ();
				break;

            case rows[3].title:
                var UIViewsViewPagerDemoWindow = require ('/ui/UIViewsViewPagerDemoWindow');
                win = new UIViewsViewPagerDemoWindow ();
                break;

            case rows[4].title:
                var UIViewsModalViewDemoWindow = require ('/ui/UIViewsModalViewDemoWindow');
                win = new UIViewsModalViewDemoWindow ();
                break;

            case rows[5].title:
                var UIViewsTextFieldDemoWindow = require ('/ui/UIViewsTextFieldDemoWindow');
                win = new UIViewsTextFieldDemoWindow ();
                break;

            case rows[6].title:
                var UIViewsRemoteImageViewDemoWindow = require ('/ui/UIViewsRemoteImageViewDemoWindow');
                win = new UIViewsRemoteImageViewDemoWindow ();
                break;
		}
		
		TU.UI.openWindow (win);
	});
	
	_self.add (_tv_menu);
	
	return _self;
}

module.exports = UIViewsDemoWindow;
