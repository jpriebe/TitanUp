var TU = require ('/TitanUp/TitanUp');

function DeviceDemoWindow ()
{
	var _self = null;

	_self = Ti.UI.createWindow ({
		title: 'TU.Device',
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
		layout: 'vertical'
	});

	var spacing = TU.UI.Sizer.getDimension (5);
	var labelw = '95%';
    var labelh = TU.UI.Sizer.getDimension (25);
    var tabstop = TU.UI.Sizer.getDimension (170);
	var v, l;

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'OS:',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: TU.Device.getOS (),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);    

    var wpx, hpx, wdip, hdip;
    if (TU.Device.getNativeUnit() == 'px')
    {
        wpx = TU.Device.getDisplayWidth ();
        hpx = TU.Device.getDisplayHeight ();
        
        wdip = parseInt (wpx / TU.Device.getLogicalDensityFactor ());
        hdip = parseInt (hpx / TU.Device.getLogicalDensityFactor ());
    }
    else
    {
        wdip = TU.Device.getDisplayWidth ();
        hdip = TU.Device.getDisplayHeight ();
        
        wpx = parseInt (wdip * TU.Device.getLogicalDensityFactor ());
        hpx = parseInt (hdip * TU.Device.getLogicalDensityFactor ());
    }

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Display w x h (px):',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: wpx + ' x ' + hpx,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Display w x h (dip):',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: wdip + ' x ' + hdip,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
    
    if (TU.Device.getNativeUnit() == 'px')
    {
        wpx = TU.Device.getWorkingWidth ();
        hpx = TU.Device.getWorkingHeight ();
        
        wdip = parseInt (wpx / TU.Device.getLogicalDensityFactor ());
        hdip = parseInt (hpx / TU.Device.getLogicalDensityFactor ());
    }
    else
    {
        wdip = TU.Device.getWorkingWidth ();
        hdip = TU.Device.getWorkingHeight ();
        
        wpx = parseInt (wdip * TU.Device.getLogicalDensityFactor ());
        hpx = parseInt (hdip * TU.Device.getLogicalDensityFactor ());
    }

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Working w x h (px):',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: wpx + ' x ' + hpx,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Working w x h (dip):',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: wdip + ' x ' + hdip,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Density',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: TU.Device.getDensity (),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'DPI:',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: TU.Device.getDpi (),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Physical w x h (in):',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: TU.Device.getPhysicalWidth ().toFixed (2) + ' x ' + TU.Device.getPhysicalHeight ().toFixed (2),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);    
        
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Screensize (in):',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: TU.Device.getScreensize ().toFixed (2),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Is tablet:',
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: TU.Device.getIsTablet () ? 'yes' : 'no',
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.textColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _self.add (v);
   	
	return _self;
}

module.exports = DeviceDemoWindow;
