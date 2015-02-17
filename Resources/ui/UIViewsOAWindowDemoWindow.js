function UIViewsOAWindowDemoWindow ()
{
    var _self = null;

    _self = Ti.UI.createWindow ({
        title: 'TU.UI.OAWindow',
        backgroundColor: TU.UI.Theme.lightBackgroundColor,
        orientationModes: [ Ti.UI.PORTRAIT ]
    });
    
    var margin = 10;
    
    var contentview = Ti.UI.createView ({
        top: margin,
        left: margin,
        right: margin,
        bottom: margin,
        backgroundColor: TU.UI.Theme.lightBackgroundColor,
        layout: 'vertical'
    });
    
    var l = Ti.UI.createLabel ({
        left: margin,
        right: margin,
        top: margin,
        text: "TU.UI.OAWindow is a window that is aware of orientation changes.  "
            + "You can listen for its 'onorientationchange' event without worrying about memory leaks.  "
            + "It filters out the faceup/facedown orientation changes.  "
            + "You can optionally hide the navbar in landscape view, and you can specify a layout callback "
            + "that will get called after the window is properly oriented, laid out, and sized, simplifying your UI code.\n\n"
            + "Note that this demo window is locked into portrait, but it is opening windows that support portrait and landscape.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    contentview.add (l);

    function onlayout (w)
    {
        w.removeAllChildren ();
    
        var msg = "window dimensions: " + w.rect.width + " x " + w.rect.height;
        
        var l = Ti.UI.createLabel ({
            color: '#000',
            text: msg
        });
        
        w.add (l);
    }
    
    var b1 = Ti.UI.createButton ({
        title: 'portrait only',
        top: margin,
        height: 48,
        left: margin,
        right: margin
    });
    
    b1.addEventListener ('click', function (e) {
        var w = TU.UI.createOAWindow ({
            backgroundColor: '#99f',
            orientationModes: [ Ti.UI.PORTRAIT ],
            config: {
                layoutCallback: onlayout
            }
        });
        
        TU.UI.openWindow (w);
    });
    
    contentview.add (b1);
    
    var b2 = Ti.UI.createButton ({
        title: 'landscape only',
        top: margin,
        height: 48,
        left: margin,
        right: margin
    });
    
    b2.addEventListener ('click', function (e) {
        var w = TU.UI.createOAWindow ({
            backgroundColor: '#f99',
            orientationModes: [ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ],
            config: {
                layoutCallback: onlayout
            }
        }); 
        
        TU.UI.openWindow (w);
    });
    
    contentview.add (b2);
    
    
    var b3 = Ti.UI.createButton ({
        title: 'all',
        top: margin,
        height: 48,
        left: margin,
        right: margin
    });
    
    b3.addEventListener ('click', function (e) {
        var w = TU.UI.createOAWindow ({
            backgroundColor: '#9f9',
            orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ],
            config: {
                layoutCallback: onlayout
            }
        }); 
        
        TU.UI.openWindow (w);
    });
    
    contentview.add (b3);
    
    var b4 = Ti.UI.createButton ({
        title: 'all (hide navbar in landscape)',
        top: margin,
        height: 48,
        left: margin,
        right: margin
    });
    
    b4.addEventListener ('click', function (e) {
        var w = TU.UI.createOAWindow ({
            backgroundColor: '#9f9',
            orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ],
            config: {
                layoutCallback: onlayout,
                hideNavBarInLandscape: true
            }
        }); 
        
        TU.UI.openWindow (w);
    });
    
    contentview.add (b4);


    _self.add (contentview);
    
    return _self;
}

module.exports = UIViewsOAWindowDemoWindow;
