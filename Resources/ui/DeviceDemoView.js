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
	
	var captions = [];
	var values = [];
	
	captions.push ('OS');
	values.push (TU.Device.getOS ());
	
	if (TU.Device.getOS () === 'android')
	{
		captions.push ('Is Android 4+');
		values.push (TU.Device.getAndroid4Plus () ? 'yes' : 'no');

		captions.push ('Is Android 5+');
		values.push (TU.Device.getAndroid5Plus () ? 'yes' : 'no');

		captions.push ('Has Google Play Services');
		values.push (TU.Device.getHasGooglePlayServices () ? 'yes' : 'no');
	}
	else	
	{
		captions.push ('iPhone Level');
		values.push (TU.Device.getIphoneLevel ());

		captions.push ('iPad Level');
		values.push (TU.Device.getIpadLevel ());

		captions.push ('Is iOS 7+');
		values.push (TU.Device.getiOS7Plus () ? 'yes' : 'no');
	}

	captions.push ('Model');
	values.push (TU.Device.getModel ());

	captions.push ('Native Unit');
	values.push (TU.Device.getNativeUnit ());
	
	captions.push ('Default Unit');
	values.push (TU.Device.getDefaultUnit ());
	
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

	captions.push ('Display w x h (px)');
	values.push (wpx + ' x ' + hpx);

	captions.push ('Display w x h (dp)');
	values.push (wdp + ' x ' + hdp);
	
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

	captions.push ('Working w x h (px)');
	values.push (wpx + ' x ' + hpx);

	captions.push ('Working w x h (dp)');
	values.push (wdp + ' x ' + hdp);
	
	captions.push ('Density');
	values.push (TU.Device.getDensity ());

	captions.push ('Logical Density Factor');
	values.push (TU.Device.getLogicalDensityFactor ());

	captions.push ('DPI');
	values.push (TU.Device.getDpi ());

	captions.push ('Physical w x h (in)');
	values.push (TU.Device.getPhysicalWidth ().toFixed (2) + ' x ' + TU.Device.getPhysicalHeight ().toFixed (2));

	captions.push ('Screensize (in)');
	values.push (TU.Device.getScreensize ().toFixed (2));

	captions.push ('Is Tablet');
	values.push (TU.Device.getIsTablet () ? 'yes' : 'no');

	for (var i = 0; i < captions.length; i++)
	{
	    v = Ti.UI.createView ({
	        width: labelw,
	        height: labelh,
	        top: spacing
	    });
	
	    l = Ti.UI.createLabel ({
	        text: captions[i] + ':',
	        color: TU.UI.Theme.darkTextColor,
	        font: TU.UI.Theme.fonts.mediumBold,
	        top: 0,
	        left: 0
	    });
	
	    v.add (l);
	    
	    l = Ti.UI.createLabel ({
	        text: values[i],
	        top: 0,
	        left: tabstop,
	        right: 0,
	        color: TU.UI.Theme.darkTextColor,
	        font: TU.UI.Theme.fonts.medium
	    });
	    
	    v.add (l);
	    
	    _sv.add (v);
	}

 	return _self;
}

module.exports = DeviceDemoView;
