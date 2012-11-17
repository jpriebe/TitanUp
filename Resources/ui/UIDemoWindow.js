var TU = require ('/TitanUp/TitanUp');

function UIDemoWindow ()
{
	var _self = null;
	var _tv_menu = null;
	
	
	_self = Ti.UI.createWindow ({
		title: 'TU.UI',
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
		{ title: "TU.UI.EventThrottle" },
		{ title: "TU.UI.Sizer"  },
		{ title: "TU.UI.TGWM" },
		{ title: "TU.UI.Theme" },
		{ title: "TU.UI.Views" }
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
				var UIEventThrottleDemoWindow = require ('/ui/UIEventThrottleDemoWindow');
				win = new UIEventThrottleDemoWindow ();
				break;
				
			case rows[1].title:
				var UISizerDemoWindow = require ('/ui/UISizerDemoWindow');
				win = new UISizerDemoWindow ();
				break;
				
			case rows[2].title:
				var UITGWMDemoWindow = require ('/ui/UITGWMDemoWindow');
				win = new UITGWMDemoWindow ();
				break;
				
			case rows[3].title:
				var UIThemeDemoWindow = require ('/ui/UIThemeDemoWindow');
				win = new UIThemeDemoWindow ();
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

module.exports = UIDemoWindow;
