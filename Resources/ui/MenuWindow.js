var TU = require ('/TitanUp/TitanUp');

function MenuWindow ()
{
	var _self = null;
	var _tv_menu = null;
	var _l_version = null;

	_self = Ti.UI.createWindow ({
		title: 'TitanUp',
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	var rowh = TU.UI.Sizer.getDimension (40);

    _l_version = Ti.UI.createLabel ({
        top: margin,
        left: margin,
        right: margin,
        height: margin * 2,
        text: 'TitanUp version: ' + TU.getVersion ()
    });

    _self.add (_l_version);
	
	_tv_menu = Ti.UI.createTableView ({
		top: margin * 4,
		left: margin,
		right: margin,
		bottom: margin,
		borderRadius: margin,
		borderColor: TU.UI.Theme.textColor,
		backgroundColor: TU.UI.Theme.lightBackgroundColor
	});
	
	var rows = [
		{ title: "TU.Device" },
		{ title: "TU.Globals" },
		{ title: "TU.LocationManager" },
		{ title: "TU.UI" }
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
				var DeviceDemoWindow = require ('/ui/DeviceDemoWindow');
				win = new DeviceDemoWindow ();
				break;

			case rows[1].title:
				var GlobalsDemoWindow = require ('/ui/GlobalsDemoWindow');
				win = new GlobalsDemoWindow ();
				break;

			case rows[2].title:
				var LocationDemoWindow = require ('/ui/LocationDemoWindow');
				win = new LocationDemoWindow ();
				break;

			case rows[3].title:
				var UIDemoWindow = require ('/ui/UIDemoWindow');
				win = new UIDemoWindow ();
				break;
		}
		
		TU.UI.TGWM.openWindow (win);
	});
	
	_self.add (_tv_menu);
	
	// here's how we get the working width, height (sans tabs)
	var onpostlayout = function (e) {
		var vw = _self.size.width;
        var vh = _self.size.height;

		if (vw == 0)
		{
			return;
		}
		
		_self.removeEventListener ('postlayout', onpostlayout);
		
		TU.Device.setWorkingDimensions (vw, vh);
	};
	
	_self.addEventListener ('postlayout', onpostlayout);
	
	return _self;
}

module.exports = MenuWindow;
