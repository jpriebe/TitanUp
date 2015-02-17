function UIViewsTextFieldDemoWindow ()
{
    var _self = null;

    _self = Ti.UI.createWindow ({
        title: 'TU.UI.Views.TextField',
        backgroundColor: TU.UI.Theme.lightBackgroundColor
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
        text: "TU.UI.Views.TextField is a text field that respects padding on android.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    contentview.add (l);

    var tf = TU.UI.createTextField ({
        top: margin,
        left: margin,
        right: margin,
        height: 40,
        paddingLeft: margin,
        paddingRight: margin,
        backgroundColor: TU.UI.Theme.mediumBackgroundColor,
        color: TU.UI.Theme.darkTextColor,
        hintText: "note the padding"
    });
    
    if (typeof tf.wrapper !== 'undefined')
    {
        contentview.add (tf.wrapper);        
    }
    else
    {
        contentview.add (tf);
    }
    
    _self.add (contentview);
    
    return _self;
}

module.exports = UIViewsTextFieldDemoWindow;
