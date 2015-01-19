var TU = require ('/TitanUp/TitanUp');

function DeviceDemoView ()
{
	var _self = null;

	_self = Ti.UI.createView ({
	    top: 0,
	    left: 0,
	    right: 0,
	    bottom: 0,
		backgroundColor: TU.UI.Theme.lightBackgroundColor,
	});

    var _sv = Ti.UI.createScrollView ({
        top: 0,
        bottom: 0,
        contentWidth: 'auto',
        contentHeight: 'auto',
        showVerticalScrollIndicator: true,
        layout: 'vertical'
    });

    _self.add (_sv);

	var spacing = 5;
	var labelw = '95%';
    var labelh = 25;
    var tabstop = 200;
	var v, l;

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'OS:',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    
    l = Ti.UI.createLabel ({
        text: ((TU.Device.getOS() == 'ios') ? 'Is iOS 7+' : 'Is Android 4+'),
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    var value = '';
    if (TU.Device.getOS() == 'ios')
    {
        value = TU.Device.getiOS7Plus () ? 'yes' : 'no';
    }
    else
    {
        value = TU.Device.getAndroid4Plus () ? 'yes' : 'no';
    }
    
    l = Ti.UI.createLabel ({
        text: value,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);


    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Native Unit:',
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);

    l = Ti.UI.createLabel ({
        text: TU.Device.getNativeUnit (),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    v.add (l);

    _sv.add (v);


    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Default Unit:',
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);

    l = Ti.UI.createLabel ({
        text: TU.Device.getDefaultUnit (),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    v.add (l);

    _sv.add (v);

    var wpx, hpx, wdp, hdp;
    if (TU.Device.getDefaultUnit() == 'px')
    {
        wpx = TU.Device.getDisplayWidth ();
        hpx = TU.Device.getDisplayHeight ();
        
        wdp = parseInt (wpx / TU.Device.getLogicalDensityFactor ());
        hdp = parseInt (hpx / TU.Device.getLogicalDensityFactor ());
    }
    else
    {
        wdp = TU.Device.getDisplayWidth ();
        hdp = TU.Device.getDisplayHeight ();
        
        wpx = parseInt (wdp * TU.Device.getLogicalDensityFactor ());
        hpx = parseInt (hdp * TU.Device.getLogicalDensityFactor ());
    }

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Display w x h (px):',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Display w x h (dp):',
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: wdp + ' x ' + hdp,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
    
    if (TU.Device.getDefaultUnit() == 'px')
    {
        wpx = TU.Device.getWorkingWidth ();
        hpx = TU.Device.getWorkingHeight ();
        
        wdp = parseInt (wpx / TU.Device.getLogicalDensityFactor ());
        hdp = parseInt (hpx / TU.Device.getLogicalDensityFactor ());
    }
    else
    {
        wdp = TU.Device.getWorkingWidth ();
        hdp = TU.Device.getWorkingHeight ();
        
        wpx = parseInt (wdp * TU.Device.getLogicalDensityFactor ());
        hpx = parseInt (hdp * TU.Device.getLogicalDensityFactor ());
    }

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Working w x h (px):',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });
    
    l = Ti.UI.createLabel ({
        text: 'Working w x h (dp):',
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);
    
    l = Ti.UI.createLabel ({
        text: wdp + ' x ' + hdp,
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Density:',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Logical Density Factor:',
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.mediumBold,
        top: 0,
        left: 0
    });

    v.add (l);

    l = Ti.UI.createLabel ({
        text: TU.Device.getLogicalDensityFactor (),
        top: 0,
        left: tabstop,
        right: 0,
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    v.add (l);

    _sv.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'DPI:',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);

    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Physical w x h (in):',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
        
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Screensize (in):',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
    
    v = Ti.UI.createView ({
        width: labelw,
        height: labelh,
        top: spacing
    });

    l = Ti.UI.createLabel ({
        text: 'Is tablet:',
        color: TU.UI.Theme.darkTextColor,
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
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });
    
    v.add (l);
    
    _sv.add (v);
    
   	
	return _self;
}

module.exports = DeviceDemoView;
