var TU = require ('/TitanUp/TitanUp');

function UIDemoView ()
{
	var _self = null;
	var _tv_menu = null;
	
	
	_self = Ti.UI.createView ({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
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
		{ title: "TU.UI.EventThrottle" },
		{ title: "TU.UI.Theme" },
		{ title: "TU.UI.Views" },
		{ title: "TU.UI.OAWindow" }
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
				var UIEventThrottleDemoWindow = require ('/ui/UIEventThrottleDemoWindow');
				win = new UIEventThrottleDemoWindow ();
				break;
				
			case rows[1].title:
				var UIThemeDemoWindow = require ('/ui/UIThemeDemoWindow');
				win = new UIThemeDemoWindow ();
				break;

			case rows[2].title:
				var UIViewsDemoWindow = require ('/ui/UIViewsDemoWindow');
				win = new UIViewsDemoWindow ();
				break;
				
			case rows[3].title:
			    var UIViewsOAWindowDemoWindow = require ('/ui/UIViewsOAWindowDemoWindow');
			    win = new UIViewsOAWindowDemoWindow ();
			    break;
		}
		
		TU.UI.openWindow (win);
	});
	
	_self.add (_tv_menu);
	
	return _self;
}

module.exports = UIDemoView;
